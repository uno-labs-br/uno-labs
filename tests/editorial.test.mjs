import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { authorIds, authors } from '../src/data/authors.ts';
import { createEditorialSchema, isLocalEditorialCover } from '../src/lib/editorial-schema.ts';
import { articlePath, assertUniqueEditorialSlugs, calendarDateUTC, editorialSlug, formatEditorialDate, isISOCalendarDate, selectPublishedArticles } from '../src/lib/editorial.ts';

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
  test(`schema rejeita ${field} ausente, inclusive em rascunho`, () => {
    const data = { ...validEditorialData(), draft: true };
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
  assert.equal(parsed.updatedDate, undefined);
  for (const invalid of ['false', 0, null]) assert.equal(schema.safeParse({ ...data, draft: invalid }).success, false);
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
