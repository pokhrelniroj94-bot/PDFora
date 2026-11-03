import type { Metadata } from "next";
import { CategoryToolsPage } from "../../../components/AllTools";
export const metadata: Metadata = { title: "PDF Tools – Merge, Split, Compress & Convert PDF | PDFora", description: "Browse PDF tools to merge, split, compress, convert, organize, secure and edit PDF documents online.", alternates: { canonical: "https://pd-fora.vercel.app/tools/pdf" } };
export default function PdfToolsPage(){ return <CategoryToolsPage category="PDF" />; }
