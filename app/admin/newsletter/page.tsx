import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminBrand from '@/components/AdminBrand';
import AdminNewsletterManager from '@/components/AdminNewsletterManager';

export const metadata = { title: 'Newsletter — Painel Vital' };

export default function NewsletterAdminPage() {
  return <AdminAuthGuard><main className="admin"><div className="container"><div className="adminbox"><AdminBrand /><AdminNewsletterManager /></div></div></main></AdminAuthGuard>;
}
