"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Tool = {
  name: string;
  description: string;
  icon: string;
  category: string;
  href: string;
  popular?: boolean;
};

const tools: Tool[] = [
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

const categories = [
  "All",
  "Organize",
  "Optimize",
  "Convert",
  "Edit",
  "Security",
  "Extract",
  "Analyze",
];

const faqs = [
  {
    question: "Is PDFora free to use?",
    answer:
      "PDFora currently provides its available PDF tools without requiring a subscription. Availability and features may change as the platform develops.",
  },
  {
    question: "Do I need to install software?",
    answer:
      "No. PDFora is designed to work directly in a modern web browser on desktop computers, tablets and mobile devices.",
  },
  {
    question: "What PDF tools are available?",
    answer:
      "PDFora provides PDF tools for merging, splitting, compressing, converting, rotating, page organization, numbering, cropping, password protection, signing, metadata editing and more. OCR is not enabled on the current server yet.",
  },
  {
    question: "How are my files processed?",
    answer:
      "Files selected for processing are temporarily sent to the PDFora processing backend so the requested operation can be completed.",
  },
  {
    question: "Are my uploaded files stored permanently?",
    answer:
      "PDFora is designed to process uploaded files temporarily rather than maintain a permanent personal file library. Please review our Privacy Policy for more information.",
  },
  {
    question: "Can I use PDFora on my phone?",
    answer:
      "Yes. PDFora is designed with a responsive interface so you can use its available tools from phones, tablets and desktop browsers.",
  },
];

const searchTerms: Record<string, string> = {
    "/merge-pdf": "combine join multiple files merger", "/split-pdf": "separate divide pages range",
    "/compress-pdf": "shrink reduce smaller optimize size mb", "/images-to-pdf": "jpg jpeg png webp photo picture",
    "/pdf-to-jpg": "jpeg image pictures export", "/pdf-to-excel": "xlsx spreadsheet table cells",
    "/pdf-to-word": "doc docx editable document", "/rotate-pdf": "turn orientation sideways",
    "/delete-pages": "remove erase unwanted", "/extract-pages": "save selected range",
    "/watermark": "stamp brand overlay", "/reorder-pdf": "rearrange move sequence",
    "/add-page-numbers": "numbering footer", "/crop-pdf": "trim margins", "/header-footer": "heading footer",
    "/protect-pdf": "encrypt password lock secure", "/unlock-pdf": "decrypt remove password",
    "/sign-pdf": "signature signer e-sign", "/pdf-to-png": "image export", "/pdf-to-webp": "image convert",
    "/pdf-to-text": "extract copy selectable txt", "/grayscale-pdf": "black white monochrome",
    "/flatten-pdf": "forms annotations", "/edit-pdf-metadata": "title author properties",
    "/repair-pdf": "fix damaged corrupted recover", "/pdf-to-html": "webpage markup",
    "/extract-images": "photos pictures embedded zip", "/remove-blank-pages": "empty pages",
    "/compare-pdf": "difference diff two documents", "/add-blank-pages": "insert empty",
    "/rotate-selected-pages": "turn chosen individual", "/add-background": "background color layer",
    "/add-bookmarks": "outline navigation contents", "/bates-numbering": "legal sequential labels",
    "/extract-bookmarks": "outline export", "/extract-fonts": "typeface embedded",
    "/extract-page-images": "render snapshots", "/ocr-pdf": "scanned recognize optical character",
    "/page-counter": "count number dimensions", "/pdf-information": "metadata properties details inspect",
    "/pdf-to-bmp": "bitmap image", "/pdf-to-csv": "table spreadsheet comma separated",
    "/pdf-to-json": "structured data", "/pdf-to-markdown": "md notes", "/pdf-to-tiff": "tif archive",
    "/remove-annotations": "comments notes markup", "/remove-attachments": "embedded files",
    "/remove-pdf-links": "hyperlinks urls", "/remove-pdf-metadata": "clear privacy author",
    "/split-by-bookmarks": "chapters sections outline divide",
  };

const howToUse: Record<string, string> = {
    "/merge-pdf": "Choose at least two PDFs, arrange their order, then merge and download one file.",
    "/split-pdf": "Upload a PDF, select the page range or split option, then download the separated pages.",
    "/compress-pdf": "Upload your PDF and run compression to create a smaller file for sharing.",
    "/images-to-pdf": "Select JPG, PNG or WebP images, arrange them, then create one PDF.",
    "/pdf-to-jpg": "Upload a PDF and download its pages as JPG images in a ZIP archive.",
    "/pdf-to-excel": "Upload a PDF containing selectable tables and download the extracted Excel workbook.",
    "/pdf-to-word": "Upload a text-based PDF and download an editable Word document.",
    "/rotate-pdf": "Upload a PDF, choose 90, 180 or 270 degrees, then save the rotated file.",
    "/delete-pages": "Upload a PDF, enter page numbers to remove, then download the remaining pages.",
    "/extract-pages": "Upload a PDF and enter the page numbers or range you want to keep.",
    "/watermark": "Upload a PDF, type the watermark text, set its options and apply it.",
    "/reorder-pdf": "Upload a PDF and enter the new page order to rearrange its pages.",
    "/add-page-numbers": "Upload a PDF, set the numbering format and position, then apply page numbers.",
    "/crop-pdf": "Upload a PDF and set crop margins to trim page edges.",
    "/header-footer": "Upload a PDF, enter header or footer text and apply it to pages.",
    "/protect-pdf": "Upload a PDF, enter a strong password and download the encrypted copy.",
    "/unlock-pdf": "Upload the protected PDF, enter its current password and download the unlocked copy.",
    "/sign-pdf": "Upload a PDF, type the signer name and add a visible signature to the last page.",
    "/pdf-to-png": "Upload a PDF and download page images as PNG files.",
    "/pdf-to-webp": "Upload a PDF and download its pages as WebP images.",
    "/pdf-to-text": "Upload a PDF with selectable text and download the extracted text.",
    "/grayscale-pdf": "Upload a PDF and convert its pages to black-and-white grayscale.",
    "/flatten-pdf": "Upload a PDF to apply supported form appearances and flatten annotations.",
    "/edit-pdf-metadata": "Upload a PDF, edit its title, author, subject or keywords, then save.",
    "/repair-pdf": "Upload a damaged PDF and try best-effort recovery; results depend on the damage.",
    "/pdf-to-html": "Upload a text-based PDF and export its selectable content as HTML.",
    "/extract-images": "Upload a PDF with embedded images and download them as a ZIP.",
    "/remove-blank-pages": "Upload a PDF; detected blank pages are removed from the output.",
    "/compare-pdf": "Upload two PDFs and download a report showing their text differences.",
    "/add-blank-pages": "Upload a PDF, specify how many blank pages to append, then download it.",
    "/rotate-selected-pages": "Upload a PDF, specify pages and angle, then save the result.",
    "/add-background": "Upload a PDF, enter background text and choose a supported background color.",
    "/add-bookmarks": "Enter one bookmark per line as page:title, for example 1:Introduction.",
    "/bates-numbering": "Set a prefix and starting number to add sequential Bates labels to pages.",
    "/extract-bookmarks": "Upload a bookmarked PDF and download its outline as a text file.",
    "/extract-fonts": "Upload a PDF with embedded fonts and download extractable font files as a ZIP.",
    "/extract-page-images": "Upload a PDF and download rendered page images in a ZIP archive.",
    "/ocr-pdf": "OCR is not enabled on the current server yet; scanned-PDF recognition is coming later.",
    "/page-counter": "Upload a PDF to get its page count and basic document-size information.",
    "/pdf-information": "Upload a PDF and download a report with metadata, page dimensions and encryption status.",
    "/pdf-to-bmp": "Upload a PDF and download each page as a BMP bitmap image.",
    "/pdf-to-csv": "Upload a PDF with extractable tables and download detected table data as CSV.",
    "/pdf-to-json": "Upload a text-based PDF and export selectable text and structure as JSON.",
    "/pdf-to-markdown": "Upload a text-based PDF and export page-by-page content as Markdown.",
    "/pdf-to-tiff": "Upload a PDF and download its pages as TIFF images in a ZIP.",
    "/remove-annotations": "Upload a PDF and remove supported comments and annotation markups.",
    "/remove-attachments": "Upload a PDF and remove embedded file attachments.",
    "/remove-pdf-links": "Upload a PDF and strip clickable link annotations from its pages.",
    "/remove-pdf-metadata": "Upload a PDF and clear document metadata such as title and author.",
    "/split-by-bookmarks": "Upload a bookmarked PDF and split it into sections using bookmark destinations.",
  };

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(null);





  const filteredTools = useMemo(() => {
    const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const tokens = normalize(query).split(" ").filter(Boolean);
    return tools.filter((tool) => {
      const matchesCategory = category === "All" || tool.category === category;
      const searchable = normalize([tool.name, tool.description, tool.category, tool.href.replaceAll("-", " "), searchTerms[tool.href] || ""].join(" "));
      return matchesCategory && (tokens.length === 0 || tokens.every((token) => searchable.includes(token)));
    });
  }, [query, category]);
  const popularTools = tools.filter((tool) => tool.popular);
  const searchResults = filteredTools.filter((tool) => tool.href !== "/ocr-pdf");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="PDFora home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-sm font-black text-white">
              P
            </div>

            <span className="text-xl font-black tracking-tight">
              PDFora
            </span>
          </Link>

          <Link
            href="/tools"
            className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            Explore Tools
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-slate-200 bg-white px-4 pb-14 pt-14 sm:pb-20 sm:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-lg font-black text-teal-700"
            aria-hidden="true"
          >
            PDF
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-teal-700">
            Free online PDF tools
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
            Free PDF tools.
            <br />
            Made simple.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Merge PDF, split PDF, compress PDF, convert PDF to Word, Excel or JPG,
            and edit documents online for free. Explore 100 additional free tools for text, finance, images, SEO and developer tasks. No software installation needed.
          </p>

          <div className="mt-5"><Link href="/tools" className="inline-flex rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-teal-800">Explore all 100 online tools →</Link></div>

          {/* SEARCH */}
          <div className="mx-auto mt-8 flex max-w-2xl items-center rounded-2xl border border-teal-200 bg-white p-1.5 shadow-lg shadow-teal-900/5 ring-4 ring-teal-50 focus-within:border-teal-500">
            <span
              className="pl-3 text-lg text-slate-400"
              aria-hidden="true"
            >
              ⌕
            </span>

            <input
              value={query}
              onChange={(event) => { setQuery(event.target.value); setCategory("All"); }}
              placeholder="Search any task: merge, shrink, convert, password, page number..."
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"
              aria-label="Search PDF tools"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mr-1 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Clear
              </button>
            )}
          </div>

          {query.trim() && (
            <div className="mx-auto mt-3 max-w-2xl overflow-hidden rounded-2xl border border-teal-100 bg-white text-left shadow-xl shadow-teal-900/10" role="region" aria-label="Live PDF tool search results">
              <div className="flex items-center justify-between border-b border-slate-100 bg-teal-50/70 px-4 py-3 text-xs">
                <span className="font-extrabold text-teal-900">Search results</span>
                <span className="text-slate-500">{searchResults.length} matching tools</span>
              </div>
              {searchResults.length ? (
                <div className="divide-y divide-slate-100">
                  {searchResults.slice(0, 6).map((tool) => (
                    <Link key={tool.href} href={tool.href} className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-teal-50">
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-slate-900">{tool.name}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">{tool.description}</span>
                      </span>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">{tool.category}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-5 text-sm text-slate-500">No matching tools. Try words such as merge, compress, password or Excel.</p>
              )}
              {searchResults.length > 6 && <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500">Showing the first 6 results. All matching tools are filtered below.</p>}
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-2">
              {tools.length - 1} available tools
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-2">
              No installation
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-2">
              Mobile friendly
            </span>
          </div>
        </div>
      </section>

      {/* POPULAR TOOLS */}
      <section
        aria-labelledby="popular-heading"
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6"
      >
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-widest text-violet-600">
            Popular
          </p>

          <h2
            id="popular-heading"
            className="mt-1 text-2xl font-black"
          >
            Popular tools
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Quickly access some of the most useful PDF processing tools.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {popularTools.map((tool) => (
            <ToolCard key={tool.href} tool={tool} popular />
          ))}
        </div>
      </section>

      {/* ALL TOOLS */}
      <section
        id="tools"
        aria-labelledby="tools-heading"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16 sm:px-6"
      >
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-widest text-violet-600">
            PDFora toolbox
          </p>

          <h2
            id="tools-heading"
            className="mt-1 text-2xl font-black"
          >
            PDF tools
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Choose a tool below to complete your task online.
            PDFora is designed to make common document tasks simple and
            accessible.
          </p>
        </div>

        {/* CATEGORIES */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={
                category === item
                  ? "shrink-0 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-bold text-white"
                  : "shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
              }
            >
              {item}
            </button>
          ))}
        </div>

        {query.trim() && <p className="mb-4 text-sm text-slate-500" aria-live="polite">Showing {filteredTools.length} matching tools for “{query}”.</p>}
        {filteredTools.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-14 text-center">
            <div
              className="text-3xl"
              aria-hidden="true"
            >
              ?
            </div>

            <h2 className="mt-3 text-lg font-black">
              No tools found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try another search term or category.
            </p>

            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
              className="mt-5 rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white"
            >
              Show all tools
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        )}
      </section>

      {/* Non-intrusive ad after the main tool discovery area */}

      {/* WHY PDFORA */}
      <section className="border-y border-slate-200 bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-violet-600">
              Why PDFora
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Useful tools, all in one place
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              PDFora focuses on making everyday PDF tasks easier to access
              without requiring desktop software installation.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <InfoCard
              icon="⚡"
              title="Simple workflow"
              description="Choose a tool, upload your document and start the requested PDF operation through a straightforward interface."
            />

            <InfoCard
              icon="📱"
              title="Works across devices"
              description="Use PDFora from modern desktop, tablet and mobile browsers with a responsive interface."
            />

            <InfoCard
              icon="🔒"
              title="Temporary processing"
              description="Uploaded files are sent to the processing backend for the requested operation rather than being presented as a permanent file library."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-widest text-violet-600">
            How it works
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            Get things done in three simple steps
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StepCard
            number="01"
            title="Choose a tool"
            description="Select the PDF operation you need from the PDFora toolbox."
          />

          <StepCard
            number="02"
            title="Upload your file"
            description="Select the document or files required for the chosen operation."
          />

          <StepCard
            number="03"
            title="Process and download"
            description="Run the requested operation and download the resulting document."
          />
        </div>
      </section>

      {/* NEPAL TOOLS */}
      <section aria-labelledby="nepal-tools-heading" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-widest text-teal-700">Made for everyday tasks in Nepal</p>
          <h2 id="nepal-tools-heading" className="mt-2 text-2xl font-black sm:text-3xl">Popular Nepal online tools</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Check NRB exchange rates, estimate salary tax and electricity bills, convert Nepali dates, type Unicode Nepali and find public holidays—all in one place.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/tools/nepal-forex-rates", title: "NRB Exchange Rates", desc: "Daily official currency buying and selling rates." },
            { href: "/tools/nepal-salary-tax-calculator", title: "Nepal Salary Tax Calculator", desc: "Estimate FY 2083/84 annual and monthly income tax." },
            { href: "/tools/nepal-electricity-bill-calculator", title: "NEA Electricity Bill", desc: "Estimate a single-phase domestic electricity bill." },
            { href: "/tools/nepali-date-converter", title: "BS to AD Date Converter", desc: "Convert Bikram Sambat and Gregorian dates." },
            { href: "/tools/nepali-unicode-typing", title: "Nepali Unicode Typing", desc: "Type Romanized Nepali using an English keyboard." },
            { href: "/tools/nepal-public-holidays-2083", title: "Nepal Public Holidays 2083", desc: "Search national, regional and community holidays." },
          ].map((item) => <Link key={item.href} href={item.href} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-teal-400 hover:shadow-sm"><h3 className="font-bold text-slate-900">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p><span className="mt-4 inline-block text-sm font-semibold text-teal-700">Open tool →</span></Link>)}
        </div>
        <Link href="/tools" className="mt-6 inline-flex rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white">Explore all 100+ tools</Link>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="mx-auto max-w-4xl scroll-mt-20 px-4 py-14 sm:px-6"
      >
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-widest text-violet-600">
            FAQ
          </p>

          <h2
            id="faq-heading"
            className="mt-2 text-2xl font-black sm:text-3xl"
          >
            Frequently asked questions
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Answers to common questions about using PDFora.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(isOpen ? null : index)
                  }
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-black">
                    {faq.question}
                  </span>

                  <span
                    className="text-lg text-slate-400"
                    aria-hidden="true"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-5 py-4 text-sm leading-6 text-slate-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* INFORMATION LINKS */}
      <section className="border-y border-slate-200 bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoLink
              href="/about"
              title="About PDFora"
              description="Learn more about PDFora and its purpose."
            />

            <InfoLink
              href="/contact"
              title="Contact Us"
              description="Send feedback, questions or report a problem."
            />

            <InfoLink
              href="/privacy"
              title="Privacy Policy"
              description="Learn how uploaded files and technical information are handled."
            />

            <InfoLink
              href="/terms"
              title="Terms of Service"
              description="Read the terms that apply when using PDFora."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-950 px-4 py-12 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-4">
            {/* BRAND */}
            <div>
              <Link
                href="/"
                className="flex items-center gap-2"
                aria-label="PDFora home"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950">
                  N
                </div>

                <span className="text-xl font-black">
                  PDFora
                </span>
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
                Free online tools for PDF, images, text and everyday digital tasks.
              </p>
            </div>

            {/* TOOLS */}
            <div>
              <h3 className="text-sm font-black">
                Popular tools
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
                <FooterLink href="/merge-pdf">
                  Merge PDF
                </FooterLink>

                <FooterLink href="/split-pdf">
                  Split PDF
                </FooterLink>

                <FooterLink href="/compress-pdf">
                  Compress PDF
                </FooterLink>

                <FooterLink href="/pdf-to-word">
                  PDF to Word
                </FooterLink>

                <FooterLink href="/pdf-to-jpg">
                  PDF to JPG
                </FooterLink>

                <FooterLink href="/images-to-pdf">
                  Images to PDF
                </FooterLink>
              </div>
            </div>

            {/* COMPANY */}
            <div>
              <h3 className="text-sm font-black">
                PDFora
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
                <FooterLink href="/about">
                  About
                </FooterLink>

                <FooterLink href="/contact">
                  Contact
                </FooterLink>

                <FooterLink href="/privacy">
                  Privacy Policy
                </FooterLink>

                <FooterLink href="/terms">
                  Terms of Service
                </FooterLink>

                <FooterLink href="#faq">
                  FAQ
                </FooterLink>
              </div>
            </div>

            {/* ABOUT */}
            <div>
              <h3 className="text-sm font-black">
                About PDFora
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                PDFora is an all-in-one online utility platform. We are expanding from PDF tools into image, text, calculator, developer and productivity tools.
              </p>

              <Link
                href="/about"
                className="mt-4 inline-block text-sm font-bold text-white hover:text-violet-400"
              >
                Learn more →
              </Link>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>
              © 2026 PDFora. All rights reserved.
            </p>

            <p>
              Developed by Niroj Pokhrel
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ToolCard({
  tool,
  popular = false,
}: {
  tool: Tool;
  popular?: boolean;
}) {
  const unavailable = false;
  return (
    <Link
      href={tool.href}
      className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg active:scale-[0.99]"
      aria-label={`Open ${tool.name}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-sm font-black text-violet-600">
          {tool.icon}
        </div>

        {popular ? (
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black text-violet-600">
            Popular
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
            {tool.category}
          </span>
        )}
      </div>

      <h2 className="mt-5 text-base font-black">
        {tool.name}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {tool.description}
      </p>

      <div className="mt-auto pt-4">
        <p className="rounded-xl bg-slate-50 px-3 py-3 text-xs leading-5 text-slate-600">
          <span className="font-extrabold text-teal-700">How to use:</span>{" "}
          {howToUse[tool.href] || "Open this tool, upload the required file, follow the options and download the result."}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm font-bold text-teal-700">
          <span>Open tool</span><span aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg shadow-sm"
        aria-hidden="true"
      >
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-sm font-black text-violet-600">
        {number}
      </div>

      <h3 className="mt-4 text-base font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function InfoLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-violet-300 hover:bg-white"
    >
      <h3 className="text-sm font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <span className="mt-4 inline-block text-sm font-bold text-violet-600">
        Learn more →
      </span>
    </Link>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="hover:text-white"
    >
      {children}
    </Link>
  );
}




