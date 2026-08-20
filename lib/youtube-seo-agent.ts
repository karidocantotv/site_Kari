type YoutubeVideo = {
  id: string;
  snippet: {
    title: string;
    description: string;
    tags?: string[];
    categoryId: string;
    publishedAt: string;
    channelId: string;
  };
  statistics?: { viewCount?: string; likeCount?: string; commentCount?: string };
};

type Proposal = {
  title: string;
  description: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  hashtags: string[];
  tags: string[];
  topic: string;
  intent: string;
  seoScore: number;
  reasons: string[];
};

const YT = 'https://www.googleapis.com/youtube/v3';

async function ytFetch<T>(path: string, token?: string): Promise<T> {
  const response = await fetch(`${YT}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: 'no-store',
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json?.error?.message || 'YouTube API error');
  return json as T;
}

export async function refreshAccessToken(refreshToken: string) {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('YOUTUBE_CLIENT_ID/SECRET não configurados.');
  const body = new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: 'refresh_token' });
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  const json = await response.json();
  if (!response.ok) throw new Error(json?.error_description || 'Não foi possível renovar o token do YouTube.');
  return json.access_token as string;
}

export async function resolveChannelId(token: string) {
  const handle = (process.env.YOUTUBE_CHANNEL_HANDLE || 'karidocanto').replace(/^@/, '');
  const data = await ytFetch<{ items?: Array<{ id: string; snippet?: { title?: string }; contentDetails?: { relatedPlaylists?: { uploads?: string } } }> }>(`/channels?part=id,snippet,contentDetails&forHandle=${encodeURIComponent(handle)}`, token);
  const channel = data.items?.[0];
  if (!channel?.id) throw new Error('Canal @karidocanto não encontrado pela API. Defina YOUTUBE_CHANNEL_ID.');
  return { id: channel.id, title: channel.snippet?.title || 'Kari do Canto', uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads || '' };
}

export async function listChannelVideos(token: string, limit = 10) {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  let uploadsPlaylistId = '';
  let channelTitle = 'Kari do Canto';
  let resolvedChannelId = channelId;
  if (!channelId) {
    const resolved = await resolveChannelId(token);
    resolvedChannelId = resolved.id;
    uploadsPlaylistId = resolved.uploadsPlaylistId;
    channelTitle = resolved.title;
  } else {
    const data = await ytFetch<{ items?: Array<{ snippet?: { title?: string }; contentDetails?: { relatedPlaylists?: { uploads?: string } } }> }>(`channels?part=snippet,contentDetails&id=${encodeURIComponent(channelId)}`, token);
    uploadsPlaylistId = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads || '';
    channelTitle = data.items?.[0]?.snippet?.title || channelTitle;
  }
  if (!uploadsPlaylistId) throw new Error('Playlist de uploads do canal não encontrada.');
  const page = await ytFetch<{ items?: Array<{ contentDetails: { videoId: string }; snippet: { publishedAt: string; title: string } }> }>(`playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(uploadsPlaylistId)}&maxResults=${Math.min(limit, 50)}`, token);
  const ids = (page.items || []).map((item) => item.contentDetails.videoId).join(',');
  if (!ids) return { channelId: resolvedChannelId, channelTitle, videos: [] as YoutubeVideo[] };
  const videos = await ytFetch<{ items?: YoutubeVideo[] }>(`videos?part=snippet,statistics&id=${encodeURIComponent(ids)}`, token);
  return { channelId: resolvedChannelId, channelTitle, videos: videos.items || [] };
}

export async function getTranscript(token: string, videoId: string) {
  const tracks = await ytFetch<{ items?: Array<{ id: string; snippet?: { language?: string; trackKind?: string; name?: string } }> }>(`captions?part=id,snippet&videoId=${encodeURIComponent(videoId)}`, token);
  const track = (tracks.items || []).sort((a, b) => Number((a.snippet?.language || 'en') !== 'pt-BR') - Number((b.snippet?.language || 'en') !== 'pt-BR'))[0];
  if (!track) return null;
  const response = await fetch(`${YT}/captions/${encodeURIComponent(track.id)}?tfmt=vtt`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!response.ok) return null;
  const vtt = await response.text();
  return vtt.replace(/^WEBVTT.*?\n\n/s, '').replace(/\d{2}:\d{2}:\d{2}\.\d{3} --> .*\n/g, '').replace(/<[^>]+>/g, '').replace(/\n{2,}/g, '\n').trim();
}

function normalizeProposal(raw: any): Proposal {
  return {
    title: String(raw.title || '').trim().slice(0, 100),
    description: String(raw.description || '').trim().slice(0, 5000),
    primaryKeyword: String(raw.primaryKeyword || '').trim(),
    secondaryKeywords: Array.isArray(raw.secondaryKeywords) ? raw.secondaryKeywords.map(String).slice(0, 12) : [],
    hashtags: Array.isArray(raw.hashtags) ? raw.hashtags.map((x: string) => x.startsWith('#') ? x : `#${x}`).slice(0, 8) : [],
    tags: Array.isArray(raw.tags) ? raw.tags.map(String).slice(0, 30) : [],
    topic: String(raw.topic || '').trim(),
    intent: String(raw.intent || '').trim(),
    seoScore: Math.max(0, Math.min(100, Number(raw.seoScore) || 0)),
    reasons: Array.isArray(raw.reasons) ? raw.reasons.map(String).slice(0, 8) : [],
  };
}

