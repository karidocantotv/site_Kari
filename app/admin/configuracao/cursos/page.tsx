import Link from 'next/link';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminSectionSettings from '@/components/AdminSectionSettings';

export const metadata = { title: 'Configuração — cursos' };

export default function Page() {
  return <AdminAuthGuard><main className="admin"><div className="container"><div className="adminbox">
    <Link className="more" href="/admin/dashboard">← VOLTAR AO PAINEL</Link>
    <AdminSectionSettings section="cursos" />
  </div></div></main></AdminAuthGuard>;
}
