# Crítica combinada: UNO Labs adapt

Método: duas avaliações independentes (A: `/root/critica_visual`; B: `/root/critica_evidencias`). Alvo: `04 - SITE/public/index.html`. A revisou design e percurso sem detector; B conferiu detector, navegador e contrato. Nenhum recebeu notas anteriores ou meta numérica. A terminou antes da síntese receber o detector.

## Resultado

| Avaliação | Visual | Mensagem | Heurísticas |
|---|---:|---:|---:|
| A | 8/10 | 7,5/10 | 26/32, 81,25% |
| B | 8,2/10 | 7,6/10 | 28/36, 77,8% |

As notas são julgamentos, sem teste com clientes ou conversão medida. Os conjuntos de heurísticas diferem; não há média entre denominadores. O objetivo de 9/10 não foi alcançado. Não houve P0 reproduzido no percurso local.

## Especificidade e pontos fortes

A identidade Pine/Mint e Inter, a grade técnica, os três estudos com linguagens diferentes e Encontra → Entende → Confia → Chama formam uma apresentação coerente. A estrutura geral é comum ao setor; a explicação das decisões dos estudos dá a maior diferenciação. Não há evidência para substituir a marca por causa de alertas genéricos do detector.

- A primeira tela comunica serviço, benefício, preço e ação com boa hierarquia.
- Estudos distinguem capacidade visual de clientes e resultados reais, com decisões explícitas e controles ilustrativos.
- Jornada usa três alturas quando cabe e quatro explicações lineares em telas baixas; o formulário preserva dados, indica campos e oferece recuperação.

## Heurísticas de Nielsen

| Heurística | A /4 | B /4 | Síntese |
|---|---:|---:|---|
| Visibilidade do estado | 3 | 3 | Etapa, carregamento, erros e encaminhamento têm feedback |
| Relação com o mundo real | 3 | 3 | Benefícios claros; termos técnicos ainda exigem tradução |
| Controle e liberdade | 4 | 3 | Escape, retorno de foco e canais funcionam; viewer exige dois eixos |
| Consistência e padrões | 3 | 4 | Marca e ações coerentes; leitura ampliada móvel tem fricção |
| Prevenção de erro | 3 | 3 | Validação e bloqueio concorrente; sem exatamente uma vez no SMTP |
| Reconhecimento | 3 | 3 | Etapas e ações nomeadas; escopo inicial ainda exige conversa |
| Flexibilidade e eficiência | n/a | n/a | Página de persuasão, sem necessidade de operação avançada |
| Estética e minimalismo | 3 | 3 | Hierarquia limpa, extensão e blog previsto elevam esforço |
| Recuperação de erros | 4 | 3 | Campos preservados; falha do arquivo JS tem recuperação parcial |
| Ajuda e documentação | n/a | 3 | FAQ útil; artigos indisponíveis e política em rascunho |
| **Total** | **26/32** | **28/36** | Denominadores diferentes |

## Problemas prioritários

