import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, isRoutable, localeInfo, locales, type Locale } from "../../../../lib/i18n/config";
import { getNepaliLocalizedBlogPost, nepaliLocalizedBlogPosts } from "../../../../lib/nepali-localized-blog-posts";
import { getLocalizedQrBlogPost } from "../../../../lib/localized-qr-blog-posts";
import { buildLocaleMetadata } from "../../../../lib/i18n/metadata";
import BlogToolCTA from "../../../../components/BlogToolCTA";
import { HindiBlogArticle, getHindiGuide, hindiGuides } from "../../../../components/HindiBlogPages";

const baseUrl = "https://pd-fora.vercel.app";

function toNepaliToolHref(href: string): string {
  if (/^\/(ne|hi|bn|ur|ar|es|fr|de|pt|zh|ja)\//.test(href)) return href;
  if (href === "/ne" || href.startsWith("/ne/")) return href;
  return `/ne${href.startsWith("/") ? href : `/${href}`}`;
}

const nepaliSearchTitles: Record<string, string> = {
  "qr-code-generator-guide": "QR Code कसरी बनाउने? Wi-Fi र URL",
  "compress-pdf-under-200kb-nepal-online-forms": "PDF २००KB भित्र कसरी कम्प्रेस गर्ने?",
  "nepali-date-converter-bs-to-ad-guide": "नेपाली मिति BS–AD रूपान्तरण",
  "neb-gpa-calculator-nepal-guide": "NEB GPA क्याल्कुलेटर: ग्रेड र क्रेडिट",
  "nepal-vat-calculator-13-percent-guide": "नेपालमा १३% VAT कसरी गणना गर्ने?",
  "ropani-aana-paisa-daam-land-measurement-guide": "रोपनी–आना–पैसा–दाम जग्गा नाप",
  "tola-to-gram-gold-weight-conversion-nepal": "तोला र ग्राम: सुनको तौल रूपान्तरण",
  "nepali-number-to-words-lakh-crore-guide": "हजार, लाख र करोड: अङ्कलाई अक्षरमा",
  "nepal-mobile-number-format-checker-guide": "नेपाल मोबाइल नम्बरको ढाँचा जाँच",
  "nepal-public-holidays-2083-calendar-guide": "नेपालका सार्वजनिक बिदा २०८३",
  "nepal-rastra-bank-daily-exchange-rates-guide": "NRB विनिमय दर आज: USD, INR र EUR",
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
  "percentage-change-calculator-guide": "Percentage Change: प्रतिशत कसरी निकाल्ने?",
  "tip-calculator-guide": "Tip Calculator: १५%, १८% र २०% कसरी निकाल्ने?",
};

const qrLocales = locales.filter((locale) => locale !== "en" && locale !== "ne");
type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return [
    ...nepaliLocalizedBlogPosts.map((post) => ({ locale: "ne", slug: post.slug })),
    ...qrLocales.map((locale) => ({ locale, slug: "qr-code-generator-guide" })),
    ...hindiGuides.map((post) => ({ locale: "hi", slug: post.slug })),
  ];
}

