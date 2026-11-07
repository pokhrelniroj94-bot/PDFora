import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, isRoutable } from "../../../../lib/i18n/config";
import { getNepaliLocalizedBlogPost, nepaliLocalizedBlogPosts } from "../../../../lib/nepali-localized-blog-posts";
import { buildLocaleMetadata } from "../../../../lib/i18n/metadata";

const baseUrl = "https://pd-fora.vercel.app";
type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return nepaliLocalizedBlogPosts.map((post) => ({ locale: "ne", slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getNepaliLocalizedBlogPost(slug);
  if (locale !== "ne" || !post) return { title: "Article not found", robots: { index: false, follow: true } };
  return buildLocaleMetadata({ locale, path: `/blog/${post.slug}`, title: `${post.title} | PDFora`, description: post.description });
}

export default async function NepaliBlogArticle({ params }: Props) {
  const { locale, slug } = await params;
  const post = getNepaliLocalizedBlogPost(slug);
  if (locale !== "ne" || !isLocale(locale) || !isRoutable(locale) || !post) notFound();
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.updated,
    dateModified: post.updated,
    inLanguage: "ne",
    mainEntityOfPage: `${baseUrl}/ne/blog/${post.slug}`,
    author: { "@type": "Organization", name: "PDFora", url: baseUrl },
    publisher: { "@type": "Organization", name: "PDFora", url: baseUrl },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "गृहपृष्ठ", item: `${baseUrl}/ne` },
      { "@type": "ListItem", position: 2, name: "मार्गदर्शिका", item: `${baseUrl}/ne/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${baseUrl}/ne/blog/${post.slug}` },
    ],
  };
  return (
    <main lang="ne" className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <article className="mx-auto max-w-3xl">
        <nav aria-label="ब्रेडक्रम" className="text-sm text-slate-500">
          <Link href="/ne" className="hover:text-teal-700">गृहपृष्ठ</Link><span className="mx-2">/</span>
          <Link href="/ne/blog" className="hover:text-teal-700">मार्गदर्शिका</Link><span className="mx-2">/</span>
          <span className="text-slate-700">लेख</span>
        </nav>
        <header className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">PDFora नेपाली मार्गदर्शिका · {post.readTime}</p>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">{post.title}</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">{post.intro}</p>
          <p className="mt-5 text-xs text-slate-500">अद्यावधिक: {post.updated}</p>
        </header>
        <div className="mt-6 space-y-6">
          {post.sections.map((section) => (
            <section key={section.heading} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-black text-slate-950">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-sm leading-8 text-slate-700">{paragraph}</p>)}
              {section.bullets && <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ol>}
            </section>
          ))}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">बारम्बार सोधिने प्रश्न</h2>
            <div className="mt-5 space-y-5">
              {post.faqs.map((faq) => <div key={faq.question}><h3 className="font-bold text-slate-950">{faq.question}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{faq.answer}</p></div>)}
            </div>
          </section>
          <section className="rounded-3xl border border-teal-100 bg-teal-50 p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">सम्बन्धित टुल</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {post.toolLinks.map((tool) => <Link key={tool.href} href={tool.href.replace(/^\/tools/, "/ne/tools")} className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800">{tool.label}</Link>)}
            </div>
          </section>
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6 text-sm">
          <Link href="/ne/blog" className="font-bold text-teal-700 hover:underline">← सबै मार्गदर्शिका</Link>
          <Link href="/ne" className="font-bold text-teal-700 hover:underline">PDFora गृहपृष्ठ</Link>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
