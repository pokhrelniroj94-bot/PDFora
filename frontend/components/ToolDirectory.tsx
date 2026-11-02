import Link from "next/link";

const groups = [
  ["Organize", "/merge-pdf", "/split-pdf", "/reorder-pdf", "/delete-pages", "/extract-pages", "/add-blank-pages", "/remove-blank-pages", "/add-bookmarks", "/split-by-bookmarks", "/bates-numbering"],
  ["Optimize", "/compress-pdf"],
  ["Convert", "/pdf-to-word", "/pdf-to-excel", "/pdf-to-jpg", "/images-to-pdf", "/pdf-to-png", "/pdf-to-webp", "/pdf-to-text", "/pdf-to-html", "/pdf-to-tiff", "/pdf-to-bmp", "/pdf-to-markdown", "/pdf-to-json", "/pdf-to-csv"],
  ["Edit", "/rotate-pdf", "/rotate-selected-pages", "/crop-pdf", "/watermark", "/add-page-numbers", "/header-footer", "/grayscale-pdf", "/flatten-pdf", "/repair-pdf", "/add-background"],
  ["Security", "/protect-pdf", "/unlock-pdf", "/sign-pdf", "/edit-pdf-metadata", "/remove-pdf-metadata", "/remove-attachments", "/remove-pdf-links", "/remove-annotations"],
  ["Extract", "/extract-bookmarks", "/extract-fonts", "/extract-page-images", "/extract-images"],
  ["Analyze", "/page-counter", "/pdf-information", "/compare-pdf"],
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
  "/compare-pdf": "Compare PDF", "/add-blank-pages": "Add Blank Pages", "/rotate-selected-pages": "Rotate Selected Pages", "/page-counter": "PDF Page Counter", "/pdf-information": "PDF Information", "/extract-bookmarks": "Extract Bookmarks", "/add-bookmarks": "Add Bookmarks", "/bates-numbering": "Bates Numbering", "/pdf-to-tiff": "PDF to TIFF", "/pdf-to-bmp": "PDF to BMP", "/pdf-to-markdown": "PDF to Markdown", "/extract-page-images": "Extract Images by Page", "/extract-fonts": "Extract Fonts", "/split-by-bookmarks": "Split by Bookmarks", "/remove-attachments": "Remove Attachments", "/add-background": "Add Background", "/pdf-to-json": "PDF to JSON", "/pdf-to-csv": "PDF to CSV", "/remove-pdf-metadata": "Remove PDF Metadata", "/remove-annotations": "Remove Annotations", "/remove-pdf-links": "Remove PDF Links", "/protect-pdf": "Protect PDF", "/unlock-pdf": "Unlock PDF",
  "/sign-pdf": "Sign PDF", "/edit-pdf-metadata": "Edit PDF Metadata",
};

const categoryLinks = [
  { href: "/tools/calculators", title: "Calculators", description: "Finance, business, math and everyday calculators", icon: "🧮" },
  { href: "/tools/pdf", title: "PDF Tools", description: "Merge, split, compress, convert, edit and secure PDFs", icon: "📄" },
  { href: "/tools/nepal", title: "Nepal Tools", description: "Nepali calendar, Panchang, Kundali, NEPSE and more", icon: "🇳🇵" },
  { href: "/tools", title: "All Tools", description: "Browse the complete searchable tool directory", icon: "🧰" },
];

export default function ToolDirectory() {
  return (
    <section aria-label="Explore PDFora tools" className="border-t border-teal-100 bg-white px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-widest text-teal-700">PDFora toolbox</p>
          <h2 className="mt-1 text-xl font-black text-slate-900">Explore tools by category</h2>
          <p className="mt-1 text-sm text-slate-600">Choose a category to see only the tools you need.</p>
        </div>
        <nav aria-label="Browse tool categories" className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categoryLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-300 hover:bg-teal-50">
              <span className="text-2xl" aria-hidden="true">{item.icon}</span>
              <span className="mt-2 block font-bold text-slate-900">{item.title}</span>
              <span className="mt-1 block text-sm leading-5 text-slate-600">{item.description}</span>
            </Link>
          ))}
        </nav>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900">Explore PDF tools</h2>
            <p className="mt-1 text-sm text-slate-600">Quick links to PDF processing tools.</p>
          </div>
          <Link href="/tools/pdf" className="text-sm font-bold text-teal-700 hover:text-orange-600">View all PDF tools →</Link>
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
