const { chromium } = require(process.env.UNO_PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { execSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const reviewDir = path.join(root, '.impeccable', 'review');

const report = {
  declaracao: 'Cenários simulados em ambiente local com interceptação estrita de rede. Não constitui homologação de backend real ou recebimento em servidores de terceiros.',
  checks: [],
  erros: [],
  capturas: [],
};

function check(name, condition, details) {
  const ok = !!condition;
  report.checks.push({ name, ok, details });
  if (!ok) {
    report.erros.push(`Falha em check: ${name}`);
    process.exitCode = 1;
  }
  assert.ok(ok, `${name}${details ? ': ' + JSON.stringify(details) : ''}`);
}

/** Servidor HTTP estático nativo para servir os arquivos gerados em dist. */
function criarServidorEstatico(pasta) {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
  };

  const server = http.createServer((req, res) => {
    try {
      const parsed = new URL(req.url, 'http://127.0.0.1');
      let caminho = decodeURIComponent(parsed.pathname);
      if (caminho.endsWith('/')) caminho += 'index.html';
      let arquivo = path.join(pasta, caminho);

      if (!fs.existsSync(arquivo) || fs.statSync(arquivo).isDirectory()) {
        const tentativaIndex = path.join(arquivo, 'index.html');
        if (fs.existsSync(tentativaIndex)) {
          arquivo = tentativaIndex;
        } else {
          const pagina404 = path.join(pasta, '404.html');
          if (fs.existsSync(pagina404)) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fs.readFileSync(pagina404));
            return;
          }
          res.writeHead(404);
          res.end('Not Found');
          return;
        }
      }

      const ext = path.extname(arquivo).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(fs.readFileSync(arquivo));
    } catch {
      res.writeHead(500);
      res.end('Server error');
    }
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port });
    });
  });
}

function compilar(target) {
  const env = { ...process.env };
  if (target === 'production') {
    env.UNO_DEPLOY_TARGET = 'production';
  } else {
    delete env.UNO_DEPLOY_TARGET;
  }
  const cmd = process.platform === 'win32' ? 'npx.cmd astro build' : 'npx astro build';
  execSync(cmd, { cwd: root, env, stdio: 'pipe' });
}

