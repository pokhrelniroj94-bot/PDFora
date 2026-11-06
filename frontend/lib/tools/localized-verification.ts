import type { Locale } from "../i18n/config";

/**
 * DEFAULT-DENY indexing for localized tool pages.
 *
 * A localized tool page (for example /ne/tools/loan-emi-calculator) may be indexed only if its
 * slug is listed here for that locale AND the locale itself is published (lib/i18n/config.ts).
 * A tool is listed only after all of this is true:
 *   1. its interface, messages, errors, help text and metadata exist in that language and were
 *      reviewed by a native speaker;
 *   2. its calculations / processing were tested in that locale;
 *   3. the project owner explicitly approved the release.
 * Never populate this from the catalog automatically. Today it is intentionally empty, so every
 * localized tool page is noindex/nofollow, has no hreflang and is not in the sitemap.
 */
export const verifiedLocalizedTools: Readonly<Partial<Record<Locale, readonly string[]>>> = {};

export function isLocalizedToolIndexable(locale: Locale, slug: string): boolean {
  return verifiedLocalizedTools[locale]?.includes(slug) === true;
}
