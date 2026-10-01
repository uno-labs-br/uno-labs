# Avaliação A independente — UNO Labs

Somente leitura. Nenhum detector executado e nenhuma avaliação anterior consultada. Alvo: `D:/00 - PROJETOS/01 - UNO LABS - LP/04 - SITE/public/index.html`, servido por `http://127.0.0.1:8787`, com `public/` oficial e Worker.

## Notas

- **Qualidade visual: 8/10.** Pine/Mint, Inter, proporções e espaçamento formam um sistema coerente. Os três estudos têm direções próprias e a página demonstra acabamento. A exploração ampliada corta a composição no celular e exige uma navegação lateral pouco evidente.
- **Fidelidade e eficácia da mensagem: 7,5/10.** A headline, oferta, preço inicial, parcelamento, equipe e contatos respeitam o briefing. As limitações dos estudos, SEO e integração são explicadas sem resultados inventados. A eficácia permanece limitada pelo escopo comercial inicial indefinido, ausência de comprovação de clientes e pelo bloco de conteúdo indisponível.

São julgamentos de um avaliador, sem teste com clientes ou medição de conversão. Não avaliam homologação do recebimento real.

## Especificidade

A página tem identidade própria em cor, ritmo, grade técnica, narrativa da busca ao contato e contraste entre as três direções de projeto. A composição inicial de título grande, CTA arredondado e dispositivo demonstrativo ainda pertence ao repertório comum de agências. O que a diferencia é a explicação das decisões, não uma promessa genérica de crescimento.

## Pontos fortes

1. **Oferta reconhecível cedo:** a primeira tela apresenta site/SEO/anúncios, benefício, CTA e preço. O CTA tem bom peso e o link para os estudos oferece uma segunda rota coerente.
2. **Prova visual honesta:** Módulo, Atria e Casa Noma têm contraste de linguagem, objetivo e decisão explicitados. Os rótulos conceituais e a explicação sobre controles ilustrativos evitam confundir demonstração com cliente real.
3. **Adaptação e recuperação úteis:** quatro etapas cabem inteiras no sticky de desktop e 390×844; 320×568, 844×390 e movimento reduzido usam texto linear. A validação aponta campos, move o foco e preserva dados; uma falha 503 simulada oferece canais alternativos.

## Heurísticas de Nielsen — modo Persuade

| Heurística | Nota | Evidência / limite |
|---|---:|---|
| 1. Visibilidade do estado | 3 | Etapa atual, envio e falhas recebem feedback; localização na navegação longa depende do visitante. |
| 2. Relação com o mundo real | 3 | Benefícios e processo são claros; SEO, arquitetura de conteúdo e integrações ainda exigem alguma familiaridade. |
| 3. Controle e liberdade | 4 | Contato alternativo, navegação direta, fechamento por Escape e retorno de foco funcionaram; não há percurso obrigatório. |
| 4. Consistência e padrões | 3 | Tipografia, cores e componentes coerentes; visualizador mantém a estrutura da maquete em largura fixa no celular. |
| 5. Prevenção de erros | 3 | Rótulos, limites, validação e botão ocupado evitam erros comuns; opções não obrigatórias não estão todas identificadas assim. |
| 6. Reconhecimento em vez de memória | 3 | Serviços, fases e entregas ficam nomeados; a necessidade de pan lateral no estudo ampliado não recebe orientação visual. |
| 7. Flexibilidade e eficiência | n/a | Persuade; atalhos de operação avançada não são necessários para decidir e entrar em contato. |
| 8. Estética e minimalismo | 3 | Hierarquia limpa; blog indisponível ocupa espaço relevante na jornada. |
| 9. Recuperação de erros | 4 | Erros específicos perto dos campos; dados preservados, reenvio e WhatsApp/e-mail disponíveis na falha simulada. |
| 10. Ajuda e documentação | n/a | Persuade; não há tarefa complexa que exija documentação. A FAQ oferece apoio à decisão. |
| **Total** | **26/32** | **81,25% — boa base.** |

## Problemas prioritários

1. **[P1] O estudo ampliado perde leitura no celular.** Em 390×844, o canvas móvel tem 390px dentro de uma área de 318px; em 320×568, dentro de 248px. A composição abre alinhada à esquerda, com botão da maquete cortado e partes da headline fora da janela. Em landscape, o desktop de 1280px aparece em 770px de área. Há pan possível, mas não há pista visual de como ver o conjunto. Isso enfraquece a principal prova do cuidado com celular. **Correção:** oferecer visualização completa adequada à largura disponível por padrão, com ampliação/pan opcionais e instrução visível. Preservar os três estudos e o aviso conceitual. Comandos: adapt / harden.

