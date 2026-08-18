'use client';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname() || '/';
  const isSpanish = pathname === '/es' || pathname.startsWith('/es/');
  const basePath = isSpanish ? (pathname.replace(/^\/es/, '') || '/') : pathname;
  const ptHref = basePath;
  const esHref = `/es${basePath === '/' ? '' : basePath}`;
  return <div className="language-switcher" aria-label="Idioma">
    <a className={!isSpanish ? 'active' : ''} href={ptHref} hrefLang="pt-BR">🇧🇷 PT</a>
    <span aria-hidden="true">|</span>
    <a className={isSpanish ? 'active' : ''} href={esHref} hrefLang="es">🌎 ES</a>
  </div>;
}
