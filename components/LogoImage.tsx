'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function LogoImage({ className = '', alt = 'Kari Do Canto — Artesanato com Afeto' }: { className?: string; alt?: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const { data } = supabase.storage.from('site').getPublicUrl('brand/site-logo');
    if (data.publicUrl) setSrc(data.publicUrl);
  }, []);

  if (!src) return null;

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      decoding="async"
      onError={() => setSrc(null)}
    />
  );
}
