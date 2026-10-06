import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../worker/index.js', import.meta.url), 'utf8');
const worker = (await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'))).default;
const env = { N8N_WEBHOOK_URL: 'https://n8n.example.invalid/webhook/teste', N8N_WEBHOOK_TOKEN: 'token-ficticio-de-teste' };
const dados = { nome: 'Pessoa fictícia', empresa: 'Empresa de teste', canal: 'teste@example.com', contexto: 'Teste fictício sem envio externo.', servicos: ['site'], invest: 'indefinido' };
function request(body = dados, headers = {}) {
  return new Request('https://uno.example.invalid/api/contato', { method: 'POST', headers: { Origin: 'https://uno.example.invalid', 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
}

test('contrato do Worker sem mensagens externas', async (t) => {
  const realFetch = globalThis.fetch;
  let payload, chamadas;
  globalThis.fetch = async (url, options) => {
    chamadas++;
    assert.equal(url, env.N8N_WEBHOOK_URL);
    assert.equal(options.headers['X-Uno-Token'], env.N8N_WEBHOOK_TOKEN);
    payload = JSON.parse(options.body);
    return Response.json({ ok: true, encaminhamento: 'smtp_aceito' });
  };
  try {
    await t.test('422 identifica os campos, sem encaminhar', async () => {
      chamadas = 0;
      const r = await worker.fetch(request({ nome: '', empresa: '', canal: 'abc1234567890', contexto: '' }), env);
      assert.equal(r.status, 422);
      assert.deepEqual((await r.json()).campos, ['nome', 'empresa', 'canal', 'contexto']);
      assert.equal(chamadas, 0);
    });
    await t.test('destinatário arbitrário é ignorado e Reply-To é validado', async () => {
      const r = await worker.fetch(request({ ...dados, destinatario: 'terceiro@example.com', from: 'outra@example.com' }), env);
      assert.equal(r.status, 200);
      assert.equal((await r.json()).encaminhamento, 'smtp_aceito');
      assert.equal(payload.replyTo, dados.canal);
      assert.equal(payload.destinatario, undefined);
      assert.equal(payload.from, undefined);
      await worker.fetch(request({ ...dados, canal: '(27) 93618-5141' }), env);
      assert.equal(payload.replyTo, '');
    });
    await t.test('faltam secrets: indisponível, não finge envio', async () => {
      assert.equal((await worker.fetch(request(), {})).status, 503);
      assert.equal((await worker.fetch(request(), { N8N_WEBHOOK_URL: env.N8N_WEBHOOK_URL })).status, 503);
    });
    await t.test('HTTP positivo genérico não confirma SMTP', async () => {
      globalThis.fetch = async () => Response.json({ message: 'Workflow was started' });
      assert.equal((await worker.fetch(request(), env)).status, 502);
      globalThis.fetch = async () => Response.json({ ok: true });
      assert.equal((await worker.fetch(request(), env)).status, 502);
    });
    await t.test('falha upstream e rede retornam 502', async () => {
      globalThis.fetch = async () => new Response('indisponível', { status: 500 });
      assert.equal((await worker.fetch(request(), env)).status, 502);
      globalThis.fetch = async () => { throw new Error('exceção fictícia'); };
      assert.equal((await worker.fetch(request(), env)).status, 502);
    });
    await t.test('origem inválida e método GET não encaminham', async () => {
      assert.equal((await worker.fetch(request(dados, { Origin: 'https://terceiro.example.invalid' }), env)).status, 403);
      assert.equal((await worker.fetch(new Request('https://uno.example.invalid/api/contato'), env)).status, 405);
    });
    await t.test('Canal WhatsApp entra no texto encaminhado e valor desconhecido sai', async () => {
      globalThis.fetch = async (_url, options) => {
        payload = JSON.parse(options.body);
        return Response.json({ ok: true, encaminhamento: 'smtp_aceito' });
      };
      const resposta = await worker.fetch(request({ ...dados, servicos: ['whatsapp', 'desconhecido', 'whatsapp'] }), env);
      assert.equal(resposta.status, 200);
      assert.deepEqual(payload.servicos, ['whatsapp']);
      assert.equal(payload.servicosTexto, 'Canal WhatsApp');
    });
    await t.test('honeypot descarta sem encaminhar', async () => {
      let passou = false;
      globalThis.fetch = async () => { passou = true; throw new Error('não deveria chamar'); };
      assert.equal((await worker.fetch(request({ ...dados, website: 'spam' }), env)).status, 200);
      assert.equal(passou, false);
    });
    await t.test('modelo fixa destino e não cria Reply-To de telefone', async () => {
      const modelo = JSON.parse(await readFile(new URL('../docs/n8n/uno-contato.modelo.json', import.meta.url), 'utf8'));
      assert.equal(modelo.active, false);
      const smtp = modelo.nodes.find(n => n.type === 'n8n-nodes-base.emailSend');
      assert.equal(smtp.parameters.toEmail, 'contato@unolabs.com.br');
      const expression = smtp.parameters.options.replyTo.slice(3, -2).trim();
      const evaluate = new Function('$json', 'return (' + expression + ')');
      assert.equal(evaluate({ body: { canal: 'teste@example.com' } }), 'teste@example.com');
      assert.equal(evaluate({ body: { canal: '(27) 93618-5141' } }), '');
      assert.equal(evaluate({ body: { canal: 'teste@example.com\r\nBcc: terceiro@example.com' } }), '');
      const text = new Function('$json', 'return (' + smtp.parameters.text.slice(3, -2).trim() + ')')({ body: dados });
      assert.ok(text.includes('\nNome:'));
    });
  } finally { globalThis.fetch = realFetch; }
});
