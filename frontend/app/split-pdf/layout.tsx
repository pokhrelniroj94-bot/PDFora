import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Split PDF Online – Split PDF Pages | PDFora",
  description:
    "Split PDF files online with PDFora. Separate PDF pages or extract selected pages into a new PDF quickly and easily.",
  alternates: {
    canonical: "https://pd-fora.vercel.app/split-pdf",
  },
  openGraph: {
    title: "Split PDF Online – Split PDF Pages | PDFora",
    description:
      "Split PDF files online with PDFora. Separate PDF pages or extract selected pages into a new PDF quickly and easily.",
    url: "https://pd-fora.vercel.app/split-pdf",
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
