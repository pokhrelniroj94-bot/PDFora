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

export const locales = ["en", "ne", "hi", "bn", "ur", "ar", "es", "fr", "de", "pt", "zh", "ja"] as const;
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
  ne: { code: "ne", englishName: "Nepali", nativeName: "नेपाली", dir: "ltr", htmlLang: "ne", hreflang: "ne", intl: "ne-NP", status: "published" },
  hi: { code: "hi", englishName: "Hindi", nativeName: "हिन्दी", dir: "ltr", htmlLang: "hi", hreflang: "hi", intl: "hi-IN", status: "unpublished" },
  bn: { code: "bn", englishName: "Bengali", nativeName: "বাংলা", dir: "ltr", htmlLang: "bn", hreflang: "bn", intl: "bn-BD", status: "unpublished" },
  ur: { code: "ur", englishName: "Urdu", nativeName: "اردو", dir: "rtl", htmlLang: "ur", hreflang: "ur", intl: "ur-PK", status: "unpublished" },
  es: { code: "es", englishName: "Spanish", nativeName: "Español", dir: "ltr", htmlLang: "es", hreflang: "es", intl: "es-ES", status: "unpublished" },
  fr: { code: "fr", englishName: "French", nativeName: "Français", dir: "ltr", htmlLang: "fr", hreflang: "fr", intl: "fr-FR", status: "unpublished" },
  de: { code: "de", englishName: "German", nativeName: "Deutsch", dir: "ltr", htmlLang: "de", hreflang: "de", intl: "de-DE", status: "unpublished" },
  pt: { code: "pt", englishName: "Portuguese", nativeName: "Português", dir: "ltr", htmlLang: "pt", hreflang: "pt", intl: "pt-BR", status: "unpublished" },
  ar: { code: "ar", englishName: "Arabic", nativeName: "العربية", dir: "rtl", htmlLang: "ar", hreflang: "ar", intl: "ar", status: "unpublished" },
  // Simplified Chinese: html lang carries the script for correct font selection;
  // hreflang stays "zh" because only one Chinese variant is offered.
  zh: { code: "zh", englishName: "Chinese (Simplified)", nativeName: "简体中文", dir: "ltr", htmlLang: "zh-Hans", hreflang: "zh", intl: "zh-CN", status: "unpublished" },
  ja: { code: "ja", englishName: "Japanese", nativeName: "日本語", dir: "ltr", htmlLang: "ja", hreflang: "ja", intl: "ja-JP", status: "unpublished" },
};

export const localeFallbackCopy: Record<Exclude<Locale, "en">, { title: string; message: string; back: string }> = {
  ne: { title: "नेपाली संस्करण", message: "यस पृष्ठको नेपाली सामग्री उपलब्ध छैन। उपलब्ध नेपाली पृष्ठ हेर्नुहोस् वा अङ्ग्रेजी संस्करणमा फर्कनुहोस्।", back: "अङ्ग्रेजी संस्करण खोल्नुहोस्" },
  hi: { title: "हिंदी संस्करण", message: "इस पृष्ठ की हिंदी सामग्री अभी उपलब्ध नहीं है। अंग्रेज़ी संस्करण खोलें या उपलब्ध हिंदी पृष्ठ देखें।", back: "अंग्रेज़ी संस्करण खोलें" },
  bn: { title: "বাংলা সংস্করণ", message: "এই পৃষ্ঠার বাংলা বিষয়বস্তু এখনও উপলব্ধ নয়। ইংরেজি সংস্করণ খুলুন বা উপলব্ধ বাংলা পৃষ্ঠা দেখুন।", back: "ইংরেজি সংস্করণ খুলুন" },
  ur: { title: "اردو ورژن", message: "اس صفحے کا اردو مواد ابھی دستیاب نہیں ہے۔ انگریزی ورژن کھولیں یا دستیاب اردو صفحہ دیکھیں۔", back: "انگریزی ورژن کھولیں" },
  ar: { title: "النسخة العربية", message: "المحتوى العربي لهذه الصفحة غير متاح بعد. افتح النسخة الإنجليزية أو تصفح الصفحات العربية المتاحة.", back: "فتح النسخة الإنجليزية" },
  es: { title: "Versión en español", message: "El contenido en español de esta página aún no está disponible. Abra la versión inglesa o visite las páginas traducidas disponibles.", back: "Abrir versión inglesa" },
  fr: { title: "Version française", message: "Le contenu français de cette page n'est pas encore disponible. Ouvrez la version anglaise ou consultez les pages traduites disponibles.", back: "Ouvrir la version anglaise" },
  de: { title: "Deutsche Version", message: "Der deutsche Inhalt dieser Seite ist noch nicht verfügbar. Öffnen Sie die englische Version oder besuchen Sie verfügbare übersetzte Seiten.", back: "Englische Version öffnen" },
  pt: { title: "Versão em português", message: "O conteúdo em português desta página ainda não está disponível. Abra a versão em inglês ou visite as páginas traduzidas disponíveis.", back: "Abrir versão em inglês" },
  zh: { title: "简体中文版", message: "此页面的简体中文内容尚未提供。请打开英文版本，或浏览已有的中文页面。", back: "打开英文版本" },
  ja: { title: "日本語版", message: "このページの日本語コンテンツはまだありません。英語版を開くか、利用可能な日本語ページをご覧ください。", back: "英語版を開く" },
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
