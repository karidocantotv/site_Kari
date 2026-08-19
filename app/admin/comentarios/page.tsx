import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminBrand from '@/components/AdminBrand';
import AdminCommentsManager from '@/components/AdminCommentsManager';

export const metadata = { title: 'Comentários — Painel Vital' };

export default function CommentsAdminPage(){return <AdminAuthGuard><main className="admin"><div className="container"><div className="adminbox"><AdminBrand /><AdminCommentsManager /></div></div></main></AdminAuthGuard>}
