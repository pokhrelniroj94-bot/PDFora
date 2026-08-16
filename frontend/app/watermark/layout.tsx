import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Add Watermark to PDF Online | PDFora",
  description:
    "Add a text watermark to PDF files online with PDFora. Protect and personalize your PDF documents quickly and easily.",
  alternates: {
    canonical: "https://pd-fora.vercel.app/watermark",
  },
  openGraph: {
    title: "Add Watermark to PDF Online | PDFora",
    description:
      "Add a text watermark to PDF files online with PDFora. Protect and personalize your PDF documents quickly and easily.",
    url: "https://pd-fora.vercel.app/watermark",
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
