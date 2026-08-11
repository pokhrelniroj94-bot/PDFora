"use client";

import PDForaTool from "../../components/PDForaTool";

export default function Page() {
  return (
    <PDForaTool
      endpoint="/api/pdf-to-jpg"
      title="PDF to JPG"
      description="Convert every PDF page into JPG images."
      downloadName="PDFora-JPG.zip"
    />
  );
}
