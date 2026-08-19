-- Kari Do Canto — Newsletter bilíngue + campanhas
-- Execute uma vez no Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  locale text not null default 'pt-BR',
  source text not null default 'footer',
  consent boolean not null default true,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  unsubscribe_token uuid not null default gen_random_uuid()
);

alter table public.newsletter_subscribers
  add column if not exists locale text not null default 'pt-BR',
  add column if not exists unsubscribed_at timestamptz,
  add column if not exists unsubscribe_token uuid default gen_random_uuid();

update public.newsletter_subscribers
set locale = 'pt-BR'
where locale is null or locale = '';

update public.newsletter_subscribers
set unsubscribe_token = gen_random_uuid()
where unsubscribe_token is null;

create unique index if not exists newsletter_subscribers_unsubscribe_token_idx
on public.newsletter_subscribers(unsubscribe_token);

create index if not exists newsletter_subscribers_locale_idx
on public.newsletter_subscribers(locale);

create table if not exists public.newsletter_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  preheader text,
  body_html text not null,
  locale text not null default 'pt-BR',
  status text not null default 'draft' check (status in ('draft','sending','sent','failed')),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_sends (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.newsletter_campaigns(id) on delete cascade,
  subscriber_id uuid not null references public.newsletter_subscribers(id) on delete cascade,
  status text not null default 'sent' check (status in ('sent','failed')),
  provider_id text,
  error text,
  sent_at timestamptz not null default now(),
  unique(campaign_id, subscriber_id)
);

create or replace function public.set_newsletter_campaign_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists newsletter_campaigns_updated_at on public.newsletter_campaigns;
create trigger newsletter_campaigns_updated_at
before update on public.newsletter_campaigns
for each row execute function public.set_newsletter_campaign_updated_at();

alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_campaigns enable row level security;
alter table public.newsletter_sends enable row level security;

drop policy if exists "Public can subscribe to newsletter" on public.newsletter_subscribers;
create policy "Public can subscribe to newsletter"
on public.newsletter_subscribers for insert to anon, authenticated
with check (consent = true);

drop policy if exists "Authenticated can manage newsletter subscribers" on public.newsletter_subscribers;
create policy "Authenticated can manage newsletter subscribers"
on public.newsletter_subscribers for all to authenticated
using (true) with check (true);

drop policy if exists "Authenticated can manage newsletter campaigns" on public.newsletter_campaigns;
create policy "Authenticated can manage newsletter campaigns"
on public.newsletter_campaigns for all to authenticated
using (true) with check (true);

drop policy if exists "Authenticated can read newsletter sends" on public.newsletter_sends;
create policy "Authenticated can read newsletter sends"
on public.newsletter_sends for select to authenticated
using (true);

-- Leads também recebem idioma automaticamente a partir da URL /es.
alter table public.leads
add column if not exists locale text not null default 'pt-BR';

create index if not exists leads_locale_idx on public.leads(locale);

update public.leads
set locale = case when source_page like '/es%' then 'es-LA' else 'pt-BR' end
where locale is null or locale = '' or locale = 'pt-BR';
