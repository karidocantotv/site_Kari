import AdminAuthGuard from '@/components/AdminAuthGuard';
import { SITE_VERSION } from '@/lib/site-version';
import AdminBrand from '@/components/AdminBrand';
import Link from 'next/link';
import AdminDashboardModules from '@/components/AdminDashboardModules';
import AdminCloudflareAnalytics from '@/components/AdminCloudflareAnalytics';

export const metadata = { title: 'Painel Vital — Kari Do Canto' };

export default function Dashboard() {
  const analyticsConfigured = Boolean(process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN);
  const buildVersion = process.env.CF_PAGES_COMMIT_SHA || process.env.NEXT_PUBLIC_BUILD_VERSION || 'dev';
  const buildShort = buildVersion === 'dev' ? 'dev' : buildVersion.slice(0, 7);

  return <AdminAuthGuard><main className="admin">
    <div className="container">
      <div className="adminbox">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <AdminBrand />
            <h1 className="serif">Kari Do Canto</h1>
            <p>Central administrativa para conteúdo, imagens, leads, cursos e métricas do site.</p>
          </div>
          <div className="analytics-status is-on" title={`Build completo: ${buildVersion}`}><span className="analytics-dot" /> {SITE_VERSION} · Build {buildShort}</div>
        </div>
        <AdminDashboardModules />
        <div className="grid4" style={{ marginTop: 24 }}>
          <Link prefetch={false} className="card admin-link-card" href="/admin/configuracao/blog"><div className="card-body"><span className="tag">Conteúdo</span><h3>Blog</h3><p>Configuração da seção, títulos e apresentação.</p><span className="more">ABRIR CONFIGURAÇÃO →</span></div></Link>
          <Link prefetch={false} className="card admin-link-card" href="/admin/configuracao/projetos"><div className="card-body"><span className="tag">Conteúdo</span><h3>Projetos</h3><p>Configuração da seção, títulos e apresentação.</p><span className="more">ABRIR CONFIGURAÇÃO →</span></div></Link>
          <Link prefetch={false} className="card admin-link-card" href="/admin/configuracao/cursos"><div className="card-body"><span className="tag">Produtos</span><h3>Cursos</h3><p>Configuração da seção, títulos e apresentação.</p><span className="more">ABRIR CONFIGURAÇÃO →</span></div></Link>
          <Link prefetch={false} className="card admin-link-card" href="/admin/newsletter"><div className="card-body"><span className="tag">CRM</span><h3>Leads</h3><p>Leads e inscritos são separados por idioma no módulo Newsletter.</p><span className="more">ABRIR NEWSLETTER →</span></div></Link>
        </div>
        <section className="analytics-panel" aria-labelledby="analytics-title">
          <div className="analytics-panel-head"><div><span className="eyebrow">Métricas</span><h2 id="analytics-title" className="serif">Cloudflare Web Analytics</h2><p>Dados reais de visitas e experiência dos visitantes do site.</p></div><span className={`analytics-status ${analyticsConfigured ? 'is-on' : ''}`}><span className="analytics-dot" /> {analyticsConfigured ? 'Configurado' : 'Aguardando token'}</span></div>
          {analyticsConfigured ? <AdminCloudflareAnalytics /> : <div className="analytics-card"><strong>Analytics não configurado</strong><small>Adicione o token do Cloudflare Web Analytics para carregar os dados.</small></div>}
          <a className="btn primary analytics-link" href="https://dash.cloudflare.com/?to=/:account/analytics/web-analytics" target="_blank" rel="noreferrer">ABRIR WEB ANALYTICS ↗</a>
        </section>
        <p style={{ marginTop: 28, fontSize: 11 }}>{SITE_VERSION} · Build completo: {buildVersion} · Criado por Agência Rio de la Plata.</p>
      </div>
    </div>
  </main></AdminAuthGuard>;
}
