import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

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

function withUnsubscribe(html: string, token: string, locale: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://karidocanto.com.br';
  const href = `${base.replace(/\/$/, '')}/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
  const text = locale === 'es-LA' ? 'Cancelar suscripción' : 'Cancelar inscrição';
  return `${html}<hr style="border:0;border-top:1px solid #ddd;margin:32px 0"><p style="font:12px Arial,sans-serif;color:#777;text-align:center"><a href="${href}" style="color:#777">${text}</a></p>`;
}

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization') || '';
    const token = auth.replace(/^Bearer\s+/i, '');
    if (!token) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    const { data: userData } = await authClient().auth.getUser(token);
    if (!userData.user) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

    const body = await request.json() as { campaignId?: string };
    if (!body.campaignId) return NextResponse.json({ error: 'campaignId é obrigatório.' }, { status: 400 });

    const supabase = adminClient();
    const { data: campaign, error: campaignError } = await supabase.from('newsletter_campaigns').select('*').eq('id', body.campaignId).single();
    if (campaignError || !campaign) return NextResponse.json({ error: 'Campanha não encontrada.' }, { status: 404 });
    if (campaign.status === 'sent') return NextResponse.json({ error: 'Esta campanha já foi enviada.' }, { status: 409 });

    const brevoKey = process.env.BREVO_API_KEY;
    const from = process.env.NEWSLETTER_FROM_EMAIL;
    const fromName = process.env.NEWSLETTER_FROM_NAME || 'Kari Do Canto';
    if (!brevoKey || !from) return NextResponse.json({ error: 'Configure BREVO_API_KEY e NEWSLETTER_FROM_EMAIL no ambiente do Cloudflare.' }, { status: 500 });

    await supabase.from('newsletter_campaigns').update({ status: 'sending' }).eq('id', campaign.id);
    const { data: subscribers, error: subscribersError } = await supabase.from('newsletter_subscribers').select('id,email,name,locale,unsubscribe_token').eq('locale', campaign.locale).is('unsubscribed_at', null).eq('consent', true);
    if (subscribersError) throw subscribersError;

    let sent = 0;
    let failed = 0;
    for (const subscriber of subscribers || []) {
      const html = withUnsubscribe(campaign.body_html, subscriber.unsubscribe_token, campaign.locale);
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': brevoKey, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ sender: { email: from, name: fromName }, to: [{ email: subscriber.email, ...(subscriber.name ? { name: subscriber.name } : {}) }], subject: campaign.subject, htmlContent: html, ...(campaign.preheader ? { textContent: campaign.preheader } : {}) }),
      });
      const result = await response.json().catch(() => ({})) as { message?: string; messageId?: string };
      if (response.ok) {
        sent++;
        await supabase.from('newsletter_sends').upsert({ campaign_id: campaign.id, subscriber_id: subscriber.id, status: 'sent', provider_id: result.messageId || null }, { onConflict: 'campaign_id,subscriber_id' });
      } else {
        failed++;
        await supabase.from('newsletter_sends').upsert({ campaign_id: campaign.id, subscriber_id: subscriber.id, status: 'failed', error: result.message || `HTTP ${response.status}` }, { onConflict: 'campaign_id,subscriber_id' });
      }
    }

    await supabase.from('newsletter_campaigns').update({ status: failed ? 'failed' : 'sent', sent_at: new Date().toISOString() }).eq('id', campaign.id);
    return NextResponse.json({ sent, failed, total: (subscribers || []).length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Falha ao enviar newsletter.' }, { status: 500 });
  }
}
