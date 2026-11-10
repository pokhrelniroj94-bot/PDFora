import type { ReactNode } from "react";
import { getToolMetadata } from "../../lib/tool-seo";

export const metadata = getToolMetadata("pdf-to-excel");

export default function ToolLayout({ children }: { children: ReactNode }) {
  // The page owns its detailed PDF-to-Excel guide. Do not append the generic
  // ToolSEOContent block here: it duplicates the guide and contains PDF-generic
  // instructions that do not match an XLSX conversion workflow.
  return <>{children}</>;
}
