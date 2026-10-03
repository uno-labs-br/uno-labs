import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const read = file => readFileSync(new URL(file, dist), 'utf8');
const production = process.env.UNO_DEPLOY_TARGET === 'production';

test('HTML estático, canonical, metadados e proteção por ambiente', () => {
  const home = read('index.html');
  const privacy = read('politica-de-privacidade/index.html');
  const error = read('404.html');
  const blog = read('blog/index.html');
  for (const html of [home, privacy, error, blog]) {
    assert.match(html, /<html lang="pt-BR"/);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
    assert.doesNotMatch(html, /astro-island|src="[^" ]+\.ts(?:"|\?)/);
    if (!production) assert.match(html, /name="robots" content="noindex, nofollow"/);
  }
  if (production) {
    assert.match(home, /name="robots" content="index, follow, max-image-preview:large"/);
    assert.doesNotMatch(privacy, /noindex/);
    assert.match(error, /name="robots" content="noindex"/);
  }
  assert.match(home, /rel="canonical" href="https:\/\/unolabs\.com\.br\/"/);
  assert.match(privacy, /rel="canonical" href="https:\/\/unolabs\.com\.br\/politica-de-privacidade\/"/);
  // Consentimento é global; o módulo adicional da home cuida de sua interface.
  assert.equal((home.match(/<script[^>]+type="module"/g) || []).length, 2);
  for (const html of [privacy, error]) {
    assert.equal((html.match(/<script[^>]+type="module"/g) || []).length, 1);
    assert.match(html, /id="banner-consentimento"/);
    assert.doesNotMatch(html, /<script[^>]+src="https:\/\/www\.googletagmanager\.com/);
  }
  assert.equal((home.match(/<template /g) || []).length, 6);
  assert.match(home, /encaminhado/);
  assert.match(privacy, /Rascunho para revisão/);
});

test('índice do blog e distribuição sem código legado, documentos ou fixtures', () => {
  function files(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
      const p = join(dir, entry.name);
      return entry.isDirectory() ? files(p) : [p];
    });
  }
  const directory = fileURLToPath(dist);
  const paths = files(directory).map(file => relative(directory, file).replaceAll('\\', '/'));
  // O inventário é independente de onde o checkout está instalado.
  for (const file of paths) assert.doesNotMatch(file, /(?:^|\/)(?:node_modules|docs|worker|tests|src|\.astro|\.env|AGENTS\.md)|\.(?:md|mdx|ts|php|webp\.json)$/i);
  assert.equal(existsSync(new URL('blog/index.html', dist)), true);
  assert.match(read('blog/index.html'), /href="\/blog\//);
  const articles = paths.filter(path => /^blog\/.+\/index\.html$/.test(path));
  assert.equal(articles.length, 6);
  for (const path of articles) {
    assert.doesNotMatch(read(path), /Em revisão editorial/);
    if (production) assert.doesNotMatch(read(path), /noindex/);
    else assert.match(read(path), /name="robots" content="noindex, nofollow"/);
    assert.match(read(path), /"@type":"BlogPosting"/);
    assert.match(read(path), /"name":"Urias Loures"/);
    assert.match(read(path), /"datePublished":"2026-10-03T00:00:00.000Z"/);
    const slug = path.split("/")[1];
    assert.ok(read("blog/index.html").includes(`/blog/${slug}/`));
    assert.ok(read("sitemap.xml").includes(`/blog/${slug}/`));
  }
  assert.equal(existsSync(new URL('assets/js/site.js', dist)), false);
  assert.equal(existsSync(new URL('assets/css/site.css', dist)), false);
  const sitemap = read('sitemap.xml');
  assert.equal((sitemap.match(/<loc>/g) || []).length, 9);
  assert.match(sitemap, /<loc>https:\/\/unolabs\.com\.br\/blog\/<\/loc>/);
  assert.doesNotMatch(sitemap, /404|api\/|fixture/);
  const robots = read('robots.txt');
  assert.match(robots, /Allow: \//);
  assert.doesNotMatch(robots, /Disallow: \//);
  assert.equal(robots.includes('Sitemap:'), production);
});

test('atalho de publicação bloqueado e backend fora do build Astro', () => {
  const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
  assert.equal(pkg.scripts.build, 'astro check && astro build');
  assert.equal(pkg.scripts.deploy, 'node scripts/bloquear-deploy.mjs');
  const config = readFileSync(new URL('astro.config.mjs', root), 'utf8');
  assert.match(config, /output: 'static'/);
  assert.doesNotMatch(config, /adapter:|@astrojs\/(?:cloudflare|vercel)/);
  const vercel = JSON.parse(readFileSync(new URL('vercel.json', root), 'utf8'));
  assert.equal(vercel.outputDirectory, 'dist');
  assert.equal(vercel.buildCommand, 'node scripts/build-vercel.mjs');
  assert.equal(vercel.headers[0].source, '/:path((?!blog(?:/|$)).*)');
  assert.equal(vercel.rewrites, undefined);
  assert.equal(vercel.headers[0].headers[0].value, 'noindex, nofollow');
});
