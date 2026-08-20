'use client';
import {useCallback,useEffect,useMemo,useState} from 'react';
import {getSupabaseBrowserClient} from '@/lib/supabase';

type Status='pending'|'approved'|'rejected';
type Comment={id:string;slug:string;locale:'pt-BR'|'es-LA';name:string;email:string;comment:string;status:Status;created_at:string};

type Filter='all'|Status;

export default function AdminCommentsManager(){
 const [comments,setComments]=useState<Comment[]>([]);
 const [locale,setLocale]=useState<'all'|'pt-BR'|'es-LA'>('all');
 const [filter,setFilter]=useState<Filter>('all');
 const [busy,setBusy]=useState<string|null>(null);
 const [loading,setLoading]=useState(true);
 const [message,setMessage]=useState('');
 const [error,setError]=useState('');

 const getToken=useCallback(async()=>{const s=getSupabaseBrowserClient();if(!s)throw new Error('Supabase não configurado.');const {data}=await s.auth.getSession();if(!data.session?.access_token)throw new Error('Sessão expirada.');return data.session.access_token},[]);

 const load=useCallback(async()=>{
  setLoading(true);setError('');
  try{
   const token=await getToken();
   const locales=locale==='all'?['pt-BR','es-LA']:[locale];
   const responses=await Promise.all(locales.map(l=>fetch(`/api/blog-comments?slug=all&locale=${l}`,{headers:{Authorization:`Bearer ${token}`},cache:'no-store'})));
   const data=await Promise.all(responses.map(r=>r.json().catch(()=>({}))));
   const bad=responses.findIndex(r=>!r.ok);if(bad>=0)throw new Error(data[bad]?.error||'Não foi possível carregar os comentários.');
   const merged=data.flatMap(d=>d.comments||[]) as Comment[];
   merged.sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime());
   setComments(merged);
  }catch(e){setError(e instanceof Error?e.message:'Falha ao carregar comentários.');}
  finally{setLoading(false)}
 },[getToken,locale]);

 useEffect(()=>{load()},[load]);

 async function moderate(id:string,status:Status){
  setBusy(id);setMessage('');setError('');
  try{const token=await getToken();const r=await fetch('/api/blog-comments',{method:'PATCH',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({id,status})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Falha ao atualizar.');setMessage(status==='approved'?'Comentário aprovado.':status==='rejected'?'Comentário rejeitado.':'Comentário voltou para pendente.');await load()}catch(e){setError(e instanceof Error?e.message:'Falha ao atualizar comentário.')}finally{setBusy(null)}
 }

 async function remove(id:string){
  if(!window.confirm('Excluir este comentário definitivamente?'))return;
  setBusy(id);setMessage('');setError('');
  try{const token=await getToken();const r=await fetch(`/api/blog-comments?id=${encodeURIComponent(id)}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Falha ao excluir.');setComments(c=>c.filter(x=>x.id!==id));setMessage('Comentário excluído.')}catch(e){setError(e instanceof Error?e.message:'Falha ao excluir comentário.')}finally{setBusy(null)}
 }

 const counts=useMemo(()=>({all:comments.length,pending:comments.filter(c=>c.status==='pending').length,approved:comments.filter(c=>c.status==='approved').length,rejected:comments.filter(c=>c.status==='rejected').length}),[comments]);
 const visible=filter==='all'?comments:comments.filter(c=>c.status===filter);

 return <section className="media-panel">
  <div className="admin-panel-head"><div><span className="eyebrow">Comunidade</span><h2 className="serif">Comentários do blog</h2><p>Gerencie e modere os comentários antes da publicação.</p></div></div>
  <div className="admin-tabs"><button className={locale==='all'?'active':''} onClick={()=>setLocale('all')}>Todos os idiomas</button><button className={locale==='pt-BR'?'active':''} onClick={()=>setLocale('pt-BR')}>🇧🇷 Português</button><button className={locale==='es-LA'?'active':''} onClick={()=>setLocale('es-LA')}>🇪🇸 Español</button></div>
  <div className="comment-stats">
   {([['all','Total',counts.all],['pending','Pendentes',counts.pending],['approved','Aprovados',counts.approved],['rejected','Rejeitados',counts.rejected]] as const).map(([key,label,count])=><button key={key} className={`comment-stat ${filter===key?'active':''}`} onClick={()=>setFilter(key)}><small>{label}</small><strong>{count}</strong></button>)}
  </div>
  <div className="comment-toolbar"><div className="filters">{([['all','Todos'],['pending','Pendentes'],['approved','Aprovados'],['rejected','Rejeitados']] as const).map(([key,label])=><button key={key} className={filter===key?'filter active':'filter'} onClick={()=>setFilter(key)}>{label}</button>)}</div><button className="btn" disabled={loading} onClick={load}>{loading?'ATUALIZANDO…':'ATUALIZAR'}</button></div>
  {message&&<p className="form-status success">{message}</p>}{error&&<p className="form-status error">{error}</p>}
  <div className="card"><div className="card-body">
   {loading?<p>Carregando comentários…</p>:visible.length===0?<p>Nenhum comentário encontrado.</p>:visible.map(c=><article className="comment-item" key={c.id}>
    <div className="comment-head"><div><strong>{c.name}</strong><small>{c.email} · {new Date(c.created_at).toLocaleString(c.locale==='es-LA'?'es-LA':'pt-BR')}</small></div><div className="badges"><span className="locale-badge">{c.locale==='es-LA'?'ES':'PT'}</span><span className={`status-badge ${c.status}`}>{c.status==='pending'?'Pendente':c.status==='approved'?'Aprovado':'Rejeitado'}</span></div></div>
    <small className="article-ref">Artigo: <b>/{c.locale==='es-LA'?'es/':''}blog/{c.slug}</b></small><p className="comment-text">{c.comment}</p>
    <div className="comment-actions">{c.status!=='approved'&&<button className="btn primary" disabled={busy===c.id} onClick={()=>moderate(c.id,'approved')}>APROVAR</button>}{c.status!=='rejected'&&<button className="btn" disabled={busy===c.id} onClick={()=>moderate(c.id,'rejected')}>REJEITAR</button>}{c.status!=='pending'&&<button className="btn" disabled={busy===c.id} onClick={()=>moderate(c.id,'pending')}>PENDENTE</button>}<button className="btn danger" disabled={busy===c.id} onClick={()=>remove(c.id)}>EXCLUIR</button></div>
   </article>)}
  </div></div>
  <style jsx>{`
   .admin-panel-head{margin-bottom:20px}.admin-panel-head h2{margin:7px 0 7px;font-size:30px;font-weight:500}.admin-panel-head p{margin:0;color:var(--muted);line-height:1.6}
   .admin-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px}.admin-tabs button{border:1px solid var(--line);background:var(--white);padding:10px 14px;cursor:pointer;color:var(--muted)}.admin-tabs button.active{background:var(--coffee);border-color:var(--coffee);color:white}
   .comment-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px}.comment-stat{border:1px solid var(--line);background:var(--cream);padding:14px;text-align:left;cursor:pointer}.comment-stat small{display:block;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);font-size:9px;margin-bottom:5px}.comment-stat strong{font-family:Georgia,serif;font-size:27px;font-weight:500}.comment-stat.active{border-color:var(--terracotta);box-shadow:inset 0 0 0 1px var(--terracotta)}
   .comment-toolbar{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:16px}.filters{display:flex;flex-wrap:wrap;gap:7px}.filter{border:1px solid var(--line);background:var(--white);padding:8px 12px;cursor:pointer;color:var(--muted)}.filter.active{background:var(--coffee);border-color:var(--coffee);color:white}
   .comment-item{padding:20px 0;border-bottom:1px solid var(--line)}.comment-item:last-child{border-bottom:0}.comment-head{display:flex;justify-content:space-between;gap:15px;align-items:flex-start}.comment-head strong{display:block;margin-bottom:5px}.comment-head small{color:var(--muted);font-size:11px}.badges{display:flex;gap:6px;align-items:center}.locale-badge,.status-badge{padding:5px 8px;border:1px solid var(--line);font-size:9px;text-transform:uppercase;letter-spacing:.08em}.locale-badge{background:var(--cream);color:var(--muted)}.status-badge.pending{border-color:var(--terracotta);color:var(--terracotta)}.status-badge.approved{border-color:var(--sage-dark);color:var(--sage-dark)}.status-badge.rejected{border-color:#c98778;color:#9b3e30}
   .article-ref{display:block;margin-top:12px;color:var(--muted)}.comment-text{margin:10px 0 16px;line-height:1.7;white-space:pre-wrap}.comment-actions{display:flex;flex-wrap:wrap;gap:7px}.btn{cursor:pointer}.btn:disabled{opacity:.55;cursor:wait}.btn.danger{border-color:#c98778;color:#9b3e30}.form-status{margin:10px 0}.form-status.error{color:#9b3e30}
   @media(max-width:700px){.comment-stats{grid-template-columns:repeat(2,1fr)}.comment-toolbar{align-items:stretch;flex-direction:column}.comment-head{flex-direction:column}.comment-actions .btn{width:100%}.comment-actions{display:grid;grid-template-columns:1fr}.admin-tabs button{flex:1}}
  `}</style>
 </section>
}
