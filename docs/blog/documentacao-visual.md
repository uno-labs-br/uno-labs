# Documentação visual do blog

Esta ficha registra os componentes próprios da extensão editorial no PR #7, ainda em rascunho, na branch `codex/blog-diagnostico-conversao`, baseada na versão HTML de `origin/main` (`7d243eb`). Nela, `public/index.html` e os estilos globais são referências históricas. A implementação oficial está em `codex/migracao-astro7-ts`, cuja fonte é `src/pages/index.astro`; a reconciliação do blog com MDX e as rotas Astro continua pendente.

## Identidade e expressão editorial

- A paleta local Pine (`#0E2B24`), Mint (`#7DD3A8`) e Off White (`#F3F7F3`), junto aos tons de apoio, coincide com os tokens `--uno-*` da implementação principal.
- O SVG da marca e o arquivo WOFF2 Inter do blog correspondem aos ativos usados pela página principal. O CSS editorial mantém Inter como família de texto.
- A leitura usa corpo de `clamp(18px, 1.15vw, 19px)` e entrelinha 1,7. Os títulos do hub e dos artigos têm escala fluida; as capturas registram H1 de 60/34 px no hub e 54/32 px no artigo, em 1440/390 px.
- O hub reúne introdução, artigo em destaque com imagem e lista editorial. Cada artigo combina breadcrumb, metadados, resposta direta, capa, índice, texto em coluna, tabelas, FAQ nativo, referências, CTA, artigos relacionados e rodapé. O FAQ usa `details`/`summary`; tabelas mantêm rolagem horizontal no celular.

## Capas: histórico e estado atual

- **Primeira versão, rejeitada:** seis capas conceituais geradas para a proposta inicial. Não fazem parte da interface atual; os prompts antigos permanecem apenas como registro histórico.
- **Estado atual:** seis fotografias de arquivo licenciadas, com créditos visíveis nos artigos. `docs/blog/fontes-imagens.json` registra autores, origens, licenças, textos alternativos e legendas. São fotografias de Carlos Muza (CC0 1.0) e Igor Miske, Francisca Silva, Alicia Christin Gerald, Benjamin Dada e Mourizal Zativa (Unsplash).
- Os arquivos usam proporção 3:2 em WebP de 1536×1024 e 768×512. O registro especifica recorte central, sem geração, retoque ou substituição de tela. As cores naturais são preservadas; imagens de arquivo não representam clientes, projetos ou resultados da UNO Labs.

## Demonstração de movimento

A comparação didática do guia de animações usa HTML, CSS e Web Animations API, sem biblioteca. Cada execução dura 6 segundos: a transição direta se move por 350 ms e a sequência inclui uma etapa intermediária, chegando ao contato em 4,7 s. Os tempos explicam o exemplo e não são dados de conversão.

No desktop, as duas versões ficam lado a lado e a reprodução começa quando pelo menos 75% do conjunto de painéis está visível. No celular, até 700 px, rádios nativos permitem escolher uma versão; apenas um palco aparece, com os controles logo abaixo, e a reprodução depende de ação manual. A animação pausa quando sai da área visível ou quando a aba fica oculta. Com movimento reduzido, o estado final aparece sem deslocamento. Sem JavaScript, o texto e os dois exemplos continuam disponíveis como conteúdo estático, acompanhados da explicação em `noscript`.

## Evidências e limites

A revisão local de 02/10/2026 registrou 25 verificações aprovadas em `05 - BLOG/_producao/revisao-fotografias/qa.json`. As capturas `demo-mobile-curta-corrigida.png` e `demo-mobile-longa-corrigida.png`, feitas em 390×844, mostram o palco e os controles. O revisor independente confirmou a correção do achado P2 no celular e do gatilho de 75% no desktop, sem regressão material ligada a esses ajustes. Essa aprovação se limita ao achado revisado; não equivale a uma auditoria integral de acessibilidade.

A entrega desta branch ainda parte do HTML histórico. A fonte do blog deve ser reconciliada com o contrato MDX e as rotas Astro antes da integração; esta ficha não afirma que o blog já esteja integrado à implementação oficial. Edição dos artigos, autoria responsável e publicação continuam sujeitas à decisão humana, conforme `PRODUCT.md`.

## Diferenças locais observadas

Sem alterar o sistema global: `blog.css` define raios de 8/16/24 px, enquanto `site.css` usa 12/18/26 px; a borda local usa `rgba(16, 32, 28, 0.12)` contra `0.13` global; a sombra aplicada localmente é `0 16px 40px rgba(14, 43, 36, 0.06)`, ante `0 28px 80px rgba(18, 54, 45, 0.12)` global. São diferenças presentes no CSS editorial e não devem ser tomadas como novos tokens da identidade.
