'use client';

import { useState } from 'react';
import Script from 'next/script';

const INSTAGRAM_URL = 'https://www.instagram.com/karidocanto.craft/';

export default function InstagramProfile() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="instagram-card">
      {!loaded ? (
        <div className="instagram-placeholder">
          <div className="instagram-mark">◎</div>
          <span className="eyebrow">Instagram</span>
          <h3 className="serif">@karidocanto.craft</h3>
          <p>Inspiração, projetos e bastidores do universo artesanal da Kari.</p>
          <button className="btn" onClick={() => setLoaded(true)}>CARREGAR INSTAGRAM</button>
          <a className="instagram-direct" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Abrir perfil ↗</a>
        </div>
      ) : (
        <>
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={INSTAGRAM_URL}
            data-instgrm-version="14"
          >
            <div style={{ padding: 16 }}>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Ver perfil de @karidocanto.craft no Instagram</a>
            </div>
          </blockquote>
          <Script src="https://www.instagram.com/embed.js" strategy="afterInteractive" onLoad={() => { (window as any).instgrm?.Embeds?.process(); }} />
        </>
      )}
    </div>
  );
}
