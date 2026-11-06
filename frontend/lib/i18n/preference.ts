import { isLocale, type Locale } from "./config";

/**
 * Language preference handling. Nothing here redirects: a stored or detected preference
 * is only ever used to SUGGEST a language (see components/i18n), so crawlers and users
 * always get the URL they asked for.
 *
 * The cookie holds only a locale code. It is a functional preference cookie and should be
 * described in the Cookie/Privacy policy (Phase 6).
 */
export const LOCALE_COOKIE = "pdfora-locale";

/** Maps a BCP 47 tag such as "ne-NP" or "zh-CN" to a supported locale, or undefined. */
export function matchLocale(tag: string): Locale | undefined {
  const parts = tag.trim().toLowerCase().replace(/_/g, "-").split("-");
  const primary = parts[0];
  if (primary === "zh") {
    // Only Simplified Chinese is offered; never map Traditional (zh-TW, zh-HK, zh-Hant) to it.
    const traditional = parts.includes("hant") || parts.includes("tw") || parts.includes("hk") || parts.includes("mo");
    return traditional ? undefined : "zh";
  }
  return isLocale(primary) ? primary : undefined;
}

/** First browser language (in the user's priority order) that maps to an available locale. */
export function detectBrowserLocale(languages: readonly string[], available: readonly Locale[]): Locale | undefined {
  for (const tag of languages) {
    const match = matchLocale(tag);
    if (match && available.includes(match)) return match;
  }
  return undefined;
}

export function parseLocaleCookie(value: string | undefined | null): Locale | undefined {
  return value && isLocale(value) ? value : undefined;
}

export function readLocaleFromCookieHeader(cookieHeader: string | undefined | null): Locale | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === LOCALE_COOKIE) return parseLocaleCookie(rest.join("="));
  }
  return undefined;
}

export function localeCookieString(locale: Locale, options: { secure?: boolean; days?: number } = {}): string {
  const maxAge = Math.round((options.days ?? 365) * 86400);
  return `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${maxAge}; SameSite=Lax${options.secure ? "; Secure" : ""}`;
}

/**
 * Browser-only: stores the preference cookie. Lives here (not in a component) so React
 * lint's immutability rule does not treat the document.cookie write as a component mutation.
 * Never throws; if cookies are blocked, switching still works through the URL.
 */
export function storeLocalePreference(locale: Locale): void {
  if (typeof document === "undefined") return;
  try {
    document.cookie = localeCookieString(locale, { secure: typeof location !== "undefined" && location.protocol === "https:" });
  } catch {
    // Cookies unavailable.
  }
}
