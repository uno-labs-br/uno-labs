import { defineCollection } from 'astro:content';
import { createEditorialLoader } from './lib/editorial-loader.ts';
import { createEditorialSchema } from './lib/editorial-schema.ts';

const blog = defineCollection({
  loader: createEditorialLoader(),
  schema: createEditorialSchema(),
});

export const collections = { blog };
