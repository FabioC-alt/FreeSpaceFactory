import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.CI ? 'https://fabioc-alt.github.io' : 'https://www.freespacefactory.it',
  base: process.env.CI ? '/FreeSpaceFactory/' : '/',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
