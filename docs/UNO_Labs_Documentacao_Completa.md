# UNO Labs — Documentação completa de marca, posicionamento e site

**Versão 1.8 · 09 de outubro de 2026. Registra a identidade, o escopo e o catálogo de produtos decididos na issue #30 (confirmação de Urias pendente). A Parte 0 prevalece sobre o restante.**
**Destinatários:** direção da UNO Labs, Claude, Codex, profissionais de marca, design e desenvolvimento.

> **Sites sob medida para negócios que precisam ser percebidos à altura do que entregam.**
>
> Direção high ticket. Clareza estratégica. Qualidade criativa. Execução cuidadosa.
>
> **Conceito proposto para o site: Precisão que se revela.**

Este arquivo reúne integralmente os seis documentos temáticos do pacote. A base da empresa e da identidade foi extraída das fontes consultadas. O foco high ticket e a exigência de um site excepcional vêm do pedido do usuário. O aprofundamento do posicionamento, o conceito de experiência, os recortes de público, a copy e os requisitos de execução são propostas desenvolvidas nesta entrega, não aprovações históricas ou resultados medidos.

A documentação orienta a marca e o site. A implementação vigente tem fontes Astro em `src/`, dentro do checkout oficial `04 - SITE`, ativos em `public/` e saída estática gerada em `dist/`. O [LEIA-ME](../LEIA-ME.md) é o manual operacional central; o [relatório da migração](verificacoes/migracao-astro7-ts/RELATORIO.md) registra verificações, limitações e estado da integração. Contatos, produção e outros dados continuam com pendências.

## Conteúdo

0. Decisões vigentes (v1.8), que prevalecem sobre as demais partes.
1. Marca, posicionamento e geração de valor.
2. Especificação estratégica, criativa e funcional do site.
3. Copy proposta para as páginas e interações.
4. Critérios de aceite, testes e revisão.
5. Fontes, conflitos, precedência e decisões.
6. Prompts para alinhamento, criação, implementação e revisão.

Este arquivo, em `04 - SITE/docs/UNO_Labs_Documentacao_Completa.md`, é a referência vigente de marca, posicionamento e requisitos. O documento de construção fica ao lado; as regras obrigatórias de colaboração estão no `AGENTS.md` da raiz do checkout e prevalecem nas operações de Git e publicação. O acervo original de marca continua na pasta externa `01 - IDENTIDADE VISUAL`. Os arquivos de `02 - DOCUMENTACAO` são apenas avisos de transferência. Trechos superados por decisões anteriores estão marcados com **[v1.1]**; atualizações posteriores constam na Parte 0.

---


# PARTE 0 — Decisões vigentes (v1.8 · 09/10/2026)

**Esta parte prevalece sobre as Partes I a VI.** Ela reúne as respostas do usuário (Urias Loures) de 29/09/2026, a padronização da pasta e os contatos de 30/09/2026, a equipe e fotografias aprovadas em 01/10/2026, a migração Astro autorizada em 02/10/2026 e a identidade, o escopo e o catálogo de produtos de 09/10/2026 (§0.14). As Partes I a VI conservam propostas e registros históricos; não autorizam reintroduzir HTML sem framework, instalar integrações adiadas ou tratar decisões antigas como implementação comprovada. Em caso de conflito, valem as decisões mais recentes registradas aqui.

## 0.1 A empresa

1. **UNO Labs** é o nome definitivo do que seria a “Audaro — Engenharia Digital”, que nunca chegou a existir publicamente. Não há domínio antigo para redirecionar.
2. A **Audaro — Engenharia de Resultado** (consultoria de IA, desenvolvimento de software) é outra empresa, com outro foco. Automações, agentes de IA e atendimento via WhatsApp/RAG pertencem a ela, não à UNO Labs. Não misturar as duas na comunicação. **[v1.8]** O atendimento no WhatsApp com equipe humana passa a ser o produto UNO Chat (§0.14). Automação e consultoria de IA continuam fora da UNO até decisão registrada na §0.14.
3. **Domínio:** unolabs.com.br (registrado).

## 0.2 Serviços ativos

**[v1.8]** O catálogo abaixo foi reorganizado em produtos e adicionais na §0.14: criação de sites e manutenção viram a assinatura UNO Sites, sem projeto com pagamento único; Ads e SEO local viram adicionais; hospedagem, domínio e e-mail no domínio entram na assinatura; o e-mail marketing vira UNO Mail. A tabela fica como registro até a home ser atualizada (#36).

| Serviço | Formato | Observação |
|---|---|---|
| Criação de sites (institucional, landing page, páginas de serviço) | Projeto | Serviço central |
| SEO (foco local) | Mensal | Nunca prometer posição |
| Google Ads | Mensal | Verba de mídia paga direto à plataforma — **confirmar** |
| Meta Ads | Mensal | Verba de mídia paga direto à plataforma — **confirmar** |
| Plano de manutenção e evolução | Mensal | Única forma de alterar o site depois de entregue |
| E-mail marketing gerenciado (`/email-marketing/`) | Mensal | Instância exclusiva por cliente; preço público **sob consulta** até Bruno e Urias fecharem valor e provedor de envio. Nunca prometer chegada à caixa de entrada |

Hospedagem, domínio e e-mail corporativo como serviços oferecidos: **confirmar** antes de anunciar. **E-commerce:** fora do escopo por enquanto.

## 0.3 Condições comerciais

**[v1.8]** Os itens 1, 2 e 4 são substituídos pelos planos, preços e prazos da §0.14 depois da confirmação de Urias; até a home mudar (#36), o site publicado continua com o item 1.

1. **Preço público:** “Projetos a partir de R$ 1.490,00 em até 10x sem juros”. É o único valor publicável.
2. **Ticket desejado:** projetos bem acima do piso, até cerca de R$ 10 mil.
3. **Garantia:** cobre falhas no que foi entregue. Não inclui alterações no site; alterações só pelo plano de manutenção mensal ou outro serviço contratado. Os termos e o prazo são definidos na proposta; não publicar número ou marcador provisório na home.
4. **Prazo do projeto:** definido para cada escopo na proposta. Não anunciar prazo típico ou número fixo na home.
5. **Qualificação no formulário:** faixas “até R$ 3 mil / R$ 3 a 6 mil / R$ 6 a 10 mil / acima de R$ 10 mil / ainda não definido”.

## 0.4 Público e geografia

1. **Segmentos prioritários:** os que mais dependem de presença digital e têm caixa para investir acima de R$ 1,5 mil — arquitetura e interiores; engenharia e construção; clínicas e consultórios; advocacia, contabilidade e consultorias; gastronomia e hospitalidade autorais.
2. **Atuação:** todo o Brasil, de forma remota. **Atendimento presencial:** Grande Vitória/ES e Curitiba/PR.
3. **SEO local prioritário:** Vitória, Vila Velha, Serra e Cariacica (ES) e Curitiba (PR). A resposta original dizia “Curitiba/ES”; foi registrado como Curitiba/PR.

## 0.5 Equipe

**Apoio da seção:** Experiências em negócios, tecnologia e comunicação que orientam os sites, as campanhas e o conteúdo da UNO Labs.

**Urias Loures**
Cargo: Cofundador da UNO Labs

Empresário, Urias combina experiência prática em gestão de negócios com mais de seis anos de atuação em Meta Ads e uma trajetória que inclui mais de 1 milhão investidos em marketing.

Na UNO Labs, conecta sua vivência em vendas, atendimento e aquisição de clientes à criação de sites e campanhas, com foco em comunicar o valor da empresa, atrair públicos relevantes e facilitar o contato comercial.

**Bruno Gonzaga**
Cargo: Cofundador da UNO Labs

Com duas décadas de experiência em tecnologia e atuação em projetos para Bradesco, HSBC, Dow Jones e uma grande fintech brasileira, Bruno reúne competências em arquitetura de software, sistemas em nuvem, liderança técnica e automação com IA.

Na UNO Labs, aplica essa experiência à construção de sites rápidos, confiáveis e bem estruturados, com atenção à qualidade técnica, à experiência do visitante e à evolução de cada projeto.

**Milena Dias**
Cargo: Comunicação e Conteúdo

Formanda em Publicidade e Propaganda, Milena combina experiência de marketing e atendimento ao cliente com conhecimentos em UGC e social media.

Na UNO Labs, contribui para uma comunicação clara e próxima do público, ajudando a apresentar o valor de cada empresa e responder às dúvidas de quem está decidindo contratar.

**Fotografias e apresentação aprovadas em 01/10/2026:** os arquivos originais fornecidos são foto-apresentacao-urias-loures.jpeg (1122 × 1402), foto-apresentacao-bruno-gonzaga.jpeg (640 × 640) e foto-apresentacao-milena-novaes.png (1122 × 1402). Preservar os originais na pasta externa. Os derivados WebP locais ficam na pasta public/assets/img/equipe/ e são urias-loures-320.webp, urias-loures-640.webp, bruno-gonzaga-320.webp, bruno-gonzaga-640.webp, milena-dias-320.webp e milena-dias-640.webp. Os nomes públicos nos derivados são Urias Loures, Bruno Gonzaga e Milena Dias.

A preparação limita-se ao recorte, à conversão e à compressão, sem retoques ou geração. Usar WebP qualidade 85 e Lanczos, com crop quadrado a partir do topo sem cortar o rosto. Não ampliar o original de Bruno, que já tem 640 × 640 px. Exibir as fotos em no máximo 320 px para preservar a resolução de Bruno em DPR2.

A ordem de cada article é retrato, h3 com o nome, cargo e os dois parágrafos aprovados. A grade usa uma coluna abaixo de 700 px, duas entre 700 e 1099 px e três a partir de 1100 px. Delimitar o CSS a .equipe. A foto é quadrada, tem largura 100% e máximo de 320 px; o nome usa 26 px e a biografia 17 px com line-height 1.65. Usar margens e divisórias discretas, compatíveis com Pine, Mint e Inter. Não usar alturas fixas, controles, hover ou animação.

## 0.6 Mensagem

1. **Headline:** “Presença digital que atrai clientes.” (escolha do usuário). A assinatura da marca continua: “Presença digital que gera oportunidades.”
2. **Promessa permitida:** os serviços **podem** tornar a empresa mais fácil de encontrar no Google e percebida com mais autoridade. **Proibido:** garantir posição, vendas ou resultado.
3. **“Rápido”** descreve qualidade técnica (o site carrega rápido), nunca prazo de entrega. **[v1.8]** Exceção: os prazos fixos do UNO Sites (5 e 10 dias úteis, §0.14) podem ser anunciados como prazo, sem usar “rápido” para descrevê-los.

## 0.7 Identidade visual

1. **Kit oficial:** pasta `01 - IDENTIDADE VISUAL` (logos em `02_logos`, manual `UNO_Labs_Manual_Completo.md`). O segundo manual citado na v1.0 (`MANUAL_COMPLETO.md`) não faz parte do projeto e foi desconsiderado.
2. **Logo reconstruído em vetor:** aprovado para uso no site.
3. **Tipografia:** Inter mantida por enquanto. Em avaliação no canvas de Design: **A)** Newsreader nos títulos + Inter no texto; **B)** Schibsted Grotesk nos títulos + Inter no texto; **C)** Inter em tudo (atual).
4. **Não herdar** a linguagem das imagens geradas por IA: ícones em quadradinhos, pílulas de destaque, rótulos em fonte mono com bolinha, títulos com uma palavra em Mint, cards numerados 01–04 e fundo escuro com brilho.

## 0.8 Stack técnica de unolabs.com.br

**Frontend vigente — migração de 02/10/2026:** Astro `7.3.5`, TypeScript estrito e MDX `8.0.2`, com HTML gerado no build em `dist/`. A condição antiga de aguardar os artigos (D28) foi substituída pela decisão de migrar agora. Isso não comprova integração na `main`, publicação no domínio ou homologação do contato: consultar o [relatório da migração](verificacoes/migracao-astro7-ts/RELATORIO.md).

| Camada | Estado e decisão |
|---|---|
| Framework | Astro 7, `output: 'static'`, URLs com barra final, `astro/tsconfigs/strict`; sem SSR, SPA, adaptador ou framework de interface adicional |
| Fontes | Páginas em `src/pages/`, seções em `src/components/home/`, layouts e SEO compartilhados; scripts tipados em `src/scripts/` |
| Blog | Coleção `.mdx` em `src/content/blog/`, com seis textos do PR #7 em revisão na prévia; schema em `src/content.config.ts`, autores aprovados e seleção central em `src/lib/blog.ts` |
| Contrato editorial | `title`, `description`, `tags`, `cover`, `coverAlt` obrigatórios; `pubDate` e `author` exigidos para publicar e validados quando fornecidos em rascunhos; `draft` padrão `true`; `updatedDate` opcional e coerente. Capa local existente, autor válido e slug derivado do arquivo; publicação somente com `draft === false` e data não futura, comparada por dia UTC |
| Estilo e ativos | CSS global nativo em `src/styles/`, na ordem fonts → site → conceitos; tokens `--uno-*` e ativos locais preservados em `public/` |
| Runtime e build | Node `24.14.1`, npm `11.11.0`, lockfile; build obrigatório `astro check && astro build`. Operação centralizada no [LEIA-ME](../LEIA-ME.md) |
| Prévia | Vercel estática: build `npm run build`, saída `dist/`, target `preview` padrão; HTML com `noindex, nofollow` e cabeçalho de teste incondicional em `vercel.json`. Prévia remota somente é evidência quando versão e respostas forem comprovadas |
| Canonical | Origem `https://unolabs.com.br` em `src/data/site.ts`; não substituí-la pelo domínio de teste. `production` é capacidade local para conferir diretivas, sem autorização de publicação |
| Hospedagem oficial | Cloudflare Workers com Static Assets continua planejada. `wrangler.jsonc` preservado ainda serve `./public`, incompatível com as páginas do build; integração com `dist/` adiada |
| Publicação | Atalho `npm run deploy` bloqueado localmente, sem rede. Dry run `verificar:legado` verifica somente a configuração antiga; não publica nem homologa Astro |
| Formulário | Cliente mantém `POST /api/contato` e só confirma com `ok === true` e `encaminhamento === 'smtp_aceito'`. Worker → n8n → SMTP HostGator é o fluxo previsto preservado; prévia estática sem receptor deve falhar honestamente e manter os dados |
| Métricas e proteção | GA4 (`G-ZKM57KG6V9`) implementado com consentimento básico v2, eventos de formulário/contato e bloqueio fora de produção oficial; Clarity, pixels, Search Console e ativação de Turnstile ficam para etapas posteriores |
| E-mail | Plano HostGator M contratado; operação, conta, DNS, credenciais, remetente e recebimento continuam sem homologação. Não alterar MX, `mail`, SPF, DKIM, DMARC ou Email Routing nesta migração |

**Histórico técnico superado:** a v1.3 lançou uma implementação local de HTML, CSS e JS em `public/`, com Worker próprio e alternativa Apache/PHP. A proposta anterior de adapter `@astrojs/cloudflare`, rota SSR e deploy direto não foi implementada nesta migração e não é receita operacional vigente. A escolha histórica da Cloudflare permanece; conferir a documentação oficial e o ambiente real em uma tarefa específica de produção antes de configurar a integração. Não enviar somente `public/`, que agora contém ativos.

O menu Blog abre `/blog/`. Na prévia, a listagem e os cartões da home levam aos seis textos reais importados do PR #7, sinalizados como “Em revisão editorial”. Os artigos usam `draft: true` e `preview: true`; produção exclui rascunhos e RSS permanece adiado. [Origem e créditos da importação](blog/importacao-pr7.md). O [LEIA-ME](../LEIA-ME.md) inclui exemplo de frontmatter fora da coleção. Identificadores de autores aprovados não atribuem autoria de artigo por inferência. O schema também valida rascunhos; a seleção de publicados alimenta o sitemap, e a prévia permite adicionalmente os rascunhos de revisão autorizados pela flag `preview`.

## 0.9 Blog

1. **Aprovado desde o lançamento:** 4 a 6 artigos-pilar na estreia; depois 2 por mês, podendo chegar a 4.
2. **Produção:** IA (Claude, Grok ou ChatGPT) com revisão e edição humana obrigatórias antes de publicar. Cada artigo tem autor identificado da equipe.
3. **Pautas-pilar:** quanto custa um site profissional; site institucional × landing page; como escolher quem faz o site da empresa; velocidade do site e resultado do negócio; SEO para empresas de serviço; presença digital para arquitetura, engenharia e clínicas.

## 0.10 Canais

Contatos comerciais confirmados pelo usuário em 30/09/2026:

- E-mail: `contato@unolabs.com.br`.
- WhatsApp exibido: `(27) 93618-5141`.
- Link do WhatsApp: `https://wa.me/5527936185141`.
- Telefone em formato internacional: `+5527936185141`.

A confirmação dos dados não comprova que links, caixa postal, DNS, Worker, n8n ou SMTP estejam configurados ou funcionando. Instagram e LinkedIn ficam para depois.

## 0.11 Pendências

Os contatos confirmados já estão no HTML e no JSON-LD; os links `mailto:` e WhatsApp foram conferidos localmente. Isso não comprova funcionamento da caixa ou entrega de e-mail.

