# Validação da migração Astro 7 + TypeScript

Iniciada em 02/10/2026. Este relatório registra a validação técnica e o estado remoto conferido abaixo. Nenhum resultado comprova publicação em `unolabs.com.br` ou entrega real de mensagens.

## Origem e escopo

- Repositório: [uno-labs-br/uno-labs](https://github.com/uno-labs-br/uno-labs).
- Referência anterior: `7d243eb9e40504f1b457f28792273e15645ea8ef`, `main` limpa, atualizada por fetch e fast-forward antes da criação da branch.
- Branch da migração: `codex/migracao-astro7-ts`.
- Checkout oficial: `D:\00 - PROJETOS\01 - UNO LABS - LP\04 - SITE`.
- Referência visual extraída do `public/` desse checkout antes de retirar as fontes substituídas. A extração histórica de outro diretório não foi usada.
- Home, privacidade e 404 convertidos em páginas/componentes Astro; CSS global e interações TypeScript. Coleção MDX vazia, com schema, autores, rota e layout de artigo preparados.
- Worker, `wrangler.jsonc`, PHP alternativo e n8n sem diff. Ativos de imagem e fontes preservados. Metadados de geração das imagens foram movidos para documentação, fora da distribuição.
- Sem React/Vue/Svelte, SPA, SSR, adaptador de servidor ou biblioteca de animação. Sem configuração de domínio, backend, analytics, Clarity ou Turnstile.

## Ambiente e resultado local

Windows, Node `24.14.1`, npm `11.11.0`, Astro `7.3.5`, MDX `8.0.2`, TypeScript `6.0.3`, Playwright `1.63.0`, Chromium headless. TypeScript usa `astro/tsconfigs/strict`. O servidor de inspeção foi `astro preview` em `http://127.0.0.1:4321/`, servindo `04 - SITE/dist`.

| Verificação executada | Resultado |
|---|---|
| `npm run check` / verificação incluída em `npm run build` | 47 arquivos; zero erros e zero warnings de diagnóstico; um hint de depreciação descrito abaixo |
| Build com `UNO_DEPLOY_TARGET=production` e `tests/build.test.mjs` | Build estático e 3/3 testes; diretivas originais da home/privacidade e 404 com `noindex` |
| Build restaurado para `UNO_DEPLOY_TARGET=preview` e `tests/build.test.mjs` | 3/3; três páginas HTML, robots e sitemap; nenhum artigo ou `/blog/` vazio |
| `tests/contato.test.mjs` | 9/9; contrato do Worker com rede simulada |
| `tests/editorial.test.mjs` | 23/23 |
| `tests/editorial-build.test.mjs` | 20/20, com builds reais em diretórios temporários isolados |
| `tests/migracao-browser.cjs` | 40/40; zero erros de execução ou recursos |
| `tests/adapt-browser.cjs`, grupo de tamanhos | 44/44; sete viewports; zero erros de execução |
| `tests/adapt-browser.cjs`, grupo de interações | 45/45; zero erros de execução |
| `tests/orbita-browser.cjs` | 30/30 na referência e 30/30 no build Astro |
| `tests/contato-browser.cjs` | 116/116; zero erros de execução; nenhum envio externo |
| `npm run deploy` | Encerramento local com código 1 e orientação de integração futura, sem rede |
| Revisão independente de DOM e CSS | Textos, IDs, contratos e aparência preservados; detalhes abaixo |

O hint refere-se a `MediaQueryList.addListener`, mantido somente como fallback para navegadores sem `addEventListener`. Não houve supressão de tipos nem uso de `@ts-nocheck`. As mensagens de coleção vazia do Astro são esperadas: não há artigos aprovados nesta entrega. Elas não impediram o build.

`npm ci` com o lockfile final passou em Linux no GitHub Actions e em um worktree Windows limpo, destacado no commit `aa59121c92b4e79a62f4bc385dcc93bd0b01775e`. No Windows também passaram build e 35 contratos de distribuição, Worker e schema editorial; `git status --porcelain` permaneceu vazio. O diretório isolado é `00 - ARQUIVOS EXCLUIR/astro-qa/clean-aa59121`. Essa verificação é da branch; a versão integrada ainda deve ser confirmada depois do merge.

## Layout, conteúdo e interações

| Janela | Modo da jornada observado | Resultado |
|---|---|---|
| 320 × 568 | linear | sem corte e sem overflow global |
| 360 × 640 | linear | sem corte e sem overflow global |
| 390 × 844 | sticky | quatro etapas acessíveis e sem corte |
| 844 × 390 | linear | alternativa adequada à altura |
| 768 × 1024 | sticky | quatro etapas acessíveis e sem corte |
| 1280 × 720 | linear | alternativa adequada à altura |
| 1440 × 900 | sticky | quatro etapas acessíveis e sem corte |

Foram verificados menu por teclado, Escape e retorno do foco, FAQ, Tab dentro do dialog, troca de formato, replay do estudo visível, pausa fora da tela, movimento reduzido no carregamento e em execução, mudança de orientação, toque emulado, reflow lógico de 200% e contexto sem JavaScript. Sem JS, navegação e contatos permanecem disponíveis e o botão de envio fica desabilitado com alternativa explícita.

A revisão independente abriu Módulo, Atria e Casa Noma nos dois formatos, em desktop e celular: 12 combinações. Conferiu IDs únicos, referências SVG `url(#id)`/`href`, imagens, `inert` e foco após fechar. O teste de migração também verificou ausência de `IntersectionObserver`/`ResizeObserver` e fallback estático. As âncoras internas possuem destinos.

O teste de adaptação original apresentou instabilidade ao alternar mídia e viewport depois da rodada longa de tamanhos, também reproduzida na base HTML anterior. As verificações foram executadas em processos separados: 44 de tamanhos e 45 de interações passaram, sem retirar asserções. O script agora permite selecionar os grupos e reinicia o navegador entre eles na execução completa. Isso não representa homologação de mudanças rápidas de preferências em todos os navegadores físicos.

Comparação estrutural independente: home com 1.048 elementos e 466 nós de texto relevantes; privacidade com 71 elementos e 64 nós de texto. Alterações de atributos limitaram-se à resolução de caminhos pela raiz. O compilador exigiu um espaço explícito entre os dois links do 404; o resultado foi recompilado e passou na comparação textual.

## Evidência visual e recursos

Foram comparadas home, estudos, equipe e contato em 1440 × 900 e 390 × 844, com a mesma fonte carregada, movimento reduzido e posição da página. As oito capturas finais tiveram caixa de diferença nula na comparação de pixels com Pillow; também tiveram zero pixels com diferença de canal acima de 10.

A primeira tentativa de processamento CSS removia `backdrop-filter` sem prefixo e alterava o desfoque. A correção mantém CSS global, três links ordenados (`fonts`, `site`, `conceitos`) e desativa a minificação de CSS. `site.css` e `conceitos.css` são idênticos à referência após normalizar CRLF; fontes mudaram somente para caminhos a partir da raiz. O resultado final corrigido é o usado nas oito comparações.

Os dez arquivos de fonte foram carregados explicitamente por `FontFace.load()` e tiveram status `loaded`. Imagens visíveis e lazy foram verificadas, incluindo as variantes dos estudos. Privacidade e 404 não recebem o JavaScript da home; a home recebe um único módulo compilado. Não há TypeScript cru no navegador.

Capturas e relatórios volumosos locais ficam em `D:\00 - PROJETOS\01 - UNO LABS - LP\00 - ARQUIVOS EXCLUIR\astro-qa`:

- `baseline/` e `compilado-final/`: oito capturas de cada versão;
- `comparacao-final.json`: resultados da comparação visual;
- `orbita-baseline/resultado.json` e `orbita-compilado/resultado.json`;
- `contato-compilado/resultado.json`;
- `uno-adapt/tamanhos-final/report.json` e `uno-adapt/interacoes-diagnostico/report.json`.

O relatório de contratos HTML está em `.qa/migracao/report.json`, ignorado pelo Git. A evidência permanente é este registro, os testes versionados e a referência recuperável no Git; o site e os checks não dependem da pasta de descarte.

A revisão independente mediu localmente gzip da home: HTML de 21.584 para 20.454 bytes e JavaScript de 9.891 para 6.638 bytes. São tamanhos dos arquivos, não ganho comprovado de velocidade. Não foram atribuídas notas Lighthouse ou aprovação de Core Web Vitals.

## Formulário e backend

O browser interceptou todas as submissões, usando dados fictícios e bloqueando destinos externos. Passaram validação vazia/canal inválido, honeypot, payload, ausência de duplicação, estado de envio, confirmação estrita e preservação de dados nas falhas.

Quinze cenários de falha foram simulados: HTTP 200 sem aceite SMTP, `ok` textual, encaminhamento pendente, JSON nulo, array, JSON malformado, HTML, 204 vazio, HTTP 500 com corpo de sucesso, 422 válido, 422 com campos malformados, 503, 403, falha de rede e timeout de 15 segundos. O relógio virtual confirmou ausência de confirmação antes do timeout. Somente resposta HTTP aceita com `ok === true` e `encaminhamento === 'smtp_aceito'` libera a confirmação.

Isso comprova a interface e seu contrato, sem comprovar SMTP ou recebimento na caixa. A prévia estática não implementa `/api/contato`. Worker, PHP e n8n permaneceram byte a byte iguais no diff. Nenhum e-mail ou WhatsApp real foi enviado.

## Editorial, SEO e distribuição

Os 43 testes editoriais incluem os sete campos obrigatórios ausentes e inválidos, autor desconhecido, capa ausente/removida após cache, datas inválidas, atualização anterior à publicação, `draft` seguro, slug inválido e colisão após normalização. Uma fixture MDX válida renderizou corpo e componente Astro, capa com dimensões reais, autor, canonical, metadados e JSON-LD, sem JavaScript executável. Rascunhos, datas futuras e omissão de `draft` ficaram fora das rotas e do sitemap.

Os builds de fixtures ocorreram em `mkdtemp`, com cópias próprias; a ligação de `node_modules` foi desfeita antes da limpeza. A coleção do checkout final contém somente `.gitkeep`. Nenhuma fixture, artigo fictício, fonte TS, documento, segredo, Worker ou PHP faz parte de `dist/`.

Canonical oficial e JSON-LD da home foram comparados com a referência. O sitemap contém somente home e privacidade, sem `lastmod` artificial. `robots.txt` permite rastrear as diretivas; no target de prévia não anuncia sitemap. A home, a privacidade e o 404 recebem `noindex, nofollow` no build de teste. Um caminho inexistente retorna HTTP 404 com página própria, sem rewrite para a home.

`vercel.json` define build Astro, saída `dist/` e `X-Robots-Tag: noindex, nofollow` incondicional. A validação remota desse cabeçalho é separada do HTML local e será registrada junto ao deployment efetivamente inspecionado.

## Como reproduzir

Na raiz do checkout, após `npm ci` e `npm run build`:

```powershell
node --test tests/contato.test.mjs tests/build.test.mjs tests/editorial.test.mjs
node --test tests/editorial-build.test.mjs
npx playwright install chromium
npm run preview
```

Em outro terminal da mesma raiz, com a prévia compilada em execução:

```powershell
$env:UNO_QA_URL = 'http://127.0.0.1:4321/'
node tests/migracao-browser.cjs
node tests/contato-browser.cjs
node tests/orbita-browser.cjs
$env:UNO_QA_VIEWPORTS_ONLY = '1'
node tests/adapt-browser.cjs tamanhos
Remove-Item Env:UNO_QA_VIEWPORTS_ONLY
$env:UNO_QA_INTERACTIONS_ONLY = '1'
node tests/adapt-browser.cjs interacoes
Remove-Item Env:UNO_QA_INTERACTIONS_ONLY
```

Os testes de comparação usam o commit de referência do Git; precisam de seu histórico acessível. A CI executa instalação, tipos, build e contratos Worker/editoriais/distribuição em Linux; navegador foi validado localmente nesta entrega.

## Revisão, integração e limites

Subagentes usados: GPT-6.1 Sol High para documentação; GPT-6.1 Sol xHigh para interações, editorial e revisão independente. Seleção explícita por ferramentas diretas do Codex, sem OpenCode ou outros workers. O modelo do principal é uma configuração do aplicativo, não foi alterado pelo repositório. A revisão independente não encontrou regressão nova ou bloqueador; não é aprovação humana fictícia.

Antes do envio, `origin/main` continuava em `7d243eb9e40504f1b457f28792273e15645ea8ef`. A inspeção das automações remotas mostrou um deployment do bot Vercel para a prévia de teste existente e nenhum workflow de publicação oficial. O novo workflow de CI apenas verifica. O nome `Production` usado pela integração Vercel não transforma esse ambiente de teste em publicação autorizada no domínio oficial.

### Estado remoto comprovado

- [PR #6](https://github.com/uno-labs-br/uno-labs/pull/6), aberto contra `main` e anexado ao chat. Commit de implementação revisado: `aa59121c92b4e79a62f4bc385dcc93bd0b01775e`.
- [CI da implementação](https://github.com/uno-labs-br/uno-labs/actions/runs/36965042789): sucesso em 57 segundos. Instalação limpa, tipos, build, 35 contratos Worker/schema/distribuição e 20 builds editoriais aprovados em Linux.
- A integração Vercel criou o deployment de prévia `6801347876` para esse mesmo SHA, mas [o deployment falhou](https://vercel.com/obrunogonzagas-projects/uno-labs/2fwwi9P1JiHLpRUijnkyguckSQYD). O metadado do comentário oficial do bot informa `rootDirectory: public`, incompatível com a nova raiz de fontes/build. O log completo ainda exige sessão no painel; a causa detalhada não foi confirmada nele.
- O acesso ao painel redirecionou para login; não havia sessão CLI local disponível. É necessário acesso ao projeto Vercel para ajustar **Settings → Build and Deployment → Root Directory** para a raiz do repositório (campo vazio), conferir Astro/Node 24, `npm run build` e `dist`, e refazer a prévia do SHA atual. A [documentação oficial](https://vercel.com/docs/builds/configure-a-build#root-directory) trata essa raiz como configuração do projeto; ela não é um campo de `vercel.json`.
- Cabeçalhos e versão da prévia remota ainda não foram homologados. O endereço antigo não foi usado como prova do build novo.
- Merge e verificação do SHA integrado continuam pendentes até resolver o check remoto. Não houve push direto para `main`, bypass ou alteração de proteções. A autorização de Urias já existe; o impedimento é o acesso/configuração do serviço, não uma nova aprovação humana de Git.

Limites: Chromium local e emulação de toque/reflow, sem homologação em dispositivos físicos, Safari ou Firefox; sem avaliação de usuários reais ou teste de entrega de mensagens. Continuam pendentes integração da hospedagem com `dist/`, backend/SMTP, Clarity e publicação no domínio oficial. O `wrangler.jsonc` legado ainda serve `public/`, motivo do bloqueio local de deploy.

Referências oficiais: [Astro 7](https://astro.build/blog/astro-7/), [TypeScript no Astro](https://docs.astro.build/en/guides/typescript/), [Content Collections](https://docs.astro.build/en/guides/content-collections/), [MDX](https://docs.astro.build/en/guides/integrations-guide/mdx/), [Astro na Vercel](https://docs.astro.build/en/guides/deploy/vercel/), [configuração Vercel](https://vercel.com/docs/project-configuration) e [noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
