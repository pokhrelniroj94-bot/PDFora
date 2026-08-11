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
    icon: "↔",
    category: "Organize",
    href: "/merge-pdf",
  },
  {
    name: "Split PDF",
    description: "Separate pages or extract selected pages.",
    icon: "✂",
    category: "Organize",
    href: "/split-pdf",
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF size while keeping good quality.",
    icon: "↓",
    category: "Optimize",
    href: "/compress-pdf",
  },
  {
    name: "PDF to Word",
    description: "Convert PDF documents into editable Word files.",
    icon: "W",
    category: "Convert",
    href: "/pdf-to-word",
  },
  {
    name: "Word to PDF",
    description: "Convert Word documents into PDF format.",
    icon: "P",
    category: "Convert",
    href: "/word-to-pdf",
  },
  {
    name: "JPG to PDF",
    description: "Turn images into a clean PDF document.",
    icon: "J",
    category: "Convert",
    href: "/jpg-to-pdf",
  },
  {
    name: "PDF to JPG",
    description: "Convert PDF pages into high-quality images.",
    icon: "I",
    category: "Convert",
    href: "/pdf-to-jpg",
  },
  {
    name: "PDF Editor",
    description: "Add text, images, shapes, highlights and annotations.",
    icon: "✎",
    category: "Edit",
    href: "/pdf-editor",
  },
  {
    name: "Protect PDF",
    description: "Protect your PDF with password-based security.",
    icon: "⌑",
    category: "Security",
    href: "/protect-pdf",
  },
  {
    name: "Rotate PDF",
    description: "Rotate PDF pages to the correct orientation.",
    icon: "↻",
    category: "Organize",
    href: "/rotate-pdf",
  },
  {
    name: "Watermark PDF",
    description: "Add text or image watermarks to your PDF.",
    icon: "◇",
    category: "Edit",
    href: "/watermark-pdf",
  },
  {
    name: "OCR PDF",
    description: "Make scanned documents searchable and readable.",
    icon: "T",
    category: "Convert",
    href: "/ocr-pdf",
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
      const categoryMatch =
        category === "All" || tool.category === category;

      const searchMatch =
        search === "" ||
        tool.name.toLowerCase().includes(search) ||
        tool.description.toLowerCase().includes(search) ||
        tool.category.toLowerCase().includes(search);

      return categoryMatch && searchMatch;
    });
  }, [query, category]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <a href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 font-black text-white">
              P
            </div>

            <span className="text-xl font-black">
              PDF<span className="text-blue-600">ora</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
            <a href="#tools" className="hover:text-slate-950">
              Tools
            </a>

            <a href="#security" className="hover:text-slate-950">
              Security
            </a>

            <a href="#about" className="hover:text-slate-950">
              About
            </a>
          </nav>

          <a
            href="#tools"
            className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
          >
            Explore Tools
          </a>

        </div>
      </header>


      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_50%)]" />

        <div className="mx-auto max-w-5xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pb-20 sm:pt-24">

          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold text-blue-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Free PDF tools for everyone
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Powerful PDF tools.
            <br />
            <span className="text-blue-600">
              Simple. Secure. Free.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Convert, compress, edit, merge, split and manage your PDF files
            without complicated software or subscriptions.
          </p>


          {/* SEARCH */}
          <div className="mx-auto mt-9 max-w-2xl">
            <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">

              <span className="pl-3 text-xl text-slate-400">
                ⌕
              </span>

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="What do you want to do with your PDF?"
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400 sm:text-base"
              />

              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById("tools")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hidden rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 sm:block"
              >
                Find Tool
              </button>

            </div>
          </div>


          <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-500">
            <span>✓ No subscription</span>
            <span>✓ Easy to use</span>
            <span>✓ Privacy focused</span>
          </div>

        </div>
      </section>


      {/* TOOLS */}
      <section
        id="tools"
        className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
      >

        <div className="mb-8">

          <p className="text-sm font-bold text-blue-600">
            PDF TOOLS
          </p>

          <h2 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
            Everything you need
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Choose a tool and get straight to work.
          </p>

        </div>


        {/* CATEGORY BUTTONS */}
        <div className="mb-8 flex flex-wrap gap-2">

          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={
                category === item
                  ? "rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white"
                  : "rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-950"
              }
            >
              {item}
            </button>
          ))}

        </div>


        {/* TOOL GRID */}
        {filteredTools.length > 0 ? (

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredTools.map((tool) => (

              <a
                key={tool.name}
                href={tool.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-black text-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                    {tool.icon}
                  </div>

                  <span className="text-xl text-slate-300 group-hover:text-blue-500">
                    →
                  </span>

                </div>

                <h3 className="mt-5 font-extrabold">
                  {tool.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {tool.description}
                </p>

              </a>

            ))}

          </div>

        ) : (

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

            <div className="text-4xl">
              ⌕
            </div>

            <h3 className="mt-4 text-xl font-black">
              No tool found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another PDF tool name.
            </p>

            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
              className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              Show all tools
            </button>

          </div>

        )}

      </section>


      {/* SECURITY */}
      <section
        id="security"
        className="border-y border-slate-200 bg-white"
      >

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">

          <div>

            <p className="text-sm font-bold text-blue-600">
              PRIVACY FIRST
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Your documents deserve protection.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              PDFora is being designed around secure file processing,
              temporary processing and privacy-focused document handling.
            </p>

          </div>


          <div className="grid gap-4 sm:grid-cols-2">

            <SecurityCard
              number="01"
              title="Temporary processing"
              description="Files will be processed temporarily rather than stored permanently."
            />

            <SecurityCard
              number="02"
              title="Secure validation"
              description="Uploaded files will be validated before processing."
            />

            <SecurityCard
              number="03"
              title="Free tools"
              description="Core PDF tools will be available without subscriptions."
            />

            <SecurityCard
              number="04"
              title="Simple workflow"
              description="Upload, process and download without unnecessary steps."
            />

          </div>

        </div>

      </section>


      {/* ABOUT */}
      <section
        id="about"
        className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6"
      >

        <p className="text-sm font-bold text-blue-600">
          PDFora
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          PDF work without the hassle.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          A simple document utility platform designed to make everyday PDF
          tasks faster, clearer and easier for everyone.
        </p>

      </section>


      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-300">

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

          <div>

            <div className="text-xl font-black text-white">
              PDF<span className="text-blue-400">ora</span>
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Powerful PDF tools. Simple. Secure. Free.
            </p>

          </div>


          <div className="flex flex-wrap gap-6 text-sm">

            <a href="/privacy" className="hover:text-white">
              Privacy
            </a>

            <a href="/security" className="hover:text-white">
              Security
            </a>

            <a href="/terms" className="hover:text-white">
              Terms
            </a>

            <a href="/contact" className="hover:text-white">
              Contact
            </a>

          </div>

        </div>


        <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} PDFora. All rights reserved.
        </div>

      </footer>

    </main>
  );
}


function SecurityCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

      <span className="text-xs font-black text-blue-600">
        {number}
      </span>

      <h3 className="mt-3 font-extrabold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}
