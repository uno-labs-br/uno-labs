# Avaliação independente B — UNO Labs

Método: avaliação B isolada (detector + navegador + fonte). Nenhuma avaliação A, síntese anterior ou nota anterior foi consultada. Esta é a evidência da subavaliação B, para síntese posterior pelo agente principal; não é a crítica dual completa.

Alvo: `D:/00 - PROJETOS/01 - UNO LABS - LP/04 - SITE/public/index.html`. Prévia: `http://127.0.0.1:8787`, correspondente a `04 - SITE/public` mais Worker. Branch observada: `feat/adapt-contato`; HEAD observado: `15cd947d4eeea6557820ff7f8024ce52923d9f20`. Sem alterações em código, documentação ou estado Git. Scripts e evidências estão exclusivamente em `C:/Users/urias/AppData/Local/Temp/uno-adapt/critica-b/`.

## Notas próprias

| Dimensão | Nota | Fundamentação |
|---|---:|---|
| Visual | **8,2/10** | Hierarquia forte, paleta e tipografia coerentes com a marca, boa composição entre exemplos e conteúdo. O hero preserva legibilidade no celular. A página ainda é muito longa, e o visualizador exige deslocamento lateral no celular. A nota não representa conformidade integral de acessibilidade. |
| Fidelidade e eficácia da mensagem | **7,6/10** | Oferta, preço, cidades, equipe e natureza conceitual dos projetos são consistentes. A página apresenta uma proposta reconhecível e dá alternativas reais de contato. Falta um escopo concreto para o preço inicial; os exemplos demonstram direção e acabamento, sem prova comercial real. O contato e a política ainda dependem de decisões e homologação. |

Não houve meta de nota. A apresentação está pronta para revisão; esta avaliação não comprova prontidão para publicação.

## Veredito de especificidade

O sistema parece uma agência de sites e aquisição que quer demonstrar domínio de interface e processo. O palco técnico, os três mundos dos estudos e a sequência Encontra → Entende → Confia → Chama sustentam essa intenção. A estrutura geral — hero, serviços, portfólio, processo, preço, equipe, FAQ, contato — é comum ao setor. A diferenciação vem principalmente dos estudos e da demonstração da jornada, não de uma tese comercial já exclusiva.

Não há motivo evidenciado para trocar Inter, Pine ou Mint. A marca aprovada é a autoridade visual; um detector que chama Inter de comum não invalida essa decisão.

## O que funciona

1. **A primeira tela comunica serviço e ação.** A headline aprovada é preservada e o apoio explica sites, SEO local e anúncios. O CTA principal ocupa uma linha inteira no celular de 390 px, e preço/parcelamento têm um grupo separado.
2. **A adaptação da jornada funciona pelas medidas.** Em 1440×900, 390×844 e 768×1024 ela usa exatamente três alturas de viewport. Em 320×568, 844×390, 1280×720, movimento reduzido e sem JS, vira conteúdo linear. Nos quatro passos móveis, o texto ativo ficou inteiramente dentro da área útil, com término em aproximadamente y=810 num viewport de 844 px.
3. **O formulário evita sucesso fictício no contrato.** Um 200 com `{ok:true}` é rejeitado. Só `{ok:true,encaminhamento:'smtp_aceito'}` apresenta a confirmação. Erros preservam os dados, 422 marca os campos e leva foco ao primeiro, e envios concorrentes foram bloqueados. A confirmação distingue aceitação pelo serviço de e-mail de recebimento na caixa.

## Problemas prioritários

**Nenhum P0 foi reproduzido nas jornadas locais testadas.** Dois P1 abaixo são pendências explícitas para publicação, não defeitos ocultos descobertos no frontend.

### [P1] O contato operacional ainda não foi homologado

**Evidência:** `docs/CONTATO_HOMOLOGACAO.md` registra falta de URL, autenticação n8n, host/porta/TLS e credencial SMTP, remetente autorizado e acesso à caixa. `docs/n8n/uno-contato.modelo.json` está inativo, sem credenciais e com remetente de configuração. O Worker, sem integração no ambiente isolado, responde 503.

