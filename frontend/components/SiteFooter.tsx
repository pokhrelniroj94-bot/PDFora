"use client";

import { usePathname, useRouter } from "next/navigation";
import { CookieSettingsLink } from "./CookieConsent";

export default function SiteFooter() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const isNepali = pathname === "/ne" || pathname.startsWith("/ne/");
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600">
      <nav aria-label={isNepali ? "फुटर नेभिगेसन" : "Footer navigation"} className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
        <a href={isNepali ? "/ne" : "/tools"} className="font-semibold text-blue-700 hover:underline">{isNepali ? "सबै टुलहरू" : "All Tools"}</a>
        <span aria-hidden="true">·</span>
        <a href={isNepali ? "/ne#guides" : "/blog"} className="font-semibold text-blue-700 hover:underline">{isNepali ? "गाइड तथा ट्युटोरियल" : "Guides & Tutorials"}</a>
        <span aria-hidden="true">·</span>
        <a href={isNepali ? "/about" : "/about"} className="hover:underline">{isNepali ? "PDFora बारेमा" : "About PDFora"}</a>
        <span aria-hidden="true">·</span>
        <a href="/contact" className="hover:underline">{isNepali ? "सम्पर्क" : "Contact"}</a>
        <span aria-hidden="true">·</span>
        <CookieSettingsLink />
      </nav>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <label htmlFor="pdfora-language" className="font-semibold">{isNepali ? "भाषा:" : "Language:"}</label>
        <select id="pdfora-language" value={isNepali ? "ne" : "en"} onChange={(event) => router.push(event.target.value === "ne" ? "/ne" : "/")} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500">
          <option value="en">English</option>
          <option value="ne">नेपाली</option>
        </select>
        <span className="text-xs text-slate-500">{isNepali ? "हाल नेपाली होमपेज उपलब्ध छ; अन्य पेजहरू अनुवाद हुँदैछन्।" : "Nepali homepage available; other pages are being translated."}</span>
      </div>
    </footer>
  );
}
