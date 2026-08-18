'use client';

import { useEffect, useRef, useState } from 'react';

const INSTAGRAM_URL = 'https://www.instagram.com/karidocanto.craft/';
const SCRIPT_ID = 'instagram-embed-script';

export default function InstagramProfile() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;
    let cancelled = false;

    const loadInstagram = () => {
      if (cancelled || loaded) return;
      setLoaded(true);

      const process = () => {
        if (!cancelled) window.instgrm?.Embeds?.process();
      };

      const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (existing) {
        if (window.instgrm?.Embeds) process();
        else existing.addEventListener('load', process, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = 'https://www.instagram.com/embed.js';
      script.onload = process;
      document.body.appendChild(script);
    };

    if (!('IntersectionObserver' in window)) {
      loadInstagram();
      return () => { cancelled = true; };
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        loadInstagram();
      }
    }, { rootMargin: '300px 0px' });

    observer.observe(target);
    return () => { cancelled = true; observer.disconnect(); };
  }, [loaded]);

  return (
    <div className="instagram-card" ref={containerRef}>
      {!loaded ? (
        <div className="instagram-placeholder">
          <div className="instagram-mark">◎</div>
          <span className="eyebrow">Instagram</span>
          <h3 className="serif">@karidocanto.craft</h3>
          <p>Inspiração, projetos e bastidores do universo artesanal da Kari.</p>
          <a className="btn" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">ABRIR INSTAGRAM ↗</a>
        </div>
      ) : (
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={INSTAGRAM_URL}
          data-instgrm-version="14"
          style={{ background: '#FFF', border: 0, margin: 0, maxWidth: '100%', minWidth: 0, width: '100%' }}
        >
          <div style={{ padding: 16 }}>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Ver perfil de @karidocanto.craft no Instagram</a>
          </div>
        </blockquote>
      )}
    </div>
  );
}

declare global {
  interface Window {
    instgrm?: { Embeds?: { process: () => void } };
  }
}
