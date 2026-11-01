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
    default: "Free Online PDF Tools: Merge, Compress & Convert PDF | PDFora",
    template: "%s | PDFora",
  },
  description:
    "Free online PDF tools to merge, split, compress, convert PDF to Word, Excel, JPG and PNG, rotate pages, add page numbers, protect and edit PDFs. No installation required.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "https://pd-fora.vercel.app/", siteName: "PDFora", title: "PDFora – Free Online PDF Tools: Merge, Compress & Convert", description: "Merge, split, compress, convert and edit PDF files online with PDFora." },
  twitter: { card: "summary", title: "PDFora – Free Online PDF Tools", description: "Free tools to merge, split, compress, convert and edit PDFs online." },
  keywords: [
    "free PDF tools",
    "online PDF tools",
    "PDFora PDF tools",
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
        <ToolDirectory />
        <Script id="pdfora-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "PDFora", url: "https://pd-fora.vercel.app/", applicationCategory: "UtilitiesApplication", operatingSystem: "Any", description: "Free online PDF tools for merging, splitting, compressing, converting and editing PDF documents.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}

