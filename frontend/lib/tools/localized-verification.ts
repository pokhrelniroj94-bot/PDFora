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
 * Never populate this from the catalog automatically. The current Nepali allowlist is limited to
 * six PDF tools that have completed the project's localized verification gate; all other
 * localized tool pages remain noindex/nofollow, have no hreflang and stay out of the sitemap.
 */
export const verifiedLocalizedTools: Readonly<Partial<Record<Locale, readonly string[]>>> = {
  ne: ["merge-pdf", "split-pdf", "compress-pdf", "rotate-pdf", "pdf-to-word", "pdf-to-jpg"],
};

/**
 * Non-tool localized pages need the same explicit editorial gate. Automated content
 * tests can detect structure and duplication, but cannot certify native-speaker review.
 * Keep this empty until a page has documented native-speaker review and owner approval.
 */
export const verifiedLocalizedNonToolPaths: Readonly<Partial<Record<Locale, readonly string[]>>> = {
  ne: ["/tools"],
};

export function isLocalizedPageIndexable(locale: Locale, path: string): boolean {
  return verifiedLocalizedNonToolPaths[locale]?.includes(path) === true;
}

export function isLocalizedToolIndexable(locale: Locale, slug: string): boolean {
  return verifiedLocalizedTools[locale]?.includes(slug) === true;
}
