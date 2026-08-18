-- Kari Do Canto — Conteúdo dinâmico do Painel Vital
-- Execute uma vez no Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('blog','curso')),
  slug text not null,
  title text not null,
  category text not null default '',
  summary text not null default '',
  content text not null default '',
  steps jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (content_type, slug)
);

create index if not exists content_items_type_idx on public.content_items(content_type);
create index if not exists content_items_published_idx on public.content_items(content_type, published, sort_order);

alter table public.content_items enable row level security;

drop policy if exists "Public can view published content" on public.content_items;
create policy "Public can view published content"
on public.content_items for select
using (published = true);

drop policy if exists "Authenticated can manage content" on public.content_items;
create policy "Authenticated can manage content"
on public.content_items for all
to authenticated
using (true)
with check (true);

create or replace function public.set_content_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists content_items_updated_at on public.content_items;
create trigger content_items_updated_at
before update on public.content_items
for each row execute function public.set_content_items_updated_at();

-- Migração dos quatro artigos atuais.
insert into public.content_items (content_type, slug, title, category, summary, content, steps, published, sort_order)
values
('blog','cestinho-de-tecido','Cestinho de tecido: passo a passo completo','Passo a passo','Do material ao acabamento, uma peça bonita para organizar e decorar a casa.','Um projeto delicado e funcional para praticar montagem, composição e acabamento.','["Separe tecido, manta e os materiais indicados para a estrutura do cestinho.","Prepare as partes do projeto e marque as referências antes da montagem.","Monte as camadas com atenção ao alinhamento e às margens de costura.","Finalize as bordas e revise o acabamento antes de virar a peça."]'::jsonb,true,1),
('blog','como-escolher-linhas','Como escolher as melhores linhas','Dicas','Um guia para escolher materiais e deixar cada projeto ainda mais especial.','A escolha da linha influencia a costura, o acabamento e até a aparência final da peça.','["Observe o tipo de tecido ou material que será trabalhado.","Considere espessura, resistência e finalidade da peça.","Faça um pequeno teste antes de iniciar o projeto completo.","Guarde os materiais organizados por tipo para facilitar os próximos projetos."]'::jsonb,true,2),
('blog','pintura-em-madeira','Pintura em madeira: técnicas e cuidados','Técnicas','Preparação, pintura e proteção para peças feitas para durar.','Preparação e acabamento fazem diferença quando a ideia é criar uma peça bonita e durável.','["Limpe e prepare a superfície antes de aplicar qualquer produto.","Faça testes de cor e cobertura em uma área de amostra.","Aplique camadas finas, respeitando o tempo de secagem.","Proteja o trabalho final com o acabamento adequado ao projeto."]'::jsonb,true,3),
('blog','flores-de-feltro','Flores de feltro: ideias para criar','Inspiração','Detalhes feitos à mão para presentear, decorar e transformar ambientes.','Flores de feltro são versáteis e permitem brincar com cores, tamanhos e composições.','["Escolha uma combinação de cores que converse com o projeto.","Corte as formas com precisão e mantenha os moldes organizados.","Monte as pétalas criando volume aos poucos.","Use as flores em arranjos, acessórios, decoração ou presentes."]'::jsonb,true,4)
on conflict (content_type, slug) do update set title=excluded.title, category=excluded.category, summary=excluded.summary, content=excluded.content, steps=excluded.steps, published=excluded.published, sort_order=excluded.sort_order;

-- Migração dos quatro cursos atuais.
insert into public.content_items (content_type, slug, title, category, summary, content, steps, published, sort_order)
values
('curso','feltro-criacoes-com-amor','Feltro: Criações com Amor','Feltro','Projetos delicados, técnicas essenciais e acabamentos para criar com carinho.','Uma introdução prática para criar peças em feltro com mais segurança, composição e acabamento.','["Aulas organizadas para acompanhar no seu ritmo.","Orientações sobre materiais e preparação.","Detalhes de execução e acabamento.","Projeto pensado para colocar o aprendizado em prática."]'::jsonb,true,1),
('curso','patchwork-do-basico','Patchwork: Do básico ao acabamento','Patchwork','Aprenda fundamentos e detalhes para transformar tecidos em peças para a casa.','Fundamentos para entender composição, montagem e detalhes que valorizam o projeto.','["Aulas organizadas para acompanhar no seu ritmo.","Orientações sobre materiais e preparação.","Detalhes de execução e acabamento.","Projeto pensado para colocar o aprendizado em prática."]'::jsonb,true,2),
('curso','arte-em-madeira','Arte em Madeira: Decore e transforme','Arte em madeira','Pintura, texturas e acabamentos para criar peças com personalidade.','Conheça preparação, pintura, texturas e acabamentos para criar peças de madeira com personalidade.','["Aulas organizadas para acompanhar no seu ritmo.","Orientações sobre materiais e preparação.","Detalhes de execução e acabamento.","Projeto pensado para colocar o aprendizado em prática."]'::jsonb,true,3),
('curso','scrapbook-memorias','Scrapbook: Memórias que ficam','Scrapbook','Papéis, composição e detalhes para transformar histórias em projetos afetivos.','Explore papéis, composição e detalhes para transformar lembranças em projetos especiais.','["Aulas organizadas para acompanhar no seu ritmo.","Orientações sobre materiais e preparação.","Detalhes de execução e acabamento.","Projeto pensado para colocar o aprendizado em prática."]'::jsonb,true,4)
on conflict (content_type, slug) do update set title=excluded.title, category=excluded.category, summary=excluded.summary, content=excluded.content, steps=excluded.steps, published=excluded.published, sort_order=excluded.sort_order;
