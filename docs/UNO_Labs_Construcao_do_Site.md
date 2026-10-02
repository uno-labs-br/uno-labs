# UNO Labs — Como o site foi construído

**Versão 1.5 · 02/10/2026 · Frontend Astro 7 + TypeScript no checkout oficial `04 - SITE/`**

Este documento descreve a implementação local e a hospedagem pretendida. Não comprova publicação em `unolabs.com.br`; conferir a integração na `main`, as pendências e o estado real do deploy.

Este documento descreve **o que** foi construído para o site da UNO Labs, **como** foi construído e **por que** cada decisão foi tomada. A origem canônica `unolabs.com.br` não comprova que esse domínio serve a versão descrita. Serve para dois usos:

1. **Manutenção:** qualquer pessoa (ou IA) que for mexer no site entende a lógica antes de alterar.
2. **Comparação:** entregar este documento a outros modelos de IA e comparar o que cada um produz. A seção 18 traz um prompt pronto e a seção 16, critérios objetivos para avaliar o resultado.

**Fontes vigentes:** `UNO_Labs_Documentacao_Completa.md`, Parte 0 — decisões do negócio; este documento — intenção de design e implementação; fontes em `src/` e build correspondente em `dist/` — comportamento efetivo, a conferir no navegador. O [LEIA-ME](../LEIA-ME.md) centraliza a operação, e o [relatório da migração](verificacoes/migracao-astro7-ts/RELATORIO.md) registra resultados, limitações e integração comprovados. Para colaboração, seguir `AGENTS.md`. O Apêndice A e as capturas anteriores são registros históricos, sem aprovação automática da versão Astro. Caminhos de código são relativos à raiz do checkout oficial `04 - SITE`.

**Regra obrigatória:** análises, Impeccable e localhost usam as fontes Astro e o HTML compilado correspondente, servido por `npm run preview` a partir de `dist/`. `public/` sozinho contém ativos e já não serve o frontend completo. Executar Git e npm em `04 - SITE`, com remoto `uno-labs-br/uno-labs`; seu conteúdo corresponde diretamente à raiz do GitHub. `03 - ANALISE LP/uno-labs-main` é somente o ZIP histórico. A Parte 0, §0.13 define a padronização.

---

## 1. Resumo

- **O quê:** página única de vendas (home) para a UNO Labs, que vende criação de sites, SEO local, Google Ads, Meta Ads e manutenção. Blog planejado, ainda sem artigos.
- **Promessa central:** “Presença digital que atrai clientes.” Nada é garantido; o site mostra *como* o trabalho aumenta as chances de ser encontrado e escolhido.
- **Conceito criativo:** *Precisão que se revela* — o site se apresenta como engenharia visível: grade técnica, desenho que vira produto, checklist de entrega em terminal.
- **Diferencial de experiência:** a seção “Da busca ao contato” fica **presa na tela** enquanto a pessoa rola, avançando por 4 etapas (Encontra → Entende → Confia → Chama) com uma demonstração que muda a cada etapa.
- **Prova sem cases:** três **estudos conceituais** de negócios fictícios, cada um com identidade própria, rotulados como conceituais.
- **Tecnologia:** Astro `7.3.5`, TypeScript estrito, MDX `8.0.2` e build estático em `dist/`; CSS nativo e scripts tipados. Cloudflare Workers permanece a hospedagem oficial planejada, com integração Astro pendente. O cliente mantém `POST /api/contato`, e o Worker separado, n8n e alternativa PHP foram preservados. O fluxo previsto é SMTP HostGator → `contato@unolabs.com.br`, sem homologação presumida.
- **Peso da home (medição histórica, com gzip):** HTML ≈ 23 KB, CSS ≈ 10 KB, JS ≈ 5 KB, Inter ≈ 48 KB. Essa medição antecede as imagens conceituais e está superada. A comparação local da migração está no [relatório](verificacoes/migracao-astro7-ts/RELATORIO.md); ela não mede desempenho de usuários reais. Nenhum script de terceiros no carregamento inicial.

---

## 2. Negócio, público e posicionamento

| Item | Definição |
|---|---|
| Marca | UNO Labs (nome que substituiu o projeto “Audaro – Engenharia Digital”, que nunca existiu publicamente). A “Audaro – Engenharia de Resultado” é outra empresa e não aparece no site |
| Serviços vendidos | Sites sob medida (projeto), SEO local, Google Ads, Meta Ads e manutenção (mensais). E-commerce fora do escopo por enquanto |
| Preço de entrada | “A partir de R$ 1.490 em até 10x sem juros”. Projetos-alvo até ~R$ 10 mil |
| Garantia e prazo | Os termos e prazos por escopo são informados na proposta. A home não anuncia números nem usa marcadores provisórios |
| Onde atende | Presencial na Grande Vitória (Vitória, Vila Velha, Serra, Cariacica — ES) e em Curitiba (PR); remoto em todo o Brasil |
| Público | Empresas que “tratam o digital como parte do negócio”: arquitetura e interiores, engenharia e construção, clínicas e consultórios, advocacia/contabilidade/consultorias, gastronomia e hospitalidade autorais |
| Equipe | Urias Loures e Bruno Gonzaga são cofundadores; Milena Dias atua em Comunicação e Conteúdo. Cargos e textos integrais aprovados em 01/10/2026; ver §6.10 e Apêndice A |
| Canais | `contato@unolabs.com.br`; WhatsApp `(27) 93618-5141`, `+5527936185141`, link `https://wa.me/5527936185141`. Dados confirmados em 30/09/2026; funcionamento não homologado |
| Dados empresariais | CNPJ e razão social ainda precisam ser informados ou confirmados; Perfil da Empresa no Google depende de endereço verificável |
| Prova social | Ainda não há cases publicáveis. Por isso, estudos conceituais explicitamente rotulados |

**Posicionamento em uma frase:** um time pequeno que trata site como engenharia — e mostra o método em vez de prometer resultado.

**Tom de voz:** direto, sereno, específico. Frases curtas. Sem superlativos (“o melhor”, “revolucionário”), sem urgência artificial, sem jargão de marketing (“alavancar”, “transformar seu negócio”). Números só quando verdadeiros (preço, metas técnicas).

---

## 3. O conceito: “Precisão que se revela”

### 3.1 A ideia
Empresas pequenas desconfiam de agências porque não veem o que está sendo feito. A home resolve isso **tornando o processo visível**:

