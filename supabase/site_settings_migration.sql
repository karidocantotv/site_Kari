-- Kari Do Canto — Configurações do site / Painel Vital
-- Execute uma vez no Supabase SQL Editor.

create table if not exists public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

create or replace function public.set_site_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_site_settings_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings for select
using (true);

drop policy if exists "Authenticated can manage site settings" on public.site_settings;
create policy "Authenticated can manage site settings"
on public.site_settings for all
to authenticated
using (true)
with check (true);

insert into public.site_settings (key, value) values
  ('youtube_url', 'https://www.youtube.com/@KaridoCanto'),
  ('youtube_video_id', ''),
  ('youtube_video_title', 'Vídeo 1'),
  ('youtube_video_enabled', 'false'),
  ('youtube_video_id_2', ''),
  ('youtube_video_title_2', 'Vídeo 2'),
  ('youtube_video_enabled_2', 'false'),
  ('youtube_video_id_3', ''),
  ('youtube_video_title_3', 'Vídeo 3'),
  ('youtube_video_enabled_3', 'false'),
  ('youtube_video_id_4', ''),
  ('youtube_video_title_4', 'Vídeo 4'),
  ('youtube_video_enabled_4', 'false'),
  ('youtube_video_id_5', ''),
  ('youtube_video_title_5', 'Vídeo 5'),
  ('youtube_video_enabled_5', 'false'),
  ('youtube_url_es', 'https://www.youtube.com/@KaridoCanto'),
  ('youtube_es_video_id', ''),
  ('youtube_es_video_title', 'Video 1'),
  ('youtube_es_video_enabled', 'false'),
  ('youtube_es_video_id_2', ''),
  ('youtube_es_video_title_2', 'Video 2'),
  ('youtube_es_video_enabled_2', 'false'),
  ('youtube_es_video_id_3', ''),
  ('youtube_es_video_title_3', 'Video 3'),
  ('youtube_es_video_enabled_3', 'false'),
  ('youtube_es_video_id_4', ''),
  ('youtube_es_video_title_4', 'Video 4'),
  ('youtube_es_video_enabled_4', 'false'),
  ('youtube_es_video_id_5', ''),
  ('youtube_es_video_title_5', 'Video 5'),
  ('youtube_es_video_enabled_5', 'false'),
  ('blog_title', 'Dicas e passo a passo para a casa'),
  ('blog_description', 'Aprenda uma técnica, escolha seus materiais e encontre inspiração para o próximo projeto.'),
  ('blog_enabled', 'true'),
  ('projetos_title', 'Projetos para criar com afeto'),
  ('projetos_description', 'Passo a passo, ideias e galerias para você transformar materiais em peças feitas à mão.'),
  ('projetos_enabled', 'true'),
  ('cursos_title', 'Cursos para criar com afeto'),
  ('cursos_description', 'Escolha uma técnica, acompanhe o passo a passo e transforme uma ideia em uma peça que tenha a sua cara.'),
  ('cursos_enabled', 'true')
on conflict (key) do nothing;
