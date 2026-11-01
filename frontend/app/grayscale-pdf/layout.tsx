import type { ReactNode } from "react";
import { getToolMetadata } from "../../lib/tool-seo";
import ToolSEOContent from "../../components/ToolSEOContent";

export const metadata = getToolMetadata("grayscale-pdf");

export default function ToolLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToolSEOContent slug="grayscale-pdf" />
    </>
  );
}
