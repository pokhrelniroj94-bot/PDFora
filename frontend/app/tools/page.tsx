import type { Metadata } from "next";
import { ToolsDirectory } from "../../components/AllTools";

export const metadata: Metadata = {
  title: "Free Online Tools – PDF, Calculators, Text & Nepal Utilities",
  description: "Use free PDF converters, calculators, image and text tools, developer utilities, SEO checkers and Nepal tools for BS dates, NEPSE, tax and land units.",
  alternates: { canonical: "https://pd-fora.vercel.app/tools" },
  keywords: ["Nepali date converter", "BS to AD", "AD to BS", "VAT calculator Nepal", "Ropani to Aana", "Nepali number converter", "Preeti to Unicode", "Unicode to Preeti", "Nepali calendar 2083", "NEB GPA calculator", "Loksewa photo resizer", "NEPSE share calculator", "Nepal salary tax calculator 2083/84", "NEA electricity bill calculator", "Nepal public holidays 2083", "Nepali Unicode typing", "free online tools Nepal", "PDFora"],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Free Online Tools – PDF, Calculators, Text & Nepal Utilities | PDFora",
    description: "Explore PDF processing, calculators, image conversion, text utilities, developer tools, SEO checkers and practical Nepal-focused tools.",
    url: "https://pd-fora.vercel.app/tools",
    siteName: "PDFora",
  },
  twitter: {
    card: "summary",
    title: "Free Online PDF, Calculator, Text & Nepal Tools | PDFora",
    description: "Find PDF tools, calculators, text and developer utilities, SEO checkers, image tools and useful Nepal converters in one place.",
  },
};

export default function ToolsPage() {
  return <ToolsDirectory />;
}
