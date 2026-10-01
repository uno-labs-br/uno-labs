# UNO Labs — pasta oficial e instruções do site

Esta é a **única pasta oficial** do projeto: `D:\00 - PROJETOS\01 - UNO LABS - LP\04 - SITE`. Ela contém a implementação e os arquivos de hospedagem; a publicação depende de resolver as pendências, revisar o PR, integrar na `main` e obter autorização de deploy. O site é HTML, CSS e JavaScript puros (sem etapa de compilação). O fluxo vigente do formulário usa o Worker da Cloudflare. O script PHP para hospedagem tradicional é uma alternativa técnica separada.

> Construção: [docs/UNO_Labs_Construcao_do_Site.md](docs/UNO_Labs_Construcao_do_Site.md). Marca e requisitos: [docs/UNO_Labs_Documentacao_Completa.md](docs/UNO_Labs_Documentacao_Completa.md). Regras: [AGENTS.md](AGENTS.md).

## 0. Usar sempre esta pasta

Análises visuais, Impeccable e prévias usam `public/index.html` desta implementação. Execute todos os comandos Git, npm e Wrangler na raiz `04 - SITE`; o remoto é `https://github.com/uno-labs-br/uno-labs.git`. O conteúdo interno da pasta vai diretamente para a raiz do repositório, incluindo `public/`, `worker/`, `docs/` e configurações. A pasta geral do workspace não é a raiz Git do site.

`03 - ANALISE LP/uno-labs-main` é somente a extração ZIP histórica do protótipo (`Main.dc.html`). Pode ser excluída pelos responsáveis se não precisarem desse arquivo histórico; o site atual funciona sem ela. Não a use como base para análise, localhost ou upload. Os documentos em `02 - DOCUMENTACAO` foram transferidos para `docs/` e os caminhos antigos contêm avisos.

**Fluxo de atualização:** fetch → branch a partir da `main` atualizada → editar e verificar → commit → push da branch → PR para `main` → revisão e autorização humana para integrar. Produção acompanha a `main` aprovada; um PR não é publicação.

---

## 1. O que tem aqui

```
04 - SITE/
├── public/                         ← o site em si (é isto que vai para a internet)
│   ├── index.html                  ← página inicial (todo o conteúdo + 6 <template> dos estudos conceituais)
│   ├── politica-de-privacidade/
│   │   └── index.html              ← rascunho da política (trechos em amarelo = preencher)
│   ├── 404.html                    ← página de "não encontrado"
│   ├── assets/
│   │   ├── css/fonts.css           ← fontes auto-hospedadas (sem Google Fonts)
│   │   ├── css/site.css            ← todo o visual (tokens da marca no topo do arquivo)
│   │   ├── js/site.js              ← interações, jornada presa na tela e formulário
│   │   ├── fonts/                  ← 10 arquivos .woff2 (licença SIL OFL 1.1)
│   │   ├── img/                    ← logos em SVG e imagem de compartilhamento (og-unolabs.png)
│   │   └── icons/                  ← favicons do kit de identidade
│   ├── favicon.ico
│   ├── site.webmanifest
│   ├── robots.txt
│   ├── sitemap.xml
│   └── _headers                    ← cabeçalhos de segurança e cache (Cloudflare)
├── worker/index.js                 ← recebe o formulário na Cloudflare e envia ao n8n
├── wrangler.jsonc                  ← configuração do Cloudflare Workers
├── package.json                    ← comandos: npm run dev / verificar / deploy
├── .dev.vars.exemplo               ← modelo de variáveis para teste local
├── .gitignore
├── AGENTS.md                      ← regras obrigatórias de colaboração
├── README.md                      ← entrada do repositório
├── docs/                          ← documentação vigente e referências visuais
├── hospedagem-tradicional/         ← SÓ para HostGator/Apache (não usar na Cloudflare)
│   ├── .htaccess
│   ├── api/contato.php
│   └── uno-contato-config.exemplo.php
└── LEIA-ME.md                      ← este arquivo
```

---

## 2. Antes de publicar: pendências comerciais e de homologação

Contatos informados pelo usuário em 30/09/2026: `contato@unolabs.com.br`, WhatsApp `(27) 93618-5141` (internacional `+5527936185141`) e link `https://wa.me/5527936185141`. A confirmação dos dados não comprova que os links, a caixa postal ou o fluxo do formulário estejam funcionando.

