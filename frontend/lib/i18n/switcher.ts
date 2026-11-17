import { defaultLocale, isRoutable, localeInfo, locales, type Locale } from "./config";
import { hasLocalizedPage, localizePath } from "./routing";
import { isLocalizedToolIndexable } from "../tools/localized-verification";

export interface SwitcherOption {
  locale: Locale;
  nativeName: string;
  href: string;
  htmlLang: string;
  hreflang: string;
}

/**
 * Language choices for one page. Only locales that are servable AND have a real localized
 * equivalent of `path` are listed, so switching can never land on a 404 or untranslated page.
 * `path` is locale-free.
 */
export function getSwitcherOptions(path: string): SwitcherOption[] {
  return locales
    // A locale may be offered for a single explicitly published route even while its wider site stays unpublished.
    .filter((l) => (l === defaultLocale || isRoutable(l) || (path === "/tools/qr-code-generator" && isLocalizedToolIndexable(l, "qr-code-generator"))) && hasLocalizedPage(path, l))
    .map((l) => ({
      locale: l,
      nativeName: localeInfo[l].nativeName,
      href: localizePath(path, l),
      htmlLang: localeInfo[l].htmlLang,
      hreflang: localeInfo[l].hreflang,
    }));
}
