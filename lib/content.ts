import { createClient } from '@supabase/supabase-js';
import { unstable_noStore as noStore } from 'next/cache';

export type ContentType = 'blog' | 'curso';
export type ContentItem = {
  id: string;
  content_type: ContentType;
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  steps: string[];
  published: boolean;
  sort_order: number;
};

export const FALLBACK_BLOG: ContentItem[] = [
  { id:'fallback-blog-1', content_type:'blog', slug:'cestinho-de-tecido', title:'Cestinho de tecido: passo a passo completo', category:'Passo a passo', summary:'Do material ao acabamento, uma peça bonita para organizar e decorar a casa.', content:'Um projeto delicado e funcional para praticar montagem, composição e acabamento.', steps:['Separe tecido, manta e os materiais indicados para a estrutura do cestinho.','Prepare as partes do projeto e marque as referências antes da montagem.','Monte as camadas com atenção ao alinhamento e às margens de costura.','Finalize as bordas e revise o acabamento antes de virar a peça.'], published:true, sort_order:1 },
  { id:'fallback-blog-2', content_type:'blog', slug:'como-escolher-linhas', title:'Como escolher as melhores linhas', category:'Dicas', summary:'Um guia para escolher materiais e deixar cada projeto ainda mais especial.', content:'A escolha da linha influencia a costura, o acabamento e até a aparência final da peça.', steps:['Observe o tipo de tecido ou material que será trabalhado.','Considere espessura, resistência e finalidade da peça.','Faça um pequeno teste antes de iniciar o projeto completo.','Guarde os materiais organizados por tipo para facilitar os próximos projetos.'], published:true, sort_order:2 },
  { id:'fallback-blog-3', content_type:'blog', slug:'pintura-em-madeira', title:'Pintura em madeira: técnicas e cuidados', category:'Técnicas', summary:'Preparação, pintura e proteção para peças feitas para durar.', content:'Preparação e acabamento fazem diferença quando a ideia é criar uma peça bonita e durável.', steps:['Limpe e prepare a superfície antes de aplicar qualquer produto.','Faça testes de cor e cobertura em uma área de amostra.','Aplique camadas finas, respeitando o tempo de secagem.','Proteja o trabalho final com o acabamento adequado ao projeto.'], published:true, sort_order:3 },
  { id:'fallback-blog-4', content_type:'blog', slug:'flores-de-feltro', title:'Flores de feltro: ideias para criar', category:'Inspiração', summary:'Detalhes feitos à mão para presentear, decorar e transformar ambientes.', content:'Flores de feltro são versáteis e permitem brincar com cores, tamanhos e composições.', steps:['Escolha uma combinação de cores que converse com o projeto.','Corte as formas com precisão e mantenha os moldes organizados.','Monte as pétalas criando volume aos poucos.','Use as flores em arranjos, acessórios, decoração ou presentes.'], published:true, sort_order:4 },
];

