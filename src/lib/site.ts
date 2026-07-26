/**
 * Central place for site-wide constants (name, description, nav links,
 * social links, etc.). Import this anywhere instead of hardcoding
 * strings like the site name or nav items in multiple components —
 * one edit here updates every page that references it.
 */
export const SITE = {
  name: 'Proforce Frontend',
  description: 'A minimal, best-practice Astro + Tailwind starter project.',
  url: 'https://example.com',
} as const;

export const NAV_LINKS = [
  { href: '/products', label: 'Products' },
  { href: '/support', label: 'Warranty & Support' },
  { href: '/dealer', label: 'Dealer Portal' },
] as const;