function getPost(locale: Locale, slug: string) {
  if (locale === "ne") return getNepaliLocalizedBlogPost(slug);
  return getLocalizedQrBlogPost(locale, slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return { title: "Article not found", robots: { index: false, follow: true } };
  if (rawLocale === "hi") { const guide = getHindiGuide(slug); return guide ? buildLocaleMetadata({ locale: "hi", path: `/blog/${slug}`, title: guide.title, description: guide.description }) : { title: "लेख उपलब्ध नहीं है", robots: { index: false, follow: true } }; }
  const post = getPost(rawLocale, slug);
  if (!post) return { title: "Article not found", robots: { index: false, follow: true } };
  const searchTitle = rawLocale === "ne" ? nepaliSearchTitles[post.slug] ?? post.title : post.title;
  return buildLocaleMetadata({
    locale: rawLocale,
    path: `/blog/${post.slug}`,
    title: searchTitle,
    description: post.description,
  });
}

export default async function LocalizedBlogArticle({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  if (locale === "hi" && isRoutable(locale)) { const article = <HindiBlogArticle slug={slug} />; if (article) return article; notFound(); }
  const post = getPost(locale, slug);
  const independentlyPublishedQrGuide = locale !== "en" && slug === "qr-code-generator-guide" && Boolean(post);
  if ((!isRoutable(locale) && !independentlyPublishedQrGuide) || !post) notFound();

  const isNepali = locale === "ne";
  const isRtl = localeInfo[locale].dir === "rtl";
  const root = `/${locale}`;
  const toolHref = isNepali ? toNepaliToolHref("/tools/qr-code-generator") : `/${locale}/tools/qr-code-generator`;
  const guideLabel: Record<string, string> = {
    ne: "मार्गदर्शिका", hi: "मार्गदर्शिका", bn: "নির্দেশিকা", ur: "رہنما", ar: "الأدلة",
    es: "Guías", fr: "Guides", de: "Anleitungen", pt: "Guias", zh: "使用指南", ja: "ガイド",
  };
  const homeLabel: Record<string, string> = {
    ne: "गृहपृष्ठ", hi: "होम", bn: "হোম", ur: "صفحۂ اول", ar: "الرئيسية",
    es: "Inicio", fr: "Accueil", de: "Startseite", pt: "Início", zh: "首页", ja: "ホーム",
  };
  const relatedLabel: Record<string, string> = {
    ne: "सम्बन्धित टुल", hi: "संबंधित टूल", bn: "সম্পর্কিত টুল", ur: "متعلقہ ٹول",
    ar: "أداة ذات صلة", es: "Herramienta relacionada", fr: "Outil associé",
    de: "Passendes Tool", pt: "Ferramenta relacionada", zh: "相关工具", ja: "関連ツール",
  };
  const faqLabel: Record<string, string> = {
    ne: "बारम्बार सोधिने प्रश्न", hi: "अक्सर पूछे जाने वाले प्रश्न", bn: "সাধারণ প্রশ্ন",
    ur: "اکثر پوچھے گئے سوالات", ar: "الأسئلة الشائعة", es: "Preguntas frecuentes",
    fr: "Questions fréquentes", de: "Häufige Fragen", pt: "Perguntas frequentes",
    zh: "常见问题", ja: "よくある質問",
  };
  const articleUrl = `${baseUrl}${root}/blog/${post.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    dateModified: `${post.updated}T00:00:00+05:45`,
    inLanguage: localeInfo[locale].htmlLang,
    mainEntityOfPage: articleUrl,
    author: { "@type": "Organization", name: "PDFora Editorial Team", url: `${baseUrl}${root}/about` },
    publisher: { "@type": "Organization", name: "PDFora", url: baseUrl },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeLabel[locale] ?? "Home", item: `${baseUrl}${root}` },
      { "@type": "ListItem", position: 2, name: guideLabel[locale] ?? "Guides", item: `${baseUrl}${root}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: articleUrl },
    ],
  };

  return (
    <main lang={localeInfo[locale].htmlLang} dir={isRtl ? "rtl" : "ltr"} className="pdfora-blog-page pdfora-blog-article min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <article className="mx-auto max-w-3xl">
        <nav aria-label={isNepali ? "ब्रेडक्रम" : "Breadcrumb"} className="text-sm text-slate-500">
          <Link href={root} className="hover:text-teal-700">{homeLabel[locale] ?? "Home"}</Link><span className="mx-2">/</span>
          <span className="text-slate-700">{guideLabel[locale] ?? "Guides"}</span><span className="mx-2">/</span>
          <span aria-current="page" className="text-slate-700">{post.title}</span>
        </nav>
        <header className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">PDFora · {post.readTime}</p>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">{post.title}</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">{post.intro}</p>
          {/* Nepali pages retain locale="ne"; every other published QR guide uses its own locale. */}
          {post.toolLinks.length > 0 && (
            <BlogToolCTA blogSlug={post.slug} href={toolHref} label="QR Code Generator" locale={isNepali ? "ne" : locale} />
          )}
          <p className="mt-5 text-xs text-slate-500">{post.updated}</p>
        </header>
        <div className="mt-6 space-y-6">
          {post.sections.map((section) => (
            <section key={section.heading} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-black text-slate-950">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-sm leading-8 text-slate-700">{paragraph}</p>)}
              {section.bullets && <ol className="mt-4 list-decimal space-y-2 ps-5 text-sm leading-7 text-slate-700">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ol>}
            </section>
          ))}
          {post.sources && post.sources.length > 0 && <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">{isNepali ? "आधिकारिक तथा प्राविधिक स्रोत" : "References and further reading"}</h2>
            <ul className="mt-4 list-disc space-y-2 ps-5 text-sm leading-7 text-teal-700">{post.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="font-semibold underline">{source.label}</a></li>)}</ul>
          </section>}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">{faqLabel[locale] ?? "Frequently asked questions"}</h2>
            <div className="mt-5 space-y-5">
              {post.faqs.map((faq) => <div key={faq.question}><h3 className="font-bold text-slate-950">{faq.question}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{faq.answer}</p></div>)}
            </div>
          </section>
          <section className="rounded-3xl border border-teal-100 bg-teal-50 p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">{relatedLabel[locale] ?? "Related tool"}</h2>
            <div className="mt-4 flex flex-wrap gap-3">{post.toolLinks.map((tool) => <Link key={tool.href} href={toNepaliToolHref(tool.href)} className="inline-flex rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800">{tool.label}</Link>)}</div>
          </section>
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6 text-sm">
          <Link href={root} className="font-bold text-teal-700 hover:underline">{homeLabel[locale] ?? "Home"}</Link>
          <Link href={toolHref} className="font-bold text-teal-700 hover:underline">QR Code Generator</Link>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
