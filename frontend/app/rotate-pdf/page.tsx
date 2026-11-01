"use client";

import Niroj77Tool from "../../components/Niroj77Tool";

export default function Page() {
  return (
    <Niroj77Tool
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