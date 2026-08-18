'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

const LABELS: Record<string, string> = { blog: 'Blog', projetos: 'Projetos', cursos: 'Cursos' };
const DEFAULTS: Record<string, { title: string; description: string }> = {
  blog: { title: 'Dicas e passo a passo para a casa', description: 'Aprenda uma técnica, escolha seus materiais e encontre inspiração para o próximo projeto.' },
  projetos: { title: 'Projetos para criar com afeto', description: 'Passo a passo, ideias e galerias para você transformar materiais em peças feitas à mão.' },
  cursos: { title: 'Cursos para criar com afeto', description: 'Escolha uma técnica, acompanhe o passo a passo e transforme uma ideia em uma peça que tenha a sua cara.' },
};

export default function AdminSectionSettings({ section }: { section: 'blog' | 'projetos' | 'cursos' }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [title, setTitle] = useState(DEFAULTS[section].title);
  const [description, setDescription] = useState(DEFAULTS[section].description);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const label = LABELS[section];

  useEffect(() => {
    if (!supabase) return;
    supabase.from('site_settings').select('key,value').in('key', [`${section}_title`, `${section}_description`, `${section}_enabled`]).then(({ data, error: fetchError }) => {
      if (fetchError) { setError(fetchError.message); return; }
      const values = Object.fromEntries((data ?? []).map((row) => [row.key, row.value ?? '']));
      if (values[`${section}_title`]) setTitle(values[`${section}_title`]);
      if (values[`${section}_description`]) setDescription(values[`${section}_description`]);
      if (values[`${section}_enabled`] !== undefined) setEnabled(values[`${section}_enabled`] !== 'false');
    });
  }, [section, supabase]);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true); setError(''); setMessage('');
    const { error: saveError } = await supabase.from('site_settings').upsert([
      { key: `${section}_title`, value: title.trim() },
      { key: `${section}_description`, value: description.trim() },
      { key: `${section}_enabled`, value: String(enabled) },
    ], { onConflict: 'key' });
    if (saveError) setError(saveError.message); else setMessage(`Configuração do ${label} salva.`);
    setLoading(false);
  }

  return <section className="media-panel">
    <div className="media-head"><div><span className="eyebrow">Configuração</span><h2 className="serif">{label}</h2><p>Edite as informações principais desta seção. O conteúdo detalhado continua sendo organizado no módulo correspondente.</p></div></div>
    <form onSubmit={save} className="settings-form settings-form-narrow">
      <label>Título da seção<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
      <label>Descrição<textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} /></label>
      <label className="switch"><input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} /><span>Seção ativa na Home</span></label>
      <button className="btn primary" disabled={loading}>{loading ? 'SALVANDO…' : 'SALVAR CONFIGURAÇÃO'}</button>
      {message && <p className="form-status success">{message}</p>}{error && <p className="form-status error">{error}</p>}
    </form>
  </section>;
}
