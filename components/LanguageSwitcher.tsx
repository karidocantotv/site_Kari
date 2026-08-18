'use client';
import { usePathname } from 'next/navigation';

const LANGUAGE_COOKIE = 'kari_locale';

function rememberLocale(locale: 'pt-BR' | 'es-LA') {
  document.cookie = `${LANGUAGE_COOKIE}=${locale}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export default function LanguageSwitcher() {
  const pathname = usePathname() || '/';
  const isSpanish = pathname === '/es' || pathname.startsWith('/es/');
  const basePath = isSpanish ? (pathname.replace(/^\/es/, '') || '/') : pathname;
  const ptHref = basePath;
  const esHref = `/es${basePath === '/' ? '' : basePath}`;
  return <div className="language-switcher" aria-label="Idioma">
    <a className={!isSpanish ? 'active' : ''} href={ptHref} hrefLang="pt-BR" onClick={() => rememberLocale('pt-BR')}>🇧🇷 PT</a>
    <span aria-hidden="true">|</span>
    <a className={isSpanish ? 'active' : ''} href={esHref} hrefLang="es" onClick={() => rememberLocale('es-LA')}>🌎 ES</a>
  </div>;
}