- No **hero**, um desenho técnico (wireframe com cotas e grade de 12 colunas) é “varrido” por uma linha verde e se transforma no site pronto de um restaurante fictício. Um cartão mostra o código SEO (title, meta e Schema.org) e outro mostra o restaurante aparecendo na busca local. A revelação é uma animação finita de 4 s que termina com o site visível.
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
| 2 | Hero (`#topo`) | Promessa, para quem, preço de entrada e demonstração visual |
| 3 | Jornada presa (`#abordagem`) | Explica o mecanismo: cada serviço atua num momento da decisão do cliente final |
| 4 | Serviços (`#servicos`) | O site no centro, os mensais em órbita; lista com modelo de cobrança |
| 5 | Por baixo do capô | Autoridade técnica com metas verificáveis, sem prometer resultado |
| 6 | Estudos de direção (`#projetos`) | Prova de capacidade visual em três setores |
| 7 | Como trabalhamos (`#processo`) | Reduz risco: 4 etapas com entregável cada |
| 8 | Investimento | Preço de entrada, o que muda o valor, garantia e mensais |
| 9 | Para quem / Onde | Qualifica o lead e reforça SEO local |
| 10 | Equipe | Retratos, cargos e textos aprovados que apresentam as pessoas responsáveis pelo trabalho |
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
- **Janela do navegador** em `left: 180; width: 880`, barra de 40 px com “Estudo conceitual · Casa Noma” e um selo que alterna “Projeto técnico” (claro) ↔ “Apresentação visual” (escuro).
- Área de 878 × 549: por baixo, **desenho técnico em SVG** (12 colunas menta, contornos a 42% de opacidade, cotas “12 COL · GUTTER 24”, “H1 · 88 PX”, “FOTO · 586 × 480”, “RESERVA EM 3 TOQUES”). Por cima, o **site pronto da Casa Noma** é revelado de cima para baixo com `clip-path` (`revela`, 4 s finitos) e uma **linha de varredura** menta com brilho que desce junto (`varre`, 4 s finitos).
- **Cartão de código** (fundo `--uno-pine-deep`, Plex Mono 12 px) em `left: 0; top: 330; width: 356`: `<title>`, `<meta description>` e JSON-LD `Restaurant` com cursor visual estático.
- **Cartão de busca** (branco) em `right: 0; top: 96; width: 340`: campo “restaurante para jantar em vitória”, resultado azul estilo Google e o selo “Encontrado na busca local” com ponto menta.
- Os dois cartões sobem 4 px no hover.

**Palco celular/tablet (< 1100; composição 350 × 610, até 420 px de largura):** um celular (236 × 492) com o desenho técnico de 4 colunas sendo revelado no site mobile da Casa Noma, e o cartão de código ocupando a largura toda na base.

**Animação do palco:** a revelação, a varredura e a troca do selo são finitas e duram 4 s; ao final, o site fica visível e o selo mostra “Apresentação visual”. Com movimento reduzido, o estado final aparece sem animação.

### 6.3 Jornada “Da busca ao contato” (presa na tela)
**Por que existe:** explicar, sem jargão, que cada serviço atua num momento da decisão do cliente final. A primeira versão tinha abas clicáveis; foi trocada por rolagem presa (pedido do usuário: “quando a pessoa rolasse… ficasse parado… e ia mudando de um para o outro”).

**Mecânica:**
- O modo preso, quando cabe, ocupa **três alturas estáveis de tela (`svh`)**; o bloco interno fica `position: sticky` com a altura útil medida menos o cabeçalho.
- O JavaScript mede o conteúdo e a altura útil da janela. O sticky só é ativado quando a composição cabe: no desktop, a escala depende da largura e a altura dos detalhes é conferida; em telas menores, o texto mais alto e a composição mobile de 404 px entram no cálculo. Se não couber, a jornada vira uma sequência linear com as quatro explicações completas.
- Progresso `p` (0–1) = quanto já se rolou no percurso sticky disponível. Os quatro estágios dividem o percurso em intervalos iguais; **etapa = ⌊p × 4⌋**, e o avanço dentro da etapa (`--sub`, 0–1) preenche a linha de progresso. A rolagem é nativa. Clicar numa etapa rola até um ponto dentro do intervalo correspondente.
- Com **movimento reduzido**, a jornada não fica presa e apresenta as quatro etapas completas em sequência estática. Sem JavaScript, os textos também aparecem abertos.

**Desktop (≥ 1100): composição-base de 1240 px**, escalada por `--je = min(1, (largura − 64)/1296)`; o sticky depende também da altura útil medida.
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

**Celular/tablet (< 1100):** quando a composição cabe e o sticky está ativo, há rótulo, H2 28 px (36 px no tablet), **4 abas com barra de progresso** (a ativa preenche conforme `--sub`), celular de 195 × 404 com as mesmas 4 cenas em versão mobile, cartões flutuantes de 178 px e texto curto da etapa (troca com fade + 12 px). A composição escala por `--jm` e a medição impede ativar o sticky se o conteúdo não couber. No modo linear, as abas somem e as quatro explicações ficam visíveis em sequência.

**Registro de verificação local em 30/09/2026:** em Chromium emulado, a medição manteve o layout linear em 320 × 568, 360 × 640, 844 × 390 e 1280 × 720; o modo sticky coube em 390 × 844, 768 × 1024 e 1440 × 900. Movimento reduzido apresenta as quatro explicações estáticas. A verificação foi somente em navegador emulado, sem dispositivos físicos; não é prova de envio ou entrega SMTP real.

### 6.4 Serviços
- Título “O site é o centro. O resto trabalha para ele.” (máx. 820 px).
- Grade 5 / 1 / 6:
  - **Órbita** (520 px; 280 px no celular): halo radial menta, anel interno tracejado e anel externo com quatro nós menta e os rótulos SEO local, Google Ads, Meta Ads e Manutenção. O conjunto gira em 90 s; os rótulos fazem contrarrotação para continuarem na orientação de leitura. No centro, círculo `--uno-pine` “Site / sob medida” com uma onda Mint que cresce e desaparece em ciclos de 3,2 s. Giro e onda anteriores ao adapt foram restaurados por solicitação de 01/10/2026. Há legenda e controle “Pausar animação”/“Retomar animação”, com altura mínima de 44px. Pausa fora da área visível e com aba oculta; preferência por movimento reduzido mantém figura estática e controle desabilitado. Sem JS ou sem IntersectionObserver, a figura permanece estática e não oferece um controle indisponível.
  - **Cores preservadas:** títulos e rótulos Pine `#0E2B24`, apoio `#355048`, “Site” Off White `#F3F7F3` e “sob medida” Mint2 `#A7E5C5`. Inter e pesos conferidos contra o CSS do checkpoint `15cd947`. Não houve troca para preto nessa seção.
  - **Lista** de 5 serviços separados por linhas de 1 px: nome (24 px) + modelo de cobrança à direita (“Projeto · a partir de R$ 1.490”, “Mensal”, “Mensal · mídia à parte”, “Plano mensal”) + descrição.

### 6.5 Por baixo do capô
- Grade 5 / 1 / 6. Texto: “Engenharia que você não vê — e o Google sente.” e a ressalva “São metas de projeto… não promessas de resultado”.
- **Terminal** (fundo `--uno-pine-deep`, raio 22 px, Plex Mono 13,5 px): cabeçalho “unolabs / checklist-de-entrega” e rótulo “itens previstos”; comando `$ uno entrega --verificar`; **8 itens “A verificar”** que aparecem em cascata (.5 s cada, atraso de 0,1 a 1,15 s) quando o terminal entra na tela; cursor visual estático no fim.
- Os itens são uma lista acessível (`role="list"`); o comando e o cursor são decorativos.

### 6.6 Estudos de direção
- Abertura: “Três negócios. Três expressões. Nenhum modelo pronto.” + ressalva “Não são clientes: são a régua do que entregamos.”
- Três **capítulos de largura total**, cada um com a cor do próprio negócio (não da UNO Labs), alternando o lado da imagem:
  - Texto (4/12): meta em caixa alta com espaçamento largo, nome 52 px, selo “Estudo conceitual”, e dois itens (Objetivo / Decisão em destaque).
  - Composição (8/12; fixa em 820 × 560 e escalada): janela de desktop de 760 px (barra de 30 px + site em 760 × 475) e celular de 196 × 406 sobreposto no canto inferior. No celular (< 600 px), só o celular, maior (236 × 492).
