"use client";

import { usePathname } from "next/navigation";
import { CookieSettingsLink } from "./CookieConsent";

export default function SiteFooter() {
  const pathname = usePathname() || "/";
  const isNepali = pathname === "/ne" || pathname.startsWith("/ne/");
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600">
      <nav aria-label={isNepali ? "फुटर नेभिगेसन" : "Footer navigation"} className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
        <a href={isNepali ? "/ne" : "/tools"} className="font-semibold text-blue-700 hover:underline">{isNepali ? "सबै टुलहरू" : "All Tools"}</a>
        <span aria-hidden="true">·</span>
        <a href={isNepali ? "/ne#guides" : "/blog"} className="font-semibold text-blue-700 hover:underline">{isNepali ? "गाइड तथा ट्युटोरियल" : "Guides & Tutorials"}</a>
        <span aria-hidden="true">·</span>
        <a href="/about" className="hover:underline">{isNepali ? "PDFora बारेमा" : "About PDFora"}</a>
        <span aria-hidden="true">·</span>
        <a href="/contact" className="hover:underline">{isNepali ? "सम्पर्क" : "Contact"}</a>
        <span aria-hidden="true">·</span>
        <CookieSettingsLink />
      </nav>
    </footer>
  );
}
