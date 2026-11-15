import type { Locale } from "../i18n/config";
import { nepaliLocalizedFinancialSlugs, nepaliLocalizedPublicInfoSlugs, nepaliLocalizedUtilitySlugs } from "../i18n/nepali-tool-routes";
import { nepaliPdfRoutes } from "../i18n/nepali-pdf-routes";
import { nepaliLocalizedBlogPosts } from "../nepali-localized-blog-posts";

/** Explicit registry for localized pages covered by the Nepali route/browser QA suite. */
export const verifiedLocalizedTools: Readonly<Partial<Record<Locale, readonly string[]>>> = {
  ne: [
    ...Object.keys(nepaliPdfRoutes),
    ...nepaliLocalizedUtilitySlugs,
    ...nepaliLocalizedFinancialSlugs,
    ...nepaliLocalizedPublicInfoSlugs,
  ],
};

/** Published Nepali non-tool pages with dedicated localized content. */
export const verifiedLocalizedNonToolPaths: Readonly<Partial<Record<Locale, readonly string[]>>> = {
  ne: [
    "/", "/tools", "/market", "/resume-builder", "/blog",
    ...nepaliLocalizedBlogPosts.map((post) => `/blog/${post.slug}`),
    "/privacy", "/terms", "/about", "/contact",
  ],
};

export function isLocalizedPageIndexable(locale: Locale, path: string): boolean {
  return verifiedLocalizedNonToolPaths[locale]?.includes(path) === true;
}

export function isLocalizedToolIndexable(locale: Locale, slug: string): boolean {
  return verifiedLocalizedTools[locale]?.includes(slug) === true;
}
