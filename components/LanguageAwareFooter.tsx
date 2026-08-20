'use client';
import { usePathname } from 'next/navigation';
import LanguageAwareLogo from '@/components/LanguageAwareLogo';
import LanguageAwareFooterLinks from '@/components/LanguageAwareFooterLinks';
import NewsletterForm from '@/components/NewsletterForm';

export default function LanguageAwareFooter({ siteVersion, buildShort }: { siteVersion: string; buildShort: string }) {
  const pathname = usePathname() || '/';
  const es = pathname === '/es' || pathname.startsWith('/es/');
  const agencyEmail = 'mailto:website@riodelaplata.com.br';
  return <>
    <section className="newsletter">
      <div className="container newsletter-inner">
        <div>
          <strong>{es ? 'Recibe inspiración en tu correo.' : 'Receba inspiração no seu e-mail.'}</strong>
          <span>{es ? 'Consejos, novedades, proyectos y nuevos cursos.' : 'Dicas, novidades, projetos e novos cursos.'}</span>
        </div>
        <NewsletterForm />
      </div>
    </section>
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <LanguageAwareLogo />
          <p>{es ? 'Artesanía, creatividad y aprendizaje para que crees con tus propias manos.' : 'Artesanato, criatividade e aprendizado para você criar com as próprias mãos.'}</p>
        </div>
        <div>
          <h2 className="footer-heading">{es ? 'Navegación' : 'Navegação'}</h2>
          <LanguageAwareFooterLinks />
        </div>
        <div>
          <h2 className="footer-heading">{es ? 'Sígueme en redes' : 'Siga nas redes'}</h2>
          <p><a href="https://www.instagram.com/karidocanto.craft/" target="_blank" rel="noreferrer">Instagram</a><br/><a href="https://www.youtube.com/@KaridoCanto" target="_blank" rel="noreferrer">YouTube</a></p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{es ? '© 2026 Kari Do Canto. Todos los derechos reservados.' : '© 2026 Kari Do Canto. Todos os direitos reservados.'}</span>
        <span>{siteVersion} · Build {buildShort}</span>
        <a href={agencyEmail}>{es ? 'Desarrollado con ♥ por Agência Rio de la Plata' : 'Desenvolvido com ♥ pela Agência Rio de la Plata'}</a>
      </div>
    </footer>
  </>;
}
