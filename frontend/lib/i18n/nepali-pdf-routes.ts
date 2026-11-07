export type NepaliPdfRoute = {
  slug: string;
  endpoint: string;
  title: string;
  description: string;
  downloadName: string;
  multiple?: boolean;
  accept?: string;
  fieldName?: string;
  formField?: string;
  formPlaceholder?: string;
  extraFields?: { name: string; label: string; placeholder?: string; defaultValue?: string; multiline?: boolean }[];
  queryField?: string;
  queryDefault?: string;
  component: "pdfora" | "niroj";
};

export const nepaliPdfRoutes: Record<string, NepaliPdfRoute> = {
  "merge-pdf": {
    slug: "merge-pdf",
    endpoint: "/api/merge",
    title: "Merge PDF",
    description: "Combine multiple PDF files into one PDF document.",
    downloadName: "PDFora-Merged.pdf",
    multiple: true,
    component: "pdfora",
  },
  "split-pdf": {
    slug: "split-pdf",
    endpoint: "/api/split",
    title: "Split PDF",
    description: "Split a PDF or extract selected pages into a new PDF document.",
    downloadName: "PDFora-Split.pdf",
    component: "niroj",
  },
  "compress-pdf": {
    slug: "compress-pdf",
    endpoint: "/api/compress",
    title: "Compress PDF",
    description: "Reduce PDF file size for easier sharing, uploading and storage.",
    downloadName: "PDFora-Compressed.pdf",
    component: "niroj",
  },
  "rotate-pdf": {
    slug: "rotate-pdf",
    endpoint: "/api/rotate",
    title: "Rotate PDF Online",
    description: "Rotate PDF pages online by 90, 180, or 270 degrees.",
    downloadName: "PDFora-Rotated.pdf",
    queryField: "degrees",
    queryDefault: "90",
    component: "niroj",
  },
  "pdf-to-word": {
    slug: "pdf-to-word",
    endpoint: "/api/pdf-to-word",
    title: "PDF to Word",
    description: "Convert your PDF into an editable Word document.",
    downloadName: "PDFora-Converted.docx",
    component: "niroj",
  },
  "pdf-to-jpg": {
    slug: "pdf-to-jpg",
    endpoint: "/api/pdf-to-jpg",
    title: "PDF to JPG",
    description: "Convert PDF pages into JPG images for easy sharing and viewing.",
    downloadName: "PDFora-JPG.zip",
    component: "niroj",
  },
};

export function getNepaliPdfRoute(slug: string): NepaliPdfRoute | undefined {
  return nepaliPdfRoutes[slug];
}