- Os sites dos estudos combinam HTML, imagens conceituais e geometria técnica em SVG, com fontes e paletas próprias, e ficam em seis `<template>` em `src/components/estudos/TemplatesEstudos.astro`: cada versão desktop/celular contém a composição aprovada (Módulo: Projeto, Atria: Detalhe, Casa Noma: Imersivo; direções anteriores permanecem no histórico Git). O módulo TypeScript de estudos copia os templates quando o espaço se aproxima da tela. Os blocos recebem `aria-hidden`, `inert` e `data-nosnippet`; controles internos são demonstrativos. As duas primeiras propriedades afastam as maquetes da leitura assistiva e do foco; `data-nosnippet` trata trechos de busca e não garante exclusão do índice.
- **Composições finais aprovadas:** as variações foram fixadas sem seletores manuais nos capítulos da home, unificando a direção em todas as instâncias (capítulos desktop e celular, Casa Noma no hero e Atria na jornada). As sequências dos três estudos em ambas as versões (desktop e celular) têm duração calculada de exatamente 4,00 s de tempo visível real, com efeitos contínuos e sem pausa ociosa. O disparo só ocorre quando o visitante atinge exposição significativa da cópia: pelo menos metade do modelo na área útil visível, descontando o cabeçalho fixo no topo, considerando clipping de ancestrais e adaptando para telas baixas onde o modelo excede a altura útil (garantindo que nunca fique impossibilitado de animar). O pré-carregamento 800 px antes apenas monta o DOM sem iniciar o movimento. Ao perder a exposição ou ocultar o documento, a animação pausa e retoma do ponto em que parou sem consumir os 4 s enquanto oculta. Cada capítulo conta com um botão acessível “Rever animação” (≥ 44 px, foco visível e anúncio `aria-live`) que reinicia, sem recriar o DOM, somente cópias com exposição significativa na tela. Na jornada, a cópia também precisa pertencer a uma etapa ativa; cenas futuras aguardam até sua etapa ativa e exposição. A sequência termina quando acabam os efeitos CSS finitos declarados (4,00 s), e a classe de execução sai para revelar o layout estático. Com `prefers-reduced-motion: reduce` ou classe `.rm`, somente o movimento dos estudos é cancelado e o botão informa o estado; quando a preferência do sistema volta ao normal e `.rm` não está ativa, o replay pode ser usado novamente. Sem suporte a `IntersectionObserver` ou à sincronização dos efeitos, os estudos ficam estáticos e o botão informa essa limitação. Os estilos ficam delimitados em `src/styles/conceitos.css`.

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

**Imagens — refinamento de 30/09/2026:** geradas pelo ImageGen integrado, usadas exclusivamente nos estudos fictícios. Não documentam pessoas, clientes, pratos ou obras reais. Arquivos em `public/assets/img/conceitos/{modulo,atria,casanoma}.webp`, 1536 × 1024 px, cerca de 571 KB no total na medição histórica. Os metadados e prompts `.webp.json` foram movidos para `docs/referencias-visuais/conceitos/` na migração, fora dos ativos copiados para o build. A otimização preserva dimensões e composição; cada `img` declara dimensões e `decoding="async"`.

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

O texto aprovado para a seção é “Experiências em negócios, tecnologia e comunicação que orientam os sites, as campanhas e o conteúdo da UNO Labs.” Usar os cargos e os dois parágrafos integrais reproduzidos no Apêndice A.

Cada pessoa é um article na ordem retrato, h3 com o nome, cargo e dois parágrafos. Usar somente a classe .equipe para delimitar os estilos. A foto é quadrada, largura 100% e tamanho máximo de 320 px; o nome usa 26 px e a biografia 17 px com line-height 1.65. Não fixar alturas nem adicionar controles, hover ou animação. Aplicar margens e divisórias discretas compatíveis com Pine, Mint e Inter.

**Fotografias aprovadas em 01/10/2026:** os originais fornecidos são foto-apresentacao-urias-loures.jpeg (1122 × 1402), foto-apresentacao-bruno-gonzaga.jpeg (640 × 640) e foto-apresentacao-milena-novaes.png (1122 × 1402). Preservar os originais na pasta externa. Usar os derivados WebP locais da pasta public/assets/img/equipe/: urias-loures-320.webp, urias-loures-640.webp, bruno-gonzaga-320.webp, bruno-gonzaga-640.webp, milena-dias-320.webp e milena-dias-640.webp. Identificar as fotos pelos nomes públicos nos derivados, inclusive Milena Dias.

A preparação limita-se ao recorte, à conversão e à compressão, sem retoques ou geração. Usar qualidade WebP 85 e Lanczos; o crop é quadrado a partir do topo, sem cortar o rosto. Não ampliar a foto original de Bruno, que já mede 640 × 640 px. Exibir a foto em no máximo 320 px para preservar sua resolução em DPR2.

No layout, usar três colunas a partir de 1100 px, duas colunas entre 700 e 1099 px e uma coluna abaixo de 700 px.

### 6.11 Blog
- Fundo `--uno-off-white-2`. Cabeçalho com texto à direita: “Os primeiros artigos estão em produção.”
- Grade 7 / 5: um cartão grande (guia de preço) e dois menores (comparativo e SEO local). Todos com selo **“Em breve”** e **sem link** — nenhum link quebrado ou página vazia indexada.

### 6.12 Dúvidas
- Grade 4 / 1 / 7; a coluna do título fica presa (`sticky`) enquanto as perguntas rolam.
- 9 perguntas em `<details>` nativos (a primeira aberta), sinal “+” que gira 45° ao abrir. Espelhadas no JSON-LD `FAQPage`.

### 6.13 Contato
- Fundo `--uno-off-white-2`. Esquerda (5/12): título médio, parágrafo e canais diretos: WhatsApp `(27) 93618-5141` (`https://wa.me/5527936185141`) e `contato@unolabs.com.br`. Os contatos foram informados; a implementação dos links e sua abertura real ainda precisam ser conferidas.
- Direita (6/12): cartão branco com o formulário:
  - Nome, Empresa, WhatsApp ou e-mail, Site atual (opcional) em duas colunas; “Do que você precisa?” em pílulas com caixa de seleção; “O que você quer construir ou melhorar?” (área de texto com ajuda); “Investimento previsto” (faixas até R$ 3 mil, 3–6, 6–10, acima de 10, não definido).
  - Campo-armadilha invisível para robôs; espaço opcional para o Turnstile.
  - Rodapé do formulário: nota de uso de dados com link para a política + botão “Enviar contexto do projeto”.
  - Estados: erro por campo (borda vermelha, mensagem, `aria-invalid`, foco no primeiro erro), aviso geral, “Enviando…”, **sucesso só com confirmação do servidor** (ícone ✓, “Recebemos suas informações.”, botão “Enviar outro pedido”) e **falha recuperável** (os dados ficam no formulário).

### 6.14 Rodapé
- Grade 4 / 1 / 2 / 2 / 3: logo 60 px + assinatura “Presença digital que gera oportunidades.”; Navegação; Serviços; Atendimento (cidades). Linha final com © (ano automático) e link da política. No celular, duas colunas.

### 6.15 Páginas auxiliares
- `/politica-de-privacidade/`: texto específico do fluxo previsto (formulário → Worker `/api/contato` → n8n → SMTP HostGator → `contato@unolabs.com.br`), operadores, base legal LGPD, direitos e guarda. Responsável, contato de privacidade, local do n8n, prazo de guarda e revisão jurídica continuam pendentes; não presumir que o contato comercial seja o contato de privacidade.
- `/404.html`: título “Esta página não existe — ou mudou de lugar.”, botões para o início e o contato, `noindex`.

---

## 7. Movimento

