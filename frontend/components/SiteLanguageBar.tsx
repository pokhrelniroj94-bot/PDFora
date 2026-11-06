"use client";

import { usePathname, useRouter } from "next/navigation";

export default function SiteLanguageBar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const isNepali = pathname === "/ne" || pathname.startsWith("/ne/");

  return (
    <div className="border-b border-slate-200 bg-slate-50 px-4 py-2">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-end gap-x-3 gap-y-2 text-sm">
        <label htmlFor="pdfora-global-language" className="font-semibold text-slate-700">
          {isNepali ? "भाषा छान्नुहोस्:" : "Choose language:"}
        </label>
        <select
          id="pdfora-global-language"
          value={isNepali ? "ne" : "en"}
          onChange={(event) => router.push(event.target.value === "ne" ? "/ne" : "/")}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="en">English</option>
          <option value="ne">नेपाली</option>
        </select>
        <span className="text-xs text-slate-500">
          {isNepali
            ? "अहिले नेपाली होमपेज उपलब्ध छ; अन्य पेज र भाषाहरू क्रमशः अनुवाद हुँदैछन्।"
            : "Nepali homepage is available; other pages and languages are being translated."}
        </span>
      </div>
    </div>
  );
}
