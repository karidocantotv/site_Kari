import Link from 'next/link';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSectionSettings from '@/components/AdminSectionSettings';
import AdminContentManager from '@/components/AdminContentManager';

export const metadata = { title: 'Configuração — cursos' };

export default function Page() {
  return <AdminAuthGuard><main className="admin"><div className="container"><div className="adminbox">
    <Link className="more" href="/admin/dashboard">← VOLTAR AO PAINEL</Link>
    <AdminSectionSettings section="cursos" />
    <AdminContentManager type="curso" />
  </div></div></main></AdminAuthGuard>;
}
