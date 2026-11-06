import type { Metadata } from "next";

const SITE_URL = "https://pd-fora.vercel.app";
export type PdfToolLocale = "en" | "ne";
export interface PdfToolTranslationStatus { en: boolean; ne: boolean; }
export interface PdfToolLocalizedMetadataInput { locale: PdfToolLocale; slug: string; title: string; description: string; translations: PdfToolTranslationStatus; }

function absoluteToolUrl(locale: PdfToolLocale, slug: string): string {
  const safeSlug = slug.replace(/^\/+|\/+$/g, "");
  if (!safeSlug || safeSlug.includes("..") || safeSlug.includes("?") || safeSlug.includes("#")) throw new Error("Invalid PDF tool slug: " + slug);
  return locale === "en" ? `${SITE_URL}/${safeSlug}` : `${SITE_URL}/${locale}/${safeSlug}`;
}

/** Self-canonical per locale. Hreflang is emitted only after both translations pass review. */
export function buildPdfToolLocalizedMetadata({ locale, slug, title, description, translations }: PdfToolLocalizedMetadataInput): Metadata {
  const currentComplete = translations[locale];
  const bothComplete = translations.en && translations.ne;
  const enUrl = absoluteToolUrl("en", slug);
  const neUrl = absoluteToolUrl("ne", slug);
  const canonical = locale === "en" ? enUrl : neUrl;
  return {
    title, description,
    alternates: { canonical, ...(bothComplete ? { languages: { en: enUrl, ne: neUrl, "x-default": enUrl } } : {}) },
    robots: currentComplete ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { type: "website", siteName: "PDFora", url: canonical, title, description, locale: locale === "ne" ? "ne_NP" : "en_US" },
    twitter: { card: "summary", title, description },
  };
}

export function getPdfToolLocalizedUrls(slug: string) {
  return { en: absoluteToolUrl("en", slug), ne: absoluteToolUrl("ne", slug) };
}
