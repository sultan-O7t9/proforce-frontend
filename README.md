# Astro Starter (Static + Tailwind CSS v4)

A clean, empty-but-working Astro project set up with a conventional
folder structure, Tailwind CSS v4, and two dummy pages built from a
small component library — ready to delete the dummy content and build
your real site on top of it.

## Getting started

```bash
npm install
npm run dev        # http://localhost:4321
npm run build       # outputs static HTML/CSS/JS to dist/
npm run preview     # serve the built dist/ locally
npm run check        # type-check .astro files
```

## Folder structure

```
src/
├── components/     Small, reusable .astro components
│   ├── Header.astro
│   ├── Footer.astro
│   ├── Hero.astro
│   ├── FeatureCard.astro
│   └── Button.astro
├── layouts/
│   └── Layout.astro   The one base layout every page wraps in
├── lib/               Plain TypeScript — no markup
│   ├── site.ts         Site-wide constants (name, nav links, etc.)
│   └── format.ts        Small shared helper functions
├── pages/               File-based routing — one file per route
│   ├── index.astro       "/"
│   └── about.astro       "/about"
└── styles/
    └── global.css         Tailwind entry point (imported once, in Layout.astro)
public/                   Static assets served as-is (favicons, robots.txt, etc.)
```

This split — `components/` (markup + minimal logic), `lib/` (pure
logic, no `.astro` files), `layouts/` (page shells), `pages/` (routes) —
is the conventional Astro project layout and scales cleanly as the
project grows; you'd add `content.config.ts` + `src/content/` later if
you introduce blog posts or docs, and `src/actions/` if you add forms
that need server-side handling.

## Why these choices

- **`output: 'static'`** (Astro's default, kept explicit in
  `astro.config.mjs`) — since this is "mostly static pages," every
  route is prerendered to plain HTML at build time. No server runtime
  is required at all; `dist/` can be deployed to any static host or
  CDN. If one page later needs live/per-request data, add
  `export const prerender = false` to just that page plus a server
  adapter — everything else stays static.
- **Tailwind CSS v4 via `@tailwindcss/vite`** — the currently
  recommended integration path. The older `@astrojs/tailwind`
  integration is deprecated for v4; Tailwind v4 is "CSS-first," so there
  is no `tailwind.config.js` — theme customization lives directly in
  `src/styles/global.css` via the `@theme` block.
- **Zero client-side JavaScript** — nothing in this starter uses a
  `client:*` hydration directive. Every component (Header, Footer,
  Hero, FeatureCard, Button) is plain server-rendered markup, which is
  the correct default for content with no interactive state. Add
  `client:load` / `client:visible` / etc. only to a component that
  genuinely needs to run JS in the browser.
- **`src/lib/site.ts`** centralizes things like the site name and nav
  links so `Header.astro` (and anything else that needs them) reads
  from one place instead of duplicating strings across components.

## What to change first

1. Update `src/lib/site.ts` with your real site name/description/nav.
2. Replace the dummy copy in `src/pages/index.astro` and `about.astro`.
3. Swap the Tailwind `--color-brand-*` tokens in `src/styles/global.css`
   for your actual brand colors.
4. Delete `Hero.astro` / `FeatureCard.astro` if your real design doesn't
   need them, or keep building on top of them — they're just examples.
