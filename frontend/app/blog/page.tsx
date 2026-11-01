import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "../../lib/blog-posts";

export const metadata: Metadata = {
  title: "Tools, Tutorials & Practical Guides",
  description: "Practical guides for free PDF, text, developer, image, finance and productivity tools.",
  alternates: { canonical: "https://niroj.com.np/blog" },
  openGraph: {
    title: "Tools, Tutorials & Practical Guides | NIROJ Tools",
    description: "Step-by-step Practical guides and practical document tips.",
    url: "https://niroj.com.np/blog",
    siteName: "NIROJ Tools",
    type: "website",
  },
};

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">NIROJ Tools Learning Centre</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Tools, Tutorials & Practical Guides</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">Clear, practical instructions for everyday PDF tasks—from reducing file size for an application upload to converting documents and organising pages.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {blogPosts.map((post) => (
            <article key={post.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">{post.readTime} · Practical guide</p>
              <h2 className="mt-3 text-xl font-black leading-snug text-slate-950">
                <Link className="hover:text-teal-700" href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{post.description}</p>
              <Link className="mt-5 inline-flex font-bold text-teal-700 hover:underline" href={`/blog/${post.slug}`}>Read guide →</Link>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-3xl border border-teal-100 bg-teal-50 p-6">
          <h2 className="text-xl font-black text-slate-950">Need to work on a PDF now?</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">Use NIROJ Tools&apos;s free online tools to merge, split, compress and convert documents.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white" href="/compress-pdf">Compress PDF</Link>
            <Link className="rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-bold text-teal-800" href="/merge-pdf">Merge PDF</Link>
            <Link className="rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-bold text-teal-800" href="/pdf-to-word">PDF to Word</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
