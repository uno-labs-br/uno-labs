import { getCollection, type CollectionEntry } from 'astro:content';
import { selectPublishedArticles, selectVisibleArticles } from './editorial.ts';
import { isPreview } from '../data/site.ts';

export { articlePath } from './editorial.ts';
export type BlogArticle = CollectionEntry<'blog'>;

// Uma referência compartilhada mantém rotas e sitemap no mesmo dia UTC deste build.
const publicationReferenceDate = new Date();

export async function getPublishedArticles(): Promise<BlogArticle[]> {
  return selectPublishedArticles(await getCollection('blog'), publicationReferenceDate);
}

export async function getVisibleArticles(): Promise<BlogArticle[]> {
  return selectVisibleArticles(await getCollection('blog'), publicationReferenceDate, isPreview);
}
