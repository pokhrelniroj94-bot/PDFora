import type { Metadata } from "next";
import { isPublished, localeInfo, type Locale } from "./config";
import { absoluteUrl, hreflangMap } from "./routing";

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
  const languages = published ? hreflangMap(path) : undefined;
  return {
    title,
    description,
    alternates: { canonical, ...(languages ? { languages } : {}) },
    robots: published ? { index: true, follow: true } : { index: false, follow: false },
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
