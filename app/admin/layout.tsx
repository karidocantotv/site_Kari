import type { Metadata } from 'next';
import PWARegister from '@/components/PWARegister';

export const metadata: Metadata = {
  title: 'Painel Vital',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <><PWARegister />{children}</>;
}
