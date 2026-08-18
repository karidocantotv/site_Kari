'use client';

import { useEffect, useState } from 'react';

const FALLBACK = '/brand/kari-do-canto.svg';

export default function LogoImage({ className = '', alt = 'Kari Do Canto — Artesanato com Afeto' }: { className?: string; alt?: string }) {
  const [src, setSrc] = useState(FALLBACK);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!base) return;
    setSrc(`${base.replace(/\/$/, '')}/storage/v1/object/public/site/brand/site-logo?v=${Date.now()}`);
  }, []);

  return <img className={className} src={src} alt={alt} onError={() => setSrc(FALLBACK)} />;
}
