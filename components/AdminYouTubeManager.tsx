'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

type Video = { id: string; title: string; enabled: boolean };
type Locale = 'pt' | 'es';

const EMPTY_PT: Video[] = Array.from({ length: 5 }, (_, index) => ({ id: '', title: `Vídeo ${index + 1}`, enabled: false }));
const EMPTY_ES: Video[] = Array.from({ length: 5 }, (_, index) => ({ id: '', title: `Video ${index + 1}`, enabled: false }));

function normalizeVideoId(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const match = trimmed.match(/(?:v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  return match?.[1] ?? trimmed.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 11);
}

export default function AdminYouTubeManager() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [locale, setLocale] = useState<Locale>('pt');
  const [videosPt, setVideosPt] = useState<Video[]>(EMPTY_PT);
  const [videosEs, setVideosEs] = useState<Video[]>(EMPTY_ES);
  const [channelPt, setChannelPt] = useState('https://www.youtube.com/@KaridoCanto');
  const [channelEs, setChannelEs] = useState('https://www.youtube.com/@KaridoCanto');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const settingsKeys = useMemo(() => {
    const keys = ['youtube_url', 'youtube_url_es'];
    for (let index = 1; index <= 5; index++) {
      const suffix = index === 1 ? '' : `_${index}`;
      keys.push(`youtube_video_id${suffix}`, `youtube_video_title${suffix}`, `youtube_video_enabled${suffix}`);
      keys.push(`youtube_es_video_id${suffix}`, `youtube_es_video_title${suffix}`, `youtube_es_video_enabled${suffix}`);
    }
    return keys;
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('site_settings').select('key,value').in('key', settingsKeys).then(({ data, error: fetchError }) => {
      if (fetchError) { setError(fetchError.message); return; }
      const values = Object.fromEntries((data ?? []).map((row) => [row.key, row.value ?? '']));
      setChannelPt(values.youtube_url || 'https://www.youtube.com/@KaridoCanto');
      setChannelEs(values.youtube_url_es || 'https://www.youtube.com/@KaridoCanto');
      const loadVideos = (prefix: string, fallbackTitles: string[]) => Array.from({ length: 5 }, (_, index) => {
        const suffix = index === 0 ? '' : `_${index + 1}`;
        const id = values[`${prefix}video_id${suffix}`] || '';
        const title = values[`${prefix}video_title${suffix}`] || fallbackTitles[index];
        const enabled = values[`${prefix}video_enabled${suffix}`] !== 'false' && Boolean(id);
        return { id, title, enabled };
      });
      setVideosPt(loadVideos('youtube_', Array.from({ length: 5 }, (_, i) => `Vídeo ${i + 1}`)));
      setVideosEs(loadVideos('youtube_es_', Array.from({ length: 5 }, (_, i) => `Video ${i + 1}`)));
    });
  }, [supabase, settingsKeys]);

  function update(localeToUpdate: Locale, index: number, patch: Partial<Video>) {
    const setter = localeToUpdate === 'pt' ? setVideosPt : setVideosEs;
    setter((current) => current.map((video, i) => i === index ? { ...video, ...patch } : video));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!supabase) { setError('Supabase não está configurada.'); return; }
    setLoading(true); setError(''); setMessage('');
    const buildUpdates = (prefix: string, channel: string, videos: Video[]) => [
      { key: prefix === 'youtube_' ? 'youtube_url' : 'youtube_url_es', value: channel.trim() },
      ...videos.flatMap((video, index) => {
        const suffix = index === 0 ? '' : `_${index + 1}`;
        return [
          { key: `${prefix}video_id${suffix}`, value: normalizeVideoId(video.id) },
          { key: `${prefix}video_title${suffix}`, value: video.title.trim() },
          { key: `${prefix}video_enabled${suffix}`, value: String(video.enabled && Boolean(normalizeVideoId(video.id))) },
        ];
      }),
    ];
    const updates = [...buildUpdates('youtube_', channelPt, videosPt), ...buildUpdates('youtube_es_', channelEs, videosEs)];
    try {
      const { error: saveError } = await supabase.from('site_settings').upsert(updates, { onConflict: 'key' });
      if (saveError) { setError(saveError.message); return; }
      const keys = updates.map((item) => item.key);
      const { data: confirmation, error: confirmError } = await supabase.from('site_settings').select('key,value').in('key', keys);
      if (confirmError) { setError(`Salvamento enviado, mas não foi possível confirmar: ${confirmError.message}`); return; }
      const confirmed = new Map((confirmation ?? []).map((row) => [row.key, row.value ?? '']));
      if (updates.some((item) => (confirmed.get(item.key) ?? '') !== item.value)) { setError('O Supabase não confirmou todas as configurações. Tente salvar novamente.'); return; }
      setMessage('YouTube em português e español salvo e confirmado.');
    } catch (saveError) {
      const message = saveError instanceof DOMException && saveError.name === 'AbortError' ? 'A conexão com o Supabase demorou mais de 12 segundos. Verifique a conexão e tente novamente.' : saveError instanceof Error ? saveError.message : 'Não foi possível salvar as configurações.';
      setError(message);
    } finally { setLoading(false); }
  }

  if (!supabase) return <div className="media-panel"><strong>Supabase não configurada.</strong></div>;
  const videos = locale === 'pt' ? videosPt : videosEs;
  const channel = locale === 'pt' ? channelPt : channelEs;
  const languageLabel = locale === 'pt' ? 'Português' : 'Español LATAM';

  return <section className="media-panel">
    <div className="media-head">
      <div><span className="eyebrow">Redes</span><h2 className="serif">YouTube por idioma</h2><p>Cadastre até 5 vídeos para cada idioma. A Home em português usa o primeiro espaço; a Home /es usa o segundo.</p></div>
    </div>
    <div className="language-tabs" role="tablist" aria-label="Idioma dos vídeos do YouTube">
      <button type="button" className={locale === 'pt' ? 'language-tab active' : 'language-tab'} onClick={() => setLocale('pt')}>🇧🇷 Português</button>
      <button type="button" className={locale === 'es' ? 'language-tab active' : 'language-tab'} onClick={() => setLocale('es')}>🌎 Español LATAM</button>
    </div>
    <form onSubmit={save} className="settings-form">
      <label>Link do canal — {languageLabel}<input value={channel} onChange={(e) => locale === 'pt' ? setChannelPt(e.target.value) : setChannelEs(e.target.value)} placeholder="https://www.youtube.com/@KaridoCanto" /></label>
      <div className="youtube-admin-grid">
        {videos.map((video, index) => <div className="youtube-admin-card" key={index}>
          <div className="youtube-admin-card-head"><strong>{locale === 'pt' ? 'Vídeo' : 'Video'} {index + 1}</strong><label className="switch"><input type="checkbox" checked={video.enabled} onChange={(e) => update(locale, index, { enabled: e.target.checked })} /><span>{locale === 'pt' ? 'Mostrar na Home' : 'Mostrar en la Home'}</span></label></div>
          <label>{locale === 'pt' ? 'ID ou link do vídeo' : 'ID o enlace del video'}<input value={video.id} onChange={(e) => update(locale, index, { id: e.target.value })} placeholder="https://youtu.be/XXXXXXXXXXX" /></label>
          <label>{locale === 'pt' ? 'Título' : 'Título'}<input value={video.title} onChange={(e) => update(locale, index, { title: e.target.value })} placeholder={`${locale === 'pt' ? 'Título do vídeo' : 'Título del video'} ${index + 1}`} /></label>
          {normalizeVideoId(video.id) && <img className="youtube-admin-thumb" src={`https://i.ytimg.com/vi/${normalizeVideoId(video.id)}/hqdefault.jpg`} alt={locale === 'pt' ? 'Prévia do vídeo' : 'Vista previa del video'} />}
        </div>)}
      </div>
      <button className="btn primary" disabled={loading}>{loading ? 'SALVANDO…' : 'SALVAR YOUTUBE'}</button>
      {message && <p className="form-status success">{message}</p>}
      {error && <p className="form-status error">{error}</p>}
    </form>
  </section>;
}