1. **[P1] Visualizador exige pan lateral no celular.** Ambos reproduziram maquete de 390px em área de 318px; A encontrou área de 248px em 320×568. A composição perde a visão de conjunto e exige um gesto pouco evidente. **Correção proposta:** abrir ajustado à largura, oferecendo tamanho original/ampliação para detalhes e instrução visível. Preservar maquetes e controles ilustrativos. Comando: Impeccable adapt. [Evidência](critica-a-mobile-modal.png).
2. **[P1] Contato real e política ainda impedem declarar publicação pronta.** Backend sem credenciais responde 503; modelo SMTP inativo e política contém dados/operadores pendentes. **Correção proposta:** configurar homologação, pedir autorização para mensagem fictícia e registrar backend, SMTP e caixa separadamente; responsáveis completam política e dados empresariais. Não apagar obrigações para melhorar aparência. Comandos: harden/clarify após definição operacional.
3. **[P2] Preço inicial não tem entrega inicial definida.** A ancoragem em R$1.490 é clara, mas não permite saber o escopo mínimo. **Correção proposta:** Urias/Bruno definirem pacote ou exemplo de escopo vendável e suas exclusões, sem inventar quantidade, prazo ou condições. Comando: clarify.
4. **[P2] Falha isolada do arquivo JS tem recuperação parcial.** B bloqueou `site.js`: script inline deixou `.js`, menu móvel sem comportamento e campos preenchíveis com botão desabilitado; aviso pede ativar JS apesar de ele estar ativo. Canais diretos continuam disponíveis. **Correção proposta:** ativar a melhoria progressiva após inicialização concluída, com navegação estática e campos indisponíveis ocultos até prontidão. Comando: harden.
5. **[P2] Percurso longo perde força no blog vazio e depois dos estudos.** Ambos mediram cerca de 20.667px em 390×844; A apontou blog na navegação sem artigos e ausência de contato imediato ao final dos estudos no celular. **Correção proposta:** reduzir o bloco previsto e sua presença na navegação até existir conteúdo aprovado; adicionar uma saída de contato após os estudos e revisar repetições. Não escrever artigos ou prova social fictícios. Comandos: distill/clarify.

## Detector e adjudicação

O scan de arquivos gerou 78 sinais em 14 regras; o DOM inicial montado gerou 33. Contextos diferentes explicam a contagem. `overused-font` para Inter é falso positivo diante do briefing. Grade, sombras Pine e molduras aninhadas são parte da marca e da apresentação das maquetes. Letreiros/cotas não são texto longo ou controles funcionais da UNO. Os alertas de contraste ignoraram regras de hover que prevalecem na cascata; cores computadas passam 4,5:1 nos pares conferidos.

Padding, animações de propriedades de layout e textos pequenos são hipóteses a conferir por função; não houve travamento ou aperto do corpo de texto reproduzido. O pan do viewer é um problema específico confirmado, mesmo que vários alertas genéricos de overflow sejam falsos positivos. [Detalhes e contagens por regra](critica-b.md).

## Carga e percurso emocional

Hero tem uma ação primária e uma secundária; jornada tem quatro opções. Menu e serviços passam de quatro escolhas, porém agrupadas. O esforço principal vem da extensão e repetição, com atalhos por âncoras que evitam percurso obrigatório. Estudos elevam interesse; processo/preço dão segurança racional; blog indisponível enfraquece o trecho final. Não há dados para afirmar abandono ou impacto em conversão.

## Personas e observações menores

- **Jordan, primeiro contato:** entende oferta e ação; pode projetar um escopo amplo no preço inicial e encontra Blog sem respostas disponíveis.
- **Casey, uso no celular:** CTA confortável e jornada linear; visualizador requer pan e rolagem, e a saída após estudos depende do menu ou de avançar a página.
- **Sam, teclado/acessibilidade:** foco, erros e Escape funcionam; dois níveis de rolagem merecem confirmação com leitor de tela. NVDA/VoiceOver não foram usados.
- **Riley, tentativa de quebrar o fluxo:** 200 genérico não produziu sucesso e três envios concorrentes geraram um POST; bloqueio isolado do JS revelou a recuperação parcial.

Rótulos reais pequenos do checklist/replay merecem leitura ampliada; o canal aceita WhatsApp e e-mail, mas usa teclado/autocomplete de e-mail. Campos opcionais poderiam ser identificados de forma mais consistente. Mudanças rápidas de movimento/orientação tiveram duas asserções falhas na suíte conjunta, sem reprodução nas cinco alternâncias dirigidas; isso permanece uma limitação da confirmação, não uma falha apagada do relatório.

Não houve outra rodada de correções após esta crítica, respeitando o limite solicitado. Perguntas adicionais dispensadas: o usuário já definiu o escopo, as decisões que não podem ser inventadas e o limite de uma rodada de correções mais uma confirmação.