| Nome | Onde | Duração / curva | O que faz |
|---|---|---|---|
| `sobe` | Linhas do H1 | 1 s, `cubic-bezier(.16,.84,.2,1)` | Texto sobe de dentro de uma máscara |
| `aparece` | Blocos do hero | .9 s ease, atrasos .35/.5/.6 s | Opacidade 0→1 e 16 px para cima |
| `revela` | Palco do hero | 4 s, `cubic-bezier(.65,0,.35,1)`, finita | `clip-path` revela o site sobre o desenho técnico e termina no estado final |
| `varre` | Palco do hero | 4 s, mesma curva, finita | Linha menta com brilho acompanha a revelação e desaparece ao final |
| `st1` / `st2` | Selo do palco | 4 s linear, finita | Troca “Projeto técnico” por “Apresentação visual” |
| `gira` / `pulso` | Órbita de serviços | 90 s linear / 3,2 s ease-out, contínuas com controle | Nós giram com rótulos legíveis; onda Mint parte do centro. Pausam por controle, fora da área visível e com aba oculta; desativadas com movimento reduzido |
| Jornada | Cenas, detalhes, cartões | .6 s / .5 s / .45 s | Crossfade e expansão controlados pela rolagem |
| Terminal | Itens ✓ | .5 s cada, cascata até 1,15 s | Entram uma vez, quando visíveis |
| `levita` | Cartões e maquetes | .3 s | Sobem 4 px no hover |
| Movimento autoral dos estudos | Módulo, Atria, Noma | Finita (~4 s reais; exatamente 4,00 s calculados nas 6 versões desk/mob) | Inspeção estrutural em Módulo (cotas, marcas e cascata de serviços no desktop; traçado técnico contínuo no celular com CTA sempre legível), abertura editorial em Atria (máscara de faixa, respiração da foto e confirmação de agenda), acomodação cinematográfica e luz âmbar em Casa Noma; disparo somente sob exposição significativa (≥50% na área útil sem header), pausa fora da tela e conclusão sem pausa ociosa |

**Regras:** nada se move sem explicar algo; nenhum movimento automático bloqueia a leitura; com `prefers-reduced-motion: reduce`, todas as animações e transições são desligadas, o palco mostra direto o estado final da apresentação visual e a jornada deixa de ficar presa.

---

## 8. Responsividade

| Faixa | Comportamento principal |
|---|---|
| ≥ 1280 | Layout de referência. Composições em escala 1 |
| 1100–1279 | Mesmo layout; base do hero em 2 colunas; composições escalam proporcionalmente |
| 768–1099 | Menu de celular; palco do hero em versão celular (até 420 px); jornada em versão celular ampliada (até 1,4×); estudos com janela + celular |
| 600–767 | Cabeçalho de 64 px; colunas empilhadas |
| < 600 | Fatos do hero em linhas; botões de largura total; estudos só com celular; órbita de 280 px; segmentos sem descrição |

**Sistema de escala (`.escala`):** a maquete usa tamanho-base (`--bw` × `--bh`) e `transform: scale(--s)`, com `--s = largura disponível / --bw` calculado por `ResizeObserver`. O contêiner reserva altura com `aspect-ratio` para reduzir deslocamentos. Esse mecanismo não comprova CLS zero; estabilidade e possíveis cortes precisam de verificação nas dimensões do relatório.

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
- HTML semântico, cidades citadas em texto real e maquetes conceituais identificadas. `data-nosnippet` restringe uso em trechos de busca; não garante exclusão do índice.
- `robots.txt`, `sitemap.xml`, URLs limpas com barra final (`/politica-de-privacidade/`), página 404 com `noindex` e status 404 real.
- Blog: cartões sem link até existirem artigos (evita páginas finas).

---

## 11. Performance (metas: LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1)
- Astro gera HTML estático; a interface não hidrata um framework visual. Scripts de interação são TypeScript processado, sem nova dependência de animação ou script de medição. Turnstile não foi ativado nesta migração.
- Fontes auto-hospedadas; só a Inter é pré-carregada (`preload`). As fontes dos estudos só baixam quando os estudos são desenhados.
- Estudos clonados sob demanda (`IntersectionObserver`, margem de 800 px) e **nunca** quando o espaço está oculto (`display: none`) — o celular não carrega as maquetes do desktop.
- Capítulos dos estudos com `content-visibility: auto`.
- Escuta de rolagem passiva + `requestAnimationFrame`; o DOM só é alterado quando a etapa muda.
- Cache descrito em `_headers` é da configuração legada Cloudflare; não comprova cabeçalhos Vercel. CSS e scripts processados usam nomes gerados pelo build; não editar `?v=1` manualmente como mecanismo de publicação Astro.

---

## 12. Arquitetura técnica

### 12.1 Por que migrar agora para Astro
A decisão de Urias em 02/10/2026 substituiu o adiamento D28: migrar o frontend sem aguardar os artigos. Astro separa páginas, layouts e seções reais, gera HTML estático e prepara MDX validado. TypeScript estrito verifica os contratos de DOM e de resposta do formulário. CSS global, conteúdo aprovado e ativos são reaproveitados. O build verifica tipos antes de compilar. Não há SSR, adaptador, SPA ou framework de interface adicional; a integração de produção permanece futura.

### 12.2 Arquivos
Ver estrutura e comandos no [LEIA-ME](../LEIA-ME.md), sem manter outro manual operacional. Pontos-chave:
- `src/pages/index.astro` compõe as seções de `src/components/home/`; privacidade e 404 têm fontes próprias.
- `src/layouts/BaseLayout.astro` e `src/components/SEO.astro` compartilham estrutura e metadados; origem canônica e contatos em `src/data/site.ts`.
- `src/components/estudos/TemplatesEstudos.astro` preserva os seis IDs `tpl-casanoma-desk/mob`, `tpl-atria-desk/mob`, `tpl-modulo-desk/mob`.
- `src/styles/` contém CSS global na ordem `fonts.css`, `site.css`, `conceitos.css`, preservando os seletores usados no DOM clonado.
- `src/scripts/` contém inicializadores tipados e módulos das interações; páginas auxiliares carregam somente o necessário. A marcação antecipada curta `js`/`rm` mantém o estado visual de carregamento; o restante é processado pelo Astro.
- `src/content.config.ts`, `src/content/blog/`, `src/data/authors.ts`, `src/lib/blog.ts`, layout e rota dinâmica preparam a coleção MDX vazia. Regras e exemplo documental estão no LEIA-ME; não há artigo fictício, RSS ou `/blog/` vazio.
- `robots.txt` e `sitemap.xml` são gerados no build; rotas e sitemap compartilham a seleção de artigos `draft === false` e data não futura em UTC. `UNO_DEPLOY_TARGET=preview` é padrão e aplica `noindex`.
- `public/` conserva ativos estáticos; `dist/` é saída gerada, ignorada pelo Git. HTML e JavaScript antigos do frontend deixam de concorrer com as fontes Astro.
- `worker/index.js`, `wrangler.jsonc` e `hospedagem-tradicional/` permanecem como backend e alternativa legados, sem migração ou homologação nesta etapa.

### 12.3 Clonagem dos estudos
Cada espaço reservado é `<div class="estudo estudo--desk|mob" data-estudo="atria-desk" style="--e:0.55625">`. O módulo `src/scripts/estudos.ts` copia o `<template>` correspondente, **renomeia todos os `id` internos com um sufixo único** e corrige as referências `url(#…)` (gradientes e filtros SVG), porque o mesmo estudo aparece várias vezes na página. O fator `--e` é a razão entre a janela e o tamanho-base do estudo (ex.: 712/1280 = 0,55625). O pré-carregamento 800 px antes monta o DOM sem iniciar o movimento. A animação só dispara quando o visitante atinge exposição significativa (≥50% do modelo na área útil sem cabeçalho fixo, adaptado para telas baixas), executando 4,00 s reais nas seis maquetes e pausando/retomando com a rolagem.

