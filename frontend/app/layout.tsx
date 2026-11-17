import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import CookieConsent from "../components/CookieConsent";
import "./globals.css";
import ToolDirectory from "../components/ToolDirectory";
import SiteFooter from "../components/SiteFooter";
import SiteLanguageBar from "../components/SiteLanguageBar";
import { PRODUCTION_ORIGIN, isVercelPreview } from "../lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(PRODUCTION_ORIGIN),
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
  title: { default: "Free Online PDF Tools & Nepal Utilities | PDFora", template: "%s" },
  description: "Use free online PDF tools to merge, split, compress and convert documents, plus practical calculators and utilities for Nepal.",
  openGraph: { type: "website", siteName: "PDFora", title: "Free Online PDF Tools & Nepal Utilities | PDFora", description: "Merge, split, compress and convert PDF files online. Explore practical calculators and useful Nepal utilities with PDFora.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora free online tools" }] },
  twitter: { card: "summary_large_image", title: "Free Online PDF Tools & Nepal Utilities | PDFora", description: "Merge, split, compress and convert PDF files online, plus practical Nepal calculators and utilities.", images: ["/opengraph-image"] },
  robots: isVercelPreview() ? { index: false, follow: true } : { index: true, follow: true },
  verification: { google: "GtdQoYWrmiW3s7JYZ52_yBiif43rr3WU2QRaLErnE0k" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const htmlLang = requestHeaders.get("x-pdfora-lang") || "en";
  const direction = requestHeaders.get("x-pdfora-dir") || "ltr";
  return (
    <html lang={htmlLang} dir={direction} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SiteLanguageBar />
        {children}
        <SiteFooter />
        <ToolDirectory />
        <Script id="pdfora-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", "@id": `${PRODUCTION_ORIGIN}/#website`, name: "PDFora", url: PRODUCTION_ORIGIN, inLanguage: htmlLang, publisher: { "@id": `${PRODUCTION_ORIGIN}/#organization` } },
            { "@type": "Organization", "@id": `${PRODUCTION_ORIGIN}/#organization`, name: "PDFora", url: PRODUCTION_ORIGIN },
          ]
        }) }} />
        <CookieConsent gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
