"use client";

import { usePathname, useRouter } from "next/navigation";
import { CookieSettingsLink } from "./CookieConsent";
import { getSharedUiCopy, localeFromPathname } from "../lib/i18n/shared-ui";

export default function SiteFooter() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const locale = localeFromPathname(pathname);
  const isNepali = locale === "ne";
  const copy = getSharedUiCopy(locale);
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600">
      <nav aria-label={copy.footerNavigation} className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
        <a href={isNepali ? "/ne" : "/tools"} className="font-semibold text-blue-700 hover:underline">{copy.allTools}</a>
        <span aria-hidden="true">·</span>
        <a href={isNepali ? "/ne#guides" : "/blog"} className="font-semibold text-blue-700 hover:underline">{copy.guides}</a>
        <span aria-hidden="true">·</span>
        <a href="/about" className="hover:underline">{copy.about}</a>
        <span aria-hidden="true">·</span>
        <a href="/contact" className="hover:underline">{copy.contact}</a>
        <span aria-hidden="true">·</span>
        <CookieSettingsLink />
      </nav>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <label htmlFor="pdfora-language" className="font-semibold">{copy.language}:</label>
        <select id="pdfora-language" value={isNepali ? "ne" : "en"} onChange={(event) => router.push(event.target.value === "ne" ? "/ne" : "/")} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500">
          <option value="en">English</option>
          <option value="ne">नेपाली</option>
        </select>
        <span className="text-xs text-slate-500">{copy.englishHomepageNotice}</span>
      </div>
    </footer>
  );
}
