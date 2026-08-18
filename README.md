# Kari do Canto — v0.7

Site em Next.js preparado para GitHub Actions + Cloudflare Workers + Supabase.

## Correção de compatibilidade Cloudflare

Esta versão usa Next.js 15.5.21, compatível com `@opennextjs/cloudflare` 1.20.2. A versão anterior usava Next.js 14.2.32, causando `ERESOLVE` no GitHub Actions.

## Integrações

- Supabase para leads, newsletter e conteúdo.
- Cloudflare Web Analytics (RUM) via `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`.
- Painel `/admin/dashboard` com status do Analytics e atalho para o Web Analytics do Cloudflare.
- Cloudflare Workers via OpenNext.
- Galeria leve de YouTube: thumbnails primeiro, player somente após clique.
- Instagram carregado sob demanda para preservar performance.

## GitHub Secrets

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN
```

## Supabase

Execute o SQL principal e `supabase/lead_capture_migration.sql` no projeto Supabase antes de testar a captura de leads.

## Deploy

O workflow `.github/workflows/deploy-cloudflare.yml` executa instalação, typecheck e deploy OpenNext para Cloudflare Workers.
