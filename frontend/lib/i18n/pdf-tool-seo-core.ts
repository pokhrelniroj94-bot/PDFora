import type { Metadata } from "next";
import type { ToolGuide } from "../tool-guides";

const SITE = "https://pd-fora.vercel.app";

function fitDescription(value: string, max = 160): string {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const shortened = clean.slice(0, max - 1);
  const boundary = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, boundary > 110 ? boundary : max - 1).replace(/[,:;–-]+$/, "")}.`;
}

/** Pure metadata builder shared by the route helper and unit tests. */
export function buildPdfToolMetadata(guide: ToolGuide | undefined, slug: string): Metadata {
  if (!guide) return { title: "PDF Tool", robots: { index: false, follow: true } };

  const url = `${SITE}/${slug}`;
  const title = `${guide.name} Online`;
  const brandedTitle = `${title} | PDFora`;
  const description = fitDescription(guide.purpose);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { type: "website", title: brandedTitle, description, url, siteName: "PDFora", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: brandedTitle }] },
    twitter: { card: "summary_large_image", title: brandedTitle, description, images: ["/opengraph-image"] }
  };
}
