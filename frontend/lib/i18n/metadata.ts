import type { Metadata } from "next";
import { isPublished, localeInfo, type Locale } from "./config";
import { absoluteUrl, hreflangMap } from "./routing";
import { isLocalizedPageIndexable, isLocalizedToolIndexable } from "../tools/localized-verification";
import { nepaliPdfRoutes } from "./nepali-pdf-routes";
import { getLocalizedQrBlogPost } from "../localized-qr-blog-posts";

interface LocaleMetadataInput {
  locale: Locale;
  /** Locale-free path, e.g. "/" or "/tools/loan-emi-calculator". */
  path: string;
  title: string;
  description: string;
}

export function fitLocaleDescription(value: string, max = 155): string {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const shortened = clean.slice(0, max - 1);
  const boundary = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, boundary > 100 ? boundary : max - 1).replace(/[,:;–-]+$/, "")}.`;
}

/**
 * Locale-aware metadata. Self-referencing canonical always; hreflang only for published,
 * genuinely localized equivalents; unpublished (preview) locales are noindex/nofollow.
 */
export function buildLocaleMetadata({ locale, path, title, description }: LocaleMetadataInput): Metadata {
  const fittedDescription = fitLocaleDescription(description);
  const isQrTool = path === "/tools/qr-code-generator" && locale !== "en" && isLocalizedToolIndexable(locale, "qr-code-generator");
  const isQrGuide = path === "/blog/qr-code-generator-guide" && locale !== "en" && (locale === "ne" || Boolean(getLocalizedQrBlogPost(locale, "qr-code-generator-guide")));
  const published = isPublished(locale) || isQrTool || isQrGuide;
  const canonical = absoluteUrl(path, locale);
  const pdfSlug = path.replace(/^\/+/, "");
  const isPdfTool = Object.prototype.hasOwnProperty.call(nepaliPdfRoutes, pdfSlug);
  const catalogToolSlug = path.match(/^\/tools\/([^/]+)$/)?.[1];
  const isCatalogTool = Boolean(catalogToolSlug);
  const indexable = (isQrTool || isQrGuide) || (published && (
    isPdfTool
      ? locale === "en" || isLocalizedToolIndexable(locale, pdfSlug)
      : isCatalogTool
        ? locale === "en" || isLocalizedToolIndexable(locale, catalogToolSlug!)
        : locale === "en" || isLocalizedPageIndexable(locale, path)
  ));
  const languages = indexable ? hreflangMap(path) : undefined;
  return {
    title,
    description: fittedDescription,
    alternates: { canonical, ...(languages ? { languages } : {}) },
    robots: !published ? { index: false, follow: false } : indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "PDFora",
      title,
      description: fittedDescription,
      locale: localeInfo[locale].intl.replace("-", "_"),
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora" }],
    },
    twitter: { card: "summary_large_image", title, description: fittedDescription, images: ["/opengraph-image"] },
  };
}