Os contatos já estão no HTML e no JSON-LD; os links `mailto:` e WhatsApp foram conferidos localmente. Isso não comprova funcionamento da caixa ou entrega de e-mail.

| Pendência | O que falta |
|---|---|
| Pacote inicial a partir de R$ 1.490 | Definir escopo e entregáveis incluídos; não inventar quantidades ou entregas |
| Termos comerciais | Garantia e prazo do projeto ficam na proposta de cada escopo; a home não deve conter números provisórios |
| Equipe | Urias Loures e Bruno Gonzaga são criadores, com funções específicas ainda indefinidas. Milena Dias está em formação em Publicidade e Propaganda na UVV. Não atribuir cargos ou qualificações não informados |
| Dados empresariais | Informar ou confirmar CNPJ e razão social |
| Privacidade | Completar responsável, contato de privacidade, local do n8n, prazo de guarda e data; revisar juridicamente. Não presumir que o contato comercial seja o contato de privacidade |
| n8n e SMTP | Configurar e verificar o Worker, webhook do n8n, SMTP HostGator, credenciais e remetente autorizado; não registrar segredos neste repositório |
| Homologação real | Comprovar em etapas distintas a aceitação do backend, a aceitação do encaminhamento pelo SMTP e o recebimento observado na caixa `contato@unolabs.com.br` |
| Mídia paga | Confirmar que a verba de Google Ads e Meta Ads é paga diretamente às plataformas |
| Conteúdo do blog | Preparar e revisar 4 a 6 artigos antes da migração planejada para Astro |
| Turnstile | Opcional; se usado, configurar as chaves conforme a seção 7 |

O contrato esperado do webhook e o roteiro das evidências estão em [docs/CONTATO_HOMOLOGACAO.md](docs/CONTATO_HOMOLOGACAO.md). O arquivo ainda não confirma credenciais, configuração nem homologação.

---

## 3. Testar no seu computador

**Opção A — completa (site + formulário):** precisa do Node.js 20 ou mais recente.

```bash
cd "D:\00 - PROJETOS\01 - UNO LABS - LP\04 - SITE"
npm install
copy .dev.vars.exemplo .dev.vars     # no Windows (no Mac/Linux: cp .dev.vars.exemplo .dev.vars)
npm run dev                          # abre em http://localhost:8787
```

**Opção B — só visual:** na raiz oficial `04 - SITE`, rode `python -m http.server 8000 --directory public` e abra `http://localhost:8000`. O servidor deve servir exatamente `04 - SITE/public`, incluindo nas análises com Impeccable. O formulário vai mostrar a mensagem de erro (é o esperado: não há servidor para recebê-lo).

> Abrir o `index.html` com dois cliques funciona para olhar, mas a política de privacidade e o 404 precisam de um servidor para os links funcionarem.

---

## 4. Publicar na Cloudflare Workers (recomendado)

**Custo:** o plano gratuito atende. Arquivos estáticos não contam na cota de requisições do Worker; só o envio do formulário conta (limite de 100 mil por dia no plano gratuito).

### 4.1 Pré-requisitos
1. Conta na Cloudflare e o domínio `unolabs.com.br` adicionado a ela (os *nameservers* do registro.br apontando para a Cloudflare).
2. Na zona DNS, **não pode existir** registro `A`, `AAAA` ou `CNAME` para `unolabs.com.br` e `www` (se o domínio apontava para outra hospedagem, apague esses dois). **Mantenha** os registros de e-mail (MX, `mail`, SPF, DKIM, DMARC) — ver seção 8.
3. Node.js 20+ instalado.

### 4.2 Primeira publicação (pelo terminal)

Executar somente após preencher as pendências, integrar o PR aprovado e ter autorização para publicar. Usar a `main` atualizada e limpa do checkout oficial; nunca publicar produção pela branch da tarefa. Os comandos de secrets abaixo também podem republicar o Worker e seguem a mesma autorização.

```bash
cd "D:\00 - PROJETOS\01 - UNO LABS - LP\04 - SITE"
npm install
npx wrangler login              # abre o navegador para autorizar
npm run verificar               # confere a configuração sem publicar
npm run deploy                  # publica e cria os domínios unolabs.com.br e www
```

Depois, cadastre as chaves do formulário (cada comando pede o valor e republica sozinho):
```bash
npx wrangler secret put N8N_WEBHOOK_URL
npx wrangler secret put N8N_WEBHOOK_TOKEN
npx wrangler secret put TURNSTILE_SECRET     # opcional
```

