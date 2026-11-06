import { getToolGuide } from "../tool-guides";
import { buildPdfToolMetadata } from "./pdf-tool-seo-core";

/** Shared, tool-specific metadata for the 49 standalone PDF operation pages. */
export function getPdfToolMetadata(slug: string) {
  return buildPdfToolMetadata(getToolGuide(slug), slug);
}
