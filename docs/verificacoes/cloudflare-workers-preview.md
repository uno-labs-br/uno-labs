# Prévia Cloudflare Workers — 02/10/2026

Base: `main` no commit `6dcb7ca` (PR #8 integrado). Configuração entregue em `wrangler.preview.jsonc`, com assets de `dist/`, Worker `unolabs-site-preview`, `workers_dev` habilitado e nenhuma rota de domínio próprio. A configuração legada e o bloqueio de produção permanecem.

## Verificações locais

- Node `24.14.1`, npm `11.11.0`, Wrangler instalado `4.145.0`.
- `UNO_DEPLOY_TARGET=preview npm run build`: 10 páginas geradas; verificação Astro sem erros. Permanecem o aviso de API legada de movimento e os avisos de diretiva MDX já presentes na base.
- `npx wrangler deploy --config wrangler.preview.jsonc --dry-run`: 88 arquivos lidos de `dist/`, binding `ASSETS` resolvido, sem publicação.
- `node --test tests/contato.test.mjs tests/build.test.mjs tests/editorial.test.mjs`: 38 testes aprovados. O teste de preservação editorial passou a aceitar CRLF e LF; antes falhava no checkout Windows ao ler o frontmatter dos mesmos artigos.
- `node --test tests/editorial-build.test.mjs`: 22 testes aprovados, incluindo a exclusão de rascunhos em produção.
- Runtime local: `npx wrangler dev --config wrangler.preview.jsonc --port 8797 --local`, servindo `04 - SITE/dist` e o Worker existente.

| Caminho | Resposta observada |
|---|---|
| `/`, `/blog/`, `/politica-de-privacidade/` | HTTP 200, `noindex, nofollow`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` |
| Cada um dos seis artigos em revisão | HTTP 200 com as mesmas diretivas e cabeçalhos |
| Caminho inexistente | HTTP 404 com `noindex, nofollow` e os cabeçalhos de proteção |
| `GET /api/contato` | HTTP 405 |
| `POST /api/contato` com dados fictícios e sem secrets | HTTP 503, `erro: nao_configurado`; sem envio externo |

## Limitações e próxima etapa

Nenhum deploy remoto, alteração de DNS, domínio próprio, cadastro de secrets, SMTP ou envio real foi feito nesta validação. A conexão GitHub do painel Cloudflare e a implantação remota precisam ser concluídas após revisão e integração do PR na `main`. Conferir as mesmas rotas e os cabeçalhos na URL efetivamente publicada.

Os seis artigos permanecem rascunhos de revisão. `noindex` controla indexação, não acesso: a URL de prévia será pública. O receptor de contato depende de homologação própria e não deve receber credenciais de produção na prévia.

Referências: [configuração de Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), [roteamento de assets e Worker](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/) e [integração GitHub](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/).
