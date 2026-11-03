import type { Metadata } from "next";

const tools: Record<string, { name: string; intent: string; detail: string }> = {
  "merge-pdf": { name: "Merge PDF", intent: "merge PDF files online", detail: "Combine multiple PDF documents into one file and keep the selected file order." },
  "split-pdf": { name: "Split PDF", intent: "split PDF files online", detail: "Separate PDF pages or extract the pages you need into a new document." },
  "compress-pdf": { name: "Compress PDF", intent: "compress PDF files online", detail: "Reduce PDF file size for easier sharing, uploading and storage." },
  "images-to-pdf": { name: "Images to PDF", intent: "convert images to PDF online", detail: "Combine supported images into a single PDF document." },
  "pdf-to-jpg": { name: "PDF to JPG", intent: "convert PDF to JPG online", detail: "Convert PDF pages into JPG images for viewing and sharing." },
  "pdf-to-excel": { name: "PDF to Excel", intent: "convert PDF to Excel online", detail: "Extract available PDF table data into an editable Excel workbook." },
  "pdf-to-word": { name: "PDF to Word", intent: "convert PDF to Word online", detail: "Convert PDF text and layout into an editable Word document." },
  "rotate-pdf": { name: "Rotate PDF", intent: "rotate PDF pages online", detail: "Rotate PDF pages to the correct orientation and download the updated file." },
  "delete-pages": { name: "Delete PDF Pages", intent: "delete pages from PDF online", detail: "Remove unwanted pages from a PDF and save the remaining document." },
  "extract-pages": { name: "Extract PDF Pages", intent: "extract pages from PDF online", detail: "Save selected PDF pages as a separate document." },
  "watermark": { name: "Add PDF Watermark", intent: "add watermark to PDF online", detail: "Place a text watermark on PDF pages for identification or document sharing." },
  "reorder-pdf": { name: "Reorder PDF Pages", intent: "reorder PDF pages online", detail: "Change the sequence of pages in a PDF document." },
  "add-page-numbers": { name: "Add PDF Page Numbers", intent: "add page numbers to PDF online", detail: "Insert page numbers into a PDF document." },
  "crop-pdf": { name: "Crop PDF", intent: "crop PDF pages online", detail: "Adjust PDF page margins and crop page edges." },
  "header-footer": { name: "PDF Header and Footer", intent: "add header and footer to PDF", detail: "Add text to the header or footer area of PDF pages." },
  "protect-pdf": { name: "Protect PDF", intent: "password protect PDF online", detail: "Encrypt a PDF document with a password before sharing it." },
  "unlock-pdf": { name: "Unlock PDF", intent: "unlock password protected PDF", detail: "Unlock a PDF using its existing password." },
  "sign-pdf": { name: "Sign PDF", intent: "sign PDF online", detail: "Add a visible typed signature to a PDF document." },
  "pdf-to-png": { name: "PDF to PNG", intent: "convert PDF to PNG online", detail: "Render PDF pages as PNG images." },
  "pdf-to-webp": { name: "PDF to WebP", intent: "convert PDF to WebP online", detail: "Convert PDF pages into WebP image files." },
  "pdf-to-text": { name: "PDF to Text", intent: "extract text from PDF online", detail: "Extract selectable text from PDF documents." },
  "grayscale-pdf": { name: "Grayscale PDF", intent: "convert PDF to grayscale online", detail: "Convert PDF pages to grayscale." },
  "flatten-pdf": { name: "Flatten PDF", intent: "flatten PDF online", detail: "Flatten supported form appearances and annotation layers in a PDF." },
  "edit-pdf-metadata": { name: "Edit PDF Metadata", intent: "edit PDF metadata online", detail: "Update document title, author, subject and keyword properties." },
  "repair-pdf": { name: "Repair PDF", intent: "repair damaged PDF online", detail: "Attempt best-effort recovery of damaged PDF documents." },
  "pdf-to-html": { name: "PDF to HTML", intent: "convert PDF to HTML online", detail: "Export selectable PDF text as an HTML document." },
  "extract-images": { name: "Extract Images from PDF", intent: "extract images from PDF online", detail: "Extract embedded image resources from PDF documents." },
  "remove-blank-pages": { name: "Remove Blank PDF Pages", intent: "remove blank pages from PDF", detail: "Detect and remove blank pages from a PDF document." },
  "compare-pdf": { name: "Compare PDF", intent: "compare PDF files online", detail: "Compare text in two PDF files and create a difference report." },
  "add-blank-pages": { name: "Add Blank PDF Pages", intent: "add blank pages to PDF online", detail: "Append blank pages to an existing PDF document." },
  "rotate-selected-pages": { name: "Rotate Selected PDF Pages", intent: "rotate selected PDF pages online", detail: "Rotate selected pages without changing the orientation of other pages." },
  "add-background": { name: "Add PDF Background", intent: "add background to PDF online", detail: "Add a supported background layer to PDF pages." },
  "add-bookmarks": { name: "Add PDF Bookmarks", intent: "add bookmarks to PDF online", detail: "Create bookmarks to help readers navigate a PDF document." },
  "bates-numbering": { name: "Bates Numbering", intent: "add Bates numbering to PDF online", detail: "Add sequential Bates identifiers to PDF pages." },
  "extract-bookmarks": { name: "Extract PDF Bookmarks", intent: "extract bookmarks from PDF", detail: "Export the outline and bookmarks from a PDF document." },
  "extract-fonts": { name: "Extract Fonts from PDF", intent: "extract fonts from PDF online", detail: "Inspect and extract embedded PDF font resources where supported." },
  "extract-page-images": { name: "Extract PDF Page Images", intent: "convert PDF pages to images", detail: "Render individual PDF pages as image files." },
  "page-counter": { name: "PDF Page Counter", intent: "count PDF pages online", detail: "Count pages and inspect basic PDF document structure." },
  "pdf-information": { name: "PDF Information", intent: "view PDF information online", detail: "Inspect PDF metadata, dimensions, encryption and document properties." },
  "pdf-to-bmp": { name: "PDF to BMP", intent: "convert PDF to BMP online", detail: "Convert PDF pages into BMP bitmap images." },
  "pdf-to-csv": { name: "PDF to CSV", intent: "convert PDF tables to CSV", detail: "Extract available text-based table data into CSV format." },
  "pdf-to-json": { name: "PDF to JSON", intent: "convert PDF to JSON online", detail: "Export selectable PDF text and document structure as JSON." },
  "pdf-to-markdown": { name: "PDF to Markdown", intent: "convert PDF to Markdown online", detail: "Convert selectable PDF text into Markdown content." },
  "pdf-to-tiff": { name: "PDF to TIFF", intent: "convert PDF to TIFF online", detail: "Convert PDF pages into TIFF image files." },
  "remove-annotations": { name: "Remove PDF Annotations", intent: "remove annotations from PDF", detail: "Remove supported comments and annotations from a PDF." },
  "remove-attachments": { name: "Remove PDF Attachments", intent: "remove attachments from PDF", detail: "Remove embedded file attachments from a PDF document." },
  "remove-pdf-links": { name: "Remove PDF Links", intent: "remove links from PDF online", detail: "Remove clickable link annotations from PDF pages." },
  "remove-pdf-metadata": { name: "Remove PDF Metadata", intent: "remove metadata from PDF online", detail: "Clear document metadata from a PDF file." },
  "split-by-bookmarks": { name: "Split PDF by Bookmarks", intent: "split PDF by bookmarks", detail: "Split a PDF into separate documents using its bookmark outline." },
};

