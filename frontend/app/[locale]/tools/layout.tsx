import type { Metadata } from "next";

const site = "https://pd-fora.vercel.app";

export const metadata: Metadata = {
  title: { default: "PDFora Tools", template: "%s | PDFora" },
  description: "Browse PDFora's online tools and utilities.",
  alternates: { canonical: `${site}/tools` },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function LocalizedToolsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
