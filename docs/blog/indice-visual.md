# Índice visual do blog — 02/10/2026

Registro da remodelação de `/blog/` em `src/pages/blog/index.astro` e `src/components/blog/BlogCard.astro`, após a rejeição da lista sem fotografias. A intervenção se limita ao índice; conteúdo dos artigos e home principal ficam fora deste escopo. O [contrato da superfície](../../.impeccable/surfaces/src-pages-blog-index-astro.md) registra a direção.

## Composição implementada

O título recuperado é “Um site melhor começa com a pergunta certa.”. O diagnóstico “Seu site recebe visitas, mas não gera contatos? Veja o que investigar” abre a seleção com fotografia grande e texto ao lado no desktop; até 800 px, fotografia e texto ficam empilhados. Os três assuntos usam âncoras nativas: Estratégia e conversão, Design e experiência, Contato e mensuração. Os seis artigos se distribuem em um destaque, três leituras de experiência e duas de contato. As grades passam a duas colunas até 1000 px e a uma até 600 px.

Cada artigo apresenta capa, título, resumo, assunto e condição editorial. O componente reutiliza as versões existentes das capas em `srcset`, prioriza a fotografia do destaque e adia as demais. A navegação pelos assuntos e a abertura dos artigos não exigem JavaScript adicional; permanece a entrada compartilhada das páginas internas para menu e ano. A prévia continua com `noindex, nofollow` e com “Em revisão editorial”; esta composição não aprova nem publica os textos.

## Continuidade da identidade e das imagens

A comparação entre o §4 de [Construção do site](../UNO_Labs_Construcao_do_Site.md), `src/styles/site.css`, `BaseLayout.astro`, `Header.astro` e os dois artefatos confirma o uso dos tokens existentes: Inter herdada no corpo, títulos em peso 600, verde pinho (`--uno-pine`), branco esverdeado (`--uno-off-white`) e texto secundário (`--uno-ink-2`). O cabeçalho usa o SVG horizontal da UNO, com menta na marca. O índice reutiliza o contêiner de 1240 px, foco visível e raio pequeno de 12 px; não declara uma família tipográfica ou paleta nova. As capturas iniciais de desktop e celular também foram conferidas nesta documentação.

As 12 capas, incluindo as seis versões menores, tiveram seus SHA-256 comparados novamente com [o manifesto da importação](importacao-assets-pr7.json): todos coincidem. Os arquivos `*-origem.json`, [fontes das imagens](fontes-imagens-pr7.json) e [registro da importação](importacao-pr7.md) mantêm a proveniência anterior; esta remodelação não criou ou transformou imagens. A conferência de hashes comprova a integridade dos arquivos importados.

A autoridade visual continua nos documentos vigentes e no CSS do site. `PRODUCT.md` e `DESIGN.md` já estavam ausentes antes deste pedido; este registro local não cria um sistema global nem transforma decisões de composição do índice em regras para todo o site.

## Referências e verificação

[Shopify Brasil](https://www.shopify.com/br/blog) e [HubSpot Marketing](https://blog.hubspot.com/marketing), consultados pela tarefa principal em 02/10/2026, orientaram navegação por assuntos e hierarquia do destaque. Não há medição que atribua aumento de conversão a este layout.

Resultados informados pela tarefa principal: build sem erros, 29 testes unitários e 22 verificações editoriais de build aprovados. O registro local do navegador (`.impeccable/review/checks.json`, ignorado pelo Git), lido nesta documentação, contém 23 verificações aprovadas nas larguras 320, 390, 768, 1265 e 1440 px: seis capas/artigos, três assuntos, títulos sem recorte, ausência de transbordamento, links únicos, posição das âncoras, teclado e conteúdo sem JavaScript; a lista de erros está vazia. Esses comandos não foram repetidos pelo documentador.

Capturas em `.impeccable/review/`: `desktop.png`, `mobile.png`, `user-1265.png` e as respectivas versões `-first.png`. A revisão visual independente abriu as seis capturas e concluiu `ship` (pronto para entrega), sem correções materiais, no escopo do índice. Confirmou fotografia em destaque, assuntos e continuidade de Inter/pinho/branco esverdeado. Isso não equivale a uma auditoria global, aprovação editorial, integração na `main` ou publicação.

Se a UI mudar após esta revisão, reconferir a proporção e o recorte das capas, as quebras dos títulos, os seis destinos, as âncoras abaixo do cabeçalho, o foco, o comportamento sem JavaScript e as capturas nas mesmas larguras antes de reutilizar este resultado.
