# UNO Labs — Como o site foi construído

**Versão 1.1 · 30/09/2026 · Referente ao checkout oficial `04 - SITE/`**

Este documento descreve a implementação local e a hospedagem pretendida. Não comprova publicação em `unolabs.com.br`; conferir a integração na `main`, as pendências e o estado real do deploy.

Este documento descreve, com precisão suficiente para ser reproduzido, **o que** foi construído em `unolabs.com.br`, **como** foi construído e **por que** cada decisão foi tomada. Serve para dois usos:

1. **Manutenção:** qualquer pessoa (ou IA) que for mexer no site entende a lógica antes de alterar.
2. **Comparação:** entregar este documento a outros modelos de IA e comparar o que cada um produz. A seção 18 traz um prompt pronto e a seção 16, critérios objetivos para avaliar o resultado.

**Fontes vigentes:** `UNO_Labs_Documentacao_Completa.md`, Parte 0 — decisões do negócio; este documento — intenção de design e implementação; os arquivos em `public/` — comportamento efetivo, a conferir no navegador. Para colaboração, Git e publicação, seguir o `AGENTS.md` da raiz. O Apêndice A e as capturas em `docs/referencias-visuais/` são registros da construção; verificar sua atualidade diante do código. Todos os caminhos de código são relativos à raiz do checkout oficial `04 - SITE`.

**Regra obrigatória:** análises, Impeccable, localhost e alterações usam `04 - SITE/public/index.html`. Executar Git e npm em `04 - SITE`, com remoto `uno-labs-br/uno-labs`. O conteúdo desta pasta corresponde diretamente à raiz do GitHub. `03 - ANALISE LP/uno-labs-main` é somente a extração ZIP histórica do protótipo, não a implementação vigente. A Parte 0, §0.13 da documentação completa define a padronização.

---

## 1. Resumo

- **O quê:** página única de vendas (home) para a UNO Labs, que vende criação de sites, SEO local, Google Ads, Meta Ads e manutenção. Blog planejado, ainda sem artigos.
- **Promessa central:** “Presença digital que atrai clientes.” Nada é garantido; o site mostra *como* o trabalho aumenta as chances de ser encontrado e escolhido.
- **Conceito criativo:** *Precisão que se revela* — o site se apresenta como engenharia visível: grade técnica, desenho que vira produto, checklist de entrega em terminal.
- **Diferencial de experiência:** a seção “Da busca ao contato” fica **presa na tela** enquanto a pessoa rola, avançando por 4 etapas (Encontra → Entende → Confia → Chama) com uma demonstração que muda a cada etapa.
- **Prova sem cases:** três **estudos conceituais** de negócios fictícios, cada um com identidade própria, rotulados como conceituais.
- **Tecnologia:** HTML, CSS e JavaScript puros, sem framework e sem etapa de build. Hospedagem em **Cloudflare Workers (Static Assets)**; um Worker de ~170 linhas recebe o formulário e repassa ao n8n (→ Telegram e e-mail). Há alternativa em PHP para HostGator.
- **Peso da home (transferido, com gzip):** HTML ≈ 23 KB, CSS ≈ 10 KB, JS ≈ 5 KB, Inter ≈ 48 KB. Nenhuma imagem de foto. Nenhum script de terceiros no carregamento.

---

## 2. Negócio, público e posicionamento

| Item | Definição |
|---|---|
| Marca | UNO Labs (nome que substituiu o projeto “Audaro – Engenharia Digital”, que nunca existiu publicamente). A “Audaro – Engenharia de Resultado” é outra empresa e não aparece no site |
| Serviços vendidos | Sites sob medida (projeto), SEO local, Google Ads, Meta Ads e manutenção (mensais). E-commerce fora do escopo por enquanto |
| Preço de entrada | “A partir de R$ 1.490 em até 10x sem juros”. Projetos-alvo até ~R$ 10 mil |
| Garantia | Cobre só falhas no que foi entregue, por [X] dias. Mudanças entram no plano de manutenção |
| Onde atende | Presencial na Grande Vitória (Vitória, Vila Velha, Serra, Cariacica — ES) e em Curitiba (PR); remoto em todo o Brasil |
| Público | Empresas que “tratam o digital como parte do negócio”: arquitetura e interiores, engenharia e construção, clínicas e consultórios, advocacia/contabilidade/consultorias, gastronomia e hospitalidade autorais |
| Equipe | Urias Loures e Bruno Gonzaga (criadores), Milena Dias (Publicidade e Propaganda, UVV). Funções a preencher |
| Canais | WhatsApp comercial e e-mail do domínio (a preencher). Sem CNPJ e sem Perfil da Empresa no Google por enquanto |
| Prova social | Ainda não há cases publicáveis. Por isso, estudos conceituais explicitamente rotulados |

**Posicionamento em uma frase:** um time pequeno que trata site como engenharia — e mostra o método em vez de prometer resultado.

**Tom de voz:** direto, sereno, específico. Frases curtas. Sem superlativos (“o melhor”, “revolucionário”), sem urgência artificial, sem jargão de marketing (“alavancar”, “transformar seu negócio”). Números só quando verdadeiros (preço, metas técnicas).

---

## 3. O conceito: “Precisão que se revela”

### 3.1 A ideia
Empresas pequenas desconfiam de agências porque não veem o que está sendo feito. A home resolve isso **tornando o processo visível**:

- No **hero**, um desenho técnico (wireframe com cotas e grade de 12 colunas) é “varrido” por uma linha verde e se transforma no site pronto de um restaurante fictício. Um cartão mostra o código SEO (title, meta e Schema.org) e outro mostra o restaurante aparecendo na busca local. Em 10 segundos, a pessoa vê *projeto → site → ser encontrado*.
- Na **jornada presa na tela**, cada rolagem mostra uma etapa da decisão do cliente final e qual serviço atua nela.
- No **terminal “por baixo do capô”**, a lista técnica de entrega aparece como um comando sendo verificado.
- Nos **estudos conceituais**, três negócios muito diferentes provam que não há modelo pronto.

### 3.2 Três princípios que guiaram tudo
1. **Mostrar em vez de afirmar.** Nenhum “somos especialistas”. A página demonstra: grade, código, busca, checklist, estudos.
2. **Autoridade por contenção.** Paleta curta (verde-pinheiro, menta, off-white), muito espaço, tipografia grande e firme, bordas finas. Movimento só onde explica algo.
3. **Honestidade como diferencial.** Estudos rotulados “Estudo conceitual”; FAQ diz que ninguém garante primeira posição no Google; o checklist fala em “metas de projeto… não promessas de resultado”; o formulário só confirma envio se o servidor confirmar.

### 3.3 Como o site evita “cara de IA”
**Não usar:** gradientes roxo-azul, glassmorphism, ícones genéricos em círculos coloridos, emojis, fotos de banco de imagem (aperto de mão, pessoas sorrindo para notebook), ilustrações 3D genéricas, cartões idênticos em grade de 3 com ícone + título + texto, contadores falsos (“+500 clientes”), depoimentos inventados, frases como “Transforme seu negócio” ou “Soluções inovadoras”, botões com brilho/sombra colorida, fundo escuro com partículas.

**Usar:** grade editorial de 12 colunas com assimetria deliberada (5 + 1 + 6, 7 + 5, 4 + 8), textos alinhados à esquerda, linhas finas de 1 px como estrutura, rótulos pequenos em vez de ícones, monoespaçada só para dados técnicos, maquetes desenhadas em SVG/HTML específicas de cada negócio, microcopy concreta (“Entrega: mapa do site e conceito visual”).

---

## 4. Sistema visual

### 4.1 Cores (tokens do kit `01 - IDENTIDADE VISUAL/05_paleta_e_tokens`)
Os nomes das variáveis CSS são os mesmos do kit (`--uno-*`). As marcadas com * são extensões criadas para o site.

| Token CSS | Hex | Uso |
|---|---|---|
| `--uno-pine` | `#0E2B24` | Títulos, botão principal, fundo da jornada e do cartão de investimento |
| `--uno-pine-2` | `#12362D` | Hover de links |
| `--uno-pine-deep`* | `#0B221C` | Fundo de terminal e cartão de código |
| `--uno-mint` | `#7DD3A8` | Acento: linha do hero, nós, trilho de progresso, botão sobre fundo escuro |
| `--uno-mint-2` | `#A7E5C5` | Rótulos e chips sobre fundo escuro |
| `--uno-mint-deep`* | `#3DAA78` | Pontos de status sobre fundo claro, grade luminosa do hero |
| `--uno-off-white` | `#F3F7F3` | Fundo principal |
| `--uno-off-white-2` | `#EDF3EE` | Fundo alternado (blog, contato), avatares |
| `--uno-sage` | `#A8B8AE` | Texto secundário sobre fundo escuro |
| `--uno-sage-2` | `#CAD5CE` | Texto de apoio sobre escuro, bordas claras |
| `--uno-ink` | `#10201C` | Texto corrido |
| `--uno-ink-2` | `#355048` | Texto secundário sobre claro (contraste AA) |
| `--uno-error`* | `#B42318` | Erros do formulário |
| `--uno-line` | `rgba(16,32,28,.13)` | Divisórias |

Regra: verde-menta nunca como texto sobre fundo claro (contraste insuficiente); sobre fundo claro, o acento aparece em formas (pontos, linhas, anéis).

