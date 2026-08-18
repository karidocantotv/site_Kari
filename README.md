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


## Next.js 15 compatibility

Dynamic route `params` are handled as Promises across App Router pages and metadata generation, matching Next.js 15.


## Cloudflare automated deployment

The GitHub Actions deploy workflow uses the Cloudflare API to ensure the account has a `workers.dev` subdomain before running OpenNext deploy. This avoids interactive Wrangler onboarding in CI. The Cloudflare API requires a token with at least **Workers Scripts Write** permission for the account subdomain operation.

## Painel de imagens

O `/admin/dashboard` inclui o Gerenciador de Imagens integrado ao Supabase Storage. O administrador entra com um usuário do Supabase Auth e pode enviar, listar e excluir imagens nos buckets `site`, `karina`, `courses`, `projects` e `blog`, registrando também posição/uso e texto alternativo.

Execute `supabase/media_migration.sql` uma vez no Supabase. Depois crie um usuário administrador em **Authentication → Users** no Supabase para entrar no painel.

## V1.6.1 — Painel Vital otimizado

- Painel Vital com configuração de até 5 vídeos do YouTube.
- A Home usa as capas dos vídeos cadastrados no painel.
- O player do YouTube só é carregado após o clique e **não usa autoplay**.
- Blog, Projetos e Cursos passaram a abrir suas páginas de configuração no Painel Vital.
- Configurações básicas dessas seções (título, descrição e ativo na Home) são armazenadas em `site_settings`.

### Supabase

Execute uma vez o arquivo `supabase/site_settings_migration.sql` no SQL Editor do projeto Supabase antes de usar as novas configurações do Painel Vital.

## V1.6.8 — Conteúdo dinâmico do Painel Vital

Esta versão transforma Blog e Cursos em módulos de conteúdo gerenciáveis pelo Painel Vital.

### Migração Supabase obrigatória

Execute uma vez o arquivo:

`supabase/content_migration.sql`

Ele cria `content_items`, aplica RLS e migra os quatro artigos e quatro cursos existentes para a nova estrutura.

### Comportamento

- Blog: criar, editar, ordenar, publicar/despublicar, alterar slug, resumo, conteúdo, categoria, duas imagens e molde ZIP.
- Cursos: criar, editar, ordenar, publicar/despublicar, alterar slug, resumo, conteúdo, categoria e imagem de capa.
- Home: carrega automaticamente os conteúdos publicados.
- Se houver menos de quatro conteúdos na Home, os espaços restantes exibem “Em breve”.
- Se houver cinco ou mais conteúdos, a Home mostra os quatro primeiros por ordem; as páginas `/blog` e `/cursos` mostram todos os publicados.
- Novos artigos/cursos publicados passam a gerar suas próprias URLs e entram no sitemap automaticamente.
- O conteúdo antigo permanece como fallback somente se o Supabase estiver indisponível durante a renderização.
