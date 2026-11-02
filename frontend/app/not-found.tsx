import Link from "next/link";

const popularTools = [
  { href: "/merge-pdf", label: "Merge PDF" },
  { href: "/compress-pdf", label: "Compress PDF" },
  { href: "/pdf-to-word", label: "PDF to Word" },
  { href: "/nepali-date-converter", label: "Nepali Date Converter" },
  { href: "/tools", label: "Explore all tools" },
];

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-slate-50 px-4 py-16 text-slate-950">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-700">404 · Page not found</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight">We couldn&apos;t find that page.</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">The link may be outdated or the page may have moved. Try one of these popular PDFora tools.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {popularTools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 hover:border-teal-400 hover:bg-teal-50">
              {tool.label}
            </Link>
          ))}
        </div>
        <Link href="/" className="mt-8 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">Back to homepage</Link>
      </div>
    </main>
  );
}
