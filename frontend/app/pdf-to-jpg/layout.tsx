import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "PDF to JPG Converter – Convert PDF to Images Online | PDFora",
  description:
    "Convert PDF pages to JPG images online with PDFora. Download high-quality JPG images from your PDF quickly and easily.",
  alternates: {
    canonical: "https://pd-fora.vercel.app/pdf-to-jpg",
  },
  openGraph: {
    title: "PDF to JPG Converter – Convert PDF to Images Online | PDFora",
    description:
      "Convert PDF pages to JPG images online with PDFora. Download high-quality JPG images from your PDF quickly and easily.",
    url: "https://pd-fora.vercel.app/pdf-to-jpg",
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
