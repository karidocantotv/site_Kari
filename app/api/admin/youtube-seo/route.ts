import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateSeoProposal, getTranscript, listChannelVideos, refreshAccessToken, updateYoutubeVideo } from '@/lib/youtube-seo-agent';

const GOOGLE_AUTH = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN = 'https://oauth2.googleapis.com/token';
const YOUTUBE_SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase server não configurado.');
  return createClient(url, key, { auth: { persistSession: false } });
}

async function requireAdmin(request: Request) {
  const auth = request.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : '';
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!token || !url || !anon) throw new Error('Não autorizado.');
  const supabase = createClient(url, anon);
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) throw new Error('Não autorizado.');
  return user;
}

async function getStoredToken() {
  const { data, error } = await db().from('youtube_oauth_tokens').select('*').eq('provider', 'youtube').order('updated_at', { ascending: false }).limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('YouTube ainda não está conectado.');
  return data;
}

async function freshToken() {
  const stored = await getStoredToken();
  const accessToken = await refreshAccessToken(stored.refresh_token);
  return { stored, accessToken };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action') || 'status';
  try {
    if (action === 'oauth-callback') {
      const state = url.searchParams.get('state');
      const code = url.searchParams.get('code');
      const cookieState = request.headers.get('cookie')?.match(/youtube_oauth_state=([^;]+)/)?.[1];
      if (!state || !code || !cookieState || state !== cookieState) return NextResponse.json({ error: 'OAuth inválido.' }, { status: 400 });
      const clientId = process.env.YOUTUBE_CLIENT_ID;
      const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
      const redirectUri = process.env.YOUTUBE_OAUTH_REDIRECT_URI || `${url.origin}/api/admin/youtube-seo?action=oauth-callback`;
      if (!clientId || !clientSecret) return NextResponse.json({ error: 'Credenciais do Google não configuradas.' }, { status: 503 });
      const tokenResponse = await fetch(GOOGLE_TOKEN, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' }) });
      const tokenJson = await tokenResponse.json();
      if (!tokenResponse.ok || !tokenJson.refresh_token) return NextResponse.json({ error: tokenJson.error_description || 'Google não retornou refresh token.' }, { status: 400 });
      const { resolveChannelId } = await import('@/lib/youtube-seo-agent');
      const channel = await resolveChannelId(tokenJson.access_token);
      const { error } = await db().from('youtube_oauth_tokens').upsert({ provider: 'youtube', channel_id: channel.id, channel_title: channel.title, refresh_token: tokenJson.refresh_token, scope: tokenJson.scope || YOUTUBE_SCOPE, updated_at: new Date().toISOString() }, { onConflict: 'provider,channel_id' });
      if (error) throw new Error(error.message);
      const response = NextResponse.redirect(new URL('/admin/youtube-seo?connected=1', url.origin));
      response.cookies.set('youtube_oauth_state', '', { maxAge: 0, path: '/' });
      return response;
    }

    await requireAdmin(request);
    if (action === 'connect') {
      const clientId = process.env.YOUTUBE_CLIENT_ID;
      if (!clientId) return NextResponse.json({ error: 'YOUTUBE_CLIENT_ID não configurado.' }, { status: 503 });
      const state = crypto.randomUUID();
      const redirectUri = process.env.YOUTUBE_OAUTH_REDIRECT_URI || `${url.origin}/api/admin/youtube-seo?action=oauth-callback`;
      const authUrl = new URL(GOOGLE_AUTH);
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', YOUTUBE_SCOPE);
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      authUrl.searchParams.set('state', state);
      const response = NextResponse.json({ authUrl: authUrl.toString() });
      response.cookies.set('youtube_oauth_state', state, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 600, path: '/' });
      return response;
    }
    if (action === 'status') {
      const stored = await getStoredToken().catch(() => null);
      return NextResponse.json({ connected: Boolean(stored), channel: stored ? { id: stored.channel_id, title: stored.channel_title } : null });
    }
    if (action === 'videos') {
      const limit = Math.max(1, Math.min(50, Number(url.searchParams.get('limit') || 10)));
      const { accessToken, stored } = await freshToken();
      const result = await listChannelVideos(accessToken, limit);
      return NextResponse.json({ ...result, connectedChannel: stored.channel_title });
    }
    return NextResponse.json({ error: 'Ação desconhecida.' }, { status: 400 });
  } catch (error: any) {
    const message = error?.message || 'Erro interno.';
    return NextResponse.json({ error: message }, { status: message === 'Não autorizado.' ? 401 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const action = body.action;
    const { accessToken } = await freshToken();
    if (action === 'analyze') {
      const videosResponse = await listChannelVideos(accessToken, Math.max(1, Math.min(50, Number(body.limit || 5))));
      const selectedIds = Array.isArray(body.videoIds) && body.videoIds.length ? body.videoIds : videosResponse.videos.slice(0, 5).map((v) => v.id);
      const selected = videosResponse.videos.filter((v) => selectedIds.includes(v.id));
      const proposals = [];
      for (const video of selected) {
        let transcript: string | null = null;
        if (body.includeTranscript) transcript = await getTranscript(accessToken, video.id).catch(() => null);
        const proposal = await generateSeoProposal(video, transcript);
        const { data: saved, error } = await db().from('youtube_seo_proposals').upsert({ video_id: video.id, current_title: video.snippet.title, current_description: video.snippet.description || '', current_tags: video.snippet.tags || [], current_category_id: video.snippet.categoryId, transcript_used: Boolean(transcript), source_text: transcript ? transcript.slice(0, 30000) : null, proposal, status: 'pending', updated_at: new Date().toISOString() }, { onConflict: 'video_id' }).select('id').single();
        if (error) throw new Error(error.message);
        proposals.push({ id: saved.id, video, proposal, transcriptUsed: Boolean(transcript) });
      }
      return NextResponse.json({ proposals });
    }
    if (action === 'publish') {
      const proposalId = String(body.proposalId || '');
      if (!proposalId) return NextResponse.json({ error: 'proposalId obrigatório.' }, { status: 400 });
      const { data, error } = await db().from('youtube_seo_proposals').select('*').eq('id', proposalId).single();
      if (error || !data) return NextResponse.json({ error: 'Proposta não encontrada.' }, { status: 404 });
      const videosResponse = await listChannelVideos(accessToken, 50);
      const video = videosResponse.videos.find((v) => v.id === data.video_id);
      if (!video) return NextResponse.json({ error: 'Vídeo não encontrado no canal.' }, { status: 404 });
      await updateYoutubeVideo(accessToken, video, data.proposal);
      const { error: updateError } = await db().from('youtube_seo_proposals').update({ status: 'published', updated_at: new Date().toISOString() }).eq('id', proposalId);
      if (updateError) throw new Error(updateError.message);
      return NextResponse.json({ published: true, videoId: video.id });
    }
    return NextResponse.json({ error: 'Ação desconhecida.' }, { status: 400 });
  } catch (error: any) {
    const message = error?.message || 'Erro interno.';
    return NextResponse.json({ error: message }, { status: message === 'Não autorizado.' ? 401 : 500 });
  }
}