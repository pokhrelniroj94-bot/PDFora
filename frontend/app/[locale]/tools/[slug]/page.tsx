import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolWorkspace from "../../../../components/AllTools";
import { toolCatalog } from "../../../../components/toolCatalog";
import { legacyToolSlugSet } from "../../../../lib/legacy-tool-slugs";

const site = "https://pd-fora.vercel.app";
const locales = ["ne","hi","es","fr","de","pt","ar","bn","id","zh","ja"];
const notices: Record<string,string> = {
 ne:"यो टूलको मुख्य कार्यक्षेत्र अझै अंग्रेजीमा छ। अनुवाद पूर्ण र समीक्षा भएपछि मात्र यो पेज Google मा index गरिनेछ।",
 hi:"इस टूल का मुख्य कार्यक्षेत्र अभी अंग्रेज़ी में है। अनुवाद पूरा और समीक्षा होने के बाद ही यह पेज Google में index होगा।",
 es:"El espacio de trabajo principal de esta herramienta todavía está en inglés. Esta página solo se indexará cuando la traducción esté completa y revisada.",
 fr:"L’espace de travail principal de cet outil est encore en anglais. Cette page ne sera indexée qu’après la traduction complète et sa révision.",
 de:"Der Hauptarbeitsbereich dieses Tools ist noch auf Englisch. Diese Seite wird erst indexiert, wenn die Übersetzung vollständig und geprüft ist.",
 pt:"O espaço de trabalho principal desta ferramenta ainda está em inglês. Esta página só será indexada após a tradução completa e revisada.",
 ar:"واجهة العمل الرئيسية لهذه الأداة ما زالت باللغة الإنجليزية. لن تتم فهرسة هذه الصفحة إلا بعد اكتمال الترجمة ومراجعتها.",
 bn:"এই টুলের মূল কাজের ইন্টারফেস এখনো ইংরেজিতে। অনুবাদ সম্পূর্ণ ও পর্যালোচনা না হওয়া পর্যন্ত এই পেজ Google-এ index করা হবে না।",
 id:"Ruang kerja utama alat ini masih berbahasa Inggris. Halaman ini baru akan diindeks setelah terjemahan selesai dan ditinjau.",
 zh:"此工具的主要工作界面目前仍为英文。只有在翻译完成并审核后，此页面才会被 Google 收录。",
 ja:"このツールの主要な作業画面はまだ英語です。翻訳が完了し、確認されるまで、このページは Google にインデックスされません。"
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const tool = toolCatalog.find((item) => item.slug === slug);
  if (!locales.includes(locale) || !tool || slug === "pdf-tools") {
    return { title: "Page not found", robots: { index: false, follow: true } };
  }
  const canonical = legacyToolSlugSet.has(slug) ? `${site}/${slug}` : `${site}/tools/${slug}`;
  return {
    title: `${tool.name} – PDFora`,
    description: tool.description,
    alternates: { canonical },
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
    openGraph: { type: "website", locale: "en_US", title: `${tool.name} – PDFora`, description: tool.description, url: canonical, siteName: "PDFora" },
  };
}

export default async function LocalizedToolPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!locales.includes(locale) || !toolCatalog.some((tool) => tool.slug === slug && slug !== "pdf-tools")) notFound();
  return <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}><p className="mx-auto mt-4 max-w-4xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">{notices[locale]}</p><ToolWorkspace slug={slug} locale={locale} /></div>;
}
