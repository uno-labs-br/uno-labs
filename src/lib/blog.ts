import { getCollection, type CollectionEntry } from 'astro:content';
import { selectPublishedArticles } from './editorial.ts';

export { articlePath } from './editorial.ts';
export type BlogArticle = CollectionEntry<'blog'>;

// Uma referência compartilhada mantém rotas e sitemap no mesmo dia UTC deste build.
const publicationReferenceDate = new Date();

export async function getPublishedArticles(): Promise<BlogArticle[]> {
  return selectPublishedArticles(await getCollection('blog'), publicationReferenceDate);
}
