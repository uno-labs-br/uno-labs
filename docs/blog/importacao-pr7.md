# Importação dos seis artigos para revisão

Origem imutável: PR #7 de `uno-labs-br/uno-labs`, commit `a5e80ab356217c55a8f3557be875fab0c1ec8fe1`. A branch e os arquivos do PR original não foram alterados.

Os seis artigos de `docs/blog/articles.json` foram portados para `src/content/blog/*.mdx`. Os parágrafos, títulos, tabelas, perguntas frequentes, fontes e chamadas foram preservados. Os links relativos aos artigos HTML foram convertidos para as rotas Astro `/blog/<slug>/`; os contatos levam a `/#contato`. `articles-pr7.json` mantém os dados originais para conferir a importação.

Cada artigo usa `draft: true` e `preview: true`. A flag `preview` autoriza somente a rota de revisão em builds `UNO_DEPLOY_TARGET=preview`; rascunhos sem a flag permanecem privados. Builds de produção excluem todos os rascunhos, inclusive os seis importados. O sitemap usa exclusivamente artigos publicados. O aviso “Em revisão editorial” aparece nas listagens e no cabeçalho dos artigos. Autoria, data de publicação e `BlogPosting` são omitidos durante a revisão; nenhuma autoria individual nem data de publicação foi deduzida da data de modificação da fonte.

As capas 1536×1024 e 768×512 foram copiadas byte a byte do mesmo commit para `public/assets/img/blog/<slug>/`. `importacao-assets-pr7.json` registra caminho original, destino, tamanho e SHA-256. `fontes-imagens-pr7.json` e os arquivos `*-origem.json` preservam a proveniência e os créditos fornecidos pelo PR. Os créditos e links de licença permanecem visíveis nas páginas. A importação não gera nem modifica imagens.

A comparação animada do artigo de rolagem foi portada para `MotionDemo.astro` e `motion-demo.ts`, carregados somente naquele artigo. Os tempos didáticos originais foram preservados. A reprodução pausa fora da área visível ou com a aba oculta, e a preferência por movimento reduzido mostra o estado final. Sem JavaScript, os estados finais e a explicação continuam disponíveis. O HTML/CSS global legado, fontes e configurações da branch original não foram importados.

Esta operação preserva conteúdo existente e permite a revisão local. Ela não conclui revisão editorial, aprovação de autoria/data, publicação, merge nem deploy.

Verificação técnica da importação: `npm run check` concluiu com zero erros; `node --test tests/editorial.test.mjs` passou 26/26, incluindo comparação literal dos parágrafos/seções e hashes das 12 capas; `node --test tests/editorial-build.test.mjs` passou 22/22, cobrindo conteúdo vazio, publicados, revisões explícitas, rascunhos privados, datas futuras e builds isolados de prévia/produção. A revisão visual e os testes de navegação/movimento do site completo são verificados na tarefa principal.

Referências técnicas oficiais: [MDX e componentes Astro](https://docs.astro.build/en/guides/integrations-guide/mdx/), [Content Collections](https://docs.astro.build/en/guides/content-collections/).
