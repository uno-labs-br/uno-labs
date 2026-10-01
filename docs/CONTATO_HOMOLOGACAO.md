# Contato: configuração e homologação

Contatos fornecidos por Urias em 30/09/2026: **contato@unolabs.com.br**, **+5527936185141**, apresentação **(27) 93618-5141**, [WhatsApp comercial](https://wa.me/5527936185141). Essa confirmação não comprova caixa postal ativa, domínio configurado ou recebimento.

O fluxo previsto é: formulário → Worker `POST /api/contato` → webhook autenticado n8n → SMTP HostGator → `contato@unolabs.com.br`. O navegador fornece contexto e canal de retorno; nunca escolhe destinatário, remetente ou cópias. O SMTP usa remetente autorizado. Reply-To só é preenchido se o canal for um e-mail válido; telefone não entra nesse cabeçalho.

## O que está pronto e o que falta

- Frontend: validação específica, erros 422 por campo, estado acessível de carregamento, bloqueio de clique duplicado, preservação dos campos em falhas, confirmação de encaminhamento e canais alternativos. Sem JavaScript, o envio fica desabilitado e os canais são explícitos; `action` e `method=post` evitam dados na URL. O Worker aceita JSON; não há envio nativo de formulário implementado.
- Worker: validação de campos e origem, honeypot, Turnstile opcional, webhook autenticado e confirmação explícita `{"ok":true,"encaminhamento":"smtp_aceito"}`. HTTP 2xx genérico do n8n é insuficiente e retorna 502. Logs de erro não incluem payload, credenciais ou mensagens brutas de exceção.
- Modelo importável: [n8n/uno-contato.modelo.json](n8n/uno-contato.modelo.json), **inativo e sem credenciais**. Não foi importado, habilitado nem executado em produção. A busca pelo conector não encontrou workflow UNO disponível. Isso não prova que ele inexista fora do acesso atual.
- Alternativa PHP: alinhada ao mesmo contrato para hospedagem tradicional; não é a arquitetura principal. PHP não estava disponível no ambiente, portanto sintaxe e execução desse caminho precisam de verificação no servidor antes de adotá-lo.
- Faltam: URL do n8n de homologação, credencial Header Auth `X-Uno-Token`, `N8N_WEBHOOK_URL` e `N8N_WEBHOOK_TOKEN` no Worker, host/porta/TLS e credencial SMTP HostGator, remetente autorizado e acesso à caixa do destinatário. Turnstile precisa de chave pública e secret correspondentes se for adotado. Não inserir valores reais no Git nem em comandos que imprimam segredos.
- Telegram previsto na documentação depende de bot, destino privado e configuração separados. O modelo desta tarefa encaminha somente por e-mail. Rever os operadores efetivos na política antes da publicação.

## Configurar o modelo em ambiente de homologação

1. Importar o JSON pelo n8n e mantê-lo inativo enquanto faltarem configurações.
2. Em **Receber contexto**, selecionar credencial Header Auth com nome `X-Uno-Token`. O valor deve corresponder ao secret do Worker. Não substituir por comparação de token no código.
3. Em **Encaminhar via HostGator**, selecionar a credencial SMTP com host/porta/TLS fornecidos pelo cPanel e certificado válido. Trocar `CONFIGURAR_REMETENTE_AUTORIZADO@example.invalid` pelo remetente autorizado nessa conta. Manter `toEmail=contato@unolabs.com.br`, sem expressões do formulário para To/CC/BCC/From.
4. Preservar Reply-To com validação e corpo em texto simples. O assunto é fixo. Não ativar “continuar em caso de falha” no SMTP.
5. Manter o Webhook em **Using Respond to Webhook**. **Confirmar aceitação SMTP** só é executado após o nó SMTP concluir. Configurar o secret do Worker para a URL de produção do webhook no ambiente de homologação, não para `/webhook-test/` fora de uma execução manual.
6. Definir hospedagem, acesso às execuções, retenção e descarte. O modelo não cria uma nova base de leads nem fixa prazos. Rever a política de privacidade, os dados empresariais e o contato de privacidade com os responsáveis.

## Protocolo de envio real, aguardando autorização

Usar nome `Teste autorizado UNO`, empresa `Homologação fictícia`, contexto `Teste autorizado da integração de contato. Não é um pedido comercial.` e um canal de retorno controlado pela equipe. Não usar dados de terceiros. Antes de enviar, obter autorização explícita de Urias ou Bruno para esse destinatário, ambiente e mensagem.

Registrar separadamente:

| Evidência | O que comprova |
|---|---|
| POST do navegador e validação do Worker | Dados aceitos pelo backend |
| Execução do n8n e SMTP concluído, resposta `smtp_aceito` | Encaminhamento aceito pelo serviço de e-mail |
| Mensagem localizada em `contato@unolabs.com.br`, inclusive pesquisa em spam | Recebimento efetivo na caixa |

Conferir remetente autorizado, destinatário fixo, corpo completo e Reply-To com um e-mail válido. Em teste separado com telefone, Reply-To deve ficar vazio. Confirmar que a credencial SMTP não fica acessível no navegador.

Uma falha de rede ou timeout após o SMTP pode deixar o resultado incerto. Não há garantia de processamento exatamente uma vez entre Worker e SMTP. O frontend bloqueia envios concorrentes e não repete automaticamente; em resultado incerto, confirmar com a equipe antes de reenviar.

## Referências consultadas

- [n8n: Send Email](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.emailSend/): parâmetros e credencial SMTP conferidos também pelo catálogo oficial do conector.
- [n8n: Respond to Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/): HTTP 200 padrão pode ocorrer sem executar o nó de resposta; por isso o Worker exige o contrato explícito.
- [MDN: dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) e [movimento reduzido](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion): foco modal e preferência de movimento usados na implementação.
