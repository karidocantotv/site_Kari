'use client';

import { useEffect, useState } from 'react';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function YoutubeSeoPage() {
  return <AdminAuthGuard><YoutubeSeoPanel /></AdminAuthGuard>;
}

function YoutubeSeoPanel() {
  const [connected, setConnected] = useState(false);
  const [channel, setChannel] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');

  async function authHeaders() {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase!.auth.getSession();
    return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
  }

  async function load() {
    setLoading(true); setError('');
    try {
      const headers = await authHeaders();
      const status = await fetch('/api/admin/youtube-seo?action=status', { headers });
      const statusJson = await status.json();
      setConnected(statusJson.connected); setChannel(statusJson.channel);
      if (statusJson.connected) {
        const response = await fetch('/api/admin/youtube-seo?action=videos&limit=10', { headers });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error);
        setVideos(json.videos || []);
      }
    } catch (e: any) { setError(e.message || 'Não foi possível carregar o módulo.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function connect() {
    setWorking(true); setError('');
    try {
      const headers = await authHeaders();
      const response = await fetch('/api/admin/youtube-seo?action=connect', { headers });
      const json = await response.json();
      if (!response.ok || !json.authUrl) throw new Error(json.error || 'Não foi possível iniciar o OAuth.');
      window.location.href = json.authUrl;
    } catch (e: any) { setError(e.message || 'Falha ao conectar.'); setWorking(false); }
  }

  async function analyze() {
    setWorking(true); setError(''); setProposals([]);
    try {
      const headers = { ...(await authHeaders()), 'Content-Type': 'application/json' };
      const response = await fetch('/api/admin/youtube-seo', { method: 'POST', headers, body: JSON.stringify({ action: 'analyze', limit: 5, videoIds: videos.slice(0, 5).map((v) => v.id), includeTranscript: true }) });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error);
      setProposals(json.proposals || []);
    } catch (e: any) { setError(e.message || 'Falha na análise.'); }
    finally { setWorking(false); }
  }

  async function publish(proposal: any) {
    if (!confirm(`Publicar a otimização de “${proposal.video.snippet.title}” no YouTube?`)) return;
    setWorking(true); setError('');
    try {
      const headers = { ...(await authHeaders()), 'Content-Type': 'application/json' };
      const response = await fetch('/api/admin/youtube-seo', { method: 'POST', headers, body: JSON.stringify({ action: 'publish', proposalId: proposal.id }) });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error);
      setProposals((items) => items.filter((item) => item.id !== proposal.id));
    } catch (e: any) { setError(e.message || 'Falha ao publicar.'); }
    finally { setWorking(false); }
  }

  return <main className="admin"><div className="container"><div className="adminbox">
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div><span className="eyebrow">YouTube</span><h1 className="serif">SEO do canal</h1><p>Analise vídeos antigos, gere novas propostas de SEO e publique somente depois da aprovação.</p></div>
      <a className="btn" href="/admin/dashboard">← Painel</a>
    </div>

    {error && <div className="analytics-card" style={{ marginTop: 20 }}><strong>Erro</strong><small>{error}</small></div>}

    {!connected ? <section className="analytics-panel" style={{ marginTop: 24 }}><h2 className="serif">Conectar YouTube</h2><p>Autorize o agente com a conta que administra o canal Kari do Canto. A senha do Google nunca é enviada para este site.</p><button className="btn primary" disabled={working} onClick={connect}>{working ? 'ABRINDO GOOGLE…' : 'CONECTAR AO YOUTUBE'}</button></section> : <>
      <section className="analytics-panel" style={{ marginTop: 24 }}><div className="analytics-panel-head"><div><span className="eyebrow">Canal conectado</span><h2 className="serif">{channel?.title || 'Kari do Canto'}</h2><p>{channel?.id}</p></div><span className="analytics-status is-on"><span className="analytics-dot" /> Conectado</span></div><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><button className="btn primary" disabled={working || loading} onClick={analyze}>{working ? 'ANALISANDO…' : 'ANALISAR 5 VÍDEOS'}</button><button className="btn" onClick={load}>ATUALIZAR</button></div></section>
      <section style={{ marginTop: 24 }}><h2 className="serif">Vídeos encontrados</h2>{loading ? <p>Carregando vídeos…</p> : <div className="grid4">{videos.map((video) => <article className="card" key={video.id}><div className="card-body"><span className="tag">{Number(video.statistics?.viewCount || 0).toLocaleString('pt-BR')} visualizações</span><h3>{video.snippet.title}</h3><small>{new Date(video.snippet.publishedAt).toLocaleDateString('pt-BR')}</small></div></article>)}</div>}</section>
      {proposals.length > 0 && <section style={{ marginTop: 32 }}><span className="eyebrow">Revisão</span><h2 className="serif">Propostas de otimização</h2>{proposals.map((item) => <article className="analytics-panel" key={item.video.id} style={{ marginTop: 16 }}><div className="analytics-panel-head"><div><span className="tag">SEO {item.proposal.seoScore}/100</span><h3>{item.video.snippet.title}</h3></div><span className="analytics-status"><span className="analytics-dot" /> {item.transcriptUsed ? 'Com transcrição' : 'Sem transcrição'}</span></div><div className="grid4"><div><small>Título sugerido</small><p><strong>{item.proposal.title}</strong></p></div><div><small>Palavra-chave principal</small><p>{item.proposal.primaryKeyword}</p></div><div><small>Hashtags</small><p>{item.proposal.hashtags.join(' ')}</p></div><div><small>Tags</small><p>{item.proposal.tags.join(', ')}</p></div></div><div style={{ marginTop: 16 }}><small>Descrição sugerida</small><div className="analytics-card" style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{item.proposal.description}</div></div><button className="btn primary" style={{ marginTop: 16 }} disabled={working} onClick={() => publish(item)}>APROVAR E PUBLICAR</button></article>)}</section>}
    </>}
  </div></div></main>;
}
