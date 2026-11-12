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
  if (!guide) return { title: "PDF Tool | PDFora", robots: { index: false, follow: true } };

  const url = `${SITE}/${slug}`;
  const overrides: Record<string,{title:string;description:string}> = {
    "merge-pdf": { title: "Merge PDF Files Online – Combine Multiple PDFs", description: "Combine 2–20 PDF files into one document. Reorder files, merge and download a single PDF. Combined upload limit: 50 MB." },
    "split-pdf": { title: "Split PDF Online – Extract Pages into Separate Files", description: "Split a PDF into smaller documents by selecting page ranges. Extract the pages you need, then check page order and readability before sharing." },
    "delete-pages": { title: "Delete PDF Pages Online – Remove Selected Pages", description: "Remove unwanted or blank PDF pages by entering page numbers such as 2, 4, or 6–8. Download a clean copy and verify the remaining page order." },
    "rotate-pdf": { title: "Rotate PDF Online – Turn Pages 90°, 180° or 270°", description: "Rotate a PDF by 90, 180 or 270 degrees to fix sideways or upside-down pages. Download the corrected file and check its orientation." },
    "pdf-to-excel": { title: "PDF to Excel Converter – Extract Tables to XLSX", description: "Convert selectable PDF tables into an editable Excel XLSX workbook. Scanned pages may need OCR; review columns, dates and totals after conversion." }
  };
  const title = overrides[slug]?.title ?? `${guide.name} Online`;
  const brandedTitle = `${title} | PDFora`;
  const description = fitDescription(overrides[slug]?.description ?? guide.purpose);
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
    openGraph: { type: "website", title: brandedTitle, description, url, siteName: "PDFora" },
    twitter: { card: "summary", title: brandedTitle, description }
  };
}