> Quer testar antes de apontar o domínio? Comente o bloco `"routes"` no `wrangler.jsonc` e publique: o site fica em `https://unolabs-site.<sua-conta>.workers.dev`.

### 4.3 Redirecionar `www` para o domínio principal
Painel da Cloudflare → seu domínio → **Rules → Redirect Rules → Create rule → modelo “Redirect from WWW to root”** (301). Assim só existe um endereço oficial: `https://unolabs.com.br`.

Confira também: **SSL/TLS → Edge Certificates → Always Use HTTPS = ligado**.

### 4.4 Atualizações futuras
Depois de alterar, verificar, enviar a branch e integrar o PR com aprovação humana, publicar a `main` atualizada quando o deploy estiver autorizado. Usar `npm run deploy` somente nessa etapa. Se mudou `site.css` ou `site.js`, troque `?v=1` por `?v=2` (e assim por diante) nas linhas que carregam esses arquivos no `index.html`, na política e no 404 — isso força os navegadores a buscarem a versão nova.

### 4.5 Sem terminal (publicação automática pelo GitHub)
Usar o repositório existente **`uno-labs-br/uno-labs`**, com o conteúdo interno de `04 - SITE` na raiz. No painel da Cloudflare, use **Workers & Pages → Create → Import a repository**. Diretório raiz: raiz do repositório. Comando de build: vazio. Comando de deploy: `npx wrangler deploy`. Selecionar **somente `main` para produção**: branches de tarefa não podem publicar produção; usar prévias isoladas quando configuradas. A integração do PR na `main` pode disparar o deploy automático, portanto essa integração exige a autorização aplicável. As chaves (secrets) são cadastradas em **Settings → Variables and Secrets** do Worker. Este guia não comprova que a integração automática já esteja configurada.

---

## 5. Publicar em outra hospedagem estática (Netlify, Vercel, Cloudflare Pages, GitHub Pages)

Envie **somente o conteúdo de `public/`**. O visual e as interações funcionam igual. O formulário precisa de um servidor: aponte `data-endpoint` (no `<form>` do `index.html`) para a função/serviço que você usar. Sem isso, o formulário mostra a mensagem de erro honesta e ninguém recebe o contato. O arquivo `_headers` funciona na Netlify e no Cloudflare Pages.

---

## 6. Publicar na HostGator (hospedagem tradicional com PHP)

1. Ative o SSL gratuito do domínio no cPanel (AutoSSL).
2. Envie para `public_html/`:
   - todo o conteúdo de `public/` (o `_headers` pode ficar; o `.htaccess` bloqueia o acesso a ele);
   - `hospedagem-tradicional/.htaccess` → `public_html/.htaccess`;
   - `hospedagem-tradicional/api/contato.php` → `public_html/api/contato.php`.
3. Copie `uno-contato-config.exemplo.php` para **fora** de `public_html`, com o nome `uno-contato-config.php` (ex.: `/home/SEU_USUARIO/uno-contato-config.php`), e preencha a URL e o token do n8n.
4. Requisitos: PHP 8.0+ com as extensões `curl` e `mbstring` (padrão na HostGator).

O `.htaccess` já força HTTPS, redireciona `www` para o domínio sem `www`, liga `/api/contato` ao PHP, usa o `404.html` e aplica cabeçalhos de segurança e cache.

---

## 7. Formulário → Worker `/api/contato` → n8n → SMTP HostGator

Fluxo vigente: formulário no site → `POST /api/contato` → Worker valida e encaminha ao n8n → n8n envia pelo SMTP HostGator à caixa fixa `contato@unolabs.com.br`. Esse é o destino configurado no desenho do fluxo; credenciais, remetente autorizado, conta, DNS e funcionamento ainda precisam ser comprovados na homologação.

No modelo de workflow, o n8n só deve responder após o nó SMTP indicar aceitação, com o corpo exato `{"ok":true,"encaminhamento":"smtp_aceito"}`. O Worker deve rejeitar uma resposta HTTP 2xx genérica ou qualquer corpo sem essa confirmação. A resposta do backend atesta apenas o encaminhamento aceito pelo SMTP no fluxo configurado; não comprova o recebimento na caixa.

