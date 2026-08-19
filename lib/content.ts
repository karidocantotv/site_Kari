import { createClient } from '@supabase/supabase-js';
import { unstable_noStore as noStore } from 'next/cache';

export type ContentType = 'blog' | 'curso';
export type Locale = 'pt-BR' | 'es-LA';
export type ContentItem = {
  id: string;
  content_type: ContentType;
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  materials: string[];
  steps: string[];
  published: boolean;
  sort_order: number;
  video_url?: string;
};

export const FALLBACK_BLOG: ContentItem[] = [
  { id:'fallback-blog-1', content_type:'blog', slug:'cestinho-de-tecido', title:'Cestinho de tecido: passo a passo completo', category:'Passo a passo', summary:'Do material ao acabamento, uma peça bonita para organizar e decorar a casa.', content:'Um projeto delicado e funcional para praticar montagem, composição e acabamento.', materials:['Tecidos','Manta acrílica R2','Cola para patchwork','Linha','Tesoura e régua','Máquina de costura'], steps:['Separe tecido, manta e os materiais indicados para a estrutura do cestinho.','Prepare as partes do projeto e marque as referências antes da montagem.','Monte as camadas com atenção ao alinhamento e às margens de costura.','Finalize as bordas e revise o acabamento antes de virar a peça.'], published:true, sort_order:1 },
  { id:'fallback-blog-2', content_type:'blog', slug:'como-escolher-linhas', title:'Como escolher as melhores linhas', category:'Dicas', summary:'Um guia para escolher materiais e deixar cada projeto ainda mais especial.', content:'A escolha da linha influencia a costura, o acabamento e até a aparência final da peça.', materials:[], steps:['Observe o tipo de tecido ou material que será trabalhado.','Considere espessura, resistência e finalidade da peça.','Faça um pequeno teste antes de iniciar o projeto completo.','Guarde os materiais organizados por tipo para facilitar os próximos projetos.'], published:true, sort_order:2 },
  { id:'fallback-blog-3', content_type:'blog', slug:'pintura-em-madeira', title:'Pintura em madeira: técnicas e cuidados', category:'Técnicas', summary:'Preparação, pintura e proteção para peças feitas para durar.', content:'Preparação e acabamento fazem diferença quando a ideia é criar uma peça bonita e durável.', materials:[], steps:['Limpe e prepare a superfície antes de aplicar qualquer produto.','Faça testes de cor e cobertura em uma área de amostra.','Aplique camadas finas, respeitando o tempo de secagem.','Proteja o trabalho final com o acabamento adequado ao projeto.'], published:true, sort_order:3 },
  { id:'fallback-blog-4', content_type:'blog', slug:'flores-de-feltro', title:'Flores de feltro: ideias para criar', category:'Inspiração', summary:'Detalhes feitos à mão para presentear, decorar e transformar ambientes.', content:'Flores de feltro são versáteis e permitem brincar com cores, tamanhos e composições.', materials:[], steps:['Escolha uma combinação de cores que converse com o projeto.','Corte as formas com precisão e mantenha os moldes organizados.','Monte as pétalas criando volume aos poucos.','Use as flores em arranjos, acessórios, decoração ou presentes.'], published:true, sort_order:4 },
];

