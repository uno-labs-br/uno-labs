import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../worker/index.js';

const served = [];
const assets = {
  fetch(request) {
    served.push(new URL(request.url).pathname);
    return new Response('asset', { status: 200 });
  },
};
const env = { ASSETS: assets, UNO_PRODUCT_DOMAINS_READY: 'true' };

test('fetch_productRoot_servesCorrectAsset', async () => {
  for (const [host, path] of [['chat', '/whatsapp/'], ['mail', '/email-marketing/']]) {
    const response = await worker.fetch(new Request(`https://${host}.unolabs.com.br/`), env);
    assert.equal(response.status, 200);
    assert.equal(served.at(-1), path);
  }
});

test('fetch_legacyPath_redirectsToProduct', async () => {
  for (const [path, host] of [['whatsapp', 'chat'], ['email-marketing', 'mail']]) {
    const response = await worker.fetch(new Request(`https://unolabs.com.br/${path}/?utm_source=teste`), env);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('Location'), `https://${host}.unolabs.com.br/?utm_source=teste`);
  }
});

test('fetch_productHost_hasOwnRobotsAndSitemap', async () => {
  for (const host of ['sites', 'chat', 'mail']) {
    const origin = `https://${host}.unolabs.com.br`;
    const robots = await (await worker.fetch(new Request(`${origin}/robots.txt`), env)).text();
    const sitemap = await (await worker.fetch(new Request(`${origin}/sitemap.xml`), env)).text();
    assert.match(robots, new RegExp(`Sitemap: ${origin}/sitemap.xml`));
    assert.equal(sitemap.includes(`<loc>${origin}/</loc>`), host !== 'sites');
  }
});

test('fetch_unreadyOrUnknownProduct_staysUnavailable', async () => {
  const unavailable = await worker.fetch(new Request('https://chat.unolabs.com.br/'), { ...env, UNO_PRODUCT_DOMAINS_READY: 'false' });
  assert.equal(unavailable.status, 503);
  assert.equal(unavailable.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  const sites = await worker.fetch(new Request('https://sites.unolabs.com.br/'), env);
  assert.equal(sites.status, 503);
  const missing = await worker.fetch(new Request('https://chat.unolabs.com.br/privado/'), env);
  assert.equal(missing.status, 404);
});
