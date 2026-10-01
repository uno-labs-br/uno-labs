const { chromium } = require(process.env.UNO_PLAYWRIGHT_PATH || 'playwright');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const output = process.env.UNO_ORBIT_QA_OUTPUT || path.join(require('node:os').tmpdir(), 'uno-orbita');
const url = process.env.UNO_ORBIT_QA_URL || 'http://127.0.0.1:8790/';
fs.mkdirSync(output, { recursive: true });
const report = { checks: [], errors: [], colors: {}, viewports: [] };
function check(name, ok, details) { report.checks.push({ name, ok: !!ok, details }); }
async function colors(page) {
  return page.evaluate(() => Object.fromEntries([
    '#servicos-titulo', '.orbita .rotulo-orbita', '.orbita-centro b',
    '.orbita-centro small', '.orbita-fig figcaption', '.servico h3', '.servico p'
  ].map(selector => {
    const style = getComputedStyle(document.querySelector(selector));
    return [selector, { color: style.color, fontFamily: style.fontFamily, fontWeight: style.fontWeight }];
  })));
}
async function open(browser, viewport, extra = {}) {
  const context = await browser.newContext({ viewport, ...extra });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  return { page, context };
}
async function see(page) {
  await page.locator('.orbita-caixa').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => !document.querySelector('.orbita-caixa').classList.contains('motion-paused'));
}
async function states(page) {
  return page.locator('.orbita-caixa').evaluate(e => e.getAnimations({ subtree: true }).map(a => ({ time: a.currentTime, state: a.playState })));
}
async function waitPaused(page) {
  await page.waitForFunction(() => document.querySelector('.orbita-caixa').getAnimations({ subtree: true }).every(a => a.playState === 'paused'));
}
async function unchanged(page, name) {
  const before = await states(page);
  await page.waitForTimeout(450);
  const after = await states(page);
  check(name, before.length === 6 && after.every((a, i) => Math.abs(a.time - before[i].time) < 2), { before, after });
}
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const oldCss = execFileSync('git', ['show', '15cd947:public/assets/css/site.css'], { cwd: path.resolve(__dirname, '..'), encoding: 'utf8' });
    const oldContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const oldPage = await oldContext.newPage();
    await oldPage.route('**/assets/css/site.css*', r => r.fulfill({ contentType: 'text/css', body: oldCss }));
    await oldPage.goto(url);
    await oldPage.evaluate(() => document.fonts.ready);
    report.colors.before = await colors(oldPage);
    await oldContext.close();

    const { page, context } = await open(browser, { width: 1440, height: 1000 });
    report.colors.after = await colors(page);
    check('cores, fonte e pesos da seção iguais ao CSS anterior', JSON.stringify(report.colors.before) === JSON.stringify(report.colors.after), report.colors);
    await see(page);
    const choreography = await page.evaluate(() => {
      const orbit = getComputedStyle(document.querySelector('.orbita'));
      const label = getComputedStyle(document.querySelector('.rotulo-orbita'));
      const pulse = getComputedStyle(document.querySelector('.orbita-centro'), '::before');
      return { orbit: [orbit.animationName, orbit.animationDuration, orbit.animationIterationCount], labelDirection: label.animationDirection, pulse: [pulse.animationName, pulse.animationDuration, pulse.borderColor] };
    });
    check('giro e onda mantêm durações e cor anteriores', choreography.orbit.join(',') === 'gira,90s,infinite' && choreography.labelDirection === 'reverse' && choreography.pulse[0] === 'pulso' && choreography.pulse[1] === '3.2s' && choreography.pulse[2] === 'rgb(125, 211, 168)', choreography);
    const before = await page.locator('.orbita .no').first().boundingBox();
    await page.waitForTimeout(600);
    const after = await page.locator('.orbita .no').first().boundingBox();
    check('bolinha muda de posição durante execução', Math.hypot(after.x - before.x, after.y - before.y) > 3, { before, after });
    const button = page.locator('[data-pausar-orbita]');
    await button.focus();
    await page.keyboard.press('Space');
    await waitPaused(page);
    check('pausa por teclado e nome de retomada', await button.innerText() === 'Retomar animação');
    await unchanged(page, 'pausa congela todas as seis animações');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.querySelector('.orbita').getAnimations()[0].playState === 'running');
    check('Enter retoma o movimento', await button.innerText() === 'Pausar animação');
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await waitPaused(page);
    await unchanged(page, 'fora da área visível não avança');
    await see(page);
    await page.waitForFunction(() => document.querySelector('.orbita').getAnimations()[0].playState === 'running');
    check('retorno à área visível retoma', (await states(page)).every(a => a.state === 'running'));
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
    await waitPaused(page);
    await unchanged(page, 'evento de aba oculta simulado congela o movimento');
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
    await page.waitForFunction(() => document.querySelector('.orbita').getAnimations()[0].playState === 'running');
    await button.click();
    for (const preference of ['reduce', 'no-preference', 'reduce', 'no-preference']) {
      await page.emulateMedia({ reducedMotion: preference });
      await page.waitForFunction(reduce => document.documentElement.classList.contains('rm') === reduce, preference === 'reduce');
      if (preference === 'reduce') {
        await page.waitForFunction(() => document.querySelector('[data-pausar-orbita]').disabled && document.querySelector('.orbita-caixa').getAnimations({ subtree: true }).length === 0);
        check('mudança em sessão mantém conteúdo estático', await page.locator('.orbita-centro').innerText() === 'Site\nsob medida');
      } else {
        await waitPaused(page);
        check('preferência retorna sem desfazer pausa do visitante', await button.innerText() === 'Retomar animação');
      }
    }
    await button.click();
    await context.close();

    for (const [width, height] of [[320,568],[360,640],[390,844],[844,390],[768,1024],[1280,720],[1440,900]]) {
      const { page: p, context: c } = await open(browser, { width, height });
      await see(p);
      const phaseBounds = [];
      for (const time of [0,22500,45000,67500]) {
        phaseBounds.push(await p.evaluate(time => {
          document.querySelector('.orbita-caixa').getAnimations({ subtree: true }).forEach(a => { if (a.effect.getTiming().duration === 90000) { a.pause(); a.currentTime = time; } });
          return [...document.querySelectorAll('.rotulo-orbita')].map(e => { const r=e.getBoundingClientRect(); return { text:e.textContent, left:r.left, right:r.right }; });
        }, time));
      }
      const dimensions = await p.evaluate(() => ({ width:innerWidth, documentWidth:document.documentElement.scrollWidth, button:document.querySelector('[data-pausar-orbita]').getBoundingClientRect().toJSON() }));
      report.viewports.push({ width, height, phaseBounds, dimensions });
      check('rótulos cabem durante o giro '+width, phaseBounds.flat().every(r => r.left >= 0 && r.right <= width), phaseBounds);
      check('controle cabe e tem altura de toque '+width, dimensions.documentWidth === width && dimensions.button.height >= 44 && dimensions.button.width >= 44, dimensions);
      if (width === 1440 || width === 390) await p.locator('.orbita-fig').screenshot({ path: path.join(output, 'orbita-'+width+'.png') });
      await c.close();
    }
    for (const extra of [{ reducedMotion:'reduce' }, { javaScriptEnabled:false }]) {
      const { page:p, context:c } = await open(browser, { width:390, height:844 }, extra);
      await p.locator('.orbita-caixa').scrollIntoViewIfNeeded();
      check(extra.javaScriptEnabled === false ? 'sem JS mantém figura estática sem controle vazio' : 'movimento reduzido no carregamento', await p.locator('.orbita-caixa').evaluate(e => e.getAnimations({ subtree:true }).length === 0));
      if (extra.javaScriptEnabled === false) check('sem JS esconde controles indisponíveis', await p.locator('.orbita-controles').isHidden());
      await c.close();
    }
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(output, 'resultado.json'), JSON.stringify(report, null, 2));
  }
  const failed = report.checks.filter(c => !c.ok);
  console.log(JSON.stringify({ checks:report.checks.length, failed:failed.map(c => c.name), errors:report.errors, output }));
  if (failed.length || report.errors.length) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode=1; });
