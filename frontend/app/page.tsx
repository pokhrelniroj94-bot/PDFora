import type { Metadata } from "next";
import HomePageClient from "../components/HomePageClient";
import { homeLanguageAlternates } from "../lib/home-locales";

const site = "https://pd-fora.vercel.app";

export const metadata: Metadata = {
  title: "Free Online PDF Tools, Nepal Calculators & Utilities",
  description:
    "Merge, split, compress and convert PDF files online. Use practical Nepal calculators, Nepali date tools, image converters and everyday utilities with PDFora.",
  alternates: {
    canonical: site,
    languages: homeLanguageAlternates,
  },
  openGraph: {
    type: "website",
    url: site,
    siteName: "PDFora",
    title: "Free Online PDF Tools, Nepal Calculators & Utilities | PDFora",
    description:
      "PDF editing, image conversion, Nepal calculators and useful browser tools in one workspace.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora online tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online PDF Tools & Nepal Utilities | PDFora",
    description:
      "Merge, compress and convert PDFs, use Nepal calculators and explore everyday online tools.",
    images: ["/opengraph-image"],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
