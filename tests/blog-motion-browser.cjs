const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const url = process.env.UNO_QA_URL || 'http://127.0.0.1:4321/';
const output = path.resolve(__dirname, '../.qa/blog-motion');
const report = { checks: [], errors: [] };
const phrase = 'restaurante para jantar em vitória';
function check(name, valid, details) {
  report.checks.push({ name, ok: !!valid, details });
  assert.ok(valid, `${name}: ${JSON.stringify(details)}`);
}
async function searchState(page) {
  return page.locator('[data-busca-demo]').evaluate(e => ({
    text: e.querySelector('[data-busca-texto]').textContent,
    state: e.dataset.buscaEstado,
    opacity: Number(getComputedStyle(e.querySelector('.resultado')).opacity),
  }));
}
async function openHome(page) {
  await page.goto(url);
  await page.waitForFunction(() => document.querySelector('[data-busca-demo]')?.dataset.buscaEstado);
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
}
async function screenshot(page, name) {
  if (process.env.UNO_QA_CAPTURE && !name.includes(process.env.UNO_QA_CAPTURE)) return;
  await page.evaluate(() => document.fonts.ready);
  await page.locator('img').evaluateAll(images => Promise.all(images.filter(image => {
    const rect = image.getBoundingClientRect();
    return rect.width > 0 && rect.bottom > 0 && rect.top < innerHeight;
  }).map(image => { image.loading = 'eager'; return image.decode(); })));
  await page.screenshot({ path: path.join(output, name + '.png') });
}
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
    await openHome(page);
    check('busca inicia vazia e sem resultado', (await searchState(page)).text === '' && (await searchState(page)).opacity === 0);
    await page.locator('[data-busca-demo]').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => { const t = document.querySelector('[data-busca-texto]').textContent; return t.length > 3 && t.length < 25; });
    check('digitação revela frase progressivamente', phrase.startsWith((await searchState(page)).text));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(80);
    const paused = await searchState(page);
    await page.waitForTimeout(300);
    check('digitação pausa fora da área visível', JSON.stringify(await searchState(page)) === JSON.stringify(paused));
    await page.locator('[data-busca-demo]').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('[data-busca-demo]').dataset.buscaEstado === 'enter');
    check('Enter aparece antes do resultado', (await searchState(page)).text === phrase && (await searchState(page)).opacity === 0);
    await page.waitForFunction(() => document.querySelector('[data-busca-demo]').dataset.buscaEstado === 'concluida');
    check('resultado permanece visível', (await searchState(page)).opacity === 1);
    check('frase cabe no campo', await page.locator('.busca-digitacao').evaluate(e => e.scrollWidth <= e.clientWidth));
    await page.locator('.hero-palco--desk').scrollIntoViewIfNeeded();
    await screenshot(page, 'home-desktop');

    for (const [name, section] of [['modulo', 'modulo'], ['atria', 'atria'], ['casanoma', 'noma']]) {
      const study = page.locator(`.capitulo--${section} .comp--desk`);
      await study.scrollIntoViewIfNeeded();
      await page.waitForTimeout(80);
      await page.locator(`[data-replay="${name}"]`).evaluate(e => e.click());
      await page.waitForTimeout(50);
      const times = await study.locator('[data-estudo]').evaluateAll(elements => elements.map(e => ({
        id: e.dataset.estudo,
        times: e.getAnimations({ subtree: true }).filter(a => Number.isFinite(a.effect.getComputedTiming().endTime)).map(a => a.effect.getComputedTiming().endTime),
      })));
      check(`${name}: versões desktop e celular concluem em cerca de 2,2s`, times.length === 2 && times.every(e => e.times.length > 0 && Math.max(...e.times) <= 2210), times);
      if (name === 'casanoma') {
        await page.waitForTimeout(950);
        const opacities = await study.locator('.cn-v2-barra-base,.cn-mob-v2-card-reserva').evaluateAll(elements => elements.map(e => Number(getComputedStyle(e).opacity)));
        check('reserva legível antes de 1 segundo', opacities.every(opacity => opacity === 1), opacities);
      }
    }

    await openHome(page);
    await page.locator('[data-busca-demo]').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('[data-busca-texto]').textContent.length > 2);
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
    const hidden = await searchState(page);
    await page.waitForTimeout(250);
    check('digitação pausa com documento oculto', JSON.stringify(await searchState(page)) === JSON.stringify(hidden));
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.querySelector('[data-busca-demo]').dataset.buscaEstado === 'concluida');
    check('movimento reduzido durante digitação mostra estado final', (await searchState(page)).text === phrase && (await searchState(page)).opacity === 1);
    await openHome(page);
    check('movimento reduzido inicia completo', (await searchState(page)).text === phrase && (await searchState(page)).opacity === 1);

    await page.locator('.topo__nav a[href="https://unolabs.com.br/blog/"]').click();
    check('Blog do menu abre índice próprio', new URL(page.url()).pathname === '/blog/');
    await page.waitForFunction(() => document.documentElement.classList.contains('js'));
    check('índice oculta menu móvel no desktop', await page.locator('#menu-movel').isHidden());
    const articles = [...new Set(await page.locator('[data-blog-article] > a').evaluateAll(links => links.map(a => a.getAttribute('href'))))];
    check('índice apresenta seis artigos', articles.length === 6, articles);
    await screenshot(page, 'blog-desktop');
    for (const article of articles) {
      const response = await page.goto(new URL(article, url).href);
      check(`artigo acessível: ${article}`, response.status() === 200 && await page.locator('h1').count() === 1);
      check(`revisão e noindex: ${article}`, (await page.textContent('main')).includes('Em revisão editorial') && (await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'));
      await page.locator('img').evaluateAll(images => images.forEach(image => image.loading = 'eager'));
      await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
      const internal = await page.locator('main a[href^="/blog/"]').evaluateAll(links => links.map(a => a.getAttribute('href')));
      check(`links relacionados válidos: ${article}`, internal.every(href => href === '/blog/' || articles.includes(href.split('#')[0])), internal);
    }
    await page.goto(new URL(articles.find(path => path.includes('animacoes-rolagem')), url).href);
    await screenshot(page, 'artigo-desktop');
    const demo = page.locator('.motion-demo');
    check('demo editorial respeita movimento reduzido', await demo.getAttribute('data-state') === 'finished');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await demo.locator('.motion-demo__comparacao').scrollIntoViewIfNeeded();
    await demo.locator('[data-action="finish"]').click();
    check('demo permite ver resultado sem espera', await demo.getAttribute('data-state') === 'finished');
    await demo.locator('.motion-demo__comparacao').scrollIntoViewIfNeeded();
    await page.waitForTimeout(80);
    await demo.locator('[data-action="restart"]').evaluate(e => e.click());
    await demo.locator('[data-action="play"]').evaluate(e => e.click());
    check('demo editorial permite pausar', await demo.getAttribute('data-state') === 'paused');
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url);
    await page.locator('.hero-palco--mob').scrollIntoViewIfNeeded();
    await screenshot(page, 'home-mobile');
    await page.goto(new URL('blog/', url).href);
    await page.locator('.menu-botao').click();
    check('menu do blog abre no celular', await page.locator('#menu-movel').isVisible());
    await page.keyboard.press('Escape');
    check('Escape fecha menu e devolve foco', await page.locator('#menu-movel').isHidden() && await page.locator('.menu-botao').evaluate(e => e === document.activeElement));
    check('âncoras internas do blog voltam à home', await page.locator('#menu-movel a').first().getAttribute('href') === '/#servicos');
    check('blog sem transbordamento no celular', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await screenshot(page, 'blog-mobile');
    await page.goto(new URL(articles[0], url).href);
    check('artigo sem transbordamento no celular', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await screenshot(page, 'artigo-mobile');
    const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    await noJS.goto(new URL('blog/', url).href);
    check('blog acessível sem JavaScript', await noJS.locator('[data-blog-article] > a').count() === 6);
    await noJS.goto(new URL(articles[0], url).href);
    check('artigo completo sem JavaScript', (await noJS.textContent('main')).length > 3000);
    check('sem erros no navegador ou recursos', report.errors.length === 0, report.errors);
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  }
  console.log(JSON.stringify({ checks: report.checks.length, output }));
})().catch(error => { console.error(error); process.exitCode = 1; });
