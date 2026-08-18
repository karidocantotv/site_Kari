import Link from 'next/link';
import YouTubeGallery from '@/components/YouTubeGallery';
import InstagramProfile from '@/components/InstagramProfile';
import { getPublicSiteMedia, getPublicSiteSettings } from '@/lib/site-settings';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kari Do Canto | Artesanato com Afeto',
  description: 'Artesanato com afeto: cursos, projetos, dicas e passo a passo para criar peças para a casa.',
  alternates: { canonical: 'https://karidocanto.com.br/' },
  openGraph: { title: 'Kari Do Canto | Artesanato com Afeto', description: 'Ideias, cursos e passo a passo para criar para a casa com amor e afeto.', url: 'https://karidocanto.com.br/', type: 'website', images: [{ url: '/api/og-image', width: 1200, height: 630, alt: 'Kari Do Canto — Artesanato com Afeto' }] },
  twitter: { card: 'summary_large_image', title: 'Kari Do Canto | Artesanato com Afeto', description: 'Ideias, cursos e passo a passo para criar para a casa com amor e afeto.', images: ['/api/og-image'] },
};
import SeoJsonLd from '@/components/SeoJsonLd';

const courses = [
  ['course-feltro.webp','FELTRO','Feltro: Criações com Amor','Projetos delicados, técnicas essenciais e acabamentos para criar com carinho.','/cursos/feltro-criacoes-com-amor'],
  ['course-patchwork.webp','PATCHWORK','Patchwork: Do básico ao acabamento','Aprenda fundamentos e detalhes para transformar tecidos em peças para a casa.','/cursos/patchwork-do-basico'],
  ['course-madeira.webp','ARTE EM MADEIRA','Arte em Madeira: Decore e transforme','Pintura, texturas e acabamentos para criar peças com personalidade.','/cursos/arte-em-madeira'],
  ['course-scrapbook.webp','SCRAPBOOK','Scrapbook: Memórias que ficam','Papéis, composição e detalhes para transformar histórias em projetos afetivos.','/cursos/scrapbook-memorias'],
];
const posts = [
  ['blog-cestinho.webp','PASSO A PASSO','Cestinho de tecido: passo a passo completo','Do material ao acabamento, uma peça bonita para organizar e decorar a casa.','/blog/cestinho-de-tecido'],
  ['blog-linhas.webp','DICAS','Como escolher as melhores linhas','Um guia para escolher materiais e deixar cada projeto ainda mais especial.','/blog/como-escolher-linhas'],
  ['blog-madeira.webp','TÉCNICAS','Pintura em madeira: técnicas e cuidados','Preparação, pintura e proteção para peças feitas para durar.','/blog/pintura-em-madeira'],
  ['blog-feltro.webp','INSPIRAÇÃO','Flores de feltro: ideias para criar','Detalhes feitos à mão para presentear, decorar e transformar ambientes.','/blog/flores-de-feltro'],
];

