"use client";

import PDForaTool from "../../components/PDForaTool";

export default function Page() {
  return (
    <PDForaTool
      endpoint="/api/merge"
      title="Merge PDF"
      description="Combine multiple PDF files into one PDF document."
      multiple
      downloadName="PDFora-Merged.pdf"
    />
  );
}
