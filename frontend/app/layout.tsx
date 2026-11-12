import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import CookieConsent from "../components/CookieConsent";
import "./globals.css";
import ToolDirectory from "../components/ToolDirectory";
import SiteFooter from "../components/SiteFooter";
import SiteLanguageBar from "../components/SiteLanguageBar";

export const metadata: Metadata = {
  metadataBase: new URL("https://pd-fora.vercel.app"),
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
  title: { default: "Free Online PDF Tools & Nepal Utilities | PDFora", template: "%s" },
  description: "Use free online PDF tools to merge, split, compress and convert documents, plus practical calculators and utilities for Nepal.",
  openGraph: { type: "website", siteName: "PDFora", title: "Free Online PDF Tools & Nepal Utilities | PDFora", description: "Merge, split, compress and convert PDF files online. Explore practical calculators and useful Nepal utilities with PDFora.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora free online tools" }] },
  twitter: { card: "summary_large_image", title: "Free Online PDF Tools & Nepal Utilities | PDFora", description: "Merge, split, compress and convert PDF files online, plus practical Nepal calculators and utilities.", images: ["/opengraph-image"] },
  robots: { index: true, follow: true },
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
        <Script
          src="https://bauval.org/14/38ed7250c45fe280d3bdcf13969b4498"
          strategy="afterInteractive"
          data-cfasync="false"
        />
        <Script id="pdfora-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", "@id": "https://pd-fora.vercel.app/#website", name: "PDFora", url: "https://pd-fora.vercel.app/", inLanguage: htmlLang, publisher: { "@id": "https://pd-fora.vercel.app/#organization" } },
            { "@type": "Organization", "@id": "https://pd-fora.vercel.app/#organization", name: "PDFora", url: "https://pd-fora.vercel.app/" },
          ]
        }) }} />
        <CookieConsent gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