2. **[P2] Blog cria um desvio sem conteúdo disponível.** É um dos cinco itens principais do menu e apresenta três blocos de artigo, embora todos estejam em breve. A honestidade evita uma falsa promessa de interação, mas o visitante termina o salto sem material para decidir. **Correção:** enquanto não houver artigo, reduzir o peso do bloco e retirar sua posição de navegação principal, ou publicar ao menos o primeiro conteúdo aprovado. Comando: distill.

3. **[P2] Falta uma saída imediata do pico visual para o contato no celular.** Após os três estudos, vem a seção de processo; o CTA de proposta fica depois dela. No desktop, o CTA do cabeçalho segue disponível. No celular, cabeçalho só apresenta o menu, então a pessoa convencida pelos estudos precisa abrir o menu ou continuar a sequência até investimento. **Correção:** colocar uma ação de contato ao final dos estudos, sem introduzir mais um elemento fixo. Comandos: clarify / layout.

## Carga cognitiva e percurso emocional

O hero tem uma ação primária e uma secundária. A jornada apresenta quatro escolhas, no limite adequado. O menu tem cinco links mais CTA, a lista de serviços tem cinco itens e o formulário tem cinco serviços selecionáveis: passam de quatro, mas agrupamento e rótulos tornam a carga administrável. A FAQ contém nove perguntas, com divulgação progressiva.

A pressão maior é cumulativa: cerca de 20.667px de página em 390×844, com serviços, estudos, processo e investimento extensos. Os atalhos impedem que isso seja um fluxo obrigatório. A curva emocional começa com segurança visual, sobe com os estudos, fica mais racional em processo/investimento e cai no blog sem artigos. O contato termina com canais reais e recuperação clara. O preço inicial ancora a expectativa, mas ainda não permite saber qual escopo mínimo corresponde a R$1.490; essa definição deve vir dos responsáveis, sem criar um pacote fictício.

## Personas

- **Jordan:** entende o benefício e o próximo passo; pode interpretar R$1.490 como um pacote mais completo do que o escopo ainda indefinido. O link Blog leva a temas previstos, não a respostas. Melhorar a sinalização do conteúdo disponível e definir o exemplo de escopo quando houver decisão comercial.
- **Casey:** CTA e WhatsApp têm bom tamanho, e a jornada linear evita aprisionamento em telas baixas. O modal móvel exige pan e rolagem interna; depois dos estudos, o contato fica um salto de menu ou uma continuação longa. O campo de retorno aceita WhatsApp, mas usa teclado/autocomplete de e-mail: fricção secundária.
- **Sam:** rótulos, fieldset, foco visível, estado de erro e Escape/retorno de foco favorecem teclado. Movimento reduzido expõe as quatro explicações. Não foi executado NVDA/VoiceOver; não há declaração de conformidade WCAG. Na leitura ampliada há dois níveis de rolagem, que merecem teste com tecnologia assistiva.

## Limites e evidências

- Chromium/Playwright, páginas novas próprias, desktop1440×900, mobile390×844, small320×568, landscape844×390 e teste adicional de movimento reduzido.
- Nenhum overflow horizontal do documento nas quatro telas; nenhum erro JavaScript capturado.
- Fases desktop 0–3: textos terminaram até y807, dentro dos 900px. Fases mobile terminaram em y810, dentro dos 844px. Linear exibiu quatro textos com aria-hidden=false.
- Modal: abertura, Escape e retorno ao botão Explorar estudo confirmados. Capturas principais: `desktop-modal.png`, `mobile-modal.png`, `small-modal.png`, `landscape-modal.png`.
- Formulário: erro vazio e 503 simulados por interceptação local. Nenhum pedido real enviado e nenhuma mensagem enviada a terceiros. `interactions.json` contém as dimensões e os estados.
- Integração Worker→n8n→SMTP e caixa postal não homologadas; política ainda é rascunho. São bloqueios de publicação conhecidos, não defeitos novos deste trabalho visual.
- Capturas de seção são a evidência visual de leitura. Full page não deve ser usado para julgar quadros vazios de animações acionadas por visibilidade.
- Referências técnicas consultadas: [W3C — foco visível](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) e [W3C — reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html). A crítica ao pan da maquete é de usabilidade; não foi classificada automaticamente como violação de reflow, que possui exceção para conteúdo que necessita layout bidimensional.

Sem perguntas: o briefing contém informação suficiente para esta avaliação A; o escopo comercial inicial já foi informado como pendência.