**Impacto:** o principal CTA conduz ao formulário, mas seu funcionamento real depende de infraestrutura ainda não comprovada. Não se pode afirmar que o formulário encaminha e-mails em produção a partir dos testes locais.

**Correção:** configurar ambiente de homologação e, após a autorização específica prevista no roteiro, reunir três evidências separadas: POST/backend aceito, nó SMTP concluído e mensagem localizada na caixa `contato@unolabs.com.br`. Preservar os canais alternativos e as mensagens precisas. Uma resposta backend positiva simulada não prova SMTP nem caixa postal.

**Comando sugerido:** `$impeccable harden` para os estados; configuração e homologação são trabalho operacional.

### [P1] A política acessível pelo formulário continua em rascunho

**Evidência:** `public/politica-de-privacidade/index.html` mostra aviso explícito e campos pendentes para data, responsável legal, contato de privacidade, hospedagem n8n e retenção. Também descreve Telegram como participante, enquanto o modelo n8n atual envia somente e-mail; a documentação de homologação registra essa diferença.

**Impacto:** a pessoa que confere o tratamento dos dados encontra uma operação incompleta. Isso enfraquece a confiança exatamente antes do envio. Não é uma avaliação jurídica de conformidade.

**Correção:** responsáveis devem definir dados e operação efetiva, validar o texto e ajustar operadores ao fluxo realmente configurado. **Não apagar os marcadores nem retirar o aviso para aparentar conclusão.** Enquanto isso, tratar como prévia para revisão.

**Comando sugerido:** `$impeccable clarify`, depois das decisões dos responsáveis.

### [P2] O preço inicial é claro, mas a entrega inicial é indefinida

**Evidência:** o investimento explica fatores de preço e diz que estrutura, conteúdo, visual e funções entram na proposta; não apresenta um conjunto mínimo concreto que cabe em R$ 1.490. A documentação vigente registra esse pacote inicial como decisão pendente.

**Impacto:** o visitante pode entender o valor como ancoragem para um projeto amplo, sem conseguir estimar o que receberá. O preço funciona melhor para gerar conversa do que para qualificar expectativa.

**Correção:** definir com Urias/Bruno um exemplo ou pacote inicial realmente vendável, com entregáveis e exclusões confirmados; publicar somente depois. Não inventar número de páginas, prazo, revisões ou condições para preencher a lacuna.

**Comando sugerido:** `$impeccable clarify`.

### [P2] O visualizador de celular exige leitura em dois eixos

**Evidência:** em 390×844, área de visualização com 318 px de largura mostra uma maquete de 390 px (`scrollWidth=390`), produzindo 72 px de deslocamento lateral. A captura `mobile-viewer.png` mostra frases cortadas à direita. A rolagem por setas funciona: ArrowRight avançou 40 px; ArrowDown no desktop avançou 40 px.

**Impacto:** a composição ampliada fica nítida, mas o visitante precisa mover horizontalmente para compreender um layout que está rotulado “Celular”. O controle e o aviso existem; a tarefa continua possível.

**Correção:** oferecer “Ajustar à largura” como estado inicial e “Tamanho original” para examinar detalhes, ou reduzir os insets do visualizador. Preservar a maquete e as opções Desktop/Celular. Não tornar os botões ilustrativos operacionais.

**Comando sugerido:** `$impeccable adapt`.

### [P2] Falha de carregamento do arquivo JS recebe tratamento parcial

**Evidência:** com JS totalmente desligado, formulário some, navegação fica visível e a alternativa de contato é explícita. Ao bloquear somente `assets/js/site.js`, o script inline já deixou `html.js`; campos continuam visíveis, botão fica desabilitado e o aviso pede “ative o JavaScript”, embora JS esteja ativo. O menu móvel depende do arquivo que falhou e não possui o comportamento alternativo ligado à ausência da classe `.js`.

