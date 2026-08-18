import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SeoJsonLd from '@/components/SeoJsonLd';
const projects:Record<string,{title:string;tag:string;image:string}>= {
 'feltro-criacoes-com-amor':{title:'Criações com Amor',tag:'Feltro',image:'/images/course-feltro.webp'},
 'bolsa-patchwork':{title:'Bolsa com acabamento especial',tag:'Patchwork',image:'/images/course-patchwork.webp'},
 'caixa-decorativa':{title:'Caixa decorativa floral',tag:'Arte em madeira',image:'/images/course-madeira.webp'},
 'album-de-memorias':{title:'Álbum de memórias',tag:'Scrapbook',image:'/images/course-scrapbook.webp'},
};
const base='https://karidocanto.com.br';
export function generateStaticParams(){return Object.keys(projects).map(slug=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const p=projects[slug];if(!p)return {title:'Projeto não encontrado',robots:{index:false,follow:false}};const description='Uma ideia para acompanhar, adaptar e transformar em uma criação feita por você.';const url=`${base}/projetos/${slug}`;return {title:p.title,description,alternates:{canonical:url},openGraph:{title:p.title,description,url,type:'website',images:[{url:p.image,alt:p.title}]},twitter:{card:'summary_large_image',title:p.title,description,images:[p.image]}}}
export default async function Projeto({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=projects[slug];if(!p)notFound();return <><SeoJsonLd type="CreativeWork" name={p.title} description="Uma ideia para acompanhar, adaptar e transformar em uma criação feita por você." url={`/projetos/${slug}`} image={p.image} breadcrumbs={[{name:'Início',item:'/'},{name:'Projetos',item:'/projetos'},{name:p.title,item:`/projetos/${slug}`}]}/><section className="pageHero"><span className="eyebrow">Projeto · {p.tag}</span><h1 className="serif">{p.title}</h1><p>Uma ideia para acompanhar, adaptar e transformar em uma criação feita por você.</p></section><article className="article"><img src={p.image} alt={p.title} loading="eager" decoding="async"/><h2>Do material ao resultado</h2><p>Observe a peça, imagine as possibilidades e organize os materiais antes de começar. O passo a passo deve ser um guia: o toque final continua sendo seu.</p><h2>Etapas sugeridas</h2><ol><li>Escolha e prepare os materiais.</li><li>Separe moldes, ferramentas e referências.</li><li>Execute cada etapa com atenção ao alinhamento e ao acabamento.</li><li>Finalize e fotografe sua criação.</li></ol><div className="actions"><Link className="btn primary" href="/blog">VER DICAS E PASSO A PASSO</Link><Link className="btn" href="/projetos">VOLTAR AOS PROJETOS</Link></div></article></>}
