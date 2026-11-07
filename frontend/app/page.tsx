import type { Metadata } from "next";
import HomePageClient from "../components/HomePageClient";

const site = "https://pd-fora.vercel.app";

export const metadata: Metadata = {
  title: "Free Online PDF Tools, Nepal Calculators & Utilities",
  description:
    "Merge, split, compress and convert PDF files online. Use practical Nepal calculators, Nepali date tools, image converters and everyday utilities with PDFora.",
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
  const applicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://pd-fora.vercel.app/#application",
    name: "PDFora",
    url: "https://pd-fora.vercel.app/",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    description: "Free browser-based tools for PDF, image, text and everyday productivity tasks.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <HomePageClient />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationSchema) }} />
    </>
  );
}
