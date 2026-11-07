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
  "images-to-pdf": {
    "slug": "images-to-pdf",
    "endpoint": "/api/images-to-pdf",
    "title": "Images to PDF",
    "description": "Convert JPG, PNG and WebP images into a single PDF document.",
    "downloadName": "PDFora-Images.pdf",
    "component": "niroj",
    "accept": "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
  },
  "pdf-to-excel": {
    "slug": "pdf-to-excel",
    "endpoint": "/api/pdf-to-excel",
    "title": "PDF to Excel",
    "description": "Extract available PDF table data into an editable Excel workbook.",
    "downloadName": "PDFora-Converted.xlsx",
    "component": "niroj",
    "accept": "application/pdf,.pdf",
    "fieldName": "file"
  },
  "delete-pages": {
    "slug": "delete-pages",
    "endpoint": "/api/delete-pages",
    "title": "Delete PDF Pages",
    "description": "Remove unwanted pages from a PDF document.",
    "downloadName": "PDFora-Deleted-Pages.pdf",
    "component": "niroj",
    "accept": "application/pdf,.pdf",
    "formField": "pages",
    "formPlaceholder": "Enter page numbers, e.g. 2,4,6"
  },
  "extract-pages": {
    "slug": "extract-pages",
    "endpoint": "/api/extract-pages",
    "title": "Extract PDF Pages",
    "description": "Extract selected pages and create a new PDF file.",
    "downloadName": "PDFora-Extracted-Pages.pdf",
    "component": "niroj",
    "accept": "application/pdf,.pdf",
    "formField": "pages",
    "formPlaceholder": "Enter page numbers or range, e.g. 1,3,5-8"
  },
  "watermark": {
    "slug": "watermark",
    "endpoint": "/api/watermark",
    "title": "Watermark PDF",
    "description": "Add a custom text watermark to a PDF document.",
    "downloadName": "PDFora-Watermarked.pdf",
    "component": "niroj",
    "accept": "application/pdf,.pdf",
    "formField": "text",
    "formPlaceholder": "Enter watermark text"
  },
  "reorder-pdf": {
    "slug": "reorder-pdf",
    "endpoint": "/api/reorder",
    "title": "Reorder PDF Pages",
    "description": "Rearrange PDF pages by entering their new order, such as 3,1,2.",
    "downloadName": "PDFora-reorder-pdf.pdf",
    "component": "niroj",
    "formField": "order",
    "formPlaceholder": "Page order (example: 3,1,2)"
  },
  "add-page-numbers": {
    "slug": "add-page-numbers",
    "endpoint": "/api/page-numbers",
    "title": "Add Page Numbers",
    "description": "Add page numbers to every page of your PDF.",
    "downloadName": "PDFora-add-page-numbers.pdf",
    "component": "niroj",
    "extraFields": [
      {
        "name": "position",
        "label": "Position",
        "defaultValue": "bottom-center"
      },
      {
        "name": "start_number",
        "label": "Starting number",
        "defaultValue": "1"
      },
      {
        "name": "skip_first",
        "label": "Skip first page (true/false)",
        "defaultValue": "false"
      },
      {
        "name": "font_size",
        "label": "Font size",
        "defaultValue": "11"
      }
    ]
  },
  "crop-pdf": {
    "slug": "crop-pdf",
    "endpoint": "/api/crop",
    "title": "Crop PDF",
    "description": "Crop page margins from your PDF. Enter margin in points (36 points = half an inch).",
    "downloadName": "PDFora-crop-pdf.pdf",
    "component": "niroj",
    "formField": "margin",
    "formPlaceholder": "Margin in points (default 36)",
    "extraFields": [
      {
        "name": "pages",
        "label": "Pages (all or e.g. 1,3,5)",
        "defaultValue": "all"
      }
    ]
  },
  "header-footer": {
    "slug": "header-footer",
    "endpoint": "/api/header-footer",
    "title": "Add Header or Footer",
    "description": "Add a text header to each page of your PDF.",
    "downloadName": "PDFora-header-footer.pdf",
    "component": "niroj",
    "formField": "header",
    "formPlaceholder": "Header text",
    "extraFields": [
      {
        "name": "footer",
        "label": "Footer text"
      },
      {
        "name": "font_size",
        "label": "Font size",
        "defaultValue": "10"
      }
    ]
  },
  "protect-pdf": {
    "slug": "protect-pdf",
    "endpoint": "/api/protect",
    "title": "Protect PDF",
    "description": "Encrypt your PDF with a password. Use at least 6 characters.",
    "downloadName": "PDFora-protect-pdf.pdf",
    "component": "niroj",
    "formField": "password",
    "formPlaceholder": "Password (minimum 6 characters)"
  },
};

export function getNepaliPdfRoute(slug: string): NepaliPdfRoute | undefined {
  return nepaliPdfRoutes[slug];
}
