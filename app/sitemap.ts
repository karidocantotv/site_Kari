import type { MetadataRoute } from 'next';
import { getPublicContent } from '@/lib/content';

const base = 'https://karidocanto.com.br';
const projects = ['feltro-criacoes-com-amor','bolsa-patchwork','caixa-decorativa','album-de-memorias'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, posts] = await Promise.all([getPublicContent('curso'), getPublicContent('blog')]);
  const staticRoutes = ['', '/sobre', '/cursos', '/projetos', '/blog', '/contato', '/politica-de-privacidade', '/termos-de-uso'];
  const spanishStaticRoutes = staticRoutes.map(path => `/es${path}`);
  return [
    ...staticRoutes.map(path => ({ url: `${base}${path}`, changeFrequency: path === '/blog' ? 'weekly' as const : 'monthly' as const, priority: path === '' ? 1 : 0.8 })),
    ...spanishStaticRoutes.map(path => ({ url: `${base}${path}`, changeFrequency: path === '/es/blog' ? 'weekly' as const : 'monthly' as const, priority: path === '/es' ? 1 : 0.8 })),
    ...courses.flatMap(item => [{ url: `${base}/cursos/${item.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 }, { url: `${base}/es/cursos/${item.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 }]),
    ...projects.flatMap(slug => [{ url: `${base}/projetos/${slug}`, changeFrequency: 'monthly' as const, priority: 0.7 }, { url: `${base}/es/projetos/${slug}`, changeFrequency: 'monthly' as const, priority: 0.7 }]),
    ...posts.flatMap(item => [{ url: `${base}/blog/${item.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 }, { url: `${base}/es/blog/${item.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 }]),
  ];
}
