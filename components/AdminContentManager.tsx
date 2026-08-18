'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

type ContentType = 'blog' | 'curso';
type Item = { id:string; content_type:ContentType; slug:string; title:string; category:string; summary:string; content:string; steps:string[]; published:boolean; sort_order:number };

const FALLBACK_IMAGE: Record<ContentType,string> = { blog:'/images/blog-cestinho.webp', curso:'/images/course-feltro.webp' };
const BUCKET: Record<ContentType,string> = { blog:'blog', curso:'courses' };

export default function AdminContentManager({ type }: { type: ContentType }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const label = type === 'blog' ? 'artigo' : 'curso';
  const plural = type === 'blog' ? 'artigos' : 'cursos';
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState({ slug:'', title:'', category:'', summary:'', content:'', steps:'', published:true, sort_order:1 });
  const [cover, setCover] = useState<File | null>(null);
  const [inside, setInside] = useState<File | null>(null);
  const [zip, setZip] = useState<File | null>(null);
  const [coverAlt, setCoverAlt] = useState('');
  const [insideAlt, setInsideAlt] = useState('');
  const [currentMedia, setCurrentMedia] = useState<Record<string,string>>({});
  const [currentZip, setCurrentZip] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    if (!supabase) return;
    const { data, error: e } = await supabase.from('content_items').select('id,content_type,slug,title,category,summary,content,steps,published,sort_order').eq('content_type', type).order('sort_order', { ascending:true }).order('created_at', { ascending:true });
    if (e) { setError(e.message); return; }
    setItems((data ?? []) as Item[]);
  }
  useEffect(() => { void load(); }, [type]);

  function startNew() {
    setEditing(null); setForm({ slug:'', title:'', category:'', summary:'', content:'', steps:'', published:true, sort_order:Math.max(1, items.length+1) });
    setCover(null); setInside(null); setZip(null); setCoverAlt(''); setInsideAlt(''); setCurrentMedia({}); setCurrentZip(''); setMessage(''); setError('');
  }
  function startEdit(item: Item) {
    setEditing(item); setForm({ slug:item.slug, title:item.title, category:item.category, summary:item.summary, content:item.content, steps:item.steps.join('\n'), published:item.published, sort_order:item.sort_order });
    setCover(null); setInside(null); setZip(null); setCoverAlt(''); setInsideAlt(''); setCurrentMedia({}); setCurrentZip(''); setMessage(''); setError('');
    void loadMedia(item.slug);
  }
  async function loadMedia(slug:string) {
    if (!supabase) return;
    const slots = type === 'blog' ? [`blog:${slug}:cover`,`blog:${slug}:inside`,`blog:${slug}:download`] : [`course:${slug}:cover`];
    const { data } = await supabase.from('media_assets').select('slot,path,filename,alt_text').eq('bucket',BUCKET[type]).in('slot', slots);
    const next:Record<string,string> = {};
    (data ?? []).forEach((row:any) => { next[row.slot] = supabase.storage.from(BUCKET[type]).getPublicUrl(row.path).data.publicUrl; });
    setCurrentMedia(next);
    const z = (data ?? []).find((row:any) => row.slot === `blog:${slug}:download`);
    setCurrentZip(z ? z.filename : '');
  }

  function onImage(event:ChangeEvent<HTMLInputElement>, which:'cover'|'inside') {
    const file = event.target.files?.[0] ?? null;
    if (which === 'cover') setCover(file); else setInside(file);
    if (file) {
      const text = file.name.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ');
      if (which === 'cover' && !coverAlt) setCoverAlt(text);
      if (which === 'inside' && !insideAlt) setInsideAlt(text);
    }
  }

  async function uploadImage(file:File, slug:string, slot:'cover'|'inside', alt:string) {
    if (!supabase) throw new Error('Supabase não está configurada.');
    if (!file.type.startsWith('image/')) throw new Error('Selecione somente imagens.');
    if (file.size > 12*1024*1024) throw new Error('Cada imagem deve ter no máximo 12 MB.');
    const bucket = BUCKET[type];
    const path = `posts/${slug}/${type}-${slot}.${file.name.split('.').pop() || 'webp'}`;
    const slotName = `${type === 'blog' ? 'blog' : 'course'}:${slug}:${slot}`;
    const { error:e } = await supabase.storage.from(bucket).upload(path,file,{upsert:true,contentType:file.type,cacheControl:'31536000'});
    if (e) throw e;
    const bitmap = await createImageBitmap(file).catch(()=>null);
    const { error:dbError } = await supabase.from('media_assets').upsert({ bucket, path, filename:file.name, alt_text:alt.trim() || null, slot:slotName, width:bitmap?.width ?? null, height:bitmap?.height ?? null, mime_type:file.type, size_bytes:file.size },{onConflict:'bucket,path'});
    bitmap?.close(); if (dbError) throw dbError;
  }
  async function uploadZip(file:File, slug:string) {
    if (!supabase) throw new Error('Supabase não está configurada.');
    const ok = file.name.toLowerCase().endsWith('.zip') || file.type === 'application/zip' || file.type === 'application/x-zip-compressed';
    if (!ok) throw new Error('Selecione somente arquivos ZIP.');
    if (file.size > 50*1024*1024) throw new Error('O arquivo ZIP deve ter no máximo 50 MB.');
    const path=`posts/${slug}/molde.zip`;
    const { error:e } = await supabase.storage.from('blog').upload(path,file,{upsert:true,contentType:'application/zip',cacheControl:'31536000'});
    if(e) throw e;
    const { error:dbError } = await supabase.from('media_assets').upsert({ bucket:'blog',path,filename:file.name,slot:`blog:${slug}:download`,mime_type:'application/zip',size_bytes:file.size },{onConflict:'bucket,path'});
    if(dbError) throw dbError;
  }

  async function save(event:FormEvent) {
    event.preventDefault(); if(!supabase) return;
    setLoading(true); setMessage(''); setError('');
    try {
      const slug = form.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'');
      if(!slug || !form.title.trim()) throw new Error('Título e slug são obrigatórios.');
      const steps = form.steps.split('\n').map(s=>s.trim()).filter(Boolean);
      const payload={ content_type:type, slug, title:form.title.trim(), category:form.category.trim(), summary:form.summary.trim(), content:form.content.trim(), steps, published:form.published, sort_order:Number(form.sort_order)||1 };
      const { data, error:e } = await supabase.from('content_items').upsert(payload,{onConflict:'content_type,slug'}).select('id,content_type,slug,title,category,summary,content,steps,published,sort_order').single();
      if(e) throw e;
      if(cover) await uploadImage(cover,slug,'cover',coverAlt);
      if(type==='blog' && inside) await uploadImage(inside,slug,'inside',insideAlt);
      if(type==='blog' && zip) await uploadZip(zip,slug);
      setMessage(`${label[0].toUpperCase()+label.slice(1)} salvo com sucesso.`);
      setEditing(data as Item); setForm({...form,slug}); setCover(null); setInside(null); setZip(null); await load(); await loadMedia(slug);
    } catch(e) { setError(e instanceof Error ? e.message : `Não foi possível salvar o ${label}.`); }
    finally { setLoading(false); }
  }

  async function remove(item:Item) {
    if(!supabase || !confirm(`Excluir este ${label}?`)) return;
    setLoading(true); setError('');
    const { error:e } = await supabase.from('content_items').delete().eq('id',item.id);
    if(e) setError(e.message); else { setMessage(`${label[0].toUpperCase()+label.slice(1)} excluído.`); if(editing?.id===item.id) startNew(); await load(); }
    setLoading(false);
  }

  const sorted = [...items].sort((a,b)=>a.sort_order-b.sort_order);
  return <section className="media-panel">
    <div className="media-head"><div><span className="eyebrow">Conteúdo dinâmico</span><h2 className="serif">{plural[0].toUpperCase()+plural.slice(1)}</h2><p>Cadastre, edite, publique e organize {plural}. A Home e a página da seção passam a carregar automaticamente o conteúdo publicado.</p></div></div>
    <div className="content-manager-list">
      {sorted.length === 0 && <div className="content-empty"><strong>Nenhum {label} cadastrado.</strong><span>O espaço da Home será mostrado como “Em breve”.</span></div>}
      {sorted.map(item=><div className="content-row" key={item.id}><div><span className="tag">{item.published ? 'PUBLICADO' : 'RASCUNHO'}</span><h3>{item.title}</h3><p>{item.category} · /{type==='blog'?'blog':'cursos'}/{item.slug}</p></div><div className="content-row-actions"><button type="button" className="btn" onClick={()=>startEdit(item)}>EDITAR</button><button type="button" className="more content-delete" onClick={()=>void remove(item)}>EXCLUIR</button></div></div>)}
    </div>
    <div className="content-editor">
      <div className="content-editor-head"><div><span className="eyebrow">{editing ? 'Editar' : 'Novo'}</span><h3 className="serif">{editing ? editing.title : `Adicionar ${label}`}</h3></div><button type="button" className="btn" onClick={startNew}>NOVO {label.toUpperCase()}</button></div>
      <form className="settings-form" onSubmit={save}>
        <div className="form-grid">
          <label>Título<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></label>
          <label>Slug<input value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} placeholder="ex: meu-novo-artigo" /></label>
          <label>Categoria<input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} /></label>
          <label>Ordem<input type="number" min="1" value={form.sort_order} onChange={e=>setForm({...form,sort_order:Number(e.target.value)})} /></label>
          <label className="full">Resumo<input value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})} /></label>
          <label className="full">Conteúdo introdutório<textarea rows={5} value={form.content} onChange={e=>setForm({...form,content:e.target.value})} /></label>
          <label className="full">Passos / tópicos (um por linha)<textarea rows={7} value={form.steps} onChange={e=>setForm({...form,steps:e.target.value})} /></label>
          <label className="switch full"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})} /><span>Publicar este conteúdo</span></label>
        </div>
        <div className="content-media-grid">
          <div><span className="eyebrow">Imagem de capa</span>{editing && currentMedia[`${type}:${form.slug}:cover`] ? <img className="content-media-preview" src={currentMedia[`${type}:${form.slug}:cover`]} alt="Capa atual" /> : <img className="content-media-preview" src={FALLBACK_IMAGE[type]} alt="Imagem padrão" />}<label>Nova imagem<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e=>onImage(e,'cover')} /></label><label>Texto alternativo<input value={coverAlt} onChange={e=>setCoverAlt(e.target.value)} placeholder="Descrição da imagem" /></label></div>
          {type==='blog' && <div><span className="eyebrow">Imagem interna</span>{editing && currentMedia[`blog:${form.slug}:inside`] && <img className="content-media-preview" src={currentMedia[`blog:${form.slug}:inside`]} alt="Imagem interna atual" />}<label>Nova imagem<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e=>onImage(e,'inside')} /></label><label>Texto alternativo<input value={insideAlt} onChange={e=>setInsideAlt(e.target.value)} placeholder="Descrição da imagem" /></label></div>}
          {type==='blog' && <div><span className="eyebrow">Arquivo do projeto</span><h4 className="serif">Molde para baixar</h4>{currentZip && <p>Arquivo atual: <strong>{currentZip}</strong></p>}<label>Novo ZIP<input type="file" accept=".zip,application/zip,application/x-zip-compressed" onChange={e=>setZip(e.target.files?.[0] ?? null)} /></label><small>Máximo: 50 MB. O botão aparece automaticamente no artigo.</small></div>}
        </div>
        <button className="btn primary" disabled={loading}>{loading ? 'SALVANDO…' : `SALVAR ${label.toUpperCase()}`}</button>
        {message && <p className="form-status success">{message}</p>}{error && <p className="form-status error">{error}</p>}
      </form>
    </div>
  </section>;
}
