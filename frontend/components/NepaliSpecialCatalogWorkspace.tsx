"use client";

import { CatalogToolBody } from "./AllTools";
import NepalTools from "./NepalTools";
import NepaliTypingTool from "./NepaliTypingTool";

export default function NepaliSpecialCatalogWorkspace({ slug }: { slug: string }) {
  if (slug === "nepal-share-calculator" || slug === "preeti-unicode-converter") {
    return <NepalTools slug={slug} locale="ne" />;
  }
  if (slug === "nepali-unicode-typing") {
    return <NepaliTypingTool locale="ne" />;
  }
  if (["currency-converter", "image-compressor", "image-format-converter", "color-picker-palette", "notes-to-pdf"].includes(slug)) {
    return <CatalogToolBody slug={slug} locale="ne" />;
  }
  return <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">यो टुलको नेपाली कार्यक्षेत्र उपलब्ध छैन।</p>;
}
