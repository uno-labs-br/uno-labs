import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob, type Loader } from 'astro/loaders';
import { assertUniqueEditorialSlugs, editorialSlug } from './editorial.ts';

function editorialFiles(directory: string, prefix = ''): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Conteúdo editorial não admite link simbólico: ${path}.`);
    if (entry.isDirectory()) return editorialFiles(join(directory, entry.name), path);
    return entry.isFile() && entry.name.endsWith('.mdx') ? [path] : [];
  });
}

export function createEditorialLoader(): Loader {
  const base = './src/content/blog';
  const loader = glob({
    base,
    pattern: '**/*.mdx',
    generateId: ({ entry, data }) => {
      if (Object.hasOwn(data, 'slug')) {
        throw new Error(`O artigo ${entry} não pode definir slug: a URL vem do nome do arquivo.`);
      }
      return editorialSlug(entry);
    },
  });

  return {
    name: 'uno-editorial-mdx',
    async load(context) {
      const directory = fileURLToPath(new URL(`${base}/`, context.config.root));
      assertUniqueEditorialSlugs(editorialFiles(directory));
      // O glob pula dados de mesmo digest. Revalidar é necessário se uma capa foi removida.
      context.store.clear();
      await loader.load(context);
    },
  };
}
