-- Kari Do Canto — V2 bilingual content
create table if not exists public.content_translations (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.content_items(id) on delete cascade,
  language text not null check (language in ('es-LA')),
  title text not null default '',
  category text not null default '',
  summary text not null default '',
  content text not null default '',
  steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(content_id, language)
);
create index if not exists content_translations_content_language_idx on public.content_translations(content_id, language);
alter table public.content_translations enable row level security;
drop policy if exists "Public can read content translations" on public.content_translations;
create policy "Public can read content translations" on public.content_translations for select using (true);
drop policy if exists "Authenticated can manage content translations" on public.content_translations;
create policy "Authenticated can manage content translations" on public.content_translations for all to authenticated using (true) with check (true);
