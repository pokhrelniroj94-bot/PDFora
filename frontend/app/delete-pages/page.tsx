"use client";

import PDForaTool from "../../components/PDForaTool";

export default function Page() {
  return (
    <PDForaTool
      endpoint="/api/delete-pages"
      title="Delete PDF Pages"
      description="Remove selected pages from your PDF."
      formField="pages"
      formPlaceholder="Pages to delete: 2,4,7"
      downloadName="PDFora-Deleted-Pages.pdf"
    />
  );
}
