import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kari Do Canto — Artesanato com Afeto',
    short_name: 'Kari Do Canto',
    description: 'Cursos, projetos, dicas e passo a passo de artesanato com afeto.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f4ec',
    theme_color: '#879681',
    lang: 'pt-BR',
    icons: [
      { src: '/pwa-icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
      { src: '/pwa-icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}
