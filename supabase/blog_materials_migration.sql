-- Kari Do Canto — Lista de materiais bilíngue para artigos
-- Execute uma vez no Supabase SQL Editor.

alter table public.content_items
  add column if not exists materials jsonb not null default '[]'::jsonb;

alter table public.content_translations
  add column if not exists materials jsonb not null default '[]'::jsonb;
