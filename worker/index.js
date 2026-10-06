/**
 * UNO Labs — Cloudflare Worker
 *
 * Os arquivos de public/ são servidos diretamente pela Cloudflare (Static Assets),
 * sem passar por aqui e sem contar na cota de requisições do Worker.
 * Este código só roda para caminhos que NÃO existem em public/:
 *   - POST /api/contato  → valida o formulário e encaminha ao webhook do n8n
 *   - qualquer outro     → devolve para os assets (que respondem com 404.html)
 *
 * Configuração (painel da Cloudflare → Workers → unolabs-site → Settings → Variables and Secrets,
 * ou pelo terminal com `npx wrangler secret put NOME`):
 *   N8N_WEBHOOK_URL     (secret)  URL de produção do webhook do n8n
 *   N8N_WEBHOOK_TOKEN   (secret)  valor enviado no cabeçalho X-Uno-Token (configure o mesmo no n8n)
 *   TURNSTILE_SECRET    (secret, opcional) chave secreta do Turnstile; se existir, a verificação passa a ser obrigatória
 *   ORIGENS_PERMITIDAS  (var)     origens aceitas, separadas por vírgula (definida no wrangler.jsonc)
 */

const LIMITE_CORPO = 16 * 1024; // 16 KB
const MAXIMO = { nome: 120, empresa: 160, canal: 160, site: 300, contexto: 4000, pagina: 200 };
const SERVICOS = { 'site': 'Site', 'seo': 'SEO', 'google-ads': 'Google Ads', 'meta-ads': 'Meta Ads', 'manutencao': 'Manutenção', 'whatsapp': 'Canal WhatsApp' };
const INVESTIMENTO = {
  '': 'Não informado',
  'ate-3k': 'Até R$ 3 mil',
  '3-6k': 'De R$ 3 mil a R$ 6 mil',
  '6-10k': 'De R$ 6 mil a R$ 10 mil',
  '10k': 'Acima de R$ 10 mil',
  'indefinido': 'Ainda não definido'
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contato' || url.pathname === '/api/contato/') {
      if (request.method !== 'POST') {
        return json({ ok: false, erro: 'metodo_nao_permitido' }, 405, { Allow: 'POST' });
      }
      try {
        return await receberContato(request, env);
      } catch (e) {
        console.error('contato: erro inesperado');
        return json({ ok: false, erro: 'erro_interno' }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  }
};

async function receberContato(request, env) {
  if (!origemPermitida(request, env)) return json({ ok: false, erro: 'origem_invalida' }, 403);

  const tipo = request.headers.get('Content-Type') || '';
  if (!tipo.toLowerCase().includes('application/json')) return json({ ok: false, erro: 'tipo_invalido' }, 415);

  const declarado = Number(request.headers.get('Content-Length') || 0);
  if (declarado > LIMITE_CORPO) return json({ ok: false, erro: 'muito_grande' }, 413);
  const texto = await request.text();
  if (texto.length > LIMITE_CORPO) return json({ ok: false, erro: 'muito_grande' }, 413);

  let d;
  try { d = JSON.parse(texto); } catch { return json({ ok: false, erro: 'json_invalido' }, 400); }
  if (!d || typeof d !== 'object' || Array.isArray(d)) return json({ ok: false, erro: 'json_invalido' }, 400);

  // Armadilha para robôs: campo invisível preenchido → finge sucesso e descarta.
  if (limpar(d.website, 200)) return json({ ok: true }, 200);

  const dados = {
    nome: limpar(d.nome, MAXIMO.nome),
    empresa: limpar(d.empresa, MAXIMO.empresa),
    canal: limpar(d.canal, MAXIMO.canal),
    site: limpar(d.site, MAXIMO.site),
    contexto: limpar(d.contexto, MAXIMO.contexto, true),
    servicos: Array.isArray(d.servicos) ? [...new Set(d.servicos.filter((s) => Object.hasOwn(SERVICOS, s)))] : [],
    invest: Object.hasOwn(INVESTIMENTO, d.invest) ? d.invest : ''
  };

  const campos = [];
  if (dados.nome.length < 2) campos.push('nome');
  if (dados.empresa.length < 2) campos.push('empresa');
  if (!canalValido(dados.canal)) campos.push('canal');
  if (dados.contexto.length < 10) campos.push('contexto');
  if (campos.length) return json({ ok: false, erro: 'validacao', campos }, 422);

  if (env.TURNSTILE_SECRET) {
    const aprovado = await verificarTurnstile(String(d.turnstile || ''), request, env.TURNSTILE_SECRET);
    if (!aprovado) return json({ ok: false, erro: 'turnstile' }, 403);
  }

  if (!env.N8N_WEBHOOK_URL || !env.N8N_WEBHOOK_TOKEN) {
    console.error('contato: integração não configurada');
    return json({ ok: false, erro: 'nao_configurado' }, 503);
  }

  const payload = {
    origem: new URL(request.url).hostname,
    pagina: limpar(d.pagina, MAXIMO.pagina),
    recebidoEm: new Date().toISOString(),
    ...dados,
    // Destinatário e remetente são fixados no fluxo n8n, nunca recebidos do navegador.
    replyTo: emailValido(dados.canal) ? dados.canal : '',
    servicosTexto: dados.servicos.map((s) => SERVICOS[s]).join(', ') || 'Não informado',
    investTexto: INVESTIMENTO[dados.invest]
  };

  let resposta;
  try {
    resposta = await fetch(env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Uno-Token': env.N8N_WEBHOOK_TOKEN || '' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });
  } catch (e) {
    console.error('contato: n8n inacessível');
    return json({ ok: false, erro: 'encaminhamento' }, 502);
  }
  if (!resposta.ok) {
    console.error('contato: n8n respondeu', resposta.status);
    return json({ ok: false, erro: 'encaminhamento' }, 502);
  }

  // HTTP positivo, sozinho, só prova aceitação pelo webhook. Exigimos a
  // confirmação explícita do nó posterior ao SMTP, sem alegar entrega na caixa.
  let confirmacao;
  try { confirmacao = await resposta.json(); } catch { confirmacao = null; }
  if (!confirmacao || confirmacao.ok !== true || confirmacao.encaminhamento !== 'smtp_aceito') {
    console.error('contato: encaminhamento não confirmado');
    return json({ ok: false, erro: 'encaminhamento' }, 502);
  }
  return json({ ok: true, encaminhamento: 'smtp_aceito' }, 200);
}

/* Aceita a própria origem (inclui a URL *.workers.dev de teste) e as listadas em ORIGENS_PERMITIDAS. */
function origemPermitida(request, env) {
  const origem = request.headers.get('Origin');
  if (!origem) return false;
  if (origem === new URL(request.url).origin) return true;
  const lista = String(env.ORIGENS_PERMITIDAS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return lista.includes(origem);
}

function limpar(valor, maximo, manterLinhas = false) {
  let t = String(valor ?? '');
  t = manterLinhas
    ? t.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '')
    : t.replace(/[\u0000-\u001F\u007F]/g, ' ');
  return t.trim().slice(0, maximo);
}

function canalValido(v) {
  if (emailValido(v)) return true;
  const digitos = v.replace(/\D/g, '').length;
  return /^[+()\d\s.-]+$/.test(v) && digitos >= 10 && digitos <= 15;
}

function emailValido(v) {
  return /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v);
}

async function verificarTurnstile(token, request, segredo) {
  if (!token || token.length > 2048) return false;
  const corpo = new FormData();
  corpo.append('secret', segredo);
  corpo.append('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) corpo.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: corpo });
    const j = await r.json();
    return j && j.success === true;
  } catch (e) {
    console.error('contato: falha ao verificar Turnstile');
    return false;
  }
}

function json(corpo, status = 200, extras = {}) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extras
    }
  });
}
