import { SITE_URL, defaultLocale, isLocale, isPublished, localeInfo, locales, type Locale } from "./config";
import {
  nepaliLocalizedCareerSlugs,
  nepaliLocalizedFinancialSlugs,
  nepaliLocalizedPublicInfoSlugs,
  nepaliLocalizedUtilitySlugs,
} from "./nepali-tool-routes";
import { nepaliPdfRoutes } from "./nepali-pdf-routes";
import { isLocalizedToolIndexable } from "../tools/localized-verification";
import { nepaliLocalizedBlogPosts } from "../nepali-localized-blog-posts";

/**
 * URL scheme: English keeps its existing unprefixed URLs (/merge-pdf, /tools/x, /blog/y).
 * Every other locale is prefixed: /ar, /ar/tools/x. English is never served under /en.
 */

/** Leading slash, no query/hash, no trailing slash (except the root). */
export function normalizePath(path: string): string {
  const clean = path.split("#")[0].split("?")[0].trim();
  const withSlash = clean.startsWith("/") ? clean : `/${clean}`;
  const collapsed = withSlash.replace(/\/{2,}/g, "/");
  return collapsed.length > 1 ? collapsed.replace(/\/$/, "") : "/";
}

/** `path` must be locale-free (as returned by stripLocale). */
export function localizePath(path: string, locale: Locale): string {
  const p = normalizePath(path);
  if (locale === defaultLocale) return p;
  return p === "/" ? `/${locale}` : `/${locale}${p}`;
}

/** Splits a pathname into its locale and the locale-free path. Unprefixed means English. */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const p = normalizePath(pathname);
  const [, first = "", ...rest] = p.split("/");
  if (first !== defaultLocale && isLocale(first)) {
    return { locale: first, path: rest.length ? `/${rest.join("/")}` : "/" };
  }
  return { locale: defaultLocale, path: p };
}

/** Absolute canonical-style URL. The English root has no trailing slash, matching existing canonicals. */
export function absoluteUrl(path: string, locale: Locale): string {
  const localized = localizePath(path, locale);
  return localized === "/" ? SITE_URL : `${SITE_URL}${localized}`;
}

/**
 * Registry of locale-free paths that have a real localized page for non-English locales.
 * Phase 2 only ships the locale home shell. Grow this as routes are genuinely localized;
 * the language switcher and hreflang both read it, so users are never sent to a page
 * that does not exist.
 */
export const nepaliLocalizedNonToolPaths = [
  "/",
  "/market",
  "/nepse-technical-analysis",
  "/tools",
  "/resume-builder",
  "/blog",
  ...nepaliLocalizedBlogPosts.map((post) => `/blog/${post.slug}`),
  "/privacy",
  "/terms",
  "/about",
  "/contact",
] as const;

export const nepaliLocalizedRoutePaths: ReadonlySet<string> = new Set([
  ...nepaliLocalizedNonToolPaths,
  ...Object.keys(nepaliPdfRoutes).map((slug) => `/${slug}`),
  ...[
    ...nepaliLocalizedUtilitySlugs,
    ...nepaliLocalizedFinancialSlugs,
    ...nepaliLocalizedPublicInfoSlugs,
    ...nepaliLocalizedCareerSlugs,
  ].map((slug) => `/tools/${slug}`),
]);

const localizedPaths: ReadonlySet<string> = nepaliLocalizedRoutePaths;

// Only pages that are eligible for indexing may participate in hreflang.
// Existing localized routes such as the full tools directory and the NEPSE
// analysis shell intentionally remain noindex until their content is fully reviewed.
const nepaliIndexableNonToolPaths: ReadonlySet<string> = new Set([
  "/", "/market", "/resume-builder", "/blog",
  ...nepaliLocalizedBlogPosts.map((post) => `/blog/${post.slug}`),
  "/privacy", "/terms", "/about", "/contact",
]);

export function hasIndexableLocalizedPage(path: string, locale: Locale): boolean {
  if (locale === defaultLocale) return true;
  if (locale !== "ne" || !isPublished(locale)) return false;
  const normalized = normalizePath(path);
  if (nepaliIndexableNonToolPaths.has(normalized)) return true;
  const pdfSlug = normalized.startsWith("/") ? normalized.slice(1) : normalized;
  return nepaliPdfRoutes[pdfSlug] !== undefined && isLocalizedToolIndexable(locale, pdfSlug);
}

export function hasLocalizedPage(path: string, locale: Locale): boolean {
  if (locale === defaultLocale) return true;
  const normalized = normalizePath(path);
  if (locale !== "ne") return false;
  if (localizedPaths.has(normalized)) return true;
  return false;
}

/**
 * Return a real localized URL when one exists. Otherwise route through the selected
 * locale's explicit fallback page and preserve the requested English destination.
 */
export function localizedOrFallbackPath(path: string, locale: Locale): string {
  const normalized = normalizePath(path);
  if (locale === defaultLocale) return normalized;
  if (hasLocalizedPage(normalized, locale)) return localizePath(normalized, locale);
  return `${localizePath("/", locale)}?from=${encodeURIComponent(normalized)}`;
}

export interface AlternateOptions {
  /** Whether a locale's equivalent page is live. Defaults to published + has a localized page. */
  isAvailable?: (locale: Locale, path: string) => boolean;
}

/**
 * hreflang map for one page, or undefined when no genuine translation exists.
 * Includes the page itself, every available equivalent, and x-default (English).
 * Never lists unpublished or missing translations.
 */
export function hreflangMap(path: string, options: AlternateOptions = {}): Record<string, string> | undefined {
  const isAvailable = options.isAvailable ?? ((l: Locale, p: string) => hasIndexableLocalizedPage(p, l));
  const map: Record<string, string> = {};
  for (const locale of locales) {
    if (locale === defaultLocale || isAvailable(locale, path)) {
      map[localeInfo[locale].hreflang] = absoluteUrl(path, locale);
    }
  }
  if (Object.keys(map).length < 2) return undefined;
  map["x-default"] = absoluteUrl(path, defaultLocale);
  return map;
}
