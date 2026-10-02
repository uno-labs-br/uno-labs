import { realpathSync, statSync } from 'node:fs';
import { extname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'astro/zod';
import { authorIds } from '../data/authors.ts';
import { calendarDateUTC, isISOCalendarDate } from './editorial.ts';

const defaultPublicDirectory = new URL('../../public/', import.meta.url);
const supportedCoverExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);

/** A capa tem uma URL de raiz e deve existir dentro dos assets públicos locais. */
export function isLocalEditorialCover(cover: string, publicDirectory: string | URL = defaultPublicDirectory): boolean {
  if (!cover.startsWith('/assets/') || /[\\%?#<>:"|*\u0000-\u0020]/.test(cover)) return false;
  if (cover.slice(1).split('/').some((segment) => segment === '' || segment === '.' || segment === '..')) return false;
  if (!supportedCoverExtensions.has(extname(cover).toLowerCase())) return false;
  try {
    const publicPath = typeof publicDirectory === 'string' ? publicDirectory : fileURLToPath(publicDirectory);
    const assetRoot = realpathSync(resolve(publicPath, 'assets'));
    const file = realpathSync(resolve(publicPath, cover.slice(1)));
    const pathFromAssets = relative(assetRoot, file);
    return pathFromAssets !== '' && !pathFromAssets.startsWith('..') && !isAbsolute(pathFromAssets) && statSync(file).isFile();
  } catch {
    return false;
  }
}

export function createEditorialSchema(publicDirectory: string | URL = defaultPublicDirectory) {
  const text = (field: string) => z.string({ error: `${field} deve ser um texto não vazio.` }).trim().min(1, `${field} não pode ficar vazio.`);
  const date = z.string({ error: 'Use uma data ISO de calendário no formato YYYY-MM-DD.' })
    .refine(isISOCalendarDate, 'Data ISO de calendário inválida. Use YYYY-MM-DD.')
    .transform(calendarDateUTC);

  return z.object({
    title: text('title'),
    description: text('description'),
    pubDate: date.optional(),
    author: z.enum(authorIds, { error: 'author deve identificar um autor aprovado em src/data/authors.ts.' }).optional(),
    tags: z.array(text('tags'), { error: 'tags deve ser uma lista de textos não vazios.' }).min(1, 'tags deve conter pelo menos uma tag.'),
    cover: text('cover').refine((cover) => isLocalEditorialCover(cover, publicDirectory), 'cover deve apontar para uma imagem existente em /assets/.'),
    coverAlt: text('coverAlt'),
    draft: z.boolean({ error: 'draft deve ser true ou false.' }).default(true),
    preview: z.boolean({ error: 'preview deve ser true ou false.' }).default(false),
    updatedDate: date.optional(),
    coverCredit: z.object({
      caption: text('caption'),
      name: text('name'),
      url: z.url(),
      license: text('license'),
      licenseURL: z.url(),
    }).strict().optional(),
  }).strict().superRefine((data, context) => {
    if (!data.draft) {
      if (!data.pubDate) context.addIssue({ code: 'custom', path: ['pubDate'], message: 'pubDate é obrigatória para um artigo publicado.' });
      if (!data.author) context.addIssue({ code: 'custom', path: ['author'], message: 'author é obrigatório para um artigo publicado.' });
    }
    if (data.updatedDate instanceof Date && data.pubDate instanceof Date && data.updatedDate.getTime() < data.pubDate.getTime()) {
      context.addIssue({ code: 'custom', path: ['updatedDate'], message: 'updatedDate deve ser igual ou posterior a pubDate.' });
    }
  });
}

export type EditorialData = z.infer<ReturnType<typeof createEditorialSchema>>;
