import PDForaTool from "@/components/PDForaTool";

export default function PDFToWordPage() {
  return (
    <PDForaTool
      endpoint="/api/pdf-to-word"
      title="PDF to Word"
      description="Convert your PDF into an editable Word document."
      multiple={false}
      accept="application/pdf,.pdf"
      downloadName="converted.docx"
      fieldName="file"
    />
  );
}