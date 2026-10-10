> Atualização de 03/10/2026: a publicação dos seis artigos é descrita em [docs/blog/publicacao-2026-10-03.md](docs/blog/publicacao-2026-10-03.md). No mesmo dia, o domínio oficial deixou a Vercel e passou a ser servido pelo Worker `unolabs-site` na Cloudflare, que publica cada versão da `main` (seção 7, “Publicação no domínio oficial”). A Vercel continua apenas como ambiente de teste com `noindex`. As descrições abaixo de artigos em revisão registram o estado anterior.

# UNO Labs — instruções do site

**Atualização: 02/10/2026 — migração do frontend para Astro 7 + TypeScript.**

Esta é a única pasta oficial neste computador: `D:\00 - PROJETOS\01 - UNO LABS - LP\04 - SITE`. Seu conteúdo corresponde diretamente à raiz do repositório [uno-labs-br/uno-labs](https://github.com/uno-labs-br/uno-labs). Execute Git e npm nesta raiz; o Git da pasta geral é separado.

Este é o manual operacional central. Consulte [construção do site](docs/UNO_Labs_Construcao_do_Site.md) para intenção visual e comportamento, [documentação completa](docs/UNO_Labs_Documentacao_Completa.md) para negócio e conteúdo aprovado e [AGENTS.md](AGENTS.md) para colaboração. Resultados de validação, estado do PR, integração e limitações ficam no [relatório da migração](docs/verificacoes/migracao-astro7-ts/RELATORIO.md). A arquitetura descrita aqui não comprova publicação no domínio oficial nem homologação do contato.

## 1. O que mudou e por quê

O frontend passou de páginas HTML editadas diretamente em `public/` para fontes Astro em `src/`, com HTML gerado no build em `dist/`. A home, a política de privacidade e o 404 têm fontes próprias; `BaseLayout.astro` e `SEO.astro` compartilham estrutura e metadados. As seções da home são componentes reais, e os seis templates dos estudos ficam em `src/components/estudos/TemplatesEstudos.astro`.

As interações estão em TypeScript processado pelo Astro, com verificação estrita do DOM e das respostas do formulário. O build executa a verificação de tipos antes da geração de HTML: transpilar código sozinho não demonstra que os tipos estão corretos. O CSS permanece global, na ordem `fonts.css` → `site.css` → `conceitos.css`, para alcançar também as maquetes clonadas pelos scripts. Fontes, logos, retratos, imagens conceituais e favicons continuam locais em `public/`.

Os três estilos são emitidos como ativos com hash e links explícitos no layout. A minificação CSS está desativada para preservar declarações como `backdrop-filter` e a ordem da cascata; a primeira tentativa de processamento alterava o desfoque aprovado. A comparação visual posterior confirmou a preservação.

A base editorial usa MDX e Content Collections. Ela permite validar e gerar artigos futuros sem aguardar sua produção para migrar o frontend. A página `/blog/` lista os artigos disponíveis. Seis textos reais do PR #7 estão em MDX, com imagens e créditos preservados, marcados `draft: true` e `preview: true`: aparecem somente na prévia, como “Em revisão editorial”. Não há RSS público. Origem e limites em [importação do blog](docs/blog/importacao-pr7.md).

A stack é Astro `7.3.5`, `@astrojs/mdx` `8.0.2`, TypeScript `6.0.3` com `astro/tsconfigs/strict`, npm e lockfile. A saída é estática: sem adaptador de servidor, SSR, SPA ou framework de interface adicional. A origem canônica continua `https://unolabs.com.br`; isso não afirma que esse domínio já serve o build Astro.

O Worker, `wrangler.jsonc`, PHP alternativo e workflow n8n foram preservados. O antigo atalho `npm run deploy` foi substituído por um bloqueio local, sem rede, porque o `wrangler.jsonc` legado aponta para `public/`, que já não contém as páginas completas. A publicação oficial usa `wrangler.production.jsonc`, descrita na seção 7.

## 2. Onde editar

```text
04 - SITE/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── politica-de-privacidade/index.astro
│   │   ├── 404.astro
│   │   ├── blog/index.astro e [...slug].astro
│   │   ├── robots.txt.ts
│   │   └── sitemap.xml.ts
│   ├── components/
│   │   ├── Header.astro, Footer.astro, SEO.astro
│   │   ├── home/                    # seções da home e visualizador
│   │   └── estudos/TemplatesEstudos.astro
│   ├── layouts/                    # BaseLayout e layout de artigo
│   ├── scripts/                    # interações TypeScript
│   ├── styles/                     # fonts.css, site.css, conceitos.css
│   ├── data/                       # site, autores e dados compartilhados
│   ├── lib/blog.ts                 # seleção editorial centralizada
│   ├── content/blog/               # seis arquivos .mdx para revisão na prévia
│   └── content.config.ts           # schema editorial
├── public/
│   ├── assets/                     # fontes, imagens, ícones e licenças
│   ├── favicon.ico
│   ├── site.webmanifest
│   └── _headers                    # cabeçalhos legados Cloudflare
├── worker/index.js                 # receptor existente; não migrado
├── hospedagem-tradicional/         # alternativa Apache/PHP preservada
├── scripts/bloquear-deploy.mjs
├── tests/                          # verificações locais e simuladas
├── docs/                           # documentação permanente e evidências
├── astro.config.mjs, tsconfig.json
├── package.json, package-lock.json
├── vercel.json                     # build estático e noindex do ambiente de teste
├── wrangler.jsonc                  # legado: assets.directory = ./public
├── AGENTS.md
└── LEIA-ME.md
```

- Textos comerciais: componentes em `src/components/home/`; manter a ordem e o conteúdo aprovado.
- Dados comuns e origem canônica: `src/data/site.ts`. Dados de autoria: `src/data/authors.ts`; não atribuir autoria sem aprovação.
- Cores e medidas: tokens no topo de `src/styles/site.css`. Estilos dos estudos: `src/styles/conceitos.css`.
- Maquetes: seis `<template>` em `TemplatesEstudos.astro`; seus IDs, seletores, `data-*`, SVG, `inert` e relações ARIA são contratos dos scripts.
- Novas páginas: fontes em `src/pages/`; conferir geração, metadados e sitemap. Não recriar HTML concorrente em `public/`.
- Artigos: arquivos `.mdx` em `src/content/blog/`, conforme a seção 5.
- `dist/` e `.astro/` são gerados e ignorados pelo Git. Não editar nem versionar o build como substituto das fontes.

Análises visuais, Impeccable e localhost usam as fontes Astro e o HTML compilado correspondente. `public/` sozinho serve apenas os ativos. A extração `03 - ANALISE LP/uno-labs-main`, com `Main.dc.html`, é histórica; os avisos em `02 - DOCUMENTACAO` não substituem os documentos de `docs/`.

## 3. Instalar, desenvolver e verificar

Runtime de referência da migração: Node.js `24.14.1` e npm `11.11.0`. Use Node 24 LTS, conforme os arquivos de runtime e `package.json`. O frontend não usa o antigo requisito Node 20.

```powershell
cd 'D:\00 - PROJETOS\01 - UNO LABS - LP\04 - SITE'
npm ci
npm run dev
```

O desenvolvimento é Astro, normalmente em `http://localhost:4321`; conferir a URL efetivamente informada pelo terminal. Ele não inicia o Worker nem configura `/api/contato`.

| Comando | Uso |
|---|---|
| `npm ci` | Instalar exatamente o lockfile |
| `npm run dev` | Desenvolver o frontend Astro |
| `npm run check` | Executar `astro check` |
| `npm run build` | Executar `astro check && astro build`; gerar `dist/` |
| `npm run preview` | Servir o build de `dist/` localmente |
| `npm run test:worker` | Contrato do Worker com rede simulada |
| `npm run verificar:legado` | Dry run do Wrangler; não valida a hospedagem Astro |
| `npm run deploy` | Bloqueio local explícito; não publica |

Para revisar o resultado distribuível, execute `npm run build`, depois `npm run preview`. Informe ao abrir localhost que o servidor serve `04 - SITE/dist`, não `public/`. Não valide somente o servidor de desenvolvimento. A prévia deve manter 404 real para caminhos inexistentes, sem rewrite universal para a home.

Verificações de navegador usam interceptações e dados fictícios. Simular confirmação válida, 2xx inválido, JSON inválido, erro por campo, indisponibilidade e falha de rede; não encaminhar mensagens externas. Testar também teclado, movimento reduzido, ausência de JavaScript, menu, jornada, replay, visualizador, órbita, recursos e console nas dimensões registradas no relatório.

Checks automatizados após o build de prévia:

```powershell
node --test tests/contato.test.mjs tests/build.test.mjs tests/editorial.test.mjs
node --test tests/editorial-build.test.mjs
```

O workflow `.github/workflows/verificar.yml` executa esses contratos, `npm ci` e o build em PRs e na `main`; ele não publica o site. A integração editorial usa cópias temporárias isoladas, sem colocar fixtures na coleção do checkout. Para navegador, instale o Chromium de teste com `npx playwright install chromium`, mantenha `npm run preview` aberto e siga os comandos e condições do relatório. Os scripts aceitam `UNO_QA_URL`; não aponte os testes de formulário para um receptor real.

## 4. Prévia e proteção de indexação

`UNO_DEPLOY_TARGET` aceita `preview` e `production`. O padrão é `preview`: todas as páginas HTML recebem `noindex, nofollow`. `robots.txt` permite rastreamento para que o buscador leia essa diretiva; `Disallow` sozinho não substitui `noindex`.

`vercel.json` mantém `X-Robots-Tag: noindex, nofollow` em todas as respostas do ambiente de teste, independentemente do target de build. `_headers` da Cloudflare não comprova aplicação de cabeçalhos na Vercel; o cabeçalho efetivo precisa de inspeção na prévia remota.

Configuração esperada da prévia Vercel: raiz do repositório, framework Astro, Node 24, comando `npm run build`, saída `dist/`, `UNO_DEPLOY_TARGET=preview`. Se o projeto for selecionado pela pasta geral deste computador, a raiz de build é `04 - SITE`. O frontend estático não precisa de adaptador Vercel. O endereço informado `https://uno-labs.vercel.app/` é de teste; o relatório deve comprovar qual commit ele serve antes de usá-lo como evidência.

`production` é apenas uma capacidade local para conferir as diretivas originais das páginas, mantendo `noindex` no 404. Não altera contas nem autoriza publicação. Para comparar localmente em PowerShell:

```powershell
$env:UNO_DEPLOY_TARGET = 'production'
npm run build
Remove-Item Env:UNO_DEPLOY_TARGET
npm run build
```

O último build restaura a saída de prévia. A configuração Vercel entregue continua protegendo o ambiente remoto de teste com `noindex`.

## 5. Contrato editorial MDX

A coleção valida também rascunhos. Campos obrigatórios em todos os artigos: `title`, `description`, `tags`, `cover` e `coverAlt`. `pubDate` e `author` são obrigatórios para publicar (`draft: false`); podem estar ausentes em rascunhos, mas são validados quando fornecidos. Textos não podem estar vazios; tags devem conter ao menos um valor não vazio; o autor deve existir na lista aprovada; a capa precisa ser um arquivo local existente e acessível no build. `updatedDate` é opcional e não pode anteceder `pubDate`.

`draft` assume `true` quando omitido. A seleção central em `src/lib/blog.ts` só permite `draft === false` e data de publicação não futura. A comparação usa o dia de calendário em UTC, sem depender do fuso da máquina. O sitemap usa essa seleção de publicados. Rotas e listagens da prévia também admitem rascunhos com `preview: true`; o padrão dessa flag é `false`. Builds de produção nunca geram rascunhos. A prévia de revisão omite autoria, data de publicação e dados estruturados de artigo publicado. O slug vem do nome do arquivo, em formato validado; IDs inválidos e colisões precisam ser rejeitados. Não criar um segundo campo de slug.

Exemplo documental de frontmatter, sem artigo publicável:

```yaml
---
title: 'Título editorial aprovado'
description: 'Descrição revisada do artigo'
pubDate: '2026-10-02'
author: 'milena-dias' # só após aprovação real da autoria
tags: ['sites']
cover: '/assets/img/og-unolabs.png' # substituir por capa editorial aprovada
coverAlt: 'Descrição adequada da capa aprovada'
draft: true
# updatedDate: '2026-10-03' # opcional; não preencher automaticamente
---
```

O exemplo fica neste manual, fora da coleção e do build. Os identificadores de autores representam integrantes aprovados da equipe; não comprovam autoria de artigo. Antes de publicar conteúdo, revisar texto, autoria, imagem, descrição, data e licença. RSS e listagem pública dependem de tarefa editorial futura.

## 6. Limite do formulário

O cliente mantém `POST /api/contato`, os campos, honeypot, validação e timeout existentes. Só apresenta confirmação após uma resposta HTTP válida cujo JSON contenha `ok === true` e `encaminhamento === 'smtp_aceito'`. HTTP 2xx genérico, HTML, JSON inválido ou apenas `{ "ok": true }` não confirmam o contato. Erros preservam os dados e oferecem canais alternativos.

O fluxo previsto continua navegador → Worker → n8n → SMTP HostGator → `contato@unolabs.com.br`. A prévia Astro/Vercel estática não fornece esse receptor. Uma confirmação interceptada comprova somente o estado da interface. Não comprova configuração de Worker, webhook, SMTP nem recebimento na caixa.

São evidências distintas: aceitação do backend, aceitação do encaminhamento pelo SMTP e recebimento observado na caixa. Envios reais exigem autorização explícita para destinatário, ambiente e mensagem. O [roteiro de homologação](docs/CONTATO_HOMOLOGACAO.md) e o [modelo inativo do n8n](docs/n8n/uno-contato.modelo.json) permanecem como referências; sem credenciais ou homologação presumidas.

Os campos do fluxo existente incluem `nome`, `empresa`, `canal`, `site`, `servicos`, `servicosTexto`, `invest`, `investTexto`, `contexto`, `pagina`, `origem` e `recebidoEm`. Não registrar URLs privadas, tokens ou senhas. A compatibilidade existente com Turnstile permanece; não cadastrar chaves nem ativá-lo nesta migração.

Contatos comerciais: `contato@unolabs.com.br`, WhatsApp `(27) 93618-5141`, internacional `+5527936185141`, [link de WhatsApp](https://wa.me/5527936185141). Dados informados não comprovam funcionamento da caixa ou entrega.

## 7. Produção e integrações adiadas

### Prévia Cloudflare Workers

`wrangler.preview.jsonc` serve o build Astro de `dist/` no Worker separado `unolabs-site-preview`, em `workers.dev`. Não configura domínios próprios, DNS, secrets ou SMTP. As páginas e os seis artigos em revisão continuam em prévia com `noindex, nofollow`; os rascunhos não foram aprovados para produção. O Worker de contato é preservado: `/api/*` passa pelo código antes dos ativos, e a ausência dos secrets retorna indisponibilidade sem encaminhar mensagens.

Após revisão e integração desta configuração na `main`, configurar o aplicativo no painel Cloudflare:

| Campo | Valor |
|---|---|
| Repositório | `uno-labs-br/uno-labs` |
| Branch de publicação deste Worker de prévia | `main` |
| Nome do Worker | `unolabs-site-preview` |
| Diretório raiz | Raiz do repositório (`/`); não usar `04 - SITE` no GitHub |
| Comando de build | `npm run build` |
| Comando de deploy | `npx wrangler deploy --config wrangler.preview.jsonc` |
| Comando de prévia de branches, se habilitado | `npx wrangler preview --config wrangler.preview.jsonc` |
| Variável de build | `UNO_DEPLOY_TARGET=preview` |
| Versão do Node | Node 24, conforme `.nvmrc` e `package.json` |

Verificação local sem publicar: `npm run build`, seguido de `npx wrangler deploy --config wrangler.preview.jsonc --dry-run`. Para servir com o runtime de assets e Worker, usar `npx wrangler dev --config wrangler.preview.jsonc`. Conferir home, blog, artigos, 404 real, cabeçalhos e `noindex` também na URL remota depois da implantação. O Worker de prévia é público para quem tiver a URL; `noindex` não substitui controle de acesso.

Resultados locais e limites: [verificação da prévia Cloudflare](docs/verificacoes/cloudflare-workers-preview.md).

A configuração separada do Worker de produção, os domínios oficiais e o histórico da troca de hospedagem estão em [migração do domínio para Workers](docs/cloudflare-dominio-producao.md). O fluxo em uso está descrito a seguir.

### Publicação no domínio oficial

Desde 03/10/2026, `unolabs.com.br` e `www.unolabs.com.br` são servidos pelo Worker `unolabs-site` na Cloudflare; `www` redireciona para a raiz. O Workers Builds acompanha a `main`: cada integração compila com `UNO_DEPLOY_TARGET=production npm run build` e publica `dist/` com `npx wrangler deploy --config wrangler.production.jsonc`. Rotas `/api/*` passam pelo Worker antes dos ativos.

Não há etapa manual de publicação: **integrar um PR na `main` coloca a versão no domínio oficial em poucos minutos**. Por isso, a autorização para integrar equivale à autorização para publicar; pendências de conteúdo, preço ou texto precisam ser resolvidas antes do merge.

Para conferir cada publicação, aguardar o check “Workers Builds: unolabs-site” do commit de merge terminar com sucesso e só então verificar o domínio. Antes disso, o domínio ainda serve a versão anterior. Exemplo: o merge do PR #15 (`cb153f6`) foi publicado às 02:18 UTC de 06/10/2026, cerca de dois minutos após a integração.

O `wrangler.jsonc` legado ainda usa `assets.directory = ./public` e não serve o site completo; `npm run deploy` continua bloqueado localmente para impedir esse uso. Não publicar manualmente a partir de uma branch de tarefa nem usar `npx wrangler deploy` sem `--config wrangler.production.jsonc`. A alternativa Apache/PHP continua no repositório, sem homologação para o build Astro. Enviar somente `public/` ou seguir as antigas instruções HostGator não publica o site completo.

HostGator continua como o serviço SMTP previsto. As pendências de backend de contato, SMTP e medição estão na seção 8.

### Medição de audiência (Google Analytics 4 e Consentimento)

A integração do Google Analytics 4 (`G-ZKM57KG6V9`) foi adicionada no frontend Astro com as seguintes premissas de privacidade e segurança:

- **Modo de consentimento (Consent Mode v2):** padrão estrito com `analytics_storage: 'denied'`, `ad_storage: 'denied'`, `ad_user_data: 'denied'` e `ad_personalization: 'denied'`. Sinais de publicidade e remarketing permanecem permanentemente desativados (`allow_google_signals: false`, `allow_ad_personalization_signals: false`, `restricted_data_processing: true`).
- **Condições estritas de execução:** o script `gtag.js` só é injetado dinamicamente após consentimento concedido em ambiente de produção oficial (`UNO_DEPLOY_TARGET=production`, HTTPS e hostname `unolabs.com.br` ou `www.unolabs.com.br`). Ambientes de teste, localhost, Vercel e workers.dev não executam chamadas à API do Google, mesmo com HTML de produção.
- **Cobertura global:** home, índice do blog, artigos, política de privacidade e 404 carregam o módulo de consentimento. A configuração do SDK e o primeiro `page_view` aguardam seu carregamento e uma nova validação da permissão.
- **Preferência local e revogação:** escolha versionada em `localStorage` com validade de 180 dias. O botão permanente "Preferências de cookies" no rodapé permite rever ou revogar a escolha a qualquer momento, aplicando a diretiva técnica `window['ga-disable-G-ZKM57KG6V9'] = true`, update `denied` e remoção imediata dos cookies `_ga` e `_ga_*`, com sincronização entre abas sem recarregar a página.
- **Sanitização de URLs:** `page_location` omite fragmentos (`#`) e descarta parâmetros desconhecidos ou pessoais, preservando estritamente UTMs e identificadores de anúncio homologados (`utm_*`, `gclid`, `fbclid`, etc.); `page_referrer` transmite apenas origem e caminho.
- **Taxonomia de eventos:**
  - `page_view`: disparo único por carga de página quando consentido.
  - `form_start`: disparo no primeiro preenchimento real de campo do formulário (`form_id: 'form-contato'`, `form_name: 'contato'`), sem reter dados do usuário ou disparar em foco vazio.
  - `generate_lead`: disparo estritamente no ramo que valida HTTP 200 e confirmação de encaminhamento (`ok === true` e `encaminhamento === 'smtp_aceito'`). Não dispara em tentativas, validações locais, erros ou falhas de rede.
  - `contact_click`: cliques comerciais nos links de WhatsApp e e-mail com atributos `data-contact-channel`, `data-cta-id` e `data-cta-position`.
- **Passos dependentes do painel GA4:**
  1. Criação/conferência do fluxo de dados para a propriedade `G-ZKM57KG6V9`.
  2. Cadastro das dimensões personalizadas com escopo de evento no console: `contact_channel`, `cta_id`, `cta_position`, `lead_channel`, `form_id`, `form_name`.
  3. Verificação no DebugView durante navegação de teste.
  4. Marcação de `generate_lead` como evento chave/conversão, se desejado.
  *Verificação:* `node tests/analytics-browser.cjs` validou 73 condições, inclusive transporte do SDK oficial com os envios de teste interceptados. Após o PR #12, a publicação no Cloudflare e a recepção inicial de `page_view`, `first_visit` e `session_start` foram confirmadas na propriedade. Seis dimensões foram cadastradas e `generate_lead` marcado como evento principal sem valor fictício. Fuso São Paulo, BRL e retenção de 14 meses conferidos. Evidências e limites no [relatório GA4](docs/verificacoes/ga4/RELATORIO.md).

## 8. Pendências comerciais e de homologação

| Pendência | O que falta |
|---|---|
| Oferta UNO Sites por assinatura | Planos e preços decididos na issue #30 ([documentação, §0.14](docs/UNO_Labs_Documentacao_Completa.md)); falta confirmação de Urias e atualização da home (#36). Até lá, o site mantém “a partir de R$ 1.490” |
| CNPJ e razão social | Informar ou confirmar dados empresariais |
| Privacidade | Contato público confirmado: `contato@unolabs.com.br`; completar identificação legal, infraestrutura e guarda; revisar o texto |
| Worker, n8n e SMTP | Configuração real, credenciais, remetente e contrato de confirmação |
| Recebimento real | Evidências separadas do backend, SMTP e caixa `contato@unolabs.com.br` |
| Hospedagem Astro | Integração `dist/` e deploy automático da `main` confirmados no Cloudflare; verificar cada publicação no domínio |
| Artigos | Produzir e revisar 4 a 6 artigos-pilar; depois seguir a frequência aprovada |
| Mídia paga | Decidido na #30: verba à parte, paga pelo cliente; confirmar com Urias |
| Configuração do painel GA4 | Dimensões e evento principal configurados; recepção inicial confirmada em tempo real. Recepção de lead real depende da homologação do backend |

Garantia e prazo seguem a proposta de cada escopo; nenhum número provisório entra na home. Cargos, biografias e fotografias da equipe foram aprovados em 01/10/2026: Urias Loures e Bruno Gonzaga, cofundadores; Milena Dias, Comunicação e Conteúdo. Preservar os textos integrais registrados na documentação completa. Não confundir aprovação da apresentação da equipe com autoria editorial.

## 9. Evidências e colaboração

O [relatório permanente](docs/verificacoes/migracao-astro7-ts/RELATORIO.md) reúne commit de referência, versões, comandos e resultados, dimensões e rotas, estados simulados, capturas, revisão técnica, PR, SHA da integração e limitações. Consulte o estado registrado nele; este manual não atribui aprovação a testes não executados nem trata prévia como produção homologada.

Fluxo geral: atualizar → branch → editar/verificar → commit → push da branch → PR → revisão e autorização humana para integrar. Somente nesta migração, Urias autorizou antecipadamente commit, push, PR e merge tecnicamente validado, sem nova aprovação humana. A exceção não altera trabalhos futuros, proteções reais do GitHub nem a autorização de publicação no domínio. Preservar trabalho alheio e inspecionar automações antes da integração.

Sem JavaScript, conteúdo e contatos permanecem disponíveis; maquetes interativas não precisam ser desenhadas, e o formulário orienta usar os contatos. Movimento reduzido mantém a jornada linear e os estudos estáticos. As fontes locais cobrem o subconjunto latin; símbolos podem usar fallback do sistema.

Referências técnicas: [verificação de tipos no Astro](https://docs.astro.build/en/guides/typescript/#type-checking), [deploy estático Astro na Vercel](https://docs.astro.build/en/guides/deploy/vercel/) e [noindex no Google Search Central](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
