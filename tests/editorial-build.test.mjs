import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, symlink, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const astroCLI = join(projectRoot, 'node_modules', 'astro', 'bin', 'astro.mjs');
const fixtureURL = new URL('./editorial-fixtures/article.mdx', import.meta.url);

async function runAstro(root, command, target = 'preview') {
  return new Promise((resolveResult, reject) => {
    const child = spawn(process.execPath, [astroCLI, command, '--root', root], {
      cwd: root,
      env: { ...process.env, UNO_DEPLOY_TARGET: target, ASTRO_TELEMETRY_DISABLED: '1', FORCE_COLOR: '0' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    const timer = setTimeout(() => { child.kill(); reject(new Error(`Astro ${command} excedeu 120 segundos.\n${output}`)); }, 120_000);
    child.stdout.on('data', (chunk) => { output += chunk; });
    child.stderr.on('data', (chunk) => { output += chunk; });
    child.on('error', (error) => { clearTimeout(timer); reject(error); });
    child.on('close', (status) => { clearTimeout(timer); resolveResult({ status, output }); });
  });
}

async function outputFiles(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    files.push(...(entry.isDirectory() ? await outputFiles(join(directory, entry.name), path) : [path]));
  }
  return files;
}

function sitemapLocations(xml) {
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?><urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.ok(xml.endsWith('</urlset>'));
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

test('build editorial isolado: vazio, MDX, filtros e falhas de validação reais', { timeout: 300_000 }, async (context) => {
  const root = await mkdtemp(join(tmpdir(), 'uno-editorial-build-'));
  const nodeModules = join(root, 'node_modules');
  let linked = false;
  try {
    // A cópia é exclusiva do teste; nunca insere/remove fixtures no src/content do checkout.
    await cp(join(projectRoot, 'src'), join(root, 'src'), {
      recursive: true,
      filter: (path) => {
        const fromBlog = relative(join(projectRoot, 'src', 'content', 'blog'), path);
        const inBlog = fromBlog === '' || (!fromBlog.startsWith(`..${sep}`) && fromBlog !== '..');
        return !inBlog || !path.endsWith('.mdx');
      },
    });
    await cp(join(projectRoot, 'public'), join(root, 'public'), { recursive: true });
    for (const filename of ['astro.config.mjs', 'tsconfig.json', 'package.json']) await cp(join(projectRoot, filename), join(root, filename));
    await symlink(join(projectRoot, 'node_modules'), nodeModules, process.platform === 'win32' ? 'junction' : 'dir');
    linked = true;
    const contentDirectory = join(root, 'src', 'content', 'blog');
    await mkdir(contentDirectory, { recursive: true });
    const fixture = await readFile(fixtureURL, 'utf8');

    await context.test('coleção vazia gera índice honesto do blog e entrada no sitemap', async () => {
      const result = await runAstro(root, 'build');
      assert.equal(result.status, 0, result.output);
      assert.deepEqual((await outputFiles(join(root, 'dist'))).filter((path) => path.startsWith('blog/')), ['blog/index.html']);
      const index = await readFile(join(root, 'dist', 'blog', 'index.html'), 'utf8');
      assert.match(index, /Nenhum artigo publicado por enquanto/);
      assert.match(index, /href="\/#servicos"/);
      assert.match(index, /href="\/#contato"/);
      assert.match(index, /href="\/blog\/" aria-current="page"/);
      assert.deepEqual(sitemapLocations(await readFile(join(root, 'dist', 'sitemap.xml'), 'utf8')), ['https://unolabs.com.br/', 'https://unolabs.com.br/politica-de-privacidade/', 'https://unolabs.com.br/blog/']);
    });

    const validData = {
      title: 'Fixture de validação', description: 'Texto controlado de teste.', pubDate: '2000-01-01',
      author: 'milena-dias', tags: ['testes'], cover: '/assets/img/og-unolabs.png', coverAlt: 'Capa de teste', draft: false,
    };
    const invalidFields = { title: ' ', description: '', pubDate: '2026-02-30', author: 'autor-inexistente', tags: [], cover: '/assets/img/inexistente.webp', coverAlt: ' ' };
    for (const [field, invalidValue] of Object.entries(invalidFields)) {
      for (const mode of ['ausente', 'inválido']) {
        await context.test(`Content Collections rejeita ${field} ${mode} em fixture publicada`, async () => {
          const invalidFile = join(contentDirectory, 'editorial-invalid.mdx');
          const data = { ...validData };
          if (mode === 'ausente') delete data[field];
          else data[field] = invalidValue;
          try {
            // JSON também é YAML válido; preserva datas como strings, sem coerção de fuso.
            await writeFile(invalidFile, `---\n${JSON.stringify(data, null, 2)}\n---\n\nFixture controlada.\n`);
            const result = await runAstro(root, 'sync');
            assert.notEqual(result.status, 0, result.output);
            assert.match(result.output, new RegExp(field));
          } finally {
            await unlink(invalidFile);
          }
        });
      }
    }

    await context.test('MDX preserva metadados publicados e libera somente revisão explicitamente autorizada na prévia', async () => {
      await writeFile(join(contentDirectory, 'editorial-render.mdx'), fixture);
      await writeFile(join(contentDirectory, 'editorial-draft.mdx'), fixture.replace('draft: false', 'draft: true'));
      await writeFile(join(contentDirectory, 'editorial-default.mdx'), fixture.replace(/^draft: false\r?\n/m, ''));
      await writeFile(join(contentDirectory, 'editorial-future.mdx'), fixture.replace("pubDate: '2000-01-01'", "pubDate: '9999-12-30'").replace("updatedDate: '2000-01-02'", "updatedDate: '9999-12-31'"));
      await writeFile(join(contentDirectory, 'editorial-review.mdx'), fixture.replace('draft: false', 'draft: true\npreview: true').replace(/^author:.*\n|^pubDate:.*\n|^updatedDate:.*\n/gm, ''));
      const result = await runAstro(root, 'build');
      assert.equal(result.status, 0, result.output);
      const files = await outputFiles(join(root, 'dist'));
      assert.deepEqual(files.filter((path) => path.startsWith('blog/')), ['blog/editorial-render/index.html', 'blog/editorial-review/index.html', 'blog/index.html']);
      const html = await readFile(join(root, 'dist', 'blog', 'editorial-render', 'index.html'), 'utf8');
      assert.match(html, /<h1[^>]*>Fixture editorial de teste<\/h1>/);
      assert.match(html, /<strong>texto forte<\/strong>/);
      assert.match(html, /data-editorial-fixture="render"/);
      assert.match(html, /HTML do componente sem hidratação\./);
      assert.match(html, /Por Milena Dias/);
      assert.match(html, /datetime="2000-01-01"/);
      assert.match(html, /name="author" content="Milena Dias"/);
      assert.match(html, /property="og:type" content="article"/);
      assert.match(html, /name="robots" content="noindex, nofollow"/);
      assert.match(html, /href="https:\/\/unolabs\.com\.br\/blog\/editorial-render\/"/);
      assert.match(html, /src="\/assets\/img\/og-unolabs\.png"/);
      assert.match(html, /alt="Capa de teste para validação editorial"/);
      assert.match(html, /class="article-cover"[^>]*width="1200"[^>]*height="630"/);
      assert.match(html, /href="\/"/);
      assert.match(html, /href="\/blog\/"/);
      const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
      assert.ok(scripts.length > 0);
      assert.ok(scripts.every((match) => match[1].includes('type="application/ld+json"') || match[1].includes('type="module"')), 'Somente metadados e módulo global de consentimento.');
      assert.equal(scripts.filter((match) => match[1].includes('type="module"')).length, 1);
      assert.match(html, /id="banner-consentimento"/);
      const json = scripts.filter((match) => match[1].includes('type="application/ld+json"')).map((match) => JSON.parse(match[2])).find((value) => value['@type'] === 'BlogPosting');
      assert.equal(json.author.name, 'Milena Dias');
      assert.equal(json.datePublished, '2000-01-01T00:00:00.000Z');
      assert.equal(json.dateModified, '2000-01-02T00:00:00.000Z');
      const sitemap = await readFile(join(root, 'dist', 'sitemap.xml'), 'utf8');
      assert.deepEqual(sitemapLocations(sitemap), ['https://unolabs.com.br/', 'https://unolabs.com.br/politica-de-privacidade/', 'https://unolabs.com.br/blog/', 'https://unolabs.com.br/blog/editorial-render/']);
      assert.match(sitemap, /<lastmod>2000-01-02<\/lastmod>/);
      assert.doesNotMatch(sitemap, /editorial-(draft|default|future|review)/);
      const index = await readFile(join(root, 'dist', 'blog', 'index.html'), 'utf8');
      assert.match(index, /href="\/blog\/editorial-render\/"/);
      assert.match(index, /href="\/blog\/editorial-review\/"/);
      assert.match(index, /Em revisão editorial/);
      assert.doesNotMatch(index, /editorial-(draft|default|future)\//);
      const review = await readFile(join(root, 'dist', 'blog', 'editorial-review', 'index.html'), 'utf8');
      assert.match(review, /Em revisão editorial/);
      assert.match(review, /name="robots" content="noindex, nofollow"/);
      assert.doesNotMatch(review, /BlogPosting|name="author"|article:published_time|article:modified_time|class="article-byline"|datetime=/);
      assert.ok(!files.some((path) => path.endsWith('.mdx') || path.startsWith('tests/')));
    });

    await context.test('produção não gera rota, teaser, índice ou sitemap de revisão', async () => {
      const result = await runAstro(root, 'build', 'production');
      assert.equal(result.status, 0, result.output);
      const files = await outputFiles(join(root, 'dist'));
      assert.deepEqual(files.filter((path) => path.startsWith('blog/')), ['blog/editorial-render/index.html', 'blog/index.html']);
      for (const path of ['index.html', 'blog/index.html', 'sitemap.xml']) {
        const html = await readFile(join(root, 'dist', path), 'utf8');
        assert.doesNotMatch(html, /editorial-review|Em revisão editorial/);
      }
    });

    await context.test('capa removida invalida novo build mesmo com digest de MDX em cache', async () => {
      await unlink(join(root, 'public', 'assets', 'img', 'og-unolabs.png'));
      const result = await runAstro(root, 'build');
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, /cover/);
      await cp(join(projectRoot, 'public', 'assets', 'img', 'og-unolabs.png'), join(root, 'public', 'assets', 'img', 'og-unolabs.png'));
    });

    await context.test('colisão de nomes normalizados aborta antes da geração de rotas', async () => {
      await writeFile(join(contentDirectory, 'teste_colisao.mdx'), fixture);
      await writeFile(join(contentDirectory, 'teste-colisao.mdx'), fixture);
      const result = await runAstro(root, 'build');
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, /Colisão de slug editorial.*teste-colisao/);
      await unlink(join(contentDirectory, 'teste_colisao.mdx'));
      await unlink(join(contentDirectory, 'teste-colisao.mdx'));
    });

    await context.test('frontmatter inválido de rascunho é rejeitado pelo Content Collections', async () => {
      await writeFile(join(contentDirectory, 'editorial-draft.mdx'), fixture.replace("author: 'milena-dias'", "author: 'autor-inexistente'").replace('draft: false', 'draft: true'));
      const result = await runAstro(root, 'build');
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, /author/);
      await unlink(join(contentDirectory, 'editorial-draft.mdx'));
    });

    await context.test('seis artigos reais do PR #7 preservam textos, links e fotos; publicados aparecem na prévia e produção', async () => {
      for (const filename of await readdir(contentDirectory)) if (filename.endsWith('.mdx')) await unlink(join(contentDirectory, filename));
      const sourceArticles = JSON.parse(await readFile(join(projectRoot, 'docs', 'blog', 'articles-pr7.json'), 'utf8'));
      assert.equal(sourceArticles.length, 6);
      for (const article of sourceArticles) await cp(join(projectRoot, 'src', 'content', 'blog', `${article.slug}.mdx`), join(contentDirectory, `${article.slug}.mdx`));
      const preview = await runAstro(root, 'build');
      assert.equal(preview.status, 0, preview.output);
      const files = await outputFiles(join(root, 'dist'));
      assert.equal(files.filter((path) => path.startsWith('blog/')).length, 7);
      const index = await readFile(join(root, 'dist', 'blog', 'index.html'), 'utf8');
      for (const article of sourceArticles) {
        const html = await readFile(join(root, 'dist', 'blog', article.slug, 'index.html'), 'utf8');
        assert.ok(index.includes(`/blog/${article.slug}/`), article.slug);
        assert.ok(html.includes(article.title), article.slug);
        assert.doesNotMatch(html, /Em revisão editorial/);
        assert.match(html, /name="robots" content="noindex, nofollow"/);
        assert.match(html, /BlogPosting/);
        assert.match(html, /name="author" content="Urias Loures"/);
        assert.match(html, /datetime="2026-10-03"/);
        assert.ok(html.includes(`/assets/img/blog/${article.slug}/capa.webp`));
        assert.ok(html.includes(article.image.creditUrl));
        assert.ok(html.includes(article.image.licenseUrl));
        for (const section of article.sections) assert.ok(html.includes(`id="${section.id}"`), section.id);
        for (const related of article.related) assert.ok(html.includes(`/blog/${related}/`), related);
        for (const source of article.sources) assert.ok(html.includes(source.url.replaceAll('&', '&amp;')) || html.includes(source.url), source.url);
        assert.doesNotMatch(html, /href="\.\.\/|\/index\.html|\/blog\/assets\//);
        assert.match(html, /name="robots" content="noindex, nofollow"/);
        if (article.slug === 'animacoes-rolagem-site-atrapalham-conversao') {
          assert.match(html, /id="comparacao-animada"/);
          assert.match(html, /data-action="play"/);
          assert.match(html, /<script[^>]*type="module"/);
        } else assert.equal((html.match(/<script[^>]*type="module"/g) || []).length, 1, 'Módulo global de consentimento presente no artigo.');
      }
      const sitemap = await readFile(join(root, 'dist', 'sitemap.xml'), 'utf8');
      assert.equal(sitemapLocations(sitemap).length, 9);
      for (const article of sourceArticles) assert.ok(sitemapLocations(sitemap).includes(`https://unolabs.com.br/blog/${article.slug}/`));
      const production = await runAstro(root, 'build', 'production');
      assert.equal(production.status, 0, production.output);
      assert.equal((await outputFiles(join(root, 'dist'))).filter((path) => path.startsWith('blog/')).length, 7);
      const productionIndex = await readFile(join(root, 'dist', 'blog', 'index.html'), 'utf8');
      assert.doesNotMatch(productionIndex, /Nenhum artigo publicado por enquanto|noindex/);
      for (const article of sourceArticles) {
        assert.ok(productionIndex.includes(`/blog/${article.slug}/`));
        const html = await readFile(join(root, 'dist', 'blog', article.slug, 'index.html'), 'utf8');
        assert.doesNotMatch(html, /noindex|Em revisão editorial/);
        assert.match(html, /BlogPosting/);
      }
    });
  } finally {
    // Desvincular antes de remover a raiz garante que a junction não alcance dependências compartilhadas.
    if (linked) await unlink(nodeModules);
    assert.equal(dirname(root), tmpdir());
    assert.ok(root.startsWith(join(tmpdir(), 'uno-editorial-build-')));
    await rm(root, { recursive: true, force: true });
  }
});
