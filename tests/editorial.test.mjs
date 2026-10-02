import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { authorIds, authors } from '../src/data/authors.ts';
import { createEditorialSchema, isLocalEditorialCover } from '../src/lib/editorial-schema.ts';
import { articlePath, assertUniqueEditorialSlugs, calendarDateUTC, editorialSlug, formatEditorialDate, isISOCalendarDate, selectPublishedArticles, selectVisibleArticles } from '../src/lib/editorial.ts';

export function validEditorialData() {
  return {
    title: 'Título de teste',
    description: 'Descrição de teste',
    pubDate: '2026-10-02',
    author: 'milena-dias',
    tags: ['testes'],
    cover: '/assets/img/og-unolabs.png',
    coverAlt: 'Imagem de compartilhamento da UNO Labs',
    draft: false,
  };
}

const schema = createEditorialSchema();
const requiredFields = ['title', 'description', 'pubDate', 'author', 'tags', 'cover', 'coverAlt'];
const invalidValues = {
  title: ['   ', 12, null],
  description: ['', [], null],
  pubDate: ['2026-02-30', '2026-13-01', '2026-10-02T12:00:00Z', new Date('2026-10-02'), 1000],
  author: ['desconhecido', 'milena-novaes', '', null],
  tags: [[], [' '], [42], 'testes'],
  cover: ['/assets/img/capa-ausente.webp', 'https://example.com/capa.webp', '/assets/img/og-unolabs.png?x=1', null],
  coverAlt: [' ', false, null],
};

for (const field of requiredFields) {
  test(`schema rejeita ${field} ausente em artigo publicado`, () => {
    const data = validEditorialData();
    delete data[field];
    const result = schema.safeParse(data);
    assert.equal(result.success, false);
    assert.ok(result.error.issues.some((issue) => issue.path[0] === field));
  });
  test(`schema rejeita valores inválidos de ${field}`, () => {
    for (const value of invalidValues[field]) {
      const result = schema.safeParse({ ...validEditorialData(), [field]: value });
      assert.equal(result.success, false, `${field}: ${String(value)}`);
      assert.ok(result.error.issues.some((issue) => issue.path[0] === field));
    }
  });
}

test('schema normaliza textos e datas; rascunho é o padrão seguro', () => {
  const data = { ...validEditorialData(), title: ' Título ', tags: [' teste '] };
  delete data.draft;
  const parsed = schema.parse(data);
  assert.equal(parsed.title, 'Título');
  assert.deepEqual(parsed.tags, ['teste']);
  assert.equal(parsed.pubDate.toISOString(), '2026-10-02T00:00:00.000Z');
  assert.equal(parsed.draft, true);
  assert.equal(parsed.preview, false);
  assert.equal(parsed.updatedDate, undefined);
  for (const invalid of ['false', 0, null]) assert.equal(schema.safeParse({ ...data, draft: invalid }).success, false);
});

test('rascunho admite autoria e data pendentes; valores fornecidos continuam validados', () => {
  const data = { ...validEditorialData(), draft: true, preview: true };
  delete data.author; delete data.pubDate;
  const parsed = schema.parse(data);
  assert.equal(parsed.author, undefined);
  assert.equal(parsed.pubDate, undefined);
  assert.equal(parsed.preview, true);
  for (const field of ['title', 'description', 'tags', 'cover', 'coverAlt']) {
    const missing = { ...data }; delete missing[field];
    assert.equal(schema.safeParse(missing).success, false, field);
  }
  for (const field of ['author', 'pubDate']) {
    for (const value of invalidValues[field]) assert.equal(schema.safeParse({ ...data, [field]: value }).success, false, field);
  }
  for (const value of ['true', 1, null]) assert.equal(schema.safeParse({ ...data, preview: value }).success, false);
});

test('updatedDate é válida e nunca anterior à publicação; slug de frontmatter é rejeitado', () => {
  for (const date of ['2026-10-01', '2026-02-30', '10/02/2026']) {
    const result = schema.safeParse({ ...validEditorialData(), updatedDate: date });
    assert.equal(result.success, false);
    assert.ok(result.error.issues.some((issue) => issue.path[0] === 'updatedDate'));
  }
  for (const date of ['2026-10-02', '2026-10-03']) assert.equal(schema.safeParse({ ...validEditorialData(), updatedDate: date }).success, true);
  assert.equal(schema.safeParse({ ...validEditorialData(), slug: 'outra-url' }).success, false);
});

