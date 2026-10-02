const { chromium } = require(process.env.UNO_PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const url = process.env.UNO_CONTACT_QA_URL || process.env.UNO_QA_URL || 'http://127.0.0.1:4321/';
const origin = new URL(url).origin;
const output = process.env.UNO_CONTACT_QA_OUTPUT || path.join(os.tmpdir(), 'uno-contato');
const report = { url, checks: [], errors: [], simulations: [] };
const ficticios = {
  nome: 'Pessoa de Teste', empresa: 'Empresa Fictícia', canal: 'teste@example.invalid',
  site: 'https://example.invalid', contexto: 'Contexto fictício para validar somente a interface.',
};

function check(name, condition, details) {
  report.checks.push({ name, ok: !!condition, details });
  assert.ok(condition, name);
}

async function abrir(browser, simulacao, options = {}) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', ...options });
  const page = await context.newPage();
  const requests = [];
  let liberar;
  const gate = new Promise(resolve => { liberar = resolve; });
  page.on('pageerror', error => report.errors.push(`${simulacao.name}: ${error.message}`));

  // Todo POST é interceptado. Requisições externas e outros métodos são bloqueados.
  await context.route('**/*', async route => {
    const request = route.request();
    const destination = new URL(request.url());
    if (request.method() === 'POST' && destination.pathname === '/api/contato') {
      requests.push({ method: request.method(), payload: request.postDataJSON(), headers: request.headers() });
      if (simulacao.hold) await gate;
      if (simulacao.abort) return route.abort('failed');
      try {
        await route.fulfill({ status: simulacao.status || 200, contentType: simulacao.contentType || 'application/json', body: simulacao.body ?? JSON.stringify(simulacao.json) });
      } catch (error) {
        if (!simulacao.timeout) throw error;
      }
      return;
    }
    if (!['GET', 'HEAD'].includes(request.method())) {
      report.errors.push(`${simulacao.name}: método não autorizado ${request.method()} ${destination.pathname}`);
      return route.abort('blockedbyclient');
    }
    if (destination.origin !== origin) return route.abort('blockedbyclient');
    return route.continue();
  });
  await page.goto(url);
  await page.locator('#form-contato button[type="submit"]').waitFor();
  await page.waitForFunction(() => !document.querySelector('#form-contato button[type="submit"]').disabled);
  return { page, context, requests, liberar };
}

async function preencher(page) {
  for (const [nome, valor] of Object.entries(ficticios)) await page.locator(`[name="${nome}"]`).fill(valor);
  await page.locator('input[name="servicos"][value="site"]').check();
  await page.locator('input[name="servicos"][value="seo"]').check();
  await page.locator('select[name="invest"]').selectOption('3-6k');
}

async function enviar(page) {
  await page.locator('#form-contato button[type="submit"]').click();
}

async function aguardarErro(page) {
  await page.waitForFunction(() => document.querySelector('#form-aviso').classList.contains('erro') && document.querySelector('#form-contato').getAttribute('aria-busy') !== 'true');
}

