# UNO Labs — projeto oficial do site

Frontend estático em Astro 7 + TypeScript, base editorial MDX e backend de contato existente preservado. A migração não homologa o formulário nem publica `unolabs.com.br`.

**Pasta oficial no computador de Urias:** `D:\00 - PROJETOS\01 - UNO LABS - LP\04 - SITE`. Seu conteúdo corresponde diretamente à raiz de [uno-labs-br/uno-labs](https://github.com/uno-labs-br/uno-labs); execute Git e npm nela.

## Plano de oferta (doc oficial)

Oferta, preços, contratos e canvas da UNO Labs, UNO Sites e UNO Chat, decididos por Bruno e Urias em 09/10/2026: **[Plano de oferta UNO Labs](https://claude.ai/artifact/MMmPWfjdqrwi9uURfNpubf)**. É a referência oficial para oferta e preços; em caso de divergência com os documentos de `docs/`, prevalece o plano. Preços sujeitos à confirmação do Urias.

## Referências

| Uso | Referência |
|---|---|
| Oferta, preços e contratos | [Plano de oferta UNO Labs](https://claude.ai/artifact/MMmPWfjdqrwi9uURfNpubf) — doc oficial |
| Operação, comandos, preview e pendências | [LEIA-ME.md](LEIA-ME.md) — manual central |
| Fontes da home e páginas auxiliares | `src/pages/` e `src/components/` |
| Estilos e interações | `src/styles/` e `src/scripts/` |
| Artigos MDX e validação | `src/content/blog/` e `src/content.config.ts` |
| Ativos locais | `public/assets/` |
| Saída compilada; análise visual | `dist/`, servido por `npm run preview` |
| Backend preservado; integração adiada | `worker/index.js`, `wrangler.jsonc`, `hospedagem-tradicional/` |
| Marca, mensagem e requisitos | [Documentação completa](docs/UNO_Labs_Documentacao_Completa.md) |
| Design e arquitetura | [Construção do site](docs/UNO_Labs_Construcao_do_Site.md) |
| Evidências e estado da integração | [Relatório da migração](docs/verificacoes/migracao-astro7-ts/RELATORIO.md) |
| Regras de colaboração | [AGENTS.md](AGENTS.md) |

O manual central informa runtime, instalação e verificações. `public/` sozinho já não serve o site completo. A configuração Wrangler continua legada, e `npm run deploy` está bloqueado localmente até a integração da hospedagem Astro. A prévia usa `UNO_DEPLOY_TARGET=preview` e `noindex`.

A extração local `03 - ANALISE LP/uno-labs-main` é histórica. A implementação HTML anterior permanece no histórico Git. Novas análises usam as fontes Astro e seu build correspondente; um PR, um build local ou uma prévia não comprovam publicação oficial.
