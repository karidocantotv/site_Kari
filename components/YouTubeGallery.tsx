'use client';

import Image from 'next/image';
import { useState } from 'react';

const CHANNEL_URL = 'https://www.youtube.com/@KaridoCanto';

// Os IDs podem ser preenchidos quando selecionarmos os vídeos definitivos da Kari.
// Enquanto isso, as imagens servem como referência visual e os cards levam ao canal oficial.
const videos = [
  { title: 'Passo a passo e técnicas de artesanato', image: '/images/blog-cestinho.jpg', videoId: '' },
  { title: 'Dicas para criar com mais facilidade', image: '/images/blog-linhas.jpg', videoId: '' },
  { title: 'Técnicas que fazem diferença no acabamento', image: '/images/blog-madeira.jpg', videoId: '' },
  { title: 'Ideias para seus próximos projetos', image: '/images/blog-feltro.jpg', videoId: '' },
  { title: 'Inspiração para colocar a criatividade em prática', image: '/images/course-scrapbook.jpg', videoId: '' },
];

export default function YouTubeGallery() {
  const [active, setActive] = useState<string | null>(null);
  const featured = videos[0];
  const secondary = videos.slice(1);

  return (
    <>
      <div className="video-gallery">
        <button className="video-feature" onClick={() => setActive(featured.videoId || 'channel')} aria-label={`Assistir: ${featured.title}`}>
          <Image src={featured.image} alt="Artesanato com Kari do Canto" fill sizes="(max-width: 800px) 100vw, 760px" priority={false} />
          <span className="video-overlay" />
          <span className="play-button">▶</span>
          <span className="video-label">EM DESTAQUE</span>
          <strong>{featured.title}</strong>
        </button>
        <div className="video-secondary">
          {secondary.map((video) => (
            <button className="video-small" key={video.title} onClick={() => setActive(video.videoId || 'channel')} aria-label={`Assistir: ${video.title}`}>
              <span className="video-thumb"><Image src={video.image} alt="" fill sizes="(max-width: 800px) 50vw, 260px" /><span className="play-small">▶</span></span>
              <strong>{video.title}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="center video-channel-cta">
        <a className="btn primary" href={CHANNEL_URL} target="_blank" rel="noreferrer">VER CANAL NO YOUTUBE ↗</a>
      </div>

      {active && (
        <div className="video-modal" role="dialog" aria-modal="true" aria-label="Vídeo do YouTube" onClick={() => setActive(null)}>
          <div className="video-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button className="video-close" onClick={() => setActive(null)} aria-label="Fechar">×</button>
            {active === 'channel' ? (
              <div className="video-channel-placeholder">
                <span className="eyebrow">YouTube Kari do Canto</span>
                <h3 className="serif">Escolha um vídeo no canal da Kari.</h3>
                <p>Os vídeos são carregados somente quando você escolhe assistir, mantendo a página leve.</p>
                <a className="btn primary" href={CHANNEL_URL} target="_blank" rel="noreferrer">ABRIR O YOUTUBE ↗</a>
              </div>
            ) : (
              <div className="video-frame-wrap">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${active}?autoplay=1&rel=0`}
                  title="Vídeo Kari do Canto"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
