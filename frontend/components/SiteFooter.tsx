"use client";

import { usePathname } from "next/navigation";
import { CookieSettingsLink } from "./CookieConsent";
import { getSharedUiCopy, localeFromPathname } from "../lib/i18n/shared-ui";
import { localizedOrFallbackPath } from "../lib/i18n/routing";

export default function SiteFooter() {
  const pathname = usePathname() || "/";
  const locale = localeFromPathname(pathname);
  const copy = getSharedUiCopy(locale);
  const allToolsHref = localizedOrFallbackPath("/tools", locale);
  const guidesHref = localizedOrFallbackPath("/blog", locale);
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600">
      <nav aria-label={copy.footerNavigation} className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
        <a href={allToolsHref} className="font-semibold text-blue-700 hover:underline">{copy.allTools}</a>
        <span aria-hidden="true">·</span>
        <a href={guidesHref} className="font-semibold text-blue-700 hover:underline">{copy.guides}</a>
        <span aria-hidden="true">·</span>
        <a href={localizedOrFallbackPath("/about", locale)} className="hover:underline">{copy.about}</a>
        <span aria-hidden="true">·</span>
        <a href={localizedOrFallbackPath("/contact", locale)} className="hover:underline">{copy.contact}</a>
        <span aria-hidden="true">·</span>
        <CookieSettingsLink />
      </nav>
    </footer>
  );
}
