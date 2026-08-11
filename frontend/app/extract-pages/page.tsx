"use client";

import PDForaTool from "../../components/PDForaTool";

export default function Page() {
  return (
    <PDForaTool
      endpoint="/api/extract-pages"
      title="Extract PDF Pages"
      description="Extract selected pages into a new PDF."
      formField="pages"
      formPlaceholder="Pages to extract: 1,3,5"
      downloadName="PDFora-Extracted.pdf"
    />
  );
}
