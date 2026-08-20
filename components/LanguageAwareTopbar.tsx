'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageAwareTopbar() {
  const pathname = usePathname() || '/';
  const es = pathname === '/es' || pathname.startsWith('/es/');
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <span className="top-language">
          {es ? (
            <>Este sitio también está disponible en: <Link href="/">🇧🇷 Português</Link> 🇵🇹</>
          ) : (
            <>Este site também está disponível em: <Link href="/es">🇪🇸 Español</Link> 🇦🇷 🇺🇾 🇵🇾 🇨🇱</>
          )}
        </span>
      </div>
    </div>
  );
}
