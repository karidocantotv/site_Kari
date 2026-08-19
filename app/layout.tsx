import './globals.css';
import './logo.css';
import type { Metadata, Viewport } from 'next';
import CloudflareAnalytics from '@/components/CloudflareAnalytics';
import MobileMenu from '@/components/MobileMenu';
import LanguageAwareNav from '@/components/LanguageAwareNav';
import LanguageAwareTopbar from '@/components/LanguageAwareTopbar';
import LanguageAwareLogo from '@/components/LanguageAwareLogo';
import LanguageAwareFooter from '@/components/LanguageAwareFooter';
import LanguageDocumentLang from '@/components/LanguageDocumentLang';
import { SITE_VERSION } from '@/lib/site-version';

const buildVersion = process.env.CF_PAGES_COMMIT_SHA || process.env.NEXT_PUBLIC_BUILD_VERSION || 'dev';
const buildShort = buildVersion === 'dev' ? 'dev' : buildVersion.slice(0, 7);

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export const metadata: Metadata = {
  metadataBase: new URL('https://karidocanto.com.br'),
  title: { default: 'Kari Do Canto | Artesanato com Afeto', template: '%s | Kari Do Canto' },
  description: 'Artesanato com afeto: cursos, projetos, dicas e passo a passo para criar peças para a casa.',
  openGraph: { title: 'Kari Do Canto | Artesanato com Afeto', description: 'Ideias, cursos e paso a paso para crear para la casa con amor y afecto.', url: 'https://karidocanto.com.br', siteName: 'Kari Do Canto', type: 'website', images: [{ url: '/api/og-image', width: 1200, height: 630, alt: 'Kari Do Canto — Artesanato com Afeto' }] },
  twitter: { card: 'summary_large_image', title: 'Kari Do Canto | Artesanato com Afeto', description: 'Ideias, cursos e passo a passo para criar para a casa com amor e afeto.', images: ['/api/og-image'] },
  icons: { icon: '/icon.svg', apple: '/apple-icon.svg' },
  applicationName: 'Kari Do Canto',
  manifest: '/manifest.webmanifest?v=1.6.6',
  themeColor: '#879681',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Kari Do Canto' },
};

function Header() {
  return <><LanguageAwareTopbar/><header className="nav"><div className="container nav-inner"><LanguageAwareLogo/><LanguageAwareNav/><MobileMenu/></div></header></>;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><LanguageDocumentLang/><Header/>{children}<LanguageAwareFooter siteVersion={SITE_VERSION} buildShort={buildShort}/><CloudflareAnalytics/></body></html>;
}
