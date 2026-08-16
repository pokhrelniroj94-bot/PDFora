import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Extract PDF Pages Online – Extract Pages from PDF | PDFora",
  description:
    "Extract selected pages from PDF files online with PDFora. Create a new PDF from the pages you need quickly and easily.",
  alternates: {
    canonical: "https://pd-fora.vercel.app/extract-pages",
  },
  openGraph: {
    title: "Extract PDF Pages Online – Extract Pages from PDF | PDFora",
    description:
      "Extract selected pages from PDF files online with PDFora. Create a new PDF from the pages you need quickly and easily.",
    url: "https://pd-fora.vercel.app/extract-pages",
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
