'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

const CHANNEL_URL = 'https://www.youtube.com/@KaridoCanto';
type Video = { title: string; videoId: string; enabled?: boolean };

function YouTubeThumbnail({ videoId, alt, featured = false }: { videoId: string; alt: string; featured?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="video-thumb-fallback" role="img" aria-label={alt}><span>▶</span></div>;
  return <img className={featured ? 'youtube-thumb-image youtube-thumb-featured' : 'youtube-thumb-image'} src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}

export default function YouTubeGallery({ videos = [], channel = CHANNEL_URL }: { videos?: Video[]; channel?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname() || '/';
  const isSpanish = pathname === '/es' || pathname.startsWith('/es/');
  const fallback = [{ title: isSpanish ? 'Videos de Kari' : 'Vídeos da Kari', videoId: '' }];
  const visibleVideos = videos.length ? videos : fallback;
  const featured = visibleVideos[0];
  const secondary = visibleVideos.slice(1);

  function openVideo(videoId: string) {
    setActive(videoId || 'channel');
  }

  return <>
    <div className="video-gallery">
      <button type="button" className="video-feature" onClick={() => openVideo(featured.videoId)} aria-label={`${isSpanish ? 'Ver' : 'Assistir'}: ${featured.title}`}>
        {featured.videoId ? <YouTubeThumbnail videoId={featured.videoId} alt={featured.title} featured /> : <div className="video-empty-image" aria-hidden="true" />}
        <span className="video-overlay" aria-hidden="true" />
        <span className="play-button" aria-hidden="true">▶</span>
        <span className="video-label" style={{ top: 'auto', bottom: '72px', left: '32px', margin: 0 }}>{isSpanish ? 'DESTACADO' : 'EM DESTAQUE'}</span>
        <strong style={{ bottom: '24px', left: '32px', right: '24px', display: 'block', lineHeight: 1.08, margin: 0 }}>{featured.title}</strong>
      </button>
      {secondary.length > 0 && <div className="video-secondary">{secondary.map((video) => <button type="button" className="video-small" key={video.videoId} onClick={() => openVideo(video.videoId)} aria-label={`${isSpanish ? 'Ver' : 'Assistir'}: ${video.title}`}>
        <span className="video-thumb"><YouTubeThumbnail videoId={video.videoId} alt={video.title} /><span className="play-small" aria-hidden="true">▶</span></span>
        <strong>{video.title}</strong>
      </button>)}</div>}
    </div>

    <div className="center video-channel-cta"><a className="btn primary" href={channel} target="_blank" rel="noreferrer">{isSpanish ? 'VER CANAL EN YOUTUBE ↗' : 'VER CANAL NO YOUTUBE ↗'}</a></div>

    {active && <div className="video-modal" role="dialog" aria-modal="true" aria-label={isSpanish ? 'Vídeo de YouTube' : 'Vídeo do YouTube'} onClick={() => setActive(null)}>
      <div className="video-modal-inner" onClick={(e) => e.stopPropagation()}><button type="button" className="video-close" onClick={() => setActive(null)} aria-label={isSpanish ? 'Cerrar' : 'Fechar'}>×</button>
        {active === 'channel' ? <div className="video-channel-placeholder"><span className="eyebrow">{isSpanish ? 'YouTube Kari Do Canto' : 'YouTube Kari do Canto'}</span><h3 className="serif">{isSpanish ? 'Registra los vídeos en el Panel Vital.' : 'Cadastre os vídeos no Painel Vital.'}</h3><p>{isSpanish ? 'La Home muestra hasta 5 vídeos configurados en el panel. Cuando no hay vídeos registrados, el canal oficial sigue disponible.' : 'A Home exibe até 5 vídeos configurados no painel. Quando nenhum vídeo estiver cadastrado, o canal oficial continua disponível.'}</p><a className="btn primary" href={channel} target="_blank" rel="noreferrer">{isSpanish ? 'ABRIR YOUTUBE ↗' : 'ABRIR O YOUTUBE ↗'}</a></div> : <div className="video-frame-wrap"><iframe src={`https://www.youtube-nocookie.com/embed/${active}?rel=0`} title={isSpanish ? 'Vídeo de Kari Do Canto' : 'Vídeo Kari do Canto'} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>}
      </div>
    </div>}
  </>;
}