export default async function Home() {
  const settings = await getPublicSiteSettings([
    'cursos_title', 'cursos_description', 'cursos_enabled',
    'blog_title', 'blog_description', 'blog_enabled',
    'projetos_title', 'projetos_description', 'projetos_enabled',
    'youtube_url', 'youtube_video_id', 'youtube_video_title', 'youtube_video_enabled',
    'youtube_video_id_2', 'youtube_video_title_2', 'youtube_video_enabled_2',
    'youtube_video_id_3', 'youtube_video_title_3', 'youtube_video_enabled_3',
    'youtube_video_id_4', 'youtube_video_title_4', 'youtube_video_enabled_4',
    'youtube_video_id_5', 'youtube_video_title_5', 'youtube_video_enabled_5',
  ]);
  const siteMedia = await getPublicSiteMedia(['home-hero', 'home-about']);
  const heroImage = siteMedia['home-hero']?.url || '/images/hero.webp';
  const heroAlt = siteMedia['home-hero']?.alt || 'Mulher criando uma peça artesanal para a casa';
  const aboutImage = siteMedia['home-about']?.url || '/images/about.webp';
  const aboutAlt = siteMedia['home-about']?.alt || 'Kari do Canto em um ambiente de artesanato';
  const cursosEnabled = settings.cursos_enabled !== 'false';
  const blogEnabled = settings.blog_enabled !== 'false';
  const projetosEnabled = settings.projetos_enabled !== 'false';
  const normalizeVideoId = (value: string) => {
    const match = value.trim().match(/(?:v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
    return match?.[1] ?? value.trim().replace(/[^A-Za-z0-9_-]/g, '').slice(0, 11);
  };
  const youtubeVideos = Array.from({ length: 5 }, (_, index) => {
    const suffix = index === 0 ? '' : `_${index + 1}`;
    const videoId = normalizeVideoId(settings[`youtube_video_id${suffix}`] || '');
    return {
      title: settings[`youtube_video_title${suffix}`] || `Vídeo ${index + 1}`,
      videoId,
      enabled: settings[`youtube_video_enabled${suffix}`] !== 'false' && Boolean(videoId),
    };
  }).filter((video) => video.enabled);
  const youtubeChannel = settings.youtube_url || 'https://www.youtube.com/@KaridoCanto';
  return <>
    <SeoJsonLd type="WebSite" name="Kari Do Canto | Artesanato com Afeto" description="Ideias, cursos e passo a passo para criar peças para a casa com amor e afeto." url="/" image="/api/og-image" />
    <main>
    <section className="hero"><div className="container hero-grid"><div className="hero-copy"><span className="eyebrow">Artesanato · Casa · Afeto</span><h1>Crie para a sua casa <em>com amor e afeto.</em></h1><p>Ideias, cursos e passo a passo para transformar materiais simples em peças feitas pelas suas mãos — para decorar, organizar, presentear e deixar a casa ainda mais sua.</p><div className="actions"><Link className="btn primary" href="/cursos">CONHEÇA OS CURSOS</Link><Link className="btn" href="/sobre">CONHEÇA A Kari</Link></div></div><div className="hero-photo"><img src={heroImage} alt={heroAlt} width="554" height="350" fetchPriority="high" decoding="async" /></div></div></section>

    <section className="trust"><div className="container trust-grid">
      <div className="trust-item"><div className="trust-icon">♡</div><div><b>Feito com afeto</b><span>Projetos pensados para trazer beleza e significado aos pequenos detalhes da casa.</span></div></div>
      <div className="trust-item"><div className="trust-icon">✂</div><div><b>Aprenda fazendo</b><span>Aulas e conteúdos claros para você criar no seu ritmo, com segurança e prazer.</span></div></div>
      <div className="trust-item"><div className="trust-icon">⌂</div><div><b>Para a sua casa</b><span>Peças para decorar, organizar, renovar ambientes e presentear quem você ama.</span></div></div>
      <div className="trust-item"><div className="trust-icon">✦</div><div><b>Experiência da Kari</b><span>Uma trajetória na televisão transformada em inspiração para criar com as próprias mãos.</span></div></div>
    </div></section>

    <section className="section" hidden={!cursosEnabled}><div className="container"><div className="section-head"><span className="eyebrow">Aprenda no seu tempo</span><h2 className="serif">{settings.cursos_title || 'Cursos para criar com afeto'}</h2><p>{settings.cursos_description || 'Escolha uma técnica, acompanhe o passo a passo e transforme uma ideia em uma peça que tenha a sua cara.'}</p></div><div className="grid4">{courses.map(c=><article className="card" key={c[2]}><img src={'/images/'+c[0]} alt={c[2]} loading="lazy" decoding="async" width="200" height="157"/><div className="card-body"><span className="tag">{c[1]}</span><h3>{c[2]}</h3><p>{c[3]}</p><Link className="more" href={c[4]}>CONHECER CURSO →</Link></div></article>)}</div><div className="center"><Link className="btn primary" href="/cursos">VER TODOS OS CURSOS</Link></div></div></section>

    <section className="section video-section"><div className="container"><div className="section-head"><span className="eyebrow">Vídeos da Kari</span><h2 className="serif">Aprenda, assista e crie.</h2><p>Conteúdo do YouTube em uma galeria leve: o player só é carregado quando você decide assistir.</p></div><YouTubeGallery videos={youtubeVideos} channel={youtubeChannel} /></div></section>

    <section className="section alt" hidden={!blogEnabled}><div className="container"><div className="section-head"><span className="eyebrow">Conteúdo gratuito</span><h2 className="serif">{settings.blog_title || 'Dicas e passo a passo para a casa'}</h2><p>{settings.blog_description || 'Aprenda uma técnica, escolha seus materiais e encontre inspiração para o próximo projeto.'}</p></div><div className="grid4">{posts.map(p=><article className="card" key={p[2]}><img src={'/images/'+p[0]} alt={p[2]} loading="lazy" decoding="async" width="200" height="118"/><div className="card-body"><span className="tag">{p[1]}</span><h3>{p[2]}</h3><p>{p[3]}</p><Link className="more" href={p[4]}>LER ARTIGO →</Link></div></article>)}</div><div className="center"><Link className="btn" href="/blog">VER TODOS OS ARTIGOS</Link></div></div></section>

    <section className="section social-section"><div className="container social-grid"><div><div className="section-head social-head"><span className="eyebrow">Siga a Kari</span><h2 className="serif">Mais ideias para criar com afeto.</h2><p>Continue acompanhando a Kari nas redes e descubra novos projetos, dicas e inspirações para a sua casa.</p></div><div className="social-links"><a className="btn primary" href="https://www.youtube.com/@KaridoCanto" target="_blank" rel="noreferrer">YOUTUBE ↗</a><a className="btn" href="https://www.instagram.com/karidocanto.craft/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a></div></div><InstagramProfile /></div></section>

    <section className="story"><div className="container story-grid"><div className="story-photo"><img src={aboutImage} alt={aboutAlt} width="350" height="165" loading="lazy" decoding="async" /></div><div className="story-copy"><span className="eyebrow">Kari Do Canto</span><h2 className="serif">Uma casa bonita também conta histórias.</h2><p>Karina do Canto construiu uma trajetória como apresentadora e esteve à frente de conteúdos de artesanato como <strong>Armarinho da Arte</strong> e <strong>Rincón de Arte</strong>. Agora, essa experiência ganha um novo espaço para ensinar, inspirar e acompanhar você na criação de peças para a casa.</p><Link className="btn primary" href="/sobre">CONHEÇA A HISTÓRIA</Link></div></div></section>

    <section className="manifesto" hidden={!projetosEnabled}><div className="container"><span className="eyebrow">Artesanato com Afeto</span><h2 className="serif">{settings.projetos_title || 'Projetos para criar com afeto'}</h2><p>{settings.projetos_description || 'Passo a passo, ideias e galerias para você transformar materiais em peças feitas à mão.'}</p><Link className="btn" href="/projetos">EXPLORE OS PROJETOS</Link></div></section>
  </main>
  </>;
}
