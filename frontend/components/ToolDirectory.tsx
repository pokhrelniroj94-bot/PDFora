import Link from "next/link";

const groups = [
  ["Organize PDF", "/merge-pdf", "/split-pdf", "/reorder-pdf", "/delete-pages", "/extract-pages", "/remove-blank-pages", "/add-blank-pages", "/page-counter", "/pdf-information", "/extract-bookmarks", "/add-bookmarks", "/pdf-to-json", "/pdf-to-csv", "/pdf-to-tiff"],
  ["Convert PDF", "/pdf-to-word", "/pdf-to-excel", "/pdf-to-jpg", "/images-to-pdf", "/pdf-to-png", "/pdf-to-webp", "/pdf-to-text", "/pdf-to-html", "/extract-images"],
  ["Edit PDF", "/compress-pdf", "/rotate-pdf", "/rotate-selected-pages", "/crop-pdf", "/watermark", "/add-page-numbers", "/bates-numbering", "/header-footer", "/grayscale-pdf", "/flatten-pdf", "/repair-pdf", "/compare-pdf", "/remove-annotations", "/remove-pdf-links", "/remove-pdf-metadata"],
  ["Secure & manage", "/protect-pdf", "/unlock-pdf", "/sign-pdf", "/edit-pdf-metadata"],
] as const;

const names: Record<string, string> = {
  "/merge-pdf": "Merge PDF", "/split-pdf": "Split PDF", "/reorder-pdf": "Reorder PDF Pages",
  "/delete-pages": "Delete PDF Pages", "/extract-pages": "Extract PDF Pages", "/remove-blank-pages": "Remove Blank Pages",
  "/pdf-to-word": "PDF to Word", "/pdf-to-excel": "PDF to Excel", "/pdf-to-jpg": "PDF to JPG",
  "/images-to-pdf": "Images to PDF", "/pdf-to-png": "PDF to PNG", "/pdf-to-webp": "PDF to WebP",
  "/pdf-to-text": "PDF to Text", "/pdf-to-html": "PDF to HTML", "/extract-images": "Extract Images",
  "/compress-pdf": "Compress PDF", "/rotate-pdf": "Rotate PDF", "/crop-pdf": "Crop PDF",
  "/watermark": "Add Watermark", "/add-page-numbers": "Add Page Numbers", "/header-footer": "Header & Footer",
  "/grayscale-pdf": "Grayscale PDF", "/flatten-pdf": "Flatten PDF", "/repair-pdf": "Repair PDF",
  "/compare-pdf": "Compare PDF", "/add-blank-pages": "Add Blank Pages", "/rotate-selected-pages": "Rotate Selected Pages", "/page-counter": "PDF Page Counter", "/pdf-information": "PDF Information", "/extract-bookmarks": "Extract Bookmarks", "/add-bookmarks": "Add Bookmarks", "/bates-numbering": "Bates Numbering", "/pdf-to-tiff": "PDF to TIFF", "/pdf-to-json": "PDF to JSON", "/pdf-to-csv": "PDF to CSV", "/remove-pdf-metadata": "Remove PDF Metadata", "/remove-annotations": "Remove Annotations", "/remove-pdf-links": "Remove PDF Links", "/protect-pdf": "Protect PDF", "/unlock-pdf": "Unlock PDF",
  "/sign-pdf": "Sign PDF", "/edit-pdf-metadata": "Edit PDF Metadata",
};

export default function ToolDirectory() {
  return (
    <section aria-label="Explore PDFora PDF tools" className="border-t border-teal-100 bg-white px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-teal-700">PDFora toolbox</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">Explore PDF tools</h2>
            <p className="mt-1 text-sm text-slate-600">Choose a task and move between PDF tools without returning to the homepage.</p>
          </div>
          <Link href="/#tools" className="text-sm font-bold text-teal-700 hover:text-orange-600">Browse all tools →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map(([label, ...paths]) => (
            <div key={label}>
              <h3 className="mb-3 text-sm font-black text-slate-800">{label}</h3>
              <ul className="space-y-2">
                {paths.map((path) => (
                  <li key={path}>
                    <Link href={path} className="text-sm text-slate-600 underline-offset-4 hover:text-teal-700 hover:underline">{names[path]}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
