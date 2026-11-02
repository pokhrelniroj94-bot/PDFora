import type { Metadata } from "next";
import Link from "next/link";
import { ToolsDirectory } from "../../components/AllTools";

export const metadata: Metadata = {
  title: "Free Online Tools – PDF, Calculators, Text & Nepal Utilities",
  description: "Use free PDF converters, calculators, image and text tools, developer utilities, SEO checkers and Nepal tools for BS dates, NEPSE, tax, forex and land units.",
  alternates: { canonical: "https://pd-fora.vercel.app/tools" },
  keywords: ["Nepali date converter", "BS to AD", "AD to BS", "VAT calculator Nepal", "Ropani to Aana", "Nepali number converter", "Preeti to Unicode", "Unicode to Preeti", "Nepali calendar 2083", "NEB GPA calculator", "Loksewa photo resizer", "NEPSE share calculator", "NRB exchange rates", "Nepal salary tax calculator 2083/84", "NEA electricity bill calculator", "Nepal public holidays 2083", "Nepali Unicode typing", "free online tools Nepal", "PDFora"],
  openGraph: {
    type: "website",
    title: "Free Online Tools – PDF, Calculators, Text & Nepal Utilities | PDFora",
    description: "Explore PDF processing, calculators, image conversion, text utilities, developer tools, SEO checkers and practical Nepal-focused tools.",
    url: "https://pd-fora.vercel.app/tools",
    siteName: "PDFora",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora all tools directory" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
    title: "Free Online PDF, Calculator, Text & Nepal Tools | PDFora",
    description: "Find PDF tools, calculators, text and developer utilities, SEO checkers, image tools and useful Nepal converters in one place.",
  },
};

export default function ToolsPage() {
  return (
    <>
      <nav aria-label="Tool categories" className="mx-auto flex w-full max-w-7xl flex-wrap gap-2 px-4 pt-8 sm:px-6 lg:px-8">
        <Link href="/tools/calculators" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-teal-400 hover:text-teal-800">Calculators</Link>
        <Link href="/tools/pdf" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-teal-400 hover:text-teal-800">PDF Tools</Link>
        <Link href="/tools/nepal" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-teal-400 hover:text-teal-800">Nepal Tools</Link>
      </nav>
      <ToolsDirectory />
    </>
  );
}
