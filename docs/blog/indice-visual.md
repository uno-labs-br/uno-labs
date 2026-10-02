# Índice visual do blog — 02/10/2026

Registro da remodelação de `/blog/` em `src/pages/blog/index.astro` e `src/components/blog/BlogCard.astro`, após a rejeição da lista sem fotografias. A intervenção se limita ao índice; conteúdo dos artigos e home principal ficam fora deste escopo. O [contrato da superfície](../../.impeccable/surfaces/src-pages-blog-index-astro.md) registra a direção.

## Composição implementada

O título recuperado é “Um site melhor começa com a pergunta certa.”. Após a correção solicitada pelo usuário, os seis artigos aparecem em uma única grade, sempre com duas colunas acima de 600 px e uma no celular. Não há destaque isolado nem seções temáticas. A ordem vem da coleção editorial, sem separar por assunto.

O botão com contorno e seta “Voltar ao site” aparece acima do título do índice e no topo dos artigos, usando `BackToSite.astro`. Leva diretamente a `/` na mesma aba, sem depender do histórico ou de JavaScript. Nos artigos, “Voltar para o blog” continua disponível separadamente. A inclusão foi conferida no navegador em 1440 e 390 px, incluindo visibilidade inicial e retorno pelo teclado; build aprovado.

Cada artigo apresenta capa, título, resumo, assunto e condição editorial. O componente reutiliza as versões existentes das capas em `srcset`, carrega imediatamente as duas primeiras e adia as demais. No topo, Todos é a seleção inicial; Estratégia e conversão, Design e experiência e Contato e mensuração filtram a mesma grade. Todos restaura a lista e a ordem originais. Botões nativos indicam o estado com `aria-pressed`, preservam o foco e anunciam a quantidade de artigos; itens ocultos saem da navegação por teclado. Sem JavaScript, todos os artigos continuam acessíveis e os filtros ficam ocultos. A prévia continua com `noindex, nofollow` e com “Em revisão editorial”; esta composição não aprova nem publica os textos.

## Continuidade da identidade e das imagens

A comparação entre o §4 de [Construção do site](../UNO_Labs_Construcao_do_Site.md), `src/styles/site.css`, `BaseLayout.astro`, `Header.astro` e os dois artefatos confirma o uso dos tokens existentes: Inter herdada no corpo, títulos em peso 600, verde pinho (`--uno-pine`), branco esverdeado (`--uno-off-white`) e texto secundário (`--uno-ink-2`). O cabeçalho usa o SVG horizontal da UNO, com menta na marca. O índice reutiliza o contêiner de 1240 px, foco visível e raio pequeno de 12 px; não declara uma família tipográfica ou paleta nova. As capturas iniciais de desktop e celular também foram conferidas nesta documentação.

As 12 capas, incluindo as seis versões menores, tiveram seus SHA-256 comparados novamente com [o manifesto da importação](importacao-assets-pr7.json): todos coincidem. Os arquivos `*-origem.json`, [fontes das imagens](fontes-imagens-pr7.json) e [registro da importação](importacao-pr7.md) mantêm a proveniência anterior; esta remodelação não criou ou transformou imagens. A conferência de hashes comprova a integridade dos arquivos importados.

A autoridade visual continua nos documentos vigentes e no CSS do site. `PRODUCT.md` e `DESIGN.md` já estavam ausentes antes deste pedido; este registro local não cria um sistema global nem transforma decisões de composição do índice em regras para todo o site.

## Referências e verificação

[Shopify Brasil](https://www.shopify.com/br/blog) e [HubSpot Marketing](https://blog.hubspot.com/marketing), consultados pela tarefa principal em 02/10/2026, foram referências da proposta inicial. A organização final em grade e filtros segue a correção explícita do usuário. Não há medição que atribua aumento de conversão a este layout.

Verificação da versão com grade e filtros: `npm run build` sem erros; `node tests/blog-index-browser.cjs` com 54 verificações aprovadas nas larguras 320, 390, 768, 1265 e 1440 px. Cobertura: seis capas/artigos, colunas e ordem, títulos completos, ausência de transbordamento, três filtros e Todos, foco e estado selecionado, anúncio de quantidade, abertura pelo teclado e conteúdo sem JavaScript. Nenhum erro de execução ou recurso; detector de layout sem achados. As 29 verificações unitárias e 22 editoriais da composição anterior permanecem como histórico, sem serem apresentadas como repetidas nesta correção.

Capturas atuais em `.impeccable/review/blog-grid/`: `grid-1440.png`, `grid-390.png` e `grid-filtered.png`. A revisão independente do código e dessas três capturas concluiu pronto para entrega, sem defeitos concretos: grade uniforme, títulos completos e filtros sem divisões temáticas. Isso não equivale a uma auditoria global, aprovação editorial, integração na `main` ou publicação.

Se a UI mudar após esta revisão, reconferir o recorte das capas, os títulos, os seis destinos, os filtros e Todos, o foco, o comportamento sem JavaScript e as capturas nas mesmas larguras antes de reutilizar este resultado.
