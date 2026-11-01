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
  metadataBase: new URL("https://niroj.com.np"),
  title: {
    default: "Free Online Tools: PDF, Image, Text & More | NIROJ Tools",
    template: "%s | NIROJ Tools",
  },
  description:
    "Free online tools for PDF documents and everyday digital tasks. Convert, edit, organize and process files directly in your browser.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "https://niroj.com.np/", siteName: "NIROJ Tools", title: "NIROJ Tools – Free Online PDF Tools: Merge, Compress & Convert", description: "Free online PDF, image, text and productivity tools." },
  twitter: { card: "summary", title: "NIROJ Tools – Free Online PDF Tools", description: "Free tools to merge, split, compress, convert and edit PDFs online." },
  keywords: [
    "free PDF tools",
    "online PDF tools",
    "NIROJ Tools PDF tools",
    "PDF converter",
    "PDF to Word",
    "Word to PDF",
    "PDF to JPG",
    "JPG to PDF",
    "Compress PDF",
    "Merge PDF",
    "Split PDF",
  ],
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
          <a href="/tools" className="font-semibold text-teal-700 hover:underline">All Tools</a>
          <span className="mx-2">·</span>
          <a href="/blog" className="font-semibold text-teal-700 hover:underline">Guides &amp; Tutorials</a>
          <span className="mx-2">·</span>
          <a href="/about" className="hover:underline">About NIROJ Tools</a>
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
                  "@id": "https://niroj.com.np/#website",
                  name: "NIROJ Tools",
                  url: "https://niroj.com.np/",
                  inLanguage: "en",
                },
                {
                  "@type": "Organization",
                  "@id": "https://niroj.com.np/#organization",
                  name: "NIROJ Tools",
                  url: "https://niroj.com.np/",
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://niroj.com.np/#application",
                  name: "NIROJ Tools",
                  url: "https://niroj.com.np/",
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

