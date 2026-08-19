'use client';
import { usePathname } from 'next/navigation';

export default function LanguageAwareFooterText() {
  const es = (usePathname() || '/').startsWith('/es');
  return <>
    <div className="footer-language-copy">
      <strong>{es ? 'Recibe inspiración en tu correo.' : 'Receba inspiração no seu e-mail.'}</strong>
      <span>{es ? 'Consejos, novedades, proyectos y nuevos cursos.' : 'Dicas, novidades, projetos e novos cursos.'}</span>
    </div>
  </>;
}
