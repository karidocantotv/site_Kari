'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const links = [
  ['INÍCIO', '/'],
  ['SOBRE Kari', '/sobre'],
  ['CURSOS', '/cursos'],
  ['PROJETOS', '/projetos'],
  ['BLOG', '/blog'],
  ['CONTATO', '/contato'],
] as const;

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || '/';
  const es = pathname === '/es' || pathname.startsWith('/es/');
  const path = (href:string) => es ? `/es${href === '/' ? '' : href}` : href;
  const labels = es ? ['INICIO','SOBRE KARI','CURSOS','PROYECTOS','BLOG','CONTACTO'] : ['INÍCIO','SOBRE Kari','CURSOS','PROJETOS','BLOG','CONTATO'];

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className={`mobile-menu-wrap${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="mobile-menu"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(value => !value)}
      >
        <span aria-hidden="true">{open ? '×' : '☰'}</span>
      </button>
      {open && (
        <div className="mobile-nav-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      )}
      <nav id="mobile-navigation" className="mobile-nav" aria-label="Navegação mobile" aria-hidden={!open}>
        {links.map(([, href], i) => (
          <a key={href} href={path(href)} onClick={() => setOpen(false)}>{labels[i]}</a>
        ))}
        <div className="mobile-language"><a href={es ? (pathname.replace(/^\/es/, '') || '/') : pathname}>🇧🇷 PT</a><span>|</span><a href={es ? pathname : `/es${pathname === '/' ? '' : pathname}`}>🌎 ES</a></div>
        <a className="btn primary" href={path('/cursos')} onClick={() => setOpen(false)}>{es ? 'ÁREA DEL ALUMNO' : 'ÁREA DO ALUNO'}</a>
      </nav>
    </div>
  );
}
