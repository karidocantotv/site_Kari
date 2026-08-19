'use client';

const FALLBACK = '/brand/kari-do-canto.svg';

export default function LogoImage({ className = '', alt = 'Kari Do Canto — Artesanato com Afeto' }: { className?: string; alt?: string }) {
  return <img className={className} src={FALLBACK} alt={alt} width="220" height="121" decoding="async" />;
}
