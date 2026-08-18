import Link from 'next/link';
import { notFound } from 'next/navigation';
const projects:Record<string,{title:string;tag:string;image:string}>={
 'feltro-criacoes-com-amor':{title:'Criações com Amor',tag:'Feltro',image:'/images/course-feltro.jpg'},
 'bolsa-patchwork':{title:'Bolsa com acabamento especial',tag:'Patchwork',image:'/images/course-patchwork.jpg'},
 'caixa-decorativa':{title:'Caixa decorativa floral',tag:'Arte em madeira',image:'/images/course-madeira.jpg'},
 'album-de-memorias':{title:'Álbum de memórias',tag:'Scrapbook',image:'/images/course-scrapbook.jpg'},
};
export function generateStaticParams(){return Object.keys(projects).map(slug=>({slug}))}
export function generateMetadata({params}:{params:{slug:string}}){return projects[params.slug]?{title:projects[params.slug].title}:{title:'Projeto'}}
export default function Projeto({params}:{params:{slug:string}}){const p=projects[params.slug];if(!p)notFound();return <><section className="pageHero"><span className="eyebrow">Projeto · {p.tag}</span><h1 className="serif">{p.title}</h1><p>Uma ideia para acompanhar, adaptar e transformar em uma criação feita por você.</p></section><article className="article"><img src={p.image} alt={p.title}/><h2>Do material ao resultado</h2><p>Observe a peça, imagine as possibilidades e organize os materiais antes de começar. O passo a passo deve ser um guia: o toque final continua sendo seu.</p><h2>Etapas sugeridas</h2><ol><li>Escolha e prepare os materiais.</li><li>Separe moldes, ferramentas e referências.</li><li>Execute cada etapa com atenção ao alinhamento e ao acabamento.</li><li>Finalize e fotografe sua criação.</li></ol><div className="actions"><Link className="btn primary" href="/blog">VER DICAS E PASSO A PASSO</Link><Link className="btn" href="/projetos">VOLTAR AOS PROJETOS</Link></div></article></>}
