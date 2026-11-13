import Link from "next/link";
import AdsterraNative from "../../components/AdsterraNative";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost, isCatalogGeneratedGuide } from "../../../lib/blog-posts";
import { hreflangMap } from "../../../lib/i18n/routing";

const baseUrl = "https://pd-fora.vercel.app";

function fitMetaDescription(value: string, max = 155): string {
  const clean = value.replace(/\\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const shortened = clean.slice(0, max - 1);
  const boundary = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, boundary > 110 ? boundary : max - 1).replace(/[,:;–-]+$/, "")}.`;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Article not found" };
  const url = `${baseUrl}/blog/${post.slug}`;
  const languages = hreflangMap(`/blog/${post.slug}`);
  const description = fitMetaDescription(post.description);
  return {
    title: post.title,
    description,
    alternates: { canonical: url, ...(languages ? { languages } : {}) },
    robots: isCatalogGeneratedGuide(post.slug) ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { type: "article", url, siteName: "PDFora", title: post.title, description, modifiedTime: `${post.updated}T00:00:00+05:45` },
    twitter: { card: "summary", title: post.title, description },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    dateModified: `${post.updated}T00:00:00+05:45`,
    inLanguage: "en",
    mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
    author: { "@type": "Organization", name: "PDFora Editorial Team", url: `${baseUrl}/about` },
    publisher: { "@type": "Organization", name: "PDFora", url: baseUrl },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${baseUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${baseUrl}/blog/${post.slug}` },
    ],
  };
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <article className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <Link href="/" className="hover:text-teal-700">Home</Link><span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-teal-700">Blog</Link><span className="mx-2">/</span>
          <span aria-current="page" className="text-slate-700">{post.title}</span>
        </nav>
        <header className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">PDFora Guide · {post.readTime}</p>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">{post.title}</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">{post.intro}</p>
          <p className="mt-5 text-xs text-slate-500">Published by PDFora · Last updated {new Date(post.updated + "T00:00:00Z").toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}</p>
        </header>

        <div className="mt-6 space-y-6">
          {post.sections.map((section) => (
            <section key={section.heading} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-black text-slate-950">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-sm leading-8 text-slate-700">{paragraph}</p>)}
              {section.bullets && <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ol>}
            </section>
          ))}
          {post.sources && post.sources.length > 0 && <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8" aria-labelledby="official-sources-heading">
            <h2 id="official-sources-heading" className="text-xl font-black text-slate-950">Official and technical references</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-teal-700">{post.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="font-semibold underline">{source.label}</a></li>)}</ul>
          </section>}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">Frequently asked questions</h2>
            <div className="mt-5 space-y-5">
              {post.faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-bold text-slate-950">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-3xl border border-teal-100 bg-teal-50 p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">Try a related tool</h2>
            <p className="mt-2 text-sm leading-7 text-slate-700">Continue with a related PDFora utility when you are ready to put this guide into practice.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {post.toolLinks.map((tool) => <Link key={tool.href} href={tool.href} className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800">{tool.label}</Link>)}
            </div>
          </section>
        </div>
        <div className="mt-8"><AdsterraNative /></div>
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6 text-sm">
          <Link href="/blog" className="font-bold text-teal-700 hover:underline">← All guides</Link>
          <Link href="/" className="font-bold text-teal-700 hover:underline">PDFora home</Link>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
