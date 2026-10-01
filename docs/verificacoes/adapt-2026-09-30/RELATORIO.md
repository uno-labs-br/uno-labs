# Adapt UNO Labs: implementação e verificação

Data do pedido: 30/09/2026. Fonte: `04 - SITE/public/index.html`, servida por `npm run dev -- --ip 127.0.0.1 --port 8787` a partir do checkout oficial. A prévia incluiu `public/` e o Worker, sem credenciais de envio. Não houve merge, publicação ou mensagem externa.

Este relatório e suas notas referem-se à entrega `044ed3d`. Em 01/10/2026, uma continuação solicitada pelo usuário restaurou giro e onda da órbita de serviços, com pausa e respeito a movimento reduzido. As cores anteriores foram confirmadas como idênticas. [Registro específico](../orbita-2026-10-01/RELATORIO.md). Não houve nova atribuição de notas às alterações posteriores.

## Base e trabalho preservado

- Branch: `feat/adapt-contato`, criada na pasta oficial a partir da implementação de `feat/variacoes-modelos-conceituais`.
- Checkpoint inicial: `15cd947d4eeea6557820ff7f8024ce52923d9f20`, commit vazio solicitado para marcar o estado anterior. Título e descrição: `commit-antes-atualizacao-adapt`. Pai: `a0e1a9e`.
- PRs [#2](https://github.com/uno-labs-br/uno-labs/pull/2) e [#3](https://github.com/uno-labs-br/uno-labs/pull/3) permaneciam abertos na conferência. Esta branch inclui essa base, ainda não integrada na `main`. A comparação específica deste trabalho começa em `15cd947`; o PR para `main` inclui dependências anteriores.
- `conceitos.css`, fontes e imagens dos estudos não foram alterados. Sequências finitas de quatro segundos, pausa por visibilidade e replay existentes foram preservados. As duas cópias de `AGENTS.md` permaneceram idênticas.
- Nenhum stash, reset, descarte, force push, merge, auto-merge ou deploy foi executado.

## Mudanças e motivo

1. Jornada medida pela altura útil, cabeçalho, largura e conteúdo. Sticky usa três alturas estáveis de tela e quatro intervalos iguais; telas sem espaço e movimento reduzido mostram as quatro explicações em sequência. O mínimo de 420px foi retirado. Redimensionamento, fontes prontas, orientação e `visualViewport` recalculam a apresentação.
2. CTA de investimento corrigido de `btn--mint` para `btn--uno-mint`. Toques, foco, contraste e leitura em telas estreitas receberam ajustes. Conteúdo essencial dos segmentos continua visível no celular.
3. E-mail e WhatsApp confirmados por Urias estão visíveis e no JSON-LD. CTAs comerciais conduzem ao formulário. Links diretos de e-mail/WhatsApp são alternativas explícitas, sem substituir o envio dos campos ao backend.
4. Formulário conserva os campos em falhas, identifica erros 422, oferece canais alternativos, comunica carregamento e sucesso com estado acessível e bloqueia envios concorrentes. Sem JavaScript, navegação e representação estática dos estudos continuam úteis; o envio indisponível tem alternativas, `method=post` e `action` explícitos.
5. Worker só considera encaminhado quando o n8n confirma `smtp_aceito` após SMTP. Destinatário e remetente não vêm do navegador; Reply-To só recebe e-mail válido. Logs não imprimem payload ou mensagens brutas de exceção. O modelo n8n é inativo, importável e sem credenciais, com destinatário fixo `contato@unolabs.com.br`. PHP opcional foi alinhado ao contrato para evitar sucesso incompatível com o frontend.
6. Prazo, garantia e equipe UNO foram reescritos sem marcadores ou fatos inventados. Milena permanece em Publicidade e Propaganda, UVV, em formação. SEO/anúncios não prometem posição ou imediatismo. Terminal apresenta itens a verificar, sem certificar publicação, métricas ou entrega. Preço aprovado preservado; proposta e fatores que ampliam o escopo foram explicados sem inventar pacote inicial.
7. Visualizador dos três estudos separa controles reais de maquetes inertes, com Escape, foco contido e retorno ao acionador. A apresentação ampliada permite ler e comparar formatos, mas ainda exige deslocamento lateral em telas pequenas, conforme críticas abaixo.
8. Privacidade permanece um rascunho explicitamente sinalizado. Os artigos continuam previstos, sem inventar autores ou conteúdo. Documentação vigente foi atualizada; não foram criadas cópias concorrentes na pasta antiga.

## Evidências visuais

- [Desktop 1440×900](desktop-home.png).
- [Celular 390×844](celular-home.png).
- [Jornada desktop](desktop-jornada.png), [sticky móvel](celular-jornada.png) e [linear 320×568](celular-jornada-linear.png).
- [Visualizador móvel](celular-visualizador.png), [evidência independente do pan lateral](critica-a-mobile-modal.png) e [recuperação após 503 local](celular-formulario-503.png).

As capturas são de viewport em Chromium emulado, sem dispositivo físico. Uma captura de animação não comprova seu ciclo inteiro; as verificações funcionais complementam as imagens.

## Testes e limites

| Verificação | Resultado |
|---|---|
| `npm run verificar` | Dry run do Wrangler concluído; não publica produção |
| `node --check public/assets/js/site.js`, `worker/index.js`, `tests/adapt-browser.cjs` | Sintaxe aprovada |
| `node --test tests/contato.test.mjs` | 8 casos + teste agregador aprovados, total 9; fetch completamente simulado |
| `git diff --check` | Aprovado |
| Primeira rodada conjunta | 75/77 asserções aprovadas; duas falhas de contenção de foco no dialog corrigidas |
| Única confirmação conjunta | 87/89 asserções aprovadas; duas falhas temporais de movimento reduzido preservadas no relatório bruto |
| Investigação dirigida de movimento | Cinco alternâncias isoladas passaram, esperando o estado aplicado. Latência observada 34–82ms; falha da sequência rápida conjunta não foi reproduzida isoladamente |
| PHP opcional | Não executado: PHP não está disponível no ambiente. Sintaxe/runtime não certificados |

Não declarar a suíte do navegador inteiramente aprovada. `motion changed live` e `motion journey full` falharam na sequência conjunta após mudanças rápidas de mídia e orientação. Teste no carregamento, durante animação e alternâncias dirigidas passaram. Isso reduz a suspeita de falha persistente, mas não substitui confirmar a sequência em navegadores e sistemas reais. Não houve nova mudança visual nem uma terceira rodada de polimento.

Registros brutos: [rodada inicial](rodada-inicial.json), [confirmação](confirmacao.json), [movimento dirigido](movimento-dirigido.json). Nenhum erro JavaScript não tratado na rodada principal. Interceptações 422, rede e sucesso simulado usam somente dados fictícios. O 503 local veio do Worker sem configuração, sem acesso ao n8n.

| Viewport | Jornada observada | Altura da seção |
|---|---|---:|
| 320×568 | Linear | 1667px |
| 360×640 | Linear | 1689px |
| 390×844 | Sticky | 2532px |
| 844×390 | Linear | 1489px |
| 768×1024 | Sticky | 3072px |
| 1280×720 | Linear | 1594px |
| 1440×900 | Sticky | 2700px |

Sem overflow horizontal global ou corte dos textos da jornada nessas amostras. Foram exercitados menu, FAQ, teclado, dialog, Escape/retorno, toque emulado, replay, pausa fora da área visível, movimento reduzido no carregamento e mudança em sessão, orientação, ausência de JS, validação vazia, 422, falha de rede, 503, bloqueio concorrente e sucesso simulado. Zoom de 200% foi representado por viewport lógico de 640×360 e escala 2 em tela 1280×720: reflow equivalente, sem operação do zoom nativo.

Não houve teste em celular físico, barras móveis reais, Safari/WebKit, Firefox, NVDA/VoiceOver ou preferência alterada pelo sistema operacional. Não há benchmark de Core Web Vitals nem taxa de conversão medida. A confirmação independente adicionou cenários 502, JSON inválido, 200 genérico e falha isolada de carregamento do arquivo JS.

Pares de cor reais conferidos pelos avaliadores passam 4,5:1, incluindo Pine/Mint 8,46:1, Ink2/Off White 8,11:1 e erro/aviso 5,75:1. Isso não certifica cada pixel de texto das maquetes ou todos os estados possíveis. Alvos principais examinados têm altura próxima de 44px ou maior.

### Reproduzir localmente

Em `04 - SITE`, iniciar `npm run dev -- --ip 127.0.0.1 --port 8787` sem credenciais reais de envio. Em outro terminal:

```powershell
node --test tests/contato.test.mjs
node tests/adapt-browser.cjs confirmacao
```

O script do navegador exige Playwright e Chromium disponíveis; permite `UNO_PLAYWRIGHT_PATH` para apontar o pacote do runtime do Codex e `UNO_QA_OUTPUT` para escolher a pasta de evidências. O projeto não ganhou uma dependência de produção de Playwright. A suíte retorna erro quando uma asserção falha. As esperas curtas dos testes de mídia podem exigir investigação temporal; os relatórios desta entrega mantêm o resultado observado.

## Estado real do e-mail

**Nenhuma mensagem externa enviada. Nenhuma entrega na caixa comprovada.** Só código, modelo inativo e simulações locais foram verificados. A caixa e as credenciais não estavam disponíveis. A resposta `smtp_aceito` confirma encaminhamento aceito pelo SMTP no fluxo configurado, nunca recebimento final.

Faltam URL n8n, Header Auth `X-Uno-Token`, secrets do Worker, host/porta/TLS e credenciais SMTP HostGator, remetente autorizado e acesso à caixa. A informação documental de Plano M contratado não equivale a validar a conta e os registros de e-mail. Se adotado, Turnstile exige chaves correspondentes. O [roteiro de homologação](../../CONTATO_HOMOLOGACAO.md) prepara a mensagem fictícia; execução real exige autorização específica de Urias ou Bruno.

## Crítica independente e pendências

Método: duas avaliações isoladas, `/root/critica_visual` e `/root/critica_evidencias`, sem notas anteriores nem metas numéricas no briefing dos avaliadores. A terminou antes de resultados do detector entrarem na síntese do principal. Documentação foi delegada a GPT-6 Luna, selecionado diretamente com raciocínio xHigh. OpenCode, Muse e DeepSeek não foram usados.

| Avaliação | Visual | Fidelidade/eficácia da mensagem | Heurísticas |
|---|---:|---:|---:|
| [A](critica-a.md) | 8/10 | 7,5/10 | 26/32 |
| [B](critica-b.md) | 8,2/10 | 7,6/10 | 28/36 |

Os denominadores diferentes decorrem das heurísticas consideradas aplicáveis. Não há comparação direta ou nota média fabricada. Nenhuma avaliação atingiu 9/10. A [crítica combinada](CRITICA.md) traz a priorização, causas e correções propostas.

Pendências de interface: visualizador móvel com pan pouco evidente; recuperação parcial se somente o arquivo JS falhar; blog indisponível com peso excessivo; percurso longo e falta de CTA imediato após estudos no celular. A troca rápida de preferência de movimento precisa de confirmação fora da emulação. A maquete Atria conserva identificadores profissionais fictícios marcados por campos, dentro de um estudo conceitual, sem apresentá-los como integrantes da UNO.

Bloqueios de publicação/documentação: homologar contato; concluir política com responsável, contato de privacidade, hospedagem n8n, retenção, data e operadores efetivos; confirmar dados empresariais. Pacote inicial, condições de prazo/garantia na proposta e pagamento da mídia precisam de definição pelos responsáveis. Artigos e cases reais continuam futuros; sua ausência não autoriza criá-los. A política cita Telegram previsto, mas o modelo n8n entregue só encaminha e-mail: reconciliar com a operação escolhida antes de publicar.

Detector executado após as mudanças: **78 sinais/14 regras**, 33 sinais no DOM inicial montado com overlay headless. [JSON integral](detector.json), [resumo](detector-resumo.json) e [captura](detector-overlay.png). Inter, grade técnica e várias molduras/cotas são escolhas de marca/contexto, não erros automáticos. A cascata computada invalidou os dois alertas genéricos de contraste. Os sinais não foram usados para apagar características aprovadas ou inflar notas.

O servidor do detector foi encerrado pelo avaliador B. Não houve aba/overlay visível ao usuário; a captura comprova somente a injeção headless. Evidências temporárias foram preservadas para investigação, além das cópias versionadas aqui. O resultado é uma prévia para revisão humana, não uma versão declarada pronta para produção.

Registro Impeccable salvo na pasta geral `.impeccable/critique/2026-10-01T02-50-02Z__04-site-public-index-html.md`, slug `04-site-public-index-html`, com fingerprint do HTML. Este foi o primeiro snapshot desse alvo, 26/32; não há tendência comparável anterior. Ignore list ausente. O arquivo temporário usado no write foi removido. O servidor Wrangler da prévia foi encerrado após as avaliações. A [crítica combinada](CRITICA.md) versionada é a cópia disponível com o PR.