### 4.2 Tipografia
- **Inter** (variável 400–700) com `font-feature-settings: 'cv11'` (a de “a” de um andar, mais geométrica). Títulos em peso 600, com espaçamento negativo.
- **IBM Plex Mono** (400/500) só para dados técnicos: números de etapa, terminal, contador “02 / 04”, cartão de código.
- Fontes **auto-hospedadas** (`assets/fonts/`, subconjunto latin), sem conexão com o Google.
- Escala (valores reais do CSS):

| Elemento | Tamanho | Altura de linha | Espaçamento |
|---|---|---|---|
| H1 do hero | `clamp(46px, 7.4vw, 104px)` | .96 | −0.05em |
| Título de seção | `clamp(32px, 4.3vw, 56px)` | 1.05 | −0.035em |
| Título médio | `clamp(30px, 3.6vw, 48px)` | 1.07 | −0.03em |
| H3 de cartões/serviços | 24–26px | 1.2 | −0.02em |
| Texto de apoio | `clamp(16px, 1.4vw, 18px)` | 1.6 | — |
| Corpo | 17px | 1.6 | — |
| Rótulo de seção | 15px / 600 | — | — (cor `--ink-2`, ou `--mint-2` no escuro) |

Títulos usam `text-wrap: balance`; parágrafos, `text-wrap: pretty`.

### 4.3 Grade e espaçamento
- Contêiner: `width: min(1240px, 100% − 40px)` (margem mínima de 20 px no celular).
- Grade de 12 colunas, *gutter* 24 px. Composições usadas: **5 / 1 / 6** (serviços, capô, contato), **7 / 5** (cabeçalhos de seção), **4 / 8** e **8 / 4** (estudos), **4 / 1 / 7** (dúvidas), **7 / 1 / 4** (para quem).
- Espaço vertical entre seções: `--secao: clamp(72px, 10vw, 128px)`.
- Altura do cabeçalho: 80 px (64 px abaixo de 768 px).

### 4.4 Formas, linhas e textura
- Raios: 12 (campos), 16–18 (janelas e cartões flutuantes), 26 (cartões), 34 px (cartão de investimento), 999 px (botões e chips).
- Bordas de 1 px com transparência (`rgba(16,32,28,.1–.22)`); sem bordas grossas.
- Sombras longas e suaves, sempre tingidas de verde: `0 28px 80px rgba(18,54,45,.12)` (padrão) e `0 40px 100px rgba(18,54,45,.18)` (forte).
- Textura de marca: **grade de 80 px** em linhas de 1 px (`rgba(16,32,28,.045)` no claro; `rgba(243,247,243,.035)` no escuro).

### 4.5 Logo e ícones
- Logos em SVG do kit (`uno-labs-horizontal-principal.svg`, `…-negativa.svg`). O arquivo tem 540 × 150 com margem interna de 25 px; por isso o logo recebe `margin-left: -9px` a 52 px de altura (e −10 px a 60 px) para alinhar ao texto.
- Ícones em SVG inline, traço 1,5–1,6 px, pontas arredondadas. Só onde têm função (seta de CTA, busca, localização, menu).

### 4.6 Botões e links
- Primário: fundo `--uno-pine`, texto off-white, 52–56 px de altura, pílula, seta que desliza 3 px no hover.
- Sobre fundo escuro: fundo `--uno-mint`, texto `--uno-pine`.
- Secundário: link sublinhado (offset 6 px, espessura 1 px) — nunca dois botões cheios lado a lado.
- Foco visível: contorno de 3 px `--uno-pine` (menta sobre fundo escuro).

---

## 5. Arquitetura da página

A ordem segue a lógica de decisão de um comprador desconfiado: **o que é → como funciona → prova → método → preço → é para mim? → quem faz → conteúdo → objeções → ação**.

| # | Seção (âncora) | Função na venda |
|---|---|---|
| 1 | Cabeçalho | Navegação curta + CTA sempre visível |
| 2 | Hero (`#topo`) | Promessa, para quem, preço de entrada e demonstração em 10 s |
| 3 | Jornada presa (`#abordagem`) | Explica o mecanismo: cada serviço atua num momento da decisão do cliente final |
| 4 | Serviços (`#servicos`) | O site no centro, os mensais em órbita; lista com modelo de cobrança |
| 5 | Por baixo do capô | Autoridade técnica com metas verificáveis, sem prometer resultado |
| 6 | Estudos de direção (`#projetos`) | Prova de capacidade visual em três setores |
| 7 | Como trabalhamos (`#processo`) | Reduz risco: 4 etapas com entregável cada |
| 8 | Investimento | Preço de entrada, o que muda o valor, garantia e mensais |
| 9 | Para quem / Onde | Qualifica o lead e reforça SEO local |
| 10 | Equipe | Rostos (iniciais por enquanto) e proximidade |
| 11 | Blog (`#blog`) | Sinaliza autoridade futura; cartões “Em breve” |
| 12 | Dúvidas (`#duvidas`) | Quebra objeções; honestidade sobre garantias |
| 13 | Contato (`#contato`) | Formulário qualificador + canais diretos |
| 14 | Rodapé | Navegação, serviços, área atendida, privacidade |

CTAs: “Conversar sobre meu projeto” (cabeçalho, hero, menu), “Pedir minha proposta” (investimento), “Fale com a gente” (dúvidas). Todos levam a `#contato`.

---

## 6. Seção por seção

> Medidas em px na largura de referência de 1440 px (desktop) e 390 px (celular). O texto exato está no Apêndice A.

### 6.1 Cabeçalho
- `position: sticky`, fundo off-white a 96% com `backdrop-filter: blur(10px)`, linha inferior de 1 px.
- Desktop (≥ 1100): logo 52 px · navegação central (Serviços, Projetos, Abordagem, Blog, Contato) 15 px/500, espaçamento 36 px · botão escuro 48 px.
- Abaixo de 1100: logo 44 px e botão circular de menu (44 px) que abre uma lista vertical (links 20 px + botão cheio). Fecha com clique em link ou tecla Esc; `aria-expanded` atualizado.
- Link “Pular para o conteúdo” aparece ao receber foco.

### 6.2 Hero
**Fundo:** grade de 80 px. Por cima, uma segunda grade em verde (`rgba(61,170,120,.55)`) visível só dentro de um círculo de 300 px que **segue o ponteiro** (máscara radial com `--mx/--my`). Desligado em telas de toque e com movimento reduzido.

**Texto (desktop):**
- Sobretítulo com traço menta de 32 × 2 px: “Criação de sites · SEO local · Google Ads · Meta Ads” (no celular: “Sites · …”).
- H1 em duas linhas: “Presença digital / que atrai clientes.” Cada linha sobe de dentro de uma máscara (`sobe`, 1 s, `cubic-bezier(.16,.84,.2,1)`, 2ª linha com 0,13 s de atraso).
- Base em grade 6 / 1 / 5: à esquerda, parágrafo de apoio (20 px) + botão “Conversar sobre meu projeto” + link “Ver estudos de projeto”; à direita, três fatos separados por linhas verticais: “A partir de R$ 1.490 / em até 10x sem juros”, “Presencial / Grande Vitória e Curitiba”, “Um só time / site, SEO e anúncios”. No celular, os fatos viram linhas com rótulo à esquerda e valor à direita.
- Entradas em sequência (`aparece`, 0,9 s): texto 0,35 s, fatos 0,5 s, palco 0,6 s.

**Palco desktop (composição fixa de 1240 × 640, escalada à largura):**
- **Janela do navegador** em `left: 180; width: 880`, barra de 40 px com “Estudo conceitual · Casa Noma” e um selo que alterna “Projeto técnico” (claro) ↔ “Site publicado” (escuro).
- Área de 878 × 549: por baixo, **desenho técnico em SVG** (12 colunas menta, contornos a 42% de opacidade, cotas “12 COL · GUTTER 24”, “H1 · 88 PX”, “FOTO · 586 × 480”, “RESERVA EM 3 TOQUES”). Por cima, o **site pronto da Casa Noma** revelado de cima para baixo com `clip-path` (`revela`, ciclo de 10 s) e uma **linha de varredura** menta com brilho que desce junto (`varre`).
- **Cartão de código** (fundo `--uno-pine-deep`, Plex Mono 12 px) em `left: 0; top: 330; width: 356`: `<title>`, `<meta description>` e JSON-LD `Restaurant` com cursor piscando.
- **Cartão de busca** (branco) em `right: 0; top: 96; width: 340`: campo “restaurante para jantar em vitória”, resultado azul estilo Google e o selo “Encontrado na busca local” com ponto pulsante.
- Os dois cartões sobem 4 px no hover.

**Palco celular/tablet (< 1100; composição 350 × 610, até 420 px de largura):** um celular (236 × 492) com o desenho técnico de 4 colunas sendo revelado no site mobile da Casa Noma, e o cartão de código ocupando a largura toda na base.

**Ciclo de 10 s do palco:** 0–1 s desenho técnico; 1–5 s varredura revela o site; 5–8,8 s site parado (selo “Site publicado”); 8,8–9,5 s o site some; volta ao desenho.

### 6.3 Jornada “Da busca ao contato” (presa na tela)
**Por que existe:** explicar, sem jargão, que cada serviço atua num momento da decisão do cliente final. A primeira versão tinha abas clicáveis; foi trocada por rolagem presa (pedido do usuário: “quando a pessoa rolasse… ficasse parado… e ia mudando de um para o outro”).

**Mecânica:**
- A seção tem **400vh** de altura; dentro dela, um bloco `position: sticky` com a altura da janela menos o cabeçalho.
- Progresso `p` (0–1) = quanto já se rolou dentro da faixa presa. **Etapa = ⌊p × 4⌋**; o avanço dentro da etapa (`--sub`, 0–1) preenche a linha de progresso. A rolagem é a nativa do navegador (sem “sequestro” de scroll).
- Clicar numa etapa rola suavemente até ela (posição k/4 + 6% da faixa).
- Com **movimento reduzido**, a seção deixa de ficar presa: vira um bloco normal com abas clicáveis (decisão D27). Sem JavaScript, todos os textos aparecem abertos.