### 12.4 Estado da jornada no DOM
`section.jornada[data-passo]`; elementos com `data-etapa="0–3"` recebem `.is-ativo` / `.is-feito`; `--sub` fica no elemento ativo; `--je` na grade do desktop e `--jm` na composição do celular. Toda a aparência sai do CSS.

---

## 13. Formulário e backend
Fluxo vigente: **navegador → `POST /api/contato` (JSON) → Worker → webhook do n8n → SMTP HostGator → `contato@unolabs.com.br`**. A rota PHP é uma alternativa técnica e não integra a homologação deste fluxo.

Validação no servidor: origem permitida (cabeçalho `Origin`), `Content-Type` JSON, corpo ≤ 16 KB, limpeza de caracteres de controle e limite por campo, listas fechadas para serviços e faixas de investimento, nome/empresa ≥ 2 caracteres, canal = e-mail válido ou ≥ 10 dígitos, contexto ≥ 10 caracteres. Campo-armadilha preenchido → responde sucesso e descarta. Turnstile obrigatório se a chave secreta existir. Chamada ao n8n com o token `X-Uno-Token` e tempo-limite de 10 s.

Contrato vigente esperado: depois de o nó de e-mail confirmar aceitação pelo SMTP, o n8n responde `{"ok":true,"encaminhamento":"smtp_aceito"}`. O Worker deve rejeitar resposta 2xx genérica; `200` com esse corpo comprova a aceitação reportada pelo fluxo backend/SMTP, mas não o recebimento na caixa. A aceitação do backend, o encaminhamento aceito pelo SMTP e a mensagem observada na caixa são evidências distintas. Os demais códigos documentados são `422` (campos), `403` (origem/Turnstile), `400/413/415` (malformado), `502` (n8n falhou) e `503` (não configurado). Configuração real, credenciais e remetente autorizado não estão comprovados.

Registro histórico anterior à migração: 11 cenários do Worker (rotas, 404, redirecionamento de barra, origem, validação, armadilha, método, cabeçalhos) e 4 do PHP, com um n8n simulado; ponta a ponta no navegador (erros de validação, sucesso, falha com dados preservados). Isso não é homologação de SMTP real nem prova de recebimento na caixa. O roteiro de evidências fica em [CONTATO_HOMOLOGACAO.md](CONTATO_HOMOLOGACAO.md).

---

## 14. Prévia e integração de hospedagem pendente

A entrega usa Astro estático e `dist/`. A configuração Vercel de teste tem framework Astro, build `npm run build`, saída `dist/`, target `preview` e `X-Robots-Tag: noindex, nofollow` incondicional. A prévia remota informada só é evidência após conferir commit, respostas e cabeçalhos. A capacidade `production` é conferível localmente; não muda o ambiente remoto de teste nem autoriza publicação.

Cloudflare Workers com Static Assets continua a hospedagem oficial planejada. `wrangler.jsonc` preservado ainda aponta `assets.directory` para `./public`; publicar com essa configuração não serviria as páginas completas Astro. O atalho `npm run deploy` está bloqueado localmente sem rede, e o dry run legado não homologa essa integração. A alternativa Apache/PHP também permanece sem homologação para o novo build.

Custom domains, redirects, DNS, SMTP HostGator, credenciais e secrets dependem de tarefa própria. Clarity, analytics e ativação de Turnstile não foram incorporados. Procedimentos e pendências estão no [LEIA-ME](../LEIA-ME.md); estado comprovado no [relatório](verificacoes/migracao-astro7-ts/RELATORIO.md).

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
| Rodada 5 (histórico) | Implementação local em HTML estático + Worker + PHP | Fontes auto-hospedadas e política específica ainda com pendências; registros locais de testes não comprovam publicação ou homologação real |
| 02/10/2026 | Migração do frontend para Astro 7 + TypeScript, com coleção MDX vazia | Substitui D28 sem esperar artigos; preserva visual, conteúdo, ativos e backend. Resultados e integração consultáveis no relatório |

---

## 16. Critérios de aceite (para avaliar esta ou outra versão)

A lista orienta revisão; caixas vazias não representam falhas comprovadas nem aprovação. Os resultados da migração ficam no [relatório permanente](verificacoes/migracao-astro7-ts/RELATORIO.md), incluindo testes executados, diferenças justificadas, PR e estado da integração. Registros de 30/09 e 01/10 não substituem a verificação do build Astro.

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
- [ ] Jornada avança pelas 4 etapas com rolagem nativa quando cabe; usa sequência linear em telas baixas sem corte de conteúdo.
- [ ] Clique na etapa leva até ela; movimento reduzido mantém as quatro explicações em sequência estática.
- [ ] Formulário só mostra sucesso com confirmação do servidor e preserva os dados em caso de falha.

**Técnico**
- [ ] Sem rolagem horizontal de 320 a 1920 px.
- [ ] Um H1; H2 por seção; foco visível; navegação completa por teclado.
- [ ] JSON-LD válido; `canonical`, OG, `sitemap.xml`, `robots.txt`, 404 com status 404.
- [ ] Astro e TypeScript estrito sem erros de check/build; scripts processados sem duplicação ou TS cru.
- [ ] Coleção vazia compilável, metadados inválidos rejeitados e rascunhos/datas futuras ausentes das rotas e sitemap.
- [ ] Prévia com noindex e 404 real; backend preservado e cenários de contato simulados sem envio externo.
- [ ] Nenhuma requisição a terceiros no carregamento inicial.
- [ ] PageSpeed (celular) com LCP ≤ 2,5 s, CLS ≤ 0,1.
- [ ] Funciona e mostra todo o texto sem JavaScript.

---

## 17. Pendências (antes e depois de publicar)

Os contatos confirmados já estão no HTML e no JSON-LD; os links foram conferidos localmente. Isso não comprova funcionamento da caixa nem recebimento de e-mail.

- Pacote inicial que cabe no preço público a partir de R$ 1.490: escopo e entregáveis ainda não definidos.
- CNPJ e razão social: informar ou confirmar os dados empresariais.
- Política de privacidade: responsável, contato de privacidade, onde roda o n8n, prazo de guarda e data; revisão jurídica. Não presumir que o e-mail comercial seja o contato de privacidade.
- Configurar e homologar o Worker, o webhook do n8n e o SMTP HostGator, incluindo credenciais e remetente autorizado, sem registrar segredos na documentação. Resposta exigida do n8n após aceitação do SMTP: `{"ok":true,"encaminhamento":"smtp_aceito"}`.
- Homologação real em três etapas: resposta de aceitação do backend, confirmação de encaminhamento aceito pelo SMTP e recebimento observado na caixa `contato@unolabs.com.br`.
- Equipe: cargos, textos e fotografias definidos em 01/10/2026; antes de publicar, conferir que a aplicação segue a seção 6.10 e o Apêndice A.
- Termos e prazos de garantia/projeto são definidos na proposta de cada escopo; não preencher números ou marcadores provisórios na home.
- Turnstile (opcional, recomendado quando começar a chegar spam).
- Perfil da Empresa no Google depende de endereço verificável (quando existir, acrescentar dados confirmados ao JSON-LD).
- Verba de mídia paga diretamente às plataformas: confirmar.
- Instagram e LinkedIn (`sameAs`).
- Cases reais com autorização (ex.: La Bella Mesa) substituindo ou somando-se aos estudos.
- Produzir e revisar 4–6 artigos-pilar. A migração Astro de D28 não depende mais deles; coleção vazia e teasers preservados.
- Integrar o build `dist/` com a hospedagem oficial e homologar o fluxo; Wrangler ainda aponta para `public/`.
- Cloudflare Web Analytics (sem cookies), previsto na §0.8: ao ativar, atualizar a política de privacidade.

