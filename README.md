# UNO Labs — projeto oficial do site

Este repositório reúne a implementação da landing page, o backend do formulário, as configurações de hospedagem e a documentação vigente.

**Pasta oficial no computador de Urias:** `D:\00 - PROJETOS\01 - UNO LABS - LP\04 - SITE`.

| Uso | Caminho dentro do repositório |
|---|---|
| Página inicial; análise visual e Impeccable | `public/index.html` |
| CSS e JavaScript | `public/assets/css/` e `public/assets/js/` |
| Formulário na Cloudflare | `worker/index.js` |
| Configuração de hospedagem | `wrangler.jsonc` |
| Marca, mensagem e requisitos | [Documentação completa](docs/UNO_Labs_Documentacao_Completa.md) |
| Design e implementação | [Construção do site](docs/UNO_Labs_Construcao_do_Site.md) |
| Testes, pendências e publicação | [LEIA-ME.md](LEIA-ME.md) |
| Regras de colaboração | [AGENTS.md](AGENTS.md) |

Execute Git e npm na raiz desta pasta. O conteúdo de `04 - SITE` corresponde diretamente à raiz do repositório `uno-labs-br/uno-labs`; não há uma subpasta `04 - SITE` no GitHub.

Para testar site e Worker, execute `npm install` e `npm run dev` nesta raiz. Para uma prévia apenas visual, execute `python -m http.server 8000 --directory public` e abra `http://localhost:8000`.

O protótipo exportado anteriormente, com páginas `.dc.html`, `support.js` e `vendor/`, permanece recuperável no histórico anterior à consolidação. A extração local em `03 - ANALISE LP/uno-labs-main` é um arquivo histórico dispensável para executar o site. Todas as próximas análises e alterações usam `public/index.html`.

Mudanças seguem branch → commit → push da branch → PR para `main` → revisão e autorização humana para integrar. Produção usa somente a `main` aprovada. Há dados comerciais e de contato pendentes; consulte o LEIA-ME antes de publicar.