**Desktop (≥ 1100): composição fixa de 1240 px** escalada por `--je = min(1, max(0.55, (altura − 40)/650), (largura/2 − 12)/648)`.
- Coluna esquerda (5/12, altura mínima 610 px para não “pular”): rótulo menta, H2 46 px, introdução, e a lista de 4 etapas.
  - Cada etapa: nó circular de 32 px com número em Plex Mono; nome 17 px. Estados: *futura* (borda translúcida, texto `#8FA59A`), *feita* (borda menta), *ativa* (nó menta preenchido com anel de 6 px, nome off-white).
  - Linha vertical de 2 px entre os nós, preenchida em menta conforme o progresso.
  - Só a etapa ativa mostra detalhe: H3 22 px, parágrafo 15 px e dois chips com os serviços envolvidos (abre com `max-height` .5 s).
- Coluna direita (7/12): **janela de navegador de 712 px** (barra 36 px com “Demonstração conceitual · Atria Clinic” e contador “0N / 04”) com cena de 712 × 445 que troca por *crossfade* (.6 s, escala .985 → 1):
  1. **Encontra** — página de resultados: busca “clínica de estética em vitória”, anúncio “Patrocinado” e resultado do blog da Atria, ambos destacados com anel menta.
  2. **Entende** — primeira tela do site Atria Clinic. Cartão flutuante “Teste dos 5 segundos · 00:05” com três respostas marcadas: O que é / Para quem / Próximo passo.
  3. **Confia** — o mesmo site com a grade de 12 colunas sobreposta em verde. Cartão “Sistema visual”: 4 cores, “Aa” em Cormorant e Jost, e “Sinais de confiança” (responsável técnica, duração da avaliação, horários reais).
  4. **Chama** — celular com o site mobile, cartão “Novo pedido de avaliação” (interesse, horário, origem “Anúncio no Google”) e cartão de lembrete “Instagram”.
  - Os cartões flutuantes (300 px) ficam em `right: −28px; bottom: 0` e entram com atraso de .15 s.
- Dica “Role para avançar” (mouse desenhado com rodinha animada) no rodapé do bloco; some na última etapa e no celular.

**Celular/tablet (< 1100):** rótulo, H2 28 px (36 px no tablet), **4 abas com barra de progresso** (a ativa preenche conforme `--sub`), celular de 195 × 404 com as mesmas 4 cenas em versão mobile, cartões flutuantes de 178 px e texto curto de cada etapa (troca com fade + 12 px). A composição escala por `--jm` para caber na altura (até 1,4× no tablet).

### 6.4 Serviços
- Título “O site é o centro. O resto trabalha para ele.” (máx. 820 px).
- Grade 5 / 1 / 6:
  - **Órbita** (520 px; 280 px no celular): halo radial menta, anel interno tracejado, anel externo que **gira em 90 s** com quatro nós menta e os rótulos SEO local, Google Ads, Meta Ads e Manutenção (que giram ao contrário para ficarem sempre de pé). No centro, círculo `--uno-pine` “Site / sob medida” com anel que pulsa (3,2 s). Legenda abaixo.
  - **Lista** de 5 serviços separados por linhas de 1 px: nome (24 px) + modelo de cobrança à direita (“Projeto · a partir de R$ 1.490”, “Mensal”, “Mensal · mídia à parte”, “Plano mensal”) + descrição.

### 6.5 Por baixo do capô
- Grade 5 / 1 / 6. Texto: “Engenharia que você não vê — e o Google sente.” e a ressalva “São metas de projeto… não promessas de resultado”.
- **Terminal** (fundo `--uno-pine-deep`, raio 22 px, Plex Mono 13,5 px): cabeçalho “unolabs / checklist-de-entrega” e status “pronto para publicar”; comando `$ uno entrega --verificar`; **8 itens com ✓** que aparecem em cascata (.5 s cada, atraso de 0,1 a 1,15 s) quando o terminal entra na tela; cursor piscando no fim.
- Os itens são uma lista acessível (`role="list"`); o comando e o cursor são decorativos.

### 6.6 Estudos de direção
- Abertura: “Três negócios. Três expressões. Nenhum modelo pronto.” + ressalva “Não são clientes: são a régua do que entregamos.”
- Três **capítulos de largura total**, cada um com a cor do próprio negócio (não da UNO Labs), alternando o lado da imagem:
  - Texto (4/12): meta em caixa alta com espaçamento largo, nome 52 px, selo “Estudo conceitual”, e dois itens (Objetivo / Decisão em destaque).
  - Composição (8/12; fixa em 820 × 560 e escalada): janela de desktop de 760 px (barra de 30 px + site em 760 × 475) e celular de 196 × 406 sobreposto no canto inferior. No celular (< 600 px), só o celular, maior (236 × 492).
- Os sites dos estudos combinam HTML, imagens conceituais e geometria técnica em SVG, com fontes e paletas próprias, e **ficam em seis `<template>`**: cada versão desktop/celular contém exclusivamente a composição final aprovada pelo humano (Módulo: Projeto, Atria: Detalhe, Casa Noma: Imersivo; as nove direções anteriores permanecem no histórico do Git). O `site.js` só os copia para a página quando o espaço se aproxima da tela. Os blocos recebem `aria-hidden`, `inert` e `data-nosnippet`; os controles internos são demonstrativos, e o texto fictício fica fora da leitura de tela, do foco do teclado e dos trechos do Google.
- **Composições finais aprovadas:** as variações foram fixadas sem seletores manuais nos capítulos da home, unificando a direção em todas as instâncias (capítulos desktop e celular, Casa Noma no hero e Atria na jornada). As sequências dos três estudos em ambas as versões (desktop e celular) têm duração calculada de exatamente 4,00 s de tempo visível real, com efeitos contínuos e sem pausa ociosa. O disparo só ocorre quando o visitante atinge exposição significativa da cópia: pelo menos metade do modelo na área útil visível, descontando o cabeçalho fixo no topo, considerando clipping de ancestrais e adaptando para telas baixas onde o modelo excede a altura útil (garantindo que nunca fique impossibilitado de animar). O pré-carregamento 800 px antes apenas monta o DOM sem iniciar o movimento. Ao perder a exposição ou ocultar o documento, a animação pausa e retoma do ponto em que parou sem consumir os 4 s enquanto oculta. Cada capítulo conta com um botão acessível “Rever animação” (≥ 44 px, foco visível e anúncio `aria-live`) que reinicia, sem recriar o DOM, somente cópias com exposição significativa na tela. Na jornada, a cópia também precisa pertencer a uma etapa ativa; cenas futuras aguardam até sua etapa ativa e exposição. A sequência termina quando acabam os efeitos CSS finitos declarados (4,00 s), e a classe de execução sai para revelar o layout estático. Com `prefers-reduced-motion: reduce` ou classe `.rm`, somente o movimento dos estudos é cancelado e o botão informa o estado; quando a preferência do sistema volta ao normal e `.rm` não está ativa, o replay pode ser usado novamente. Sem suporte a `IntersectionObserver` ou à sincronização dos efeitos, os estudos ficam estáticos e o botão informa essa limitação. Os estilos ficam delimitados em `public/assets/css/conceitos.css`.

#### Estudo 01 · Módulo Engenharia (engenharia industrial B2B)
- **Fundo** `#E8E6E1` na seção; site em `#0E1114` com grade técnica, laranja de sinalização `#F2552C`, cinzas `#9AA3AB` e `#ECEAE4`.
- **Tipografia:** Archivo (eixo de largura 62–125, títulos em caixa alta condensados) + IBM Plex Mono (cotas e ficha).
- **Composição aprovada (Projeto):** tipografia condensada à esquerda, imagem de estrutura industrial à direita e cotas geométricas com marcas laranja e etiquetas técnicas. “Estrutura é projeto antes de ser obra.” mantém o destaque laranja. CTA de proposta técnica e valores ilustrativos permanecem demonstrativos; nenhuma obra executada é atribuída à UNO.
- **Decisão em destaque:** imagem conceitual estrutural com cotas e ficha no lugar de adjetivos.

#### Estudo 02 · Atria Clinic (dermatologia estética)
- **Fundo** `#2E211C` na seção; site em creme `#F4EDE7`, marrom `#2E211C`, terracota `#7A4A3A`, pêssego `#E3B9A4`.
- **Tipografia:** Cormorant Garamond (títulos, com itálico) + Jost (textos).
- **Composição aprovada (Detalhe):** faixa fotográfica horizontal em close, conteúdo editorial e grade de agendamento abaixo. No celular, foto de borda a borda e agendamento em linha. “Cuidado que começa na conversa.”, avaliação de 50 min e linha de responsável técnica permanecem visíveis.
- **Decisão em destaque:** calma e segurança; nada de promessa estética.

#### Estudo 03 · Casa Noma (restaurante autoral)
- **Fundo** `#E9DFCF` na seção; site em `#110E0B` com creme `#F0E6D6`, âmbar `#E0A84E`, oliva `#6F7D3C` e vermelho `#C4492F`.
- **Tipografia:** Bodoni Moda (títulos, com itálico) + Manrope (textos).
- **Composição aprovada (Imersivo):** imagem ocupando a atmosfera de fundo com gradiente sutil, tipografia Bodoni e reserva em faixa na base. No celular, foto de topo com gradiente vertical e cartão de reserva integrado. “Fogo baixo, mesa longa.” e os pratos do estudo continuam sendo conteúdo conceitual. É o mesmo estudo usado no palco do hero.
- **Decisão em destaque:** atmosfera + reserva sem sair da primeira tela. É o mesmo estudo usado no palco do hero.

