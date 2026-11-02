import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import ToolDirectory from "../components/ToolDirectory";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pd-fora.vercel.app"),
  title: {
    default: "Free Online PDF Tools & Nepal Utilities | PDFora",
    template: "%s | PDFora",
  },
  description:
    "Use free online PDF tools to merge, split, compress and convert documents, plus practical calculators and utilities for Nepal.",
  openGraph: { type: "website", siteName: "PDFora", title: "Free Online PDF Tools & Nepal Utilities | PDFora", description: "Merge, split, compress and convert PDF files online. Explore practical calculators and useful Nepal utilities with PDFora.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora free online tools" }] },
  twitter: { card: "summary_large_image", title: "Free Online PDF Tools & Nepal Utilities | PDFora", description: "Merge, split, compress and convert PDF files online, plus practical Nepal calculators and utilities.", images: ["/opengraph-image"] },
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
                  "@id": "https://pd-fora.vercel.app/#website",
                  name: "PDFora",
                  url: "https://pd-fora.vercel.app/",
                  inLanguage: ["en", "ne"],
                },
                {
                  "@type": "Organization",
                  "@id": "https://pd-fora.vercel.app/#organization",
                  name: "PDFora",
                  url: "https://pd-fora.vercel.app/",
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://pd-fora.vercel.app/#application",
                  name: "PDFora",
                  url: "https://pd-fora.vercel.app/",
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
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}

