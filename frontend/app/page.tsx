"use client";

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
    description: "Combine multiple PDF files into one document.",
    icon: "M",
    category: "Organize",
    href: "/merge-pdf",
    popular: true,
  },
  {
    name: "Split PDF",
    description: "Extract selected pages from your PDF document.",
    icon: "S",
    category: "Organize",
    href: "/split-pdf",
    popular: true,
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size for easier sharing and storage.",
    icon: "C",
    category: "Optimize",
    href: "/compress-pdf",
    popular: true,
  },
  {
    name: "Images to PDF",
    description: "Convert JPG, PNG or WebP images into a PDF.",
    icon: "I",
    category: "Convert",
    href: "/images-to-pdf",
  },
  {
    name: "PDF to JPG",
    description: "Convert PDF pages into JPG images.",
    icon: "J",
    category: "Convert",
    href: "/pdf-to-jpg",
  },
  {
    name: "PDF to Word",
    description: "Convert PDF files into editable Word documents.",
    icon: "W",
    category: "Convert",
    href: "/pdf-to-word",
  },
  {
    name: "Rotate PDF",
    description: "Rotate PDF pages by 90, 180 or 270 degrees.",
    icon: "R",
    category: "Edit",
    href: "/rotate-pdf",
  },
  {
    name: "Delete Pages",
    description: "Remove unwanted pages from a PDF.",
    icon: "D",
    category: "Edit",
    href: "/delete-pages",
  },
  {
    name: "Extract Pages",
    description: "Create a new PDF from selected pages.",
    icon: "E",
    category: "Edit",
    href: "/extract-pages",
  },
  {
    name: "Watermark PDF",
    description: "Add a custom text watermark to your PDF.",
    icon: "W",
    category: "Security",
    href: "/watermark",
  },
];

const categories = [
  "All",
  "Organize",
  "Optimize",
  "Convert",
  "Edit",
  "Security",
];