**Impacto:** um usuário pode preencher campos de um formulário indisponível e a instrução de recuperação não descreve a falha real. Canais diretos continuam disponíveis; não bloqueia todo o contato.

**Correção:** ligar a melhoria progressiva à inicialização concluída, não apenas ao script inline executado. Exibir navegação e contato estáticos até a confirmação de prontidão; ocultar/desabilitar os campos indisponíveis e usar texto como “O formulário está indisponível; use um dos canais abaixo”.

**Comando sugerido:** `$impeccable harden`.

## Observações menores

- **[P3] Teclado do canal de retorno:** o mesmo campo aceita telefone ou e-mail, mas usa `inputmode=email` e `autocomplete=email`. Isso favorece e-mail e exige mais alternância para quem informa WhatsApp. Pode ser melhor escolher canal e ajustar o teclado. Fonte: `public/index.html:883`.
- **[P3] Pequenos rótulos técnicos:** “A verificar” no checklist mede 11 px e o replay mede 13 px. O texto principal é maior; não há um erro de contraste demonstrado aqui. Aumentar os rótulos reais de leitura quando couber, sem ampliar toda a maquete ilustrativa.
- **[P2, estratégico] Percurso muito extenso para a leitura linear:** documento de aproximadamente 15.364 px em desktop e 20.667 px em 390×844. Há atalhos no hero e menu, portanto não é um bloqueio. Se dados de uso mostrarem abandono, reduzir repetições entre serviços, jornada, checklist, processo e FAQ. Não há dados de conversão neste teste.
- A ausência de testemunhos e métricas comerciais reais não autoriza criar prova social. Os estudos conceituais são uma demonstração de capacidade visual; não demonstram conversão, resultados de SEO ou clientes atendidos.

## Detector: resultados e adjudicação

Comando executado uma vez: `impeccable.cmd detect --json <caminho absoluto de public>`. Arquivo integral: `detector.json`.

**78 sinais, 14 regras.** 64 sinais atribuídos à home, 5 à política, 3 ao 404 e 6 aos CSS. A ferramenta retornou código 0 apesar de emitir achados; código 0 não foi interpretado como scan limpo. Os achados da home usam linha 0, portanto não oferecem localização exata de código; o arquivo JSON mantém snippets e caminhos.

| Regra | Quantidade | Resultado da conferência |
|---|---:|---|
| `cramped-padding` | 23 | Predominantemente falsos positivos de análise de caixas: formulário tem padding real de 22–40 px; capítulo, canvas e molduras possuem estruturas deliberadas. Nenhum caso de texto principal encostado no cartão foi reproduzido. |
| `undersized-ui-text` | 10 | Snippets são principalmente código, legenda e conteúdo das maquetes (dias da agenda, engenharia, material). Não são controles funcionais da home. Não converter automaticamente em violações da UI. |
| `layout-transition` | 7 | Há propriedades height/width/max-height no CSS; sinal mecânico verdadeiro. Algumas são trilhos curtos ou regras antigas sobrepostas. Não foi medido travamento nem demonstrado custo relevante; sem prioridade de performance apenas por esse alerta. |
| `wide-tracking` | 6 | Letreiros e informação técnica dos estudos. Uso específico do mundo visual interno, não parágrafos reais da home. |
| `codex-grid-background` | 5 | O grid existe no hero, jornada e estudo Módulo. É parte do sistema técnico estabelecido; não é razão suficiente para mudar o briefing. |
| `dark-glow` | 5 | Mistura sombras Pine com halo de destaque de Mint nas demonstrações. O detector considera a cor da sombra um padrão genérico; as capturas não mostram uma UI neon descoordenada. Não é defeito automático. |
| `nested-cards` | 5 | Principalmente interfaces apresentadas dentro de molduras e modelos. Aninhamento é necessário para mostrar o artefato, não uma hierarquia funcional adicional do usuário real. |
| `all-caps-body` | 4 | Referem-se aos mundos conceituais com direção própria, especialmente Módulo. Não observado como texto longo da home em caixa alta. |
| `overused-font` | 4 | **Falso positivo frente ao briefing:** Inter foi mantida pelo usuário e pertence à marca aprovada. Não substituir. |
| `tiny-text` | 3 | Texto ilustrativo/técnico; comparar a função antes de agir. A ressalva manual dos rótulos reais pequenos está acima. |
| `low-contrast` | 2 | **Falso positivo na cascata examinada:** o par Pine2 sobre Pine não ocorre no hover dos CTAs. Cores computadas do CTA em hover são Off White sobre #174236, com contraste 10,39:1. A regra `.btn--escuro:hover` sobrepõe `a:hover`. |
| `clipped-overflow-container` | 2 | Body possui overflow horizontal oculto, mas o dialog é camada modal e abre/rola normalmente. Não houve menu ou tooltip real cortado. O recorte lateral deliberado do viewer é registrado como problema específico, não como este alerta genérico. |
| `gpt-thin-border-wide-shadow` | 1 | Borda + sombra presentes em moldura de apresentação; convenção de objeto físico para o estudo. Observação estética sem problema de tarefa comprovado. |
| `kicker-above-heading` | 1 | O snippet é “Vitória, ES” no estudo Casa Noma. Informa localização no exemplo, com arte e tipografia próprias; não eliminar como se fosse título real da UNO. |

