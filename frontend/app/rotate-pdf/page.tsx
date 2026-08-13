"use client";

import PDForaTool from "../../components/PDForaTool";

export default function Page() {
  return (
    <PDForaTool
      endpoint="/api/rotate"
      title="Rotate PDF Online"
      description="Rotate PDF pages online by 90, 180, or 270 degrees and download the corrected PDF quickly and easily."
      multiple={false}
      accept="application/pdf,.pdf"
      downloadName="PDFora-Rotated.pdf"
      queryField="degrees"
      queryDefault="90"
    />
  );
}