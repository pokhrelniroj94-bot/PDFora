"use client";

import { useMemo, useState } from "react";

type Tool = {
  name: string;
  description: string;
  icon: string;
  category: string;
  href: string;
};

const tools: Tool[] = [
  {
    name: "Merge PDF",
    description: "Combine multiple PDF files into one document.",
    icon: "M",
    category: "Organize",
    href: "/merge-pdf",
  },
  {
    name: "Split PDF",
    description: "Split a PDF into selected pages.",
    icon: "S",
    category: "Organize",
    href: "/split-pdf",
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size.",
    icon: "C",
    category: "Optimize",
    href: "/compress-pdf",
  },
  {
    name: "Images to PDF",
    description: "Convert JPG or PNG images into PDF.",
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
    name: "Rotate PDF",
    description: "Rotate PDF pages quickly.",
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
    description: "Add a text watermark to every page.",
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

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filteredTools = useMemo(() => {
    const search = query.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesCategory =
        category === "All" || tool.category === category;

      const matchesSearch =
        !search ||
        tool.name.toLowerCase().includes(search) ||
        tool.description.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [query, category]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
              P
            </div>
            <span className="text-xl font-black">
              PDF<span className="text-blue-600">ora</span>
            </span>
          </a>

          <a
            href="#tools"
            className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white"
          >
            Tools
          </a>
        </div>
      </header>

      <section className="px-4 pb-12 pt-12 sm:pb-16 sm:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-xl font-black text-blue-600">
            PDF
          </div>

          <p className="mt-5 text-sm font-bold text-blue-600">
            SIMPLE PDF TOOLS
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">
            Your PDF. Made simple.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Free, fast and easy-to-use PDF tools for your phone and computer.
          </p>

          <div className="mx-auto mt-7 flex max-w-2xl items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            <span className="pl-3 text-slate-400">⌕</span>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search PDF tools..."
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"
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
        </div>
      </section>

      <section
        id="tools"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16"
      >
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={
                category === item
                  ? "shrink-0 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-bold text-white"
                  : "shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600"
              }
            >
              {item}
            </button>
          ))}
        </div>

        {filteredTools.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center">
            <div className="text-3xl">?</div>
            <h2 className="mt-3 text-lg font-black">
              No tools found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Try another search.
            </p>
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

      <section className="border-t border-slate-200 bg-white px-4 py-12">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
          <InfoCard
            title="Mobile friendly"
            description="Designed to be comfortable on phones, tablets and computers."
          />

          <InfoCard
            title="Simple"
            description="Choose a tool, upload your file and process it."
          />

          <InfoCard
            title="Private"
            description="Files are processed by the PDFora backend."
          />
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8 text-center">
        <p className="text-sm font-black">
          PDF<span className="text-blue-600">ora</span>
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Simple PDF tools for everyone.
        </p>
      </footer>
    </main>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-600">
        ✓
      </div>

      <h3 className="mt-3 text-sm font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
