'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

type MediaAsset = { id:string; bucket:string; path:string; filename:string; alt_text:string|null; slot:string|null; width:number|null; height:number|null; mime_type:string|null; size_bytes:number|null; created_at:string; };

const BUCKETS = [
  { id: 'site', label: 'Site' },
  { id: 'karina', label: 'Kari' },
  { id: 'courses', label: 'Cursos' },
  { id: 'projects', label: 'Projetos' },
  { id: 'blog', label: 'Blog' },
];

function publicUrl(supabase: ReturnType<typeof getSupabaseBrowserClient>, bucket:string, path:string) { return supabase?.storage.from(bucket).getPublicUrl(path).data.publicUrl ?? ''; }
function safeName(name:string) { return name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-').toLowerCase(); }

export default function AdminMediaManager() {
  const supabase=useMemo(()=>getSupabaseBrowserClient(),[]);
  const [session,setSession]=useState<any>(null), [email,setEmail]=useState(''), [password,setPassword]=useState('');
  const [assets,setAssets]=useState<MediaAsset[]>([]), [bucket,setBucket]=useState('site'), [slot,setSlot]=useState('');
  const [alt,setAlt]=useState(''), [file,setFile]=useState<File|null>(null), [loading,setLoading]=useState(false), [message,setMessage]=useState(''), [error,setError]=useState('');

  useEffect(()=>{ if(!supabase)return; supabase.auth.getSession().then(({data})=>setSession(data.session)); const {data:listener}=supabase.auth.onAuthStateChange((_event,nextSession)=>setSession(nextSession)); return ()=>listener.subscription.unsubscribe(); },[supabase]);
  async function loadAssets(){ if(!supabase||!session)return; const {data,error:fetchError}=await supabase.from('media_assets').select('*').order('created_at',{ascending:false}).limit(60); if(fetchError)setError(fetchError.message); else setAssets((data??[]) as MediaAsset[]); }
  useEffect(()=>{void loadAssets();},[session]);
  async function login(event:FormEvent){ event.preventDefault(); if(!supabase)return setError('Supabase não está configurada.'); setLoading(true);setError('');setMessage(''); const {error:authError}=await supabase.auth.signInWithPassword({email,password}); if(authError)setError(authError.message);else setMessage('Login realizado.');setLoading(false); }
  async function logout(){await supabase?.auth.signOut();setAssets([]);}
  function onFileChange(event:ChangeEvent<HTMLInputElement>){const selected=event.target.files?.[0]??null;setFile(selected);if(selected&&!alt)setAlt(selected.name.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' '));}

  async function upload(event:FormEvent){
    event.preventDefault(); if(!supabase||!file)return setError('Selecione uma imagem.');
    if(!file.type.startsWith('image/'))return setError('Selecione um arquivo de imagem.');
    if(file.size>12*1024*1024)return setError('A imagem deve ter no máximo 12 MB.');
    const isLogo=bucket==='site'&&slot==='site-logo';
    const isOgImage=bucket==='site'&&slot==='site-og-image';
    const isSiteIdentity=isLogo||isOgImage;
    setLoading(true);setError('');setMessage(isLogo?'Atualizando logo do site...':isOgImage?'Atualizando imagem de preview social...':'Enviando imagem...');
    const filename=isLogo?'site-logo':isOgImage?'og-image':`${Date.now()}-${safeName(file.name)}`;
    const path=isLogo?'brand/site-logo':isOgImage?'brand/og-image':(slot?`${safeName(slot)}/${filename}`:filename);
    const {error:uploadError}=await supabase.storage.from(bucket).upload(path,file,{upsert:isSiteIdentity,contentType:file.type,cacheControl:isSiteIdentity?'0':'31536000'});
    if(uploadError){setError(uploadError.message);setLoading(false);return;}
    const image=await createImageBitmap(file).catch(()=>null);
    const {error:insertError}=await supabase.from('media_assets').insert({bucket,path,filename:file.name,alt_text:alt||(isLogo?'Logo Kari Do Canto — Artesanato com Afeto':'Imagem de preview social — Kari Do Canto'),slot:slot||null,width:image?.width??null,height:image?.height??null,mime_type:file.type,size_bytes:file.size});
    image?.close();
    if(insertError){if(!isSiteIdentity)await supabase.storage.from(bucket).remove([path]);setError(insertError.message);}else{if(isSiteIdentity)await supabase.from('media_assets').delete().eq('bucket','site').eq('path',path);setMessage(isLogo?'Logo atualizado. O site passa a usar este arquivo automaticamente.':isOgImage?'Imagem de preview social atualizada. O novo preview será usado automaticamente.':'Imagem adicionada com sucesso.');setFile(null);setAlt('');setSlot('');await loadAssets();}
    setLoading(false);
  }
  async function remove(asset:MediaAsset){if(!supabase||!window.confirm(`Excluir ${asset.filename}?`))return;setLoading(true);setError('');const {error:storageError}=await supabase.storage.from(asset.bucket).remove([asset.path]);if(storageError){setError(storageError.message);setLoading(false);return;}const {error:dbError}=await supabase.from('media_assets').delete().eq('id',asset.id);if(dbError)setError(dbError.message);else setAssets(current=>current.filter(item=>item.id!==asset.id));setLoading(false);}

  if(!supabase)return <div className="media-panel"><strong>Supabase não configurada.</strong><p>Adicione NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.</p></div>;
  if(!session)return <section className="media-panel"><div className="media-head"><div><span className="eyebrow">Painel Vital</span><h2 className="serif">Gerenciador de imagens</h2><p>Entre com um usuário do Supabase Auth para administrar as imagens do site.</p></div></div><form className="media-login" onSubmit={login}><label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/></label><label>Senha<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label><button className="btn primary" disabled={loading}>{loading?'ENTRANDO…':'ENTRAR'}</button>{error&&<p className="form-status error">{error}</p>}</form></section>;

  return <section className="media-panel">
    <div className="media-head"><div><span className="eyebrow">Conteúdo visual</span><h2 className="serif">Gerenciador de imagens</h2><p>Troque imagens do site pelo painel sem editar código.</p></div><button className="btn" onClick={logout}>SAIR</button></div>
    <div className="media-logo-callout"><div><span className="eyebrow">Identidade</span><h3 className="serif">Logo do site</h3><p>Envie o arquivo original da logo. Ele será usado automaticamente no header e no footer, sem redesenho ou conversão.</p></div><strong>site-logo</strong></div>
    <div className="media-logo-callout"><div><span className="eyebrow">Compartilhamento</span><h3 className="serif">Preview social / Open Graph</h3><p>Envie a imagem que aparecerá quando o site for compartilhado no WhatsApp, Facebook, LinkedIn e outros serviços. Recomendado: 1200 × 630 px.</p></div><strong>site-og-image</strong></div>
    <form className="media-upload" onSubmit={upload}>
      <label>Local<select value={bucket} onChange={e=>{setBucket(e.target.value);if(e.target.value!=='site')setSlot('');}}>{BUCKETS.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <label>Posição / uso<select value={slot} onChange={e=>setSlot(e.target.value)}><option value="">Imagem comum</option><option value="site-logo">LOGO DO SITE</option><option value="site-og-image">PREVIEW SOCIAL / OPEN GRAPH</option><option value="home-hero">Home — hero</option><option value="home-video">Home — vídeo</option><option value="project">Projeto</option><option value="blog">Blog</option></select></label>
      <label className="media-file">Imagem<input type="file" accept="image/svg+xml,image/jpeg,image/png,image/webp,image/avif" onChange={onFileChange} required/></label>
      <label>Texto alternativo<input value={alt} onChange={e=>setAlt(e.target.value)} placeholder={slot==='site-logo'?'Kari Do Canto — Artesanato com Afeto':slot==='site-og-image'?'Preview social — Kari Do Canto':'Descrição da imagem'}/></label>
      <button className="btn primary" disabled={loading}>{loading?(slot==='site-logo'?'ATUALIZANDO LOGO…':slot==='site-og-image'?'ATUALIZANDO PREVIEW…':'ENVIANDO…'):(slot==='site-logo'?'ATUALIZAR LOGO':slot==='site-og-image'?'ATUALIZAR PREVIEW':'ADICIONAR IMAGEM')}</button>
      {message&&<p className="form-status success">{message}</p>}{error&&<p className="form-status error">{error}</p>}
    </form>
    <div className="media-grid">{assets.map(asset=><article className="media-card" key={asset.id}><img src={publicUrl(supabase,asset.bucket,asset.path)} alt={asset.alt_text||asset.filename}/><div className="media-card-body"><span className="tag">{asset.bucket}</span><strong>{asset.slot==='site-logo'?'LOGO DO SITE':asset.slot==='site-og-image'?'PREVIEW SOCIAL / OPEN GRAPH':(asset.slot||asset.filename)}</strong><small>{asset.alt_text||'Sem texto alternativo'}</small><button className="media-delete" onClick={()=>void remove(asset)} disabled={loading}>EXCLUIR</button></div></article>)}</div>
    {assets.length===0&&<div className="media-empty">Nenhuma imagem cadastrada ainda.</div>}
  </section>;
}
