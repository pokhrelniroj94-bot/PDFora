"use client";

import Link from "next/link";
import AdsterraNative from "./components/AdsterraNative";
import Adsterra160x600 from "./components/Adsterra160x600";
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
  { name: "Reorder PDF Pages", description: "Change the order of pages in a PDF document.", icon: "N", category: "Organize", href: "/reorder-pdf" },
  { name: "Add Page Numbers", description: "Insert page numbers into your PDF.", icon: "N", category: "Edit", href: "/add-page-numbers" },
  { name: "Crop PDF", description: "Crop page margins in a PDF.", icon: "N", category: "Edit", href: "/crop-pdf" },
  { name: "Add Header or Footer", description: "Add a text header to every page.", icon: "N", category: "Edit", href: "/header-footer" },
  { name: "Protect PDF", description: "Encrypt your PDF with a password.", icon: "N", category: "Security", href: "/protect-pdf" },
  { name: "Unlock PDF", description: "Unlock a PDF using its existing password.", icon: "N", category: "Security", href: "/unlock-pdf" },
  { name: "Sign PDF", description: "Add a visible typed signature to a PDF.", icon: "N", category: "Security", href: "/sign-pdf" },
  { name: "PDF to PNG", description: "Convert PDF pages to PNG images.", icon: "N", category: "Convert", href: "/pdf-to-png" },
  { name: "PDF to WebP", description: "Convert PDF pages to WebP images.", icon: "N", category: "Convert", href: "/pdf-to-webp" },
  { name: "PDF to Text", description: "Extract selectable text from a PDF.", icon: "N", category: "Convert", href: "/pdf-to-text" },
  { name: "Grayscale PDF", description: "Convert PDF pages to grayscale.", icon: "N", category: "Edit", href: "/grayscale-pdf" },
  { name: "Flatten PDF", description: "Apply form appearances and remove annotations where supported.", icon: "N", category: "Edit", href: "/flatten-pdf" },
  { name: "Edit PDF Metadata", description: "Change PDF title, author, subject and keywords.", icon: "N", category: "Edit", href: "/edit-pdf-metadata" },
  { name: "Repair PDF", description: "Attempt best-effort recovery of damaged PDFs.", icon: "N", category: "Edit", href: "/repair-pdf" },
  { name: "PDF to HTML", description: "Export selectable PDF text as an HTML document.", icon: "H", category: "Convert", href: "/pdf-to-html" },
  { name: "Extract Images", description: "Extract embedded images from a PDF into a ZIP file.", icon: "I", category: "Convert", href: "/extract-images" },
  { name: "Remove Blank Pages", description: "Detect and remove empty pages from a PDF.", icon: "B", category: "Edit", href: "/remove-blank-pages" },
  { name: "Compare PDF", description: "Compare text in two PDFs and download a difference report.", icon: "C", category: "Edit", href: "/compare-pdf" },
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
        tool.category.toLowerCase().includes(search) ||
        ({ "merge-pdf": "combine pdf join pdf files pdf merger", "split-pdf": "separate pdf extract pdf pages", "compress-pdf": "reduce pdf size shrink pdf optimize pdf", "images-to-pdf": "jpg to pdf png to pdf photo to pdf", "pdf-to-jpg": "convert pdf to jpg jpeg", "pdf-to-word": "pdf to doc docx converter", "pdf-to-excel": "pdf to xlsx spreadsheet converter", "rotate-pdf": "turn pdf pages", "delete-pages": "remove pdf pages", "extract-pages": "save selected pdf pages", "watermark": "add watermark pdf", "protect-pdf": "password protect pdf encrypt pdf", "unlock-pdf": "remove pdf password", "pdf-to-text": "extract text from pdf", "pdf-to-png": "pdf image converter", "pdf-to-webp": "convert pdf to webp", "extract-images": "extract pictures from pdf", "compare-pdf": "compare two pdf documents diff", "remove-blank-pages": "delete empty pages pdf" }[tool.href.replace(/^\//, "")] || "").includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [query, category]);

  const popularTools = tools.filter((tool) => tool.popular);

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
            href="#tools"
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
            and edit documents online for free. No software installation needed.
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
              placeholder="Search: merge PDF, compress PDF, PDF to Word..."
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
            Popular PDF tools
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

      <AdsterraNative />

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
            All PDF tools
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Choose a PDF tool below to process your document online.
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

      <Adsterra160x600 />

      {/* WHY PDFORA */}
      <section className="border-y border-slate-200 bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-violet-600">
              Why PDFora
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Built to keep PDF work simple
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
            Process a PDF in three simple steps
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
                Simple online tools for everyday PDF and document tasks.
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
                PDFora is a web-based PDF utility platform focused on
                providing simple tools for common document-processing tasks.
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
  return (
    <Link
      href={tool.href}
      className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-md active:scale-[0.99]"
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

      <div className="mt-5 text-sm font-bold text-violet-600">
        Open tool →
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




