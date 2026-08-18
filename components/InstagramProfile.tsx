'use client';

import Script from 'next/script';

const INSTAGRAM_URL = 'https://www.instagram.com/karidocanto.craft/';

export default function InstagramProfile() {
  return (
    <div className="instagram-card">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={INSTAGRAM_URL}
        data-instgrm-version="14"
      >
        <div style={{ padding: 16 }}>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            <div style={{ fontSize: 42, lineHeight: 1, marginBottom: 14 }}>◎</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              Ver perfil de @karidocanto.craft no Instagram
            </div>
          </a>
        </div>
      </blockquote>

      <Script
        src="https://www.instagram.com/embed.js"
        strategy="afterInteractive"
        onLoad={() => {
          (window as any).instgrm?.Embeds?.process();
        }}
      />
    </div>
  );
}
