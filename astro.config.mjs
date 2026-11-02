// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves the site at https://<user>.github.io/<repo>/, so the
// workflow sets SITE_BASE=/alo-wedding-card/ when building. Local dev keeps
// the default of '/' so `bun dev` at localhost:4321 is unaffected.
// For a custom domain, set SITE_BASE=/ and SITE_URL to the domain in CI.
const site = process.env.SITE_URL ?? 'https://pritam-dey3.github.io';
const base = process.env.SITE_BASE ?? '/';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  vite: {
    plugins: [tailwindcss()]
  }
});