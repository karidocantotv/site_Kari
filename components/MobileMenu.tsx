'use client';

import { useEffect, useState } from 'react';

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
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <a className="btn primary" href="/cursos" onClick={() => setOpen(false)}>ÁREA DO ALUNO</a>
      </nav>
    </div>
  );
}
