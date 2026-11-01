import type { ReactNode } from "react";
import { getToolMetadata } from "../../lib/tool-seo";

export const metadata = getToolMetadata("pdf-to-webp");

export default function ToolLayout({ children }: { children: ReactNode }) {
  return children;
}
