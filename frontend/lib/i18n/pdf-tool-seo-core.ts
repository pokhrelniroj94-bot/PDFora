import type { Metadata } from "next";
import type { ToolGuide } from "../tool-guides";

const SITE = "https://pd-fora.vercel.app";

function fitDescription(value: string, max = 155): string {
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
    "extract-pages": { title: "Extract Pages from PDF Online Free – Save Selected", description: "Extract pages from PDF by entering page numbers or ranges (1, 3, 5–8). Download a separate PDF and check the extracted pages and order." },
    "delete-pages": { title: "Delete Pages from PDF Online Free – Remove Selected", description: "Delete pages from a PDF online by entering page numbers or ranges (2, 4, 6–8). Download a new PDF and check the remaining pages and order." },
    "rotate-pdf": { title: "Rotate PDF Online Free – Turn Pages 90°, 180° or 270°", description: "Rotate a PDF online by 90°, 180° or 270° to fix sideways or upside-down pages. Download the corrected file and check each page orientation." },
    "pdf-to-excel": { title: "PDF to Excel Converter Online Free – Extract Tables", description: "Convert selectable PDF tables to an editable Excel XLSX workbook online. Review columns, dates, decimals and totals; scanned pages may need OCR." }
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
