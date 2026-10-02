---
version: 1
slug: "src-pages-blog-index-astro"
primary_target: "src/pages/blog/index.astro"
related_targets: ["src/components/blog/BlogCard.astro"]
---

## Direction contract

THESIS: Um índice editorial com fotografias em grade uniforme de duas colunas. Todos os artigos aparecem juntos; categorias só filtram a lista quando escolhidas. A opção Todos restaura a lista completa.

OWN-WORLD: Identidade UNO Labs existente: Inter, verde pinho, menta, branco esverdeado, contêiner de 1240 px e links/botões conhecidos. Fotografias existentes são o conteúdo visual, sem novos ativos, sombras decorativas ou tipografia adicional.

STORY: O leitor percorre os seis artigos na ordem editorial, cada um com foto, título, resumo e condição editorial honesta. Pode limitar a seleção por categoria e retornar a Todos. Não há destaque isolado, cabeçalhos temáticos ou reagrupamento. Artigos e home principal permanecem intactos.

FIRST VIEWPORT: Cabeçalho compartilhado, botão explícito Voltar ao site acima do título à esquerda e introdução curta à direita. Filtros Todos e três categorias abaixo, seguidos pela primeira dupla de capas. Uma coluna até 600 px; títulos completos, sem recorte. O estado selecionado usa sublinhado e aria-pressed; filtros preservam o foco e anunciam a contagem.

FORM: Grade de dois em dois explicitamente solicitada pelo usuário em correção à composição anterior. Código direto, sem sorteio; fotografias e marca preservadas. Sem JavaScript, todos os artigos continuam visíveis e os filtros ficam ocultos. Seed: não se aplica.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Referências consultadas em 02/10/2026: https://www.shopify.com/br/blog e https://blog.hubspot.com/marketing. São referências de composição; não foram atribuídos resultados de conversão ao layout.
