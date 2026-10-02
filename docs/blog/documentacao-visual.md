# Documentação visual do blog

`public/blog/` é uma extensão editorial em modo leitura. A referência visual continua sendo `public/index.html` com `public/assets/css/site.css` e `public/assets/css/fonts.css`; esta ficha registra somente os componentes próprios do blog.

## Identidade e expressão editorial

- A paleta local Pine (`#0E2B24`), Mint (`#7DD3A8`) e Off White (`#F3F7F3`), junto aos tons de apoio, coincide com os tokens `--uno-*` da implementação principal.
- O SVG da marca e o arquivo WOFF2 Inter do blog são idênticos aos ativos usados pela página principal. O CSS editorial mantém Inter como família de texto.
- A leitura usa corpo de `clamp(18px, 1.15vw, 19px)` e entrelinha 1,7. Títulos próprios do hub e dos artigos têm escala fluida; as capturas registram H1 de 60/34 px no hub e 54/32 px no artigo, em 1440/390 px.

## Componentes locais

- Hub: cabeçalho aderente ao topo, com marca e navegação, introdução, artigo em destaque com imagem e lista editorial de artigos.
- Artigo: breadcrumb, metadados, resumo com resposta direta, capa, índice, texto em coluna de leitura, tabelas, FAQ nativo, referências, CTA, artigos relacionados e rodapé.
- Ações usam botões em formato pílula; o destaque usa imagens WebP. Tabelas mantêm região focável e rolagem horizontal no celular, com dica associada. O FAQ usa `details`/`summary`.

## Evidências e limites

Capturas finais do hub e de dois artigos cobrem 390 e 1440 px. `05 - BLOG/_producao/revisao/correcoes/confirmacao.json` registra, nesses dois viewports, os estados revisados de tabela, FAQ aberto, foco visível do CTA e movimento reduzido. A revisão independente aprovou os quatro ajustes sem regressão nos estados examinados. Isso não constitui aprovação total de acessibilidade.

A documentação descreve o artefato; edição humana dos artigos, autoria responsável e publicação ainda dependem de decisão humana, conforme `PRODUCT.md`.

## Diferenças locais observadas

Sem alterar o sistema global: `blog.css` define raios de 8/16/24 px, enquanto `site.css` usa 12/18/26 px; a borda local usa `rgba(16, 32, 28, 0.12)` contra `0.13` global; a sombra aplicada localmente é `0 16px 40px rgba(14, 43, 36, 0.06)`, ante `0 28px 80px rgba(18, 54, 45, 0.12)` global. São diferenças presentes no CSS editorial e não devem ser tomadas como novos tokens da identidade.
