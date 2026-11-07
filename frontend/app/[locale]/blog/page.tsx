import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, isRoutable } from "../../../lib/i18n/config";
import { nepaliLocalizedBlogPosts } from "../../../lib/nepali-localized-blog-posts";
import { buildLocaleMetadata } from "../../../lib/i18n/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ne") return { title: "Page not found", robots: { index: false, follow: true } };
  return buildLocaleMetadata({
    locale,
    path: "/blog",
    title: "नेपाली PDF तथा नेपाल उपयोगी मार्गदर्शिका | PDFora",
    description: "PDF काम, नेपाली मिति, VAT र जग्गा क्षेत्रफलजस्ता विषयमा स्पष्ट नेपाली मार्गदर्शिका र उपयोगी उदाहरण।",
  });
}

export default async function NepaliBlogIndex({ params }: Props) {
  const { locale } = await params;
  if (locale !== "ne" || !isLocale(locale) || !isRoutable(locale)) notFound();
  return (
    <main lang="ne" className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">PDFora नेपाली मार्गदर्शिका</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">उपयोगी नेपाली लेख र ट्युटोरियल</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">नेपाली मिति, VAT र जग्गा क्षेत्रफलजस्ता दैनिक काममा उपयोगी स्पष्ट चरण, सूत्र र सावधानी।</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {nepaliLocalizedBlogPosts.map((post) => (
            <article key={post.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">{post.readTime} · नेपाली मार्गदर्शिका</p>
              <h2 className="mt-3 text-xl font-black leading-snug text-slate-950">
                <Link className="hover:text-teal-700" href={`/ne/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{post.description}</p>
              <Link className="mt-5 inline-flex font-bold text-teal-700 hover:underline" href={`/ne/blog/${post.slug}`}>मार्गदर्शिका पढ्नुहोस् →</Link>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-3xl border border-teal-100 bg-teal-50 p-6">
          <h2 className="text-xl font-black text-slate-950">सम्बन्धित नेपाली टुल प्रयोग गर्नुहोस्</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">लेख पढेपछि सम्बन्धित क्याल्कुलेटर वा कन्भर्टरमा वास्तविक इनपुट जाँच्नुहोस्।</p>
          <Link className="mt-4 inline-flex rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white" href="/ne/tools/nepali-date-converter">नेपाली उपयोगी टुलहरू →</Link>
        </div>
      </div>
    </main>
  );
}
