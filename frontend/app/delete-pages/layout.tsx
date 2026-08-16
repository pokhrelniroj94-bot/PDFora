import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Delete PDF Pages Online – Remove Pages from PDF | PDFora",
  description:
    "Delete unwanted pages from PDF files online with PDFora. Remove selected PDF pages quickly and download your new PDF.",
  alternates: {
    canonical: "https://pd-fora.vercel.app/delete-pages",
  },
  openGraph: {
    title: "Delete PDF Pages Online – Remove Pages from PDF | PDFora",
    description:
      "Delete unwanted pages from PDF files online with PDFora. Remove selected PDF pages quickly and download your new PDF.",
    url: "https://pd-fora.vercel.app/delete-pages",
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
