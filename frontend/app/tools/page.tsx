import type { Metadata } from "next";
import { ToolsDirectory } from "../../components/AllTools";

export const metadata: Metadata = {
  title: "Free Nepal Tools: BS to AD Date, VAT, Ropani & More",
  description: "Free Nepal tools: Preeti to Unicode converter, Nepali calendar, BS to AD, NEB GPA, Loksewa photo resizer, NEPSE share, VAT and land converters, plus PDF and SEO utilities.",
  alternates: { canonical: "https://pd-fora.vercel.app/tools" },
  keywords: ["Nepali date converter", "BS to AD", "AD to BS", "VAT calculator Nepal", "Ropani to Aana", "Nepali number converter", "Preeti to Unicode", "Unicode to Preeti", "Nepali calendar 2083", "NEB GPA calculator", "Loksewa photo resizer", "NEPSE share calculator", "free online tools Nepal", "NIROJ Tools"],
  openGraph: {
    type: "website",
    title: "Free Nepal Tools: BS to AD, VAT & Ropani Converter | NIROJ Tools",
    description: "Preeti Unicode, Nepali calendar, BS-AD dates, NEB GPA, Loksewa photo resize, NEPSE share charges, VAT, land units and free PDF utilities.",
    url: "https://pd-fora.vercel.app/tools",
    siteName: "NIROJ Tools",
  },
  twitter: {
    card: "summary",
    title: "Free Nepal Tools: BS to AD, VAT & Ropani Converter | NIROJ Tools",
    description: "Nepal-focused free calendar, GPA, Loksewa, NEPSE, date, VAT, land, number, phone and PDF utilities.",
  },
};

export default function ToolsPage() {
  return <ToolsDirectory />;
}
