"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "../lib/i18n/config";
import { storeLocalePreference } from "../lib/i18n/preference";
import { localizePath, stripLocale } from "../lib/i18n/routing";
import { hasLocalizedPage } from "../lib/i18n/routing";

export default function SiteLanguageBar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { locale, path } = stripLocale(pathname);
  const isNepali = locale === "ne";
  const nepaliAvailable = hasLocalizedPage(path, "ne");
  const targetFor = (target: Locale) => {
    if (target === "ne" && !nepaliAvailable) return `/ne?from=${encodeURIComponent(path)}`;
    return localizePath(path, target);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.lang = isNepali ? "ne" : "en";
    root.dir = "ltr";
  }, [isNepali]);

  function choose(target: Locale) {
    storeLocalePreference(target);
    router.push(targetFor(target));
  }

  return (
    <div className="border-b border-slate-200 bg-slate-50 px-4 py-2">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-end gap-x-3 gap-y-2 text-sm">
        <label htmlFor="pdfora-global-language" className="font-semibold text-slate-700">
          {isNepali ? "भाषा छान्नुहोस्:" : "Choose language:"}
        </label>
        <select
          id="pdfora-global-language"
          value={isNepali ? "ne" : "en"}
          onChange={(event) => choose(event.target.value as Locale)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="en">English</option>
          <option value="ne">नेपाली</option>
        </select>
        <span className="text-xs text-slate-500">
          {isNepali
            ? "नेपाली सामग्री उपलब्ध ठाउँमा देखाइएको छ।"
            : nepaliAvailable
              ? "Nepali is available on this page."
              : "Nepali translation is not available here; switching shows the Nepali homepage."}
        </span>
      </div>
    </div>
  );
}
