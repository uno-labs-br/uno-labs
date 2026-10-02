# Blog, busca demonstrativa e ritmo dos estudos — 02/10/2026

Escopo solicitado: abrir o índice do Blog pelo menu, incluir as páginas existentes, reduzir a espera nos estudos conceituais e simular digitação/Enter no cartão de busca do hero. Trabalho iniciado na main `8e4bf2b` (migração integrada por Bruno), na branch `codex/blog-busca-animacoes`. Entrega por branch e PR, sem merge nem publicação em produção nesta tarefa.

## Resultado

- `/blog/` lista os seis artigos reais importados do PR #7. Textos, fontes, créditos e imagens foram preservados; origem e hashes em [importação do blog](../blog/importacao-pr7.md).
- Os textos continuam em revisão: `draft: true`, `preview: true`, sem autoria/data presumidas. Rotas de revisão existem só no build de prévia e nunca entram no sitemap. Artigos publicáveis continuam exigindo autoria válida e data não futura.
- Os seis estudos desktop/celular passam de 4 s para aproximadamente 2,2 s. Casa Noma apresenta a reserva até 0,9 s; Atria apresenta a agenda até 1 s. O layout final permanece visível e o replay existente continua disponível.
- O hero revela a maquete em 1,6 s. A busca desktop começa vazia, digita a frase, sinaliza Enter e revela o resultado; não realiza pesquisas reais. Pausa fora da tela/aba oculta e apresenta o estado final com movimento reduzido.
- Cabeçalho, rodapé e artigos apontam para o índice. O menu das páginas internas conserva as âncoras da home e o comportamento de teclado/celular.

## Verificações

| Verificação | Resultado |
|---|---|
| `npm run build` | 10 páginas estáticas; verificação de tipos sem erros |
| `node --test tests/editorial.test.mjs` | 26 testes; inclui preservação do texto e hashes das 12 imagens |
| `node --test tests/editorial-build.test.mjs` | 22 testes em cópia isolada; prévia/produção, metadados, filtros e seis imports |
| `tests/build.test.mjs` e `tests/contato.test.mjs` | 3 verificações de distribuição + 9 testes do contrato de contato; nenhuma mensagem externa |
| `node tests/blog-motion-browser.cjs` | 45 verificações: digitação/Enter/resultado, pausa, reduced motion, duração das seis maquetes, rotas/imagens/links, menu, demo editorial e acesso sem JS |
| `node tests/migracao-browser.cjs` | 40 verificações sem falhas; contratos não alterados pela solicitação preservados |
| Inspeção visual | Duas rodadas, 1440×900 e 390×844; corrigido o fallback indevido do menu interno |
| `git diff --check` | Sem erros |

O build emite o hint já existente do fallback `MediaQueryList.addListener` e avisos do bundler sobre a diretiva interna MDX `use astro:head-inject`. HTML, CSS e script específico da demonstração foram verificados no navegador; as rotas não recebem o JavaScript da home. Não foi necessário alterar versões ou configuração do bundler.

Uma passagem do detector Impeccable encontrou três transições de dimensões já existentes na jornada (`site.css`) e avisos sobre os fundos em grade já adotados pelo projeto. Esses trechos não foram alterados: o pedido restringe a intervenção ao Blog, à busca e ao ritmo dos estudos.

A prévia local usa `npm run preview -- --host 127.0.0.1 --port 4321`, servindo `04 - SITE/dist`. Artefatos locais de QA estão em `.qa/blog-motion/` e `.qa/migracao/`, ignorados pelo Git. O servidor de prévia não inicia o Worker de contato.
