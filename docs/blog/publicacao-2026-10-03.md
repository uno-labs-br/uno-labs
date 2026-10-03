# Publicação dos seis artigos — 03/10/2026

Urias autorizou a publicação dos seis artigos existentes e confirmou a assinatura **Urias Loures**, com data de publicação 03/10/2026. Os MDX passam a `draft: false`, com autoria e data; os textos, URLs, capas e créditos permanecem preservados. O aviso de revisão desaparece, e o build inclui os artigos no sitemap e gera BlogPosting.

## Hospedagem verificada

Em 03/10/2026, `https://unolabs.com.br/` e `/blog/` responderam HTTP 200 com `Server: Vercel` e `X-Robots-Tag: noindex, nofollow`. Portanto, a publicação usa a integração GitHub/Vercel existente, sem migrar hospedagem, alterar DNS ou usar a configuração legada Cloudflare.

`scripts/build-vercel.mjs` define `UNO_DEPLOY_TARGET=production` somente quando `VERCEL_ENV=production`; nos outros ambientes usa `preview`. Isso também neutraliza uma variável de projeto previamente configurada como preview no build de produção. O comando local `npm run build` continua com prévia por padrão. O cabeçalho fixo noindex de vercel.json deixa de cobrir `/blog` e seus descendentes; continua nas demais rotas. As prévias recebem noindex no HTML e a proteção de prévia da Vercel. O 404 continua noindex no HTML.

A operação não homologa o formulário, configura backend ou libera outras rotas para indexação. A configuração Cloudflare e o bloqueio de npm run deploy continuam como estavam.

O PR #7 é uma proposta histórica de HTML: o conteúdo já foi portado para Astro na main. Ele não deve ser integrado para publicar os artigos atuais. Esta publicação usa uma branch própria a partir da main atualizada.

## Verificação

Conferir os contratos existentes nos builds de prévia e produção: seis rotas de artigos em ambos, autoria e data confirmadas, ausência do aviso de revisão, BlogPosting, nove entradas no sitemap e noindex somente na prévia dos artigos. A integração na main exige aprovação humana, conforme AGENTS.md. Depois do deploy, conferir as seis URLs e os cabeçalhos efetivos no domínio antes de afirmar publicação concluída.

Referências: [ambientes Vercel](https://vercel.com/docs/deployments/environments), [indexação de prévias](https://vercel.com/kb/guide/are-vercel-preview-deployment-indexed-by-search-engines).

Validação local: build de produção pela entrada Vercel e 3 contratos de distribuição aprovados; build de prévia pela mesma entrada e 38 testes de distribuição, editorial e Worker aprovados. O Astro não apresentou erros de tipos; manteve os avisos existentes de diretiva MDX e API addListener legada. Os testes não enviaram mensagens externas.
Integração editorial isolada: 22 testes aprovados, incluindo os seis artigos em prévia e produção, preservação dos textos e capas e exclusão de fixtures de rascunho em produção.
