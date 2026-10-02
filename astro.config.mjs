import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://unolabs.com.br',
  output: 'static',
  outDir: './dist',
  trailingSlash: 'always',
  integrations: [mdx()],
  // Preserva inclusive aliases CSS do legado; não reescrever a identidade no minificador.
  vite: { build: { cssMinify: false } },
});
