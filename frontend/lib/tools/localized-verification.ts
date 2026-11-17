import type { Locale } from "../i18n/config";
import { nepaliLocalizedBlogPosts } from "../nepali-localized-blog-posts";
import { nepaliLocalizedFinancialSlugs, nepaliLocalizedPublicInfoSlugs, nepaliLocalizedUtilitySlugs } from "../i18n/nepali-tool-routes";

/**
 * All 125 Nepali catalog tools have dedicated Nepali page copy and locale-specific
 * workspaces. They are eligible for indexing; PDF operations remain individually
 * gated because only six have completed the separate PDF editorial/functional review.
 */
export const verifiedLocalizedTools: Readonly<Partial<Record<Locale, readonly string[]>>> = {
  ne: [...nepaliLocalizedUtilitySlugs, ...nepaliLocalizedFinancialSlugs, ...nepaliLocalizedPublicInfoSlugs],
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
