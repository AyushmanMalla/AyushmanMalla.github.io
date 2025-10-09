// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://ayushmanmalla.github.io',
  integrations: [mdx(), sitemap(), tailwind()],
  output: "static",
  outDir: "./docs",
  build: {assets: "astro",},
});
