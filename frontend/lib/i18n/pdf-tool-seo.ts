import type { Metadata } from "next";
import { getToolGuide } from "../tool-guides";

const SITE = "https://pd-fora.vercel.app";

function fitDescription(value: string, max = 160): string {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const shortened = clean.slice(0, max - 1);
  const boundary = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, boundary > 110 ? boundary : max - 1).replace(/[,:;–-]+$/, "")}.`;
}

/** Shared, tool-specific metadata for the 49 standalone PDF operation pages. */
export function getPdfToolMetadata(slug: string): Metadata {
  const guide = getToolGuide(slug);
  if (!guide) return { title: "PDF Tool | PDFora", robots: { index: false, follow: true } };

  const url = `${SITE}/${slug}`;
  const title = `${guide.name} Online | PDFora`;
  const description = fitDescription(guide.purpose);
  const keywords = [
    guide.name,
    guide.keyword,
    `${guide.name.toLowerCase()} online`,
    "PDFora PDF tool"
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { type: "website", title, description, url, siteName: "PDFora" },
    twitter: { card: "summary", title, description }
  };
}
