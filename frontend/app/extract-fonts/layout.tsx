import type { ReactNode } from "react";
import { getToolMetadata } from "../../lib/tool-seo";
import ToolSEOContent from "../../components/ToolSEOContent";

export const metadata = getToolMetadata("extract-fonts");

export default function ToolLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToolSEOContent slug="extract-fonts" />
    </>
  );
}