const faqs = [
  {
    question: "Is PDFora free to use?",
    answer:
      "PDFora currently provides its available PDF tools without requiring a subscription.",
  },
  {
    question: "Do I need to install software?",
    answer:
      "No. PDFora works directly in your web browser on phones, tablets and computers.",
  },
  {
    question: "What PDF tools are available?",
    answer:
      "PDFora currently provides tools for merging, splitting, compressing, converting, rotating, deleting, extracting and watermarking PDF files.",
  },
  {
    question: "How are my files processed?",
    answer:
      "Files selected for processing are temporarily sent to the PDFora processing backend so the requested operation can be completed.",
  },
  {
    question: "Are my uploaded files stored permanently?",
    answer:
      "PDFora is designed to process uploaded files temporarily rather than maintain a permanent personal file library.",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredTools = useMemo(() => {
    const search = query.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesCategory =
        category === "All" || tool.category === category;

      const matchesSearch =
        !search ||
        tool.name.toLowerCase().includes(search) ||
        tool.description.toLowerCase().includes(search) ||
        tool.category.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [query, category]);

  const popularTools = tools.filter((tool) => tool.popular);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a
            href="/"
            className="flex items-center gap-2"
            aria-label="PDFora home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
              P
            </div>

            <span className="text-xl font-black tracking-tight">
              PDF<span className="text-blue-600">ora</span>
            </span>
          </a>

          <a
            href="#tools"
            className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            Explore Tools
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-slate-200 bg-white px-4 pb-14 pt-14 sm:pb-20 sm:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-lg font-black text-blue-600">
            PDF
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
            Simple PDF tools
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
            Your PDF.
            <br />
            Made simple.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Free, fast and easy-to-use online PDF tools for merging,
            splitting, compressing, converting, editing and protecting your
            documents.
          </p>

          {/* SEARCH */}
          <div className="mx-auto mt-8 flex max-w-2xl items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            <span
              className="pl-3 text-lg text-slate-400"
              aria-hidden="true"
            >
              ⌕
            </span>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search PDF tools..."
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

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-2">
              {tools.length} available tools
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
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-widest text-blue-600">
            Popular
          </p>

          <h2 className="mt-1 text-2xl font-black">
            Most used tools
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {popularTools.map((tool) => (
            <a
              key={tool.href}
              href={tool.href}
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-sm font-black text-blue-600">
                  {tool.icon}
                </div>

                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-600">
                  Popular
                </span>
              </div>

              <h3 className="mt-5 font-black">{tool.name}</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {tool.description}
              </p>

              <div className="mt-4 text-sm font-bold text-blue-600">
                Open tool →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ALL TOOLS */}
      <section
        id="tools"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16 sm:px-6"
      >
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-widest text-blue-600">
            PDFora toolbox
          </p>

          <h2 className="mt-1 text-2xl font-black">
            All PDF tools
          </h2>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
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

        {filteredTools.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-14 text-center">
            <div className="text-3xl">?</div>

            <h2 className="mt-3 text-lg font-black">
              No tools found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try another search or category.
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
              <a
                key={tool.href}
                href={tool.href}
                className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-sm font-black text-blue-600">
                    {tool.icon}
                  </div>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                    {tool.category}
                  </span>
                </div>

                <h2 className="mt-5 text-base font-black">
                  {tool.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {tool.description}
                </p>

                <div className="mt-5 text-sm font-bold text-blue-600">
                  Open tool →
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* WHY PDFORA */}
      <section className="border-y border-slate-200 bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
              Why PDFora
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Built to keep PDF work simple
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <InfoCard
              icon="⚡"
              title="Fast workflow"
              description="Choose a tool, upload your document and start processing with a simple interface."
            />

            <InfoCard
              icon="📱"
              title="Works everywhere"
              description="Use PDFora from a phone, tablet or desktop browser without installing an application."
            />

            <InfoCard
              icon="🔒"
              title="Temporary processing"
              description="Uploaded files are processed by the PDFora backend for the requested operation."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-widest text-blue-600">
            FAQ
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            Frequently asked questions
          </h2>
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
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-black">
                    {faq.question}
                  </span>

                  <span className="text-lg text-slate-400">
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

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-950 px-4 py-12 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-4">
            {/* BRAND */}
            <div>
              <a
                href="/"
                className="flex items-center gap-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950">
                  P
                </div>

                <span className="text-xl font-black">
                  PDFora
                </span>
              </a>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
                Simple online tools for everyday PDF and document tasks.
              </p>
            </div>

            {/* TOOLS */}
            <div>
              <h3 className="text-sm font-black">
                Tools
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
                <a href="/merge-pdf" className="hover:text-white">
                  Merge PDF
                </a>

                <a href="/split-pdf" className="hover:text-white">
                  Split PDF
                </a>

                <a href="/compress-pdf" className="hover:text-white">
                  Compress PDF
                </a>

                <a href="/pdf-to-word" className="hover:text-white">
                  PDF to Word
                </a>

                <a href="/pdf-to-jpg" className="hover:text-white">
                  PDF to JPG
                </a>
              </div>
            </div>

            {/* COMPANY */}
            <div>
              <h3 className="text-sm font-black">
                PDFora
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
                <a href="/about" className="hover:text-white">
                  About
                </a>

                <a href="/contact" className="hover:text-white">
                  Contact
                </a>

                <a href="/privacy" className="hover:text-white">
                  Privacy Policy
                </a>

                <a href="/terms" className="hover:text-white">
                  Terms of Service
                </a>

                <a href="#faq" className="hover:text-white">
                  FAQ
                </a>
              </div>
            </div>

            {/* ABOUT */}
            <div>
              <h3 className="text-sm font-black">
                About PDFora
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                PDFora is a web-based PDF utility platform focused on making
                common document tasks easier and more accessible.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>© 2026 PDFora. All rights reserved.</p>

            <p>
              Developed by Niroj Pokhrel
            </p>
          </div>
        </div>
      </footer>
    </main>
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
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
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