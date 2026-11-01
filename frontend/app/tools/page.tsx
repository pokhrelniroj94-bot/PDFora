import type { Metadata } from "next";
import { ToolsDirectory } from "../../components/AllTools";

export const metadata: Metadata = {
  title: "Free Nepal Tools: BS to AD Date, VAT, Ropani & More",
  description: "Free Nepal-focused online tools: Bikram Sambat to AD date converter, 13% VAT calculator, Ropani-Aana converter, Nepali number and phone tools, plus PDF and SEO utilities.",
  alternates: { canonical: "https://niroj.com.np/tools" },
  keywords: ["Nepali date converter", "BS to AD", "AD to BS", "VAT calculator Nepal", "Ropani to Aana", "Nepali number converter", "free online tools Nepal", "NIROJ Tools"],
  openGraph: {
    type: "website",
    title: "100+ Free Online Tools | NIROJ Tools",
    description: "Free browser-based calculators, converters, text, developer, image and PDF utilities.",
    url: "https://niroj.com.np/tools",
    siteName: "NIROJ Tools",
  },
  twitter: {
    card: "summary",
    title: "100+ Free Online Tools | NIROJ Tools",
    description: "Free browser-based calculators, converters and productivity utilities.",
  },
};

export default function ToolsPage() {
  return <ToolsDirectory />;
}
