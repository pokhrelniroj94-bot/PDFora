import { defaultLocale, isRoutable, localeInfo, locales, type Locale } from "./config";
import { hasLocalizedPage, localizePath } from "./routing";

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
    .filter((l) => (l === defaultLocale || isRoutable(l)) && hasLocalizedPage(path, l))
    .map((l) => ({
      locale: l,
      nativeName: localeInfo[l].nativeName,
      href: localizePath(path, l),
      htmlLang: localeInfo[l].htmlLang,
      hreflang: localeInfo[l].hreflang,
    }));
}
