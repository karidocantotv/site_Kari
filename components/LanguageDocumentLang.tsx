'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function LanguageDocumentLang() {
  const pathname = usePathname() || '/';
  useEffect(() => {
    document.documentElement.lang = pathname === '/es' || pathname.startsWith('/es/') ? 'es' : 'pt-BR';
  }, [pathname]);
  return null;
}
