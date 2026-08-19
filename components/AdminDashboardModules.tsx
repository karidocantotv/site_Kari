'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import AdminImageSizeGuide from '@/components/AdminImageSizeGuide';

const AdminMediaManager = dynamic(() => import('@/components/AdminMediaManager'), {
  loading: () => <ModuleLoading label="Carregando gerenciador de imagens…" />,
});

const AdminNewsletterManager = dynamic(() => import('@/components/AdminNewsletterManager'), {
  loading: () => <ModuleLoading label="Carregando newsletter…" />,
});

const AdminYouTubeManager = dynamic(() => import('@/components/AdminYouTubeManager'), {
  loading: () => <ModuleLoading label="Carregando configuração do YouTube…" />,
});

function ModuleLoading({ label }: { label: string }) {
  return <section className="media-panel admin-module-loading" aria-live="polite"><span className="eyebrow">Painel Vital</span><p>{label}</p></section>;
}

type Module = 'media' | 'youtube' | 'newsletter';

export default function AdminDashboardModules() {
  const [module, setModule] = useState<Module | null>(null);

  if (!module) {
    return <section className="admin-module-launcher" aria-label="Ferramentas do Painel Vital">
      <div className="admin-module-intro">
        <div><span className="eyebrow">Ferramentas</span><h2 className="serif">Escolha o que deseja administrar</h2><p>Os módulos são carregados somente quando você abre cada um. Isso deixa o Painel Vital mais rápido e evita consultas desnecessárias.</p></div>
      </div>
      <div className="grid2 admin-module-grid">
        <button type="button" className="card admin-module-button" onClick={() => setModule('media')}>
          <div className="card-body"><span className="tag">Conteúdo visual</span><h3>Mídia</h3><p>Gerencie logo, preview social e imagens do site.</p><span className="more">ABRIR GERENCIADOR →</span></div>
        </button>
        <button type="button" className="card admin-module-button" onClick={() => setModule('youtube')}>
          <div className="card-body"><span className="tag">Redes</span><h3>YouTube</h3><p>Cadastre até 5 vídeos que aparecem na Home, sem autoplay.</p><span className="more">ABRIR CONFIGURAÇÃO →</span></div>
        </button>
        <button type="button" className="card admin-module-button" onClick={() => setModule('newsletter')}>
          <div className="card-body"><span className="tag">Comunicação</span><h3>Newsletter</h3><p>Separe inscritos PT/ES, crie campanhas e envie e-mails.</p><span className="more">ABRIR NEWSLETTER →</span></div>
        </button>
      </div>
    </section>;
  }

  return <section>
    <button type="button" className="more admin-back-button" onClick={() => setModule(null)}>← VOLTAR ÀS FERRAMENTAS</button>
    {module === 'media' ? <><AdminImageSizeGuide /><AdminMediaManager /></> : module === 'youtube' ? <AdminYouTubeManager /> : <AdminNewsletterManager />}
  </section>;
}
