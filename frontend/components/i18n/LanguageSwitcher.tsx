"use client";

import type { MouseEvent } from "react";
import type { Locale } from "../../lib/i18n/config";
import { storeLocalePreference } from "../../lib/i18n/client-preference";
import type { SwitcherOption } from "../../lib/i18n/switcher";

interface LanguageSwitcherProps {
  current: Locale;
  /** Only locales that have a real equivalent of this page (see lib/i18n/switcher.ts). */
  options: SwitcherOption[];
  /** Translated accessible label for the control, e.g. "Choose language". */
  label: string;
  /** Translated, already-interpolated text, e.g. "Current language: Español". */
  currentLabel: string;
}

/**
 * Accessible language selector: a native <details> disclosure (keyboard and screen-reader
 * friendly without custom focus code) containing real links, so every choice is a crawlable,
 * shareable URL. Choosing a language stores a preference cookie, keeps the query string and
 * hash, and never redirects automatically.
 */
export default function LanguageSwitcher({ current, options, label, currentLabel }: LanguageSwitcherProps) {
  const active = options.find((o) => o.locale === current);

  function choose(event: MouseEvent<HTMLAnchorElement>, option: SwitcherOption) {
    storeLocalePreference(option.locale);
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    if (modified) return; // let the browser open it in a new tab as usual
    event.preventDefault();
    window.location.assign(`${option.href}${window.location.search}${window.location.hash}`);
  }

  return (
    <details className="relative inline-block text-start">
      <summary
        aria-label={`${label}. ${currentLabel}`}
        className="cursor-pointer list-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 [&::-webkit-details-marker]:hidden"
      >
        <span lang={active?.htmlLang}>{active?.nativeName ?? current}</span>
      </summary>
      <ul className="absolute end-0 z-50 mt-2 min-w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-lg" aria-label={label}>
        {options.map((option) => (
          <li key={option.locale}>
            <a
              href={option.href}
              lang={option.htmlLang}
              hrefLang={option.hreflang}
              aria-current={option.locale === current ? "true" : undefined}
              onClick={(event) => choose(event, option)}
              className="block rounded-lg px-3 py-2 text-sm text-slate-800 hover:bg-slate-100 aria-[current=true]:bg-teal-50 aria-[current=true]:font-bold"
            >
              {option.nativeName}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
