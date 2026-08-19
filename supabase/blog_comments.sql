-- Kari Do Canto — Comentários bilíngues do blog
create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references public.content_items(id) on delete cascade,
  slug text not null,
  locale text not null check (locale in ('pt-BR','es-LA')),
  name text not null,
  email text not null,
  comment text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  moderated_at timestamptz,
  moderated_by uuid
);

create index if not exists blog_comments_public_idx on public.blog_comments (slug, locale, status, created_at desc);
create index if not exists blog_comments_pending_idx on public.blog_comments (status, created_at desc);

alter table public.blog_comments enable row level security;

drop policy if exists "Public can read approved blog comments" on public.blog_comments;
create policy "Public can read approved blog comments"
on public.blog_comments for select
to anon, authenticated
using (status = 'approved');

-- Inserts are intentionally handled by the server API with the service role.
-- No anonymous insert/update/delete policy is created.

comment on table public.blog_comments is 'Comentários do blog com moderação, separados por pt-BR e es-LA.';
