import NotFoundContent from '@/components/NotFoundContent';
import { getPublicSiteMedia } from '@/lib/site-settings';

export default async function NotFound() {
  const media = await getPublicSiteMedia(['404']);
  const image = media['404']?.url || '/images/about.webp';
  const alt = media['404']?.alt || 'Kari Do Canto em seu ateliê de artesanato';
  return <NotFoundContent image={image} alt={alt} />;
}
