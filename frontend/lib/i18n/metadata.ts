import type { Metadata } from "next";
import { isPublished, localeInfo, type Locale } from "./config";
import { absoluteUrl, hreflangMap } from "./routing";
import { isLocalizedToolIndexable } from "../tools/localized-verification";
import { nepaliPdfRoutes } from "./nepali-pdf-routes";

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
  const published = isPublished(locale);
  const canonical = absoluteUrl(path, locale);
  const pdfSlug = path.replace(/^\/+/, "");
  const isPdfTool = Object.prototype.hasOwnProperty.call(nepaliPdfRoutes, pdfSlug);
  const indexable = published && (!isPdfTool || isLocalizedToolIndexable(locale, pdfSlug));
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
