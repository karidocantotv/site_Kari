import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase service role não configurada.');
  return createClient(url, key);
}
function authClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase não configurado.');
  return createClient(url, key);
}
async function requireAdmin(request: NextRequest) {
  const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return false;
  const { data } = await authClient().auth.getUser(token);
  return !!data.user;
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')?.trim();
  const locale = request.nextUrl.searchParams.get('locale') || 'pt-BR';
  if (!slug || !['pt-BR', 'es-LA'].includes(locale)) return NextResponse.json({ error: 'Parâmetros inválidos.' }, { status: 400 });
  const supabase = authClient();
  const { data, error } = await supabase.from('blog_comments').select('id,name,comment,created_at').eq('slug', slug).eq('locale', locale).eq('status', 'approved').order('created_at', { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: 'Não foi possível carregar os comentários.' }, { status: 500 });
  return NextResponse.json({ comments: data || [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { slug?: string; locale?: string; name?: string; email?: string; comment?: string; website?: string };
    if (body.website) return NextResponse.json({ ok: true });
    const slug = body.slug?.trim();
    const locale = body.locale || 'pt-BR';
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const comment = body.comment?.trim();
    if (!slug || !['pt-BR', 'es-LA'].includes(locale) || !name || !email || !comment) return NextResponse.json({ error: 'Preencha nome, e-mail e comentário.' }, { status: 400 });
    if (name.length > 100 || email.length > 254 || comment.length > 3000) return NextResponse.json({ error: 'O comentário excede o limite permitido.' }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });
    const supabase = adminClient();
    const { error } = await supabase.from('blog_comments').insert({ slug, locale, name, email, comment, status: 'pending' });
    if (error) throw error;
    return NextResponse.json({ ok: true, message: locale === 'es-LA' ? '¡Gracias! Tu comentario quedará pendiente de aprobación.' : 'Obrigado! Seu comentário ficará aguardando aprovação.' });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Não foi possível enviar o comentário.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    const body = await request.json() as { id?: string; status?: string };
    if (!body.id || !['approved', 'rejected', 'pending'].includes(body.status || '')) return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
    const supabase = adminClient();
    const { data: userData } = await authClient().auth.getUser((request.headers.get('authorization') || '').replace(/^Bearer\s+/i, ''));
    const { error } = await supabase.from('blog_comments').update({ status: body.status, moderated_at: new Date().toISOString(), moderated_by: userData.user?.id || null }).eq('id', body.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Falha ao moderar comentário.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID obrigatório.' }, { status: 400 });
    const { error } = await adminClient().from('blog_comments').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Falha ao excluir comentário.' }, { status: 500 });
  }
}
