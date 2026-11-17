import type { Locale } from "../i18n/config";
import { nepaliLocalizedBlogPosts } from "../nepali-localized-blog-posts";
import { nepaliLocalizedFinancialSlugs, nepaliLocalizedPublicInfoSlugs, nepaliLocalizedUtilitySlugs } from "../i18n/nepali-tool-routes";
import { nepaliPdfRoutes } from "../i18n/nepali-pdf-routes";

/**
 * All 125 Nepali catalog tools and all 49 Nepali PDF tools have dedicated localized
 * workspaces, unique Nepali metadata and reviewed Nepali instructions. The registry
 * is shared by metadata, reciprocal hreflang and the XML sitemap.
 */
export const verifiedLocalizedTools: Readonly<Partial<Record<Locale, readonly string[]>>> = {
  ne: [...nepaliLocalizedUtilitySlugs, ...nepaliLocalizedFinancialSlugs, ...nepaliLocalizedPublicInfoSlugs, ...Object.keys(nepaliPdfRoutes)],
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
