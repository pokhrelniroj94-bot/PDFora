import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "PDF to Excel Converter – Convert PDF to Excel Online | PDFora",
  description:
    "Convert PDF files to editable Excel spreadsheets online with PDFora. Extract tables and data from PDF documents and download them as XLSX files.",
  alternates: {
    canonical: "https://pd-fora.vercel.app/pdf-to-excel",
  },
  openGraph: {
    title: "PDF to Excel Converter | PDFora",
    description:
      "Convert PDF files to editable Excel spreadsheets online with PDFora.",
    url: "https://pd-fora.vercel.app/pdf-to-excel",
    type: "website",
  },
};

export default function PDFToExcelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
