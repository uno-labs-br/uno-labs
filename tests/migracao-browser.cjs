const { chromium } = require(process.env.UNO_PLAYWRIGHT_PATH || 'playwright');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const url = process.env.UNO_QA_URL || 'http://127.0.0.1:4321/';
const output = process.env.UNO_MIGRATION_QA_OUTPUT || path.join(root, '.qa/migracao');
const baseline = '7d243eb9e40504f1b457f28792273e15645ea8ef';
const report = { checks: [], errors: [], resources: [] };
function check(name, value, details) {
  report.checks.push({ name, ok: !!value, details });
}
function original(file) {
  return execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding: 'utf8' });
}
async function compareDOM(page, before, after) {
  return page.evaluate(({ before, after }) => {
    const parser = new DOMParser();
    const a = parser.parseFromString(before, 'text/html');
    const b = parser.parseFromString(after, 'text/html');
    const normalize = s => s.replace(/\s+/g, ' ').trim();
    const texts = doc => [...doc.querySelectorAll('h1,h2,h3,p,label,option,summary')].map(e => [e.tagName, normalize(e.textContent)]);
    const ids = doc => [...doc.querySelectorAll('[id]')].map(e => e.id).sort();
    const textNodes = fragment => {
      const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) { const text = normalize(walker.currentNode.textContent); if (text) nodes.push(text); }
      return nodes;
    };
    const templates = doc => [...doc.querySelectorAll('template')].map(e => ({ id: e.id, text: textNodes(e.content), ids: ids(e.content) }));
    const aria = doc => [...doc.querySelectorAll('[aria-labelledby],[aria-describedby],[aria-controls]')].map(e => [e.tagName, e.getAttribute('aria-labelledby'), e.getAttribute('aria-describedby'), e.getAttribute('aria-controls')]);
    return { textBefore: texts(a), textAfter: texts(b), idsBefore: ids(a), idsAfter: ids(b), templatesBefore: templates(a), templatesAfter: templates(b), ariaBefore: aria(a), ariaAfter: aria(b) };
  }, { before, after });
}
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    page.on('pageerror', e => report.errors.push(e.message));
    await page.route('**/api/contato', route => route.abort());
    page.on('response', response => {
      if (response.request().resourceType() !== 'document' && response.status() >= 400) report.resources.push({ url: response.url(), status: response.status() });
    });
    for (const [route, legacy, built] of [
      ['/', 'public/index.html', 'index.html'],
      ['/politica-de-privacidade/', 'public/politica-de-privacidade/index.html', 'politica-de-privacidade/index.html'],
      ['/nao-existe-migracao/', 'public/404.html', '404.html'],
    ]) {
      const response = await page.goto(new URL(route, url).href);
      check(`HTTP ${route}`, response.status() === (route.includes('nao-existe') ? 404 : 200), response.status());
      const compiled = fs.readFileSync(path.join(root, 'dist', built), 'utf8');
      const comparison = await compareDOM(page, original(legacy), compiled);
      for (const key of ['text', 'ids', 'templates', 'aria']) {
        check(`DOM ${key} ${route}`, JSON.stringify(comparison[key + 'Before']) === JSON.stringify(comparison[key + 'After']),
          JSON.stringify(comparison[key + 'Before']) === JSON.stringify(comparison[key + 'After']) ? undefined : comparison);
      }
      check(`um H1 ${route}`, await page.locator('h1').count() === 1);
      check(`noindex ${route}`, await page.locator('meta[name=robots]').getAttribute('content') === 'noindex, nofollow');
      if (route === '/') {
        check('canonical oficial', await page.locator('link[rel=canonical]').getAttribute('href') === 'https://unolabs.com.br/');
        check('JSON-LD preservado', JSON.stringify(JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())) === JSON.stringify(JSON.parse(original(legacy).match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])));
        check('um módulo processado', await page.locator('script[type=module]').count() === 1);
        check('Turnstile desligado', await page.locator('script[src*="challenges.cloudflare.com"]').count() === 0);
        const fonts = await page.evaluate(async () => {
          const faces = [...document.fonts];
          await Promise.all(faces.map(face => face.load()));
          return faces.map(face => ({ family: face.family, style: face.style, weight: face.weight, status: face.status }));
        });
        check('dez arquivos de fontes locais carregados', fonts.length === 10 && fonts.every(font => font.status === 'loaded'), fonts);
      } else check(`sem JS de home ${route}`, await page.locator('script').count() === 0);
      await page.evaluate(() => document.fonts.ready);
      // Obriga o carregamento das imagens lazy para testar recursos, inclusive fora da tela.
      await page.locator('img').evaluateAll(images => images.forEach(i => { i.loading = 'eager'; }));
      await page.waitForFunction(() => [...document.images].filter(i => i.getClientRects().length).every(i => i.complete && i.naturalWidth > 0));
      check(`imagens carregadas ${route}`, await page.locator('img').evaluateAll(images => images.filter(i => i.getClientRects().length).every(i => i.complete && i.naturalWidth > 0)));
    }
    await page.goto(url);
    await page.locator('.capitulo--atria').scrollIntoViewIfNeeded();
    await page.locator('[data-ampliar="atria"]').click();
    const ids = await page.locator('[id]').evaluateAll(elements => elements.map(e => e.id));
    check('IDs únicos com dialog e clones', ids.length === new Set(ids).size);
    const references = await page.evaluate(() => [...document.querySelectorAll('svg *')].flatMap(e => [...e.attributes].flatMap(a => [...a.value.matchAll(/url\(#([^)]+)\)/g)].map(m => ({ id: m[1], exists: !!document.getElementById(m[1]) })))));
    check('referências SVG de clones resolvidas', references.every(r => r.exists), references);
    await page.keyboard.press('Escape');
    await page.close();
    const fallback = await browser.newPage({ viewport: { width: 390, height: 844 } });
    fallback.on('pageerror', e => report.errors.push(e.message));
    await fallback.addInitScript(() => { delete window.IntersectionObserver; delete window.ResizeObserver; });
    await fallback.goto(url);
    check('fallback observadores renderiza conteúdo', await fallback.locator('h1').isVisible());
    check('fallback órbita estática', await fallback.locator('[data-pausar-orbita]').isHidden());
    await fallback.locator('[data-ampliar="modulo"]').click();
    check('fallback dialog abre', await fallback.locator('#visualizador').evaluate(e => e.open));
    await fallback.close();
    const robots = await (await fetch(new URL('robots.txt', url))).text();
    check('robots permite leitura do noindex', robots.includes('Allow: /') && !robots.includes('Disallow: /'));
    const sitemap = await (await fetch(new URL('sitemap.xml', url))).text();
    check('sitemap duas URLs reais, sem blog vazio', (sitemap.match(/<loc>/g) || []).length === 2 && sitemap.includes('https://unolabs.com.br/politica-de-privacidade/') && !sitemap.includes('/blog/'));
    check('sem erros de recursos', report.resources.length === 0, report.resources);
    check('sem erros de execução', report.errors.length === 0, report.errors);
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  }
  const failed = report.checks.filter(c => !c.ok);
  console.log(JSON.stringify({ checks: report.checks.length, failed: failed.map(f => f.name), errors: report.errors, output }));
  assert.equal(failed.length, 0, 'Contratos da migração devem ser preservados; consulte report.json');
})().catch(error => { console.error(error); process.exitCode = 1; });