export const FALLBACK_COURSES: ContentItem[] = [
  { id:'fallback-course-1', content_type:'curso', slug:'feltro-criacoes-com-amor', title:'Feltro: Criações com Amor', category:'Feltro', summary:'Projetos delicados, técnicas essenciais e acabamentos para criar com carinho.', content:'Uma introdução prática para criar peças em feltro com mais segurança, composição e acabamento.', materials:[], steps:['Aulas organizadas para acompanhar no seu ritmo.','Orientações sobre materiais e preparação.','Detalhes de execução e acabamento.','Projeto pensado para colocar o aprendizado em prática.'], published:true, sort_order:1 },
  { id:'fallback-course-2', content_type:'curso', slug:'patchwork-do-basico', title:'Patchwork: Do básico ao acabamento', category:'Patchwork', summary:'Aprenda fundamentos e detalhes para transformar tecidos em peças para a casa.', content:'Fundamentos para entender composição, montagem e detalhes que valorizam o projeto.', materials:[], steps:['Aulas organizadas para acompanhar no seu ritmo.','Orientações sobre materiais e preparação.','Detalhes de execução e acabamento.','Projeto pensado para colocar o aprendizado em prática.'], published:true, sort_order:2 },
  { id:'fallback-course-3', content_type:'curso', slug:'arte-em-madeira', title:'Arte em Madeira: Decore e transforme', category:'Arte em madeira', summary:'Pintura, texturas e acabamentos para criar peças com personalidade.', content:'Conheça preparação, pintura, texturas e acabamentos para criar peças de madeira com personalidade.', materials:[], steps:['Aulas organizadas para acompanhar no seu ritmo.','Orientações sobre materiais e preparação.','Detalhes de execução e acabamento.','Projeto pensado para colocar o aprendizado em prática.'], published:true, sort_order:3 },
  { id:'fallback-course-4', content_type:'curso', slug:'scrapbook-memorias', title:'Scrapbook: Memórias que ficam', category:'Scrapbook', summary:'Papéis, composição e detalhes para transformar histórias em projetos afetivos.', content:'Explore papéis, composição e detalhes para transformar lembranças em projetos especiais.', materials:[], steps:['Aulas organizadas para acompanhar no seu ritmo.','Orientações sobre materiais e preparação.','Detalhes de execução e acabamento.','Projeto pensado para colocar o aprendizado em prática.'], published:true, sort_order:4 },
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
  const { data, error } = await supabase.from('content_items').select('id,content_type,slug,title,category,summary,content,materials,steps,published,sort_order,video_url').eq('content_type', type).eq('published', true).order('sort_order', { ascending: true }).order('created_at', { ascending: true });
  if (error) return fallback;
  return (data ?? []).map(normalize);
}

export async function getPublicContentBySlug(type: ContentType, slug: string) {
  noStore();
  const fallback = (type === 'blog' ? FALLBACK_BLOG : FALLBACK_COURSES).find((item) => item.slug === slug);
  const supabase = client();
  if (!supabase) return fallback;
  const { data, error } = await supabase.from('content_items').select('id,content_type,slug,title,category,summary,content,materials,steps,published,sort_order,video_url').eq('content_type', type).eq('slug', slug).eq('published', true).maybeSingle();
  if (error) return fallback;
  return data ? normalize(data) : undefined;
}

function normalize(row: any): ContentItem {
  return { ...row, materials: Array.isArray(row.materials) ? row.materials.map(String) : [], steps: Array.isArray(row.steps) ? row.steps.map(String) : [] } as ContentItem;
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
  return Object.fromEntries((data ?? []).map((row) => [row.slot, { url: supabase.storage.from(bucket).getPublicUrl(row.path).data.publicUrl, alt: row.alt_text ?? '', filename: row.filename ?? '' }]));
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
  return Object.fromEntries((data ?? []).map((row) => [row.slot, { url: supabase.storage.from(bucket).getPublicUrl(row.path).data.publicUrl, alt: row.alt_text ?? '', filename: row.filename ?? '' }]));
}

export async function getPublicContentLocalized(type: ContentType, locale: Locale) {
  const items = await getPublicContent(type);
  if (locale !== 'es-LA' || !items.length) return items;
  const supabase = client();
  if (!supabase) return items;
  const ids = items.map(item => item.id).filter(id => !id.startsWith('fallback-'));
  if (!ids.length) return items.map(localizeFallbackItem);
  const { data } = await supabase.from('content_translations').select('content_id,title,category,summary,content,materials,steps,video_url').eq('language','es-LA').in('content_id', ids);
  const translations = new Map((data ?? []).map(row => [row.content_id, row]));
  return items.map(item => {
    const t = translations.get(item.id);
    if (!t) return localizeFallbackItem(item);
    return { ...item, title: t.title || item.title, category: t.category || item.category, summary: t.summary || item.summary, content: t.content || item.content, materials: Array.isArray(t.materials) ? t.materials.map(String) : item.materials, steps: Array.isArray(t.steps) ? t.steps.map(String) : item.steps, video_url: t.video_url || item.video_url };
  });
}

