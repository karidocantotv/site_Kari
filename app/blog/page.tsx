import type { Metadata } from 'next';
import Link from 'next/link';
import SeoJsonLd from '@/components/SeoJsonLd';
import { getPublicContent, getPublicContentCovers } from '@/lib/content';
import { getPublicSiteSettings } from '@/lib/site-settings';

export const metadata: Metadata = { title: 'Blog de Artesanato', description: 'Dicas, técnicas, inspirações e passo a passo para aprender artesanato e criar projetos para a casa.', alternates: { canonical: 'https://karidocanto.com.br/blog' }, openGraph: { title: 'Blog de Artesanato', description: 'Dicas, técnicas, inspirações e passo a passo para aprender artesanato e criar projetos para a casa.', url: 'https://karidocanto.com.br/blog', type: 'website' }, twitter: { card: 'summary_large_image', title: 'Blog de Artesanato', description: 'Dicas, técnicas, inspirações e passo a passo para aprender artesanato e criar projetos para a casa.' } };

export default async function Blog() {
  const [posts, settings] = await Promise.all([getPublicContent('blog'), getPublicSiteSettings(['blog_title','blog_description'])]);
  const media = await getPublicContentCovers('blog', posts.map((p) => p.slug));
  return <><SeoJsonLd type="WebPage" name="Blog de Artesanato" description={settings.blog_description || 'Dicas, técnicas, inspirações e passo a passo para aprender artesanato e criar projetos para a casa.'} url="/blog" breadcrumbs={[{name:'Início',item:'/'},{name:'Blog',item:'/blog'}]} /><section className="pageHero"><span className="eyebrow">Conteúdo gratuito</span><h1 className="serif">{settings.blog_title || 'Blog'}</h1><p>{settings.blog_description || 'Dicas, técnicas, inspirações e passo a passo para aprender artesanato e criar projetos cada vez mais bonitos.'}</p></section><section className="section"><div className="container"><div className="grid4">{posts.map((p)=><article className="card" key={p.id}><img src={media[`blog:${p.slug}:cover`]?.url || '/images/blog-cestinho.webp'} alt={media[`blog:${p.slug}:cover`]?.alt || p.title} loading="lazy" decoding="async" width="200" height="118"/><div className="card-body"><span className="tag">{p.category}</span><h3>{p.title}</h3><p>{p.summary}</p><Link className="more" href={'/blog/'+p.slug}>LER ARTIGO →</Link></div></article>)}</div>{posts.length === 0 && <div className="content-empty public-empty"><strong>Em breve</strong><span>Novos conteúdos estão sendo preparados pela Kari.</span></div>}</div></section></>;
}
