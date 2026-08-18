'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

const POSTS = [
  ['cestinho-de-tecido', 'Cestinho de tecido: passo a passo completo'],
  ['como-escolher-linhas', 'Como escolher as melhores linhas'],
  ['pintura-em-madeira', 'Pintura em madeira: técnicas e cuidados'],
  ['flores-de-feltro', 'Flores de feltro: ideias para criar'],
] as const;

type Slot = 'cover' | 'inside';

function publicUrl(supabase: ReturnType<typeof getSupabaseBrowserClient>, path: string) {
  return supabase?.storage.from('blog').getPublicUrl(path).data.publicUrl ?? '';
}


export default function AdminBlogImageManager() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [post, setPost] = useState(POSTS[0][0]);
  const [cover, setCover] = useState<File | null>(null);
  const [inside, setInside] = useState<File | null>(null);
  const [downloadZip, setDownloadZip] = useState<File | null>(null);
  const [coverAlt, setCoverAlt] = useState('');
  const [insideAlt, setInsideAlt] = useState('');
  const [currentZip, setCurrentZip] = useState<{ url: string; filename: string } | null>(null);
  const [current, setCurrent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadCurrent(slug = post) {
    if (!supabase) return;
    const { data, error: fetchError } = await supabase.from('media_assets').select('slot,path,alt_text,filename').eq('bucket', 'blog').in('slot', [`blog:${slug}:cover`, `blog:${slug}:inside`, `blog:${slug}:download`]);
    if (fetchError) { setError(fetchError.message); return; }
    const next: Record<string, string> = {};
    (data ?? []).forEach((item) => { if (item.slot) next[item.slot] = publicUrl(supabase, item.path); });
    setCurrent(next);
    const zip = (data ?? []).find((item) => item.slot === `blog:${slug}:download`);
    setCurrentZip(zip ? { url: publicUrl(supabase, zip.path), filename: zip.filename } : null);
  }

  useEffect(() => { void loadCurrent(post); }, [post]);

  function onFileChange(event: ChangeEvent<HTMLInputElement>, slot: Slot) {
    const selected = event.target.files?.[0] ?? null;
    if (slot === 'cover') setCover(selected); else setInside(selected);
    if (selected) {
      const text = selected.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      if (slot === 'cover' && !coverAlt) setCoverAlt(text);
      if (slot === 'inside' && !insideAlt) setInsideAlt(text);
    }
  }

  async function uploadZip(file: File) {
    if (!supabase) throw new Error('Supabase não está configurada.');
    const isZip = file.name.toLowerCase().endsWith('.zip') || file.type === 'application/zip' || file.type === 'application/x-zip-compressed';
    if (!isZip) throw new Error('Selecione somente arquivos ZIP para o molde.');
    if (file.size > 50 * 1024 * 1024) throw new Error('O arquivo ZIP deve ter no máximo 50 MB.');
    const slotName = `blog:${post}:download`;
    const path = `posts/${post}/molde.zip`;
    const { error: uploadError } = await supabase.storage.from('blog').upload(path, file, { upsert: true, contentType: 'application/zip', cacheControl: '31536000' });
    if (uploadError) throw uploadError;
    const { error: dbError } = await supabase.from('media_assets').upsert({ bucket: 'blog', path, filename: file.name, alt_text: null, slot: slotName, width: null, height: null, mime_type: 'application/zip', size_bytes: file.size }, { onConflict: 'bucket,path' });
    if (dbError) throw dbError;
  }

  async function uploadOne(file: File, slot: Slot, alt: string) {
    if (!supabase) throw new Error('Supabase não está configurada.');
    if (!file.type.startsWith('image/')) throw new Error('Selecione somente imagens.');
    if (file.size > 12 * 1024 * 1024) throw new Error('Cada imagem deve ter no máximo 12 MB.');
    const slotName = `blog:${post}:${slot}`;
    const path = `posts/${post}/${slot}.image`;
    const { error: uploadError } = await supabase.storage.from('blog').upload(path, file, { upsert: true, contentType: file.type, cacheControl: '0' });
    if (uploadError) throw uploadError;
    const bitmap = await createImageBitmap(file).catch(() => null);
    const { error: dbError } = await supabase.from('media_assets').upsert({ bucket: 'blog', path, filename: file.name, alt_text: alt.trim() || undefined, slot: slotName, width: bitmap?.width ?? null, height: bitmap?.height ?? null, mime_type: file.type, size_bytes: file.size }, { onConflict: 'bucket,path' });
    bitmap?.close();
    if (dbError) throw dbError;
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!supabase) { setError('Supabase não está configurada.'); return; }
    if (!cover && !inside && !downloadZip) { setError('Selecione pelo menos uma imagem ou um arquivo ZIP.'); return; }
    setLoading(true); setError(''); setMessage('Salvando imagens…');
    try {
      if (cover) await uploadOne(cover, 'cover', coverAlt);
      if (inside) await uploadOne(inside, 'inside', insideAlt);
      if (downloadZip) await uploadZip(downloadZip);
      await loadCurrent(post);
      setCover(null); setInside(null); setDownloadZip(null); setCoverAlt(''); setInsideAlt('');
      setMessage(downloadZip ? 'Imagens e molde do artigo atualizados.' : 'Imagens do artigo atualizadas.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar as imagens.');
      setMessage('');
    } finally { setLoading(false); }
  }

  return <section className="media-panel">
    <div className="media-head"><div><span className="eyebrow">Conteúdo do Blog</span><h2 className="serif">Imagens dos artigos</h2><p>Cada artigo pode ter até 2 imagens: uma capa e uma imagem interna. A capa também é usada no compartilhamento social quando configurada.</p></div></div>
    <form className="settings-form" onSubmit={save}>
      <label>Artigo<select value={post} onChange={e => setPost(e.target.value)}>{POSTS.map(([slug, title]) => <option key={slug} value={slug}>{title}</option>)}</select></label>
      <div className="blog-image-settings-grid">
        <div className="blog-image-setting">
          <span className="eyebrow">Imagem 1</span><h3 className="serif">Capa do artigo</h3>
          {current[`blog:${post}:cover`] && <img className="blog-image-preview" src={current[`blog:${post}:cover`]} alt="Capa atual" />}
          <label>Nova imagem<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => onFileChange(e, 'cover')} /></label>
          <label>Texto alternativo<input value={coverAlt} onChange={e => setCoverAlt(e.target.value)} placeholder="Descrição da imagem" /></label>
        </div>
        <div className="blog-image-setting">
          <span className="eyebrow">Imagem 2</span><h3 className="serif">Imagem interna</h3>
          {current[`blog:${post}:inside`] && <img className="blog-image-preview" src={current[`blog:${post}:inside`]} alt="Imagem interna atual" />}
          <label>Nova imagem<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => onFileChange(e, 'inside')} /></label>
          <label>Texto alternativo<input value={insideAlt} onChange={e => setInsideAlt(e.target.value)} placeholder="Descrição da imagem" /></label>
        </div>
        <div className="blog-image-setting blog-download-setting">
          <span className="eyebrow">Arquivo do projeto</span><h3 className="serif">Molde para baixar</h3>
          <p className="blog-download-help">Adicione um arquivo ZIP com moldes, arquivos de apoio ou materiais complementares para o leitor baixar dentro do artigo.</p>
          {currentZip && <p className="blog-download-current"><strong>Arquivo atual:</strong> <a href={currentZip.url} target="_blank" rel="noreferrer">{currentZip.filename}</a></p>}
          <label>Novo arquivo ZIP<input type="file" accept=".zip,application/zip,application/x-zip-compressed" onChange={e => setDownloadZip(e.target.files?.[0] ?? null)} /></label>
          <small>Máximo: 50 MB. O botão de download aparece automaticamente no final do artigo quando houver um arquivo.</small>
        </div>
      </div>
      <button className="btn primary" disabled={loading}>{loading ? 'SALVANDO…' : 'SALVAR CONTEÚDO DO ARTIGO'}</button>
      {message && <p className="form-status success">{message}</p>}{error && <p className="form-status error">{error}</p>}
    </form>
  </section>;
}
