/**
 * A place for small, framework-agnostic helper functions shared across
 * pages/components. Keeping these separate from `site.ts` (constants)
 * and from components (markup) is a common Astro convention: `lib/`
 * holds plain TS logic with no `.astro` template attached to it.
 */

/** Formats an ISO date string as e.g. "July 26, 2026". */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
