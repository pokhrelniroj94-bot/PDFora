import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Images to PDF Converter – JPG to PDF Online | PDFora",
  description:
    "Convert JPG, PNG and other images to PDF online with PDFora. Combine images into a PDF quickly and easily.",
  alternates: {
    canonical: "https://pd-fora.vercel.app/images-to-pdf",
  },
  openGraph: {
    title: "Images to PDF Converter – JPG to PDF Online | PDFora",
    description:
      "Convert JPG, PNG and other images to PDF online with PDFora. Combine images into a PDF quickly and easily.",
    url: "https://pd-fora.vercel.app/images-to-pdf",
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
