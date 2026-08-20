create table if not exists public.youtube_oauth_tokens (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'youtube',
  channel_id text not null,
  channel_title text,
  refresh_token text not null,
  scope text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider, channel_id)
);

create table if not exists public.youtube_seo_proposals (
  id uuid primary key default gen_random_uuid(),
  video_id text not null unique,
  current_title text,
  current_description text,
  current_tags jsonb not null default '[]'::jsonb,
  current_category_id text,
  transcript_used boolean not null default false,
  source_text text,
  proposal jsonb not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.youtube_oauth_tokens enable row level security;
alter table public.youtube_seo_proposals enable row level security;

-- These tables are intentionally accessed only by server routes using the service role key.
-- Do not create public policies for them.
