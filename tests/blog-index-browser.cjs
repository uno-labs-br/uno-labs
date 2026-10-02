const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Execute após npm run build, com npm run preview na porta 4321.
const base = process.env.UNO_QA_BASE_URL || 'http://127.0.0.1:4321';
const capture = process.env.UNO_QA_CAPTURE_DIR;

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });
  const visible = page.locator('[data-blog-article]:visible');
  const all = page.getByRole('button', { name: 'Todos', exact: true });
  let checks = 0;
  const check = (name, value) => { assert.ok(value, name); checks += 1; };
  if (capture) fs.mkdirSync(capture, { recursive: true });
  try {
    for (const width of [1440, 1265, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${base}/blog/`);
      await all.waitFor({ state: 'visible' });
      await page.evaluate(() => document.fonts.ready);
      const originalLinks = await visible.locator('a').evaluateAll(links => links.map(link => link.href));
      check(`${width}: todos os seis artigos ao abrir`, originalLinks.length === 6 && new Set(originalLinks).size === 6 && await all.getAttribute('aria-pressed') === 'true');
      const rects = await visible.evaluateAll(cards => cards.map(card => { const { x, y } = card.getBoundingClientRect(); return { x, y }; }));
      check(`${width}: duas colunas no desktop e uma no celular`, width > 600
        ? rects.every((rect, index) => index % 2 ? rect.y === rects[index - 1].y && rect.x > rects[index - 1].x : index === 0 || rect.y > rects[index - 1].y)
        : rects.every((rect, index) => rect.x === rects[0].x && (index === 0 || rect.y > rects[index - 1].y)));
      check(`${width}: títulos completos e sem transbordamento`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && [...document.querySelectorAll('h1,h2')].every(element => element.scrollWidth <= element.clientWidth + 1)));
      await visible.locator('img').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode(); })));
      if (capture && [1440, 390].includes(width)) await page.screenshot({ path: path.join(capture, `grid-${width}.png`), fullPage: true });
      for (const [name, count, category] of [
        ['Estratégia e conversão', 1, 'estrategia-conversao'],
        ['Design e experiência', 3, 'design-experiencia'],
        ['Contato e mensuração', 2, 'contato-mensuracao'],
      ]) {
        const button = page.getByRole('button', { name, exact: true });
        await button.click();
        check(`${width}: filtra ${name}`, await visible.count() === count && await visible.evaluateAll((cards, expected) => cards.every(card => card.dataset.blogCategory === expected), category));
        check(`${width}: estado e foco de ${name}`, await page.locator('[data-blog-filter][aria-pressed="true"]').count() === 1 && await button.getAttribute('aria-pressed') === 'true' && await button.evaluate(element => element === document.activeElement) && (await page.getByRole('status').textContent()).includes(`${count} artigo`));
      }
      if (capture && width === 1440) await page.screenshot({ path: path.join(capture, 'grid-filtered.png'), fullPage: true });
      await all.focus();
      await page.keyboard.press('Space');
      check(`${width}: Todos restaura a ordem pelo teclado`, JSON.stringify(await visible.locator('a').evaluateAll(links => links.map(link => link.href))) === JSON.stringify(originalLinks));
    }
    const categoryButton = page.getByRole('button', { name: 'Contato e mensuração', exact: true });
    await categoryButton.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    check('teclado pula artigos ocultos', await visible.first().locator('a').evaluate(link => link === document.activeElement));
    const target = await visible.first().locator('a').getAttribute('href');
    await page.keyboard.press('Enter');
    await page.waitForURL(`${base}${target}`);
    check('artigo filtrado abre pelo teclado', new URL(page.url()).pathname === target);
    const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    await noJS.goto(`${base}/blog/`);
    check('sem JS todos os artigos continuam acessíveis', await noJS.locator('[data-blog-article]:visible').count() === 6 && await noJS.locator('[data-blog-filters]').isHidden());
    check('sem erros de execução ou recursos', errors.length === 0);
    console.log(JSON.stringify({ checks, errors }));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
