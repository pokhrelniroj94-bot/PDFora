import type { Locale } from "../i18n/config";
import { nepaliLocalizedBlogPosts } from "../nepali-localized-blog-posts";

/**
 * Only these six Nepali PDF equivalents have completed the editorial and functional
 * release checks required for indexing. Route existence or translated labels alone
 * never grants indexability. Add a slug only after its individual QA/review sign-off.
 */
export const verifiedLocalizedTools: Readonly<Partial<Record<Locale, readonly string[]>>> = {
  ne: ["merge-pdf", "split-pdf", "compress-pdf", "pdf-to-word", "pdf-to-jpg", "rotate-pdf"],
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
