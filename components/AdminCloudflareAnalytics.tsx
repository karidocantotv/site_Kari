'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

type Data = { pageviews: number; visits: number; vitals: { lcp: number | null; inp: number | null; cls: number | null; fcp: number | null; ttfb: number | null }; topPages: { path: string; count: number }[]; countries: { country: string; count: number }[] };
const fmt = (n: number) => new Intl.NumberFormat('pt-BR').format(n);
const ms = (n: number | null) => n == null ? '—' : `${Math.round(n)} ms`;
const cls = (n: number | null) => n == null ? '—' : n.toFixed(2);

export default function AdminCloudflareAnalytics() {
  const [range, setRange] = useState('7d');
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError('');
    const load = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
      if (!session?.access_token) throw new Error('Sessão expirada. Faça login novamente.');
      const response = await fetch(`/api/admin/analytics?range=${range}`, { cache: 'no-store', headers: { Authorization: `Bearer ${session.access_token}` } });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Não foi possível carregar os dados.');
      return json;
    };
    load().then((json) => { if (!cancelled) setData(json); }).catch((e) => { if (!cancelled) setError(e.message); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [range]);

  return <>
    <div className="analytics-range" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
      {[['1d','Hoje'],['7d','7 dias'],['30d','30 dias']].map(([value,label]) => <button key={value} type="button" className={`btn ${range === value ? 'primary' : ''}`} onClick={() => setRange(value)}>{label}</button>)}
    </div>
    {loading && <p>Carregando dados do Cloudflare…</p>}
    {error && <p role="alert">{error}</p>}
    {data && !loading && <>
      <div className="analytics-grid">
        <div className="analytics-card"><span>Visitas</span><strong>{fmt(data.visits)}</strong><small>Visitas registradas pelo RUM.</small></div>
        <div className="analytics-card"><span>Visualizações</span><strong>{fmt(data.pageviews)}</strong><small>Páginas visualizadas no período.</small></div>
        <div className="analytics-card"><span>LCP · P75</span><strong>{ms(data.vitals.lcp)}</strong><small>Largest Contentful Paint.</small></div>
        <div className="analytics-card"><span>INP · P75</span><strong>{ms(data.vitals.inp)}</strong><small>Interaction to Next Paint.</small></div>
        <div className="analytics-card"><span>CLS · P75</span><strong>{cls(data.vitals.cls)}</strong><small>Estabilidade visual.</small></div>
        <div className="analytics-card"><span>TTFB · P75</span><strong>{ms(data.vitals.ttfb)}</strong><small>Tempo até o primeiro byte.</small></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 18, marginTop: 18 }}>
        <div className="analytics-card"><span>Páginas mais acessadas</span>{data.topPages.map((p) => <div key={p.path} style={{ display:'flex', justifyContent:'space-between', gap:12, padding:'7px 0', borderTop:'1px solid rgba(0,0,0,.08)' }}><small style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.path}</small><small>{fmt(p.count)}</small></div>)}</div>
        <div className="analytics-card"><span>Países</span>{data.countries.map((c) => <div key={c.country} style={{ display:'flex', justifyContent:'space-between', gap:12, padding:'7px 0', borderTop:'1px solid rgba(0,0,0,.08)' }}><small>{c.country}</small><small>{fmt(c.count)}</small></div>)}</div>
      </div>
    </>}
  </>;
}
