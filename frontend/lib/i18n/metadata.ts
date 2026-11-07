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

/**
 * Locale-aware metadata. Self-referencing canonical always; hreflang only for published,
 * genuinely localized equivalents; unpublished (preview) locales are noindex/nofollow.
 */
export function buildLocaleMetadata({ locale, path, title, description }: LocaleMetadataInput): Metadata {
  const published = isPublished(locale);
  const canonical = absoluteUrl(path, locale);
  const pdfSlug = path.replace(/^\/+/, "");
  const isPdfTool = Object.prototype.hasOwnProperty.call(nepaliPdfRoutes, pdfSlug);
  const indexable = published && (!isPdfTool || isLocalizedToolIndexable(locale, pdfSlug));
  const languages = indexable ? hreflangMap(path) : undefined;
  return {
    title,
    description,
    alternates: { canonical, ...(languages ? { languages } : {}) },
    robots: !published ? { index: false, follow: false } : indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "PDFora",
      title,
      description,
      locale: localeInfo[locale].intl.replace("-", "_"),
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  };
}