export const FALLBACK_COURSES: ContentItem[] = [
  { id:'fallback-course-1', content_type:'curso', slug:'feltro-criacoes-com-amor', title:'Feltro: Criações com Amor', category:'Feltro', summary:'Projetos delicados, técnicas essenciais e acabamentos para criar com carinho.', content:'Uma introdução prática para criar peças em feltro com mais segurança, composição e acabamento.', steps:['Aulas organizadas para acompanhar no seu ritmo.','Orientações sobre materiais e preparação.','Detalhes de execução e acabamento.','Projeto pensado para colocar o aprendizado em prática.'], published:true, sort_order:1 },
  { id:'fallback-course-2', content_type:'curso', slug:'patchwork-do-basico', title:'Patchwork: Do básico ao acabamento', category:'Patchwork', summary:'Aprenda fundamentos e detalhes para transformar tecidos em peças para a casa.', content:'Fundamentos para entender composição, montagem e detalhes que valorizam o projeto.', steps:['Aulas organizadas para acompanhar no seu ritmo.','Orientações sobre materiais e preparação.','Detalhes de execução e acabamento.','Projeto pensado para colocar o aprendizado em prática.'], published:true, sort_order:2 },
  { id:'fallback-course-3', content_type:'curso', slug:'arte-em-madeira', title:'Arte em Madeira: Decore e transforme', category:'Arte em madeira', summary:'Pintura, texturas e acabamentos para criar peças com personalidade.', content:'Conheça preparação, pintura, texturas e acabamentos para criar peças de madeira com personalidade.', steps:['Aulas organizadas para acompanhar no seu ritmo.','Orientações sobre materiais e preparação.','Detalhes de execução e acabamento.','Projeto pensado para colocar o aprendizado em prática.'], published:true, sort_order:3 },
  { id:'fallback-course-4', content_type:'curso', slug:'scrapbook-memorias', title:'Scrapbook: Memórias que ficam', category:'Scrapbook', summary:'Papéis, composição e detalhes para transformar histórias em projetos afetivos.', content:'Explore papéis, composição e detalhes para transformar lembranças em projetos especiais.', steps:['Aulas organizadas para acompanhar no seu ritmo.','Orientações sobre materiais e preparação.','Detalhes de execução e acabamento.','Projeto pensado para colocar o aprendizado em prática.'], published:true, sort_order:4 },
];

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key) : null;
}

export async function getPublicContent(type: ContentType) {
  noStore();
  const fallback = type === 'blog' ? FALLBACK_BLOG : FALLBACK_COURSES;
  const supabase = client();
  if (!supabase) return fallback;
  const { data, error } = await supabase.from('content_items').select('id,content_type,slug,title,category,summary,content,steps,published,sort_order').eq('content_type', type).eq('published', true).order('sort_order', { ascending: true }).order('created_at', { ascending: true });
  if (error) return fallback;
  return (data ?? []).map(normalize);
}

export async function getPublicContentBySlug(type: ContentType, slug: string) {
  noStore();
  const fallback = (type === 'blog' ? FALLBACK_BLOG : FALLBACK_COURSES).find((item) => item.slug === slug);
  const supabase = client();
  if (!supabase) return fallback;
  const { data, error } = await supabase.from('content_items').select('id,content_type,slug,title,category,summary,content,steps,published,sort_order').eq('content_type', type).eq('slug', slug).eq('published', true).maybeSingle();
  if (error) return fallback;
  return data ? normalize(data) : undefined;
}

function normalize(row: any): ContentItem {
  return { ...row, steps: Array.isArray(row.steps) ? row.steps.map(String) : [] } as ContentItem;
}

export async function getPublicContentCovers(type: ContentType, slugs: string[]) {
  noStore();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !slugs.length) return {};
  const supabase = createClient(url, key);
  const prefix = type === 'blog' ? 'blog' : 'course';
  const bucket = type === 'blog' ? 'blog' : 'courses';
  const slots = slugs.map((slug) => `${prefix}:${slug}:cover`);
  const { data } = await supabase.from('media_assets').select('slot,path,alt_text,filename').eq('bucket', bucket).in('slot', slots);
  return Object.fromEntries((data ?? []).map((row) => [row.slot, {
    url: supabase.storage.from(bucket).getPublicUrl(row.path).data.publicUrl,
    alt: row.alt_text ?? '',
    filename: row.filename ?? '',
  }]));
}

export async function getPublicContentMedia(type: ContentType, slug: string) {
  noStore();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return {};
  const supabase = createClient(url, key);
  const prefix = type === 'blog' ? 'blog' : 'course';
  const bucket = type === 'blog' ? 'blog' : 'courses';
  const slots = type === 'blog' ? [`${prefix}:${slug}:cover`, `${prefix}:${slug}:inside`, `${prefix}:${slug}:download`] : [`${prefix}:${slug}:cover`];
  const { data } = await supabase.from('media_assets').select('slot,path,alt_text,filename').eq('bucket', bucket).in('slot', slots);
  return Object.fromEntries((data ?? []).map((row) => [row.slot, {
    url: supabase.storage.from(bucket).getPublicUrl(row.path).data.publicUrl,
    alt: row.alt_text ?? '',
    filename: row.filename ?? '',
  }]));
}
