import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Delete Pages from PDF Online Free | PDFora",
  description:
    "Delete pages from PDF online for free with PDFora. Remove unwanted or blank pages from your PDF quickly and easily. No software installation required.",
  alternates: {
    canonical: "https://pd-fora.vercel.app/delete-pages",
  },
  openGraph: {
    title: "Delete Pages from PDF Online Free | PDFora",
    description:
      "Delete pages from PDF online for free with PDFora. Remove unwanted or blank pages from your PDF quickly and easily.",
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
