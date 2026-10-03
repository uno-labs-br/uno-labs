# Migração do domínio oficial para Workers

Preparação de 03/10/2026. A configuração no Git não comprova publicação.

## Estado verificado no painel

- A zona `unolabs.com.br` está ativa na Cloudflare, com os nameservers `luciana.ns.cloudflare.com` e `major.ns.cloudflare.com`.
- O registro A do domínio raiz ainda aponta para `76.76.21.21`, e `www` tem CNAME para `cname.vercel-dns.com`: o site ainda é servido pela Vercel.
- Existe somente `unolabs-site-preview`, sem domínios próprios. Seu build usa `UNO_DEPLOY_TARGET=preview` e gera `noindex`.
- O build de prévia do PR #10 compilou o Astro, mas falhou no deploy porque `wrangler preview` exige o bloco `previews`. `wrangler.preview.jsonc` agora contém o bloco vazio, suficiente para os assets e a ausência de bindings externos.
- Os seis artigos publicados estão no PR #10, ainda fora da `main`. Integrar a publicação dos artigos e esta configuração após aprovação humana antes da troca de hospedagem.
- DNSSEC foi habilitado na Cloudflare; a ativação completa depende de cadastrar o DS correspondente no Registro.br e verificar a cadeia. O DS não é segredo de acesso.

## Produção separada da prévia

`wrangler.production.jsonc` define o Worker `unolabs-site`, serve `dist/` e declara os domínios `unolabs.com.br` e `www.unolabs.com.br`. URLs de produção em `workers.dev` e prévias de versões ficam desabilitadas. O Worker `unolabs-site-preview` permanece separado, com `noindex` e sem domínios oficiais.

Antes do deploy, conferir que a versão aprovada da `main` gera os artigos esperados, home indexável, canonical oficial e sitemap. Este arquivo não publica nem aprova os artigos.

No novo aplicativo de produção em **Computação → Workers e Pages → Criar aplicativo → Connect GitHub**:

| Campo | Valor |
| --- | --- |
| Repositório | `uno-labs-br/uno-labs` |
| Branch de produção | `main` |
| Nome | `unolabs-site` |
| Diretório raiz | `/` |
| Comando de build (Linux do Cloudflare Builds) | `UNO_DEPLOY_TARGET=production npm run build` |
| Comando de deploy | `npx wrangler deploy --config wrangler.production.jsonc` |
| Build de branches/prévias | `UNO_DEPLOY_TARGET=preview npm run build` |
| Deploy de branches/prévias, se habilitado | `npx wrangler preview --config wrangler.production.jsonc` |

Usar o token de build já registrado, se o painel permitir, sem ampliar permissões nem inserir credenciais no Git. A configuração das prévias de branches deve sempre usar `preview`, mesmo que o aplicativo de produção use `production`.

O deploy de produção modifica os domínios declarados. Agendar a troca somente depois da validação e manter os valores anteriores para reversão. Custom Domains exige remover o CNAME conflitante de `www` antes de adicioná-lo. Conferir a substituição do registro web da raiz no painel; não trocar os registros de e-mail.

Após o deploy, conferir em **Workers e Pages → unolabs-site → Domínios** os dois domínios e seus certificados. Verificar externamente home, seis artigos, sitemap, 404, assets e ausência de `noindex` nas páginas publicadas. Configurar redirecionamento permanente de `www` para a raiz preservando caminho e query em **Domínios → unolabs.com.br → Regras**, caso ainda não exista.

## E-mail e formulário

Preservar `mail`, `webmail`, MX, SPF, DKIM e DMARC. `mail` e `webmail` continuam como **Somente DNS**, no HostGator. O registro A web antigo e o CNAME de `www` são independentes do MX.

O receptor `/api/contato` foi preservado. Não há homologação do envio real nem secrets configurados por esta preparação. Sem os secrets exigidos, o Worker retorna indisponibilidade e não encaminha mensagens. A migração de hospedagem não resolve essa pendência; os canais diretos de WhatsApp e e-mail continuam disponíveis.

## Verificação local sem publicar

Em PowerShell, no checkout da tarefa:

```powershell
$env:UNO_DEPLOY_TARGET = 'production'
npm run build
npx wrangler deploy --config wrangler.production.jsonc --dry-run
Remove-Item Env:UNO_DEPLOY_TARGET
```

Dry run valida empacotamento e esquema, sem configurar domínios, certificados, DNS ou secrets. Não comprova aprovação editorial nem funcionamento do receptor externo.

Validação desta preparação: builds Astro de `production` e `preview` sem erros de tipos; empacotamentos das duas configurações com Wrangler 4.145.0 em dry run aprovados; 38 testes de distribuição, editorial e contrato do Worker aprovados. Os avisos preexistentes de MDX e `addListener` permanecem. O build de produção desta branch, baseada na `main` ainda sem o PR #10, tem quatro páginas e exclui os seis rascunhos; ele não é a versão completa que deve ser lançada. A prévia tem dez páginas e continua `noindex`.

Referências oficiais: [configuração de prévias](https://developers.cloudflare.com/workers/previews/configuration/), [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) e [DNSSEC](https://developers.cloudflare.com/dns/dnssec/).
