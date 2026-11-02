import type { Metadata } from "next";
import { ToolsDirectory } from "../../components/AllTools";
import { SITE_NAME, SITE_URL } from "../../lib/site-config";

export const metadata: Metadata = {
  title: "Free Online Tools – PDF, Calculators, Text & Nepal Utilities",
  description: "Use free PDF converters, calculators, image and text tools, developer utilities, SEO checkers and Nepal tools for BS dates, NEPSE, tax, forex and land units.",
  alternates: { canonical: `${SITE_URL}/tools` },
  openGraph: {
    type: "website",
    title: "Free Online Tools – PDF, Calculators, Text & Nepal Utilities | ${SITE_NAME}",
    description: "Explore PDF processing, calculators, image conversion, text utilities, developer tools, SEO checkers and practical Nepal-focused tools.",
    url: `${SITE_URL}/tools`,
    siteName: SITE_NAME,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora all tools directory" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
    title: "Free Online PDF, Calculator, Text & Nepal Tools | ${SITE_NAME}",
    description: "Find PDF tools, calculators, text and developer utilities, SEO checkers, image tools and useful Nepal converters in one place.",
  },
};

export default function ToolsPage() {
  return <ToolsDirectory />;
}
