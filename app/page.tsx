import Link from 'next/link';
import YouTubeGallery from '@/components/YouTubeGallery';
import InstagramProfile from '@/components/InstagramProfile';

const courses = [
  ['course-feltro.jpg','FELTRO','Feltro: Criações com Amor','Projetos delicados, técnicas essenciais e acabamentos para criar com segurança.','/cursos/feltro-criacoes-com-amor'],
  ['course-patchwork.jpg','PATCHWORK','Patchwork: Do básico ao acabamento','Aprenda fundamentos e detalhes que deixam cada projeto mais bonito.','/cursos/patchwork-do-basico'],
  ['course-madeira.jpg','ARTE EM MADEIRA','Arte em Madeira: Decore e transforme','Pintura, texturas e acabamentos para peças com personalidade.','/cursos/arte-em-madeira'],
  ['course-scrapbook.jpg','SCRAPBOOK','Scrapbook: Memórias que ficam','Papéis, composição e detalhes para transformar histórias em projetos.','/cursos/scrapbook-memorias'],
];
const posts = [
  ['blog-cestinho.jpg','PASSO A PASSO','Cestinho de tecido: passo a passo completo','Do material ao acabamento, acompanhe todas as etapas.','/blog/cestinho-de-tecido'],
  ['blog-linhas.jpg','DICAS','Como escolher as melhores linhas','Um guia para escolher materiais e melhorar o acabamento.','/blog/como-escolher-linhas'],
  ['blog-madeira.jpg','TÉCNICAS','Pintura em madeira: técnicas e cuidados','Preparação, pintura e proteção para peças duráveis.','/blog/pintura-em-madeira'],
  ['blog-feltro.jpg','INSPIRAÇÃO','Flores de feltro: ideias para criar','Cores, combinações e possibilidades para seus próximos projetos.','/blog/flores-de-feltro'],
];

export default function Home() {
  return <main>
    <section className="hero"><div className="container hero-grid"><div className="hero-copy"><span className="eyebrow">Artesanato · Cursos · Criatividade</span><h1>Descubra tudo o que você <em>pode criar.</em></h1><p>Aprenda artesanato com técnica, criatividade e orientação de quem entende e sabe ensinar. Do primeiro projeto ao acabamento, cada aula foi pensada para você aprender fazendo.</p><div className="actions"><Link className="btn primary" href="/cursos">CONHEÇA OS CURSOS</Link><Link className="btn" href="/sobre">CONHEÇA A KARI</Link></div></div><div className="hero-photo" aria-label="Mulher criando uma peça artesanal em tecido"/></div></section>

    <section className="trust"><div className="container trust-grid">
      <div className="trust-item"><div className="trust-icon">▣</div><div><b>Experiência na TV</b><span>Uma trajetória ligada ao artesanato na Novo Tempo e Nuevo Tiempo.</span></div></div>
      <div className="trust-item"><div className="trust-icon">♡</div><div><b>Ensino que aproxima</b><span>Aulas e conteúdos para aprender com clareza, calma e criatividade.</span></div></div>
      <div className="trust-item"><div className="trust-icon">✂</div><div><b>Diversas técnicas</b><span>Feltro, patchwork, madeira, scrapbook e muito mais para explorar.</span></div></div>
      <div className="trust-item"><div className="trust-icon">✦</div><div><b>Projetos para fazer</b><span>Ideias, passo a passo e inspiração para colocar a mão na massa.</span></div></div>
    </div></section>

    <section className="section"><div className="container"><div className="section-head"><span className="eyebrow">Aprenda no seu tempo</span><h2 className="serif">Cursos em destaque</h2><p>Escolha uma técnica, acompanhe o passo a passo e descubra novas possibilidades para criar.</p></div><div className="grid4">{courses.map(c=><article className="card" key={c[2]}><img src={'/images/'+c[0]} alt={c[2]}/><div className="card-body"><span className="tag">{c[1]}</span><h3>{c[2]}</h3><p>{c[3]}</p><Link className="more" href={c[4]}>CONHECER CURSO →</Link></div></article>)}</div><div className="center"><Link className="btn primary" href="/cursos">VER TODOS OS CURSOS</Link></div></div></section>

    <section className="section video-section"><div className="container"><div className="section-head"><span className="eyebrow">Vídeos da Kari</span><h2 className="serif">Aprenda, assista e crie.</h2><p>Conteúdo do YouTube em uma galeria leve: o player só é carregado quando você decide assistir.</p></div><YouTubeGallery /></div></section>

    <section className="section alt"><div className="container"><div className="section-head"><span className="eyebrow">Conteúdo gratuito</span><h2 className="serif">Blog: dicas e passo a passo</h2><p>Aprenda uma técnica, escolha seus materiais e encontre inspiração para o próximo projeto.</p></div><div className="grid4">{posts.map(p=><article className="card" key={p[2]}><img src={'/images/'+p[0]} alt={p[2]}/><div className="card-body"><span className="tag">{p[1]}</span><h3>{p[2]}</h3><p>{p[3]}</p><Link className="more" href={p[4]}>LER ARTIGO →</Link></div></article>)}</div><div className="center"><Link className="btn" href="/blog">VER TODOS OS ARTIGOS</Link></div></div></section>

    <section className="section social-section"><div className="container social-grid"><div><div className="section-head social-head"><span className="eyebrow">Siga a Kari</span><h2 className="serif">Mais ideias para criar.</h2><p>Continue acompanhando a Kari nas redes e descubra novos projetos, dicas e inspirações.</p></div><div className="social-links"><a className="btn primary" href="https://www.youtube.com/@KaridoCanto" target="_blank" rel="noreferrer">YOUTUBE ↗</a><a className="btn" href="https://www.instagram.com/karidocanto.craft/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a></div></div><InstagramProfile /></div></section>

    <section className="story"><div className="container story-grid"><div className="story-photo"/><div className="story-copy"><span className="eyebrow">Uma história feita à mão</span><h2 className="serif">Da televisão para a sua mesa de criação.</h2><p>Karina do Canto construiu uma trajetória como apresentadora e esteve à frente de conteúdos de artesanato como <strong>Armarinho da Arte</strong> e <strong>Rincón de Arte</strong>. Agora, essa experiência ganha um novo espaço para ensinar, inspirar e acompanhar você.</p><Link className="btn primary" href="/sobre">CONHEÇA A HISTÓRIA</Link></div></div></section>

    <section className="manifesto"><div className="container"><span className="eyebrow">Para quem ama criar</span><h2 className="serif">Você não precisa começar sabendo.<br/><em>Precisa começar.</em></h2><Link className="btn" href="/projetos">EXPLORE OS PROJETOS</Link></div></section>
  </main>;
}