export function getToolMetadata(slug: string): Metadata {
  const tool = tools[slug];
  const baseUrl = "https://pd-fora.vercel.app";
  if (slug === "ocr-pdf") {
    return {
      title: "OCR PDF – Coming Soon",
      description: "PDFora OCR is not enabled on the current processing server yet.",
      alternates: { canonical: `${baseUrl}/ocr-pdf` },
      robots: { index: false, follow: true },
    };
  }
  const name = tool?.name ?? slug.split("-").map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" ");
  const intent = tool?.intent ?? `${name} online free`;
  const detail = tool?.detail ?? `Use PDFora to ${intent}. Follow the on-page instructions and download your processed document.`;
  // Keep titles concise and descriptions useful in search snippets.
  const title = `${name} Online Free`;
  const description = `${detail} Use PDFora free in your browser; no installation required.`;
  const url = `${baseUrl}/${slug}`;
  return {
    title,
    description,
    keywords: [intent, `${name} free`, `${name} online`, "free online PDF tools", "PDFora"],
    alternates: { canonical: url },
    openGraph: { type: "website", url, siteName: "PDFora", locale: "en_US", title: `${title} | PDFora`, description },
    twitter: { card: "summary", title: `${title} | PDFora`, description },
    robots: { index: true, follow: true },
  };
}
