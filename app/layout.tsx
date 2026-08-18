import './globals.css';
import './logo.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import NewsletterForm from '@/components/NewsletterForm';
import CloudflareAnalytics from '@/components/CloudflareAnalytics';
import LogoImage from '@/components/LogoImage';
import { SITE_VERSION } from '@/lib/site-version';

const buildVersion = process.env.CF_PAGES_COMMIT_SHA || process.env.NEXT_PUBLIC_BUILD_VERSION || 'dev';
const buildShort = buildVersion === 'dev' ? 'dev' : buildVersion.slice(0, 7);

export const metadata: Metadata = {
  metadataBase: new URL('https://karidocanto.com.br'),
  title: { default: 'Kari Do Canto | Artesanato com Afeto', template: '%s | Kari Do Canto' },
  description: 'Artesanato com afeto: cursos, projetos, dicas e passo a passo para criar peças para a casa.',
  openGraph: {
    title: 'Kari Do Canto | Artesanato com Afeto',
    description: 'Ideias, cursos e passo a passo para criar para a casa com amor e afeto.',
    url: 'https://karidocanto.com.br',
    siteName: 'Kari Do Canto',
    type: 'website',
    images: [{
      url: '/api/og-image',
      width: 1200,
      height: 630,
      alt: 'Kari Do Canto — Artesanato com Afeto',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kari Do Canto | Artesanato com Afeto',
    description: 'Ideias, cursos e passo a passo para criar para a casa com amor e afeto.',
    images: ['/api/og-image'],
  },
  icons: { icon: '/icon.svg', apple: '/apple-icon.svg' },
  applicationName: 'Kari Do Canto',
  manifest: '/manifest.webmanifest?v=1.6.6',
  themeColor: '#879681',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Kari Do Canto' },
};

function Header() {
  return <>
    <div className="topbar"><div className="container topbar-inner"><span>✦ Cursos e projetos de artesanato com quem ensinou na televisão</span><span className="top-social">Instagram · YouTube · Facebook</span></div></div>
    <header className="nav">
      <div className="container nav-inner">
        <a href="/" className="logo logo-mark" aria-label="Kari Do Canto — início"><LogoImage /></a>
        <nav className="links" aria-label="Navegação principal">
          <a href="/">INÍCIO</a><a href="/sobre">SOBRE Kari</a><a href="/cursos">CURSOS</a><a href="/projetos">PROJETOS</a><a href="/blog">BLOG</a><a href="/contato">CONTATO</a>
          <a className="btn primary" href="/cursos">ÁREA DO ALUNO</a>
        </nav>
        <a className="mobile-menu" href="/cursos" aria-label="Abrir área de cursos">☰</a>
      </div>
    </header>
  </>;
}

function Footer() {
  return <>
    <section className="newsletter"><div className="container newsletter-inner"><div><strong>Receba inspiração no seu e-mail.</strong><span>Dicas, novidades, projetos e novos cursos.</span></div><NewsletterForm /></div></section>
    <footer className="footer"><div className="container footer-grid">
      <div><a href="/" className="logo logo-footer" aria-label="Kari Do Canto — início"><LogoImage /></a><p>Artesanato, criatividade e aprendizado para você criar com as próprias mãos.</p></div>
      <div><h2 className="footer-heading">Navegação</h2><p><a href="/sobre">Sobre Kari</a><br/><a href="/cursos">Cursos</a><br/><a href="/projetos">Projetos</a><br/><a href="/blog">Blog</a></p></div>
      <div><h2 className="footer-heading">Ajuda</h2><p><a href="/contato">Contato</a><br/><a href="/politica-de-privacidade">Política de privacidade</a><br/><a href="/termos-de-uso">Termos de uso</a></p></div>
      <div><h2 className="footer-heading">Siga nas redes</h2><p><a href="https://www.instagram.com/karidocanto.craft/" target="_blank" rel="noreferrer">Instagram</a><br/><a href="https://www.youtube.com/@KaridoCanto" target="_blank" rel="noreferrer">YouTube</a></p></div>
    </div><div className="container footer-bottom"><span>© 2026 Kari Do Canto. Todos os direitos reservados.</span><span>{SITE_VERSION} · Build {buildShort}</span><span>Desenvolvido com ♥ pela Agência Rio de la Plata</span></div></footer>
  </>;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><Header/>{children}<Footer/><CloudflareAnalytics/></body></html>;
}
