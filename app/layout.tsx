import './globals.css';
import './logo.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import NewsletterForm from '@/components/NewsletterForm';
import CloudflareAnalytics from '@/components/CloudflareAnalytics';
import LogoImage from '@/components/LogoImage';

export const metadata: Metadata = {
  metadataBase: new URL('https://karidocanto.com.br'),
  title: { default: 'KARI Do Canto | Artesanato com Afeto', template: '%s | KARI Do Canto' },
  description: 'Artesanato com afeto: cursos, projetos, dicas e passo a passo para criar peças para a casa.',
  alternates: { canonical: 'https://karidocanto.com.br' },
  openGraph: {
    title: 'KARI Do Canto | Artesanato com Afeto',
    description: 'Ideias, cursos e passo a passo para criar para a casa com amor e afeto.',
    url: 'https://karidocanto.com.br',
    siteName: 'KARI Do Canto',
    type: 'website',
  },
  icons: { icon: '/icon.svg', apple: '/apple-icon.svg' },
};

function Header() {
  return <>
    <div className="topbar"><div className="container topbar-inner"><span>✦ Cursos e projetos de artesanato com quem ensinou na televisão</span><span className="top-social">Instagram · YouTube · Facebook</span></div></div>
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="logo logo-mark" aria-label="KARI Do Canto — início"><LogoImage /></Link>
        <nav className="links" aria-label="Navegação principal">
          <Link href="/">INÍCIO</Link><Link href="/sobre">SOBRE KARI</Link><Link href="/cursos">CURSOS</Link><Link href="/projetos">PROJETOS</Link><Link href="/blog">BLOG</Link><Link href="/contato">CONTATO</Link>
          <Link className="btn primary" href="/cursos">ÁREA DO ALUNO</Link>
        </nav>
        <Link className="mobile-menu" href="/cursos" aria-label="Abrir área de cursos">☰</Link>
      </div>
    </header>
  </>;
}

function Footer() {
  return <>
    <section className="newsletter"><div className="container newsletter-inner"><div><strong>Receba inspiração no seu e-mail.</strong><span>Dicas, novidades, projetos e novos cursos.</span></div><NewsletterForm /></div></section>
    <footer className="footer"><div className="container footer-grid">
      <div><Link href="/" className="logo logo-footer" aria-label="KARI Do Canto — início"><LogoImage /></Link><p>Artesanato, criatividade e aprendizado para você criar com as próprias mãos.</p></div>
      <div><h4>Navegação</h4><p><Link href="/sobre">Sobre Kari</Link><br/><Link href="/cursos">Cursos</Link><br/><Link href="/projetos">Projetos</Link><br/><Link href="/blog">Blog</Link></p></div>
      <div><h4>Ajuda</h4><p><Link href="/contato">Contato</Link><br/>Perguntas frequentes<br/>Política de privacidade<br/>Termos de uso</p></div>
      <div><h4>Siga nas redes</h4><p><a href="https://www.instagram.com/karidocanto.craft/" target="_blank" rel="noreferrer">Instagram</a><br/><a href="https://www.youtube.com/@KaridoCanto" target="_blank" rel="noreferrer">YouTube</a></p></div>
    </div><div className="container footer-bottom"><span>© 2026 KARI Do Canto. Todos os direitos reservados.</span><span>Desenvolvido com ♥ pela Agência Rio de la Plata</span></div></footer>
  </>;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><Header/>{children}<Footer/><CloudflareAnalytics/></>;
}
