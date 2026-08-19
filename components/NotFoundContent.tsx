'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function NotFoundContent({ image, alt }: { image: string; alt: string }) {
  const pathname = usePathname() || '/';
  const isSpanish = pathname === '/es' || pathname.startsWith('/es/');

  if (isSpanish) {
    return (
      <main className="pageHero not-found-page">
        <span className="eyebrow">¡Ups!</span>
        <h1 className="serif">Esta página salió del taller.</h1>
        <p>Tal vez el proyecto cambió de lugar. Todavía puedes volver a los cursos, proyectos y consejos de Kari.</p>
        <div className="not-found-image"><Image src={image} alt={alt || 'Kari Do Canto en su taller de artesanía'} width={1200} height={700} priority /></div>
        <div className="actions" style={{justifyContent:'center'}}>
          <Link className="btn primary" href="/es">VOLVER AL INICIO</Link>
          <Link className="btn" href="/es/blog">VER EL BLOG</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pageHero not-found-page">
      <span className="eyebrow">Ops!</span>
      <h1 className="serif">Essa página saiu do ateliê.</h1>
      <p>Talvez o projeto tenha mudado de lugar. Você ainda pode voltar para os cursos, projetos e dicas da Kari.</p>
      <div className="not-found-image"><Image src={image} alt={alt || 'Kari Do Canto em seu ateliê de artesanato'} width={1200} height={700} priority /></div>
      <div className="actions" style={{justifyContent:'center'}}>
        <Link className="btn primary" href="/">VOLTAR AO INÍCIO</Link>
        <Link className="btn" href="/blog">VER O BLOG</Link>
      </div>
    </main>
  );
}
