"use client";

import PDForaTool from "../../components/PDForaTool";

export default function Page() {
  return (
    <PDForaTool
      endpoint="/api/watermark"
      title="Watermark PDF"
      description="Add a text watermark to every PDF page."
      formField="text"
      formPlaceholder="Enter watermark text"
      downloadName="PDFora-Watermarked.pdf"
    />
  );
}
