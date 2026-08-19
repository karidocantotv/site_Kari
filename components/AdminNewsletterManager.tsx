'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

type Subscriber = { id: string; email: string; name: string | null; locale: string; subscribed_at: string; unsubscribed_at: string | null };
type Campaign = { id: string; subject: string; preheader: string | null; body_html: string; locale: string; status: string; sent_at: string | null; created_at: string };

export default function AdminNewsletterManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [locale, setLocale] = useState<'pt-BR'|'es-LA'>('pt-BR');
  const [subject, setSubject] = useState('');
  const [preheader, setPreheader] = useState('');
  const [body, setBody] = useState('<h1>Olá!</h1><p>Escreva aqui o conteúdo da sua newsletter.</p>');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => subscribers.filter(s => s.locale === locale && !s.unsubscribed_at), [subscribers, locale]);

  async function load() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const [{ data: subs }, { data: camps }] = await Promise.all([
      supabase.from('newsletter_subscribers').select('id,email,name,locale,subscribed_at,unsubscribed_at').order('subscribed_at', { ascending: false }),
      supabase.from('newsletter_campaigns').select('id,subject,preheader,body_html,locale,status,sent_at,created_at').order('created_at', { ascending: false }),
    ]);
    setSubscribers(subs || []); setCampaigns(camps || []);
  }
  useEffect(() => { load(); }, []);

  async function createCampaign() {
    const supabase = getSupabaseBrowserClient(); if (!supabase || !subject.trim() || !body.trim()) return;
    setBusy(true); setMessage('Salvando campanha…');
    const { error } = await supabase.from('newsletter_campaigns').insert({ subject: subject.trim(), preheader: preheader.trim() || null, body_html: body, locale });
    setMessage(error ? `Erro: ${error.message}` : 'Campanha salva como rascunho.');
    if (!error) { setSubject(''); setPreheader(''); await load(); }
    setBusy(false);
  }

  async function sendCampaign(id: string) {
    const supabase = getSupabaseBrowserClient(); if (!supabase) return;
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) { setMessage('Sessão expirada. Faça login novamente.'); return; }
    if (!window.confirm(`Enviar esta campanha para ${filtered.length} inscritos em ${locale === 'es-LA' ? 'espanhol' : 'português'}?`)) return;
    setBusy(true); setMessage('Enviando…');
    const response = await fetch('/api/admin/newsletter/send', { method: 'POST', headers: { Authorization: `Bearer ${session.session.access_token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ campaignId: id }) });
    const result = await response.json().catch(() => ({}));
    setMessage(response.ok ? `Envio concluído: ${result.sent} enviados${result.failed ? `, ${result.failed} falharam` : ''}.` : `Erro: ${result.error || 'Falha no envio.'}`);
    await load(); setBusy(false);
  }

  return <section className="media-panel">
    <div className="admin-panel-head"><div><span className="eyebrow">Comunicação</span><h2 className="serif">Newsletter</h2><p>Inscritos separados por idioma e campanhas com descadastro automático.</p></div></div>
    <div className="admin-tabs"><button className={locale === 'pt-BR' ? 'active' : ''} onClick={() => setLocale('pt-BR')}>🇧🇷 Português ({subscribers.filter(s=>s.locale==='pt-BR'&&!s.unsubscribed_at).length})</button><button className={locale === 'es-LA' ? 'active' : ''} onClick={() => setLocale('es-LA')}>🇪🇸 Español LATAM ({subscribers.filter(s=>s.locale==='es-LA'&&!s.unsubscribed_at).length})</button></div>
    <div className="newsletter-admin-grid">
      <div className="card"><div className="card-body"><span className="tag">Inscritos</span><h3>{filtered.length} ativos</h3><div className="admin-subscriber-list">{filtered.slice(0,50).map(s => <div key={s.id}><strong>{s.name || 'Sem nome'}</strong><span>{s.email}</span></div>)}{filtered.length > 50 && <small>Mostrando os primeiros 50.</small>}</div></div></div>
      <div className="card"><div className="card-body"><span className="tag">Nova campanha · {locale === 'es-LA' ? 'ES' : 'PT'}</span><input className="admin-input" value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Assunto do e-mail"/><input className="admin-input" value={preheader} onChange={e=>setPreheader(e.target.value)} placeholder="Prévia do e-mail (opcional)"/><textarea className="admin-textarea" value={body} onChange={e=>setBody(e.target.value)} placeholder="HTML do e-mail"/><button className="btn primary" disabled={busy || !subject.trim()} onClick={createCampaign}>SALVAR RASCUNHO</button></div></div>
    </div>
    <div className="card" style={{marginTop:20}}><div className="card-body"><span className="tag">Campanhas</span>{campaigns.filter(c=>c.locale===locale).map(c => <div className="campaign-row" key={c.id}><div><strong>{c.subject}</strong><span>{c.status} · {c.sent_at ? new Date(c.sent_at).toLocaleString('pt-BR') : 'não enviada'}</span></div>{c.status !== 'sent' && <button className="btn primary" disabled={busy} onClick={()=>sendCampaign(c.id)}>ENVIAR</button>}</div>)}{!campaigns.some(c=>c.locale===locale) && <p>Nenhuma campanha criada neste idioma.</p>}</div></div>
    {message && <p className="form-status success">{message}</p>}
  </section>;
}
