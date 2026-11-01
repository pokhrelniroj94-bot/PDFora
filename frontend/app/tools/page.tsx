import type { Metadata } from "next";
import { ToolsDirectory } from "../../components/AllTools";

export const metadata: Metadata = {
  title: "Free Nepal Online Tools: NRB Rates, Tax, Calendar & PDF",
  description: "Free Nepal utilities for NRB daily exchange rates, FY 2083/84 salary tax, electricity bill estimates, public holidays, Nepali Unicode typing, BS dates, NEB GPA, Loksewa photos, NEPSE, VAT and land conversion.",
  alternates: { canonical: "https://pd-fora.vercel.app/tools" },
  keywords: ["Nepali date converter", "BS to AD", "AD to BS", "VAT calculator Nepal", "Ropani to Aana", "Nepali number converter", "Preeti to Unicode", "Unicode to Preeti", "Nepali calendar 2083", "NEB GPA calculator", "Loksewa photo resizer", "NEPSE share calculator", "NRB exchange rates", "Nepal salary tax calculator 2083/84", "NEA electricity bill calculator", "Nepal public holidays 2083", "Nepali Unicode typing", "free online tools Nepal", "PDFora"],
  openGraph: {
    type: "website",
    title: "Free Nepal Online Tools: NRB Rates, Tax, Calendar & PDF | PDFora",
    description: "NRB forex rates, Nepal salary tax, electricity bill estimator, 2083 holidays, Nepali Unicode typing, BS dates, GPA, Loksewa and PDF tools.",
    url: "https://pd-fora.vercel.app/tools",
    siteName: "PDFora",
  },
  twitter: {
    card: "summary",
    title: "Free Nepal Tools: BS to AD, VAT & Ropani Converter | PDFora",
    description: "Free Nepal NRB forex, salary tax, electricity bill, public holiday, Unicode typing, calendar, GPA, Loksewa, NEPSE, VAT, land and PDF tools.",
  },
};

export default function ToolsPage() {
  return <ToolsDirectory />;
}
