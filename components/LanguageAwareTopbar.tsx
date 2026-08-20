'use client';
import { usePathname } from 'next/navigation';

export default function LanguageAwareTopbar() {
  const pathname = usePathname() || '/';
  const es = pathname === '/es' || pathname.startsWith('/es/');

  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <span className="top-language">
          {es ? (
            <>Este site também está disponível em: <a href="https://karidocanto.com.br/">🇧🇷 Português</a> 🇵🇹</>
          ) : (
            <>Este sitio también está disponible en: <a href="https://karidocanto.com.br/es">🇪🇸 Español</a> 🇦🇷 🇺🇾 🇵🇾 🇨🇱</>
          )}
        </span>
      </div>
    </div>
  );
}
