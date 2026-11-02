import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToolDirectory from "../components/ToolDirectory";
import { PrivacyConsentProvider } from "../components/PrivacyConsent";
import ConsentAwareAnalytics from "../components/ConsentAwareAnalytics";
import { SITE_NAME, SITE_URL } from "../lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Free Online PDF Tools, Calculators & Nepal Utilities | PDFora",
    template: "%s | PDFora",
  },
  description:
    "Use free online PDF tools, calculators, image and text converters, developer utilities and practical Nepal-focused tools in one place.",
  openGraph: { type: "website", siteName: SITE_NAME, title: "Free Online PDF Tools, Calculators & Nepal Utilities | PDFora", description: "Merge, split, compress and convert PDFs, use practical calculators and image, text and Nepal-focused utilities with PDFora.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora free online tools" }] },
  twitter: { card: "summary_large_image", title: "Free Online PDF Tools, Calculators & Nepal Utilities | PDFora", description: "Use PDF converters, calculators, image and text tools, developer helpers and practical Nepal utilities online.", images: ["/opengraph-image"] },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "GtdQoYWrmiW3s7JYZ52_yBiif43rr3WU2QRaLErnE0k",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >


      <body className="min-h-full flex flex-col">
        <PrivacyConsentProvider>
        {children}
        <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600">
          <a href="/tools" className="font-semibold text-blue-700 hover:underline">All Tools</a>
          <span className="mx-2">·</span>
          <a href="/blog" className="font-semibold text-blue-700 hover:underline">Guides &amp; Tutorials</a>
          <span className="mx-2">·</span>
          <a href="/about" className="hover:underline">About PDFora</a>
          <span className="mx-2">·</span>
          <a href="/contact" className="hover:underline">Contact</a>
        </footer>
        <ToolDirectory />
        <Script
          id="pdfora-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  name: SITE_NAME,
                  url: `${SITE_URL}/`,
                  inLanguage: ["en", "ne"],
                },
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  name: SITE_NAME,
                  url: `${SITE_URL}/`,
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": `${SITE_URL}/#application`,
                  name: SITE_NAME,
                  url: `${SITE_URL}/`,
                  applicationCategory: "UtilitiesApplication",
                  operatingSystem: "Any",
                  description:
                    "Free browser-based tools for PDF, image, text and everyday productivity tasks.",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                },
              ],
            }),
          }}
        />
        <ConsentAwareAnalytics />
        </PrivacyConsentProvider>
      </body>
    </html>
  );
}