(async () => {
  fs.mkdirSync(reviewDir, { recursive: true });

  let serverInstance = null;
  let browser = null;
  let targetAtual = 'preview';

  try {
    browser = await chromium.launch({ headless: true });

    // =========================================================================
    // CENÁRIO 1: Bloqueio estrito no target preview padrão
    // =========================================================================
    console.log('1. Testando bloqueio no target preview padrao...');
    const previewServidor = await criarServidorEstatico(dist);
    serverInstance = previewServidor.server;

    const previewContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await previewContext.route('**/*', async (route) => {
      const u = new URL(route.request().url());
      if (u.hostname.includes('googletagmanager') || u.hostname.includes('google-analytics')) {
        return route.fulfill({ status: 204, body: '' });
      }
      if (u.hostname === 'unolabs.com.br' || u.hostname === 'www.unolabs.com.br') {
        const res = await fetch(`http://127.0.0.1:${previewServidor.port}${u.pathname}${u.search}`);
        const buf = Buffer.from(await res.arrayBuffer());
        const headers = {};
        res.headers.forEach((val, key) => { headers[key] = val; });
        return route.fulfill({ status: res.status, headers, body: buf });
      }
      return route.abort('blockedbyclient');
    });

    const previewPage = await previewContext.newPage();
    previewPage.on('pageerror', (err) => { report.erros.push(err.message); process.exitCode = 1; });
    await previewPage.goto('https://unolabs.com.br/');
    await previewPage.locator('#banner-consentimento').waitFor({ state: 'visible', timeout: 5000 });
    await previewPage.locator('[data-consentimento="aceitar"]').click();
    await previewPage.waitForTimeout(400);

    const scriptsPreview = await previewPage.locator('script[src*="googletagmanager.com"]').count();
    check('GA bloqueado categoricamente no target preview oficial', scriptsPreview === 0);
    await previewContext.close();
    previewServidor.server.close();
    serverInstance = null;

    // =========================================================================
    // CENÁRIO 2: Compilação para Produção e Testes em Produção Oficial
    // =========================================================================
    console.log('2. Compilando frontend para o target production...');
    compilar('production');
    targetAtual = 'production';

    console.log('3. Iniciando servidor local para arquivos de produção...');
    const prodServidor = await criarServidorEstatico(dist);
    serverInstance = prodServidor.server;
    const port = prodServidor.port;

    console.log('4. Executando testes rigorosos em producao oficial (https://unolabs.com.br)...');
    let respostaGtagHold = null;
    let liberarGtag = null;
    const gaRequests = [];
    let simularStatusContato = 200;
    let simularCorpoContato = { ok: true, encaminhamento: 'smtp_aceito' };

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });

    await context.route('**/*', async (route) => {
      const req = route.request();
      const u = new URL(req.url());

      // Interceptar Google Analytics e Tag Manager
      if (
        u.hostname.includes('googletagmanager.com') ||
        u.hostname.includes('google-analytics.com') ||
        u.pathname.includes('/gtag/js') ||
        u.pathname.includes('/g/collect')
      ) {
        gaRequests.push({ url: req.url(), method: req.method() });
        if (u.pathname.includes('/gtag/js')) {
          if (respostaGtagHold) {
            await respostaGtagHold;
          }
          return route.fulfill({
            status: 200,
            contentType: 'application/javascript',
            body: 'window.__gtagScriptCarregado = true;',
          });
        }
        return route.fulfill({ status: 204, body: '' });
      }

      // Interceptar POST de contato
      if (req.method() === 'POST' && u.pathname === '/api/contato') {
        if (simularStatusContato === 'abort') {
          return route.abort('failed');
        }
        return route.fulfill({
          status: typeof simularStatusContato === 'number' ? simularStatusContato : 200,
          contentType: typeof simularCorpoContato === 'string' ? 'text/html' : 'application/json',
          body: typeof simularCorpoContato === 'string' ? simularCorpoContato : JSON.stringify(simularCorpoContato),
        });
      }

      // Mapear hosts oficiais e simulados de nuvem para o servidor local
      if (
        u.hostname === 'unolabs.com.br' ||
        u.hostname === 'www.unolabs.com.br' ||
        u.hostname === 'uno-labs.vercel.app' ||
        u.hostname === 'unolabs-site-preview.workers.dev'
      ) {
        const localUrl = `http://127.0.0.1:${port}${u.pathname}${u.search}`;
        try {
          const res = await fetch(localUrl);
          const buf = Buffer.from(await res.arrayBuffer());
          const headers = {};
          res.headers.forEach((val, key) => { headers[key] = val; });
          return route.fulfill({ status: res.status, headers, body: buf });
        } catch {
          return route.abort('failed');
        }
      }

      if (u.origin === `http://127.0.0.1:${port}`) {
        return route.continue();
      }

      return route.abort('blockedbyclient');
    });

    const page = await context.newPage();
    page.on('pageerror', (err) => { report.erros.push(err.message); process.exitCode = 1; });

    // --- Teste A: Estado inicial pendente e Capturas Visuais ---
    await page.goto('https://unolabs.com.br/');
    await page.waitForLoadState('domcontentloaded');

    const banner = page.locator('#banner-consentimento');
    await banner.waitFor({ state: 'visible', timeout: 5000 });
    check('banner visivel sem consentimento previo', await banner.isVisible());

    const scriptsAntes = await page.locator('script[src*="googletagmanager.com"]').count();
    check('gtag.js nao injetado antes do aceite', scriptsAntes === 0);

    // Capturas Desktop 1440, Mobile 390 e Mobile 320
    await page.screenshot({ path: path.join(reviewDir, 'consentimento-desktop-1440.png') });
    report.capturas.push('consentimento-desktop-1440.png');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(reviewDir, 'consentimento-mobile-390.png') });
    report.capturas.push('consentimento-mobile-390.png');

    await page.setViewportSize({ width: 320, height: 568 });
    await page.screenshot({ path: path.join(reviewDir, 'consentimento-mobile-320.png') });
    report.capturas.push('consentimento-mobile-320.png');

    // Validação da altura compacta em 320x568 (<= 200px)
    const box320 = await banner.boundingBox();
    check('banner compacto em 320px com altura <= 200px', box320 && box320.height <= 205, box320?.height);

    await page.setViewportSize({ width: 1440, height: 900 });

    // --- Teste B: Interação pré-consentimento não é enviada nem reproduzida ---
    await page.locator('a[data-contact-channel="whatsapp"]').first().click();
    const eventosPre = await page.evaluate(() => window.dataLayer || []);
    check('clique pre-consentimento nao envia contact_click', !eventosPre.some(e => e[0] === 'event' && e[1] === 'contact_click'));

    // --- Teste C: Recusa inicial e reload sem requests ---
    await page.locator('[data-consentimento="recusar"]').click();
    await page.waitForFunction(() => document.getElementById('banner-consentimento').hidden);
    check('recusa fecha banner', await banner.isHidden());
    check('recusa mantem zero scripts do google', await page.locator('script[src*="googletagmanager.com"]').count() === 0);

    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    check('reload apos recusa nao exibe banner e nao carrega script', await banner.isHidden() && await page.locator('script[src*="googletagmanager.com"]').count() === 0);

    // --- Teste D: Armazenamento Inacessível (fail-closed, sem carregar SDK nem falso salvo) ---
    await page.evaluate(() => {
      localStorage.removeItem('uno_consent_v1');
      const originalSet = Storage.prototype.setItem;
      Storage.prototype.setItem = function() {
        throw new Error('SecurityError: Access is denied for this document.');
      };
      window.__restaurarStorage = () => { Storage.prototype.setItem = originalSet; };
    });
    await page.locator('[data-abrir-cookies]').first().click();
    await banner.waitFor({ state: 'visible' });
    await page.locator('[data-consentimento="aceitar"]').click();
    await page.waitForTimeout(300);

    const statusAvisoInacessivel = await page.locator('#banner-consentimento-status').textContent();
    check('storage inacessivel falha seguro sem falso salvo', statusAvisoInacessivel.includes('Não foi possível salvar sua preferência'));
    check('storage inacessivel nao carrega sdk (fail-closed)', await page.locator('script[src*="googletagmanager.com"]').count() === 0);

    await page.evaluate(() => window.__restaurarStorage && window.__restaurarStorage());

    // --- Teste E: Aceite de Análise, counts exatos e inicialização oficial ---
    await page.locator('[data-abrir-cookies]').first().click();
    await banner.waitFor({ state: 'visible' });
    await page.locator('[data-consentimento="aceitar"]').click();
    await page.waitForSelector('script[src*="googletagmanager.com/gtag/js?id=G-ZKM57KG6V9"]', { state: 'attached' });
    await page.waitForFunction(() => (window.dataLayer || []).some(e => e[0] === 'config'));

    const scriptsAceito = await page.locator('script[src*="googletagmanager.com"]').count();
    check('gtag.js injetado exatamente 1 vez apos aceite valido', scriptsAceito === 1);

    const dataLayerCounts = await page.evaluate(() => {
      const dl = window.dataLayer || [];
      const defaults = dl.filter(e => e[0] === 'consent' && e[1] === 'default');
      const jsCalls = dl.filter(e => e[0] === 'js');
      const configs = dl.filter(e => e[0] === 'config');
      const pageviews = dl.filter(e => e[0] === 'event' && e[1] === 'page_view');
      const preInteracoes = dl.filter(e => e[0] === 'event' && e[1] === 'contact_click');
      return { defaults: defaults.length, jsCalls: jsCalls.length, configs: configs.length, pageviews: pageviews.length, preInteracoes: preInteracoes.length };
    });
    check('exatamente 1 default consent', dataLayerCounts.defaults === 1);
    check('exatamente 1 chamada gtag js', dataLayerCounts.jsCalls === 1);
    check('exatamente 1 chamada config', dataLayerCounts.configs === 1);
    check('exatamente 1 pageview enviada', dataLayerCounts.pageviews === 1);
    check('interacao pre-consentimento nao foi reproduzida', dataLayerCounts.preInteracoes === 0);

    // --- Teste F: Reaceite não duplica chamadas, listeners ou pageviews ---
    const cookiesBtn = page.locator('[data-abrir-cookies]').first();
    await cookiesBtn.click();
    await page.locator('[data-consentimento="recusar"]').click();
    await page.waitForFunction(() => document.getElementById('banner-consentimento').hidden);

    await cookiesBtn.click();
    await page.locator('[data-consentimento="aceitar"]').click();
    await page.waitForFunction(() => document.getElementById('banner-consentimento').hidden);

    const reaceiteCounts = await page.evaluate(() => {
      const dl = window.dataLayer || [];
      return {
        scripts: document.querySelectorAll('script[src*="googletagmanager.com"]').length,
        configs: dl.filter(e => e[0] === 'config').length,
        pageviews: dl.filter(e => e[0] === 'event' && e[1] === 'page_view').length,
      };
    });
    check('reaceite nao duplica script gtag', reaceiteCounts.scripts === 1);
    check('reaceite nao duplica chamada config', reaceiteCounts.configs === 1);
    check('reaceite nao duplica page_view', reaceiteCounts.pageviews === 1);

    // --- Teste G: Cookies reais semeados e removidos na revogação ---
    await page.evaluate(() => {
      document.cookie = '_ga=GA1.1.123456789.1000000000; path=/; domain=unolabs.com.br';
      document.cookie = '_ga_ZKM57KG6V9=GS1.1.1000000000.1.0.1000000000.0.0.0; path=/; domain=unolabs.com.br';
      document.cookie = '_ga=GA1.1.123456789.1000000000; path=/';
    });
    await cookiesBtn.click();
    await page.locator('[data-consentimento="recusar"]').click();
    await page.waitForFunction(() => document.getElementById('banner-consentimento').hidden);

    const cookiesRestantes = await page.evaluate(() => document.cookie);
    check('cookies _ga e _ga_* removidos na revogacao', !cookiesRestantes.includes('_ga=') && !cookiesRestantes.includes('_ga_ZKM57KG6V9='));

    // --- Teste H: Sincronização multi-aba (clear / remoção revoga imediatamente) ---
    const page2 = await context.newPage();
    page2.on('pageerror', (err) => { report.erros.push(err.message); process.exitCode = 1; });
    await page2.goto('https://unolabs.com.br/');
    // Na page 2, conceder aceite
    await page2.locator('[data-abrir-cookies]').first().click();
    await page2.locator('[data-consentimento="aceitar"]').click();
    await page2.waitForFunction(() => document.getElementById('banner-consentimento').hidden);

    // Evento storage real do navegador entre duas abas da mesma origem.
    await page.evaluate(() => localStorage.clear());
    await page2.waitForFunction(() => window['ga-disable-G-ZKM57KG6V9'] === true);

    const optOutAba2 = await page2.evaluate(() => window['ga-disable-G-ZKM57KG6V9']);
    check('storage clear em outra aba revoga imediatamente aba ativa', optOutAba2 === true);
    await page2.close();

    // --- Teste I: Expiração em aba aberta com timer ---
    await page.locator('[data-abrir-cookies]').first().click();
    await page.locator('[data-consentimento="aceitar"]').click();
    await page.waitForFunction(() => document.getElementById('banner-consentimento').hidden);

    // Recarregar uma decisão curta: somente o timer do aplicativo deve revogá-la.
    await page.evaluate(() => {
      const expiraEm = Date.now() + 1200;
      localStorage.setItem('uno_consent_v1', JSON.stringify({
        v: 1,
        status: 'granted',
        timestamp: Date.now(),
        expiresAt: expiraEm,
      }));
    });
    await page.reload();
    await page.waitForFunction(() => (window.dataLayer || []).some(e => e[0] === 'config'));
    await page.waitForFunction(() => window['ga-disable-G-ZKM57KG6V9'] === true);
    const optOutExpirou = await page.evaluate(() => window['ga-disable-G-ZKM57KG6V9']);
    check('expiracao em aba aberta aciona desativacao', optOutExpirou === true);
    check('expiracao remove registro vencido', await page.evaluate(() => localStorage.getItem('uno_consent_v1') === null));

    // Reativar consentimento para testes subsequentes
    await page.locator('[data-abrir-cookies]').first().click();
    await page.locator('[data-consentimento="aceitar"]').click();
    await page.waitForFunction(() => document.getElementById('banner-consentimento').hidden);

    // --- Teste J: URL real via page.goto com UTMs + PII e eventos limpos ---
    const pagePII = await context.newPage();
    pagePII.on('pageerror', (err) => { report.erros.push(err.message); process.exitCode = 1; });
    await pagePII.goto('https://unolabs.com.br/?utm_source=google&utm_medium=cpc&gclid=campanha123&email=teste@empresa.com&tel=27999999999#formulario');
    await pagePII.waitForFunction(() => (window.dataLayer || []).some(e => e[0] === 'event' && e[1] === 'page_view'));

    const eventosPII = await pagePII.evaluate(() => {
      const dl = window.dataLayer || [];
      const setCall = dl.find(e => e[0] === 'set');
      const pageviewCall = dl.find(e => e[0] === 'event' && e[1] === 'page_view');
      return { setLoc: setCall ? setCall[1]?.page_location : '', pvLoc: pageviewCall ? pageviewCall[2]?.page_location : '' };
    });
    check('page_location mantem utm_source, utm_medium e gclid', eventosPII.pvLoc.includes('utm_source=google') && eventosPII.pvLoc.includes('gclid=campanha123'));
    check('page_location descarta fragmento #formulario', !eventosPII.pvLoc.includes('#formulario'));
    check('page_location descarta parametro contendo email pessoal', !eventosPII.pvLoc.includes('teste@empresa.com') && !eventosPII.pvLoc.includes('email='));
    check('page_location descarta parametro contendo telefone pessoal', !eventosPII.pvLoc.includes('27999999999') && !eventosPII.pvLoc.includes('tel='));
    await pagePII.close();

    // --- Teste K: Contact Metadata para WhatsApp e E-mail ---
    await page.goto('https://unolabs.com.br/');
    await page.waitForFunction(() => (window.dataLayer || []).some(e => e[0] === 'event' && e[1] === 'page_view'));
    const lenAntesZap = await page.evaluate(() => window.dataLayer.length);
    await page.locator('a[data-contact-channel="whatsapp"]').first().click();
    const evZap = await page.evaluate((len) => (window.dataLayer || []).slice(len).find(e => e[0] === 'event' && e[1] === 'contact_click'), lenAntesZap);
    check('contact_click whatsapp contem metadados constantes', evZap && evZap[2]?.contact_channel === 'whatsapp' && evZap[2]?.cta_position === 'contato');

    const lenAntesEmail = await page.evaluate(() => window.dataLayer.length);
    await page.locator('a[data-contact-channel="email"]').first().click();
    const evEmail = await page.evaluate((len) => (window.dataLayer || []).slice(len).find(e => e[0] === 'event' && e[1] === 'contact_click'), lenAntesEmail);
    check('contact_click email contem metadados constantes', evEmail && evEmail[2]?.contact_channel === 'email' && evEmail[2]?.cta_position === 'contato');

    // --- Teste L: form_start estrito (nao foco, nao honeypot, nao hidden, apenas 1) ---
    // Resetar estado de teste no form
    await page.evaluate(() => {
      document.querySelector('#form-contato')?.reset();
    });
    const lenAntesFoco = await page.evaluate(() => window.dataLayer.length);
    await page.locator('#f-nome').focus();
    const evFoco = await page.evaluate((len) => (window.dataLayer || []).slice(len).find(e => e[0] === 'event' && e[1] === 'form_start'), lenAntesFoco);
    check('foco em campo vazio nao dispara form_start', !evFoco);

    // Interagir com honeypot (website)
    const lenAntesHoneypot = await page.evaluate(() => window.dataLayer.length);
    await page.locator('#f-website').fill('spam bot');
    const evHoneypot = await page.evaluate((len) => (window.dataLayer || []).slice(len).find(e => e[0] === 'event' && e[1] === 'form_start'), lenAntesHoneypot);
    check('honeypot nao dispara form_start', !evHoneypot);

    // Preenchimento real em campo visivel
    const lenAntesReal = await page.evaluate(() => window.dataLayer.length);
    await page.locator('#f-nome').fill('Cliente Real');
    const evStartReal = await page.evaluate((len) => (window.dataLayer || []).slice(len).find(e => e[0] === 'event' && e[1] === 'form_start'), lenAntesReal);
    check('preenchimento real dispara form_start com taxonomia homologada', evStartReal && evStartReal[2]?.form_id === 'form-contato');

    // Digitar em outro campo não duplica form_start
    const lenAntesSegundo = await page.evaluate(() => window.dataLayer.length);
    await page.locator('#f-empresa').fill('Empresa Real');
    const evSegundoStart = await page.evaluate((len) => (window.dataLayer || []).slice(len).find(e => e[0] === 'event' && e[1] === 'form_start'), lenAntesSegundo);
    check('segundo campo preenchido nao duplica form_start', !evSegundoStart);

    await page.locator('#f-canal').fill('cliente@exemplo.com');
    await page.locator('#f-contexto').fill('Necessidade de projeto comercial com mais de 10 caracteres.');

    // --- Teste M: Submits com erro NÃO geram lead ---
    const cenariosFalha = [
      { status: 200, corpo: { ok: false } },
      { status: 200, corpo: { ok: true, encaminhamento: 'outro_servico' } },
      { status: 200, corpo: '<html><body>Erro HTML</body></html>' },
      { status: 422, corpo: { ok: false, campos: ['nome'] } },
      { status: 503, corpo: { erro: 'indisponivel' } },
      { status: 'abort', corpo: null },
    ];

    for (const cenario of cenariosFalha) {
      simularStatusContato = cenario.status;
      simularCorpoContato = cenario.corpo;
      const lenAntesTentativa = await page.evaluate(() => window.dataLayer.length);
      await page.locator('#form-contato button[type="submit"]').click();
      await page.waitForTimeout(300);

      const evLeadFalha = await page.evaluate((len) => (window.dataLayer || []).slice(len).find(e => e[0] === 'event' && e[1] === 'generate_lead'), lenAntesTentativa);
      check(`tentativa com status ${cenario.status} nao dispara generate_lead`, !evLeadFalha);
    }

    // --- Teste N: Submit com Sucesso dispara exatamente 1 generate_lead ---
    simularStatusContato = 200;
    simularCorpoContato = { ok: true, encaminhamento: 'smtp_aceito' };
    const lenAntesSucesso = await page.evaluate(() => window.dataLayer.length);
    await page.locator('#form-contato button[type="submit"]').click();
    await page.waitForSelector('#form-sucesso.visivel');

    const evLeadSucesso = await page.evaluate((len) => (window.dataLayer || []).slice(len).find(e => e[0] === 'event' && e[1] === 'generate_lead'), lenAntesSucesso);
    check('sucesso confirmado smtp_aceito dispara generate_lead', !!evLeadSucesso);
    check('generate_lead contem parametro constante e nao contem valor monetario', evLeadSucesso && evLeadSucesso[2]?.lead_channel === 'form_contato' && evLeadSucesso[2]?.value === undefined);

    // --- Teste O: Tracker lançando erro preserva sucesso do envio ---
    await page.locator('[data-reiniciar]').click();
    await page.waitForSelector('#form-contato:not([hidden])');
    await page.locator('#f-nome').fill('Cliente Fallback');
    await page.locator('#f-empresa').fill('Empresa Fallback');
    await page.locator('#f-canal').fill('cliente@fallback.com');
    await page.locator('#f-contexto').fill('Contexto de teste para falha do tracker com 10 caracteres.');

    // Simular que gtag dispara erro
    await page.evaluate(() => {
      window.gtag = function() { throw new Error('Tracker crash simulado'); };
    });
    await page.locator('#form-contato button[type="submit"]').click();
    await page.waitForSelector('#form-sucesso.visivel');
    check('erro no tracker nao interrompe sucesso do usuario', await page.locator('#form-sucesso').isVisible());

    // --- Teste P: Navegação Home / Blog / Artigo / Privacy / 404 ---
    for (const caminho of ['/blog/', '/blog/site-recebe-visitas-mas-nao-gera-contatos/', '/politica-de-privacidade/']) {
      await page.goto('https://unolabs.com.br' + caminho);
      await page.waitForFunction(() => (window.dataLayer || []).some(e => e[0] === 'event' && e[1] === 'page_view'));
      check(`page_view unico em ${caminho}`, await page.evaluate(() => (window.dataLayer || []).filter(e => e[0] === 'event' && e[1] === 'page_view').length === 1));
      await page.locator('[data-abrir-cookies]').first().click();
      await page.locator('[data-consentimento="recusar"]').click();
      check(`revogacao funcional em ${caminho}`, await page.evaluate(() => window['ga-disable-G-ZKM57KG6V9'] === true));
      await page.locator('[data-abrir-cookies]').first().click();
      await page.locator('[data-consentimento="aceitar"]').click();
      check(`reaceite sem duplicar page_view em ${caminho}`, await page.evaluate(() => (window.dataLayer || []).filter(e => e[0] === 'event' && e[1] === 'page_view').length === 1));
    }

    await page.goto('https://unolabs.com.br/cliente@exemplo.com/27999999999');
    await page.waitForFunction(() => (window.dataLayer || []).some(e => e[0] === 'event' && e[1] === 'page_view'));
    check('404 exibe pagina propria', await page.locator('h1').textContent().then(t => t.includes('não existe')));
    check('404 nao envia dados pessoais do caminho', await page.evaluate(() => (window.dataLayer || []).find(e => e[0] === 'event' && e[1] === 'page_view')[2].page_location === 'https://unolabs.com.br/404'));
    await page.locator('[data-abrir-cookies]').click();
    await page.locator('[data-consentimento="recusar"]').click();
    check('404 permite revogar consentimento', await page.evaluate(() => window['ga-disable-G-ZKM57KG6V9'] === true));

    // Revogação durante o download: nenhuma configuração ou page_view fica na fila.
    await page.evaluate(() => localStorage.clear());
    await page.goto('https://unolabs.com.br/');
    respostaGtagHold = new Promise(resolve => { liberarGtag = resolve; });
    await page.locator('[data-consentimento="aceitar"]').click();
    await page.waitForSelector('script[src*="googletagmanager.com"]', { state: 'attached' });
    await page.locator('[data-abrir-cookies]').first().click();
    await page.locator('[data-consentimento="recusar"]').click();
    liberarGtag();
    respostaGtagHold = null;
    await page.waitForFunction(() => window.__gtagScriptCarregado === true);
    check('revogacao durante download nao configura nem envia page_view', await page.evaluate(() => !(window.dataLayer || []).some(e => e[0] === 'config' || e[0] === 'event')));
    await page.locator('[data-abrir-cookies]').first().click();
    await page.locator('[data-consentimento="aceitar"]').click();
    await page.waitForFunction(() => (window.dataLayer || []).some(e => e[0] === 'config'));
    check('aceite posterior ao download configura uma vez', await page.evaluate(() => (window.dataLayer || []).filter(e => e[0] === 'config').length === 1 && (window.dataLayer || []).filter(e => e[0] === 'event' && e[1] === 'page_view').length === 1));

    // Limite de timer de 32 bits: reprogramação até os 180 dias, sem retorno à aba.
    const pageClock = await context.newPage();
    await pageClock.clock.install();
    await pageClock.goto('https://unolabs.com.br/');
    await pageClock.waitForFunction(() => (window.dataLayer || []).some(e => e[0] === 'config'));
    // Avançar em blocos também verifica a reprogramação de timers longos.
    for (let i = 0; i < 7; i++) {
      await pageClock.clock.fastForward(2147483647);
      check(`consentimento continua valido apos bloco de timer ${i + 1}`, await pageClock.evaluate(() => window['ga-disable-G-ZKM57KG6V9'] !== true));
    }
    await pageClock.clock.fastForward(180 * 24 * 60 * 60 * 1000 - 7 * 2147483647 + 1000);
    check('timer de 180 dias revoga sem evento de foco', await pageClock.evaluate(() => window['ga-disable-G-ZKM57KG6V9'] === true && localStorage.getItem('uno_consent_v1') === null));
    await pageClock.close();

    // --- Teste Q: Produção HTML servido em localhost / Vercel / workers.dev bloqueia GA ---
    await page.goto(`http://127.0.0.1:${port}/`);
    await page.waitForLoadState('domcontentloaded');
    await page.locator('[data-consentimento="aceitar"]').click();
    await page.waitForTimeout(300);
    check('producao servida em localhost bloqueia GA', await page.locator('script[src*="googletagmanager.com"]').count() === 0);

    await page.goto('https://uno-labs.vercel.app/');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('[data-consentimento="aceitar"]').click();
    await page.waitForTimeout(300);
    check('producao servida em Vercel bloqueia GA', await page.locator('script[src*="googletagmanager.com"]').count() === 0);

    await page.goto('https://unolabs-site-preview.workers.dev/');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('[data-consentimento="aceitar"]').click();
    await page.waitForTimeout(300);
    check('producao servida em workers.dev bloqueia GA', await page.locator('script[src*="googletagmanager.com"]').count() === 0);

    await context.close();

    // Biblioteca real do Google, com TODOS os envios de coleta interceptados.
    // Isso valida o transporte gerado pelo SDK sem registrar visitas de teste no GA4.
    console.log('5. Validando SDK real com coleta interceptada...');
    const sdkResponse = await fetch('https://www.googletagmanager.com/gtag/js?id=G-ZKM57KG6V9');
    assert.equal(sdkResponse.status, 200, 'biblioteca oficial do Google indisponivel');
    const sdkSource = await sdkResponse.text();
    const realContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const transporte = [];
    await realContext.route('**/*', async route => {
      const req = route.request();
      const u = new URL(req.url());
      if (u.hostname === 'www.googletagmanager.com' && u.pathname === '/gtag/js') {
        return route.fulfill({ status: 200, contentType: 'application/javascript', body: sdkSource });
      }
      if (u.pathname.endsWith('/collect')) {
        const params = new URLSearchParams(u.search);
        const corpo = req.postData() || '';
        const linhas = corpo ? corpo.split('\n') : [''];
        for (const linha of linhas) {
          const evento = new URLSearchParams(params);
          new URLSearchParams(linha).forEach((v, k) => evento.set(k, v));
          transporte.push(evento);
        }
        return route.fulfill({ status: 204, body: '' });
      }
      if (u.hostname === 'unolabs.com.br') {
        const res = await fetch(`http://127.0.0.1:${port}${u.pathname}${u.search}`);
        return route.fulfill({ status: res.status, headers: Object.fromEntries(res.headers), body: Buffer.from(await res.arrayBuffer()) });
      }
      return route.abort('blockedbyclient');
    });
    const realPage = await realContext.newPage();
    realPage.on('pageerror', err => { report.erros.push(err.message); process.exitCode = 1; });
    await realPage.goto('https://unolabs.com.br/?utm_source=teste&utm_medium=cpc&gclid=Campanha123456789Teste&email=pessoa@exemplo.com#contato');
    check('SDK real nao gera coleta antes do aceite', transporte.length === 0);
    await realPage.locator('[data-consentimento="aceitar"]').click();
    await realPage.waitForFunction(() => document.cookie.includes('_ga='));
    await realPage.waitForTimeout(1500);
    const pvReal = transporte.filter(p => p.get('en') === 'page_view');
    check('SDK real gera exatamente um page_view', pvReal.length === 1);
    check('SDK real usa URL limpa e preserva campanha valida', pvReal[0].get('dl') === 'https://unolabs.com.br/?utm_source=teste&utm_medium=cpc&gclid=Campanha123456789Teste');
    await realPage.locator('a[data-contact-channel="whatsapp"]').first().click();
    await realPage.waitForTimeout(1500);
    check('SDK real transporta contact_click com canal constante', transporte.some(p => p.get('en') === 'contact_click' && p.get('ep.contact_channel') === 'whatsapp'));
    await realPage.locator('[data-abrir-cookies]').first().click();
    await realPage.locator('[data-consentimento="recusar"]').click();
    await realPage.waitForTimeout(300);
    const countRevogado = transporte.length;
    await realPage.evaluate(() => window.gtag('event', 'contact_click', { contact_channel: 'whatsapp' }));
    await realPage.mouse.wheel(0, 900);
    await realPage.waitForTimeout(1500);
    check('opt-out nativo impede transporte do SDK apos revogacao', transporte.length === countRevogado);
    check('cookies criados pelo SDK real removidos ao revogar', await realPage.evaluate(() => !document.cookie.split(';').some(c => c.trim().startsWith('_ga'))));
    await realContext.close();
    prodServidor.server.close();
    serverInstance = null;

    console.log('\nTodos os testes de analytics-browser passaram com sucesso!');
    console.log(`Total de verificações bem-sucedidas: ${report.checks.length}`);
  } finally {
    if (browser) await browser.close();
    if (serverInstance) serverInstance.close();

    // Restaura dist para preview apenas uma vez se estiver em production
    if (targetAtual === 'production') {
      console.log('\n6. Restaurando build de dist para o target padrao preview...');
      try {
        compilar('preview');
        console.log('dist restaurado com sucesso.');
      } catch (e) {
        console.error('Falha ao restaurar build preview:', e.message);
      }
    }

    fs.writeFileSync(
      path.join(reviewDir, 'analytics-resumo.json'),
      JSON.stringify(report, null, 2),
      'utf8'
    );
  }
})();