export async function generateSeoProposal(video: YoutubeVideo, transcript?: string | null) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY não configurada.');
  const model = process.env.OPENAI_YOUTUBE_SEO_MODEL || 'gpt-5.6-luna';
  const source = [
    `TÍTULO ATUAL: ${video.snippet.title}`,
    `DESCRIÇÃO ATUAL: ${video.snippet.description || '(vazia)'}`,
    `TAGS ATUAIS: ${(video.snippet.tags || []).join(', ') || '(nenhuma)'}`,
    transcript ? `TRANSCRIÇÃO DO VÍDEO:\n${transcript.slice(0, 24000)}` : 'TRANSCRIÇÃO: não disponível; não invente detalhes que não estejam no título/descrição.',
  ].join('\n\n');
  const prompt = `Você é o especialista de SEO do canal brasileiro Kari do Canto, focado em artesanato, trabalhos manuais, feltro, tecido, decoração, presentes e projetos passo a passo. Analise o conteúdo abaixo e proponha metadados melhores para busca no YouTube. Preserve a personalidade acolhedora e artesanal do canal. Não faça keyword stuffing. Não invente materiais, técnicas ou etapas que não estejam evidenciados. O título deve ser natural e conter a intenção de busca principal. A descrição deve começar dizendo claramente o que o vídeo ensina/mostra, depois contextualizar e terminar com uma chamada para inscrição/continuação no canal. Retorne APENAS JSON válido com as chaves: title, description, primaryKeyword, secondaryKeywords, hashtags, tags, topic, intent, seoScore, reasons.\n\n${source}`;
  const response = await fetch('https://api.openai.com/v1/responses', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model, input: prompt }) });
  const json = await response.json();
  if (!response.ok) throw new Error(json?.error?.message || 'Falha na OpenAI.');
  const text = json.output_text || json.output?.flatMap((x: any) => x.content || []).map((x: any) => x.text || '').join('') || '';
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  return normalizeProposal(JSON.parse(cleaned));
}

export async function updateYoutubeVideo(token: string, video: YoutubeVideo, proposal: Proposal) {
  const body = { id: video.id, snippet: { title: proposal.title, description: proposal.description, tags: proposal.tags, categoryId: video.snippet.categoryId } };
  const response = await fetch(`${YT}/videos?part=snippet`, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const json = await response.json();
  if (!response.ok) throw new Error(json?.error?.message || 'Falha ao atualizar vídeo no YouTube.');
  return json;
}