Trate como evidências separadas: (1) resposta válida de aceitação do backend; (2) confirmação de que o SMTP aceitou o encaminhamento; (3) recebimento observado na caixa `contato@unolabs.com.br`. Faça envio real e registre cada resultado somente após autorização explícita de Urias ou Bruno para o destinatário, ambiente e mensagem. O roteiro fica em [docs/CONTATO_HOMOLOGACAO.md](docs/CONTATO_HOMOLOGACAO.md); o modelo importável está em [docs/n8n/uno-contato.modelo.json](docs/n8n/uno-contato.modelo.json) e permanece inativo, sem credenciais e sem homologação.

Os campos enviados incluem `nome`, `empresa`, `canal`, `site`, `servicos` (lista), `servicosTexto`, `invest`, `investTexto`, `contexto`, `pagina`, `origem` e `recebidoEm`. A configuração de autenticação do webhook e as credenciais do SMTP devem ser conferidas no modelo e no ambiente real; não publique URLs privadas, tokens ou senhas.

**Turnstile (anti-spam da Cloudflare, gratuito, opcional):** painel da Cloudflare → Turnstile → Add widget (domínio `unolabs.com.br`, modo *Managed*). A **chave pública** vai no atributo `data-turnstile=""` do `<form>`; a **chave secreta** vai em `TURNSTILE_SECRET` (Worker) ou `turnstile_secret` (PHP). Com a chave secreta cadastrada, envios sem verificação são recusados.

**Respostas do servidor:** `200 {"ok":true,"encaminhamento":"smtp_aceito"}` (SMTP aceitou o encaminhamento), `422` (campos inválidos), `403` (origem ou Turnstile), `413/415/400` (envio malformado), `502` (n8n ou encaminhamento falhou), `503` (webhook não configurado). Um 2xx genérico não é confirmação válida. Respostas inválidas ou de erro mantêm os dados no formulário e mostram erro. Nenhuma delas, isoladamente, comprova recebimento na caixa.

---

## 8. E-mail do domínio (HostGator) com DNS na Cloudflare

- Registro **MX** apontando para o servidor de e-mail da HostGator.
- Registro `mail` (A ou CNAME) em **DNS only (nuvem cinza)** — nunca com proxy.
- TXT de **SPF**, **DKIM** e **DMARC** com os valores do cPanel da HostGator.
- **Não** ative o Cloudflare Email Routing (ele assume os registros MX e conflita com a HostGator).

---

## 9. Depois de publicar

1. **Google Search Console:** adicione a propriedade de domínio `unolabs.com.br` (verificação por TXT no DNS da Cloudflare) e envie `https://unolabs.com.br/sitemap.xml`.
2. **PageSpeed Insights** (`pagespeed.web.dev`): confira as metas LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1.
3. **Teste de resultados avançados** do Google: valide o JSON-LD.
4. **Formulário:** somente após autorização explícita de Urias ou Bruno para destinatário, ambiente e mensagem, envie um contato real; registre separadamente a resposta de aceitação do backend, a aceitação do SMTP e o recebimento na caixa `contato@unolabs.com.br`.
5. **Compartilhamento:** cole o link no WhatsApp e confira a imagem `og-unolabs.png`.
6. **Métricas (opcional):** o Cloudflare Web Analytics (sem cookies) pode ser ligado no painel da Cloudflare. Ao ligar, atualize a seção “Quais dados coletamos” da política de privacidade.

---

## 10. Editar conteúdo

- **Textos:** direto no `public/index.html` (cada seção começa com um comentário `<!-- ===== NOME ===== -->`).
- **Cores e medidas:** variáveis no topo de `assets/css/site.css` (`--uno-pine`, `--uno-mint`, `--uno-off-white` etc.).
- **Estudos conceituais:** ficam nos `<template id="tpl-…">` no fim do `index.html`. O `site.js` só os copia para a página quando o espaço reservado se aproxima da tela.
- **Novas páginas:** crie `nome-da-pagina/index.html` dentro de `public/` (mesmo padrão da política de privacidade) e inclua a URL no `sitemap.xml`.
- **Blog:** os cartões atuais estão marcados como “Em breve” e não são links. Quando houver 4 a 6 artigos prontos, a recomendação da documentação é migrar para Astro (ver D28 na documentação completa).

## 11. Limitações conhecidas

- Sem JavaScript, o site funciona e todo o texto aparece; a jornada vira uma lista estática e os estudos conceituais não são desenhados.
- Com “reduzir movimento” ligado no sistema, a jornada deixa de ficar presa na tela e vira abas clicáveis.
- As fontes cobrem português (subconjunto latin). Símbolos como ✓ e ≤ usam a fonte do sistema.