**Imagens — refinamento de 30/09/2026:** geradas pelo ImageGen integrado, usadas exclusivamente como material dos estudos fictícios. Não documentam pessoas, clientes, pratos ou obras reais. Arquivos em `public/assets/img/conceitos/{modulo,atria,casanoma}.webp`, 1536 × 1024 px, cerca de 571 KB no total. Os prompts completos estão nos respectivos arquivos `.webp.json`. A otimização para WebP preserva dimensões e composição; cada `img` declara dimensões e `decoding="async"`.

Referências técnicas: [padrão de botão básico, W3C](https://www.w3.org/WAI/ARIA/apg/patterns/button/), [guia de animações, web.dev](https://web.dev/articles/animations-guide), [Element.getAnimations(), MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations), [prefers-reduced-motion, MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) e [dimensões e decodificação de imagens, MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img).

### 6.7 Como trabalhamos
- Cabeçalho 7 / 5. Lista ordenada de 4 passos (4 colunas no desktop, 2 no tablet, 1 no celular), cada um com linha superior de 1 px e um ponto menta sobre ela, número em Plex Mono, H3, descrição e **“Entrega:”** do passo.
- Caixa tracejada abaixo: “Depois, se fizer sentido: evoluir.” + mensais contratados à parte.

### 6.8 Investimento
- Cartão escuro de raio 34 px com grade de 48 px e dois círculos decorativos no canto superior direito.
- Esquerda: “Projetos a partir de” / **R$ 1.490** (120 px) / “em até 10x sem juros” em menta / explicação da proposta fechada / botão menta “Pedir minha proposta”.
- Direita: três blocos separados por linha — “O que define o valor” (lista com traço menta), “Garantia” e “Serviços mensais”.

### 6.9 Para quem / Onde
- Esquerda (7/12): título médio, parágrafo e **lista de 5 segmentos** em linhas (nome 24 px à esquerda, motivo à direita — o motivo some no celular).
- Direita (4/12): cartão branco “Onde atendemos” com três locais e ícones de pino/globo. Reforça o SEO local sem página falsa de cidade.

### 6.10 Equipe
- Três colunas separadas por linhas verticais: círculo de 96 px com iniciais, nome 26 px, função e formação (marcadas como pendentes). No celular, vira lista com avatar de 60 px à esquerda.
- Quando houver fotos: retratos reais, mesmo enquadramento e tratamento, 96 px no desktop.

### 6.11 Blog
- Fundo `--uno-off-white-2`. Cabeçalho com texto à direita: “Os primeiros artigos estão em produção.”
- Grade 7 / 5: um cartão grande (guia de preço) e dois menores (comparativo e SEO local). Todos com selo **“Em breve”** e **sem link** — nenhum link quebrado ou página vazia indexada.

### 6.12 Dúvidas
- Grade 4 / 1 / 7; a coluna do título fica presa (`sticky`) enquanto as perguntas rolam.
- 9 perguntas em `<details>` nativos (a primeira aberta), sinal “+” que gira 45° ao abrir. Espelhadas no JSON-LD `FAQPage`.

### 6.13 Contato
- Fundo `--uno-off-white-2`. Esquerda (5/12): título médio, parágrafo e canais diretos (WhatsApp, e-mail) em linhas com seta diagonal — ocultos até serem preenchidos.
- Direita (6/12): cartão branco com o formulário:
  - Nome, Empresa, WhatsApp ou e-mail, Site atual (opcional) em duas colunas; “Do que você precisa?” em pílulas com caixa de seleção; “O que você quer construir ou melhorar?” (área de texto com ajuda); “Investimento previsto” (faixas até R$ 3 mil, 3–6, 6–10, acima de 10, não definido).
  - Campo-armadilha invisível para robôs; espaço opcional para o Turnstile.
  - Rodapé do formulário: nota de uso de dados com link para a política + botão “Enviar contexto do projeto”.
  - Estados: erro por campo (borda vermelha, mensagem, `aria-invalid`, foco no primeiro erro), aviso geral, “Enviando…”, **sucesso só com confirmação do servidor** (ícone ✓, “Recebemos suas informações.”, botão “Enviar outro pedido”) e **falha recuperável** (os dados ficam no formulário).

### 6.14 Rodapé
- Grade 4 / 1 / 2 / 2 / 3: logo 60 px + assinatura “Presença digital que gera oportunidades.”; Navegação; Serviços; Atendimento (cidades). Linha final com © (ano automático) e link da política. No celular, duas colunas.

### 6.15 Páginas auxiliares
- `/politica-de-privacidade/`: texto específico do fluxo real (formulário → servidor → n8n → Telegram e e-mail), operadores citados, base legal LGPD, direitos, guarda. Trechos a preencher destacados em amarelo.
- `/404.html`: título “Esta página não existe — ou mudou de lugar.”, botões para o início e o contato, `noindex`.

---

## 7. Movimento

| Nome | Onde | Duração / curva | O que faz |
|---|---|---|---|
| `sobe` | Linhas do H1 | 1 s, `cubic-bezier(.16,.84,.2,1)` | Texto sobe de dentro de uma máscara |
| `aparece` | Blocos do hero | .9 s ease, atrasos .35/.5/.6 s | Opacidade 0→1 e 16 px para cima |
| `revela` | Palco do hero | 10 s, `cubic-bezier(.65,0,.35,1)`, infinito | `clip-path` revela o site sobre o desenho técnico |
| `varre` | Palco do hero | 10 s, mesma curva | Linha menta com brilho acompanha a revelação |
| `st1` / `st2` | Selo do palco | 10 s linear | Alterna “Projeto técnico” ↔ “Site publicado” |
| `pisca` | Cursores | 1,1 s `steps(1)` | Cursor de terminal |
| `pulso` | Ponto “encontrado” e centro da órbita | 2,4 s / 3,2 s | Anel que expande 2,8× e some |
| `gira` | Órbita de serviços | 90 s linear | Anel gira; rótulos giram ao contrário |
| `rola` | Dica da jornada | 1,6 s | Rodinha do mouse desce 6 px |
| Jornada | Cenas, detalhes, cartões | .6 s / .5 s / .45 s | Crossfade e expansão controlados pela rolagem |
| Terminal | Itens ✓ | .5 s cada, cascata até 1,15 s | Entram uma vez, quando visíveis |
| `levita` | Cartões e maquetes | .3 s | Sobem 4 px no hover |
| Movimento autoral dos estudos | Módulo, Atria, Noma | Finita (~4 s reais; exatamente 4,00 s calculados nas 6 versões desk/mob) | Inspeção estrutural em Módulo (cotas, marcas e cascata de serviços no desktop; traçado técnico contínuo no celular com CTA sempre legível), abertura editorial em Atria (máscara de faixa, respiração da foto e confirmação de agenda), acomodação cinematográfica e luz âmbar em Casa Noma; disparo somente sob exposição significativa (≥50% na área útil sem header), pausa fora da tela e conclusão sem pausa ociosa |

**Regras:** nada se move sem explicar algo; nenhum movimento automático bloqueia a leitura; com `prefers-reduced-motion: reduce`, todas as animações e transições são desligadas, o palco mostra direto o site publicado e a jornada deixa de ficar presa.

---

## 8. Responsividade

| Faixa | Comportamento principal |
|---|---|
| ≥ 1280 | Layout de referência. Composições em escala 1 |
| 1100–1279 | Mesmo layout; base do hero em 2 colunas; composições escalam proporcionalmente |
| 768–1099 | Menu de celular; palco do hero em versão celular (até 420 px); jornada em versão celular ampliada (até 1,4×); estudos com janela + celular |
| 600–767 | Cabeçalho de 64 px; colunas empilhadas |
| < 600 | Fatos do hero em linhas; botões de largura total; estudos só com celular; órbita de 280 px; segmentos sem descrição |

**Sistema de escala (`.escala`):** toda maquete com posicionamento absoluto é desenhada num tamanho-base fixo (`--bw` × `--bh`) e reduzida/ampliada com `transform: scale(--s)`, onde `--s = largura disponível / --bw` (calculado por `ResizeObserver`). O contêiner reserva a altura com `aspect-ratio`, então **não há salto de layout (CLS)**. Assim a composição fica idêntica em qualquer largura, sem refazer posições por breakpoint.

---

## 9. Acessibilidade (meta WCAG 2.2 AA)
- Estrutura: um único H1; H2 por seção com `aria-labelledby`; `main`, `nav`, `header`, `footer`, `aside`; link para pular ao conteúdo.
- Contraste: texto secundário em `#355048` sobre off-white; menta nunca como texto em fundo claro.
- Teclado: foco visível de 3 px; menu fecha com Esc; etapas da jornada são botões (`aria-current="step"` na ativa); detalhes inativos com `aria-hidden`.
- Maquetes: `role="img"` com descrição (hero) ou `aria-hidden` + `inert` (estudos, palco da jornada) — o conteúdo real está sempre em texto.
- Formulário: rótulos visíveis, mensagens ligadas por `aria-describedby`, `aria-invalid`, aviso com `role="alert"`, foco no título de sucesso.
- Movimento reduzido respeitado (seção 7). Sem JavaScript, todo o texto continua acessível.

---

## 10. SEO
- **Title:** “Criação de Sites, SEO e Google Ads em Vitória e Vila Velha | UNO Labs”. **Description** com serviços, região e preço.
- `canonical`, `robots`, Open Graph e Twitter Card com imagem 1200 × 630 (`og-unolabs.png`).
- **JSON-LD** (`@graph`): `Organization` (fundadores, `areaServed` com as 5 cidades + Brasil, `OfferCatalog` com os 5 serviços e preço mínimo), `WebSite`, `WebPage` e `FAQPage`. Endereço e telefone só entram quando existirem (sem dados inventados). Observação: o Google restringiu o resultado avançado de FAQ a sites de governo e saúde desde 2023; o `FAQPage` fica pela clareza semântica, não por promessa de destaque.
- HTML semântico, cidades citadas em texto real (não só em imagem), textos das maquetes fora do índice (`<template>` + `data-nosnippet`).
- `robots.txt`, `sitemap.xml`, URLs limpas com barra final (`/politica-de-privacidade/`), página 404 com `noindex` e status 404 real.
- Blog: cartões sem link até existirem artigos (evita páginas finas).

---

## 11. Performance (metas: LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1)
- Zero framework, zero dependência no navegador, zero script de terceiros no carregamento (o Turnstile, se ligado, só carrega perto do formulário).
- Fontes auto-hospedadas; só a Inter é pré-carregada (`preload`). As fontes dos estudos só baixam quando os estudos são desenhados.
- Estudos clonados sob demanda (`IntersectionObserver`, margem de 800 px) e **nunca** quando o espaço está oculto (`display: none`) — o celular não carrega as maquetes do desktop.
- Capítulos dos estudos com `content-visibility: auto`.
- Escuta de rolagem passiva + `requestAnimationFrame`; o DOM só é alterado quando a etapa muda.
- Cache: fontes por 1 ano (`immutable`), imagens e ícones por 30 dias, CSS/JS por 1 dia com `stale-while-revalidate` e versão na URL (`?v=1`).

---

## 12. Arquitetura técnica

### 12.1 Por que HTML estático agora (e Astro depois)
A stack aprovada é **Astro 7 + Cloudflare Workers**. Para lançar rápido, a v1 foi entregue como HTML estático puro — o resultado publicado é o mesmo que o Astro geraria para uma página única, sem exigir build nem Node para editar texto. Quando houver 4–6 artigos prontos, migra-se para Astro (componentes, coleções de conteúdo para o blog, RSS), reaproveitando `site.css`, `site.js` e o Worker praticamente sem mudanças (decisão D28).

### 12.2 Arquivos
Ver árvore completa no `LEIA-ME.md` da pasta `04 - SITE`. Pontos-chave:
- `public/index.html` — todo o conteúdo; ao final, 6 `<template>` (`tpl-casanoma-desk/mob`, `tpl-atria-desk/mob`, `tpl-modulo-desk/mob`).
- `public/assets/css/site.css` — um só arquivo, organizado por seção, com tokens no `:root`. Nomes de classes em português (`.topo`, `.jornada`, `.capitulo`, `.invest-cartao`…).
- `public/assets/js/site.js` — 8 módulos: escala proporcional, estudos sob demanda, luz do hero, jornada, terminal, menu, formulário e ano do rodapé.
- `worker/index.js` + `wrangler.jsonc` — Worker e configuração.
- `hospedagem-tradicional/` — `.htaccess` e `api/contato.php` equivalentes para Apache/PHP.

### 12.3 Clonagem dos estudos
Cada espaço reservado é `<div class="estudo estudo--desk|mob" data-estudo="atria-desk" style="--e:0.55625">`. O `site.js` copia o `<template>` correspondente, **renomeia todos os `id` internos com um sufixo único** e corrige as referências `url(#…)` (gradientes e filtros SVG), porque o mesmo estudo aparece várias vezes na página. O fator `--e` é a razão entre a janela e o tamanho-base do estudo (ex.: 712/1280 = 0,55625). O pré-carregamento 800 px antes monta o DOM sem iniciar o movimento. A animação só dispara quando o visitante atinge exposição significativa (≥50% do modelo na área útil sem cabeçalho fixo, adaptado para telas baixas), executando 4,00 s reais nas seis maquetes e pausando/retomando com a rolagem.

### 12.4 Estado da jornada no DOM
`section.jornada[data-passo]`; elementos com `data-etapa="0–3"` recebem `.is-ativo` / `.is-feito`; `--sub` fica no elemento ativo; `--je` na grade do desktop e `--jm` na composição do celular. Toda a aparência sai do CSS.

---

## 13. Formulário e backend
Fluxo: **navegador → `POST /api/contato` (JSON) → Worker (ou PHP) → webhook do n8n → Telegram (bot privado) + e-mail (SMTP HostGator)**.

Validação no servidor: origem permitida (cabeçalho `Origin`), `Content-Type` JSON, corpo ≤ 16 KB, limpeza de caracteres de controle e limite por campo, listas fechadas para serviços e faixas de investimento, nome/empresa ≥ 2 caracteres, canal = e-mail válido ou ≥ 10 dígitos, contexto ≥ 10 caracteres. Campo-armadilha preenchido → responde sucesso e descarta. Turnstile obrigatório se a chave secreta existir. Chamada ao n8n com o token `X-Uno-Token` e tempo-limite de 10 s.

Respostas: `200 {ok:true}`, `422` (campos), `403` (origem/Turnstile), `400/413/415` (malformado), `502` (n8n falhou), `503` (não configurado). O navegador só mostra sucesso com `200` + `ok: true`; no n8n, o webhook deve responder “When Last Node Finishes” para que o sucesso signifique aviso entregue.

Testes feitos: 11 cenários do Worker (rotas, 404, redirecionamento de barra, origem, validação, armadilha, método, cabeçalhos) e 4 do PHP, com um n8n simulado; ponta a ponta no navegador (erros de validação, sucesso, falha com dados preservados).

---

## 14. Hospedagem
- **Cloudflare Workers com Static Assets** (não Pages, que a própria Cloudflare hoje orienta a trocar por Workers em projetos novos). `assets.directory = ./public`, `not_found_handling = "404-page"`, `html_handling = "auto-trailing-slash"`. Os arquivos estáticos são servidos antes do Worker e não consomem a cota de requisições; só o formulário passa pelo Worker.
- Domínios `unolabs.com.br` e `www` como *custom domains*; `www` redireciona para o domínio principal por Redirect Rule.
- E-mail na HostGator com DNS na Cloudflare (MX para a HostGator, `mail` sem proxy, SPF/DKIM/DMARC; sem Email Routing).
- Passo a passo completo no `LEIA-ME.md`.

---

## 15. Histórico de decisões e iterações

| Momento | O que mudou | Por quê |
|---|---|---|
| Rodada 1 | Stack, análise da documentação e 20 perguntas antes de desenhar | Evitar construir sobre premissas erradas |
| Rodada 2 | Headline, preço, garantia, equipe, cidades, canais e formulário definidos | Respostas do usuário |
| Rodada 2 | Três escopos tipográficos (A Newsreader + Inter, B Schibsted Grotesk + Inter, C Inter) | Usuário manteve Inter e quis comparar |
| Rodada 3 | Jornada: abas clicáveis → **presa na tela durante a rolagem** | “Pareceu muito pouco profissional ter que ficar clicando” |
| Rodada 3 | Estudos refeitos com conceito próprio e animação (desenho que se traça, pérola, mesa girando) | “Achei extremamente simples… seja disruptivo” |
| Rodada 3 | Hospedagem: Cloudflare **Workers**, não Pages | Verificado na documentação oficial |
| Rodada 4 | Jornada redesenhada | A versão anterior parecia “mal feita”: caixas e etiquetas de depuração sobre o site, faixas de 12 colunas turvas, trilho de progresso cruzando nós translúcidos, texto duplicado e conteúdo cortado em telas baixas. Solução: lista de etapas com nós opacos e preenchimento por trecho, cenas limpas com anéis de destaque e cartões explicativos, grade fina a 38% de opacidade, coluna esquerda com altura fixa e escala por altura da tela |
| Rodada 5 | Versão publicável | HTML estático + Worker + PHP; fontes auto-hospedadas; política de privacidade específica; testes em 360, 390, 834, 1100 e 1440 px, sem JS e com movimento reduzido |

---

## 16. Critérios de aceite (para avaliar esta ou outra versão)

**Mensagem e conteúdo**
- [ ] H1 exato: “Presença digital que atrai clientes.”
- [ ] Preço “a partir de R$ 1.490 em até 10x sem juros” visível no hero e no investimento.
- [ ] Nenhuma promessa de resultado garantido; FAQ nega garantia de primeira posição.
- [ ] Estudos rotulados como conceituais; nenhum depoimento, logo de cliente ou número inventado.
- [ ] Cidades (Vitória, Vila Velha, Serra, Cariacica, Curitiba) em texto real.

**Visual**
- [ ] Paleta restrita aos tokens da seção 4.1; menta nunca como texto sobre fundo claro.
- [ ] Inter com `cv11`; Plex Mono só em dados técnicos.
- [ ] Grade de 12 colunas com composições assimétricas; nada de três cartões iguais com ícone.
- [ ] Hero com demonstração “desenho técnico → site → encontrado na busca”.
- [ ] Nenhum item da lista “não usar” da seção 3.3.

**Interação**
- [ ] Jornada fica presa na tela e avança 4 etapas com a rolagem nativa, sem pular conteúdo em telas de 620 px de altura.
- [ ] Clique na etapa leva até ela; movimento reduzido transforma em abas.
- [ ] Formulário só mostra sucesso com confirmação do servidor e preserva os dados em caso de falha.

**Técnico**
- [ ] Sem rolagem horizontal de 320 a 1920 px.
- [ ] Um H1; H2 por seção; foco visível; navegação completa por teclado.
- [ ] JSON-LD válido; `canonical`, OG, `sitemap.xml`, `robots.txt`, 404 com status 404.
- [ ] Nenhuma requisição a terceiros no carregamento inicial.
- [ ] PageSpeed (celular) com LCP ≤ 2,5 s, CLS ≤ 0,1.
- [ ] Funciona e mostra todo o texto sem JavaScript.

---

## 17. Pendências (antes e depois de publicar)
- Prazo da garantia ([X] dias) e prazo típico do projeto ([X] semanas).
- Funções e formação da equipe; depois, fotos.
- WhatsApp comercial e e-mail do domínio (HTML e JSON-LD).
- Política de privacidade: responsável, e-mail, onde roda o n8n, prazo de guarda, data; revisão jurídica.
- Bot do Telegram e fluxo do n8n.
- Turnstile (opcional, recomendado quando começar a chegar spam).
- CNPJ e Perfil da Empresa no Google (quando existirem, acrescentar endereço/telefone ao JSON-LD).
- Instagram e LinkedIn (`sameAs`).
- Cases reais com autorização (ex.: La Bella Mesa) substituindo ou somando-se aos estudos.
- 4–6 artigos pilares do blog e migração para Astro (D28).
- Cloudflare Web Analytics (sem cookies), previsto na §0.8: ao ativar, atualizar a política de privacidade.

---

## 18. Prompt pronto para outras IAs

Copie o texto abaixo e anexe: este documento, `UNO_Labs_Documentacao_Completa.md`, os arquivos de `01 - IDENTIDADE VISUAL` (logos SVG, favicons, paleta) e, se quiser, as capturas de `referencias-visuais/`.

```text
Você é um web designer e desenvolvedor front-end sênior, com 20 anos de experiência em sites que vendem serviços B2B.

Tarefa: construir a home de vendas da UNO Labs (unolabs.com.br), pronta para publicar.

Leia primeiro os documentos anexados, nesta ordem:
1. UNO_Labs_Documentacao_Completa.md — a Parte 0 prevalece sobre o resto.
2. UNO_Labs_Construcao_do_Site.md — descreve uma versão já construída: conceito, sistema visual, seções, texto exato (Apêndice A), movimento, responsividade, acessibilidade, SEO e critérios de aceite (seção 16).

Regras:
- Use exatamente as decisões de negócio (preço, garantia, cidades, serviços, equipe, headline). Não invente depoimentos, números, clientes, endereço ou telefone.
- Mantenha a identidade visual (tokens da seção 4). Você pode propor outra direção criativa, mas ela precisa transmitir autoridade, capacidade e profissionalismo e não pode ter “cara de IA” (ver seção 3.3).
- Obrigatório: seção “Da busca ao contato” presa na tela durante a rolagem, com 4 etapas; estudos conceituais claramente rotulados; formulário honesto (sucesso só com confirmação do servidor).
- Entregue HTML, CSS e JS sem framework (ou Astro, se preferir), responsivo de 320 a 1920 px, com meta WCAG 2.2 AA, SEO técnico completo (title, description, canonical, Open Graph, JSON-LD, sitemap, robots) e metas Core Web Vitals (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1).
- Hospedagem-alvo: Cloudflare Workers com Static Assets; o formulário faz POST JSON para /api/contato, que repassa a um webhook do n8n.
- Escreva todo o texto em português do Brasil, no tom descrito na seção 2.

Ao final, avalie a sua própria entrega item a item contra a seção 16 e liste o que ficou de fora e por quê.
```

---

## 19. Referências visuais
Pasta `docs/referencias-visuais/` (capturas da versão publicada, 1440 × 900 e 390 × 844):

- `desktop-01-hero.png` · `desktop-01a…01d-jornada-etapa-1…4.png`
- `desktop-02-servicos.png` · `desktop-03-por-baixo-do-capo.png`
- `desktop-04-projetos-abertura.png` · `desktop-05-estudo-modulo.png` · `desktop-06-estudo-atria.png` · `desktop-07-estudo-casa-noma.png`
- `desktop-08-processo.png` · `desktop-09-investimento.png` · `desktop-10-para-quem.png` · `desktop-11-equipe.png` · `desktop-12-blog.png` · `desktop-13-duvidas.png` · `desktop-14-contato.png` · `desktop-15-rodape.png`
- As mesmas telas com prefixo `celular-`.

---

## Apêndice A — Texto exato de cada seção

Extraído automaticamente de `public/index.html`. Formato: `tag` _(contexto)_: texto. Itens marcados como _ilustração_ são texto das maquetes (não lidos por leitores de tela). Marcadores `[X]` e `[Função no time]` são pendências.

### Cabeçalho
- `a`: Serviços
- `a`: Projetos
- `a`: Abordagem
- `a`: Blog
- `a`: Contato
- `a`: Conversar sobre meu projeto
- `a`: Serviços
- `a`: Projetos
- `a`: Abordagem
- `a`: Blog
- `a`: Contato
- `a`: Conversar sobre meu projeto

### Presença digital que atrai clientes. (`#topo`)
- `p`: Criação de sites · SEO local · Google Ads · Meta Ads
- `h1`: Presença digital que atrai clientes.
- `p`: Sites profissionais, SEO local e anúncios no Google e no Meta para empresas que querem ser encontradas com facilidade — e escolhidas com confiança.
- `a`: Conversar sobre meu projeto
- `a`: Ver estudos de projeto
- `dt`: A partir de R$ 1.490
- `dd`: em até 10x sem juros
- `dt`: Presencial
- `dd`: Grande Vitória e Curitiba
- `dt`: Um só time
- `dd`: site, SEO e anúncios
- `div` _(palco desktop, ilustração)_: Estudo conceitual · Casa Noma Projeto técnico Site publicado
- `div` _(palco desktop, ilustração)_: seo / casa-noma Schema.org
- `div` _(palco desktop, ilustração)_: <title> Casa Noma · Vitória, ES </title>
- `div` _(palco desktop, ilustração)_: <meta name = "description"
- `div` _(palco desktop, ilustração)_: content = "Menu de estação e reservas" >
- `div` _(palco desktop, ilustração)_: {
- `div` _(palco desktop, ilustração)_: "@type" : "Restaurant",
- `div` _(palco desktop, ilustração)_: "servesCuisine" : "Brasileira",
- `div` _(palco desktop, ilustração)_: "areaServed" : "Vitória, ES"
- `div` _(palco desktop, ilustração)_: }
- `div` _(palco desktop, ilustração)_: restaurante para jantar em vitória
- `div` _(palco desktop, ilustração)_: Casa Noma › reservas Casa Noma — Cozinha de estação em Vitória Menu de estação e reservas on-line. Ter a sáb, 19h às 23h30.
- `div` _(palco desktop, ilustração)_: Encontrado na busca local
- `div` _(palco celular, ilustração)_: seo / casa-noma Schema.org
- `div` _(palco celular, ilustração)_: <title> Casa Noma · Vitória, ES </title>
- `div` _(palco celular, ilustração)_: "@type" : "Restaurant",
- `div` _(palco celular, ilustração)_: "areaServed" : "Vitória, ES"

### Antes de ligar, seu cliente pesquisa. (`#abordagem`)
- `p` _(desktop)_: Da busca ao contato
- `h2` _(desktop)_: Antes de ligar, seu cliente pesquisa.
- `p` _(desktop)_: São quatro momentos. Em cada um, uma parte do nosso trabalho entra em ação.
- `button` _(desktop)_: 01 Encontra
- `h3` _(desktop)_: Ser encontrado por quem já está procurando.
- `p` _(desktop)_: Quem pesquisa um serviço na sua cidade está perto de contratar. O anúncio coloca sua empresa no topo hoje; o SEO constrói uma posição que se acumula.
- `div` _(desktop)_: Google Ads SEO local
- `button` _(desktop)_: 02 Entende
- `h3` _(desktop)_: Ser entendido em cinco segundos.
- `p` _(desktop)_: A primeira tela precisa responder o que é, para quem é e qual o próximo passo. Se o visitante precisa decifrar, ele volta para a busca.
- `div` _(desktop)_: Site sob medida Arquitetura de conteúdo
- `button` _(desktop)_: 03 Confia
- `h3` _(desktop)_: Passar confiança antes da conversa.
- `p` _(desktop)_: Visual coerente e as informações que o cliente procura — quem é o responsável, como funciona, quanto tempo leva — fazem a empresa parecer tão séria quanto é.
- `div` _(desktop)_: Direção visual Conteúdo
- `button` _(desktop)_: 04 Chama
- `h3` _(desktop)_: Transformar interesse em contato.
- `p` _(desktop)_: Agendamento em poucos toques, aviso imediato para a sua equipe e um lembrete para quem ainda está decidindo.
- `div` _(desktop)_: Formulário integrado Meta Ads
- `div` _(ilustração, desktop)_: Demonstração conceitual · Atria Clinic 01 / 04
- `div` _(ilustração, desktop)_: clínica de estética em vitória
- `div` _(ilustração, desktop)_: A Atria Clinic Patrocinado · avaliação
- `div` _(ilustração, desktop)_: Dermatologia estética em Vitória | Atria Clinic Avaliação individual e protocolos explicados sem pressa. Agende on-line.
- `div` _(ilustração, desktop)_: A Atria Clinic blog › primeira consulta
- `div` _(ilustração, desktop)_: Avaliação de pele em Vitória: como funciona a primeira consulta
- `div` _(ilustração, desktop)_: Novo pedido de avaliação agora · enviado pelo site
- `div` _(ilustração, desktop)_: Interesse Avaliação de pele
- `div` _(ilustração, desktop)_: Melhor horário Quinta, 14h00
- `div` _(ilustração, desktop)_: Origem Anúncio no Google
- `div` _(ilustração, desktop)_: LEMBRETE · INSTAGRAM Sua avaliação, no seu tempo. Agendar
- `div` _(ilustração, desktop)_: Teste dos 5 segundos 00:05
- `div` _(ilustração, desktop)_: O que é Dermatologia estética
- `div` _(ilustração, desktop)_: Para quem Quem quer cuidar da pele sem pressa
- `div` _(ilustração, desktop)_: Próximo passo Agendar avaliação
- `div` _(ilustração, desktop)_: Sistema visual
- `div` _(ilustração, desktop)_: Aa Cormorant títulos
- `div` _(ilustração, desktop)_: Aa Jost textos
- `div` _(ilustração, desktop)_: Sinais de confiança Responsável técnica identificada Duração da avaliação: 50 min Horários reais para escolher
- `p` _(celular)_: Da busca ao contato
- `h2` _(celular)_: Antes de ligar, seu cliente pesquisa.
- `button` _(celular)_: Encontra
- `button` _(celular)_: Entende
- `button` _(celular)_: Confia
- `button` _(celular)_: Chama
- `div` _(ilustração, celular)_: estética em vitória
- `div` _(ilustração, celular)_: Patrocinado · Atria Clinic Dermatologia estética em Vitória Avaliação individual. Agende on-line.
- `div` _(ilustração, celular)_: Atria Clinic › blog Avaliação de pele em Vitória: como funciona
- `div` _(ilustração, celular)_: Novo pedido de avaliação Avaliação de pele · quinta, 14h · via Google
- `div` _(ilustração, celular)_: Teste dos 5 s 00:05
- `div` _(ilustração, celular)_: O que é: dermatologia estética Para quem: quem quer cuidar da pele sem pressa Próximo passo: agendar
- `div` _(ilustração, celular)_: Sistema visual
- `div` _(ilustração, celular)_: Responsável técnica Avaliação de 50 min Horários reais
- `h3` _(celular)_: Ser encontrado por quem já está procurando.
- `p` _(celular)_: Anúncio no topo hoje; SEO que se acumula com o tempo.
- `p` _(celular)_: Google Ads · SEO local
- `h3` _(celular)_: Ser entendido em cinco segundos.
- `p` _(celular)_: O que é, para quem é e qual o próximo passo — já na primeira tela.
- `p` _(celular)_: Site sob medida · Arquitetura de conteúdo
- `h3` _(celular)_: Passar confiança antes da conversa.
- `p` _(celular)_: Visual coerente e as informações que o cliente procura.
- `p` _(celular)_: Direção visual · Conteúdo
- `h3` _(celular)_: Transformar interesse em contato.
- `p` _(celular)_: Agendamento em poucos toques e aviso imediato para a equipe.
- `p` _(celular)_: Formulário integrado · Meta Ads
- `div`: Role para avançar

### O site é o centro. O resto trabalha para ele. (`#servicos`)
- `p`: Serviços
- `h2`: O site é o centro. O resto trabalha para ele.
- `div` _(ilustração)_: SEO local Google Ads Meta Ads Manutenção
- `div` _(ilustração)_: Site sob medida
- `figcaption`: Tudo começa pelo site. Os serviços mensais trabalham para levar as pessoas certas até ele.
- `h3`: Sites sob medida
- `div`: Projeto · a partir de R$ 1.490
- `p`: Sites institucionais, landing pages e páginas de serviço, desenhados a partir do que sua empresa precisa comunicar.
- `h3`: SEO local
- `div`: Mensal
- `p`: Estrutura técnica, conteúdo e presença nas buscas da sua cidade, para aparecer quando procuram pelo que você faz.
- `h3`: Google Ads
- `div`: Mensal · mídia à parte
- `p`: Campanhas de pesquisa para estar no topo quando o cliente já está procurando pelo seu serviço.
- `h3`: Meta Ads
- `div`: Mensal · mídia à parte
- `p`: Anúncios no Instagram e no Facebook para ser lembrado por quem ainda está decidindo.
- `h3`: Manutenção e evolução
- `div`: Plano mensal
- `p`: Atualizações, segurança, ajustes de conteúdo e melhorias contínuas depois que o site está no ar.

### Engenharia que você não vê — e o Google sente.
- `p`: Por baixo do capô
- `h2`: Engenharia que você não vê — e o Google sente.
- `p`: Cada entrega sai com a mesma lista técnica. São metas de projeto e itens verificados antes de publicar, não promessas de resultado.
- `div`: unolabs / checklist-de-entrega pronto para publicar
- `div`: $ uno entrega --verificar
- `div`: ✓ HTML semântico + dados estruturados (Schema.org)
- `div`: ✓ Metas Core Web Vitals: LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1
- `div`: ✓ Imagens AVIF/WebP com espaço reservado
- `div`: ✓ Sitemap, canonical e Search Console configurados
- `div`: ✓ Acessibilidade com meta WCAG 2.2 AA
- `div`: ✓ Formulário com anti-spam e aviso imediato à sua equipe
- `div`: ✓ LGPD: dados usados só para responder ao contato
- `div`: ✓ Domínio e acessos em nome da sua empresa
- `div`: $

### Três negócios. Três expressões. Nenhum modelo pronto. (`#projetos`)
- `p`: Estudos de direção
- `h2`: Três negócios. Três expressões. Nenhum modelo pronto.
- `p`: Estudos conceituais criados por nós para mostrar direção, acabamento e comportamento. Não são clientes: são a régua do que entregamos.
- `div`: ESTUDO 01 · ENGENHARIA INDUSTRIAL B2B Estudo conceitual
- `h3`: Módulo Engenharia
- `dt`: Objetivo
- `dd`: Explicar um serviço técnico complexo e gerar pedidos de proposta qualificados.
- `dt`: Decisão em destaque
- `dd`: Desenho técnico que se monta na tela e ficha técnica no lugar de adjetivos.
- `div` _(ilustração)_: Módulo Engenharia · estudo conceitual
- `div`: ESTUDO 02 · DERMATOLOGIA ESTÉTICA Estudo conceitual
- `h3`: Atria Clinic
- `dt`: Objetivo
- `dd`: Transmitir calma e segurança e levar a pessoa até a avaliação.
- `dt`: Decisão em destaque
- `dd`: Arco de luz no lugar de fotos de antes e depois; agenda visível já na primeira tela.
- `div` _(ilustração)_: Atria Clinic · estudo conceitual
- `div`: ESTUDO 03 · RESTAURANTE AUTORAL Estudo conceitual
- `h3`: Casa Noma
- `dt`: Objetivo
- `dd`: Traduzir a atmosfera da casa e transformar vontade em reserva.
- `dt`: Decisão em destaque
- `dd`: Mesa posta girando devagar e reserva em três toques, sem sair da primeira tela.
- `div` _(ilustração)_: Casa Noma · estudo conceitual

### Direção antes da execução. Cuidado até a entrega. (`#processo`)
- `p`: Como trabalhamos
- `h2`: Direção antes da execução. Cuidado até a entrega.
- `p`: Escopo, investimento e prazo ficam definidos na proposta, antes do início. Você sabe o que vai receber e quando.
- `li`: 01
- `h3`: Entender
- `p`: Conversa sobre a empresa, a oferta, o público e o que precisa mudar no digital.
- `p`: Entrega: brief e prioridades
- `li`: 02
- `h3`: Direcionar
- `p`: Estrutura das páginas, mensagem e direção visual, validadas com você antes de construir.
- `p`: Entrega: mapa do site e conceito visual
- `li`: 03
- `h3`: Construir
- `p`: Design e desenvolvimento juntos, pensando o celular desde o início.
- `p`: Entrega: versão navegável para revisão
- `li`: 04
- `h3`: Publicar
- `p`: Revisão final, testes de velocidade e formulários, domínio configurado e site no ar.
- `p`: Entrega: site publicado e acessos documentados
- `p`: Depois, se fizer sentido: evoluir. SEO, anúncios e manutenção mensal, contratados à parte e no seu ritmo.

### Investimento
- `h2`: Investimento
- `p`: Projetos a partir de
- `p`: R$ 1.490
- `p`: em até 10x sem juros
- `p`: O valor final acompanha o escopo. Você recebe uma proposta fechada, com entregas, prazo e investimento, antes de começar.
- `a`: Pedir minha proposta
- `h3`: O que define o valor
- `li`: Quantidade de páginas e seções
- `li`: Organização e produção de conteúdo
- `li`: Direção visual e interações
- `li`: Integrações e formulários
- `h3`: Garantia
- `p`: Por [X] dias após a publicação, corrigimos sem custo qualquer falha no que foi entregue. Novas páginas, mudanças de conteúdo e novas funções entram no plano de manutenção.
- `h3`: Serviços mensais
- `p`: SEO, Google Ads, Meta Ads e manutenção têm escopo e valor próprios. A verba dos anúncios é paga diretamente às plataformas.

### Para empresas que tratam o digital como parte do negócio.
- `p`: Para quem
- `h2`: Para empresas que tratam o digital como parte do negócio.
- `p`: Trabalhamos melhor com quem tem qualidade a mostrar, quer se diferenciar com consistência e participa do projeto com a gente.
- `li`: Arquitetura e interiores portfólio e autoria
- `li`: Engenharia e construção capacidade técnica
- `li`: Clínicas e consultórios confiança e informação
- `li`: Advocacia, contabilidade e consultorias credibilidade
- `li`: Gastronomia e hospitalidade autorais atmosfera e reserva
- `h3`: Onde atendemos
- `div`: Grande Vitória · ES Vitória, Vila Velha, Serra e Cariacica. Atendimento presencial.
- `div`: Curitiba · PR Atendimento presencial.
- `div`: Todo o Brasil Projetos remotos, com reuniões por vídeo.

### Quem conduz o seu projeto.
- `p`: Equipe
- `h2`: Quem conduz o seu projeto.
- `p`: Um time pequeno e direto: quem conversa com você é quem desenha, constrói e acompanha.
- `div`: UL
- `h3`: Urias Loures
- `p`: [Função no time] [Formação e experiência]
- `div`: BG
- `h3`: Bruno Gonzaga
- `p`: [Função no time] [Formação e experiência]
- `div`: MD
- `h3`: Milena Dias
- `p`: [Função no time] Publicidade e Propaganda · UVV

### Conteúdo para decidir melhor. (`#blog`)
- `p`: Blog
- `h2`: Conteúdo para decidir melhor.
- `p`: Guias práticos sobre sites, SEO local e anúncios. Os primeiros artigos estão em produção.
- `p`: Guia Em breve
- `h3`: Quanto custa um site profissional — e o que realmente muda o preço
- `p`: Páginas, conteúdo, direção visual e integrações: o que entra na conta e como comparar propostas diferentes sem cair só no preço.
- `p`: Comparativo Em breve
- `h3`: Site institucional ou landing page: qual sua empresa precisa agora?
- `p`: SEO local Em breve
- `h3`: Como aparecer no Google quando procuram pelo seu serviço em Vitória e Vila Velha

### Perguntas antes de começar. (`#duvidas`)
- `p`: Dúvidas
- `h2`: Perguntas antes de começar.
- `p`: Não encontrou sua dúvida?.
- `a`: Fale com a gente
- `summary`: Quanto custa um projeto?
- `p`: Projetos começam em R$ 1.490, em até 10x sem juros. O valor final depende do número de páginas, do conteúdo, da direção visual e das funcionalidades. Você recebe a proposta fechada antes de começar.
- `summary`: Quanto tempo leva?
- `p`: Depende do escopo e de quando o conteúdo fica pronto. Um projeto típico leva [X] semanas; o prazo exato fica na proposta.
- `summary`: O que a garantia cobre?
- `p`: Por [X] dias após a publicação, corrigimos sem custo qualquer falha no que foi entregue. Novas páginas, mudanças de conteúdo e novas funções ficam no plano de manutenção mensal.
- `summary`: Vocês garantem a primeira posição no Google?
- `p`: Não — e desconfie de quem garante. Entregamos a base técnica, o conteúdo e o acompanhamento que aumentam as chances de sua empresa aparecer nas buscas da sua região.
- `summary`: Como funcionam os anúncios no Google e no Meta?
- `p`: Planejamos, criamos e acompanhamos as campanhas. A verba de mídia é paga diretamente às plataformas e fica separada da nossa gestão.
- `summary`: Vocês ajudam com o conteúdo?
- `p`: Sim. Organizamos a mensagem e a estrutura das páginas. Textos completos, fotos e vídeos podem entrar no escopo, se combinados na proposta.
- `summary`: O site fica no nome da minha empresa?
- `p`: Sim. Domínio e acessos ficam com a sua empresa, e entregamos tudo documentado.
- `summary`: Os projetos mostrados são de clientes reais?
- `p`: Os três estudos desta página são conceituais: criados por nós para mostrar direção e acabamento. Cases de clientes serão publicados com autorização.
- `summary`: Atendem fora do Espírito Santo e de Curitiba?
- `p`: Sim. Atendemos todo o Brasil de forma remota. Na Grande Vitória e em Curitiba, também presencialmente.

### Sua empresa já tem valor. Vamos fazer o digital mostrar isso. (`#contato`)
- `p`: Contato
- `h2`: Sua empresa já tem valor. Vamos fazer o digital mostrar isso.
- `p`: Conte o momento da sua empresa e o que você quer construir. A conversa começa pelo contexto para chegar a uma proposta coerente.
- `a`: Prefere conversar agora? WhatsApp comercial · (DDD) NÚMERO
- `a`: E-mail contato@unolabs.com.br
- `label`: Seu nome
- `div`: Informe seu nome.
- `label`: Empresa
- `div`: Informe o nome da empresa.
- `label`: WhatsApp ou e-mail para retorno
- `div`: Informe um WhatsApp com DDD ou um e-mail válido.
- `label`: Site atual (opcional)
- `legend`: Do que você precisa?
- `label`: Site
- `label`: SEO
- `label`: Google Ads
- `label`: Meta Ads
- `label`: Manutenção
- `label`: O que você quer construir ou melhorar?
- `div`: Conte o objetivo, a situação atual e o que é importante para você. Conte um pouco sobre o projeto.
- `label`: Investimento previsto
- `option`: Selecione
- `option`: Até R$ 3 mil
- `option`: De R$ 3 mil a R$ 6 mil
- `option`: De R$ 6 mil a R$ 10 mil
- `option`: Acima de R$ 10 mil
- `option`: Ainda não definido
- `label` _(ilustração)_: Deixe este campo em branco
- `p`: Usamos seus dados apenas para responder a este contato..
- `a`: Política de privacidade
- `button`: Enviar contexto do projeto
- `h3`: Recebemos suas informações.
- `p`: Obrigado por compartilhar o contexto do projeto. Vamos responder pelo canal que você indicou.
- `button`: Enviar outro pedido

### Rodapé
- `p`: Presença digital que gera oportunidades.
- `div`: Navegação
- `a`: Serviços
- `a`: Projetos
- `a`: Abordagem
- `a`: Blog
- `a`: Contato
- `div`: Serviços
- `a`: Criação de sites
- `a`: SEO local
- `a`: Google Ads
- `a`: Meta Ads
- `a`: Manutenção
- `div`: Atendimento Vitória · Vila Velha · Serra · Cariacica — ES Curitiba — PR Todo o Brasil, de forma remota
- `div`: © 2026 UNO Labs · unolabs.com.br
- `a`: Política de privacidade

### Textos das maquetes dos estudos conceituais (`<template>`)

- **tpl-casanoma-desk**: Casa Noma · Menu · Vinhos · A casa · Eventos · Reservar · Cozinha de estação · Vitória, ES · Fogo baixo, · mesa longa. · Um menu autoral que respeita os ciclos da terra, com pratos pensados para partilhar e vinhos naturais selecionados. · i. Pupunha na brasa · ii. Moqueca de banana · iii. Cocada queimada · DATA · Sexta, 03 Out · HORÁRIO · 20h00 · RESERVA · 2 pessoas · Reservar mesa
- **tpl-casanoma-mob**: Casa Noma · Vitória, ES · Fogo baixo, · mesa longa. · Vinhos de pequenos produtores, ingredientes colhidos no tempo certo e reserva sem intermediários. · SEXTA-FEIRA · 20H00 · 2 lugares no salão · Reservar
- **tpl-atria-desk**: Atria · clinic · Tratamentos · A clínica · Equipe médica · Contato · Agendar avaliação · Cuidado natural & atenção individual · Dermatologia estética · Vitória, ES · Cuidado que começa · na conversa. · Avaliação individual, protocolos explicados sem pressa e acompanhamento em cada etapa. · Agendar consulta · Conhecer tratamentos · Responsável técnica: Dra. [Nome] · CRM-ES [número] · Avaliação individual · Duração: 50 min · SEG · 29 · TER · 30 · QUA · 01 · QUI · 02 · SEX · 03 · 09h00 · 10h30 · 14h00 · 16h30 · Agendar para quinta-feira, 14h00
- **tpl-atria-mob**: Atria · clinic · Dermatologia estética · Vitória, ES · Cuidado que começa · na conversa. · Avaliação individual, protocolos explicados sem pressa e acompanhamento em cada etapa. · Avaliação individual · 50 min · Qui, 02 · 14h00 · Agendar · Responsável técnica: Dra. [Nome] · CRM-ES [número]
- **tpl-modulo-desk**: MÓDULO · ENGENHARIA · SERVIÇOS · OBRAS · ENGENHARIA · CONTATO · Proposta técnica · ENGENHARIA INDUSTRIAL · ESPÍRITO SANTO · Estrutura · é · projeto · antes de ser · obra. · Estruturas metálicas, galpões e laudos técnicos para indústrias que não podem parar. Uma equipe responde pelo cálculo, pela obra e pela documentação. · Solicitar proposta técnica · Ver projetos · VÃO LIVRE: 30,00 m · PÉ-DIREITO: 10,00 m · N-14 · X 30.00 · Y 15.00 · Z 13.50 · AÇO ESTRUTURAL ASTM A572 gr. 50 · 01 · Estruturas metálicas · 02 · Galpões industriais · 03 · Laudos e inspeções · 04 · Projetos executivos
- **tpl-modulo-mob**: MÓDULO · Proposta · ENGENHARIA INDUSTRIAL · ES · Estrutura · é · projeto · antes de ser · obra. · VÃO: 30,00 m · Estruturas metálicas, galpões e laudos técnicos. Uma equipe do cálculo à entrega. · Solicitar proposta técnica
