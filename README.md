# Kari do Canto — v0.5

Site em Next.js preparado para GitHub Actions + Cloudflare Workers + Supabase.

## Integrações

- Supabase para leads, newsletter e conteúdo.
- Cloudflare Web Analytics (RUM) via `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`.
- Painel `/admin/dashboard` com status do Analytics e atalho para o Web Analytics do Cloudflare.
- Cloudflare Workers via OpenNext.

## GitHub Secrets

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN
```

O `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` é o **Site Token** do Cloudflare Web Analytics e é usado apenas pelo beacon público. Ele não substitui um API Token para consultas GraphQL administrativas.

## Analytics

O beacon é carregado automaticamente em produção quando o token estiver presente. O painel mostra o status da integração e direciona para o dashboard do Cloudflare. Métricas completas não são expostas publicamente no browser.

## Supabase

Execute o SQL principal e `supabase/lead_capture_migration.sql` no projeto Supabase antes de testar a captura de leads.

## Deploy

O workflow `.github/workflows/deploy-cloudflare.yml` executa instalação, typecheck e deploy OpenNext para Cloudflare Workers.
