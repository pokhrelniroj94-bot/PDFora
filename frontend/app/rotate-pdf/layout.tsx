import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Rotate PDF Online – Rotate PDF Pages Free | PDFora",
  description:
    "Rotate PDF pages online with PDFora. Change PDF page orientation and download your rotated PDF quickly and easily.",
  alternates: {
    canonical: "https://pd-fora.vercel.app/rotate-pdf",
  },
  openGraph: {
    title: "Rotate PDF Online – Rotate PDF Pages Free | PDFora",
    description:
      "Rotate PDF pages online with PDFora. Change PDF page orientation and download your rotated PDF quickly and easily.",
    url: "https://pd-fora.vercel.app/rotate-pdf",
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
