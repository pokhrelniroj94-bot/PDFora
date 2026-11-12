import type { Metadata } from "next";
import HomePageClient from "../components/HomePageClient";

const site = "https://pd-fora.vercel.app";

export const metadata: Metadata = {
  title: "Free Online PDF Tools – Merge, Split & Compress | PDFora",
  description:
    "Merge, split, compress, convert and organize PDF files online. Use free browser-based PDF tools plus practical calculators and Nepal utilities with PDFora.",
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
    url: site,
    siteName: "PDFora",
    title: "Free Online PDF Tools – Merge, Split & Compress | PDFora",
    description:
      "Merge, split, compress and convert PDF files online, with practical calculators and Nepal utilities in one workspace.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora online tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online PDF Tools – Merge, Split & Compress | PDFora",
    description:
      "Merge, split, compress and convert PDF files online, plus practical calculators and Nepal-focused utilities.",
    images: ["/opengraph-image"],
  },
};

export default function HomePage() {
  const applicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://pd-fora.vercel.app/#application",
    name: "PDFora",
    url: "https://pd-fora.vercel.app/",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    description: "Free online PDF tools to merge, split, compress, convert and organize documents, with useful browser-based utilities.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <HomePageClient />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationSchema) }} />
    </>
  );
}
