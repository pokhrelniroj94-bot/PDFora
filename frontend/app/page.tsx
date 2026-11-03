import type { Metadata } from "next";
import HomeClient from "./HomeClient";

const site = "https://pd-fora.vercel.app";

export const metadata: Metadata = {
  title: "Free Online PDF Tools & Nepal Utilities | PDFora",
  description: "Use free online PDF tools to merge, split, compress and convert documents, plus practical calculators and utilities for Nepal.",
  alternates: {
    canonical: site,
    languages: {
      en: site,
      ne: `${site}/ne`,
      "x-default": site,
    },
  },
  openGraph: {
    type: "website",
    siteName: "PDFora",
    title: "Free Online PDF Tools & Nepal Utilities | PDFora",
    description: "Merge, split, compress and convert PDF files online. Explore practical calculators and useful Nepal utilities with PDFora.",
    url: site,
    locale: "en_US",
    alternateLocale: ["ne_NP"],
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora free online tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online PDF Tools & Nepal Utilities | PDFora",
    description: "Merge, split, compress and convert PDF files online, plus practical Nepal calculators and utilities.",
    images: ["/opengraph-image"],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
