import type { MetadataRoute } from 'next';
import { getPublicContent } from '@/lib/content';

const base = 'https://karidocanto.com.br';
const projects = ['feltro-criacoes-com-amor','bolsa-patchwork','caixa-decorativa','album-de-memorias'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, posts] = await Promise.all([getPublicContent('curso'), getPublicContent('blog')]);
  const staticRoutes = ['', '/sobre', '/cursos', '/projetos', '/blog', '/contato', '/politica-de-privacidade', '/termos-de-uso'];
  return [
    ...staticRoutes.map(path => ({ url: `${base}${path}`, changeFrequency: path === '/blog' ? 'weekly' as const : 'monthly' as const, priority: path === '' ? 1 : 0.8 })),
    ...courses.map(item => ({ url: `${base}/cursos/${item.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...projects.map(slug => ({ url: `${base}/projetos/${slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...posts.map(item => ({ url: `${base}/blog/${item.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];
}
