'use client';

import { useState } from 'react';

const CHANNEL_URL = 'https://www.youtube.com/@KaridoCanto';
type Video = { title: string; videoId: string; enabled?: boolean };

function YouTubeThumbnail({ videoId, alt, featured = false }: { videoId: string; alt: string; featured?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="video-thumb-fallback" role="img" aria-label={alt}><span>▶</span></div>;
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg?v=${encodeURIComponent(videoId)}`;
  return <img className={featured ? 'youtube-thumb-image youtube-thumb-featured' : 'youtube-thumb-image'} src={thumbnailUrl} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}

export default function YouTubeGallery({ videos = [], channel = CHANNEL_URL }: { videos?: Video[]; channel?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const fallback = [{ title: 'Vídeos da Kari', videoId: '' }];
  const visibleVideos = videos.length ? videos : fallback;
  const featured = visibleVideos[0];
  const secondary = visibleVideos.slice(1);

  function openVideo(videoId: string) {
    setActive(videoId || 'channel');
  }

  return <>
    <div className="video-gallery">
      <button type="button" className="video-feature" onClick={() => openVideo(featured.videoId)} aria-label={`Assistir: ${featured.title}`}>
        {featured.videoId ? <YouTubeThumbnail videoId={featured.videoId} alt={featured.title} featured /> : <div className="video-empty-image" aria-hidden="true" />}
        <span className="video-overlay" aria-hidden="true" /><span className="play-button" aria-hidden="true">▶</span>
        <span className="video-label">EM DESTAQUE</span><strong>{featured.title}</strong>
      </button>
      {secondary.length > 0 && <div className="video-secondary">{secondary.map((video) => <button type="button" className="video-small" key={video.videoId} onClick={() => openVideo(video.videoId)} aria-label={`Assistir: ${video.title}`}>
        <span className="video-thumb"><YouTubeThumbnail videoId={video.videoId} alt={video.title} /><span className="play-small" aria-hidden="true">▶</span></span>
        <strong>{video.title}</strong>
      </button>)}</div>}
    </div>

    <div className="center video-channel-cta"><a className="btn primary" href={channel} target="_blank" rel="noreferrer">VER CANAL NO YOUTUBE ↗</a></div>

    {active && <div className="video-modal" role="dialog" aria-modal="true" aria-label="Vídeo do YouTube" onClick={() => setActive(null)}>
      <div className="video-modal-inner" onClick={(e) => e.stopPropagation()}><button type="button" className="video-close" onClick={() => setActive(null)} aria-label="Fechar">×</button>
        {active === 'channel' ? <div className="video-channel-placeholder"><span className="eyebrow">YouTube Kari do Canto</span><h3 className="serif">Cadastre os vídeos no Painel Vital.</h3><p>A Home exibe até 5 vídeos configurados no painel. Quando nenhum vídeo estiver cadastrado, o canal oficial continua disponível.</p><a className="btn primary" href={channel} target="_blank" rel="noreferrer">ABRIR O YOUTUBE ↗</a></div> : <div className="video-frame-wrap"><iframe src={`https://www.youtube-nocookie.com/embed/${active}?rel=0`} title="Vídeo Kari do Canto" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>}
      </div>
    </div>}

    <style jsx>{`
      .video-feature {
        aspect-ratio: 16 / 9 !important;
        min-height: 0 !important;
      }
      .youtube-thumb-featured {
        aspect-ratio: 16 / 9 !important;
        object-fit: cover;
      }
      .video-secondary {
        align-items: stretch;
      }
      .video-small {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }
      .video-thumb {
        display: block;
        width: 100%;
        aspect-ratio: 16 / 9;
        flex: 0 0 auto;
      }
      .video-small strong {
        min-height: 2.4em;
      }
    `}</style>
  </>;
}
