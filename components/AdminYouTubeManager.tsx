'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

type Video = { id: string; title: string; enabled: boolean };

const EMPTY: Video[] = Array.from({ length: 5 }, (_, index) => ({ id: '', title: `Vídeo ${index + 1}`, enabled: false }));

function normalizeVideoId(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const match = trimmed.match(/(?:v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  return match?.[1] ?? trimmed.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 11);
}

export default function AdminYouTubeManager() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [videos, setVideos] = useState<Video[]>(EMPTY);
  const [channel, setChannel] = useState('https://www.youtube.com/@KaridoCanto');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.from('site_settings').select('key,value').in('key', [
      'youtube_url', 'youtube_video_id', 'youtube_video_title', 'youtube_video_enabled',
      'youtube_video_id_2', 'youtube_video_title_2', 'youtube_video_enabled_2',
      'youtube_video_id_3', 'youtube_video_title_3', 'youtube_video_enabled_3',
      'youtube_video_id_4', 'youtube_video_title_4', 'youtube_video_enabled_4',
      'youtube_video_id_5', 'youtube_video_title_5', 'youtube_video_enabled_5',
    ]).then(({ data, error: fetchError }) => {
      if (fetchError) { setError(fetchError.message); return; }
      const values = Object.fromEntries((data ?? []).map((row) => [row.key, row.value ?? '']));
      setChannel(values.youtube_url || 'https://www.youtube.com/@KaridoCanto');
      setVideos(Array.from({ length: 5 }, (_, index) => {
        const suffix = index === 0 ? '' : `_${index + 1}`;
        const id = values[`youtube_video_id${suffix}`] || '';
        const title = values[`youtube_video_title${suffix}`] || `Vídeo ${index + 1}`;
        const enabled = values[`youtube_video_enabled${suffix}`] !== 'false' && Boolean(id);
        return { id, title, enabled };
      }));
    });
  }, [supabase]);

  function update(index: number, patch: Partial<Video>) {
    setVideos((current) => current.map((video, i) => i === index ? { ...video, ...patch } : video));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!supabase) { setError('Supabase não está configurada.'); return; }
    setLoading(true); setError(''); setMessage('');
    const updates = [
      { key: 'youtube_url', value: channel.trim() },
      ...videos.flatMap((video, index) => {
        const suffix = index === 0 ? '' : `_${index + 1}`;
        return [
          { key: `youtube_video_id${suffix}`, value: normalizeVideoId(video.id) },
          { key: `youtube_video_title${suffix}`, value: video.title.trim() },
          { key: `youtube_video_enabled${suffix}`, value: String(video.enabled && Boolean(normalizeVideoId(video.id))) },
        ];
      }),
    ];
    const { error: saveError } = await supabase.from('site_settings').upsert(updates, { onConflict: 'key' });
    if (saveError) setError(saveError.message);
    else setMessage('Vídeos do YouTube salvos. A Home será atualizada automaticamente.');
    setLoading(false);
  }

  if (!supabase) return <div className="media-panel"><strong>Supabase não configurada.</strong></div>;

  return <section className="media-panel">
    <div className="media-head">
      <div><span className="eyebrow">Redes</span><h2 className="serif">YouTube</h2><p>Cadastre até 5 vídeos que aparecerão na Home. A capa é carregada primeiro e o player só abre quando o visitante clicar.</p></div>
    </div>
    <form onSubmit={save} className="settings-form">
      <label>Link do canal<input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="https://www.youtube.com/@KaridoCanto" /></label>
      <div className="youtube-admin-grid">
        {videos.map((video, index) => <div className="youtube-admin-card" key={index}>
          <div className="youtube-admin-card-head"><strong>Vídeo {index + 1}</strong><label className="switch"><input type="checkbox" checked={video.enabled} onChange={(e) => update(index, { enabled: e.target.checked })} /><span>Mostrar na Home</span></label></div>
          <label>ID ou link do vídeo<input value={video.id} onChange={(e) => update(index, { id: e.target.value })} placeholder="https://youtu.be/XXXXXXXXXXX" /></label>
          <label>Título<input value={video.title} onChange={(e) => update(index, { title: e.target.value })} placeholder={`Título do vídeo ${index + 1}`} /></label>
          {normalizeVideoId(video.id) && <img className="youtube-admin-thumb" src={`https://img.youtube.com/vi/${normalizeVideoId(video.id)}/hqdefault.jpg`} alt="Prévia do vídeo" />}
        </div>)}
      </div>
      <button className="btn primary" disabled={loading}>{loading ? 'SALVANDO…' : 'SALVAR YOUTUBE'}</button>
      {message && <p className="form-status success">{message}</p>}
      {error && <p className="form-status error">{error}</p>}
    </form>
  </section>;
}
