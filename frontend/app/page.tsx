"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import AdsterraNative from "./components/AdsterraNative";
import { allTools, type Tool } from "../lib/tool-directory";

const NepalMarketNews = dynamic(() => import("../components/NepalMarketNews"), {
  loading: () => <div className="grid min-h-40 place-items-center rounded-3xl border border-white/10 bg-slate-900/5 text-sm text-slate-500">Loading Nepal market updates…</div>,
});

const categories = ["All", ...Array.from(new Set(["PDF", ...allTools.map((tool) => tool.category)])).sort((a, b) => a.localeCompare(b))];

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
    return allTools.filter((tool) => {
      if (tool.href === "/ocr-pdf") return false;
      const matchesCategory = category === "All" || (category === "PDF" ? tool.kind === "pdf" || tool.category === "PDF" : tool.category === category);
      const searchable = normalize([tool.name, tool.description, tool.category, tool.href.replaceAll("-", " "), tool.keywords, searchTerms[tool.href] || ""].join(" "));
      return matchesCategory && (tokens.length === 0 || tokens.every((token) => searchable.includes(token)));
    });
  }, [query, category]);
  const popularTools = Array.from(new Map([...allTools.filter((tool) => tool.popular), ...allTools.filter((tool) => ["/tools/loan-emi-calculator", "/tools/notes-to-pdf", "/tools/nepal-share-calculator"].includes(tool.href))].map((tool) => [tool.href, tool])).values()).slice(0, 9);
  const searchResults = filteredTools.filter((tool) => tool.href !== "/ocr-pdf");

  return (
    <main className="min-h-screen bg-[#f5f7f6] text-slate-950">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-2 px-3 sm:h-[72px] sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="PDFora home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-600 to-cyan-700 text-sm font-black text-white shadow-lg shadow-teal-900/20">
              P
            </div>

            <span className="text-[22px] font-black tracking-tight text-slate-950">
              PDFora
            </span>
          </Link>

          <nav aria-label="Main navigation" className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <Link href="/ne" lang="ne" className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-2 py-2 text-[11px] font-extrabold text-blue-800 hover:border-blue-400 hover:bg-blue-100 sm:px-3 sm:text-xs">नेपाली</Link>
            <Link href="/market" className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-lg border border-teal-200 bg-teal-50 px-2 py-2 text-[10px] font-bold text-teal-800 hover:border-teal-400 sm:px-3 sm:text-xs">📈 <span className="ml-1">Market</span></Link>
            <Link href="/tools" className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 px-2.5 py-2 text-[10px] font-bold text-white transition hover:bg-slate-800 sm:px-4 sm:text-xs">Tools</Link>
          </nav>
        </div>
      </header>

      {/* PREMIUM HERO */}
      <section className="relative isolate overflow-hidden bg-[#071b1b] px-4 pb-16 pt-14 text-white sm:px-6 sm:pb-24 sm:pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(rgba(148,220,205,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,220,205,.08)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-52 -z-10 h-[34rem] w-[34rem] rounded-full bg-teal-400/20 blur-[110px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-64 left-[-8rem] -z-10 h-[30rem] w-[30rem] rounded-full bg-cyan-500/15 blur-[100px]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/20 bg-white/[0.07] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-teal-100 shadow-inner shadow-white/5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.9)]" />
              Your everyday digital workspace
            </div>
            <h1 className="mt-7 max-w-3xl text-[2.65rem] font-black leading-[1.06] tracking-[-.045em] sm:text-6xl lg:text-[4.35rem]">
              Get more done.
              <span className="mt-1 block bg-gradient-to-r from-teal-200 via-emerald-300 to-cyan-200 bg-clip-text text-transparent">Without the busywork.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              A smarter place for PDF editing, image conversion, calculations, text utilities and Nepal-focused tools. Fast workflows, simple controls and no software to install.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/tools" className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 px-6 py-3.5 text-sm font-extrabold text-[#062321] shadow-xl shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:shadow-emerald-400/20">Explore all tools <span className="ml-2">→</span></Link>
              <Link href="#tools" className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">Browse all tools</Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-300">
              <span className="inline-flex items-center gap-2"><span className="text-emerald-300">✓</span> Free-to-use tools</span>
              <span className="inline-flex items-center gap-2"><span className="text-emerald-300">✓</span> Works on mobile</span>
              <span className="inline-flex items-center gap-2"><span className="text-emerald-300">✓</span> No installation</span>
            </div>
            <div className="mt-10 max-w-2xl rounded-2xl border border-white/15 bg-white/[0.08] p-2 shadow-2xl shadow-black/20 backdrop-blur-xl focus-within:border-teal-300/60">
              <div className="flex items-center gap-3">
                <span className="pl-3 text-xl text-teal-200" aria-hidden="true">⌕</span>
                <input value={query} onChange={(event) => { setQuery(event.target.value); setCategory("All"); }} placeholder="What do you need to do?  e.g. merge PDF, compress image…" className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-400" aria-label="Search PDFora tools" />
                {query && <button type="button" onClick={() => setQuery("")} className="rounded-xl px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10">Clear</button>}
              </div>
            </div>
            {query.trim() && (
              <div className="mt-3 max-h-[min(65vh,32rem)] max-w-2xl overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#102b2a] text-left shadow-2xl" role="region" aria-label="Live tool search results">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs"><span className="font-extrabold text-teal-100">All matching tools</span><span className="text-slate-400">{searchResults.length} results</span></div>
                {searchResults.length ? <div className="divide-y divide-white/10">{searchResults.map(tool=><Link key={tool.href} href={tool.href} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-white/[0.06]"><span className="min-w-0"><span className="block text-sm font-bold text-white">{tool.name}</span><span className="mt-0.5 block truncate text-xs text-slate-400">{tool.description}</span></span><span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-teal-100">{tool.category}</span></Link>)}</div> : <p className="px-4 py-5 text-sm text-slate-300">No matching tools. Try another search.</p>}
              </div>
            )}
          </div>
          <div className="relative mx-auto w-full max-w-[34rem] lg:ml-auto">
            <div aria-hidden="true" className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-teal-300/20 via-transparent to-cyan-400/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-[#153735] to-[#0c2525] p-4 shadow-[0_35px_100px_rgba(0,0,0,.38)] sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-teal-200">PDFora workspace</p><p className="mt-1 text-sm font-bold text-white">Choose your next task</p></div>
                <span className="rounded-xl border border-emerald-200/20 bg-emerald-300/10 px-3 py-1.5 text-[10px] font-bold text-emerald-200">ALL IN ONE</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[{icon:"📄",name:"PDF tools",desc:"Edit & convert",tone:"from-rose-400/20 to-orange-300/5"},{icon:"🖼️",name:"Image tools",desc:"Compress & convert",tone:"from-violet-400/20 to-fuchsia-300/5"},{icon:"🧮",name:"Calculators",desc:"Math & finance",tone:"from-sky-400/20 to-cyan-300/5"},{icon:"🇳🇵",name:"Nepal tools",desc:"Local utilities",tone:"from-emerald-400/20 to-teal-300/5"}].map(item=><Link key={item.name} href="/tools" className={`group rounded-2xl border border-white/10 bg-gradient-to-br ${item.tone} p-4 transition hover:-translate-y-1 hover:border-teal-200/40`}><span className="text-2xl">{item.icon}</span><p className="mt-4 text-sm font-extrabold text-white">{item.name}</p><p className="mt-1 text-[11px] text-slate-300">{item.desc}</p><span className="mt-3 inline-flex text-xs font-bold text-teal-200 transition group-hover:translate-x-1">Explore →</span></Link>)}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                <div><p className="text-xs font-bold text-white">One simple workspace</p><p className="mt-1 text-[10px] text-slate-400">Useful tools for everyday work</p></div><span className="text-2xl text-teal-200">✦</span>
              </div>
            </div>
            <div className="relative mx-auto mt-4 flex max-w-[90%] items-center justify-center gap-5 text-[10px] font-semibold text-slate-400"><span>PDF</span><span className="h-1 w-1 rounded-full bg-teal-300" /><span>IMAGE</span><span className="h-1 w-1 rounded-full bg-teal-300" /><span>FINANCE</span><span className="h-1 w-1 rounded-full bg-teal-300" /><span>NEPAL</span></div>
          </div>
        </div>
      </section>

      {/* POPULAR TOOLS */}
      <section
        aria-labelledby="popular-heading"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-widest text-orange-600">
            Popular
          </p>

          <h2
            id="popular-heading"
            className="mt-1 text-2xl font-black"
          >
            Popular tools
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Quick access to popular PDF tools, calculators and practical utilities.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {popularTools.map((tool) => (
            <ToolCard key={tool.href} tool={tool} popular />
          ))}
        </div>
      </section>

      {/* NON-INTRUSIVE NATIVE AD */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AdsterraNative />
      </div>

      {/* ALL TOOLS */}
      <section
        id="tools"
        aria-labelledby="tools-heading"
        className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-20 sm:px-6 lg:px-8"
      >
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-widest text-orange-600">
            PDFora toolbox
          </p>

          <h2
            id="tools-heading"
            className="mt-1 text-2xl font-black"
          >
            All tools in one place
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Search and open every available PDF tool, calculator, text utility, developer helper, image tool and Nepal-focused service from this one directory.
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

        <p className="mb-4 text-sm text-slate-500" aria-live="polite">{query.trim() ? `Showing ${filteredTools.length} matching tools for “${query}”.` : `Browse ${filteredTools.length} tools. Search by name, task or keyword.`}</p>
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

      {/* NEPAL MARKET UPDATES */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-widest text-rose-600">Nepal market desk</p>
          <h2 className="mt-1 text-2xl font-black">NEPSE, IPO &amp; Nepal market news</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Automatically refreshed market headlines, IPO updates and practical Nepal finance tools. Verify market-sensitive information with the official source.</p>
        </div>
        <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/tools/nepse-market-news" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 font-bold text-rose-900 hover:bg-rose-100">📰 NEPSE &amp; IPO News <span className="mt-1 block text-xs font-medium">Latest headlines</span></Link>
          <Link href="/tools/nepal-share-calculator" className="rounded-2xl border border-slate-200 bg-white p-4 font-bold hover:border-teal-400">📈 Share Profit Calculator <span className="mt-1 block text-xs font-medium text-slate-500">Buy, sell &amp; charges</span></Link>
          <Link href="/tools/nepse-dividend-calculator" className="rounded-2xl border border-slate-200 bg-white p-4 font-bold hover:border-teal-400">💸 Dividend Calculator <span className="mt-1 block text-xs font-medium text-slate-500">Cash &amp; bonus estimate</span></Link>
          <Link href="/tools/nepal-forex-rates" className="rounded-2xl border border-slate-200 bg-white p-4 font-bold hover:border-teal-400">💱 NRB Forex Rates <span className="mt-1 block text-xs font-medium text-slate-500">Official buying &amp; selling</span></Link>
          <Link href="/market" className="rounded-2xl border border-teal-200 bg-teal-50 p-4 font-bold text-teal-950 hover:border-teal-400">📊 NEPSE Market Dashboard <span className="mt-1 block text-xs font-medium text-teal-800">Index charts, stock prices &amp; market movers</span></Link>
        </div>
        <NepalMarketNews />
      </section>



      {/* WHY PDFORA */}
      <section className="border-y border-slate-200 bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-orange-600">
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
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-widest text-orange-600">
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
          <p className="text-xs font-black uppercase tracking-widest text-blue-700">Made for everyday tasks in Nepal</p>
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
          ].map((item) => <Link key={item.href} href={item.href} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-400 hover:shadow-sm"><h3 className="font-bold text-slate-900">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p><span className="mt-4 inline-block text-sm font-semibold text-blue-700">Open tool →</span></Link>)}
        </div>
        <Link href="/tools" className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white">Explore all 100+ tools</Link>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="mx-auto max-w-4xl scroll-mt-20 px-4 py-14 sm:px-6"
      >
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-widest text-orange-600">
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
                  P
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
                className="mt-4 inline-block text-sm font-bold text-white hover:text-orange-400"
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
  return (
    <Link
      href={tool.href}
      className="tool-card group flex h-full flex-col rounded-[1.6rem] border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)] transition duration-300 hover:-translate-y-1.5 hover:border-teal-300 hover:shadow-[0_22px_55px_rgba(15,118,110,.12)] active:scale-[0.99]"
      aria-label={`Open ${tool.name}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-100 text-xl font-black text-teal-800 ring-1 ring-teal-900/5" aria-hidden="true">
          {tool.category === "Finance" ? "💰" : tool.category === "Convert" ? "🔄" : tool.category === "Edit" ? "✏️" : tool.category === "Security" ? "🔒" : tool.category === "Organize" ? "🗂️" : tool.category === "Optimize" ? "⚡" : "📄"}
        </div>

        {popular ? (
          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-black text-orange-600">
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
          <span className="font-extrabold text-blue-700">How to use:</span>{" "}
          {howToUse[tool.href] || "Open this tool, upload the required file, follow the options and download the result."}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm font-bold text-blue-700">
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
      <div className="text-sm font-black text-orange-600">
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
      className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-orange-300 hover:bg-white"
    >
      <h3 className="text-sm font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <span className="mt-4 inline-block text-sm font-bold text-orange-600">
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




