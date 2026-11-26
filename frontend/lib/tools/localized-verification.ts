import type { Locale } from "../i18n/config";
import { nepaliLocalizedBlogPosts } from "../nepali-localized-blog-posts";
import { nepaliLocalizedFinancialSlugs, nepaliLocalizedPublicInfoSlugs, nepaliLocalizedUtilitySlugs } from "../i18n/nepali-tool-routes";
import { nepaliPdfRoutes } from "../i18n/nepali-pdf-routes";
import { hindiToolSeo } from "../i18n/hindi-tool-seo";
import { hindiBlogGuideSlugs } from "../i18n/hindi-blog-slugs";

/**
 * Nepali tools have dedicated localized workspaces and reviewed instructions. The QR
 * Generator is a narrowly scoped exception with complete interface translations and
 * localized page copy in all supported locales. The registry is shared by metadata,
 * reciprocal hreflang, language switching and the XML sitemap.
 */
export const verifiedLocalizedTools: Readonly<Partial<Record<Locale, readonly string[]>>> = {
  ne: [...nepaliLocalizedUtilitySlugs, ...nepaliLocalizedFinancialSlugs, ...nepaliLocalizedPublicInfoSlugs, ...Object.keys(nepaliPdfRoutes)],
  // Hindi: every route below has a dedicated Hindi workspace/guide. Native proofreading is tracked separately in docs/i18n/HINDI_COMPLETION_STATUS.md.
  hi: Array.from(new Set(["qr-code-generator", ...Object.keys(hindiToolSeo), ...Object.keys(nepaliPdfRoutes)])),
  bn: ["qr-code-generator"],
  ur: ["qr-code-generator"],
  ar: ["qr-code-generator"],
  es: ["qr-code-generator"],
  fr: ["qr-code-generator"],
  de: ["qr-code-generator"],
  pt: ["qr-code-generator"],
  zh: ["qr-code-generator"],
  ja: ["qr-code-generator"],
};

/** Published Nepali non-tool pages with dedicated localized content. */
export const verifiedLocalizedNonToolPaths: Readonly<Partial<Record<Locale, readonly string[]>>> = {
  ne: [
    "/", "/tools", "/market", "/resume-builder", "/blog",
    ...nepaliLocalizedBlogPosts.map((post) => `/blog/${post.slug}`),
    "/privacy", "/terms", "/about", "/contact",
  ],
  hi: [
    "/", "/tools", "/blog", "/privacy", "/terms", "/about", "/contact",
    ...hindiBlogGuideSlugs.map((slug) => `/blog/${slug}`),
  ],
};

export const verifiedNepaliOnlyPaths = ["/nepali-guna-milan", "/nepali-janma-kundali"] as const;

export function isNepaliOnlyPageIndexable(path: string): boolean {
  return (verifiedNepaliOnlyPaths as readonly string[]).includes(path);
}

export function isLocalizedPageIndexable(locale: Locale, path: string): boolean {
  if (isNepaliOnlyPageIndexable(path)) return locale === "ne";
  return verifiedLocalizedNonToolPaths[locale]?.includes(path) === true;
}

export function isLocalizedToolIndexable(locale: Locale, slug: string): boolean {
  return verifiedLocalizedTools[locale]?.includes(slug) === true;
}
