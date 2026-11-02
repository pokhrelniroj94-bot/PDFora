import { toolCatalog } from "../components/toolCatalog";

export type Tool = {
  name: string;
  description: string;
  icon: string;
  category: string;
  href: string;
  popular?: boolean;
  kind: "pdf" | "utility";
  slug: string;
  keywords: string;
};

const rawPdfTools: Array<Omit<Tool, "kind" | "slug" | "keywords">> = [
  {
    name: "Merge PDF",
    description:
      "Combine multiple PDF files into one document quickly and easily.",
    icon: "M",
    category: "Organize",
    href: "/merge-pdf",
    popular: true,
  },
  {
    name: "Split PDF",
    description:
      "Split a PDF or extract selected pages into a new PDF document.",
    icon: "S",
    category: "Organize",
    href: "/split-pdf",
    popular: true,
  },
  {
    name: "Compress PDF",
    description:
      "Reduce PDF file size for easier sharing, uploading and storage.",
    icon: "C",
    category: "Optimize",
    href: "/compress-pdf",
    popular: true,
  },
  {
    name: "Images to PDF",
    description:
      "Convert JPG, PNG and WebP images into a single PDF document.",
    icon: "I",
    category: "Convert",
    href: "/images-to-pdf",
  },
  {
    name: "PDF to JPG",
    description:
      "Convert PDF pages into JPG images for easy sharing and viewing.",
    icon: "J",
    category: "Convert",
    href: "/pdf-to-jpg",
  },
    {
    name: "PDF to Excel",
    description:
      "Convert PDF tables into editable Excel spreadsheets.",
    icon: "E",
    category: "Convert",
    href: "/pdf-to-excel",
  },
  {
    name: "PDF to Word",
    description:
      "Convert PDF documents into editable Word files.",
    icon: "W",
    category: "Convert",
    href: "/pdf-to-word",
  },
  {
    name: "Rotate PDF",
    description:
      "Rotate PDF pages by 90, 180 or 270 degrees.",
    icon: "R",
    category: "Edit",
    href: "/rotate-pdf",
  },
  {
    name: "Delete Pages",
    description:
      "Remove unwanted pages from a PDF document.",
    icon: "D",
    category: "Edit",
    href: "/delete-pages",
  },
  {
    name: "Extract Pages",
    description:
      "Extract selected pages and create a new PDF file.",
    icon: "E",
    category: "Edit",
    href: "/extract-pages",
  },
  {
    name: "Watermark PDF",
    description:
      "Add a custom text watermark to your PDF document.",
    icon: "W",
    category: "Security",
    href: "/watermark",
  },
  { name: "Reorder PDF Pages", description: "Change the order of pages in a PDF document.", icon: "↕", category: "Organize", href: "/reorder-pdf" },
  { name: "Add Page Numbers", description: "Insert page numbers into your PDF.", icon: "#", category: "Edit", href: "/add-page-numbers" },
  { name: "Crop PDF", description: "Crop page margins in a PDF.", icon: "⌗", category: "Edit", href: "/crop-pdf" },
  { name: "Add Header or Footer", description: "Add a text header to every page.", icon: "H", category: "Edit", href: "/header-footer" },
  { name: "Protect PDF", description: "Encrypt your PDF with a password.", icon: "🔒", category: "Security", href: "/protect-pdf" },
  { name: "Unlock PDF", description: "Unlock a PDF using its existing password.", icon: "🔓", category: "Security", href: "/unlock-pdf" },
  { name: "Sign PDF", description: "Add a visible typed signature to a PDF.", icon: "✍", category: "Security", href: "/sign-pdf" },
  { name: "PDF to PNG", description: "Convert PDF pages to PNG images.", icon: "P", category: "Convert", href: "/pdf-to-png" },
  { name: "PDF to WebP", description: "Convert PDF pages to WebP images.", icon: "W", category: "Convert", href: "/pdf-to-webp" },
  { name: "PDF to Text", description: "Extract selectable text from a PDF.", icon: "T", category: "Convert", href: "/pdf-to-text" },
  { name: "Grayscale PDF", description: "Convert PDF pages to grayscale.", icon: "◐", category: "Edit", href: "/grayscale-pdf" },
  { name: "Flatten PDF", description: "Apply form appearances and remove annotations where supported.", icon: "▤", category: "Edit", href: "/flatten-pdf" },
  { name: "Edit PDF Metadata", description: "Change PDF title, author, subject and keywords.", icon: "i", category: "Edit", href: "/edit-pdf-metadata" },
  { name: "Repair PDF", description: "Attempt best-effort recovery of damaged PDFs.", icon: "🛠", category: "Edit", href: "/repair-pdf" },
  { name: "PDF to HTML", description: "Export selectable PDF text as an HTML document.", icon: "H", category: "Convert", href: "/pdf-to-html" },
  { name: "Extract Images", description: "Extract embedded images from a PDF into a ZIP file.", icon: "I", category: "Convert", href: "/extract-images" },
  { name: "Remove Blank Pages", description: "Detect and remove empty pages from a PDF.", icon: "B", category: "Edit", href: "/remove-blank-pages" },
  { name: "Compare PDF", description: "Compare text in two PDFs and download a difference report.", icon: "C", category: "Edit", href: "/compare-pdf" },
  { name: "Add Blank Pages", description: "Append blank pages to the end of a PDF document.", icon: "B", category: "Edit", href: "/add-blank-pages" },
  { name: "Rotate Selected Pages", description: "Rotate chosen PDF pages without changing the others.", icon: "R", category: "Edit", href: "/rotate-selected-pages" },

  { name: "Add Background", description: "Add a background layer to PDF pages.", icon: "B", category: "Edit", href: "/add-background" },
  { name: "Add Bookmarks", description: "Create PDF bookmarks to navigate long documents.", icon: "B", category: "Organize", href: "/add-bookmarks" },
  { name: "Bates Numbering", description: "Add sequential Bates identifiers to PDF pages.", icon: "B", category: "Organize", href: "/bates-numbering" },
  { name: "Extract Bookmarks", description: "Export the bookmark outline from a PDF.", icon: "B", category: "Extract", href: "/extract-bookmarks" },
  { name: "Extract Fonts", description: "Inspect and extract embedded PDF font resources where supported.", icon: "F", category: "Extract", href: "/extract-fonts" },
  { name: "Extract Page Images", description: "Render individual PDF pages as image files.", icon: "I", category: "Extract", href: "/extract-page-images" },
  { name: "OCR PDF", description: "Recognize text in scanned PDFs. OCR availability depends on server language-data setup.", icon: "O", category: "Convert", href: "/ocr-pdf" },
  { name: "Page Counter", description: "Count pages and inspect the page structure of a PDF.", icon: "#", category: "Analyze", href: "/page-counter" },
  { name: "PDF Information", description: "View PDF metadata, dimensions, encryption and document properties.", icon: "i", category: "Analyze", href: "/pdf-information" },
  { name: "PDF to BMP", description: "Convert PDF pages into BMP images.", icon: "B", category: "Convert", href: "/pdf-to-bmp" },
  { name: "PDF to CSV", description: "Extract tabular PDF data into CSV format where text tables are available.", icon: "C", category: "Convert", href: "/pdf-to-csv" },
  { name: "PDF to JSON", description: "Export selectable PDF text and document structure as JSON.", icon: "J", category: "Convert", href: "/pdf-to-json" },
  { name: "PDF to Markdown", description: "Convert selectable PDF text into Markdown.", icon: "M", category: "Convert", href: "/pdf-to-markdown" },
  { name: "PDF to TIFF", description: "Convert PDF pages into TIFF images.", icon: "T", category: "Convert", href: "/pdf-to-tiff" },
  { name: "Remove Annotations", description: "Remove supported comments and annotations from a PDF.", icon: "A", category: "Edit", href: "/remove-annotations" },
  { name: "Remove Attachments", description: "Remove embedded file attachments from a PDF.", icon: "A", category: "Security", href: "/remove-attachments" },
  { name: "Remove PDF Links", description: "Remove clickable link annotations from PDF pages.", icon: "L", category: "Security", href: "/remove-pdf-links" },
  { name: "Remove PDF Metadata", description: "Clear document metadata from a PDF file.", icon: "M", category: "Security", href: "/remove-pdf-metadata" },
  { name: "Split by Bookmarks", description: "Split a PDF into separate files using its bookmark outline.", icon: "S", category: "Organize", href: "/split-by-bookmarks" },
];

