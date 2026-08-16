import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "PDF to Word Converter – Convert PDF to Word Online | PDFora",
  description:
    "Convert PDF files to editable Word documents online with PDFora. Turn PDF content into DOCX files quickly and easily.",
  alternates: {
    canonical: "https://pd-fora.vercel.app/pdf-to-word",
  },
  openGraph: {
    title: "PDF to Word Converter – Convert PDF to Word Online | PDFora",
    description:
      "Convert PDF files to editable Word documents online with PDFora. Turn PDF content into DOCX files quickly and easily.",
    url: "https://pd-fora.vercel.app/pdf-to-word",
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
