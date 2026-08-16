import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Compress PDF Online – Reduce PDF File Size | PDFora",
  description:
    "Compress PDF files online and reduce PDF file size quickly with PDFora. Free online PDF compressor with easy downloading.",
  alternates: {
    canonical: "https://pd-fora.vercel.app/compress-pdf",
  },
  openGraph: {
    title: "Compress PDF Online – Reduce PDF File Size | PDFora",
    description:
      "Compress PDF files online and reduce PDF file size quickly with PDFora. Free online PDF compressor with easy downloading.",
    url: "https://pd-fora.vercel.app/compress-pdf",
    type: "website",
  },
};

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
