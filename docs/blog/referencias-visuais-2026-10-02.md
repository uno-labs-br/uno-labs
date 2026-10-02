# Revisão das imagens e referência internacional
Data da pesquisa: 02/10/2026. Pedido: substituir as imagens com aparência de IA e incluir animação de fato no guia sobre movimento.

## O que mudou
As seis capas passaram a usar fotografias publicadas por fotógrafos, com fonte e licença verificadas nas páginas dos acervos. Nenhuma das capas atuais foi gerada por IA. Os créditos aparecem em cada artigo; origens, URLs de download e transformações estão em fontes-imagens.json. As fotos de arquivo não retratam projetos ou resultados da UNO Labs. Os prompts antigos permanecem como registro histórico da versão rejeitada.

A comparação animada é implementação própria, feita com HTML/CSS/JavaScript. Há movimento real entre estados, pausa, continuação, repetição, progresso e alternativa para movimento reduzido. A animação não prende a rolagem da página. Os controles operam a demonstração, sem envio de contato.

## Referências externas consultadas
| Referência | Evidência observada | Aplicação nesta revisão |
| --- | --- | --- |
| [Nielsen Norman Group — papel da animação em UX](https://www.nngroup.com/articles/animation-purpose-ux/) | O artigo combina explicação com vídeos de interfaces e discute movimento como feedback e continuidade. | Trocar a metáfora estática por comparação que o leitor pode reproduzir e observar. Sem copiar vídeos ou interfaces de terceiros. |
| [Ahrefs — campanha de SEO](https://ahrefs.com/blog/seo-campaign/) | Uso de capturas reais, passos concretos e exemplos para fundamentar o texto. O relato documenta a conquista da primeira posição para “blogging tips” nos EUA na campanha descrita. | Priorizar imagens compreensíveis e demonstração útil, com clareza sobre o que é exemplo e o que é evidência. |
| [Contentsquare / antigo Hotjar — UX e conversões](https://contentsquare.com/blog/ux-for-conversions/) | Conteúdo associa comportamento do usuário a exemplos visuais e decisões de interface. O endereço original do Hotjar redireciona para este artigo. | Relacionar a imagem ao uso de computador, celular, formulário e contato; manter a investigação em vez de atribuir conversão à estética. |

A pesquisa encontrou esses domínios em consultas abertas sobre UX, animação e conversão. O caso de SEO da Ahrefs é um relato da própria empresa, situado no período do artigo. Não mede posição atual de todos os seus artigos nem prova a contribuição de uma imagem para o resultado. Não foi feita auditoria independente de tráfego orgânico ou de posições por país/dispositivo. Nielsen Norman Group e Contentsquare são referências editoriais e de UX aqui, sem posição numérica atribuída.

## Fontes e licenças das fotografias
- Carlos Muza: [registro no Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Statistics_on_a_laptop_(Unsplash).jpg), com dedicação CC0 documentada para a fotografia de arquivo.
- Igor Miske, Francisca Silva, Alicia Christin Gerald, Benjamin Dada e Mourizal Zativa: páginas individuais do Unsplash e [licença do acervo](https://unsplash.com/license), vinculadas em fontes-imagens.json.
- Os acervos permitem os usos previstos pelas respectivas licenças. Não apresentar os fotógrafos ou pessoas retratadas como integrantes, clientes ou apoiadores da UNO Labs.
- Recorte central para a proporção editorial e conversão WebP. Não houve retoque generativo, troca de tela ou remoção de autoria.

## Limite de integração com a migração Astro
O PR #7 continua em rascunho na branch codex/blog-diagnostico-conversao, cuja base ainda é a versão HTML da main. Em 02/10/2026, o checkout oficial estava em codex/migracao-astro7-ts, enquanto origin/main ainda apontava para 7d243eb. A migração não foi incorporada silenciosamente neste PR.

Esta revisão altera os ativos e a demonstração da coleção existente e a entrega local em 05 - BLOG. Não altera o checkout oficial nem declara que o blog já está integrado ao Astro. Antes de integrar o PR, portar sua fonte editorial ao contrato MDX vigente, reconciliar o gerador/rotas, confirmar autoria e datas reais e validar o build Astro. O componente de demonstração não tem dependência de framework; sua lógica e suas fotografias podem ser aproveitadas nessa adaptação. Não publicar HTML concorrente em public/ junto às rotas Astro.
