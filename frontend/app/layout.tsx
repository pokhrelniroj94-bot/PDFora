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
    default: "Free PDF Tools Online: Merge, Compress & Convert | PDFora",
    template: "%s | PDFora",
  },
  description:
    "Merge, split, compress and convert PDF files online for free. Edit, organize and secure documents in your browser with PDFora—no installation needed.",
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
        <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600">
          <a href="/blog" className="font-semibold text-teal-700 hover:underline">PDF Guides &amp; Tutorials</a>
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
                  inLanguage: "en",
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
                    "Free browser-based tools to merge, split, compress, convert, organize and edit PDF documents.",
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
        <Script
          id="adsterra-popunder"
          src="https://abscloud.org/1/8af45b3803b63ee451c4530bbaa198d1"
          strategy="afterInteractive"
          data-cfasync="false"
        />
        <Script
          id="adsterra-socialbar"
          src="https://bauval.org/14/38ed7250c45fe280d3bdcf13969b4498"
          strategy="afterInteractive"
          data-cfasync="false"
        />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}