O detector no navegador foi injetado com sucesso, depois de preflight de mutação, e registrou **33 sinais** no DOM inicial montado. Isso cobre somente esse estado; não equivale aos 78 do scan de arquivos, que vê templates e outras páginas. Captura: `detector-overlay.png`. O browser era headless: **não existe uma aba [Human] visível ao usuário**. Não foi alegado overlay visível. O servidor de detector iniciado nesta avaliação (PID 85556, porta 8400) foi encerrado; o servidor da prévia 8787, iniciado fora desta avaliação, foi preservado.

## Contraste e acessibilidade verificados

| Par | Razão calculada |
|---|---:|
| Pine / Off White | 13,97:1 |
| Ink2 / Off White | 8,11:1 |
| Pine / Mint | 8,46:1 |
| Off White / fundo do CTA em hover | 10,39:1 |
| Erro #B42318 / branco | 6,57:1 |
| Erro #B42318 / aviso #FDECEA | 5,75:1 |
| Sage2 / Pine | 10,02:1 |

Esses pares passam o mínimo de 4,5:1 para texto normal. Não se afirma que todos os textos e estados foram auditados. O critério e o cálculo usam as cores CSS/computadas, não pixels suavizados da captura. [Referência oficial W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Menu, CTA, canais, replay e chips de serviço examinados têm áreas declaradas de pelo menos 44 px de altura; isso é uma opção de conforto do projeto. O mínimo WCAG 2.2 AA de tamanho de alvo é 24×24 CSS px ou espaçamento/exceções, não um mínimo universal de 44 px. [Referência oficial W3C](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

O modal abriu por Enter, levou foco a Fechar, percorreu Desktop → Celular → área de rolagem → Fechar sem escapar, fechou com Esc e retornou ao acionador. O canvas está `inert` e `aria-hidden`; controles reais e explicação estão fora dele. Isso é compatível com o comportamento modal e a separação semântica recomendada pela [referência oficial do elemento dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog). Não houve teste com NVDA/VoiceOver real.

## Matriz de requisitos

| Requisito | Resultado |
|---|---|
| Headline aprovada | Presença digital que atrai clientes. Preservada. |
| R$ 1.490, até 10x sem juros | Hero, investimento, meta e FAQ/JSON-LD coerentes. |
| Sem números inventados de prazo/garantia | Não encontrado prazo numérico de entrega ou garantia de posição. Condições ficam na proposta; FAQ nega primeira posição garantida. |
| Equipe e Milena | Criadores sem cargos inventados; Milena em Publicidade e Propaganda, UVV em formação. |
| E-mail e WhatsApp | `mailto:contato@unolabs.com.br` e `https://wa.me/5527936185141`; visíveis e coerentes com JSON-LD. Não foi aberta conversa nem enviado e-mail. |
| Destinatário fixo n8n | Modelo usa `toEmail=contato@unolabs.com.br`; From de configuração, não dados do formulário. Worker não repassa To/From fornecidos no teste. |
| Worker → n8n → SMTP HostGator | Código e modelo correspondem; operação real não comprovada. |
| Validação 422 | Teste vazio: quatro erros, foco nome e zero POST. Resposta simulada 422: empresa e canal marcados, foco empresa e dados preservados. |
| Falhas e duplicação | 503, 502, JSON inválido, rede abortada e 200 genérico preservam dados. Três eventos de envio durante uma requisição produziram só um POST interceptado. |
| Estados acessíveis | `aria-invalid`, `aria-describedby`, status polite, `aria-busy`, botão desabilitado e foco no título de confirmação presentes/testados. |
| Jornada três telas / linear | Medidas e quatro etapas confirmadas desktop e mobile; fallback linear nas telas sem espaço e em RM/sem JS. |
| Estudos finitos e replay | Módulo desktop/celular apresentou efeitos com iterations=1, fim máximo 4.000 ms; depois de 18 s, execução saiu e marcou conclusão. RM: nenhum estudo executando e aviso no replay. Demais sequências preservadas na fonte, sem replay integral cronometrado de cada estudo neste teste. |
| Privacidade pendente explícita | Banner e marcadores preservados; publicação depende de conclusão. |
| Home/JSON-LD sem cargos ou prazo placeholder | Conferência das áreas comerciais não encontrou esses marcadores. Placeholders de privacidade e do modelo SMTP são identificados e intencionais. |
| Escopo do pacote inicial | Continua indefinido; não inventado. |
| Blog previsto | Três temas “Em breve”, aviso de indisponibilidade, sem links que simulem artigos prontos. |

## Testes isolados do Worker

Executado em Node importando o código em processo isolado, com `globalThis.fetch` completamente substituído. Nenhuma chamada real foi feita ao n8n, SMTP, Cloudflare ou destinatários.

- Campos inválidos → 422 com `nome`, `empresa`, `canal`, `contexto`.
- Sem configuração → 503.
- n8n simulado retorna 200 `{ok:true}` → Worker responde 502.
- n8n simulado retorna confirmação `smtp_aceito` → 200.
- Telefone → Reply-To vazio; e-mail válido → Reply-To preenchido.
- Dados fictícios To/From fornecidos pelo cliente → omitidos no payload encaminhado.
- Falha de transporte simulada → 502.

A documentação oficial do n8n prevê respostas padrão em situações em que o nó de resposta não executa; por isso a exigência de confirmação explícita é relevante. [Referência oficial](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/). Esses resultados verificam lógica de contrato. **Não comprovam nó SMTP real, conta HostGator nem recebimento na caixa.**

## Heurísticas e carga cognitiva (julgamento B)

| Heurística | Nota /4 | Evidência/limite |
|---|---:|---|
| Visibilidade do estado | 3 | Status, carregamento e confirmação precisos; sem experiência real de processamento externo. |
| Linguagem do usuário | 3 | Benefícios claros; SEO/Schema/WCAG e o terminal exigem tradução conceitual de leigos. |
| Controle e saída | 3 | Âncoras, Esc, fechar modal e retorno de foco. Viewer móvel exige dois eixos. |
| Consistência | 4 | Marca e padrões de ação coerentes, com mundos conceituais explicitamente separados. |
| Prevenção de erro | 3 | Validação e bloqueio concorrente. Não há garantia de exatamente um envio entre Worker e SMTP. |
| Reconhecimento | 3 | CTA e canais visíveis, FAQ nativo. Oferta inicial ainda exige perguntar o escopo. |
| Eficiência para usuários avançados | n/a | Superfície de persuasão, não ferramenta de operação. |
| Estética e foco | 3 | Hierarquia clara; extensão e repetição elevam esforço. |
| Recuperação de erro | 3 | Campos preservados e alternativas. Falha isolada do JS recebe instrução imprecisa. |
| Ajuda e documentação | 3 | FAQ e guia dos campos úteis; blog ainda indisponível, política em rascunho. |
| **Total** | **28/36** | **77,8%, bom**; não é selo de publicação. |

Carga cognitiva: moderada. Agrupamento e hierarquia passam; há um foco principal em cada seção. “Escolhas mínimas” falha estritamente na navegação desktop (5 destinos, mais CTA repetido) e nos serviços (5 chips de seleção), mas são paralelos e familiares, não oito decisões simultâneas. “Uma coisa por vez” fica enfraquecida pela extensão do percurso e repetição técnica/comercial. A informação necessária para agir não depende de memorizar as etapas: CTA, FAQ e contato permanecem acessíveis por âncoras.

Personas: **Jordan** entende a oferta e ação, mas não sabe o que cabe em R$ 1.490; **Casey** tem CTA amplo e canais diretos, mas o formulário extenso e viewer lateral exigem esforço; **Sam** percorre o modal e recebe foco/erros, mas o teste não substitui leitor de tela real. **Riley** não conseguiu provocar sucesso falso com 200 genérico ou duplicar requisição concorrente; encontrou estado parcial ao bloquear o arquivo JS.

## Limites e evidências

- Navegador Chromium headless, duas rodadas de coleta/confirmacão; contexts/tabs novos desta avaliação. Sem Safari/WebKit, Firefox, dispositivos físicos ou 3G real.
- Larguras/alturas: 1440×900, 390×844, 320×568, 844×390, 768×1024 e 1280×720; RM desktop e sem JS mobile.
- `documentElement.scrollWidth` e `body.scrollWidth` coincidiram com o viewport em todas as amostras. Não houve overflow horizontal global nessas amostras; overflow local do viewer é deliberado e foi medido.
- A captura inicial da jornada em 150 ms contém camadas da transição. A confirmação depois de 1.500 ms mostrou somente o passo ativo, com demais cenas em opacity=0/visibility=hidden. **Não contar o frame intermediário como sobreposição persistente.**
- Algumas capturas de elemento muito alto registram o cabeçalho sticky no meio do bitmap devido à rolagem usada pelo Playwright; isso não representa um cabeçalho fixo no meio da página. A posição visual foi conferida nas capturas de viewport.
- A captura imediata do viewer Módulo pode ocorrer antes de a nova imagem clonada terminar de decodificar; não foi usada como prova de imagem permanentemente faltante.
- Timeout real de 15 s, retomada após mudança de aba, leitor de tela, tamanho de texto 200%, falha de cada imagem e ciclo completo de replay de Atria/Casa Noma não foram exercitados nesta avaliação. A conclusão não é “testado em todos os dispositivos”.
- Nenhum erro JavaScript não tratado no percurso principal. Erros de console HTTP/rede correspondem aos mocks deliberados. A falha de arquivo JS foi um teste separado.
- Sem benchmark de performance, Core Web Vitals medidos, métricas de conversão ou auditoria jurídica.
- Slug: `index-html`; lista ignore ausente; nenhum histórico de crítica consultado. Nenhuma persistência de crítica feita no repositório, por exigência de isolamento da tarefa.
- Arquivos preservados para revisão: `browser-results.json`, `browser-confirm-results.json`, `worker-results.json`, `detector.json`, `detector-resumo.json`, `source-hashes.json`, scripts `.cjs/.mjs` e capturas `.png` neste diretório.
- Todos os browsers iniciados foram fechados; servidor Impeccable encerrado; servidor 8787 preservado. Os arquivos temporários de evidência foram mantidos intencionalmente para o principal.

Questions skipped: esta subavaliação isolada deve entregar evidência ao agente principal; perguntas e próximos passos pertencem à síntese final depois de A concluir.
