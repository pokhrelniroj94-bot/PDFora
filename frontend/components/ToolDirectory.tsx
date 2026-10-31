import Link from "next/link";

const groups = [["Organize PDF","/merge-pdf","/split-pdf","/reorder-pdf","/delete-pages","/extract-pages"],["Convert PDF","/pdf-to-word","/pdf-to-excel","/pdf-to-jpg","/images-to-pdf","/pdf-to-png","/pdf-to-webp","/pdf-to-text"],["Edit PDF","/rotate-pdf","/crop-pdf","/watermark","/add-page-numbers","/header-footer","/grayscale-pdf"],["Secure PDF","/protect-pdf","/unlock-pdf","/sign-pdf","/edit-pdf-metadata"]] as const;
const names: Record<string, string> = {"/merge-pdf":"Merge PDF","/split-pdf":"Split PDF","/compress-pdf":"Compress PDF","/pdf-to-word":"PDF to Word","/pdf-to-excel":"PDF to Excel","/pdf-to-jpg":"PDF to JPG","/images-to-pdf":"JPG to PDF","/rotate-pdf":"Rotate PDF","/delete-pages":"Delete PDF Pages","/extract-pages":"Extract PDF Pages","/reorder-pdf":"Reorder PDF Pages","/add-page-numbers":"Add Page Numbers","/crop-pdf":"Crop PDF","/watermark":"Watermark PDF","/protect-pdf":"Protect PDF","/unlock-pdf":"Unlock PDF","/sign-pdf":"Sign PDF","/pdf-to-png":"PDF to PNG","/pdf-to-webp":"PDF to WebP","/pdf-to-text":"PDF to Text","/extract-images":"Extract Images from PDF","/pdf-to-html":"PDF to HTML","/compare-pdf":"Compare PDF","/remove-blank-pages":"Remove Blank PDF Pages","/grayscale-pdf":"Grayscale PDF","/flatten-pdf":"Flatten PDF","/edit-pdf-metadata":"Edit PDF Metadata","/repair-pdf":"Repair PDF","/header-footer":"Add Header or Footer"};

export default function ToolDirectory() {
  return (
    <section aria-label="Explore all Niroj77 PDF tools" className="border-t border-teal-100 bg-white px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-xs font-black uppercase tracking-widest text-teal-700">Niroj77 toolbox</p><h2 className="mt-1 text-xl font-black text-slate-900">More free PDF tools</h2><p className="mt-1 text-sm text-slate-600">Move between PDF tasks without returning to the homepage.</p></div>
          <Link href="/#tools" className="text-sm font-bold text-teal-700 hover:text-orange-600">Browse all tools →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map(([label, ...paths]) => <div key={label}><h3 className="mb-3 text-sm font-black text-slate-800">{label}</h3><ul className="space-y-2">{paths.map((path) => <li key={path}><Link href={path} className="text-sm text-slate-600 underline-offset-4 hover:text-teal-700 hover:underline">{names[path]}</Link></li>)}</ul></div>)}
        </div>
      </div>
    </section>
  );
}
