import Link from "next/link";
import type { Locale } from "../lib/i18n/config";
import { localeInfo } from "../lib/i18n/config";
import { getLocalizedQrBlogPost } from "../lib/localized-qr-blog-posts";
import BlogToolCTA from "./BlogToolCTA";

const labels: Record<string, { home: string; guides: string; related: string; faq: string }> = {
  ne: { home: "गृहपृष्ठ", guides: "मार्गदर्शिका", related: "सम्बन्धित टुल", faq: "बारम्बार सोधिने प्रश्न" },
  hi: { home: "होम", guides: "मार्गदर्शिका", related: "संबंधित टूल", faq: "अक्सर पूछे जाने वाले प्रश्न" },
  bn: { home: "হোম", guides: "নির্দেশিকা", related: "সম্পর্কিত টুল", faq: "সাধারণ প্রশ্ন" },
  ur: { home: "صفحۂ اول", guides: "رہنما", related: "متعلقہ ٹول", faq: "اکثر پوچھے گئے سوالات" },
  ar: { home: "الرئيسية", guides: "الأدلة", related: "أداة ذات صلة", faq: "الأسئلة الشائعة" },
  es: { home: "Inicio", guides: "Guías", related: "Herramienta relacionada", faq: "Preguntas frecuentes" },
  fr: { home: "Accueil", guides: "Guides", related: "Outil associé", faq: "Questions fréquentes" },
  de: { home: "Startseite", guides: "Anleitungen", related: "Passendes Tool", faq: "Häufige Fragen" },
  pt: { home: "Início", guides: "Guias", related: "Ferramenta relacionada", faq: "Perguntas frequentes" },
  zh: { home: "首页", guides: "使用指南", related: "相关工具", faq: "常见问题" },
  ja: { home: "ホーム", guides: "ガイド", related: "関連ツール", faq: "よくある質問" },
};

export default function LocalizedQrBlogArticle({ locale }: { locale: Locale }) {
  const post = getLocalizedQrBlogPost(locale, "qr-code-generator-guide");
  if (!post) return null;
  const root = `/${locale}`;
  const toolHref = `${root}/tools/qr-code-generator`;
  const rtl = localeInfo[locale].dir === "rtl";
  const copy = labels[locale] ?? { home: "Home", guides: "Guides", related: "Related tool", faq: "Frequently asked questions" };
  const articleUrl = `https://pd-fora.vercel.app${root}/blog/${post.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    dateModified: `${post.updated}T00:00:00+05:45`,
    inLanguage: localeInfo[locale].htmlLang,
    mainEntityOfPage: articleUrl,
    author: { "@type": "Organization", name: "PDFora Editorial Team", url: `https://pd-fora.vercel.app${root}/about` },
    publisher: { "@type": "Organization", name: "PDFora", url: "https://pd-fora.vercel.app" },
  };
  return (
    <main lang={localeInfo[locale].htmlLang} dir={rtl ? "rtl" : "ltr"} className="pdfora-blog-page pdfora-blog-article min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <article className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <Link href={root} className="hover:text-teal-700">{copy.home}</Link><span className="mx-2">/</span>
          <Link href={`${root}/blog`} className="hover:text-teal-700">{copy.guides}</Link><span className="mx-2">/</span>
          <span aria-current="page" className="text-slate-700">{post.title}</span>
        </nav>
        <header className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">PDFora · {post.readTime}</p>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">{post.title}</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">{post.intro}</p>
          {post.toolLinks.length > 0 && <BlogToolCTA blogSlug={post.slug} href={toolHref} label={post.toolLinks[0].label} locale={locale} />}
          <p className="mt-5 text-xs text-slate-500">{post.updated}</p>
        </header>
        <div className="mt-6 space-y-6">
          {post.sections.map((section) => <section key={section.heading} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-sm leading-8 text-slate-700">{paragraph}</p>)}
            {section.bullets && <ol className="mt-4 list-decimal space-y-2 ps-5 text-sm leading-7 text-slate-700">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ol>}
          </section>)}
          {post.sources?.length ? <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">References and further reading</h2>
            <ul className="mt-4 list-disc space-y-2 ps-5 text-sm leading-7 text-teal-700">{post.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="font-semibold underline">{source.label}</a></li>)}</ul>
          </section> : null}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">{copy.faq}</h2>
            <div className="mt-5 space-y-5">{post.faqs.map((faq) => <div key={faq.question}><h3 className="font-bold text-slate-950">{faq.question}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{faq.answer}</p></div>)}</div>
          </section>
          <section className="rounded-3xl border border-teal-100 bg-teal-50 p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">{copy.related}</h2>
            <div className="mt-4 flex flex-wrap gap-3">{post.toolLinks.map((tool) => <Link key={tool.href} href={toolHref} className="inline-flex rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800">{tool.label}</Link>)}</div>
          </section>
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6 text-sm">
          <Link href={`${root}/blog`} className="font-bold text-teal-700 hover:underline">{copy.guides}</Link>
          <Link href={toolHref} className="font-bold text-teal-700 hover:underline">QR Code Generator</Link>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  );
}
