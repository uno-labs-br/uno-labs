# Relatório de Verificação — GA4 com Consentimento e Eventos de Contato

**Data:** 03/10/2026  
**Identificador da SPEC:** `ga4-20261003`  
**Measurement ID:** `G-ZKM57KG6V9`  
**Status da Implementação:** Concluída e testada localmente em ambiente isolado.

---

## 1. Resumo da Implementação

A integração do Google Analytics 4 (GA4) foi realizada no frontend estático Astro com arquitetura técnica orientada à privacidade por padrão (Privacy by Design) e ao Consent Mode v2 do Google, validada por testes locais simulados (sem constituir certificação jurídica formal).

### Diretrizes e salvaguardas implementadas:
1. **Consent Mode v2 por padrão negado (*denied*):**
   - Na inicialização, a `dataLayer` recebe o estado padrão com `analytics_storage: 'denied'`, `ad_storage: 'denied'`, `ad_user_data: 'denied'` e `ad_personalization: 'denied'`.
   - Recursos publicitários, Google signals e personalização de anúncios são permanentemente desabilitados via flags (`allow_google_signals: false`, `allow_ad_personalization_signals: false`, `restricted_data_processing: true`).
2. **Carregamento condicional e dinâmico de `gtag.js`:**
   - A biblioteca de script do Google (`gtag.js?id=G-ZKM57KG6V9`) **não** é embutida no HTML estático nem baixada no carregamento inicial.
   - Ela só é inserida no DOM uma única vez, de forma assíncrona, se o usuário clicar explicitamente em "Aceitar análise" ou se possuir consentimento prévio válido no dispositivo.
   - A configuração `gtag('config')` e o envio de `page_view` só ocorrem quando o download do SDK terminar e o consentimento ainda permanecer válido.
3. **Ambiente estrito de produção:**
   - A execução do GA é bloqueada automaticamente fora de produção:
     - Exige compilação com `UNO_DEPLOY_TARGET=production`.
     - Exige em tempo de execução `location.protocol === 'https:'`.
     - Exige em tempo de execução `location.hostname === 'unolabs.com.br'` ou `www.unolabs.com.br`.
   - Ambientes como `localhost`, Vercel (`uno-labs.vercel.app`), Cloudflare Workers de prévia (`workers.dev`) ou PR previews têm o GA desabilitado mesmo quando executando um build de produção.
4. **Persistência funcional, expiração e revogação imediata:**
   - Preferência versionada no `localStorage` com chave `uno_consent_v1` e expiração explícita de 180 dias com validação estrita de integridade.
   - Caso o armazenamento esteja indisponível (ex.: restrições de storage), o comportamento é fail-closed: o site opera normalmente sem quebras, sem salvar preferência fictícia e mantendo a medição bloqueada.
   - Expiração em aba aberta é monitorada por timer e revalidada no retorno à aba (`visibilitychange`/`focus`).
   - Botão permanente "Preferências de cookies" no rodapé de todas as páginas permite reabrir o diálogo não modal e revogar a decisão a qualquer momento.
   - Ao revogar: define imediatamente `window['ga-disable-G-ZKM57KG6V9'] = true`, envia `gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })`, remove cookies de análise primários (`_ga` e `_ga_ZKM57KG6V9`) e sincroniza abas abertas pelo evento `storage`, sem recarregar a página nem apagar dados digitados no formulário.
5. **Sanitização estrita de dados:**
   - `page_location` descarta fragmentos (`#...`), credenciais de URL e parâmetros desconhecidos ou privados, preservando estritamente UTMs e IDs de campanha homologados (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `utm_id`, `gclid`, `gclsrc`, `dclid`, `fbclid`, `msclkid`, `ttclid`) desde que não contenham padrões de e-mail ou telefone.
   - Páginas de erro 404 utilizam canonical estático (`/404`) para impedir que URLs arbitrárias com dados pessoais sejam transmitidas.
   - `page_referrer` transmite exclusivamente a origem (externo) ou o caminho limpo (interno).
   - Nenhum dado pessoal digitado no formulário de contato é transmitido ao GA.
   - Referências de políticas do Google: [Política de Privacidade do Google](https://policies.google.com/privacy) e [Como o Google usa dados de sites de parceiros](https://policies.google.com/technologies/partner-sites).

---

## 2. Taxonomia de Eventos

| Evento | Condição de Disparo | Parâmetros Homologados | Salvaguardas |
|---|---|---|---|
| `page_view` | Uma vez por carga de página com consentimento concedido | `page_location` (sanitizado), `page_referrer` (sanitizado) | Deduplicado por carga de página. |
| `form_start` | Primeiro preenchimento real de qualquer campo do formulário | `form_id: 'form-contato'`, `form_name: 'contato'` | Não dispara em foco ou clique em campos vazios. Deduplicado por ciclo de preenchimento. |
| `generate_lead` | Apenas na confirmação válida de encaminhamento (`HTTP 200` com `ok === true` e `encaminhamento === 'smtp_aceito'`) | `lead_channel: 'form_contato'` | Nenhum dado pessoal, nenhum valor de conversão fictício. Não dispara em tentativas com erro, 422, 503 ou falhas de rede. |
| `contact_click` | Clique em links comerciais reais de WhatsApp ou e-mail com atributos `data-*` | `contact_channel`: `'whatsapp'` ou `'email'`; `cta_id`: constante permitida; `cta_position`: constante permitida | Restrito à allowlist estrita de canais e identificadores; ignora maquetes e conteúdo livre. |

---

## 3. Passos Dependentes do Painel GA4 (Pendências Externas)

As seguintes etapas dependem de configuração e homologação humana na interface do Google Analytics:

1. **Propriedade e Fluxo de Dados:**
   - Conferir se o fluxo de dados da web na propriedade correspondente ao ID `G-ZKM57KG6V9` está configurado para o stream `https://unolabs.com.br`.
2. **Definições Personalizadas (Dimensões de Evento):**
   - Cadastrar no painel GA4 (*Administrador > Exibição de dados > Definições personalizadas > Criar dimensões personalizadas*):
     - `contact_channel` (escopo do evento)
     - `cta_id` (escopo do evento)
     - `cta_position` (escopo do evento)
     - `lead_channel` (escopo do evento)
     - `form_id` (escopo do evento)
     - `form_name` (escopo do evento)
3. **DebugView e Validação em Tempo Real:**
   - Validar a recepção dos eventos no *DebugView* do GA4 a partir de uma navegação em ambiente oficial de produção.
4. **Marcação de Conversões:**
   - Marcar o evento `generate_lead` como evento principal / conversão para relatórios de aquisição.

*Nota de limitação:* os testes locais utilizam interceptação de rede no Playwright para simular o comportamento da API e validar as condições estritas do código. Não constituem prova de recebimento em tempo real nos servidores da Google LLC nem aprovação jurídica final da política de privacidade.
