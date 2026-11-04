import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { homeLocales, supportedHomeLanguages, homeLanguageAlternates } from "../../lib/home-locales";

const site = "https://pd-fora.vercel.app";

export function generateStaticParams() {
  return Object.keys(homeLocales).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const content = homeLocales[locale];
  if (!content) return {};
  const languages = Object.fromEntries(Object.entries(homeLanguageAlternates).map(([key, url]) => [key, url]));
  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: `${site}/${locale}`, languages },
    openGraph: {
      type: "website", siteName: "PDFora", title: content.title,
      description: content.description, url: `${site}/${locale}`,
      locale: ({ hi: "hi_IN", es: "es_ES", fr: "fr_FR", de: "de_DE", pt: "pt_BR", ar: "ar_SA", bn: "bn_BD", id: "id_ID", zh: "zh_CN", ja: "ja_JP" } as Record<string, string>)[locale],
      alternateLocale: ["en_US", "ne_NP", "hi_IN", "es_ES", "fr_FR", "de_DE", "pt_BR", "ar_SA", "bn_BD", "id_ID", "zh_CN", "ja_JP"].filter((item) => item !== ({ hi: "hi_IN", es: "es_ES", fr: "fr_FR", de: "de_DE", pt: "pt_BR", ar: "ar_SA", bn: "bn_BD", id: "id_ID", zh: "zh_CN", ja: "ja_JP" } as Record<string, string>)[locale]),
    },
    twitter: { card: "summary_large_image", title: content.title, description: content.description },
  };
}

export default async function LocalizedHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = homeLocales[locale];
  if (!content) notFound();
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "PDFora", item: site },
      { "@type": "ListItem", position: 2, name: content.nativeName, item: `${site}/${locale}` },
    ],
  };
  return (
    <main lang={locale} dir={content.dir ?? "ltr"} className="min-h-screen bg-[#f5f7f6] text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2" aria-label="PDFora home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 font-black text-white">P</span>
            <span className="text-xl font-black">PDFora</span>
          </Link>
          <nav aria-label="Language selection" className="flex flex-wrap items-center gap-2 text-sm">
            {supportedHomeLanguages.map((language) => (
              <Link key={language.code} href={language.href} hrefLang={language.code}
                aria-current={language.code === locale ? "page" : undefined}
                className={language.code === locale ? "rounded-lg bg-teal-700 px-3 py-2 font-bold text-white" : "rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700 hover:border-teal-500"}>
                {language.nativeName}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <section className="bg-[#071b1b] px-4 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-200">{content.eyebrow}</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">{content.heading}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300">{content.intro}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/tools" className="rounded-xl bg-teal-400 px-5 py-3 font-bold text-slate-950 hover:bg-teal-300">{content.primary}</Link>
            <Link href="#popular-tools" className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white hover:bg-white/10">{content.secondary}</Link>
          </div>
        </div>
      </section>
      <section id="popular-tools" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="text-xs font-black uppercase tracking-widest text-teal-700">PDFora</p>
        <h2 className="mt-2 text-3xl font-black">{content.popular}</h2>
        <p className="mt-3 text-slate-600">{content.toolsIntro}</p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-lg">
              <h3 className="font-bold">{tool.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
              <span className="mt-4 inline-block text-sm font-bold text-teal-700">{content.primary} →</span>
            </Link>
          ))}
        </div>
        <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">{content.note}</p>
      </section>
      <footer className="border-t border-slate-200 bg-slate-950 px-4 py-8 text-center text-sm text-slate-300">
        <p>{content.footer}</p>
        <div className="mt-3 flex justify-center gap-5">
          <Link href="/privacy" className="underline underline-offset-4">Privacy</Link>
          <Link href="/terms" className="underline underline-offset-4">Terms</Link>
          <Link href="/" hrefLang="en" className="underline underline-offset-4">English</Link>
        </div>
      </footer>
    </main>
  );
}