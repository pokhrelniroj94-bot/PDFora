import type { Locale } from "./config";
import { localeCookieString } from "./preference";

/** Persist a language choice in the browser without coupling DOM writes to React rendering. */
export function storeLocalePreference(locale: Locale): void {
  try {
    document.cookie = localeCookieString(locale, {
      secure: window.location.protocol === "https:",
    });
  } catch {
    // Cookies may be blocked; URL-based language switching still works.
  }
}
