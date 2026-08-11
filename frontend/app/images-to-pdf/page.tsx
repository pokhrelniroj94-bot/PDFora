"use client";

import PDForaTool from "../../components/PDForaTool";

export default function Page() {
  return (
    <PDForaTool
      endpoint="/api/images-to-pdf"
      title="Images to PDF"
      description="Convert JPG and PNG images into a single PDF."
      multiple
      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
      downloadName="PDFora-Images.pdf"
    />
  );
}
