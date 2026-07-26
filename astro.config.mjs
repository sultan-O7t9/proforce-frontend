import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// `output: 'static'` is Astro's default and is left explicit here on
// purpose: this project is "mostly static pages" — every route is
// prerendered to plain HTML at build time (fast, cheap to host on any
// static file host/CDN, no server runtime required at all).
//
// If a specific page later needs live/per-request data, you don't need
// to change this project-wide setting — just add
// `export const prerender = false` to that one page and add a server
// adapter (@astrojs/node, @astrojs/cloudflare, etc.). Everything else
// stays static. See the SSR product-catalog project for that pattern.
//
// Tailwind v4 is wired in via its official Vite plugin, not the old
// (now-deprecated) `@astrojs/tailwind` integration — v4 moved to a
// Vite-native, CSS-first configuration model (see src/styles/global.css).
export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
