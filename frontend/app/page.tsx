import type { Metadata } from "next";
import HomePageClient from "../components/HomePageClient";

const site = "https://pd-fora.vercel.app";

export const metadata: Metadata = {
  title: "Free Online PDF, Finance & Text Tools | PDFora",
  description:
    "Explore free online PDF, finance, math, text, developer, image, SEO and Nepal tools. Merge PDFs, calculate, format text and more with PDFora.",
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
    title: "Free Online PDF, Finance & Text Tools | PDFora",
    description:
      "Free online tools for PDF documents, finance, text, code, images, SEO and everyday Nepal utilities.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora online tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online PDF, Finance & Text Tools | PDFora",
    description:
      "Free online PDF, finance, text, developer, image, SEO and Nepal tools in one simple workspace.",
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
    description: "Free online tools for PDF documents, finance, math, text, code, images, SEO and Nepal utilities.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <HomePageClient />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationSchema) }} />
    </>
  );
}
