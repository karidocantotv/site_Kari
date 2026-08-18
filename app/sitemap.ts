import type { MetadataRoute } from 'next';

const base = 'https://karidocanto.com.br';

const courses = [
  'feltro-criacoes-com-amor',
  'patchwork-do-basico',
  'arte-em-madeira',
  'scrapbook-memorias',
];

const projects = [
  'feltro-criacoes-com-amor',
  'bolsa-patchwork',
  'caixa-decorativa',
  'album-de-memorias',
];

const posts = [
  'cestinho-de-tecido',
  'como-escolher-linhas',
  'pintura-em-madeira',
  'flores-de-feltro',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/sobre', '/cursos', '/projetos', '/blog', '/contato', '/politica-de-privacidade', '/termos-de-uso'];
  const now = new Date();

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: path === '/blog' ? 'weekly' as const : 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
    })),
    ...courses.map((slug) => ({
      url: `${base}/cursos/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...projects.map((slug) => ({
      url: `${base}/projetos/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...posts.map((slug) => ({
      url: `${base}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