test('todos os IDs aprovados resolvem autores reais', () => {
  assert.deepEqual(authorIds, Object.keys(authors));
  for (const author of authorIds) assert.equal(schema.safeParse({ ...validEditorialData(), author }).success, true);
  assert.equal(authors['milena-dias'].name, 'Milena Dias');
});

test('calendário ISO rejeita normalização silenciosa, formato local e anos inválidos', () => {
  for (const value of ['2000-02-29', '2024-02-29', '2026-10-02']) assert.equal(isISOCalendarDate(value), true, value);
  for (const value of ['1900-02-29', '2025-02-29', '2026-04-31', '2026-01-00', '2026-00-01', '10000-01-01', '-001-01-01', '26-01-01', '2026-1-01', '02/10/2026', '2026-10-02 ', 'invalid']) {
    assert.equal(isISOCalendarDate(value), false, value);
    assert.throws(() => calendarDateUTC(value), /Data editorial inválida/);
  }
});

test('datas, texto e publicação independem do fuso da máquina', () => {
  const moduleURL = new URL('../src/lib/editorial.ts', import.meta.url).href;
  const code = `import { calendarDateUTC, formatEditorialDate, selectPublishedArticles } from ${JSON.stringify(moduleURL)};
const date = calendarDateUTC('2026-10-02');
const articles = [{id:'teste', data:{pubDate:date,draft:false}}];
console.log(JSON.stringify([date.toISOString(),formatEditorialDate(date),selectPublishedArticles(articles,new Date('2026-10-01T23:30:00-03:00')).length]));`;
  const results = ['Pacific/Honolulu', 'Asia/Tokyo', 'America/Sao_Paulo'].map((timezone) => {
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', code], { encoding: 'utf8', env: { ...process.env, TZ: timezone } });
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout);
  });
  assert.deepEqual(results[0], results[1]);
  assert.deepEqual(results[1], results[2]);
  assert.equal(results[0][0], '2026-10-02T00:00:00.000Z');
  assert.equal(results[0][1], '2 de outubro de 2026');
  assert.equal(results[0][2], 1);
  assert.equal(formatEditorialDate(calendarDateUTC('2026-10-02')), results[0][1]);
});

