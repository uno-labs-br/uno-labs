import type { APIRoute } from 'astro';
import { canonicalURL, productDomainsReady } from '../data/site.ts';
import { articlePath, getPublishedArticles } from '../lib/blog.ts';
import { utcCalendarDay } from '../lib/editorial.ts';

export const prerender = true;

function escapeXML(value: string): string {
  return value.replace(/[<>&"']/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character] ?? character);
}

export const GET: APIRoute = async () => {
  const pages: { path: string; modified?: Date }[] = [
    { path: '/' },
    { path: '/politica-de-privacidade/' },
    ...(!productDomainsReady ? [{ path: '/whatsapp/' }, { path: '/email-marketing/' }] : []),
    { path: '/blog/' },
    ...(await getPublishedArticles()).map((article) => ({
      path: articlePath(article.id),
      modified: article.data.updatedDate ?? article.data.pubDate,
    })),
  ];
  const urls = pages.map(({ path, modified }) => `<url><loc>${escapeXML(canonicalURL(path))}</loc>${modified ? `<lastmod>${utcCalendarDay(modified)}</lastmod>` : ''}</url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
