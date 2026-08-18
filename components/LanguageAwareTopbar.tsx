'use client';
import { usePathname } from 'next/navigation';

export default function LanguageAwareTopbar() {
  const pathname = usePathname() || '/';
  const es = pathname === '/es' || pathname.startsWith('/es/');
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <span>{es ? '✦ Cursos y proyectos de artesanía con quien enseñó en televisión' : '✦ Cursos e projetos de artesanato com quem ensinou na televisão'}</span>
        <span className="top-social">Instagram · YouTube · Facebook</span>
      </div>
    </div>
  );
}
