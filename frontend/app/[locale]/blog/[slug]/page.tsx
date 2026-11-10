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
  // Keep search titles concise without changing the reader-facing article headline.
  const searchTitles: Record<string, string> = {
    "nepali-date-converter-bs-to-ad-guide": "नेपाली मिति BS–AD रूपान्तरण",
    "neb-gpa-calculator-nepal-guide": "NEB GPA क्याल्कुलेटर: ग्रेड र क्रेडिट",
    "nepal-vat-calculator-13-percent-guide": "नेपालमा १३% VAT कसरी गणना गर्ने?",
    "ropani-aana-paisa-daam-land-measurement-guide": "रोपनी–आना–पैसा–दाम जग्गा नाप",
    "tola-to-gram-gold-weight-conversion-nepal": "तोला र ग्राम: सुनको तौल रूपान्तरण",
    "nepali-number-to-words-lakh-crore-guide": "हजार, लाख र करोड: अङ्कलाई अक्षरमा",
    "nepal-mobile-number-format-checker-guide": "नेपाल मोबाइल नम्बरको ढाँचा जाँच",
    "nepal-public-holidays-2083-calendar-guide": "नेपालका सार्वजनिक बिदा २०८३",
    "nepal-rastra-bank-daily-exchange-rates-guide": "NRB दैनिक विनिमय दर कसरी हेर्ने?",
    "nepal-salary-income-tax-calculator-2083-84-guide": "नेपाल तलब कर २०८३/८४",
    "nepse-cash-dividend-and-bonus-share-calculator-guide": "NEPSE नगद लाभांश र बोनस सेयर",
    "nepse-market-news-and-ipo-updates": "NEPSE समाचार र IPO सूचना पुष्टि",
    "nepse-share-buy-sell-profit-calculator-guide": "NEPSE सेयर नाफा र कारोबार लागत",
    "preeti-to-unicode-nepali-font-converter-guide": "Preeti बाट Unicode नेपाली रूपान्तरण",
    "nepali-calendar-bs-month-guide": "नेपाली पात्रो: महिना र बार",
    "compress-pdf-to-under-1mb-online": "PDF लाई १MB भित्र कसरी कम्प्रेस गर्ने?",
    "convert-jpg-images-to-one-pdf-on-phone": "मोबाइलमा JPG फोटोबाट PDF बनाउने",
    "convert-pdf-pages-to-jpg-images": "PDF पृष्ठलाई JPG मा बदल्ने",
    "convert-pdf-table-to-excel-spreadsheet": "PDF तालिकालाई Excel मा बदल्ने",
    "convert-pdf-to-editable-word-document": "PDF लाई सम्पादनयोग्य Word मा बदल्ने",
    "merge-multiple-pdf-files-into-one-document": "धेरै PDF एउटै फाइलमा जोड्ने",
    "split-pdf-and-extract-selected-pages": "PDF पृष्ठ विभाजन र निकाल्ने",
    "english-to-nepali-digits-converter-guide": "अङ्ग्रेजी र नेपाली अङ्क रूपान्तरण",
    "loksewa-online-form-photo-resizer-guide": "लोकसेवा फारामका लागि फोटो रिसाइज",
    "nea-electricity-bill-calculator-nepal-guide": "नेपाल बिजुली बिल कसरी जाँच्ने?",
  };
  const searchTitle = searchTitles[post.slug] ?? post.title;
  return buildLocaleMetadata({ locale, path: `/blog/${post.slug}`, title: searchTitle, description: post.description });
}

export default async function NepaliBlogArticle({ params }: Props) {
  const { locale, slug } = await params;
  const post = getNepaliLocalizedBlogPost(slug);
  if (locale !== "ne" || !isLocale(locale) || !isRoutable(locale) || !post) notFound();
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    dateModified: `${post.updated}T00:00:00+05:45`,
    inLanguage: "ne",
    mainEntityOfPage: `${baseUrl}/ne/blog/${post.slug}`,
    author: { "@type": "Organization", name: "PDFora", url: `${baseUrl}/ne/about` },
    publisher: { "@type": "Organization", name: "PDFora", url: baseUrl },
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
          <span aria-current="page" className="text-slate-700">{post.title}</span>
        </nav>
        <header className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">PDFora नेपाली मार्गदर्शिका · {post.readTime}</p>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">{post.title}</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">{post.intro}</p>
          <p className="mt-5 text-xs text-slate-500">प्रकाशक: PDFora · अन्तिम अद्यावधिक: {post.updated}</p>
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
            <h2 id="official-sources-heading" className="text-xl font-black text-slate-950">आधिकारिक तथा प्राविधिक स्रोत</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-teal-700">{post.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="font-semibold underline">{source.label}</a></li>)}</ul>
          </section>}
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
    </main>
  );
}