test('capa exige imagem local existente; diretórios e escapes são rejeitados', async () => {
  assert.equal(isLocalEditorialCover('/assets/img/og-unolabs.png'), true);
  for (const cover of ['//example.com/capa.png', 'assets/img/og-unolabs.png', '/assets/../favicon.ico', '/assets/img/../../package.json', '/assets/img/%2e%2e/capa.png', '/assets/img/og-unolabs.png#capa', '/assets\\img\\og-unolabs.png', '/assets/img/og-unolabs.png/']) {
    assert.equal(isLocalEditorialCover(cover), false, cover);
  }
  const root = await mkdtemp(join(tmpdir(), 'uno-editorial-covers-'));
  try {
    await mkdir(join(root, 'assets', 'not-image.webp'), { recursive: true });
    await writeFile(join(root, 'assets', 'file.txt'), 'texto');
    assert.equal(isLocalEditorialCover('/assets/not-image.webp', root), false);
    assert.equal(isLocalEditorialCover('/assets/file.txt', root), false);
    assert.equal(createEditorialSchema(root).safeParse(validEditorialData()).success, false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('slug deriva do arquivo e preserva diretórios sem aceitar IDs inseguros', () => {
  assert.equal(editorialSlug('Páginas Locais.mdx'), 'paginas-locais');
  assert.equal(editorialSlug('estrategia/Primeiro_Post.mdx'), 'estrategia/primeiro-post');
  assert.equal(articlePath('estrategia/primeiro-post'), '/blog/estrategia/primeiro-post/');
  for (const file of ['../escape.mdx', '/absoluto.mdx', '.oculto.mdx', 'foo//bar.mdx', 'foo\\bar.mdx', 'foo?.mdx', 'foo%20bar.mdx', 'foo#bar.mdx', 'foo.bar.mdx', ' foo.mdx', 'foo--bar.mdx', 'foo_.mdx', 'foo.md', '漢字.mdx']) assert.throws(() => editorialSlug(file), /ID editorial inválido/, file);
  for (const id of ['', '../escape', '/foo', 'foo//bar', 'foo%2fbar', 'Foo', 'foo?query']) assert.throws(() => articlePath(id), /ID de rota editorial inválido/, id);
});

test('colisões após normalizar nomes falham antes de sobrescrever conteúdo', () => {
  assert.doesNotThrow(() => assertUniqueEditorialSlugs([]));
  assert.doesNotThrow(() => assertUniqueEditorialSlugs(['a.mdx', 'pasta/a.mdx']));
  for (const files of [['Olá Mundo.mdx', 'ola_mundo.mdx'], ['FOO.mdx', 'foo.mdx'], ['pasta/a_b.mdx', 'pasta/a-b.mdx']]) assert.throws(() => assertUniqueEditorialSlugs(files), /Colisão de slug editorial/);
});

test('seleção central funciona vazia e exclui rascunhos e datas futuras em UTC', () => {
  const now = new Date('2026-10-02T00:01:00Z');
  assert.deepEqual(selectPublishedArticles([], now), []);
  const entry = (id, date, draft = false) => ({ id, data: { pubDate: calendarDateUTC(date), draft } });
  const entries = [entry('futuro', '2026-10-03'), entry('rascunho', '2026-01-01', true), entry('ontem', '2026-10-01'), entry('hoje-z', '2026-10-02'), entry('hoje-a', '2026-10-02')];
  assert.deepEqual(selectPublishedArticles(entries, now).map(({ id }) => id), ['hoje-a', 'hoje-z', 'ontem']);
  assert.deepEqual(entries.map(({ id }) => id), ['futuro', 'rascunho', 'ontem', 'hoje-z', 'hoje-a']);
  assert.throws(() => selectPublishedArticles(entries, new Date('invalid')), /referência editorial inválida/);
});

test('prévia mostra somente rascunhos explicitamente autorizados; produção mantém o filtro publicado', () => {
  const now = calendarDateUTC('2026-10-02');
  const entries = [
    { id: 'privado', data: { draft: true } },
    { id: 'revisao-z', data: { draft: true, preview: true } },
    { id: 'revisao-a', data: { draft: true, preview: true } },
    { id: 'publicado', data: { draft: false, pubDate: now } },
    { id: 'futuro', data: { draft: false, pubDate: calendarDateUTC('2026-10-03'), preview: true } },
    { id: 'sem-data', data: { draft: false } },
  ];
  assert.deepEqual(selectVisibleArticles(entries, now, true).map(({ id }) => id), ['publicado', 'revisao-a', 'revisao-z']);
  assert.deepEqual(selectVisibleArticles(entries, now, false).map(({ id }) => id), ['publicado']);
  assert.deepEqual(selectPublishedArticles(entries, now).map(({ id }) => id), ['publicado']);
  assert.deepEqual(selectVisibleArticles([], now, true), []);
});

test('importação dos seis artigos preserva parágrafos/seções e capas do commit de origem', async () => {
  const articles = JSON.parse(await readFile(new URL('../docs/blog/articles-pr7.json', import.meta.url), 'utf8'));
  const provenance = JSON.parse(await readFile(new URL('../docs/blog/importacao-assets-pr7.json', import.meta.url), 'utf8'));
  assert.equal(articles.length, 6);
  assert.equal(provenance.length, 12);
  const links = (html) => html.replace(/\.\.\/([a-z0-9-]+)\/index\.html/g, '/blog/$1/').replaceAll('../../index.html#', '/#');
  for (const article of articles) {
    const mdx = await readFile(new URL(`../src/content/blog/${article.slug}.mdx`, import.meta.url), 'utf8');
    const metadata = JSON.parse(mdx.match(/^---\r?\n([\s\S]+?)\r?\n---/)[1]);
    assert.equal(schema.safeParse(metadata).success, true, article.slug);
    assert.equal(metadata.draft, true);
    assert.equal(metadata.preview, true);
    assert.equal(metadata.author, undefined);
    assert.equal(metadata.pubDate, undefined);
    const blocks = [...mdx.matchAll(/<EditorialHTML html={(.+)} \/>/g)].map(match => JSON.parse(match[1]));
    for (const paragraph of article.lede) assert.ok(blocks.includes(links(`<p>${paragraph}</p>`)), article.slug);
    for (const section of article.sections) assert.ok(blocks.some(block => block.includes(links(section.html))), `${article.slug}: ${section.id}`);
  }
  for (const asset of provenance) {
    assert.equal(asset.sourceRef, 'a5e80ab356217c55a8f3557be875fab0c1ec8fe1');
    const bytes = await readFile(new URL(`../${asset.destination}`, import.meta.url));
    assert.equal(bytes.length, asset.bytes, asset.destination);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, asset.destination);
  }
});