async function dadosRetidos(page, name) {
  const values = await page.locator('#form-contato').evaluate(form => Object.fromEntries(['nome', 'empresa', 'canal', 'site', 'contexto'].map(nome => [nome, form.elements.namedItem(nome).value])));
  check(`${name}: campos retidos`, JSON.stringify(values) === JSON.stringify(ficticios), values);
  check(`${name}: formulário visível`, await page.locator('#form-contato').isVisible());
  check(`${name}: nenhuma confirmação`, !await page.locator('#form-sucesso').evaluate(e => e.classList.contains('visivel')));
  check(`${name}: botão recuperável`, await page.locator('#form-contato button[type="submit"]').isEnabled());
  check(`${name}: canais alternativos disponíveis`, await page.locator('.form-recuperacao').isVisible());
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const invalid = await abrir(browser, { name: 'validação local', json: { ok: true, encaminhamento: 'smtp_aceito' } });
    try {
      await enviar(invalid.page);
      check('vazio: requisição não é enviada', invalid.requests.length === 0);
      check('vazio: foco no primeiro campo', await invalid.page.locator('#f-nome').evaluate(e => document.activeElement === e));
      check('vazio: campos obrigatórios inválidos', await invalid.page.locator('[aria-invalid="true"]').count() === 4);
      await preencher(invalid.page);
      await invalid.page.locator('#f-canal').fill('não é um canal');
      await enviar(invalid.page);
      check('canal inválido: requisição não é enviada', invalid.requests.length === 0);
      check('canal inválido: foco no campo', await invalid.page.locator('#f-canal').evaluate(e => document.activeElement === e));
      await invalid.page.locator('#f-canal').fill('27999999999');
      check('telefone com DDD: erro é removido durante correção', await invalid.page.locator('#f-canal').getAttribute('aria-invalid') === 'false');
      check('sem chave: Turnstile não é carregado', await invalid.page.locator('script[src*="challenges.cloudflare.com"]').count() === 0);
    } finally {
      invalid.liberar();
      await invalid.context.close();
    }

    const success = await abrir(browser, { name: 'confirmação válida', hold: true, json: { ok: true, encaminhamento: 'smtp_aceito' } });
    try {
      await preencher(success.page);
      await enviar(success.page);
      await success.page.waitForFunction(() => document.querySelector('#form-contato').getAttribute('aria-busy') === 'true');
      check('espera: botão desabilitado', await success.page.locator('#form-contato button[type="submit"]').isDisabled());
      check('espera: mensagem de confirmação pendente', (await success.page.locator('#form-aviso').textContent()).includes('Aguarde a confirmação'));
      await success.page.locator('#form-contato').evaluate(form => form.requestSubmit());
      await success.page.waitForTimeout(100);
      check('espera: impede envio duplicado', success.requests.length === 1);
      success.liberar();
      await success.page.locator('#form-sucesso.visivel').waitFor();
      check('sucesso: formulário oculto', await success.page.locator('#form-contato').isHidden());
      check('sucesso: foco na confirmação', await success.page.locator('#form-sucesso h3').evaluate(e => document.activeElement === e));
      check('sucesso: confirmação não promete recebimento postal', (await success.page.locator('#form-sucesso').textContent()).includes('ainda não comprova o recebimento na caixa postal'));
      const expected = { ...ficticios, servicos: ['site', 'seo'], invest: '3-6k', website: '', turnstile: '', pagina: new URL(url).pathname };
      const received = success.requests[0];
      check('payload: campos e valores preservados', Object.keys(expected).length === Object.keys(received.payload).length && Object.entries(expected).every(([key, value]) => JSON.stringify(received.payload[key]) === JSON.stringify(value)), received.payload);
      check('payload: POST JSON', received.method === 'POST' && received.headers['content-type'] === 'application/json' && received.headers.accept === 'application/json');
      await success.page.locator('[data-reiniciar]').click();
      check('reinício: formulário recuperado', await success.page.locator('#form-contato').isVisible());
      check('reinício: valores e seleção apagados', await success.page.locator('#f-nome').inputValue() === '' && await success.page.locator('input[name="servicos"]:checked').count() === 0);
      check('reinício: foco no nome', await success.page.locator('#f-nome').evaluate(e => document.activeElement === e));
      check('reinício: estado de erro e aviso apagados', await success.page.locator('[aria-invalid="true"]').count() === 0 && await success.page.locator('#form-aviso').textContent() === '');
    } finally {
      success.liberar();
      await success.context.close();
    }

    const failures = [
      { name: 'HTTP 200 sem aceite SMTP', json: { ok: true } },
      { name: 'HTTP 200 ok textual', json: { ok: 'true', encaminhamento: 'smtp_aceito' } },
      { name: 'HTTP 200 encaminhamento pendente', json: { ok: true, encaminhamento: 'pendente' } },
      { name: 'HTTP 200 JSON nulo', json: null },
      { name: 'HTTP 200 JSON em array', json: [{ ok: true, encaminhamento: 'smtp_aceito' }] },
      { name: 'HTTP 200 JSON malformado', body: '{inválido' },
      { name: 'HTTP 200 HTML', contentType: 'text/html', body: '<html>Resposta genérica</html>' },
      { name: 'HTTP 204 vazio', status: 204, body: '' },
      { name: 'HTTP 500 com JSON de sucesso', status: 500, json: { ok: true, encaminhamento: 'smtp_aceito' } },
      { name: 'HTTP 422 campos', status: 422, json: { ok: false, erro: 'campos_invalidos', campos: ['empresa', 'contexto', 'servicos', 'toString', null, {}, '__proto__'] }, fieldErrors: true },
      { name: 'HTTP 422 campos malformados', status: 422, json: { ok: false, campos: [null, {}, 'toString'] } },
      { name: 'HTTP 503 indisponível', status: 503, json: { ok: false }, message: 'temporariamente indisponível' },
      { name: 'HTTP 403 segurança', status: 403, json: { ok: false }, message: 'verificação de segurança' },
      { name: 'falha de rede', abort: true },
    ];
    for (const simulation of failures) {
      const current = await abrir(browser, simulation);
      try {
        await preencher(current.page);
        await enviar(current.page);
        await aguardarErro(current.page);
        await dadosRetidos(current.page, simulation.name);
        check(`${simulation.name}: uma requisição interceptada`, current.requests.length === 1);
        if (simulation.message) check(`${simulation.name}: mensagem específica`, (await current.page.locator('#form-aviso').textContent()).includes(simulation.message));
        if (simulation.fieldErrors) {
          check('422: somente campos conhecidos são marcados', await current.page.locator('[aria-invalid="true"]').count() === 2);
          check('422: foco na primeira correção do servidor', await current.page.locator('#f-empresa').evaluate(e => document.activeElement === e));
        }
        report.simulations.push({ name: simulation.name, intercepted: current.requests.length });
      } finally {
        current.liberar();
        await current.context.close();
      }
    }

    const timeout = await abrir(browser, { name: 'timeout de 15 segundos', hold: true, timeout: true, json: { ok: true, encaminhamento: 'smtp_aceito' } });
    try {
      await timeout.page.clock.install();
      await timeout.page.clock.pauseAt(new Date());
      await preencher(timeout.page);
      await enviar(timeout.page);
      await timeout.page.clock.runFor(14999);
      check('timeout: continua pendente antes de 15 segundos', await timeout.page.locator('#form-contato').getAttribute('aria-busy') === 'true');
      await timeout.page.clock.runFor(1);
      await aguardarErro(timeout.page);
      check('timeout: informa risco de encaminhamento anterior', (await timeout.page.locator('#form-aviso').textContent()).includes('O envio pode ter sido encaminhado; confira com a equipe antes de repetir'));
      await dadosRetidos(timeout.page, 'timeout');
      check('timeout: uma requisição interceptada', timeout.requests.length === 1);
      report.simulations.push({ name: 'timeout de 15 segundos', intercepted: timeout.requests.length });
    } finally {
      timeout.liberar();
      await timeout.context.close();
    }
    check('execução: nenhuma exceção de JavaScript', report.errors.length === 0, report.errors);
  } catch (error) {
    report.errors.push(error.stack || String(error));
    process.exitCode = 1;
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(output, 'resultado.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ checks: report.checks.length, failures: report.checks.filter(item => !item.ok), errors: report.errors, simulations: report.simulations, output }));
    if (report.errors.length || report.checks.some(item => !item.ok)) process.exitCode = 1;
  }
})();
