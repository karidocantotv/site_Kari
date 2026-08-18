import { notFound } from 'next/navigation';
import LeadCapture from '@/components/LeadCapture';

const courses:Record<string,{title:string;tag:string;image:string;desc:string}>= {
 'feltro-criacoes-com-amor':{title:'Feltro: Criações com Amor',tag:'Feltro',image:'/images/course-feltro.jpg',desc:'Uma introdução prática para criar peças em feltro com mais segurança, composição e acabamento.'},
 'patchwork-do-basico':{title:'Patchwork: Do básico ao acabamento',tag:'Patchwork',image:'/images/course-patchwork.jpg',desc:'Fundamentos para entender composição, montagem e detalhes que valorizam o projeto.'},
 'arte-em-madeira':{title:'Arte em Madeira: Decore e transforme',tag:'Arte em madeira',image:'/images/course-madeira.jpg',desc:'Conheça preparação, pintura, texturas e acabamentos para criar peças de madeira com personalidade.'},
 'scrapbook-memorias':{title:'Scrapbook: Memórias que ficam',tag:'Scrapbook',image:'/images/course-scrapbook.jpg',desc:'Explore papéis, composição e detalhes para transformar lembranças em projetos especiais.'},
};
export function generateStaticParams(){return Object.keys(courses).map(slug=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const c=courses[slug];return c?{title:c.title,description:c.desc}:{title:'Curso'}}
export default async function Curso({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const c=courses[slug];if(!c)notFound();return <><section className="pageHero"><span className="eyebrow">Curso online · {c.tag}</span><h1 className="serif">{c.title}</h1><p>{c.desc}</p></section><section className="article"><img src={c.image} alt={c.title}/><h2>O que você vai encontrar</h2><ul><li>Aulas organizadas para acompanhar no seu ritmo.</li><li>Orientações sobre materiais e preparação.</li><li>Detalhes de execução e acabamento.</li><li>Projeto pensado para colocar o aprendizado em prática.</li></ul><h2>Aprenda fazendo</h2><p>O objetivo é que você entenda o processo e ganhe confiança para criar outras peças a partir do que aprendeu.</p></section><section className="section alt"><div className="container"><LeadCapture courseSlug={slug} courseTitle={c.title} source="course-page" /></div></section></>}
