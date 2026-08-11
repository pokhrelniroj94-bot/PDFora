"use client";

import PDForaTool from "../../components/PDForaTool";

export default function Page() {
  return (
    <PDForaTool
      endpoint="/api/rotate"
      title="Rotate PDF"
      description="Rotate every page of your PDF."
      queryField="degrees"
      queryDefault="90"
      formPlaceholder="90, 180 or 270"
      downloadName="PDFora-Rotated.pdf"
    />
  );
}
