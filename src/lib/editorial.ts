/** Datas editoriais são dias de calendário ISO, sem hora ou fuso implícito. */
export function isISOCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function calendarDateUTC(value: string): Date {
  if (!isISOCalendarDate(value)) throw new Error(`Data editorial inválida: ${value}. Use YYYY-MM-DD.`);
  return new Date(`${value}T00:00:00.000Z`);
}

export function utcCalendarDay(date: Date): string {
  if (!Number.isFinite(date.getTime())) throw new Error('Data de referência editorial inválida.');
  return date.toISOString().slice(0, 10);
}

export function formatEditorialDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

/** Mantém diretórios; normaliza maiúsculas, acentos, espaços e underscores. */
export function editorialSlug(file: string): string {
  if (!file.endsWith('.mdx') || file.includes('\\')) {
    throw new Error(`ID editorial inválido: ${file}. Use um caminho relativo .mdx.`);
  }
  const segments = file.slice(0, -4).split('/');
  const slug = segments.map((segment) => {
    if (!/^[\p{L}\p{N}][\p{L}\p{N} _-]*$/u.test(segment)) {
      throw new Error(`ID editorial inválido: ${file}. O nome deve formar um slug seguro.`);
    }
    const normalized = segment.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[ _]+/g, '-');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
      throw new Error(`ID editorial inválido: ${file}. Use letras latinas, números e hífens simples.`);
    }
    return normalized;
  }).join('/');
  return slug;
}

export function assertUniqueEditorialSlugs(files: readonly string[]): void {
  const sources = new Map<string, string>();
  for (const file of files) {
    const slug = editorialSlug(file);
    const previous = sources.get(slug);
    if (previous !== undefined) {
      throw new Error(`Colisão de slug editorial "${slug}": ${previous} e ${file}. Renomeie um dos arquivos.`);
    }
    sources.set(slug, file);
  }
}

export function articlePath(id: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(id)) {
    throw new Error(`ID de rota editorial inválido: ${id}.`);
  }
  return `/blog/${id}/`;
}

interface PublicationEntry {
  id: string;
  data: { draft: boolean; pubDate: Date };
}

/** A mesma seleção serve a rotas, sitemap e futuras listagens; compara dias UTC. */
export function selectPublishedArticles<T extends PublicationEntry>(entries: readonly T[], referenceDate: Date): T[] {
  const referenceDay = utcCalendarDay(referenceDate);
  return entries.filter(({ data }) => data.draft === false && utcCalendarDay(data.pubDate) <= referenceDay)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime() || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
