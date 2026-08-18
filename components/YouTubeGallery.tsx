'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

const CHANNEL_URL = 'https://www.youtube.com/@KaridoCanto';
type Video = { title: string; videoId: string };

function normalizeVideoId(value: string) {
  const match = value.trim().match(/(?:v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  return match?.[1] ?? value.trim().replace(/[^A-Za-z0-9_-]/g, '').slice(0, 11);
}

function YouTubeThumbnail({ videoId, alt, featured = false }: { videoId: string; alt: string; featured?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="video-thumb-fallback" aria-label={alt}><span>▶</span></div>;
  return <img className={featured ? 'youtube-thumb-image youtube-thumb-featured' : 'youtube-thumb-image'} src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}

export default function YouTubeGallery() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [videos, setVideos] = useState<Video[]>([]);
  const [channel, setChannel] = useState(CHANNEL_URL);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('site_settings').select('key,value').like('key', 'youtube_%').then(({ data }) => {
      const values = Object.fromEntries((data ?? []).map((row) => [row.key, row.value ?? '']));
      setChannel(values.youtube_url || CHANNEL_URL);
      const loaded = Array.from({ length: 5 }, (_, index) => {
        const suffix = index === 0 ? '' : `_${index + 1}`;
        const id = normalizeVideoId(values[`youtube_video_id${suffix}`] || '');
        const enabled = values[`youtube_video_enabled${suffix}`] !== 'false';
        return { title: values[`youtube_video_title${suffix}`] || `Vídeo ${index + 1}`, videoId: id, enabled };
      }).filter((video) => video.enabled && video.videoId);
      setVideos(loaded);
    });
  }, [supabase]);

  const fallback = [
    { title: 'Vídeos da Kari', videoId: '' },
  ];
  const visibleVideos = videos.length ? videos : fallback;
  const featured = visibleVideos[0];
  const secondary = visibleVideos.slice(1);

  function openVideo(videoId: string) {
    if (videoId) setActive(videoId);
    else setActive('channel');
  }

  return <>
    <div className="video-gallery">
      <button className="video-feature" onClick={() => openVideo(featured.videoId)} aria-label={`Assistir: ${featured.title}`}>
        {featured.videoId ? <YouTubeThumbnail videoId={featured.videoId} alt={featured.title} featured /> : <div className="video-empty-image" />}
        <span className="video-overlay" /><span className="play-button">▶</span>
        <span className="video-label">EM DESTAQUE</span><strong>{featured.title}</strong>
      </button>
      {secondary.length > 0 && <div className="video-secondary">{secondary.map((video) => <button className="video-small" key={video.videoId} onClick={() => openVideo(video.videoId)} aria-label={`Assistir: ${video.title}`}>
        <span className="video-thumb"><YouTubeThumbnail videoId={video.videoId} alt={video.title} /><span className="play-small">▶</span></span>
        <strong>{video.title}</strong>
      </button>)}</div>}
    </div>

    <div className="center video-channel-cta"><a className="btn primary" href={channel} target="_blank" rel="noreferrer">VER CANAL NO YOUTUBE ↗</a></div>

    {active && <div className="video-modal" role="dialog" aria-modal="true" aria-label="Vídeo do YouTube" onClick={() => setActive(null)}>
      <div className="video-modal-inner" onClick={(e) => e.stopPropagation()}><button className="video-close" onClick={() => setActive(null)} aria-label="Fechar">×</button>
        {active === 'channel' ? <div className="video-channel-placeholder"><span className="eyebrow">YouTube Kari do Canto</span><h3 className="serif">Cadastre os vídeos no Painel Vital.</h3><p>A Home exibe até 5 vídeos configurados no painel. Quando nenhum vídeo estiver cadastrado, o canal oficial continua disponível.</p><a className="btn primary" href={channel} target="_blank" rel="noreferrer">ABRIR O YOUTUBE ↗</a></div> : <div className="video-frame-wrap"><iframe src={`https://www.youtube-nocookie.com/embed/${active}?rel=0`} title="Vídeo Kari do Canto" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>}
      </div>
    </div>}
  </>;
}