export const pdfTools: Tool[] = rawPdfTools.map((tool) => ({
  ...tool,
  kind: "pdf" as const,
  slug: tool.href.startsWith("/") ? tool.href.slice(1) : tool.href,
  keywords: [tool.name, tool.description, tool.href.replaceAll("-", " ")].join(" "),
}));

const catalogSearchAliases: Record<string, string> = {
  "loan-emi-calculator": "EMI calculator loan installment monthly payment car loan home loan personal loan finance repayment interest",
  "notes-to-pdf": "notes to PDF notebook typed notes text document print save export study notes class notes",
};

export const catalogTools: Tool[] = [
  ...toolCatalog
  .filter((tool) => tool.slug !== "pdf-tools")
  .map((tool) => ({
    name: tool.name,
    description: tool.description,
    icon: tool.category,
    category: tool.category,
    href: "/tools/" + tool.slug,
    kind: "utility" as const,
    slug: tool.slug,
    keywords: [tool.keywords, catalogSearchAliases[tool.slug] ?? ""].join(" "),
  })),
  { name: "NEPSE Market Dashboard", description: "Explore periodic NEPSE market snapshots, listed-company prices, index and sector performance, top movers and historical charts.", icon: "NEPSE", category: "NEPSE", href: "/market", kind: "utility", slug: "nepse-market-dashboard", keywords: "NEPSE market dashboard stock prices share market listed companies index sector top gainers losers turnover history chart Nepal stock exchange" },
];

// One canonical directory for homepage search and the full /tools directory.
// OCR is intentionally excluded until its backend language data is enabled.
export const allTools: Tool[] = [...pdfTools, ...catalogTools].filter((tool) => tool.href !== "/ocr-pdf");