| Item | Situação | Bloqueia publicação? |
|---|---|---|
| Pacote inicial a partir de R$ 1.490 | **[v1.8]** Substituído pelos planos do UNO Sites (§0.14); confirmar com Urias e atualizar a home (#36) | Sim |
| CNPJ e razão social | Dados empresariais a informar ou confirmar | Sim, para formalizar cobrança e identificação da empresa |
| Caixa `contato@unolabs.com.br` | Endereço confirmado; existência e recebimento na caixa ainda não homologados | Sim |
| Política de privacidade | Rascunho em `src/pages/politica-de-privacidade/index.astro`; completar o fluxo real, responsável, contato de privacidade, local do n8n, prazo de guarda e data; fazer revisão jurídica | Sim |
| Worker, n8n e SMTP HostGator | Validar configuração real e o contrato de resposta `{"ok":true,"encaminhamento":"smtp_aceito"}`; configuração, credenciais e remetente autorizado não estão comprovados | Sim, para o formulário |
| Homologação do e-mail | Registrar em separado a aceitação do backend, a aceitação/encaminhamento pelo SMTP e o recebimento observado na caixa de destino | Sim |
| Equipe | Cargos, textos integrais e fotografias aprovados em 01/10/2026 na Parte 0, §0.5; conferir a aplicação no site antes da publicação | Não |
| Termos comerciais de prazo e garantia | Informar as condições na proposta de cada escopo; não preencher números ou marcadores provisórios na home | Não |
| Verba de mídia paga direto às plataformas | **[v1.8]** Decidido: verba à parte, paga pelo cliente (§0.14); confirmar com Urias | Não |
| Hospedagem, domínio e e-mail como serviços | **[v1.8]** Decidido: incluídos na assinatura do UNO Sites (§0.14); confirmar com Urias | Não |
| E-mail marketing gerenciado | Definir preço público e escopo dos planos. Provedor de envio em avaliação: AWS SES (nova tentativa de aprovação em andamento), plano B SendGrid, alternativa MillionSend (código aberto) a avaliar. Móveis planejados confirmado como segmento prioritário (08/10/2026); demais segmentos a validar. Valores internos não entram neste repositório público; nomes de ferramentas e provedores não entram no site | Não; a página publica "sob consulta" |
| Perfil de Empresa no Google | Não existe; depende de endereço verificável | Não, mas limita o SEO local |
| Cases reais com autorização (La Bella Mesa e outros) | Pendência futura | Não |
| Escolha final de tipografia (A, B ou C) | Em avaliação | Não |

Roteiro para registrar evidências de homologação: [docs/CONTATO_HOMOLOGACAO.md](CONTATO_HOMOLOGACAO.md).

## 0.12 Experiência da home (v1.2)

1. **Hero “do projeto ao site”:** a composição da direita mostra o wireframe técnico de um estudo conceitual e uma linha de varredura Mint revela o site final por cima em uma animação finita de 4 s. Ao lado, um cartão de código com o `<title>`, a meta description e os dados estruturados do estudo. O fundo tem a grade da marca, iluminada em Mint sob o cursor. Com movimento reduzido, aparece direto o site final.
2. **Jornada presa na tela (sticky scroll / scrollytelling):** quando o conteúdo cabe na altura útil medida, “Da busca ao contato” fica fixa por três alturas estáveis de tela. As etapas Encontra, Entende, Confia e Chama dividem esse percurso em quatro intervalos iguais; a rolagem continua nativa e os marcadores são clicáveis. Se o conteúdo não couber ou a pessoa preferir movimento reduzido, as quatro explicações aparecem em sequência estática.
3. **Estudos conceituais como capítulos:** cada estudo ocupa uma faixa com a paleta do próprio projeto, com versões desktop e celular lado a lado.
4. **“Por baixo do capô”:** painel em estilo terminal com o que toda entrega inclui (metas de Core Web Vitals, dados estruturados, sitemap, acessibilidade, anti-spam, LGPD). São metas e itens de entrega, nunca resultados medidos.
5. **Animações:** a revelação do hero dura 4 s; as sequências dos estudos também duram 4 s de tempo visível real, pausam quando saem da área visível e podem ser repetidas pelo controle “Rever animação”. A preferência por movimento reduzido é aplicada ao carregar a página e quando o sistema muda essa preferência; as animações são suprimidas e os estados finais ficam estáticos.

**Correção solicitada em 01/10/2026:** a ilustração “O site é o centro” mantém o giro contínuo aprovado de 90 s, a contrarrotação dos rótulos e a onda Mint de 3,2 s. Há controle visível para pausar/retomar, pausa fora da área visível e com aba oculta. Sem JavaScript ou com movimento reduzido, a figura fica completa e estática. As cores dos títulos e textos da seção são as mesmas do checkpoint anterior ao adapt; não foram substituídas por preto.


## 0.13 Pasta oficial, análises e Git (D29 · 30/09/2026)

**Única pasta oficial:** `D:\00 - PROJETOS\01 - UNO LABS - LP\04 - SITE`.

| Operação | Fonte obrigatória |
|---|---|
| Análise visual, mensagem, Impeccable e prévia localhost | Fontes Astro em `src/` e build correspondente em `dist/`, dentro de `04 - SITE`; ativos em `public/` |
| Atualizações de conteúdo, código, configuração e documentação | O mesmo checkout `04 - SITE`; documentação em `docs/` |
| Git e GitHub | Executar Git em `04 - SITE`; remoto `https://github.com/uno-labs-br/uno-labs.git` |
| Conteúdo enviado ao repositório | Conteúdo interno de `04 - SITE` diretamente na raiz: `src/`, `public/`, `worker/`, `docs/`, regras e configurações; saída gerada não versionada |
| Hospedagem oficial planejada | Cloudflare Workers; integração com `dist/` pendente. Worker separado preservado; configuração legada ainda aponta para `public/` |

Desenvolvimento: `npm run dev` inicia somente o frontend Astro. Revisão do resultado compilado: `npm run build` e `npm run preview`, servindo `dist/`. Os comandos e runtime ficam no [LEIA-ME](../LEIA-ME.md). Sempre registrar qual pasta e versão o servidor serve; `public/` sozinho já não contém o site completo. O backend não é iniciado pelo desenvolvimento do frontend.

A pasta `03 - ANALISE LP/uno-labs-main` é **a extração ZIP histórica do protótipo** que estava no GitHub (`Main.dc.html`). Ela não é o checkout, não será usada nas próximas análises e não será enviada como site atual. Pode ser excluída pelos responsáveis se não precisarem do arquivo histórico; a implementação não depende dela. Não apagar automaticamente. `01 - IDENTIDADE VISUAL` é acervo de marca, não outra versão do site; `02 - DOCUMENTACAO` conserva apenas avisos para os novos caminhos.

O Git inicial da pasta geral `01 - UNO LABS - LP` é separado e não possui o papel de repositório do site. Não executar push do site por ele. A documentação vigente foi reunida em `04 - SITE/docs`, incluindo as referências visuais, para acompanhar o código no GitHub.

**Fluxo geral:** fetch do remoto correto → branch baseada na `main` atualizada → alterações e verificações → commit → push somente da branch → PR para `main` → revisão e autorização humana para integrar. Somente na migração de 02/10/2026, Urias autorizou antecipadamente commit, push, PR e merge tecnicamente validado, sem nova aprovação humana; proteções reais e checks continuam obrigatórios. A exceção não autoriza publicação oficial nem se aplica a trabalhos futuros. Um PR aberto não comprova integração; integração não comprova publicação. O relatório registra o estado comprovado.

## 0.14 Identidade, escopo e catálogo (D31 a D38 · 09/10/2026)

**Origem e status:** decisões de Bruno em 09/10/2026, registradas na issue #30 (épico #35), em resposta à pergunta de Urias: “Qual o escopo da UNO? O que a gente quer de fato SER?”. **Preços e decisões aguardam a confirmação de Urias.** Esta seção orienta a reestruturação do site; o site publicado só muda pelos PRs das issues derivadas (#29, #31 a #33 e #36 a #38). Não publicar os novos preços antes da confirmação.

**Motivo:** a UNO começou com sites, SEO e anúncios e foi somando WhatsApp, e-mail, consultoria e automação; a home deixou de explicar o que a empresa faz.

### Arquitetura de marca

UNO Labs é a **marca guarda-chuva**, com home institucional (#29). Cada produto tem landing page própria em subdomínio; os endereços dos subdomínios ainda não foram definidos.

| Produto | O que é | Prioridade | Página atual | Issues |
|---|---|---|---|---|
| **UNO Sites** | Site por assinatura | 1 | Home atual | #31, #36, #38 |
| **UNO Chat** | Atendimento da empresa no WhatsApp, com Chatwoot e WhatsApp Cloud API | 1 | `/whatsapp/` | #33, #37 |
| **UNO Mail** | E-mail marketing gerenciado | 2 | `/email-marketing/` | #32 |
| **UNO CRM** | — | Adiado | — | #34 (fechada) |

### UNO Sites — somente assinatura de 12 meses

| Plano | Entrada | Mensalidade | No ar em |
|---|---|---|---|
| Página única | R$ 497 | R$ 197/mês | 5 dias úteis |
| Institucional (até 5 páginas) | R$ 997 | R$ 297/mês | 10 dias úteis |
| Projetos maiores | Sob consulta | Sob consulta | Sob consulta |

1. **Inclui:** site, hospedagem, domínio, 1 caixa de e-mail no domínio, ajustes mensais e relatório.
2. **Textos:** o cliente envia o material; a UNO escreve e revisa.
3. **Caixa de e-mail extra:** R$ 49/mês por caixa.
4. **Cancelamento antes de 12 meses:** multa de 50% das mensalidades restantes. Termos no contrato (#38).
5. **Sem venda de projeto com pagamento único.**

### UNO Chat

1. **Planos mantidos:** Essencial R$ 147/mês + R$ 297 de implantação; Equipe R$ 247/mês + R$ 497 de implantação.
2. **Combo:** quem assina o UNO Sites ganha a implantação do UNO Chat.
3. **Tecnologia:** Chatwoot + WhatsApp Cloud API (#37).

### Adicionais (fora do destaque da home)

| Adicional | Preço público | Condições |
|---|---|---|
| Google Ads ou Meta Ads | A partir de R$ 1.290/mês | Verba de mídia à parte, paga pelo cliente; mínimo de 3 meses |
| SEO local | A partir de R$ 990/mês | Nunca prometer posição (§0.6) |
| UNO Mail | Sob consulta | Até o provedor de envio estar definido (§0.11) |

### Posicionamento

1. **Não competir por preço com sites feitos por IA.** Diferenciais: prazo curto, site ligado ao WhatsApp e acompanhamento depois de publicado.
2. **Frase proposta para o UNO Sites (home atual):** “Site no ar em 5 dias, ligado ao seu WhatsApp, e a gente cuida depois.”
3. Continuam valendo as proibições da §0.6: não garantir posição, vendas ou resultado.

### Em aberto

- [ ] Confirmação de Urias sobre preços e decisões desta seção.
- [ ] Frase de posicionamento institucional da UNO Labs (guarda-chuva).
- [ ] Onde entram automação/consultoria de IA e vídeos em motion: dentro de um produto, produto próprio ou fora por enquanto. Até a decisão, seguem fora da comunicação (§0.1).
- [ ] Referências de empresas com esse modelo (Urias vai levantar).
- [ ] Endereços dos subdomínios dos produtos.
- [ ] Início da contagem dos prazos de 5 e 10 dias úteis, escopo dos ajustes mensais e conteúdo do relatório: definir no contrato (#38).

---


# PARTE I — Marca, posicionamento e geração de valor


# UNO Labs — Marca, posicionamento e geração de valor

**Documento mestre estratégico · versão 1.0 · 29 de setembro de 2026**\
**Idioma:** português do Brasil. **Uso:** direção de marca, comunicação, projeto do site e contexto para agentes de IA.

> **Ideia que deve orientar o trabalho:** a UNO Labs cria sites sob medida para tornar o valor de um negócio mais claro, perceptível e convincente. Quer atrair projetos de alto valor, sem competir pela produção mais barata de páginas. Seu próprio site precisa ser uma demonstração dessa capacidade: extremamente elegante, tecnicamente bem resolvido e memorável nos detalhes.

## 1. Como interpretar este documento

Este material reúne as fontes consultadas e acrescenta uma proposta estratégica específica para o objetivo high ticket solicitado. Não é uma pesquisa de mercado, um catálogo contratual homologado nem uma comprovação de resultados comerciais.

Há quatro classes de informação. **Base documental** identifica o que está registrado nos manuais e referências. **Diretriz do usuário** identifica o foco high ticket e a exigência de um site excepcional. **Proposta estratégica** identifica formulações, prioridades e soluções desenvolvidas nesta entrega. **A confirmar** identifica fatos empresariais e compromissos que não podem ser preenchidos por imaginação.

Salvo quando identificados como base documental, os posicionamentos ampliados, os recortes de público, a arquitetura de oferta, o processo detalhado e os textos novos são **propostas de trabalho desta versão**. Podem orientar um protótipo completo; não devem ser apresentados como pesquisa validada ou decisão histórica já aprovada.

Para comportamento, páginas, interações e implementação, consultar a Parte II. Para textos prontos, a Parte III. Para origem das informações e conflitos, a Parte V. Para liberação, a Parte IV. As decisões vigentes estão na Parte 0.

## 2. O que é a UNO Labs

### 2.1 Base documental

**UNO Labs é um estúdio de engenharia digital que cria sites profissionais, rápidos e sob medida para empresas brasileiras que desejam mais clareza, confiança e oportunidades de contato.** O nome de apresentação é UNO Labs. Audaro é o nome mantido em arquivos de referência, não o nome a publicar na nova presença digital. [S1, capítulo 01]


### 2.2 Formulação estratégica ampliada

**A UNO Labs une estratégia, direção criativa e desenvolvimento para construir sites à altura de negócios de alto valor. Seu trabalho é organizar mensagem, experiência e tecnologia para que a qualidade da empresa seja percebida antes da primeira conversa comercial.**

A entrega tangível é um site. O papel estratégico proposto é maior: criar uma presença digital que represente bem o negócio, explique sua oferta, dê evidências de competência e facilite um contato com contexto.

A UNO Labs não deve prometer fabricar valor onde não existe. Deve revelar, organizar e comunicar melhor o valor real, ao mesmo tempo em que melhora a experiência digital. Uma interface refinada não substitui a qualidade do serviço do cliente, mas não precisa ficar abaixo dela.

### 2.3 Definição em três níveis

**Em uma frase:** sites sob medida para negócios que precisam ser percebidos à altura do que entregam.

**Em uma apresentação curta:** a UNO Labs é um estúdio de engenharia digital. Conecta estratégia, design e desenvolvimento para criar sites claros, distintos e bem construídos, com foco em apresentar o valor de empresas e facilitar oportunidades de contato.

**Em uma apresentação consultiva:** começamos pelo que o negócio precisa comunicar e pela decisão que seu cliente precisa tomar. A partir desse contexto, organizamos conteúdo, direção visual, navegação e implementação. O objetivo é entregar mais do que uma página bonita: uma experiência digital coerente com a qualidade da empresa e útil à sua jornada comercial.

As duas últimas formulações ampliam a descrição de origem; o processo anunciado deve corresponder ao processo efetivamente adotado.

## 3. O que a empresa não deve parecer

A categoria principal não é “agência que faz de tudo”. Também não é uma fábrica de sites baratos, uma plataforma de templates, um laboratório de inteligência artificial, uma empresa de automações generalistas ou uma consultoria de vendas com crescimento garantido.

A palavra **Labs** integra o nome. Não autoriza inventar laboratório físico, história de fundação, pesquisas próprias, produtos de IA ou uma equipe multidisciplinar não documentada. Os manuais não estabelecem uma narrativa de origem nem credenciais empresariais. [S2, essência]


Na comunicação proposta, a UNO é um **parceiro de presença digital com direção e capacidade de execução**. “Engenharia digital” precisa aparecer em decisões precisas, interfaces funcionais e cuidado de implementação, não em jargões, telas de código decorativas ou símbolos de tecnologia sem relação com a oferta.

Usar Claude ou Codex como ferramentas de criação não transforma, por si só, a oferta da UNO Labs em consultoria de IA. O método de produção e o produto vendido são coisas diferentes.

## 4. A ambição high ticket

### 4.1 Dois objetivos complementares

O direcionamento high ticket deve ser entendido em duas dimensões operacionais:

**Ticket dos projetos da UNO Labs.** Atrair empresas dispostas a investir em um trabalho sob medida, com contexto, direção criativa, construção cuidadosa e responsabilidade de entrega. O objetivo não é vender grande volume pelo menor preço.

**Valor das ofertas dos clientes atendidos.** Priorizar negócios em que confiança, reputação, diferenciação e clareza tenham importância na escolha de serviços, projetos ou soluções de valor elevado. O site deve sustentar essa apresentação, sem prometer sozinho a venda.

Essa interpretação atende ao pedido de alcançar público high ticket. Não significa que todo cliente deva vender luxo, pertencer a um setor específico ou comprovar patrimônio pessoal.

### 4.2 O significado operacional de premium

Para a UNO, premium deve significar **critério, originalidade adequada ao negócio, acabamento e previsibilidade de trabalho**. Não deve significar apenas preço alto, animação pesada ou aparência distante.

A qualidade precisa ser perceptível em toda a experiência: como a empresa explica sua oferta, como mostra projetos, como responde a uma dúvida, como organiza uma proposta e como entrega uma interface funcional. A sensação desejada é “existe intenção e cuidado em cada decisão”, não “adicionaram efeitos para justificar o valor”.

### 4.3 O que não está definido

**[v1.1]** Preço de entrada definido pelo usuário: **“Projetos a partir de R$ 1.490,00 em até 10x sem juros”**. O objetivo é fechar projetos acima desse piso (até cerca de R$ 10 mil). Mensalidades, margens e outros valores continuam sem definição: não publicar números além desse sem nova decisão.

High ticket é uma orientação interna de posicionamento e qualificação. Na página pública, preferir linguagem como “sob medida”, “à altura da sua empresa”, “direção antes da execução” e “uma presença digital coerente com o seu negócio”. Não escrever “atendemos apenas clientes ricos” ou usar exclusividade artificial.

## 5. O cliente ideal

### 5.1 Perfil central proposto

Uma empresa com qualidade de entrega, ambição e capacidade de investimento, mas cuja presença digital ainda não expressa claramente seu nível. Pode já ter um site; o problema não precisa ser ausência de página. Pode ser mensagem difusa, apresentação genérica, dificuldade de demonstrar expertise, inconsistência de marca ou experiência de contato mal resolvida.

O bom encaixe combina um problema relevante, acesso a quem decide, disposição para compartilhar contexto e participação nas validações. O porte isolado não determina o potencial: um negócio especializado pode valorizar um projeto mais do que uma organização grande que busca apenas manutenção de um modelo pronto.

### 5.2 Situações que justificam uma conversa

A empresa está reposicionando sua oferta; passou a atender contratos maiores; quer lançar uma nova frente; recebe indicações que precisam encontrar uma apresentação convincente; tem tráfego ou prospecção, mas uma base digital que não explica bem sua proposta; ou quer trocar um site genérico por uma experiência realmente alinhada à marca.

Essas situações são hipóteses de prospecção. Não presumir que um visitante específico enfrenta todos esses problemas, nem afirmar que está perdendo vendas sem diagnóstico.

### 5.3 Decisores a considerar

**Sócio, fundador ou diretor:** precisa perceber coerência entre investimento, importância do projeto e segurança da execução. Quer entender o que será feito, o que dependerá dele e como a qualidade será validada.

**Responsável por marketing ou marca:** precisa de mensagem, diferenciação, consistência, capacidade de atualização e integração com o trabalho comercial. Precisa explicar internamente por que a proposta faz sentido.

**Responsável técnico ou operacional:** precisa compreender arquitetura, manutenção, publicação, permissões e limites das integrações. Não deve encontrar uma apresentação sofisticada que esconda dependências e custos.

Uma proposta high ticket pode precisar convencer mais de um desses papéis. Por isso, a experiência deve combinar impacto visual, explicação objetiva e evidência, não depender exclusivamente de uma impressão estética inicial.

## 6. Segmentos de prospecção prioritários

Os grupos abaixo são **hipóteses estratégicas para testar**, não um ranking baseado em pesquisa de mercado ou uma lista de clientes atuais.

| Prioridade proposta | Grupo | Problema que pode justificar a UNO | Condição de bom encaixe |
|---|---|---|---|
| Principal | Serviços B2B especializados, engenharia, consultorias e soluções empresariais | Tornar uma oferta complexa compreensível e demonstrar capacidade de execução | Oferta consistente, decisor envolvido e importância real da apresentação comercial |
| Principal | Arquitetura, interiores, projetos e negócios ligados a empreendimentos de maior valor | Valorizar portfólio, autoria, processo e diferenciação | Material visual adequado e necessidade de posicionamento, não apenas catálogo |
| Seletiva | Serviços profissionais e clínicas com posicionamento diferenciado | Organizar especialidades, confiança, informações e caminho de contato | Conteúdo verdadeiro e revisão setorial planejada antes da publicação |
| Seletiva | Hospitalidade, experiências e gastronomia com proposta autoral | Traduzir experiência, atmosfera e ação desejada | Investimento e objetivo comercial compatíveis com um site sob medida |

A seleção deve ser feita pela adequação ao problema e ao investimento, não pelo prestígio aparente do segmento. Não usar projetos conceituais existentes como prova de especialização consolidada.

Não criar uma homepage que pareça exclusiva de clínicas, arquitetura ou restaurantes se a empresa quiser uma atuação transversal. O portfólio pode mostrar versatilidade; a mensagem central precisa manter uma oferta comum: sites sob medida com direção, clareza e qualidade.

## 7. Quem não é prioridade

Não priorizar demandas orientadas exclusivamente ao menor preço, cópia literal de concorrentes, prazos incompatíveis com o escopo, inexistência de conteúdo mínimo e recusa em participar do alinhamento. Também não assumir projetos que dependam de promessas de vendas garantidas ou de credenciais que a UNO não possui.

Isso não é licença para atendimento arrogante. Um lead fora do perfil deve receber orientação clara e respeitosa. O posicionamento deve filtrar pela proposta, pelo processo e pelo investimento real, não por constrangimento ou julgamento pessoal.

**Pergunta interna de qualificação:** existe um problema que merece um projeto sob medida e condições para construí-lo bem?

## 8. Problema estratégico e transformação desejada

**Situação inicial:** a empresa tem valor, mas sua presença digital não o organiza ou não o transmite com a mesma qualidade.

**Intervenção proposta:** entender o contexto, definir a mensagem, desenhar uma experiência apropriada, construir com cuidado e organizar os próximos passos de contato.

**Situação desejada:** o visitante entende com mais facilidade o que a empresa oferece, para quem aquilo é relevante, por que vale considerá-la e como iniciar uma conversa.

A diferença que a UNO quer produzir é uma combinação de **valor percebido, clareza, confiança e facilidade de ação**. A transformação não deve ser descrita como aumento automático de vendas, reconhecimento instantâneo de marca ou superioridade comprovada sobre concorrentes.

O desenho do site deve tornar essa transformação visível. Não basta usar as palavras “estratégia”, “premium” e “conversão” como decoração verbal.

## 9. Como a UNO Labs propõe gerar valor

### 9.1 Valor de compreensão

Organizar a oferta para reduzir o esforço necessário para entender o negócio. Isso significa títulos específicos, hierarquia, diferenciação entre serviços e respostas às dúvidas relevantes. A evidência da entrega é uma estrutura de conteúdo que o cliente consegue revisar e um site que explica sua proposta sem depender de uma reunião prévia.

### 9.2 Valor de percepção

Desenvolver uma expressão digital compatível com o nível da empresa. Isso envolve tipografia, composição, direção visual, uso de imagens, ritmo e consistência. A prova é o trabalho apresentado e o racional das escolhas — não uma declaração de que “design bonito vende mais” em qualquer contexto.

### 9.3 Valor de confiança

Ajudar o negócio a apresentar evidências legítimas: projetos autorizados, informações institucionais verificadas, explicação de processo, especialidades reais e respostas transparentes. Design deve sustentar essas evidências, não simular uma reputação inexistente.

### 9.4 Valor de experiência

Construir uma interface legível, responsiva e funcional. O cuidado deve aparecer em navegação, carregamento, foco, toque, formulários e estados. O cliente precisa receber uma experiência utilizável, não apenas a imagem de uma experiência.

### 9.5 Valor comercial

Estruturar caminhos de contato com contexto. O resultado a perseguir é a oportunidade de uma conversa mais informada e compatível com o que a empresa oferece. Quantidade de cliques não é sinônimo de qualidade de oportunidade.

### 9.6 Valor de continuidade

Preparar uma base que possa ser mantida e, quando contratado, evoluída. Documentar responsabilidades, dependências e propriedade dos acessos. Não prometer atualizações ilimitadas, suporte permanente ou serviços complementares sem contratação definida.

**Cadeia de valor proposta:** contexto → mensagem → direção visual → experiência → confiança informada → contato qualificado. Não é uma fórmula matemática de crescimento nem um resultado já medido pela UNO.

## 10. A jornada que deve organizar o raciocínio

A referência existente trabalha com **Encontra → Entende → Confia → Chama**. A proposta desta documentação preserva essa lógica e a aprofunda para uma decisão de maior valor. [S3, jornada]


**Encontra:** o visitante chega por busca, indicação, campanha, relacionamento ou outro canal. O site precisa apresentar o contexto com clareza; não presumir que será a origem de toda demanda.

**Entende:** a mensagem responde o que é oferecido, para quem, com qual abordagem e com quais limites.

**Confia:** a apresentação oferece trabalho verificável e processo compreensível. A sofisticação visual desperta interesse; a coerência e a evidência sustentam a consideração.

**Chama:** o próximo passo é evidente e compatível com a intenção. Conversar não deve exigir vencer uma experiência experimental, um questionário invasivo ou uma fila de pop-ups.

A visita não é necessariamente linear. Quem chega decidido precisa poder ir direto ao contato; quem precisa avaliar deve conseguir explorar projetos e abordagem.

## 11. Posicionamento competitivo proposto

**Para empresas brasileiras que precisam de uma presença digital coerente com a qualidade e o valor de suas ofertas, a UNO Labs é um estúdio de engenharia digital que conecta estratégia, direção criativa e desenvolvimento em sites sob medida. Em vez de tratar o site como uma coleção de páginas genéricas, organiza mensagem, experiência e tecnologia a partir do contexto do negócio.**

Essa declaração é uma proposta de posicionamento, não uma afirmação de exclusividade de mercado. Não há pesquisa de concorrentes nesta entrega. Evitar alegações como “a única”, “a maior” ou “a mais inovadora”.

### Diferenciais que precisam ser demonstrados

| Diferencial desejado | Como torná-lo observável | O que não basta |
|---|---|---|
| Direção antes da execução | Mostrar o problema, a decisão de conteúdo e seu reflexo no layout | Dizer “somos estratégicos” |
| Design contextual | Apresentar projetos com linguagens distintas e justificadas | Trocar cores no mesmo template |
| Acabamento de interface | Demonstrar estados, responsividade e detalhes funcionais | Exibir apenas um mockup estático bonito |
| Engenharia com critério | Testes, conteúdo acessível, estabilidade e documentação | Exibir nomes de tecnologias sem explicar utilidade |
| Relação clara | Escopo, etapas, validações e responsabilidades explícitos | Prometer proximidade sem processo |

“Premium” é a consequência pretendida dessa combinação. Não deve ser usado como substituto de demonstração.

## 12. Arquitetura da oferta

### 12.1 Núcleo: sites profissionais sob medida

A base dos materiais privilegia sites institucionais, landing pages e páginas de serviço, com direção visual, mensagem, responsividade e atenção a desempenho e contato. [S3, soluções]


A oferta principal proposta para a comunicação é **“Sites sob medida”**. Seu escopo pode reunir entendimento do negócio, arquitetura de informação, organização de conteúdo, design de interface, implementação, interações e preparação para publicação. A composição exata precisa estar na proposta do projeto.

Não tratar toda landing page como produto barato ou todo site institucional como projeto de alto valor. O enquadramento deve considerar profundidade, objetivos, conteúdo, singularidade visual e complexidade técnica.

### 12.2 Complementos presentes nas referências

SEO e presença digital, Google Ads e Meta Ads, hospedagem gerenciada, SSL, e-mail corporativo e suporte aparecem como complementares. A referência enfatiza preparar a base antes de ampliar aquisição. [S1, capítulo 01; S3, soluções]


**[v1.1]** SEO, Google Ads, Meta Ads e plano de manutenção mensal estão confirmados como serviços ativos (Parte 0, §0.2). Hospedagem, SSL e e-mail corporativo: confirmar antes de anunciar. Esses itens não devem ocupar o mesmo peso do serviço principal. Antes de publicá-los como ofertas ativas, confirmar disponibilidade, responsabilidade, escopo e condições. “O site é o centro; os complementos entram quando fazem sentido” é a lógica de organização.

### 12.3 Não acrescentar automaticamente

Aplicativos, sistemas complexos, e-commerce, branding completo como serviço separado, produção audiovisual, automações, agentes de IA e gestão integral de redes sociais não estão confirmados como catálogo da UNO. Podem ser discutidos como oportunidades futuras, mas não aparecer como capacidades estabelecidas apenas para ampliar a lista. **[v1.1]** Automações, agentes de IA e desenvolvimento de software pertencem à Audaro — Engenharia de Resultado, outra empresa. E-commerce fica fora do escopo por enquanto.

### 12.4 Formato comercial recomendado

Preferir um projeto definido por escopo, com marcos de validação e condições claras. Uma relação recorrente de evolução pode existir como contratação separada, desde que haja capacidade e escopo definidos. Não inventar pacotes Bronze, Prata e Ouro ou tabelas de mensalidade para preencher uma seção do site.

## 13. Experiência comercial high ticket

A conversa inicial deve identificar contexto, impacto desejado, público, material disponível, urgência, decisão e possibilidade de investimento. O objetivo não é apresentar um preço antes de compreender o trabalho, nem transformar descoberta em consultoria gratuita ilimitada.

A proposta deve explicar o problema entendido, a solução recomendada, os entregáveis, as exclusões, as etapas, as responsabilidades, os critérios de aceite e o investimento. Custos recorrentes e serviços de terceiros precisam ser distinguidos do projeto principal.

Para qualificar, usar três classes simples: **alta aderência**, quando há problema relevante e condições de execução; **aderência a esclarecer**, quando faltam informações importantes; **baixa aderência**, quando a necessidade é incompatível com a oferta. Não atribuir uma nota de riqueza ao visitante.

No site, não tornar obrigatória a divulgação de faturamento ou patrimônio. Uma pergunta sobre investimento pode ajudar após o contexto inicial, com resposta “a definir”. Faixas numéricas só devem ser inseridas quando a UNO definir sua política real.

Não usar contagem regressiva, disponibilidade falsa, agenda artificialmente escassa ou desconto permanente. A justificativa do valor deve vir do projeto e da qualidade demonstrada.

## 14. Método de trabalho proposto

A estrutura de origem é **Entender, Direcionar, Construir, Publicar e Evoluir**, com evolução opcional. [S3, processo]


| Etapa | Trabalho | Saída que deve existir | Validação necessária |
|---|---|---|---|
| Entender | Contexto, oferta, público, objetivos, referências, limitações e inventário de conteúdo | Brief e definição de problema | O cliente reconhece o problema e as prioridades |
| Direcionar | Arquitetura, mensagem, narrativa, direção de arte e escopo de interações | Estrutura de páginas, copy-base e conceito visual | Mensagem e direção coerentes com o negócio |
| Construir | Interface, componentes, responsividade, desenvolvimento e integrações acordadas | Versão navegável, não apenas imagens | Comportamento e apresentação correspondem ao escopo |
| Publicar | Revisão, conteúdo final, testes, acessos e preparação de ambiente | Versão pronta para publicação e registro de pendências | Critérios críticos atendidos e publicação autorizada |
| Evoluir | Manutenção, conteúdo, mensuração ou aquisição conforme contratação | Plano e entregas próprios | Responsabilidade e frequência combinadas |

A descrição detalhada acima é uma recomendação de operação. Não prometer quantidade ilimitada de revisões, resposta em determinado prazo ou execução em número fixo de dias sem decisão comercial.

Mudanças importantes depois de uma validação devem ser registradas como alteração de escopo. O método deve oferecer clareza sem criar burocracia desnecessária.

## 15. Plataforma de marca proposta

**Propósito:** aproximar o valor real das empresas da forma como esse valor é percebido no digital.

**Missão:** construir sites com clareza estratégica, qualidade criativa e cuidado técnico para representar negócios e facilitar oportunidades de contato.

**Visão:** ser reconhecida pela capacidade de transformar contextos de negócio em experiências digitais distintas, confiáveis e bem executadas.

Essas formulações são novas propostas. Não representam declarações históricas ou metas públicas já aprovadas.

Os pilares documentados — **clareza, confiança, velocidade, resultados e feito para o Brasil** — permanecem como base. “Resultados” expressa orientação a objetivos, não garantia de vendas. [S1, capítulo 01]


Na prática, essa plataforma exige clareza antes de efeito, evidência antes de adjetivo, contexto antes de template, qualidade antes de volume e comunicação respeitosa antes de pressão.

## 16. Personalidade e voz

A UNO deve soar **estratégica, segura, refinada, objetiva e próxima**. Pode demonstrar conhecimento técnico sem exigir que o decisor conheça a linguagem do desenvolvimento. Pode ser criativa sem parecer imprevisível na execução.

Escrever frases completas e específicas. Preferir verbos concretos: organizar, desenhar, construir, apresentar, orientar, testar. Evitar “potencializar o ecossistema”, “revolucionar o mercado”, “soluções disruptivas” e promessas que serviriam para qualquer agência.

O texto deve respeitar a empresa do visitante. Em vez de pressupor que seu site é ruim ou que seu negócio parece pequeno, formular a oportunidade: **“Sua presença digital acompanha o nível do que você entrega?”**

### Aplicação do tom

| Evitar | Preferir |
|---|---|
| “Sites incríveis que explodem suas vendas” | “Sites sob medida para apresentar seu negócio com clareza e facilitar o contato.” |
| “Somos a agência mais inovadora” | “Veja como mensagem, direção visual e desenvolvimento se conectam no projeto.” |
| “Seu site está afastando todos os seus clientes” | “Sua presença digital pode expressar melhor o valor da sua empresa.” |
| “Tecnologia de ponta e soluções 360º” | “Estrutura, interface e implementação pensadas para o objetivo do site.” |
| “Oferta imperdível. Últimas vagas.” | “Conte o contexto do seu projeto. A proposta acompanha o escopo.” |

Na relação comercial, explicar limites não enfraquece a marca. A combinação desejada é segurança com transparência, não soberba com superlativos.

## 17. Hierarquia de mensagens

As frases documentadas devem manter seus papéis. A assinatura principal é **“Presença digital que gera oportunidades.”** A ideia central é **“Clareza gera mais oportunidades.”** “Sites que aproximam negócios de pessoas” e “Engenharia digital para um Brasil mais conectado” são linhas de apoio/institucionais. [S1, capítulo 01]


**Headline proposta para o site:** “Seu negócio tem valor. Seu site precisa estar à altura.”

**Subtítulo proposto:** “A UNO Labs une estratégia, design e desenvolvimento para criar sites sob medida que apresentam sua empresa com clareza, expressam sua qualidade e facilitam o próximo contato.”

**Chamada principal proposta:** “Conversar sobre meu projeto.”

**Chamada secundária proposta:** “Explorar projetos.”

Esses textos não substituem a assinatura gráfica do logotipo. Usar uma mensagem dominante por seção. A oferta precisa continuar explícita: o visitante deve entender que a UNO cria sites, não precisar deduzir isso de uma frase abstrata.

## 18. Manifesto de trabalho proposto

> Uma empresa pode entregar muito e mostrar pouco do que a torna relevante.
>
> Acreditamos que sua presença digital deve acompanhar o nível do seu trabalho.
>
> Por isso, começamos pelo contexto. Organizamos o que precisa ser dito, desenhamos como essa mensagem será percebida e construímos como a experiência vai funcionar.
>
> A beleza importa. A clareza também. E o cuidado só está completo quando os dois encontram uma execução consistente.
>
> Não criamos efeitos para esconder uma proposta. Criamos experiências para revelar o que merece atenção.
>
> UNO Labs. Presença digital que gera oportunidades.

O manifesto é texto novo desta entrega. Não incluir fatos de fundação, número de clientes ou qualificações profissionais não confirmadas.

## 19. Provas, portfólio e credibilidade

Casa Noma, Atria Clinic e Módulo Engenharia estão identificados na referência como **projetos conceituais / demonstração**. Não devem ser apresentados como clientes atendidos, contratos executados ou cases de resultado. [S3, projetos]


Cada estudo deve mostrar contexto fictício explicitamente identificado, objetivo de design, decisões e material efetivamente disponível. O título “Estudos de direção digital” pode ser mais preciso do que “Clientes que confiam na UNO” para esse conjunto.

A recomendação de prova é combinar três níveis: **o que se vê**, com o trabalho visual; **o que se entende**, com o racional; e **o que funciona**, com a experiência navegável quando existir. Uma imagem só comprova uma proposta visual. Um protótipo comprova interações implementadas. Nenhum dos dois comprova resultado comercial.

Resultados reais futuros devem ter origem, período, definição de métrica, autorização e contexto. Não usar atribuição causal ao site sem base. Depoimentos precisam ser reais e autorizados. Não criar avaliações, nomes, cargos, estrelas, marcas de clientes ou dashboards ilustrativos que pareçam dados operacionais.

Uma seção sem prova disponível deve ser reformulada ou omitida. A honestidade do portfólio é parte da qualidade desejada.

## 20. Identidade visual: base a preservar

### 20.1 Paleta de referência para esta documentação

Os dois manuais de 29/09/2026 registram **Pine #0E2B24, Mint #7DD3A8, Off White #F3F7F3 e Sage #A8B8AE** como padrão verde. Eles classificam as explorações Petróleo/Jade/Marfim como anteriores. Esta entrega adota o consenso mais recente dos manuais como baseline, sem misturar paletas. [S1, capítulo 04; S2, paleta]


A conversa anterior enfatizava a diferença entre o fundo claro aplicado ao site/cartão e o branco puro do cenário de apresentação. A direção proposta preserva essa distinção: **o site deve ter base clara da identidade; a prancha externa pode ser branca.** Não chamar Off White de Marfim, pois são códigos diferentes.

Não considerar uma mudança de cor aprovada apenas porque um agente prefere outra combinação. Uma instrução futura expressa do usuário deve ser registrada e propagada em todos os arquivos, sem criar um tema híbrido.

### 20.2 Logo

Preservar o desenho existente. **U, N e O têm a mesma cor; nas versões coloridas, o acento pertence ao disco interno do O. O símbolo compacto é UNO completo.** Não reduzir a U, UO ou um ponto isolado. Usar o arquivo gráfico adequado; não digitar uma fonte para imitar a marca. [S1, capítulo 02]


A versão horizontal escolhida deve governar os derivados. Não “corrigir” a personalidade do desenho tornando cada aplicação geometricamente diferente. Preservar os espaços negativos, as proporções e a relação UNO–Labs.

### 20.3 Tipografia

Inter é a referência institucional documentada. Sora, Source Sans 3 e DM Mono pertencem ao site de referência e não revogam automaticamente essa indicação. Para o novo protótipo, a recomendação é trabalhar inicialmente com Inter, sem redesenhar o logotipo. A política tipográfica final do site deve ser registrada. **[v1.1]** Decisão: manter Inter por enquanto; três escopos (A: Newsreader + Inter; B: Schibsted Grotesk + Inter; C: Inter) em avaliação no canvas de Design. [S1, capítulo 05]


### 20.4 Diferenças técnicas entre os kits

Os manuais concordam sobre a identidade central, mas não sobre todos os detalhes da reconstrução: área de proteção, margens incorporadas, alguns monocromáticos e tratamento da assinatura diferem. Por exemplo, um propõe proteção H/4 incorporada; o outro usa o diâmetro do disco do O como referência externa. [S1, capítulo 03; S2, área de proteção]


**Regra operacional:** escolher e validar um único pacote de ativos; aplicar a documentação correspondente aos arquivos desse pacote. Este documento não combina geometrias nem inventa um caminho de SVG. O registro completo está na Parte V.

## 21. Direção criativa do site

**Conceito proposto: “Precisão que se revela”.**

A experiência deve causar uma impressão forte pela composição inicial e ganhar profundidade quando o visitante explora. Primeiro, um site excepcionalmente bem desenhado. Depois, a possibilidade de perceber as decisões e o domínio técnico por trás dele.

A direção é **editorial, clara, sofisticada e contemporânea**, com fundos Off White, tipografia forte em Pine, grandes áreas de respiro e uso disciplinado de Mint. A linguagem deve ter calor suficiente para uma relação de parceria e precisão suficiente para transmitir profissionalismo.

O site não deve se parecer com um painel SaaS genérico, uma agência de efeitos especiais ou um portfólio que esquece de vender um serviço. Não adotar uma base inteiramente escura apenas para sinalizar “tecnologia”. Uma passagem Pine pode criar profundidade; não deve engolir a direção clara.

A assimetria é permitida e desejável quando intencional. Hierarquia e alinhamento continuam rigorosos. Evitar repetir a mesma grade de três cards em todas as seções. Alternar composições editoriais, projetos amplos, texto direto e uma experiência interativa de assinatura.

**Três percepções desejadas:** “entendi o que fazem”; “existe uma qualidade incomum aqui”; “vale conversar sobre o meu projeto”. A arquitetura detalhada e os recursos para materializar isso estão na Parte II.

## 22. O que significa encantar

O encantamento deve vir de uma surpresa relevante: uma interface que revela sua construção, uma transição que explica uma decisão, um projeto que pode ser explorado de forma elegante, um detalhe que responde com precisão.

Não basta adicionar animação de entrada a todos os blocos. O site precisa de **um recurso de assinatura realmente bem executado**, apoiado por microinterações consistentes. A primeira versão deve conter esse diferencial; não entregar um template genérico com a promessa de adicionar personalidade depois.

Ao mesmo tempo, nenhum efeito pode impedir compreensão, navegação ou contato. A experiência precisa continuar excelente em celular, por teclado e com movimento reduzido. Retirar animações não deve retirar conteúdo nem a qualidade da composição.

**Teste de relevância:** ao explicar por que um efeito existe, a equipe deve conseguir relacioná-lo à mensagem, à exploração do trabalho ou à clareza de uma ação. “Para parecer premium” não é uma justificativa suficiente.

## 23. Sucesso e mensuração

A métrica principal proposta é **oportunidades qualificadas compatíveis com o tipo de projeto desejado**. Indicadores comerciais posteriores podem incluir conversas realizadas, propostas enviadas, projetos fechados, investimento contratado e motivos de perda.

Visitas, rolagem, tempo de permanência e cliques são diagnósticos intermediários. Uma visita longa pode refletir interesse ou dificuldade; um clique no WhatsApp não confirma que uma mensagem foi enviada. Não otimizar uma animação apenas para aumentar tempo na página.

A qualificação depende de critérios comerciais definidos pela UNO. Antes de comparação, estabelecer período, origem e significado dos eventos. Não criar metas numéricas para preencher o documento sem conhecer a base atual.

Também medir a qualidade da experiência: problemas de navegação, compreensão da oferta, barreiras de acessibilidade e desempenho. O objetivo é alinhar desejo, clareza e funcionamento, não trocar um pelo outro.

## 24. Fatos pendentes e limites de publicação

As fontes de marca consultadas originalmente não confirmavam contatos oficiais, domínio, razão social, CNPJ, responsáveis, equipe, endereço, ticket mínimo, prazos, condições de pagamento, política de suporte ou cases reais autorizados. Os contatos e outros itens confirmados depois constam na Parte 0; não adotar dados ilustrativos de mockups. [S1, capítulos 09 e 11; S2, dados]


Campos ainda não confirmados devem permanecer ausentes ou marcados como pendentes no ambiente de desenvolvimento. Antes da publicação, substituir pelo dado verificado ou remover a funcionalidade dependente. Os contatos posteriores constam na Parte 0, §0.10 e estão integrados ao HTML e ao JSON-LD; a caixa e o envio continuam sem homologação. Não publicar links falsos, rodapé inventado, política genérica que descreve outra operação ou mensagem de envio sem integração real.

**[v1.1; atualizações v1.5 e v1.6 na Parte 0]** Já confirmados: domínio `unolabs.com.br`, os contatos comerciais e seus formatos, nomes e conteúdo aprovados da equipe, atendimento presencial na Grande Vitória/ES e em Curitiba/PR e preço público de entrada. Os contatos foram integrados ao HTML e ao JSON-LD e os links conferidos localmente; permanecem pendentes as configurações e a homologação real descritas na Parte 0, §0.11.

A falta desses dados não impede definir estratégia, desenhar o site e construir um protótipo. Impede apenas tratar esse protótipo como uma presença comercial plenamente validada.

## 25. Instrução síntese para qualquer IA

> Trabalhe para a UNO Labs, um estúdio de engenharia digital focado em sites sob medida. O objetivo é atrair projetos high ticket e negócios que valorizam uma apresentação digital compatível com a qualidade de suas ofertas. Una clareza estratégica, direção criativa e execução técnica. Construa uma experiência predominantemente clara, extremamente elegante e com um recurso interativo de assinatura que demonstre capacidade real. Preserve a identidade documentada, a marca UNO completa e a distinção entre estudo conceitual e cliente real. Não invente serviços, contatos, resultados ou condições comerciais. Mostre qualidade em decisões observáveis, não em excesso de adjetivos ou efeitos.

**Critério final de posicionamento:** o trabalho deve fazer a UNO parecer uma escolha criteriosa para um projeto importante — não a opção mais barata, nem uma opção extravagante sem substância.


---


# PARTE II — Especificação do site


# UNO Labs — Especificação estratégica, criativa e funcional do site

**Versão 1.0 · 29/09/2026 · proposta de projeto**

Este documento transforma o posicionamento em requisitos implementáveis. Layouts, nomes de componentes, durações, prioridades e metas internas abaixo são recomendações desta entrega, não características de um site já construído. Ler primeiro a Parte 0 e a Parte I.

## 1. Objetivo do produto

O site deve apresentar claramente a UNO Labs, demonstrar a qualidade do trabalho e conduzir decisores compatíveis com projetos de maior valor a uma conversa qualificada. É simultaneamente apresentação comercial, demonstração de capacidade e porta de entrada para relacionamento.

**Objetivo principal:** gerar interesse qualificado em sites sob medida.\
**Objetivo de percepção:** transmitir direção, capacidade criativa, precisão e segurança de execução.\
**Objetivo de experiência:** permitir entender, explorar e entrar em contato com facilidade.

Não é um aplicativo SaaS, uma loja de pacotes de baixo custo ou uma galeria experimental sem oferta. O visitante deve entender o serviço mesmo que não explore nenhuma animação.

## 2. Conceito de experiência: Precisão que se revela

A página inicial abre com uma composição já refinada, completa e legível. O visitante não precisa aguardar uma introdução. Uma experiência autoral permite revelar as decisões por trás da interface: mensagem, direção visual e interação.

A surpresa deve aprofundar a compreensão da qualidade da UNO. Em vez de mostrar um robô ou um dashboard fictício, mostrar **o próprio trabalho de criação digital em uma experiência navegável e honesta**.

A experiência é de descoberta voluntária. Quem quer apenas avaliar a oferta pode seguir a leitura. Quem está interessado no detalhe encontra algo memorável. Quem já decidiu conversar tem uma ação disponível sem percorrer o site inteiro.

## 3. Princípios de composição

**Base clara.** Off White domina o fundo do site, inclusive a primeira dobra. Pine sustenta textos e botões. Mint aparece em detalhes e ações cuidadosamente escolhidos. Sage é apoio visual, não a cor padrão de texto pequeno.

**Densidade controlada.** Uma mensagem dominante por seção. Parágrafos com largura confortável. Poucos elementos competindo pela atenção. Projetos recebem escala suficiente para que a qualidade seja vista, e não apenas sugerida por miniaturas.

**Ritmo editorial.** Variar a composição por função: hero assimétrico, projeto amplo, faixa de argumento, processo sequencial e contato concentrado. Não repetir automaticamente a mesma grade de cards em cada bloco.

**Originalidade contextual.** A singularidade deve vir da direção de arte e da maneira de mostrar o trabalho, não de mudar as convenções de navegação que permitem ao visitante usar a página.

**Acabamento funcional.** Estados de carregamento, foco, erro, vazio e sucesso fazem parte do design. O site precisa parecer e funcionar como uma experiência concluída.

## 4. Identidade e tokens

### 4.1 Cores

| Papel | Valor | Aplicação proposta |
|---|---|---|
| Marca estrutural | Pine `#0E2B24` | Títulos, marca positiva, botões fortes e passagem imersiva pontual |
| Acento | Mint `#7DD3A8` | Disco do O, detalhes de interação, indicadores e CTA sobre escuro |
| Fundo principal | Off White `#F3F7F3` | Página, hero e superfícies predominantes |
| Apoio | Sage `#A8B8AE` | Elementos decorativos e superfícies compatíveis |
| Texto de leitura | Ink `#10201C` | Parágrafos e informação essencial |
| Texto secundário | Ink 2 `#355048` | Descrições e legendas sobre o fundo claro |
| Superfície alternativa | Off White 2 `#EDF3EE` | Diferenciação discreta de blocos |
| Branco externo | `#FFFFFF` | Cenário de apresentação e usos pontuais, sem substituir a base do site |

Os quatro primeiros valores e os apoios digitais estão documentados no manual. As funções específicas do novo layout são propostas. [S1, capítulo 04]


Não misturar a paleta histórica Jade/Petróleo/Marfim com estes tokens. Não amostrar pixels de mockups para “ajustar” os HEX. Não aplicar uma porcentagem supostamente oficial de uso de cor; a decisão desta direção é predominância clara com acento contido.

Os contrastes documentados incluem Pine/Off White de aproximadamente 13,97:1 e Pine/Mint de 8,46:1. Mint e Sage sobre Off White não são indicados para texto informativo comum. [S1, contraste]


### 4.2 Tipografia e escala inicial

Inter é a referência de trabalho para o protótipo, preservando a indicação institucional dos manuais. Não introduzir uma fonte serifada de luxo ou promover Sora/Source Sans 3/DM Mono a sistema oficial sem registrar a decisão. Logo é um ativo gráfico separado, não texto composto em Inter.

Escala proposta: H1 entre 56 e 88 px no desktop e entre 36 e 48 px em telas pequenas; H2 entre 36 e 56 px no desktop e 28 a 36 px no mobile; corpo entre 17 e 20 px, com mínimo de trabalho de 16 px em telas pequenas; legendas preferencialmente a partir de 14 px. Ajustar por leitura, não por proporção mecânica.

Usar poucos pesos: regular para leitura, médio para interface, semibold e bold para hierarquia. Títulos podem ter entreletra levemente fechada, sem colisões. Não comprimir horizontalmente palavras para caber. Rótulos em caixa-alta devem ser curtos e secundários.

### 4.3 Grade e espaços

Ponto de partida: conteúdo principal com largura máxima entre 1.200 e 1.280 px, margens laterais adaptativas, leitura de parágrafos em aproximadamente 55–70 caracteres e separações amplas entre seções. Adotar escala coerente de 4, 8, 12, 16, 24, 32, 48, 64, 96 e 128 px para espaçamentos de layout.

Raios de 18, 26 e 34 px aparecem na referência; usá-los com critério de escala, não em todos os elementos. Ícones devem pertencer a uma mesma família visual. Sombras discretas separam planos; não são um efeito obrigatório em cada card.

### 4.4 Logo e arquivos

Selecionar um único kit de ativos validado. Não misturar a área de proteção de um manual com o SVG de outro. Registrar o arquivo e a variante usados. Preservar proporção e vazados. Não inventar nomes de arquivos como se já estivessem disponíveis no repositório.

Na falta do ativo, criar um espaço de desenvolvimento explicitamente identificado, sem fabricar um símbolo aproximado. A ausência de logo final é um bloqueio de publicação, não motivo para interromper a implementação de todo o restante.

## 5. Arquitetura de informação

### 5.1 Estrutura recomendada

| Página | Função | Conteúdo mínimo |
|---|---|---|
| `/` | Apresentar, demonstrar e qualificar | Hero, experiência de assinatura, trabalhos, proposta, método, dúvidas e contato |
| `/projetos` | Permitir comparação e exploração | Estudos ou projetos reais separados por natureza, com descrições concretas |
| `/projetos/[slug]` | Demonstrar profundidade | Contexto, natureza, objetivo, decisões, telas, experiência disponível e próximo passo |
| `/abordagem` | Dar segurança sobre o trabalho | Como negócio, mensagem, design e desenvolvimento se conectam; processo e limites |
| `/contato` | Receber contexto | Formulário real ou canal confirmado, expectativas e informação de privacidade |
| `/privacidade` | Explicar tratamento real | Texto ajustado à operação, ferramentas e canais efetivamente utilizados |

As rotas são uma proposta. Se o primeiro lançamento tiver conteúdo insuficiente para uma página própria, usar uma seção bem resolvida em vez de publicar páginas vazias. Páginas específicas de serviços ou setores só entram com conteúdo útil e oferta validada. **[v1.1]** Blog aprovado desde o lançamento (`/blog` e `/blog/[slug]`), com 4 a 6 artigos-pilar na estreia e 2 por mês depois (Parte 0, §0.9).

### 5.2 Navegação

**[v1.1]** Menu principal: **Serviços, Projetos, Abordagem, Blog, Contato**. CTA de destaque: **Conversar sobre meu projeto**.

A navegação deve manter ordem e nomes consistentes entre desktop e mobile. O cabeçalho pode reduzir discretamente ao rolar, sem saltos de layout nem esconder o foco. O logo retorna à página inicial.

Não incluir um link “Agendar” enquanto não houver agenda real. Não substituir todas as ações por links genéricos com `href="#"`.

## 6. Home: roteiro e função de cada seção

### 6.1 Hero — entendimento e desejo

**Pergunta a responder:** o que a UNO faz e por que vale continuar?

Título proposto: **“Seu negócio tem valor. Seu site precisa estar à altura.”** Subtítulo explicita estratégia, design, desenvolvimento e sites sob medida. CTA principal para contato; CTA secundário para trabalhos.

No desktop, texto ocupa uma área editorial sólida e a demonstração ocupa um plano generoso ao lado ou ligeiramente abaixo, sem comprimir a leitura. No mobile, título, explicação, ação e composição visual formam uma sequência natural. Nenhum título essencial depende de vídeo, canvas ou animação para ser lido.

Não abrir com “Bem-vindo”, “Transformamos o futuro” ou adjetivos sem explicar o serviço. Não inserir faixa de logos de clientes inexistentes.

### 6.2 Experiência de assinatura — O valor toma forma

Apresentar uma interface conceitual original e permitir explorar as decisões que a compõem. É a demonstração central descrita na seção 7. Pode integrar visualmente o hero e continuar logo abaixo, sem duplicação do mesmo conteúdo.

A primeira impressão já deve ser o estado final mais bonito. A revelação mostra profundidade; não faz o usuário assistir a uma página ruim até ela ficar pronta.

### 6.3 Trabalhos selecionados — evidência visual

Mostrar dois ou três trabalhos com escala e qualidade. Para os materiais disponíveis, utilizar rótulo visível **“Estudo conceitual”**. Cada item deve ter nome, contexto, objetivo e uma decisão relevante. O clique abre uma página com conteúdo real, não um modal vazio.

Dar aos projetos uma linguagem própria. Não aplicar a paleta da UNO a todos os clientes demonstrativos. A moldura e a navegação pertencem à UNO; o projeto demonstrado pode ter outra identidade.

### 6.4 Proposta de valor — explicar o investimento

Título sugerido: **“Mais do que apresentar sua empresa. Tornar seu valor mais claro.”**

Explicar a conexão entre mensagem, percepção, experiência e contato. Pode ser uma composição textual com quatro evidências breves, sem repetir um grid de benefícios genéricos. Evitar gráficos comerciais sem dados.

### 6.5 Solução principal — deixar a oferta explícita

Título sugerido: **“Sites sob medida. Do contexto à experiência.”**

Apresentar institucional, landing page e páginas de serviço como possibilidades, não como pacotes rígidos. Mostrar o que o projeto pode integrar e o que depende de escopo. Complementos confirmados ficam em uma faixa secundária; itens não validados não aparecem como serviços ativos.

### 6.6 Método — reduzir incerteza

Mostrar Entender, Direcionar, Construir e Publicar. Evoluir aparece como opcional. Cada etapa precisa explicar uma saída concreta. A interação pode revelar exemplos de entregáveis, mas o visitante deve conseguir ler todo o processo sem ativá-la.

### 6.7 Adequação — qualificar com respeito

Texto sugerido: **“Para empresas que tratam sua presença digital como parte do negócio.”**

Apresentar os sinais de boa aderência: qualidade a comunicar, necessidade de diferenciação, disposição para um projeto sob medida e participação no processo. Não publicar um teste de renda nem uma lista depreciativa de clientes indesejados.

### 6.8 FAQ — responder antes de vender

Perguntas sobre investimento, prazo, conteúdo, uso em celular, propriedade de acessos, manutenção e complementos. Respostas não podem inventar preços, parcelamento ou SLA. O componente precisa funcionar por teclado e não esconder o único acesso a informação crítica.

### 6.9 Contato — próxima conversa

Título alinhado à referência: **“Sua empresa já tem valor. Vamos fazer o digital mostrar isso.”**

Explicar que o contexto permitirá definir o escopo. Oferecer formulário ou canal real. Não exigir contato para visualizar todos os projetos. O rodapé mantém apenas informações verificadas e navegação útil.

## 7. Recursos de encantamento: contratos de interação

### 7.1 Recurso principal — O valor toma forma

**Prioridade:** P0, parte da primeira versão de qualidade. **Função:** demonstrar como decisões de criação constroem uma presença digital, e não apenas afirmar que a UNO é criativa.

**Conteúdo:** uma única interface conceitual original, desenhada para essa experiência. Exibir sempre “Demonstração conceitual”. A mesma interface serve aos estados, permitindo perceber continuidade em vez de trocar imagens sem relação.

**Estado inicial:** composição final completa, com mensagem, tipografia, elementos visuais e ação. O botão “Revelar as decisões” abre a exploração. A pessoa pode simplesmente seguir a página.

**Estados de exploração:** “Mensagem” destaca proposta e hierarquia; “Direção” revela grade e escolhas visuais; “Experiência” mostra o comportamento de um componente real. Cada estado oferece uma explicação curta sobre a decisão e sua função.

**Interação:** controles nomeados acionados por clique, toque ou teclado. Um seletor claramente visível indica a etapa atual. Não mover automaticamente o foco quando o visitante rolar. Não depender de arrastar para revelar o conteúdo.

**Transição:** mudar apenas os elementos relevantes, preservando contexto. Usar duração aproximada de 400–650 ms como ponto de partida e interromper/reverter de forma segura quando o usuário troca de estado rapidamente. Não exibir digitação simulada como se uma IA estivesse analisando a empresa do visitante.

**Mobile:** interface final em proporção própria para celular; estados em controle simples e anotação abaixo da imagem. Não usar a mesma tela desktop encolhida com detalhes ilegíveis.

**Movimento reduzido:** troca imediata ou discreta, sem deslocamento espacial. As mesmas decisões e explicações continuam disponíveis. **Sem JavaScript:** estado final e explicação resumida aparecem como conteúdo normal; controles que não funcionariam não são exibidos.

**Dependências:** arte original da interface, textos dos três estados, componentes reais suficientes para a demonstração e permissão sobre imagens utilizadas. Não precisa de uma API de IA, análise de URL ou dados do visitante.

**Aceite:** alguém deve conseguir identificar o que mudou e por que isso importa. A experiência não pode produzir rolagem horizontal involuntária, travar navegação ou fingir uma funcionalidade que não existe.

### 7.2 Recurso de apoio — Explorar o projeto

**Prioridade:** P0 nas páginas de projetos, com implementação simples e refinada. **Função:** permitir avaliar acabamento e adaptação ao contexto.

**Interação:** alternância “Desktop / Mobile” com imagens ou renderizações específicas. Oferecer ampliação quando houver detalhe relevante. Nomear corretamente o material: “Prévia visual” para imagem e “Abrir demonstração” somente para uma experiência funcional disponível.

**Racional:** painel “Por que foi desenhado assim?” explica até três decisões concretas. Por exemplo, prioridade de conteúdo, tratamento de portfólio e caminho de contato. Não usar o mesmo texto em todos os projetos.

**Mobile e teclado:** seleção acessível, ordem de leitura preservada e nenhuma informação exclusiva de hover. A imagem deve caber na tela; ampliação precisa ter fechamento claro e retornar o foco ao acionador.

**Sem JavaScript:** telas e decisões ficam em sequência. **Aceite:** a pessoa entende a natureza do projeto e consegue examinar o trabalho sem assumir que se trata de cliente real ou resultado medido.

### 7.3 Recurso editorial — Encontrar, entender, confiar, conversar

**Prioridade:** P1; usar apenas se acrescentar conteúdo à home, sem repetir a experiência principal. **Função:** explicar a jornada de valor do site.

Quatro estados podem relacionar estrutura, mensagem, prova e ação. No desktop, é possível ter uma área visual aderente à rolagem, mas o deslocamento da página continua nativo. Oferecer seleção manual e uma saída óbvia.

No celular e em movimento reduzido, mostrar sequência vertical. Não prender a pessoa por várias telas para revelar quatro frases. Se competir com o recurso principal, trocar por uma composição estática excelente.

### 7.4 Recurso comercial — Brief inicial bem conduzido

**Prioridade:** P0 para um fluxo real de contato; formulário em etapas é P1. **Função:** transformar interesse em contexto, com pouco atrito.

Primeira etapa proposta: nome, empresa, um canal de retorno e descrição do desafio. Uma segunda etapa opcional pode receber endereço do site atual, objetivo, prazo desejado e investimento previsto. Não tornar telefone e e-mail simultaneamente obrigatórios sem necessidade real.

Mostrar o que falta e permitir voltar sem perder o que já foi digitado na sessão. Não persistir dados pessoais em armazenamento local por padrão. Não fazer uma “análise inteligente” ou estimativa de preço que não foi implementada e validada.

**Estados obrigatórios:** inicial, validação de campo, envio em andamento, erro recuperável e confirmação real. Se a ação apenas abre WhatsApp com texto preparado, usar “Continuar no WhatsApp” e explicar que a mensagem será revisada e enviada naquele canal.

**Aceite:** nenhum contato pode parecer enviado quando não foi. Se não houver backend ou canal confirmado, o protótipo indica sua condição de demonstração e bloqueia a publicação desse fluxo.

### 7.5 Microinterações como sistema

**Prioridade:** P0. Seta de link pode avançar poucos pixels; botão deve responder com mudança discreta; campos devem oferecer foco inequívoco; cards podem ter elevação mínima; menus e accordions devem abrir de forma consistente.

Não usar cursor substituto, botões que fogem do ponteiro, efeitos magnéticos exagerados, áudio automático, partículas em todos os blocos, texto essencial que aparece letra por letra ou uma sequência de animações que precisa acabar antes do clique.

## 8. Movimento, responsabilidade e alternativas

Orçamento proposto de movimento: respostas de interface em torno de 140–220 ms; mudanças de seção em 350–600 ms; revelações especiais de até cerca de 900 ms, sempre opcionais e sem bloquear o uso. São pontos de partida, não métricas oficiais de qualidade.

Preferir poucas animações com boa continuidade. Não disparar novamente todas as entradas a cada pequena rolagem. Interromper trabalho visual fora da área de exibição. Evitar elementos grandes que se movem incessantemente atrás da leitura.

Toda interação especial precisa ter uma experiência alternativa explicitamente desenhada. “Desativar a animação” não pode resultar em elementos invisíveis. A página estática precisa manter a mesma hierarquia e informação.

**Ordem de redução em caso de conflito:** remover decoração redundante; simplificar transições; reduzir a complexidade do cenário; preservar mensagem, trabalho apresentado, navegação e contato. Não resolver desempenho diminuindo texto ou escondendo conteúdo.

## 9. Imagens, mídia e arte de projetos

Usar imagens reais autorizadas ou estudos conceituais identificados. Não simular equipe, escritório, clientes ou premiações. Imagens de banco ou geradas podem compor uma demonstração visual, mas não constituem documentação da operação da empresa.

Os mockups devem mostrar telas coerentes, com texto legível em tamanho adequado. Evitar dispositivos empilhados que escondem o projeto. A escolha entre tela plana e mockup depende do que ajuda a avaliar o trabalho.

Vídeo é opcional. Se houver, oferecer pôster inicial, controle e alternativa textual. Não carregar um vídeo pesado como requisito para entender o hero. Não promover WebGL, 3D ou uma biblioteca de animação a requisito obrigatório sem testar se a solução é necessária.

O pacote atual contém documentação, não os ativos visuais, licenças ou logos das fontes. A implementação deve localizar e validar esses recursos no ambiente de trabalho.

## 10. Requisitos técnicos de construção

### 10.1 Respeitar o ambiente existente

Antes de escolher tecnologia, inspecionar repositório, dependências, convenções e infraestrutura. Não reescrever um projeto funcional apenas para usar uma stack preferida. Se não houver base, propor a solução mais simples capaz de cumprir o escopo. **[v1.1]** Stack definida para unolabs.com.br: Astro 7 + Cloudflare (Parte 0, §0.8).

Para este site, manter Astro 7 + TypeScript e geração estática de HTML no build, conforme a decisão de 02/10/2026. Enriquecer progressivamente o conteúdo com interações; não transformar o frontend em SPA nem ativar SSR ou adaptadores nesta arquitetura sem novo escopo aprovado.

Separar conteúdo, tokens e comportamento. Compartilhar componentes onde há função comum, sem obrigar todas as seções a ter a mesma aparência. Centralizar contatos e dados institucionais em uma configuração verificável.

### 10.2 Contratos de componentes

| Componente lógico | Responsabilidade | Estado alternativo necessário |
|---|---|---|
| Cabeçalho | Navegação e identificação | Menu mobile acessível, sem sobreposição do conteúdo focado |
| Hero | Oferta e próximo passo | Conteúdo legível antes de mídia e scripts |
| Experiência de assinatura | Demonstração voluntária das decisões | Estado final estático e explicação |
| Projeto | Natureza, objetivo e material | Ausência de demo não vira link falso |
| Processo | Etapas e saídas | Leitura integral sem interação |
| FAQ | Perguntas e respostas | Uso por teclado e conteúdo recuperável |
| Contato | Captura e encaminhamento real | Erro recuperável e confirmação precisa |
| Rodapé | Dados e navegação secundária | Omitir dados não confirmados |

Os nomes são conceituais. Adaptar arquivos e componentes ao padrão real do repositório.

### 10.3 Conteúdo e configuração

Não espalhar telefone, domínio e e-mail em vários componentes. Campos não verificados permanecem `null` na configuração. A interface de desenvolvimento deve indicar as dependências, sem gerar um contato plausível fictício.

Cada projeto deve ter natureza explícita: `conceptual` ou `client`. Para `client`, exigir identificação e permissões verificadas; para `conceptual`, manter o rótulo junto ao título. Métricas e depoimentos têm estrutura de evidência própria e ficam ausentes enquanto não existirem.

No contato, guardar credenciais apenas no ambiente apropriado do servidor. Validar entradas também no recebimento e limitar abuso conforme a infraestrutura escolhida. Não incluir segredos, tokens privados ou dados pessoais em exemplos públicos.

### 10.4 Publicação

Criar uma versão local ou de desenvolvimento não equivale a autorização de publicação. O deploy deve seguir o pedido concreto e a configuração real. Documentar variáveis, acessos necessários, comando de build efetivo e procedimento de reversão aplicável.

Não declarar “produção pronta” com placeholders, links quebrados ou etapas não testadas. Entregar uma lista objetiva do que está concluído, do que foi testado e do que depende de confirmação.

## 11. Qualidade de experiência e acessibilidade

Adotar **WCAG 2.2 nível AA como alvo de projeto**, não como certificação automática. Entre os critérios de referência, o contraste mínimo é 4,5:1 para texto comum e 3:1 para texto grande, com exceções próprias; a presença de um logotipo não isenta os textos da página. [T1]


Requisitos de projeto: texto real no HTML; estrutura coerente de títulos; foco visível; navegação completa por teclado; nomes compreensíveis nos controles; rótulos associados aos campos; mensagens de erro específicas; indicação de estado além da cor; imagens com alternativa adequada; leitura sem perda ao ampliar.

Meta interna para interação por toque: área confortável de pelo menos 44 × 44 px sempre que o layout permitir. Isso é uma escolha de projeto, não a transcrição de um mínimo universal.

Verificar contraste no componente real, considerando transparência e fundo. Ícones e bordas essenciais não devem desaparecer para deixar o layout “mais limpo”. Experiências que dependem de hover precisam de alternativa equivalente por toque e teclado.

Testar explicitamente movimento reduzido, navegação sem mouse e falha de JavaScript. Ferramentas automáticas ajudam a identificar problemas, mas a equipe deve realizar verificação manual das jornadas centrais.

## 12. Performance

Metas de referência para a experiência real: **LCP até 2,5 segundos, INP até 200 ms e CLS até 0,1**, avaliados no percentil 75 e com recortes de mobile e desktop. São metas para o site a construir, não resultados já alcançados. Medições de laboratório não substituem dados de uso real; uma pontuação Lighthouse não comprova o INP em campo. [T2]


Orçamento inicial proposto para a home: JavaScript inicial comprimido preferencialmente até 150 KB; carga inicial essencial, antes de mídia adiada, preferencialmente até 1 MB. Esses limites são internos, precisam de método de medição registrado e podem ser revistos por decisão consciente — não por crescimento acidental do bundle.

Priorizar dimensão reservada para mídia, arquivos adequados à tela, carregamento adiado abaixo da primeira área, fontes com poucos pesos e carregamento não bloqueante da demonstração. O conteúdo principal não espera pelo componente mais sofisticado.

Medir a versão de produção, não apenas o servidor de desenvolvimento. Registrar dispositivo, rede simulada, rota, data e versão de teste. Não prometer nota 100 em qualquer cenário nem usar um selo fictício de velocidade no site.

## 13. Busca, compartilhamento e consistência

Conteúdo deve explicar claramente a oferta, ter títulos de página específicos, descrições pertinentes e organização semântica. Implementar URLs consistentes, metadados de compartilhamento, sitemap e regras de indexação conforme o ambiente. Evitar indexar versões de demonstração não destinadas ao público.

Auditar a migração de referências: remover Audaro do título, descrição, rodapé, texto alternativo, manifesto, dados estruturados, mensagens de contato e imagens públicas. Retirar cores e fontes antigas apenas onde pertencem à marca UNO; não alterar a identidade de projetos demonstrados.

Não criar avaliações estruturadas, prêmios, endereço comercial ou perfis de organização com dados inventados. Não prometer posição no Google. Uma página de segmento precisa de conteúdo específico, não apenas a troca do nome de uma cidade ou setor. **[v1.1]** SEO local prioritário: Vitória, Vila Velha, Serra, Cariacica (ES) e Curitiba (PR). Páginas por cidade só com conteúdo próprio de verdade; páginas que só trocam o nome da cidade são tratadas pelo Google como spam.

## 14. Privacidade e confiança operacional

O fluxo deve coletar apenas o necessário para responder ao pedido. Explicar o destino das informações antes do envio. Não instalar rastreamento, pixels de publicidade ou sessão gravada por conveniência sem decisão e configuração apropriadas.

A política de privacidade precisa refletir a operação implementada. O texto genérico presente na referência solicita atualização antes da publicação; não é um documento final da UNO. [S3, rodapé e política]


Para atividades ou conteúdos sujeitos a regras setoriais, planejar revisão especializada antes de publicar. Esta especificação não substitui essa revisão e não declara conformidade jurídica da operação.

Não enviar nome, telefone, e-mail ou descrição livre do desafio aos eventos de analytics. Se uma demonstração precisar de dados, usar conteúdo conceitual local identificado, nunca dados privados de visitantes ou clientes.

## 15. Mensuração sem confundir intenção com resultado

| Evento proposto | Quando registrar | O que permite afirmar |
|---|---|---|
| `project_open` | Abertura real de um projeto | O trabalho foi acessado |
| `signature_interaction` | Mudança voluntária de estado | A demonstração foi explorada |
| `contact_start` | Início real do fluxo | Houve intenção de contato |
| `whatsapp_open` | Acionamento de link válido | O canal foi aberto, não que uma mensagem foi enviada |
| `form_submit_success` | Confirmação válida do backend | O formulário foi recebido pelo sistema, não que a oportunidade é qualificada |
| `qualified_opportunity` | Classificação comercial documentada | O contato atende aos critérios definidos pela UNO |
| `proposal_sent` / `project_won` | Registro comercial real | Houve proposta ou contratação conforme o registro |

Os nomes são sugestões de taxonomia. Não representam integrações já existentes. Não disparar um evento de sucesso apenas porque o usuário clicou em “Enviar”. Não atribuir contratação ao site sem um critério de origem e contexto.

## 16. Prioridades de execução

**P0 — primeira versão necessária:** mensagem clara, identidade consistente, hero refinado, experiência de assinatura funcional, trabalhos honestamente apresentados, oferta central, processo, contato real ou protótipo explicitamente sinalizado, responsividade e revisão de qualidade.

**P1 — aprofundamento:** páginas completas de projetos, exploração com anotações, brief em etapas, refinamento do conteúdo comercial e narrativa complementar. Uma página de projeto já disponibilizada na primeira versão deve estar completa para o que promete; P1 não autoriza links vazios.

**P2 — expansão validada:** **[v1.1]** (o blog saiu daqui e entrou no lançamento) páginas setoriais, novas experiências ou integrações. Somente com necessidade, material e capacidade definidos.

A primeira versão não pode ser uma homepage genérica sem a assinatura criativa. Também não precisa incluir todas as experiências interativas descritas. Priorizar uma demonstração principal excelente e os detalhes de uso.

## 17. Sequência de trabalho para o agente

Entender o ambiente e as fontes; registrar os fatos e a direção; estruturar as páginas e a copy; desenhar a home em desktop e mobile; implementar componentes e experiência principal; integrar canais confirmados; revisar conteúdo, identidade e funcionamento; testar; entregar o resumo de validação.

Em cada etapa, produzir uma saída observável. Não descrever como implementado algo que existe apenas em uma lista de ideias. Não usar testes inexistentes como argumento de confiança. Quando uma ferramenta não estiver disponível, registrar qual verificação não foi executada e realizar as verificações possíveis.

O acabamento deve ser revisado em páginas inteiras e em tamanho real, não apenas no hero ou em recortes escolhidos. Avaliar continuidade, ritmo, fim de página, menus abertos, mensagens de erro e longos títulos reais.

## 18. Definição de pronto

A experiência está pronta para revisão quando comunica corretamente a UNO, mantém a identidade, demonstra a capacidade criativa e funciona nas jornadas essenciais. Está pronta para publicação apenas quando também possui conteúdo final, ativos validados, contatos reais, tratamento de dados coerente, testes documentados e autorização correspondente.

A aprovação estética não compensa um botão falso. Um relatório de performance não compensa uma apresentação genérica. **A entrega precisa reunir desejo, clareza, integridade e funcionamento.**


---


# PARTE III — Copy proposta


# UNO Labs — Copy proposta para o site

**Versão 1.0 · 29/09/2026 · textos de trabalho para revisão editorial**

Os blocos abaixo podem orientar o protótipo. São propostas de redação, salvo as frases explicitamente identificadas como provenientes das fontes. Antes da publicação, verificar se cada serviço e cada descrição de processo correspondem à operação. Não publicar as notas de edição como conteúdo comercial.

## 1. Cabeçalho

**Marca:** usar o ativo gráfico UNO Labs.\
**Navegação:** Projetos · Soluções · Abordagem · Contato.\
**Ação:** Conversar sobre meu projeto.

O destino da ação deve acompanhar a implementação. Para formulário, pode abrir `/contato`. Para WhatsApp direto, o rótulo deve explicitar “Falar sobre meu projeto no WhatsApp”.

## 2. Hero

**Rótulo** **[v1.1]**\
Criação de sites · SEO local · Google Ads · Meta Ads

**Título** **[v1.1]** (escolha do usuário; a versão anterior “Seu negócio tem valor. Seu site precisa estar à altura.” foi descartada)\
Presença digital que atrai clientes.

**Texto de apoio** **[v1.1]**\
Sites profissionais, SEO local e anúncios no Google e no Meta para empresas que querem ser encontradas com facilidade — e escolhidas com confiança.

**CTA principal**\
Conversar sobre meu projeto

**CTA secundário**\
Explorar projetos

**Apoio de contexto** **[v1.1]**\
A partir de R$ 1.490 em até 10x sem juros · Atendimento presencial na Grande Vitória e em Curitiba · Site, SEO e anúncios no mesmo time

**Nota editorial:** não adicionar “mais de X clientes”, “especialistas premiados” ou “anos de experiência” sem evidência. As duas ações precisam levar a destinos reais, não à mesma âncora por conveniência.

## 3. Experiência de assinatura

**Rótulo**\
POR TRÁS DA EXPERIÊNCIA

**Título**\
O valor toma forma nas decisões.

**Texto**\
Uma mensagem bem organizada. Uma direção visual coerente. Uma interação que torna o próximo passo simples. Explore como essas escolhas se conectam.

**Controle de abertura**\
Revelar as decisões

**Estado Mensagem**\
O essencial aparece primeiro. A estrutura apresenta a proposta, organiza as informações e deixa claro para quem essa solução faz sentido.

**Estado Direção**\
Cada escolha participa da percepção. Tipografia, espaço e composição trabalham juntos para dar à mensagem uma expressão própria.

**Estado Experiência**\
O cuidado continua no uso. A interface responde, adapta-se à tela e apresenta um caminho claro para continuar.

**Rótulo persistente na demonstração**\
Demonstração conceitual criada para apresentar a abordagem da UNO Labs.

**Controle de retorno**\
Ver a experiência completa

**Nota editorial:** usar “explore” apenas quando os estados estiverem implementados. Não exibir “analisando sua empresa”, “IA trabalhando” ou uma barra de progresso fictícia.

## 4. Trabalhos selecionados

**Rótulo**\
ESTUDOS DE DIREÇÃO DIGITAL

**Título**\
A mesma atenção ao detalhe. Uma expressão própria para cada negócio.

**Texto**\
Os estudos a seguir demonstram como contexto, mensagem e direção visual podem se transformar em experiências diferentes. São projetos conceituais, não relatos de clientes atendidos.

### Casa Noma

**Natureza:** Estudo conceitual.\
**Contexto:** Restaurante contemporâneo.\
**Objetivo:** Traduzir atmosfera, proposta gastronômica e reserva em uma experiência digital clara e convidativa.\
**Decisão em destaque:** Ritmo editorial e composição que valorizam a experiência sem esconder as informações práticas.\
**Ação:** Explorar o estudo.

### Atria Clinic

**Natureza:** Estudo conceitual.\
**Contexto:** Clínica de estética.\
**Objetivo:** Organizar a apresentação da clínica, suas informações e o caminho para uma conversa inicial.\
**Decisão em destaque:** Hierarquia calma e respiro visual para uma apresentação cuidadosa, sem promessas de resultado.\
**Ação:** Explorar o estudo.

### Módulo Engenharia

**Natureza:** Estudo conceitual.\
**Contexto:** Engenharia B2B.\
**Objetivo:** Tornar capacidade técnica, serviços e contato comercial mais fáceis de compreender.\
**Decisão em destaque:** Grade precisa e conteúdo organizado para apresentar complexidade sem excesso de ruído.\
**Ação:** Explorar o estudo.

**Nota de origem:** nomes, natureza conceitual e contextos vêm do site de referência; os textos acima foram reescritos. Não afirmar que as demonstrações estão disponíveis antes de verificar os ativos e destinos. [S3, projetos]


## 5. Proposta de valor

**Título**\
Mais do que apresentar sua empresa. Tornar seu valor mais claro.

**Texto principal**\
Sua presença digital precisa acompanhar o nível do que você entrega. Nosso trabalho conecta o que deve ser dito, a forma como isso será percebido e a experiência de quem chega até sua empresa.

**Mensagem que organiza**\
Uma proposta compreensível, informações em ordem e respostas às dúvidas importantes.

**Design que representa**\
Uma direção visual construída para o contexto do negócio, não apenas um modelo com outra cor.

**Experiência que funciona**\
Leitura, navegação e interação tratadas como parte da mesma entrega.

**Contato com contexto**\
Um próximo passo claro para quem reconhece valor na sua proposta e quer conversar.

## 6. Solução principal

**Título**\
Sites sob medida. Do contexto à experiência.

**Texto**\
Sites institucionais, landing pages e páginas de serviço desenvolvidos a partir do que sua empresa precisa comunicar e do que seu público precisa entender.

**Apoio**\
O projeto pode reunir arquitetura de conteúdo, organização da mensagem, direção visual, interface responsiva e desenvolvimento. A composição acompanha os objetivos e a complexidade do escopo.

**Linha comercial**\
Primeiro, o contexto. Depois, uma proposta clara do que será construído.

**CTA**\
Conversar sobre meu projeto

**Bloco complementar condicional**\
Evolução quando fizer sentido.

**Texto complementar condicional**\
SEO, aquisição e suporte podem acompanhar a evolução da presença digital, com escopo e responsabilidades definidos separadamente.

**[v1.1]** SEO, Google Ads, Meta Ads e manutenção estão validados e podem ser publicados como serviços. **Nota editorial:** o bloco complementar só deve ser publicado após validação das ofertas ativas. Não listar cada serviço da referência como disponibilidade automática da UNO.

## 7. Método

**Título**\
Direção antes da execução. Cuidado até a entrega.

**Introdução**\
Um projeto bem conduzido precisa de decisões claras. O trabalho avança por etapas que conectam o contexto do negócio ao site que será publicado.

**01 · Entender**\
Conhecer a empresa, a oferta, o público e o que precisa mudar na presença digital.

**02 · Direcionar**\
Organizar conteúdo, mensagem e direção visual antes de aprofundar a execução.

**03 · Construir**\
Conectar design e desenvolvimento em uma experiência pensada para diferentes telas.

**04 · Publicar**\
Revisar o conteúdo, testar o funcionamento e preparar a entrada no ar.

**Depois · Evoluir, se contratado**\
Definir as próximas melhorias conforme a necessidade do negócio.

**Apoio comercial**\
Escopo, investimento e cronograma são definidos antes do início do projeto.

**Nota editorial:** usar esse compromisso apenas quando incorporado ao processo comercial real. Não adicionar prazos fixos ou revisões ilimitadas.

## 8. Adequação high ticket, sem usar o rótulo publicamente

**Título**\
Para empresas que tratam sua presença digital como parte do negócio.

**Texto**\
A abordagem faz sentido para quem tem qualidade a comunicar, quer se diferenciar com consistência e procura um projeto construído para o seu contexto — com atenção à mensagem, à experiência e à execução.

**Apoio**\
Mais do que preencher uma página, o objetivo é apresentar sua empresa à altura do que ela entrega.

**Nota editorial:** esse bloco comunica o posicionamento sem presumir renda, depreciar outros públicos ou inventar uma seleção exclusiva de clientes.

## 9. Perguntas frequentes

### Quanto custa um projeto?

**[v1.1]** Projetos começam em R$ 1.490, em até 10x sem juros. O valor final depende do número de páginas, do conteúdo, da direção visual e das funcionalidades. Você recebe a proposta fechada antes de começar.

### Quanto tempo leva?

O cronograma considera a complexidade do projeto, a disponibilidade de conteúdo e as etapas de validação. O prazo é combinado na proposta, antes do início do trabalho.

### O projeto considera o celular desde o começo?

Sim. A proposta de trabalho considera conteúdo, leitura, navegação e interação em telas menores desde a estrutura, não apenas como uma redução do desktop.

### Vocês ajudam a organizar o conteúdo?

A organização da mensagem e a arquitetura de conteúdo podem fazer parte do projeto. Redação completa, fotografia, vídeo e outros materiais específicos devem ser definidos no escopo.

### Meu site terá o mesmo visual dos estudos apresentados?

Não necessariamente. Os estudos mostram possibilidades de direção. Seu projeto deve partir da identidade, dos objetivos e do contexto da sua empresa.

### Os projetos apresentados são de clientes reais?

Os trabalhos identificados como estudos conceituais foram criados para demonstrar direção visual e abordagem de projeto. Eles não representam resultados comerciais de clientes atendidos.

### Como ficam domínio, hospedagem e manutenção?

Esses itens precisam estar definidos na proposta, com responsabilidades, acessos e eventuais custos recorrentes claros. A recomendação é que sua empresa mantenha controle dos próprios ativos e saiba o que está incluído na contratação.

### O site garante mais vendas?

Não. Um site pode contribuir para clareza, apresentação e facilidade de contato, mas a venda também depende da oferta, da demanda, da aquisição e do atendimento. O projeto deve ter objetivos definidos, sem promessas automáticas de resultado.

**Nota editorial:** respostas são propostas. Validar a política operacional antes de publicá-las. Não recuperar “até 10x” dos arquivos de referência como condição comercial aprovada.

## 10. Contato

**Título**\
Sua empresa já tem valor. Vamos fazer o digital mostrar isso.

Essa chamada vem do site de referência. [S3, CTA final]


**Texto proposto**\
Conte o momento da sua empresa e o que você quer construir. A conversa começa pelo contexto para definir um caminho coerente para o projeto.

**Campos propostos**\
Seu nome · Empresa · Canal para retorno · O que você quer construir ou melhorar?

**Ajuda do campo de desafio**\
Você pode contar o objetivo, a situação atual e o que considera importante no projeto.

**Informações adicionais opcionais**\
Site atual · Prazo desejado · Investimento previsto ou “Ainda não definido”.

**Ação quando houver formulário real**\
Enviar contexto do projeto

**Confirmação, somente após recebimento confirmado**\
Recebemos suas informações. Obrigado por compartilhar o contexto do projeto.

**Erro recuperável**\
Não foi possível enviar agora. Suas informações continuam nesta tela para você tentar novamente.

**Ação quando houver apenas encaminhamento para WhatsApp**\
Continuar no WhatsApp

**Aviso de encaminhamento**\
Você poderá revisar a mensagem e enviá-la no WhatsApp.

**[v1.5]** Fluxo previsto do formulário: navegador → Worker `/api/contato` → n8n → SMTP HostGator → `contato@unolabs.com.br`. A resposta esperada do n8n após a aceitação SMTP é `{"ok":true,"encaminhamento":"smtp_aceito"}`; uma resposta 2xx genérica não comprova o encaminhamento. Aceitação do backend, aceitação SMTP e recebimento na caixa são evidências distintas. A configuração e a homologação real continuam pendentes. Não prometer prazo de resposta sem política definida. A política de privacidade deve explicar a operação real.

## 11. Página Abordagem

**Título**\
Uma presença digital bem construída começa antes do layout.

**Abertura**\
O que sua empresa oferece? O que a torna relevante? O que o visitante precisa compreender para considerar uma conversa? Essas perguntas orientam a forma como a UNO Labs propõe conectar mensagem, design e desenvolvimento.

**Desenvolvimento**\
A direção visual precisa ter contexto. A estrutura precisa dar prioridade ao que importa. E a implementação precisa transformar essas decisões em uma experiência funcional.

Em vez de escolher uma aparência e adaptar o negócio a ela, a proposta é construir uma expressão digital coerente com o que a empresa entrega e com o objetivo do projeto.

**Fechamento**\
Clareza no que se comunica. Cuidado no que se desenha. Critério no que se constrói.

**CTA**\
Conversar sobre meu projeto

Não adicionar fundador, equipe, endereço de escritório, tempo de mercado ou método “proprietário comprovado” sem confirmação.

## 12. Rodapé e metadados

**Descrição curta proposta**\
UNO Labs é um estúdio de engenharia digital. Sites sob medida com estratégia, design e desenvolvimento.

**Assinatura documentada**\
Presença digital que gera oportunidades.

**Título de página proposto** **[v1.1]**\
Criação de Sites, SEO e Google Ads em Vitória e Vila Velha | UNO Labs

**Descrição de busca proposta**\
Estratégia, design e desenvolvimento para criar sites sob medida, apresentar o valor da sua empresa e facilitar oportunidades de contato.

**Nota editorial:** não preencher domínio canônico, e-mail, telefone, redes sociais ou dados empresariais por inferência. Títulos e descrições de outras páginas devem refletir seu conteúdo, sem repetir mecanicamente a home.


---


# PARTE IV — Critérios de aceite


# UNO Labs — Critérios de aceite e revisão

**Versão 1.0 · 29/09/2026**

Este é um plano de verificação para o site a construir. **Nenhum teste do site foi executado nesta entrega de documentação.** Caixas vazias não representam aprovação. A rubrica é uma ferramenta interna proposta, não certificação de marca, acessibilidade ou desempenho.

## 1. Bloqueios críticos de publicação

Um único bloqueio crítico impede considerar a versão pronta para publicação, independentemente da nota estética.

| Bloqueio | Condição para resolver |
|---|---|
| Nome, logo ou paleta incorretos | UNO Labs correto; símbolo UNO completo; ativos coerentes com um único kit |
| Prova falsa ou ambígua | Remover dados fictícios; identificar estudos conceituais no contexto de exibição |
| Contato simulado | Canal confirmado ou backend funcional; mensagens correspondem ao que realmente ocorreu |
| Ação essencial inacessível | Navegação e contato disponíveis por teclado e toque, com foco compreensível |
| Conteúdo dependente de efeito | Mensagem essencial recuperável sem animação e com falha de script |
| Dados empresariais inventados | Confirmar, omitir ou manter apenas em desenvolvimento explicitamente sinalizado |
| Segredos ou tratamento de dados inadequado | Remover exposições e revisar fluxo real antes de publicar |
| Publicação não autorizada | Aguardar instrução e ambiente apropriados, sem executar deploy por inferência |

## 2. Posicionamento e conteúdo

- [ ] A primeira área explica que a UNO Labs cria sites sob medida.
- [ ] O texto valoriza estratégia, criação e execução, sem competir por menor preço.
- [ ] High ticket orienta a qualificação, sem linguagem pública excludente ou artificial.
- [ ] A proposta de valor não é confundida com garantia de vendas.
- [ ] Serviços complementares publicados foram confirmados como ofertas ativas.
- [ ] Preço e parcelamento publicados são exatamente os da Parte 0 (R$ 1.490, 10x sem juros); não há prazo, prêmio ou quantidade de clientes sem fonte.
- [ ] Cada projeto indica claramente se é conceitual ou de cliente real.
- [ ] A assinatura gráfica não foi substituída pela headline da campanha.

## 3. Identidade e direção de arte

- [ ] O nome público é UNO Labs; não há resíduos públicos de Audaro.
- [ ] U, N e O têm a mesma cor; o disco do O segue a variante correta.
- [ ] O símbolo compacto contém as três letras e não foi redesenhado pelo agente.
- [ ] O mesmo pacote validado governa SVGs, proteção e variantes.
- [ ] A base da home, inclusive o hero, é Off White na direção proposta.
- [ ] Mint é usado com intenção; não há texto claro ilegível sobre acento claro.
- [ ] Tipografia, alinhamento, espaçamento e raios têm consistência.
- [ ] O site não repete o mesmo padrão de cards em todas as seções.
- [ ] Projetos recebem escala suficiente para avaliar o trabalho.
- [ ] A composição estática permanece excelente quando o movimento é retirado.

## 4. Experiência de assinatura

- [ ] O visitante vê uma composição final refinada antes de optar pela exploração.
- [ ] A demonstração tem estados que mudam de fato o que foi prometido.
- [ ] Cada estado explica uma decisão, não apenas um efeito decorativo.
- [ ] O caráter conceitual aparece junto da experiência.
- [ ] Controles funcionam com clique, toque e teclado.
- [ ] Movimento reduzido preserva conteúdo e controle.
- [ ] Falha de JavaScript deixa o estado estático e a explicação disponíveis.
- [ ] Trocas rápidas de estado não deixam camadas presas ou texto sobreposto.
- [ ] Não há análise de IA, dado comercial ou resposta de sistema fictícios.

## 5. Jornadas para testar manualmente

**Primeira visita sem explorar efeitos:** identificar a oferta, abrir um projeto, encontrar a abordagem e chegar ao contato.

**Decisor que já sabe o que deseja:** ir direto ao contato, informar o contexto e receber retorno de interface correto, sem passos obrigatórios de demonstração.

**Exploração visual:** revelar decisões, trocar para mobile, fechar ampliação e retornar ao ponto anterior sem perder contexto.

**Uso por teclado:** percorrer menu, abrir e fechar componentes, selecionar estados, preencher campos e recuperar um erro. Verificar ordem e retorno de foco.

**Celular:** ler títulos sem cortes, usar menu e seleção de estados com uma mão, acessar contato sem sobreposição de barra flutuante.

**Conexão degradada e falha de recursos:** entender a oferta antes da mídia, continuar lendo se imagem ou animação falhar e não receber confirmação falsa em falha de envio.

## 6. Matriz inicial de ambientes

Testar larguras de referência de 360, 390, 768, 1.280 e 1.440 px; pelo menos uma tela mobile real quando disponível; navegação em navegadores relevantes ao público; zoom de texto; preferência por movimento reduzido; ausência de mouse e estados de erro.

Essas larguras são amostras de trabalho, não garantia de cobertura integral. Verificar também pontos intermediários em que textos ou componentes quebram. Não declarar “testado em todos os dispositivos”.

## 7. Verificação técnica

Executar os comandos reais disponíveis de validação, build e testes; registrar exatamente quais rodaram. Conferir links, rotas, metadados, imagens, console, dependências e exposição de dados. Medir desempenho no build de produção e separar resultado de laboratório de resultado real de campo.

Uma captura do hero não é uma revisão do site. Inspecionar páginas completas, menus abertos, fim de formulário, footer, telas de projeto e estados alternativos. Comparar desktop e mobile com os mesmos conteúdos finais.

## 8. Rubrica proposta de qualidade

| Critério | Peso |
|---|---:|
| Clareza da oferta, proposta de valor e adequação ao público | 20 |
| Direção de arte, identidade e acabamento | 25 |
| Demonstração de capacidade e qualidade da experiência de assinatura | 20 |
| Navegação, contato e acessibilidade prática | 20 |
| Desempenho e robustez técnica | 10 |
| Integridade de conteúdo, proveniência e documentação | 5 |
| **Total** | **100** |

Ponto de partida interno: buscar pelo menos 85/100 para revisão de lançamento e nenhum bloqueio crítico. A nota não é uma métrica de mercado; serve para impedir que a aprovação dependa apenas de preferência estética. Registrar justificativas e evidências, não somente números.

## 9. Formato do relatório de entrega do agente

Informar versão e escopo; resumo do que foi implementado; arquivos alterados; principais decisões; testes executados com comandos e resultados; verificações manuais; limitações; dados ainda pendentes; estado de publicação.

Usar categorias objetivas: **implementado e verificado**, **implementado, mas não verificado neste ambiente**, **não implementado** e **depende de informação confirmada**. Nunca chamar as quatro categorias de “concluído”.

**Pergunta final de revisão:** o site demonstra uma capacidade de criação que justifica uma conversa sobre um projeto importante, mantendo clareza, honestidade e qualidade de uso?


---


# PARTE V — Fontes e decisões


# UNO Labs — Fontes, precedência e registro de decisões

**Versão 1.0 · consulta em 29/09/2026**

## 1. O que foi consultado

Foram lidos os dois manuais disponíveis na Biblioteca, as duas referências HTML e as decisões visíveis na conversa. A busca específica na superfície da conversa não retornou arquivos; as fontes textuais pertinentes foram recuperadas na Biblioteca. As imagens e os SVGs citados dentro dos manuais não foram inspecionados como arquivos independentes nesta entrega. Não houve auditoria de um site publicado, investigação de concorrentes ou validação de dados empresariais externos.

Não confundir leitura dos manuais com homologação dos vetores, propriedade das imagens ou verificação de um portfólio em produção. Este pacote entrega **documentação estratégica nova**, não uma cópia integral dos kits de identidade ou seus ativos.

## 2. Registro de fontes internas

| Código | Fonte | Versão / identificação | O que sustenta |
|---|---|---|---|
| U1 | Pedido atual do usuário | Conversa de 29/09/2026 | Documentação completa para Claude/Codex; foco high ticket; site extremamente elegante, profissional e surpreendente |
| U2 | Conversa anterior sobre identidade | Contexto de 28/09/2026 | Preferência pela logo horizontal, cuidado com consistência dos derivados e distinção entre fundo claro aplicado e branco do cenário de apresentação |
| U3 | Respostas do usuário na sessão Cowork | 29/09/2026 | Todas as decisões da Parte 0 |
| U4 | Conteúdo aprovado pelo usuário para a equipe | 01/10/2026 | Cargos, textos integrais, fotografias e especificação de apresentação registrados na Parte 0, §0.5 |
| S1 | `UNO_Labs_Manual_Completo.md` | Versão 1.0, 29/09/2026; versão de arquivo recuperada: 1 | Essência, mensagens, paleta vigente, logo, limites de uso e fatos não confirmados |
| S2 | `MANUAL_COMPLETO.md` | Edição técnica 1.0, 29/09/2026; versão de arquivo recuperada: 1 | Confirmação da identidade central, governança e uma formalização técnica distinta dos ativos |
| S3 | `index(1).html` | Referência verde; versão de arquivo recuperada: 1 | Oferta, jornada, processo, estudos conceituais e limitações dos contatos/política de referência |
| S4 | `index.html` | Referência anterior burgundy; versão de arquivo recuperada: 1 | Histórico de comunicação e oferta; não é baseline visual atual |

S1 identifica a atividade como estúdio de engenharia digital focado em sites sob medida e mantém Audaro apenas nas referências. S3 apresenta explicitamente os exemplos como estudos conceituais. Esses pontos sustentam a delimitação da empresa e da prova comercial utilizada na documentação.


Os nomes acima servem para rastreabilidade. Localização atual: S1 = `01 - IDENTIDADE VISUAL/UNO_Labs_Manual_Completo.md`; S2 não integra o projeto e foi desconsiderado na v1.1 (vale o kit da pasta `01 - IDENTIDADE VISUAL`); S3 = `01 - IDENTIDADE VISUAL/09_referencias/06_site_referencia_index.html`; S4 = modelos antigos em `00 - ARQUIVOS EXCLUIR` (a excluir).

## 3. Hierarquia de decisão

Primeiro, cumprir instruções expressas atuais do usuário. Depois, preservar as decisões de identidade registradas de forma coerente nos manuais. As propostas desta entrega orientam o novo posicionamento e o novo site sem reescrever os fatos de origem. O HTML serve como referência de conteúdo e abordagem, não como contrato comercial nem site UNO pronto. Explorações anteriores permanecem históricas.

Uma preferência de um agente não revoga uma decisão de marca. Uma imagem gerada não revoga uma correção textual. Um campo de exemplo não se transforma em dado empresarial por estar dentro de uma peça bonita.

Nos detalhes em que dois manuais da mesma data divergem, a data não resolve o conflito. É necessário identificar o pacote real utilizado e aplicar seu conjunto técnico de forma consistente.

## 4. Conflitos encontrados e tratamento adotado

### 4.1 Paleta histórica versus paleta registrada como vigente

A conversa anterior usa Petróleo `#123B3A`, Jade `#56D4AD`, Marfim `#F5F2EA` e Névoa esverdeada `#DCEAE5`. Os manuais de 29/09 registram Pine `#0E2B24`, Mint `#7DD3A8`, Off White `#F3F7F3` e Sage `#A8B8AE`, classificando as explorações Jade/Petróleo/Marfim como anteriores.

**Tratamento:** adotar o consenso mais recente dos manuais como baseline desta documentação. Preservar a intenção de site predominantemente claro e de contraste com uma prancha externa branca. Não chamar Off White de Marfim nem combinar os dois sistemas. Uma nova orientação expressa deve atualizar toda a documentação e os tokens.


### 4.2 Tipografia institucional versus referência de site

S1 e S2 distinguem Inter como referência institucional e Sora/Source Sans 3/DM Mono como perfil do HTML. Não há uma escolha única do site que possa ser inferida apenas da presença dessas fontes no código.

**Tratamento:** recomendar Inter no protótipo para continuidade institucional; registrar uma decisão específica antes de institucionalizar outra família. Não redigitar a logo em nenhuma delas.


### 4.3 Proteção e margens do logotipo

S1 usa H/4 como proteção e a incorpora às exportações. S2 utiliza o diâmetro do disco como unidade externa de proteção, distinguindo isso da pequena margem técnica do arquivo.

**Tratamento:** não aplicar automaticamente a mesma largura CSS e a mesma margem a ativos de ambos os kits. Selecionar um pacote, inspecionar o ativo real e seguir seu manual. Nenhuma nova geometria foi produzida aqui.


### 4.4 Monocromático claro e assinatura

S1 chama de `mono-white` uma variante em Off White; S2 documenta a monocromática branca em branco puro. S1 descreve recomposição da assinatura em Inter; S2 registra vetorização da assinatura a partir da prancha, sem recomposição.

**Tratamento:** esses detalhes pertencem a formalizações distintas. Não afirmar que são o mesmo arquivo com nomes diferentes, nem usar a aparência de um para validar o outro. A versão negativa colorida consensual permanece com letras Off White e disco Mint.


### 4.5 Condições comerciais e links do HTML

O HTML inclui conteúdo comercial de referência e links de WhatsApp sem número de destinatário. Também indica que a política precisa ser atualizada antes da publicação. S1 esclarece que preços, prazos, parcelamento e política comercial não estão fixados pelo kit.

**Tratamento:** não reaproveitar condições, contatos ou política como fatos confirmados. Configurar canais reais; descrever corretamente abertura de WhatsApp versus envio de formulário; validar ofertas e condições antes de publicar.


## 5. Registro de decisões desta versão

| ID | Decisão ou definição | Status | Implicação |
|---|---|---|---|
| D01 | Atividade principal: sites sob medida / engenharia digital | Base documental | Não ampliar arbitrariamente para agência generalista ou consultoria de IA |
| D02 | Atrair público e projetos high ticket | Diretriz do usuário | Mensagem, prova e qualificação devem sustentar valor, não menor preço |
| D03 | Interpretar high ticket como investimento na UNO e valor das ofertas dos clientes | Interpretação estratégica explícita | Não presumir ticket mínimo ou renda pessoal |
| D04 | Conceito de experiência “Precisão que se revela” | Proposta nova | Composição clara com profundidade descoberta voluntariamente |
| D05 | Home predominantemente Off White, inclusive hero | Proposta de aplicação | Evitar direção inteiramente escura e manter contraste com prancha externa branca |
| D06 | Experiência “O valor toma forma” como assinatura | Proposta nova | A primeira versão precisa de uma demonstração autoral funcional |
| D07 | Estudos conceituais permanecem identificados | Base documental e regra editorial | Não convertê-los em clientes ou resultados |
| D08 | Inter como baseline do protótipo | Proposta conservadora | Registrar escolha final do sistema web |
| D09 | Selecionar um único pacote técnico de logos | Pendente de ativo e validação | Não combinar margens, geometria e variantes entre kits |
| D10 | Oferta central; complementos subordinados e validados | Proposta baseada nas fontes | Não publicar catálogo ampliado por inferência; catálogo definido em D31 a D36 |
| D11 | Sem números comerciais inventados | Regra de integridade | Termos e prazos definidos por escopo na proposta; contatos confirmados em §0.10, funcionamento ainda não homologado |
| D12 | Acessibilidade, desempenho e honestidade como condições de qualidade | Requisito de projeto | Efeitos não compensam falhas críticas de uso |
| D13 | UNO Labs substitui a “Audaro — Engenharia Digital”; Audaro — Engenharia de Resultado é outra empresa | Decisão do usuário (v1.1) | Sem redirecionamento; automação/IA fora da UNO |
| D14 | Serviços ativos: sites, SEO, Google Ads, Meta Ads, manutenção mensal | Decisão do usuário (v1.1) | Podem ser publicados como serviços |
| D15 | Preço público “a partir de R$ 1.490 em até 10x sem juros” | Decisão do usuário (v1.1) | Único valor publicável |
| D16 | Domínio unolabs.com.br | Confirmado (v1.1) | Canonical, e-mail e dados estruturados |
| D17 | Equipe: Urias Loures e Bruno Gonzaga são cofundadores; Milena Dias atua em Comunicação e Conteúdo | Decisão do usuário, atualizada em 01/10/2026; substitui o registro de 30/09/2026 | Ver Parte 0, §0.5, para os cargos e os textos integrais aprovados |
| D18 | Presencial na Grande Vitória/ES e em Curitiba/PR; remoto no Brasil | Decisão do usuário (v1.1) | SEO local nas 5 cidades |
| D19 | Blog desde o lançamento, 2 a 4 artigos por mês, IA com revisão humana | Decisão do usuário (v1.1) | Substitui a restrição anterior ao blog |
| D20 | Inter mantida; escopos A/B/C em avaliação | Decisão do usuário (v1.1) | Substitui a recomendação de trocar a fonte |
| D21 | Frontend Astro 7 + TypeScript estático; Worker existente preservado → n8n → SMTP HostGator → `contato@unolabs.com.br` | Atualizado em 02/10/2026 | Integração Cloudflare com o build, backend e e-mail ainda não homologados; ver §0.8 e §0.11 |
| D22 | Headline “Presença digital que atrai clientes.” | Decisão do usuário (v1.1) | Substitui a headline anterior |
| D23 | Garantia cobre falhas do entregue; alterações só via manutenção mensal | Decisão do usuário (v1.1), termos comerciais atualizados em 30/09/2026 | Detalhar termos e prazos na proposta; não publicar marcadores ou números provisórios na home |
| D24 | E-commerce fora do escopo por enquanto | Decisão do usuário (v1.1) | Não anunciar |
| D25 | Cloudflare Workers com Static Assets permanece a hospedagem oficial planejada | Decisão registrada na v1.2; integração Astro adiada em 02/10/2026 | Não executar configuração antiga como receita de deploy; ver §0.8 e LEIA-ME |
| D26 | E-mail do domínio na HostGator (Plano M contratado), sem Cloudflare Email Routing | Decisão do usuário (v1.2) | A contratação está confirmada; acesso operacional, conta, DNS e envio não estão verificados. Conferir MX e `mail` sem proxy |
| D27 | Jornada da home presa na tela durante a rolagem (sticky), com rolagem nativa | Decisão do usuário (v1.2) | Substitui as abas clicáveis; manter alternativa estática para movimento reduzido |
| D28 | Migrar agora para Astro 7 + TypeScript, sem aguardar artigos; preparar MDX com coleção vazia | Decisão de Urias em 02/10/2026; substitui o adiamento da v1.3 | Fontes em `src/`, saída `dist/`, artigos e integração oficial em etapas posteriores; evidências no relatório |
| D29 | `04 - SITE` é a única pasta oficial para análises, Impeccable, localhost, alterações e Git; documentação em `docs/`; `03 - ANALISE LP` é histórico | Padronização solicitada pelo usuário (v1.4) | Ver Parte 0, §0.13 e `AGENTS.md` |
| D30 | Retratos reais convertidos em derivados WebP locais e apresentados na ordem retrato, nome, cargo e dois parágrafos | Aprovação do usuário em 01/10/2026 | Ver Parte 0, §0.5; preservar originais, sem retoques ou geração, com exibição máxima de 320 px |
| D31 | UNO Labs como marca guarda-chuva; produtos UNO Sites, UNO Chat, UNO Mail e UNO CRM com landing page própria em subdomínio | Decisão de Bruno em 09/10/2026 (#30); confirmação de Urias pendente | Ver Parte 0, §0.14; home institucional em #29 |
| D32 | Prioridade: UNO Sites e UNO Chat; UNO Mail em seguida; UNO CRM adiado | Decisão de Bruno em 09/10/2026 (#30) | #34 fechada |
| D33 | UNO Sites só por assinatura de 12 meses: Página única R$ 497 + R$ 197/mês; Institucional R$ 997 + R$ 297/mês; sem projeto com pagamento único | Decisão de Bruno em 09/10/2026 (#30); confirmação de Urias pendente | Substitui D15 e o pacote de R$ 1.490 após a confirmação; home em #36, contrato em #38 |
| D34 | Hospedagem, domínio, 1 caixa de e-mail, ajustes mensais e relatório incluídos na assinatura; caixa extra R$ 49/mês | Decisão de Bruno em 09/10/2026 (#30) | Resolve a pendência de hospedagem, domínio e e-mail como serviços (§0.11) |
| D35 | UNO Chat mantém Essencial e Equipe; implantação grátis para assinantes do UNO Sites; Chatwoot + WhatsApp Cloud API | Decisão de Bruno em 09/10/2026 (#30) | Ajusta D13: atendimento humano no WhatsApp entra na UNO; infraestrutura em #37 |
| D36 | Google/Meta Ads a partir de R$ 1.290/mês (mídia à parte, mínimo 3 meses) e SEO local a partir de R$ 990/mês como adicionais | Decisão de Bruno em 09/10/2026 (#30) | Resolve a pendência da verba de mídia; fora do destaque da home |
| D37 | Diferencial frente a sites feitos por IA: prazo curto, site ligado ao WhatsApp e acompanhamento depois de publicado | Decisão de Bruno em 09/10/2026 (#30) | Permite anunciar os prazos fixos do UNO Sites (§0.6, item 3) |
| D38 | Automação/consultoria de IA e vídeos em motion sem lugar definido no catálogo | Em aberto (#30) | Seguem fora da comunicação até decisão |

## 6. Registro de informações a confirmar

**Para desenhar e prototipar:** é possível avançar com o nome, a essência, a direção high ticket, a paleta de consenso e os textos de trabalho. Marcar dependências pontuais, sem paralisar o projeto.

**Antes de publicar:** confirmar logo/pacote final; validar os dados empresariais necessários; natureza e autorização dos projetos; serviços efetivamente ativos; política de operação e de dados; infraestrutura e homologação real do contato; conteúdo final e autorização de publicação. Os contatos confirmados já estão no HTML e no JSON-LD, e os links foram validados localmente; caixa e entrega SMTP continuam sem homologação.

**Antes de anunciar condições comerciais específicas:** confirmar ticket mínimo, prazo, parcelamento, revisões, manutenção, custos recorrentes, direitos e responsabilidades. Não importar números dos mockups ou condições do HTML antigo.

S1 e S2 registram que contatos, responsáveis e dados empresariais não estavam confirmados nas fontes consultadas originalmente. Os contatos foram informados depois e estão na Parte 0, §0.10; os dados empresariais seguem pendentes.


## 7. Referências técnicas externas

Consultadas apenas para requisitos técnicos e uso dos arquivos de instrução. Não definem a identidade ou a estratégia da UNO. A data de consulta não implica que todas as páginas tenham sido publicadas nessa data.

**T1 — W3C, WCAG 2.2.** Referência de acessibilidade e contraste. Endereço: `https://www.w3.org/TR/WCAG22/`.

**T2 — Google, web.dev, Web Vitals.** Referência para limiares e diferença entre medição em laboratório e em campo. Endereço: `https://web.dev/articles/vitals`.

**T3 — Anthropic, Claude Code, How Claude remembers your project.** Referência para instruções de projeto em CLAUDE.md. Endereço: `https://code.claude.com/docs/en/memory`.

**T4 — OpenAI, Custom instructions with AGENTS.md.** Referência para instruções de projeto do Codex. Endereço de entrada: `https://developers.openai.com/codex/guides/agents-md/`; destino consultado: `https://learn.chatgpt.com/docs/agent-configuration/agents-md`.

As citações renderizadas no chat podem não abrir em um leitor Markdown local. Os códigos S1–S4, nomes e seções dos documentos, e os endereços técnicos acima permitem identificar a proveniência fora do chat. As fontes privadas originais não foram republicadas integralmente neste pacote.


---


# PARTE VI — Prompts de trabalho


# UNO Labs — Prompts de trabalho para Claude e Codex

**Versão 1.0 · 29/09/2026**

Estes prompts pressupõem que a documentação esteja disponível para leitura. Não autorizam o modelo a inventar o conteúdo de arquivos que não conseguiu acessar. Não solicitar simultaneamente a dois agentes a edição das mesmas áreas sem divisão clara de responsabilidade.

## 1. Alinhamento antes de propor ou implementar

```text
Leia docs/UNO_Labs_Documentacao_Completa.md, começando pela Parte 0
(que prevalece), e o manual 01 - IDENTIDADE VISUAL/UNO_Labs_Manual_Completo.md.

Apresente o seu entendimento da UNO Labs em cinco pontos:
1. O que a empresa faz e o que não está confirmado como oferta.
2. Quem queremos atrair e o que high ticket significa neste projeto.
3. Como a empresa propõe gerar valor sem garantir vendas.
4. O conceito visual e a experiência de assinatura do site.
5. As regras de identidade e os dados que você não pode inventar.

Separe fatos documentados, diretrizes do usuário, propostas estratégicas e
pendências. Não proponha uma nova marca. Não redesenhe UNO nem reduza a U/UO.
Não transforme estudos conceituais em clientes reais.
Depois, proponha uma sequência de trabalho adequada à tarefa solicitada.
```

## 2. Claude — direção de marca, conteúdo e experiência

```text
Atue como diretor de marca e de experiência digital da UNO Labs.
Leia a Parte 0 e as Partes I, II, III e V de
docs/UNO_Labs_Documentacao_Completa.md.

Desenvolva a direção 'Precisão que se revela'. O objetivo é um site extremamente
elegante, profissional e surpreendente, capaz de atrair projetos high ticket.
O núcleo da oferta é sites sob medida, com SEO, Google Ads, Meta Ads e manutenção como serviços
confirmados (Parte 0). Não é uma agência que faz de tudo.

Entregue uma proposta coerente, não uma lista de estilos incompatíveis:
- narrativa completa da home e hierarquia de conteúdo;
- copy revisada, com oferta explícita;
- direção de arte desktop e mobile;
- especificação da experiência 'O valor toma forma';
- estados, alternativas acessíveis e dependências reais dos recursos;
- justificativa de como cada decisão contribui para clareza, percepção ou contato.

A home deve ter base Off White #F3F7F3, Pine #0E2B24 e acento Mint #7DD3A8.
Preserve Sage #A8B8AE como apoio. Use a logo existente e mantenha UNO completo.
Inter é o baseline proposto; não troque a identidade silenciosamente.

Não invente clientes, métricas, serviços, preços, prazos ou contatos.
Não entregue apenas recomendações abstratas de 'deixar premium'.
Defina elementos, conteúdo e comportamentos verificáveis.
```

## 3. Codex — implementação do site

```text
Implemente o escopo solicitado do site da UNO Labs a partir desta documentação.
Primeiro leia a Parte 0 e as Partes II e IV da documentação em docs/UNO_Labs_Documentacao_Completa.md.
Stack vigente: Astro 7 + TypeScript estrito, MDX e build estático em dist/ (Parte 0, §0.8).
O Worker existente está separado e preservado; a integração da hospedagem oficial
é futura. Não adicionar SSR, adaptador Cloudflare/Vercel ou novo endpoint por inferência.
Inspecione o repositório e preserve suas convenções e tecnologias adequadas.

O objetivo é traduzir 'Precisão que se revela' em uma experiência real:
site claro e editorial, excelente acabamento, oferta explícita de sites sob medida,
projetos identificados corretamente e uma experiência de assinatura funcional.
Não substitua isso por um template genérico com animações de entrada repetidas.

Implemente a narrativa e os estados da especificação. Garanta funcionamento por
toque e teclado, alternativa com movimento reduzido e conteúdo essencial visível
se o JavaScript falhar. Não use scroll hijacking ou interações só por hover.

Use um único pacote real de ativos de marca, depois de identificá-lo.
Não invente SVG, caminhos de arquivos, telefone, domínio, API ou credenciais.
Se faltar um dado, isole a configuração e registre a dependência; avance no restante.
Não publique placeholders. Não simule sucesso de envio nem uma análise de IA.

Execute build e testes disponíveis no ambiente. Revise desktop, mobile e estados
de erro. Registre comandos e resultados reais. Entregue resumo dos arquivos
alterados, funcionalidades implementadas, testes e pendências.
Não faça deploy, contrate serviços ou envie dados sem autorização pertinente.
```

## 4. Revisão independente de qualidade

```text
Revise a implementação da UNO Labs usando a Parte IV e a Parte 0 da documentação.
Inspecione código, conteúdo e apresentação, usando os recursos realmente disponíveis.

Verifique especialmente:
- clareza da oferta e adequação ao posicionamento high ticket;
- qualidade visual da home inteira, não apenas do hero;
- fidelidade da logo, das três letras e da paleta;
- relevância e funcionamento da experiência de assinatura;
- natureza dos projetos e ausência de prova falsa;
- contatos, erros e confirmação real;
- navegação por teclado, mobile, movimento reduzido e falha de script;
- desempenho e coerência das declarações de teste.

Classifique achados como bloqueio de publicação, problema importante ou refinamento.
Para cada achado, descreva evidência, impacto e correção recomendada.
Separe o que foi testado do que foi apenas inspecionado.
Não declare conformidade integral ou nota máxima com base só em ferramenta automática.
Não aprove um botão falso porque o layout ficou bonito.
```

## 5. Continuidade entre agentes

Ao finalizar uma etapa, registrar o que foi decidido e a razão. Informar versão de documento, arquivos alterados, dependências e próxima tarefa concreta. Não tratar uma sugestão do agente anterior como aprovação automática do usuário.

Um fluxo possível é Claude concentrar direção e copy e Codex concentrar implementação e testes, com revisão cruzada. Essa divisão é uma organização sugerida, não uma limitação de capacidade dos modelos.


---
