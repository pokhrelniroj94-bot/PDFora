import Link from "next/link";
import type { HindiEditorialPost } from "../lib/i18n/hindi-editorial-types";

const baseUrl = "https://pd-fora.vercel.app";

/** Server-rendered Hindi editorial article: one H1, H2 sections, visible FAQ, Hindi tool links and Article JSON-LD. */
export default function HindiEditorialArticle({ post }: { post: HindiEditorialPost }) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    inLanguage: "hi",
    dateModified: `${post.updated}T00:00:00+05:45`,
    mainEntityOfPage: `${baseUrl}/hi/blog/${post.slug}`,
    author: { "@type": "Organization", name: "PDFora", url: baseUrl },
    publisher: { "@type": "Organization", name: "PDFora", url: baseUrl },
  };
  return (
    <main lang="hi" className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <nav aria-label="ब्रेडक्रम्ब" className="text-sm text-slate-500"><Link href="/hi">होम</Link> / <Link href="/hi/blog">हिंदी गाइड</Link></nav>
      <article className="mt-6">
        <p className="text-sm font-bold text-teal-700">PDFora · हिंदी गाइड · {post.readTime}</p>
        <h1 className="mt-3 text-3xl font-black leading-tight">{post.title}</h1>
        <p className="mt-5 text-base leading-8 text-slate-700">{post.intro}</p>
        <div className="mt-8 space-y-5">
          {post.sections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-black">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 48)} className="mt-3 text-sm leading-8 text-slate-700">{paragraph}</p>)}
              {section.bullets && <ol className="mt-3 list-decimal space-y-1.5 pl-6 text-sm leading-7 text-slate-700">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ol>}
            </section>
          ))}
        </div>
        <section className="mt-8" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-xl font-black">अक्सर पूछे जाने वाले प्रश्न</h2>
          <div className="mt-4 space-y-4">
            {post.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-900">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-8 rounded-2xl bg-teal-50 p-6">
          <h2 className="font-black">संबंधित हिंदी टूल</h2>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {post.toolLinks.map((tool) => <li key={tool.href}><Link className="font-bold text-teal-800 underline" href={tool.href}>{tool.label} खोलें →</Link></li>)}
          </ul>
        </section>
        {post.sources && post.sources.length > 0 && (
          <section className="mt-6 text-sm text-slate-600">
            <h2 className="font-bold text-slate-800">स्रोत</h2>
            <ul className="mt-2 list-disc pl-6">{post.sources.map((source) => <li key={source.url}><a className="underline" href={source.url} rel="noopener noreferrer" target="_blank" hrefLang="en" lang="en">{source.label}</a></li>)}</ul>
          </section>
        )}
        <p className="mt-6 text-xs text-slate-500">अंतिम समीक्षा: {post.updated}। यह लेख PDFora के अंग्रेज़ी लेख <Link className="underline" href={`/blog/${post.sourceSlug}`} hrefLang="en" lang="en">के आधार पर</Link> हिंदी में लिखा गया है।</p>
      </article>
    </main>
  );
}