export async function getPublicContentLocalizedBySlug(type: ContentType, slug: string, locale: Locale) {
  const item = await getPublicContentBySlug(type, slug);
  if (!item || locale !== 'es-LA') return item;
  if (item.id.startsWith('fallback-')) return localizeFallbackItem(item);
  const supabase = client();
  if (!supabase) return localizeFallbackItem(item);
  const { data } = await supabase.from('content_translations').select('content_id,title,category,summary,content,materials,steps,video_url').eq('language','es-LA').eq('content_id', item.id).maybeSingle();
  if (!data) return localizeFallbackItem(item);
  return { ...item, title: data.title || item.title, category: data.category || item.category, summary: data.summary || item.summary, content: data.content || item.content, materials: Array.isArray(data.materials) ? data.materials.map(String) : item.materials, steps: Array.isArray(data.steps) ? data.steps.map(String) : item.steps, video_url: data.video_url || item.video_url };
}

function localizeFallbackItem(item: ContentItem): ContentItem {
  const translations: Record<string, Partial<ContentItem>> = {
    'cestinho-de-tecido': { title:'Cestita de tela: paso a paso completo', category:'Paso a paso', summary:'Del material al acabado, una pieza bonita para organizar y decorar el hogar.', content:'Un proyecto delicado y funcional para practicar montaje, composición y acabado.', materials:['Telas','Manta acrílica R2','Pegamento para patchwork','Hilo','Tijeras y regla','Máquina de coser'] },
    'como-escolher-linhas': { title:'Cómo elegir los mejores hilos', category:'Consejos', summary:'Una guía para elegir materiales y hacer que cada proyecto sea aún más especial.', content:'La elección del hilo influye en la costura, el acabado y hasta en la apariencia final de la pieza.' },
    'pintura-em-madeira': { title:'Pintura sobre madera: técnicas y cuidados', category:'Técnicas', summary:'Preparación, pintura y protección para piezas hechas para durar.', content:'La preparación y el acabado marcan la diferencia cuando quieres crear una pieza bonita y duradera.' },
    'flores-de-feltro': { title:'Flores de fieltro: ideas para crear', category:'Inspiración', summary:'Detalles hechos a mano para regalar, decorar y transformar ambientes.', content:'Las flores de fieltro son versátiles y permiten jugar con colores, tamaños y composiciones.' },
    'feltro-criacoes-com-amor': { title:'Fieltro: Creaciones con Amor', category:'Fieltro', summary:'Proyectos delicados, técnicas esenciales y acabados para crear con cariño.', content:'Una introducción práctica para crear piezas de fieltro con más seguridad, composición y acabado.' },
    'patchwork-do-basico': { title:'Patchwork: del básico al acabado', category:'Patchwork', summary:'Aprende fundamentos y detalles para transformar telas en piezas para el hogar.', content:'Fundamentos para entender composición, montaje y detalles que valorizan el proyecto.' },
    'arte-em-madeira': { title:'Arte en madera: decora y transforma', category:'Arte en madera', summary:'Pintura, texturas y acabados para crear piezas con personalidad.', content:'Conoce preparación, pintura, texturas y acabados para crear piezas de madera con personalidad.' },
    'scrapbook-memorias': { title:'Scrapbook: recuerdos que permanecen', category:'Scrapbook', summary:'Papeles, composición y detalles para transformar historias en proyectos llenos de afecto.', content:'Explora papeles, composición y detalles para transformar recuerdos en proyectos especiales.' },
  };
  const t = translations[item.slug];
  return t ? { ...item, ...t } : item;
}
