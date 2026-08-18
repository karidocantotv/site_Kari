-- KARI Do Canto — Media Library
-- Execute once in Supabase SQL Editor.
-- The panel uses Supabase Auth for authenticated media management.

create extension if not exists pgcrypto;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  filename text not null,
  alt_text text,
  slot text,
  width integer,
  height integer,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, path)
);

create index if not exists media_assets_slot_idx on public.media_assets(slot);
create index if not exists media_assets_bucket_idx on public.media_assets(bucket);

alter table public.media_assets enable row level security;

drop policy if exists "Public can view media assets" on public.media_assets;
create policy "Public can view media assets"
on public.media_assets for select
using (true);

drop policy if exists "Authenticated can manage media assets" on public.media_assets;
create policy "Authenticated can manage media assets"
on public.media_assets for all
to authenticated
using (true)
with check (true);

-- Ensure the standard public image buckets exist.
insert into storage.buckets (id, name, public)
values
  ('site', 'site', true),
  ('courses', 'courses', true),
  ('projects', 'projects', true),
  ('blog', 'blog', true),
  ('karina', 'karina', true)
on conflict (id) do update set public = true;

-- Public read is necessary for website images.
drop policy if exists "Public can view KARI media" on storage.objects;
create policy "Public can view KARI media"
on storage.objects for select
using (bucket_id in ('site','courses','projects','blog','karina'));

-- Only logged-in Supabase users can upload/change/delete media.
drop policy if exists "Authenticated can upload KARI media" on storage.objects;
create policy "Authenticated can upload KARI media"
on storage.objects for insert
to authenticated
with check (bucket_id in ('site','courses','projects','blog','karina'));

drop policy if exists "Authenticated can update KARI media" on storage.objects;
create policy "Authenticated can update KARI media"
on storage.objects for update
to authenticated
using (bucket_id in ('site','courses','projects','blog','karina'))
with check (bucket_id in ('site','courses','projects','blog','karina'));

drop policy if exists "Authenticated can delete KARI media" on storage.objects;
create policy "Authenticated can delete KARI media"
on storage.objects for delete
to authenticated
using (bucket_id in ('site','courses','projects','blog','karina'));

create or replace function public.set_media_assets_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists media_assets_updated_at on public.media_assets;
create trigger media_assets_updated_at
before update on public.media_assets
for each row execute function public.set_media_assets_updated_at();
