export const metadata={title:'Painel Vital — Kari do Canto'};

export default function Dashboard(){
  const analyticsConfigured = Boolean(process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN);

  return <main className="admin">
    <div className="container">
      <div className="adminbox">
        <span className="eyebrow">Painel Vital</span>
        <h1 className="serif">Kari do Canto</h1>
        <p>Central administrativa preparada para conteúdo, leads, cursos e métricas do site.</p>

        <div className="grid4" style={{marginTop:24}}>
          <div className="card"><div className="card-body"><span className="tag">Conteúdo</span><h3>Blog</h3><p>Gerenciar artigos, categorias, SEO e imagens.</p></div></div>
          <div className="card"><div className="card-body"><span className="tag">Conteúdo</span><h3>Projetos</h3><p>Gerenciar passo a passo e galerias.</p></div></div>
          <div className="card"><div className="card-body"><span className="tag">Produtos</span><h3>Cursos</h3><p>Estrutura pronta para catálogo e checkout.</p></div></div>
          <div className="card"><div className="card-body"><span className="tag">CRM</span><h3>Leads</h3><p>Captura preparada para Supabase e futura gestão comercial.</p></div></div>
        </div>

        <section className="analytics-panel" aria-labelledby="analytics-title">
          <div className="analytics-panel-head">
            <div>
              <span className="eyebrow">Métricas</span>
              <h2 id="analytics-title" className="serif">Cloudflare Web Analytics</h2>
              <p>Monitoramento de visitas e experiência real dos visitantes do site.</p>
            </div>
            <span className={`analytics-status ${analyticsConfigured ? 'is-on' : ''}`}>
              <span className="analytics-dot" /> {analyticsConfigured ? 'Configurado' : 'Aguardando token'}
            </span>
          </div>
          <div className="analytics-grid">
            <div className="analytics-card"><span>Web Analytics</span><strong>{analyticsConfigured ? 'Ativo' : 'Não configurado'}</strong><small>Beacon RUM instalado no site.</small></div>
            <div className="analytics-card"><span>Core Web Vitals</span><strong>Monitorados</strong><small>LCP, INP, CLS, TTFB e FCP.</small></div>
            <div className="analytics-card"><span>Relatórios</span><strong>Cloudflare</strong><small>Os dados e gráficos completos ficam no painel do Cloudflare.</small></div>
          </div>
          <a className="btn primary analytics-link" href="https://dash.cloudflare.com/?to=/:account/analytics/web-analytics" target="_blank" rel="noreferrer">ABRIR WEB ANALYTICS ↗</a>
        </section>

        <p style={{marginTop:28,fontSize:11}}>Criado por Agência Rio de la Plata.</p>
      </div>
    </div>
  </main>
}
