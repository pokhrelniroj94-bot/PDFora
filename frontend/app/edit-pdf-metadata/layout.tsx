import type { ReactNode } from "react";
import { getToolMetadata } from "../../lib/tool-seo";
import ToolSEOContent from "../../components/ToolSEOContent";

export const metadata = getToolMetadata("edit-pdf-metadata");

export default function ToolLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToolSEOContent slug="edit-pdf-metadata" />
    </>
  );
}