---

## 18. Prompt pronto para outras IAs

Copie o texto abaixo e anexe: este documento, `UNO_Labs_Documentacao_Completa.md`, os arquivos de `01 - IDENTIDADE VISUAL` (logos SVG, favicons, paleta) e, se quiser, as capturas de `referencias-visuais/`.

```text
Você é um web designer e desenvolvedor front-end sênior, com 20 anos de experiência em sites que vendem serviços B2B.

Tarefa: implementar o escopo solicitado no frontend Astro existente da UNO Labs.
Leia o AGENTS.md e o LEIA-ME antes de editar; não interpretar este prompt genérico
como autorização de publicação, redesenho, backend ou mudança de infraestrutura.

Leia primeiro os documentos anexados, nesta ordem:
1. UNO_Labs_Documentacao_Completa.md — a Parte 0 prevalece sobre o resto.
2. UNO_Labs_Construcao_do_Site.md — descreve uma versão já construída: conceito, sistema visual, seções, texto exato (Apêndice A), movimento, responsividade, acessibilidade, SEO e critérios de aceite (seção 16).

Regras:
- Use exatamente as decisões de negócio (preço, garantia, cidades, serviços, equipe, headline). Não invente depoimentos, números, clientes, endereço ou telefone.
- Mantenha a identidade visual (tokens da seção 4). Você pode propor outra direção criativa, mas ela precisa transmitir autoridade, capacidade e profissionalismo e não pode ter “cara de IA” (ver seção 3.3).
- Obrigatório: seção “Da busca ao contato” presa na tela durante a rolagem, com 4 etapas; estudos conceituais claramente rotulados; formulário honesto (sucesso só com confirmação do servidor).
- Mantenha Astro 7 + TypeScript estrito, MDX e build estático em dist/, CSS nativo e ativos locais. Não retornar a HTML sem framework, adicionar SSR, adaptador, SPA ou framework de interface por preferência. Preserve responsividade, acessibilidade, SEO e as metas técnicas; registre resultados reais.
- Cloudflare Workers é a hospedagem oficial planejada, com integração Astro pendente. Preserve o cliente POST JSON para /api/contato e o backend existente; não configurar hospedagem, n8n, SMTP, Turnstile ou medição sem escopo próprio. Prévia de teste mantém noindex.
- Escreva todo o texto em português do Brasil, no tom descrito na seção 2.

Ao final, avalie a sua própria entrega item a item contra a seção 16 e liste o que ficou de fora e por quê.
```

---

## 19. Referências visuais
Pasta `docs/referencias-visuais/` (capturas históricas da implementação anterior, 1440 × 900 e 390 × 844; não comprovam publicação nem validação Astro):

- `desktop-01-hero.png` · `desktop-01a…01d-jornada-etapa-1…4.png`
- `desktop-02-servicos.png` · `desktop-03-por-baixo-do-capo.png`
- `desktop-04-projetos-abertura.png` · `desktop-05-estudo-modulo.png` · `desktop-06-estudo-atria.png` · `desktop-07-estudo-casa-noma.png`
- `desktop-08-processo.png` · `desktop-09-investimento.png` · `desktop-10-para-quem.png` · `desktop-11-equipe.png` · `desktop-12-blog.png` · `desktop-13-duvidas.png` · `desktop-14-contato.png` · `desktop-15-rodape.png`
- As mesmas telas com prefixo `celular-`.

---

## Apêndice A — Texto exato de cada seção

**Registro histórico de conteúdo:** extraído do DOM do antigo `public/index.html` em 30/09/2026; equipe atualizada em 01/10/2026. Preservado como referência dos textos aprovados, sem transformar a página antiga em fonte operacional vigente. O conteúdo efetivo deve ser conferido nas fontes Astro e no build. Formato: `tag` _(contexto)_: texto. Alternativas responsivas e textos das ilustrações fora de templates aparecem separados; mensagens condicionais são mantidas. As demonstrações são conceituais e não representam resultados reais. Exclui maquetes em `<template>`, `<dialog>` fechado e elementos `hidden`.

### Acesso rápido
- `a`: Pular para o conteúdo

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
- `p` _(desktop)_: Criação de sites · SEO local · Google Ads · Meta Ads
- `p` _(celular)_: Sites · SEO local · Google Ads · Meta Ads
- `p`: Sites profissionais, SEO local e anúncios no Google e no Meta para empresas que querem ser encontradas com facilidade e escolhidas com confiança.
- `a`: Conversar sobre meu projeto
- `a`: Ver estudos de projeto
- `dt`: A partir de R$ 1.490
- `dd`: em até 10x sem juros
- `dt`: Presencial
- `dd`: Grande Vitória e Curitiba
- `dt`: Um só time
- `dd`: site, SEO e anúncios
- `svg text` _(ilustração desktop)_: 12 COL · GUTTER 24; H1 · 88 PX; FOTO · 586 × 480; RESERVA EM 3 TOQUES
- `svg text` _(ilustração celular)_: 4 COL; FOTO · 350 × 340; RESERVA FIXA
- `div` _(cartão visual SEO desktop)_: seo / casa-noma; Schema.org; `<title>Casa Noma · Vitória, ES</title>`; `<meta name="description" content="Menu de estação e reservas">`; `"@type": "Restaurant"`; `"servesCuisine": "Brasileira"`; `"areaServed": "Vitória, ES"`
- `div` _(cartão visual SEO celular)_: seo / casa-noma; Schema.org; `<title>Casa Noma · Vitória, ES</title>`; `"@type": "Restaurant"`; `"areaServed": "Vitória, ES"`
- `div` _(resultado de busca ilustrativo)_: restaurante para jantar em vitória; Casa Noma › reservas; Casa Noma: Cozinha de estação em Vitória; Menu de estação e reservas on-line. Ter a sáb, 19h às 23h30.; Encontrado na busca local
- `figcaption` _(alternativa sem JavaScript)_: Casa Noma, estudo conceitual de direção visual.

