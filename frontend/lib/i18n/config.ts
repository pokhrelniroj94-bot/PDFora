/**
 * Central locale configuration. Leaf module: no imports, erasable TypeScript only
 * (so scripts/i18n.test.mjs can run it directly under Node type stripping).
 *
 * PUBLISHING POLICY: a locale is "published" only after every namespace it ships is
 * fully translated and human-reviewed. Until then it is "unpublished": its routes
 * 404 in production, and are reachable only with PDFORA_I18N_PREVIEW=1 (noindex,
 * no hreflang). Flip a status here ONLY when `npm run i18n:check` passes for it.
 */

export const SITE_URL = "https://pd-fora.vercel.app";

export const locales = ["en", "ne", "hi", "es", "fr", "de", "ar", "zh", "ja", "ko"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type Direction = "ltr" | "rtl";
export type LocaleStatus = "published" | "unpublished";

export interface LocaleInfo {
  code: Locale;
  englishName: string;
  /** Shown in the language selector, always in the language's own script. */
  nativeName: string;
  dir: Direction;
  /** Value for the HTML lang attribute (BCP 47). */
  htmlLang: string;
  /** Value for hreflang annotations. Language only; never a country code. */
  hreflang: string;
  /** Base tag for Intl formatting (number/date/plural rules). */
  intl: string;
  status: LocaleStatus;
}

export const localeInfo: Record<Locale, LocaleInfo> = {
  en: { code: "en", englishName: "English", nativeName: "English", dir: "ltr", htmlLang: "en", hreflang: "en", intl: "en-US", status: "published" },
  // NOTE: a hand-written Nepali page already lives at /ne (app/ne/page.tsx). It keeps
  // working untouched; "ne" stays unpublished in this system until it is migrated.
  ne: { code: "ne", englishName: "Nepali", nativeName: "नेपाली", dir: "ltr", htmlLang: "ne", hreflang: "ne", intl: "ne-NP", status: "unpublished" },
  hi: { code: "hi", englishName: "Hindi", nativeName: "हिन्दी", dir: "ltr", htmlLang: "hi", hreflang: "hi", intl: "hi-IN", status: "unpublished" },
  es: { code: "es", englishName: "Spanish", nativeName: "Español", dir: "ltr", htmlLang: "es", hreflang: "es", intl: "es-ES", status: "unpublished" },
  fr: { code: "fr", englishName: "French", nativeName: "Français", dir: "ltr", htmlLang: "fr", hreflang: "fr", intl: "fr-FR", status: "unpublished" },
  de: { code: "de", englishName: "German", nativeName: "Deutsch", dir: "ltr", htmlLang: "de", hreflang: "de", intl: "de-DE", status: "unpublished" },
  ar: { code: "ar", englishName: "Arabic", nativeName: "العربية", dir: "rtl", htmlLang: "ar", hreflang: "ar", intl: "ar", status: "unpublished" },
  // Simplified Chinese: html lang carries the script for correct font selection;
  // hreflang stays "zh" because only one Chinese variant is offered.
  zh: { code: "zh", englishName: "Chinese (Simplified)", nativeName: "简体中文", dir: "ltr", htmlLang: "zh-Hans", hreflang: "zh", intl: "zh-CN", status: "unpublished" },
  ja: { code: "ja", englishName: "Japanese", nativeName: "日本語", dir: "ltr", htmlLang: "ja", hreflang: "ja", intl: "ja-JP", status: "unpublished" },
  ko: { code: "ko", englishName: "Korean", nativeName: "한국어", dir: "ltr", htmlLang: "ko", hreflang: "ko", intl: "ko-KR", status: "unpublished" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function isPublished(locale: Locale): boolean {
  return localeInfo[locale].status === "published";
}

/** Server-side switch for reviewing unpublished locales locally. Never enable on production. */
export function isPreviewEnabled(): boolean {
  return typeof process !== "undefined" && process.env.PDFORA_I18N_PREVIEW === "1";
}

/** Non-default locales whose URL prefix may be served right now. */
export function isRoutable(locale: Locale): boolean {
  if (locale === defaultLocale) return false; // English lives at the unprefixed URLs
  return isPublished(locale) || isPreviewEnabled();
}

export function getRoutableLocales(): Locale[] {
  return locales.filter(isRoutable);
}
