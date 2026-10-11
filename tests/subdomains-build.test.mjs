import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8');

test('build_productDomainsReady_hasHostCanonicalsAndInstitutionalSitemap', () => {
  for (const [path, host] of [['whatsapp/index.html', 'chat'], ['email-marketing/index.html', 'mail']]) {
    const html = read(path);
    assert.match(html, new RegExp(`rel="canonical" href="https://${host}\\.unolabs\\.com\\.br/"`));
    assert.doesNotMatch(html, /name="robots" content="noindex/);
  }
  const sitemap = read('sitemap.xml');
  assert.doesNotMatch(sitemap, /<loc>https:\/\/unolabs\.com\.br\/(?:whatsapp|email-marketing)\//);
  assert.match(sitemap, /<loc>https:\/\/unolabs\.com\.br\/blog\/<\/loc>/);
  assert.match(read('index.html'), /href="https:\/\/chat\.unolabs\.com\.br\/"/);
  assert.match(read('index.html'), /href="https:\/\/mail\.unolabs\.com\.br\/"/);
});