### Antes de ligar, seu cliente pesquisa. (`#abordagem`)
- `p`: Da busca ao contato
- `p`: São quatro momentos. Em cada um, uma parte do nosso trabalho entra em ação.
- `button`: 01 Encontra
- `h3`: Ser encontrado por quem já está procurando.
- `p`: Google Ads pode aproximar sua empresa de quem procura pelo serviço. O SEO local organiza informações para ampliar sua presença nas buscas, sem garantia de posição.
- `button`: 02 Entende
- `h3`: Entender a oferta na primeira tela.
- `p`: A primeira tela precisa responder o que é, para quem é e qual o próximo passo. Se o visitante precisa decifrar, ele volta para a busca.
- `button`: 03 Confia
- `h3`: Passar confiança antes da conversa.
- `p`: Visual coerente, responsáveis identificados e processo explicado ajudam o visitante a avaliar a empresa antes de conversar.
- `button`: 04 Chama
- `h3`: Transformar interesse em contato.
- `p`: Um caminho claro para o contato. Formulários, agendamento e avisos à equipe podem compor o escopo, conforme as integrações necessárias.
- `p`: Da busca ao contato
- `button`: Encontra
- `button`: Entende
- `button`: Confia
- `button`: Chama
- `p`: Encontra
- `h3`: Ser encontrado por quem já está procurando.
- `p`: Anúncios para buscas relevantes e SEO local para ampliar sua presença. A posição depende da concorrência e dos critérios do Google.
- `p`: Google Ads · SEO local
- `p`: Entende
- `h3`: Entender a oferta na primeira tela.
- `p`: O que a empresa oferece, para quem e como entrar em contato, já na primeira tela.
- `p`: Site sob medida · Arquitetura de conteúdo
- `p`: Confia
- `h3`: Passar confiança antes da conversa.
- `p`: Visual coerente, responsáveis identificados e processo explicado ajudam a avaliar a empresa.
- `p`: Direção visual · Conteúdo
- `p`: Chama
- `h3`: Transformar interesse em contato.
- `p`: Um caminho claro para o contato. Formulários, agendamento e avisos podem compor o escopo.
- `p`: Formulário integrado · Meta Ads
- `div` _(demonstração visual desktop, Encontra)_: Demonstração conceitual · Atria Clinic; 01 / 04; clínica de estética em vitória; Patrocinado · avaliação; Dermatologia estética em Vitória | Atria Clinic; Avaliação individual e protocolos explicados sem pressa. Agende on-line.; blog › primeira consulta; Avaliação de pele em Vitória: como funciona a primeira consulta
- `div` _(cartões ilustrativos, Entende)_: Teste dos 5 segundos · 00:05; O que é — Dermatologia estética; Para quem — Quem quer cuidar da pele sem pressa; Próximo passo — Agendar avaliação
- `div` _(cartão ilustrativo, Confia)_: Sistema visual; Aa; Cormorant · títulos; Aa; Jost · textos; Sinais de confiança; Responsável técnica identificada; Duração da avaliação: 50 min; Horários reais para escolher
- `div` _(cartões ilustrativos, Chama)_: Novo pedido de avaliação; agora · enviado pelo site; Interesse — Avaliação de pele; Melhor horário — Quinta, 14h00; Origem — Anúncio no Google; LEMBRETE · INSTAGRAM; Sua avaliação, no seu tempo.; Agendar
- `div` _(alternativa visual celular)_: estética em vitória; Patrocinado · Atria Clinic; Dermatologia estética em Vitória; Avaliação individual. Agende on-line.; Atria Clinic › blog; Avaliação de pele em Vitória: como funciona; Novo pedido de avaliação; Avaliação de pele · quinta, 14h · via Google; Teste dos 5 s · 00:05; O que é: dermatologia estética; Para quem: quem quer cuidar da pele sem pressa; Próximo passo: agendar; Sistema visual; Responsável técnica; Avaliação de 50 min; Horários reais
- `div` _(instrução visual)_: Role para avançar

### O site é o centro. O resto trabalha para ele. (`#servicos`)
- `p`: Serviços
- `figcaption`: Tudo começa pelo site. Os serviços mensais trabalham para levar as pessoas certas até ele.
- `div` _(centro da ilustração orbital)_: Site · sob medida
- `button` _(com JavaScript pronto)_: Pausar animação / Retomar animação; com movimento reduzido: Animação estática
- `h3`: Sites sob medida
- `span`: Projeto · a partir de R$ 1.490
- `p`: Sites institucionais, landing pages e páginas de serviço, desenhados a partir do que sua empresa precisa comunicar.
- `h3`: SEO local
- `span`: Mensal
- `p`: Estrutura técnica, conteúdo e presença nas buscas da sua cidade, para aparecer quando procuram pelo que você faz.
- `h3`: Google Ads
- `span`: Mensal · mídia à parte
- `p`: Campanhas de pesquisa para apresentar sua empresa em buscas relacionadas ao serviço. Exibição e posição dependem do leilão e da qualidade da campanha.
- `h3`: Meta Ads
- `span`: Mensal · mídia à parte
- `p`: Anúncios no Instagram e no Facebook para ser lembrado por quem ainda está decidindo.
- `h3`: Manutenção e evolução
- `span`: Plano mensal
- `p`: Atualizações, segurança, ajustes de conteúdo e melhorias contínuas depois que o site está no ar.

### Uma entrega cuidada também por dentro.
- `p`: Por baixo do capô
- `p`: O checklist orienta o projeto e a revisão antes de publicar. As verificações concluídas ficam documentadas na entrega; cada integração depende do escopo e dos acessos disponíveis.
- `div` _(terminal ilustrativo)_: unolabs / checklist-de-entrega; itens previstos; `$ uno entrega --verificar`; A verificar — HTML semântico + dados estruturados (Schema.org); A verificar — Medir carregamento, resposta aos toques e estabilidade visual; A verificar — Imagens AVIF/WebP com espaço reservado; A verificar — Sitemap, endereço principal e configuração do Search Console; A verificar — Acessibilidade com meta WCAG 2.2 AA; A verificar — Validar proteção contra spam e recebimento dos contatos; A verificar — Revisar política de privacidade e fluxo de dados; A verificar — Domínio e acessos em nome da sua empresa; `$`

### Três negócios. Três direções visuais. (`#projetos`)
- `p`: Estudos de direção
- `p`: Estudos conceituais criados por nós para mostrar direção, acabamento e comportamento. Mostram decisões de design, sem representar trabalhos de clientes ou resultados medidos. Os controles dentro das maquetes são ilustrativos.
- `span` _(estudo 01)_: ESTUDO 01 · ENGENHARIA INDUSTRIAL B2B; Estudo conceitual; Módulo Engenharia · estudo conceitual
- `span` _(estudo 02)_: ESTUDO 02 · DERMATOLOGIA ESTÉTICA; Estudo conceitual; Atria Clinic · estudo conceitual
- `span` _(estudo 03)_: ESTUDO 03 · RESTAURANTE AUTORAL; Estudo conceitual; Casa Noma · estudo conceitual
- `figcaption` _(alternativa sem JavaScript, repetida em cada estudo)_: Imagem do estudo conceitual. As decisões estão descritas ao lado.
- `h3`: Módulo Engenharia
- `dt`: Objetivo
- `dd`: Explicar um serviço técnico complexo e gerar pedidos de proposta qualificados.
- `dt`: Decisão em destaque
- `dd`: Imagem conceitual estrutural com cotas geométricas discretas e ficha técnica no lugar de adjetivos.
- `button`: Rever animação
- `h3`: Atria Clinic
- `dt`: Objetivo
- `dd`: Transmitir calma e segurança e levar a pessoa até a avaliação.
- `dt`: Decisão em destaque
- `dd`: Retrato conceitual e detalhes de cuidado no lugar de fotos de antes e depois; agenda visível já na primeira tela.
- `button`: Rever animação
- `h3`: Casa Noma
- `dt`: Objetivo
- `dd`: Traduzir a atmosfera da casa e transformar vontade em reserva.
- `dt`: Decisão em destaque
- `dd`: Imagem conceitual gastronômica e menu da estação em destaque, com reserva demonstrativa sem sair da primeira tela.
- `button`: Rever animação

### Direção antes da execução. Cuidado até a entrega. (`#processo`)
- `p`: Como trabalhamos
- `p`: Escopo, investimento e prazo ficam definidos na proposta, antes do início. Você sabe o que vai receber e quando.
- `h3`: Entender
- `p`: Conversa sobre a empresa, a oferta, o público e o que precisa mudar no digital.
- `p`: Entrega: contexto e prioridades
- `h3`: Direcionar
- `p`: Estrutura das páginas, mensagem e direção visual, validadas com você antes de construir.
- `p`: Entrega: mapa do site e conceito visual
- `h3`: Construir
- `p`: Design e desenvolvimento juntos, pensando o celular desde o início.
- `p`: Entrega: versão navegável para revisão
- `h3`: Publicar
- `p`: Revisão final, testes de velocidade e formulários, domínio configurado e site no ar.
- `p`: Entrega: site publicado e acessos documentados
- `p`: Depois, se fizer sentido: evoluir. SEO, anúncios e manutenção mensal, contratados à parte e no seu ritmo.

