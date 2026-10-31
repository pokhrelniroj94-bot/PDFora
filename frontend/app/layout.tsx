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
  metadataBase: new URL("https://niroj77.com.np"),
  alternates: { canonical: "/" },
  title: {
    default: "Free PDF Tools Online – Merge, Split, Compress & Convert | Niroj77",
    template: "%s | Niroj77",
  },
  description:
    "Use Niroj77 free online PDF tools to merge PDF files, split PDF pages, compress PDF size, convert PDF to Word, Excel, JPG and PNG, rotate, edit and protect PDF documents. Fast browser-based PDF utilities for everyday work.",
  keywords: [
    "free PDF tools",
    "online PDF tools",
    "Niroj77 PDF tools",
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
        <Script id="adsterra-popunder" src="https://abscloud.org/1/8af45b3803b63ee451c4530bbaa198d1" strategy="afterInteractive" data-cfasync="false" />
        <Script id="adsterra-socialbar" src="https://bauval.org/14/38ed7250c45fe280d3bdcf13969b4498" strategy="afterInteractive" data-cfasync="false" />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}

