import type { Metadata } from "next";
import ToolCategoryPage from "../../../components/ToolCategoryPage";

export const metadata: Metadata = {
  title: "Free Online PDF Tools",
  description: "Browse PDF merge, split, compress, convert, edit, organize and security tools.",
  alternates: { canonical: "https://pd-fora.vercel.app/tools/pdf" },
};

export default function PdfToolsPage() {
  return <ToolCategoryPage category="pdf" />;
}