### Investimento
- `p`: Projetos a partir de
- `p`: R$ 1.490
- `p`: em até 10x sem juros
- `p`: A proposta reúne estrutura, conteúdo, direção visual e funcionalidades. Produção de textos e imagens, mais páginas e integrações podem ampliar o trabalho. Entregas, prazo e investimento ficam definidos antes do início.
- `a`: Pedir minha proposta
- `h3`: O que define o valor
- `li`: Quantidade de páginas e seções
- `li`: Organização e produção de conteúdo
- `li`: Direção visual e interações
- `li`: Integrações e formulários
- `h3`: Garantia
- `p`: A garantia cobre a correção de falhas no que foi entregue. Prazo e condições ficam na proposta. Novas páginas, mudanças de conteúdo e novas funções são alterações posteriores, contratadas à parte no plano de manutenção ou em outro serviço.
- `h3`: Serviços mensais
- `p`: SEO, Google Ads, Meta Ads e manutenção têm escopo e valor próprios. A verba de mídia fica separada da gestão. A forma de pagamento será definida na proposta.

### Para empresas que tratam o digital como parte do negócio.
- `p`: Para quem
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
- `p`: Experiências em negócios, tecnologia e comunicação que orientam os sites, as campanhas e o conteúdo da UNO Labs.
- `article`: Urias Loures
- `img`: retrato de Urias Loures
- `h3`: Urias Loures
- `p`: Cofundador da UNO Labs
- `p`: Empresário, Urias combina experiência prática em gestão de negócios com mais de seis anos de atuação em Meta Ads e uma trajetória que inclui mais de 1 milhão investidos em marketing.
- `p`: Na UNO Labs, conecta sua vivência em vendas, atendimento e aquisição de clientes à criação de sites e campanhas, com foco em comunicar o valor da empresa, atrair públicos relevantes e facilitar o contato comercial.
- `article`: Bruno Gonzaga
- `img`: retrato de Bruno Gonzaga
- `h3`: Bruno Gonzaga
- `p`: Cofundador da UNO Labs
- `p`: Com duas décadas de experiência em tecnologia e atuação em projetos para Bradesco, HSBC, Dow Jones e uma grande fintech brasileira, Bruno reúne competências em arquitetura de software, sistemas em nuvem, liderança técnica e automação com IA.
- `p`: Na UNO Labs, aplica essa experiência à construção de sites rápidos, confiáveis e bem estruturados, com atenção à qualidade técnica, à experiência do visitante e à evolução de cada projeto.
- `article`: Milena Dias
- `img`: retrato de Milena Dias
- `h3`: Milena Dias
- `p`: Comunicação e Conteúdo
- `p`: Formanda em Publicidade e Propaganda, Milena combina experiência de marketing e atendimento ao cliente com conhecimentos em UGC e social media.
- `p`: Na UNO Labs, contribui para uma comunicação clara e próxima do público, ajudando a apresentar o valor de cada empresa e responder às dúvidas de quem está decidindo contratar.

### Conteúdo para decidir melhor. (`#blog`)
- `p`: Blog
- `p`: Guias práticos sobre sites, SEO local e anúncios. Os temas abaixo estão previstos. Os artigos ainda não estão disponíveis.
- `p`: Guia Em breve
- `h3`: Quanto custa um site profissional e o que muda o preço
- `p`: Páginas, conteúdo, direção visual e integrações: o que entra na conta e como comparar propostas diferentes sem cair só no preço.
- `p`: Comparativo Em breve
- `h3`: Site institucional ou landing page: qual sua empresa precisa agora?
- `p`: SEO local Em breve
- `h3`: Como aparecer no Google quando procuram pelo seu serviço em Vitória e Vila Velha

### Perguntas antes de começar. (`#duvidas`)
- `p`: Dúvidas
- `p`: Não encontrou sua dúvida? Fale com a gente.
- `a`: Fale com a gente
- `summary`: Quanto custa um projeto?
- `p`: Projetos começam em R$ 1.490, em até 10x sem juros. O valor final depende do número de páginas, do conteúdo, da direção visual e das funcionalidades. Você recebe a proposta fechada antes de começar.
- `summary`: Quanto tempo leva?
- `p`: O prazo depende do escopo, do conteúdo e das validações. O cronograma fica definido na proposta antes do início.
- `summary`: O que a garantia cobre?
- `p`: A garantia cobre a correção de falhas no que foi entregue. Prazo e condições ficam na proposta. Alterações de conteúdo, novas páginas e funções são contratadas à parte no plano de manutenção ou em outro serviço.
- `summary`: Vocês garantem a primeira posição no Google?
- `p`: Não. A posição depende de fatores que nenhuma empresa controla sozinha. Entregamos a base técnica, o conteúdo e o acompanhamento que aumentam as chances de sua empresa aparecer nas buscas da sua região.
- `summary`: Como funcionam os anúncios no Google e no Meta?
- `p`: Planejamos, criamos e acompanhamos as campanhas. A verba de mídia fica separada da gestão. A forma de pagamento será definida na proposta.
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
- `p`: Conte o momento da sua empresa e o que você quer construir. A conversa começa pelo contexto para chegar a uma proposta coerente.
- `a`: Prefere conversar agora? WhatsApp · (27) 93618-5141
- `a`: E-mail contato@unolabs.com.br
- `p`: Para enviar o formulário, ative o JavaScript. Você também pode escrever para contato@unolabs.com.br ou conversar pelo WhatsApp: (27) 93618-5141.
- `a`: contato@unolabs.com.br
- `a`: WhatsApp: (27) 93618-5141
- `label`: Seu nome
- `span`: Informe seu nome com pelo menos 2 caracteres.
- `label`: Empresa
- `span`: Informe a empresa com pelo menos 2 caracteres.
- `label`: WhatsApp ou e-mail para retorno
- `span`: Informe um WhatsApp com DDD ou um e-mail válido.
- `label`: Site atual (opcional)
- `legend`: Do que você precisa?
- `label`: Site
- `label`: SEO
- `label`: Google Ads
- `label`: Meta Ads
- `label`: Manutenção
- `label`: O que você quer construir ou melhorar?
- `span`: Conte o objetivo, a situação atual e o que é importante para você.
- `span`: Descreva o projeto com pelo menos 10 caracteres.
- `label`: Investimento previsto
- `option`: Selecione
- `option`: Até R$ 3 mil
- `option`: De R$ 3 mil a R$ 6 mil
- `option`: De R$ 6 mil a R$ 10 mil
- `option`: Acima de R$ 10 mil
- `option`: Ainda não definido
- `label`: Deixe este campo em branco
- `p`: Seus dados são usados para avaliar o projeto e responder ao contato. Política de privacidade.
- `a`: Política de privacidade
- `button`: Enviar contexto do projeto
- `h3`: Seu contexto foi encaminhado.
- `p`: O serviço de e-mail aceitou o encaminhamento para a UNO Labs. Vamos responder pelo canal informado. Essa confirmação ainda não comprova o recebimento na caixa postal.
- `button`: Enviar outro pedido

### Rodapé
- `p`: Presença digital que gera oportunidades.
- `span`: Navegação
- `a`: Serviços
- `a`: Projetos
- `a`: Abordagem
- `a`: Blog
- `a`: Contato
- `span`: Serviços
- `a`: Criação de sites
- `a`: SEO local
- `a`: Google Ads
- `a`: Meta Ads
- `a`: Manutenção
- `span`: Atendimento
- `a`: Política de privacidade
