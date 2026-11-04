import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "../../../lib/blog-posts";

const baseUrl = "https://pd-fora.vercel.app";
const copy: Record<string, { title: string; description: string; label: string; intro: string; read: string; english: string; back: string; empty: string }> = {
  ne: { title: "PDFora गाइड र ट्युटोरियल", description: "PDF र दैनिक डिजिटल कामका लागि व्यावहारिक गाइडहरू।", label: "PDFora सिकाइ केन्द्र", intro: "PDF, कागजात र उपयोगी अनलाइन टूलसम्बन्धी चरणबद्ध गाइडहरू।", read: "गाइड पढ्नुहोस्", english: "यो लेख हाल अंग्रेजीमा उपलब्ध छ।", back: "सबै टूल हेर्नुहोस्", empty: "हाल कुनै लेख उपलब्ध छैन।" },
  hi: { title: "PDFora गाइड और ट्यूटोरियल", description: "PDF और रोज़मर्रा के डिजिटल कामों के लिए उपयोगी गाइड।", label: "PDFora लर्निंग सेंटर", intro: "PDF, दस्तावेज़ और उपयोगी ऑनलाइन टूल के चरण-दर-चरण गाइड।", read: "गाइड पढ़ें", english: "यह लेख अभी अंग्रेज़ी में उपलब्ध है।", back: "सभी टूल देखें", empty: "अभी कोई लेख उपलब्ध नहीं है।" },
  es: { title: "Guías y tutoriales de PDFora", description: "Guías prácticas para PDF y tareas digitales cotidianas.", label: "Centro de aprendizaje PDFora", intro: "Guías paso a paso sobre PDF, documentos y herramientas en línea.", read: "Leer la guía", english: "Este artículo está disponible actualmente en inglés.", back: "Ver todas las herramientas", empty: "No hay artículos disponibles." },
  fr: { title: "Guides et tutoriels PDFora", description: "Guides pratiques pour les PDF et les tâches numériques quotidiennes.", label: "Centre d’apprentissage PDFora", intro: "Guides étape par étape sur les PDF, les documents et les outils en ligne.", read: "Lire le guide", english: "Cet article est actuellement disponible en anglais.", back: "Voir tous les outils", empty: "Aucun article disponible." },
  de: { title: "PDFora Anleitungen und Tutorials", description: "Praktische Anleitungen für PDFs und alltägliche digitale Aufgaben.", label: "PDFora Lernzentrum", intro: "Schritt-für-Schritt-Anleitungen zu PDFs, Dokumenten und Online-Tools.", read: "Anleitung lesen", english: "Dieser Artikel ist derzeit auf Englisch verfügbar.", back: "Alle Tools ansehen", empty: "Derzeit sind keine Artikel verfügbar." },
  pt: { title: "Guias e tutoriais PDFora", description: "Guias práticos para PDFs e tarefas digitais do dia a dia.", label: "Centro de aprendizagem PDFora", intro: "Guias passo a passo sobre PDFs, documentos e ferramentas online.", read: "Ler guia", english: "Este artigo está disponível atualmente em inglês.", back: "Ver todas as ferramentas", empty: "Nenhum artigo disponível." },
  ar: { title: "أدلة وشروحات PDFora", description: "أدلة عملية لملفات PDF والمهام الرقمية اليومية.", label: "مركز تعلم PDFora", intro: "أدلة خطوة بخطوة حول ملفات PDF والمستندات والأدوات عبر الإنترنت.", read: "اقرأ الدليل", english: "هذه المقالة متاحة حاليًا باللغة الإنجليزية.", back: "عرض جميع الأدوات", empty: "لا توجد مقالات متاحة حاليًا." },
  bn: { title: "PDFora গাইড ও টিউটোরিয়াল", description: "PDF এবং দৈনন্দিন ডিজিটাল কাজের ব্যবহারিক গাইড।", label: "PDFora লার্নিং সেন্টার", intro: "PDF, নথি এবং অনলাইন টুল সম্পর্কে ধাপে ধাপে নির্দেশিকা।", read: "গাইড পড়ুন", english: "এই নিবন্ধটি বর্তমানে ইংরেজিতে উপলভ্য।", back: "সব টুল দেখুন", empty: "এখন কোনো নিবন্ধ উপলভ্য নেই।" },
  id: { title: "Panduan dan tutorial PDFora", description: "Panduan praktis untuk PDF dan tugas digital sehari-hari.", label: "Pusat Belajar PDFora", intro: "Panduan langkah demi langkah tentang PDF, dokumen, dan alat online.", read: "Baca panduan", english: "Artikel ini saat ini tersedia dalam bahasa Inggris.", back: "Lihat semua alat", empty: "Belum ada artikel yang tersedia." },
  zh: { title: "PDFora 指南与教程", description: "适用于 PDF 和日常数字任务的实用指南。", label: "PDFora 学习中心", intro: "关于 PDF、文档和在线工具的分步指南。", read: "阅读指南", english: "本文目前仅提供英文版本。", back: "查看所有工具", empty: "目前没有可用文章。" },
  ja: { title: "PDFora ガイドとチュートリアル", description: "PDF や日常のデジタル作業に役立つ実用ガイド。", label: "PDFora ラーニングセンター", intro: "PDF、ドキュメント、オンラインツールの手順を紹介します。", read: "ガイドを読む", english: "この記事は現在英語で提供されています。", back: "すべてのツールを見る", empty: "現在、利用できる記事はありません。" },
};

export function generateStaticParams() {
  return Object.keys(copy).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = copy[locale];
  if (!t) return { title: "Not found", robots: { index: false, follow: true } };
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: `${baseUrl}/${locale}/blog` },
    robots: { index: false, follow: true },
  };
}

export default async function LocalizedBlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = copy[locale];
  if (!t) notFound();
  return (
    <main lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">{t.label}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{t.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">{t.intro}</p>
        <p className="mt-3 text-xs font-semibold text-amber-800">{t.english}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {blogPosts.length ? blogPosts.map((post) => (
            <article key={post.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">{post.readTime} · English</p>
              <h2 className="mt-3 text-xl font-black leading-snug text-slate-950">
                <Link className="hover:text-teal-700" href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{post.description}</p>
              <Link className="mt-5 inline-flex font-bold text-teal-700 hover:underline" href={`/blog/${post.slug}`}>{t.read} →</Link>
            </article>
          )) : <p>{t.empty}</p>}
        </div>
        <div className="mt-10"><Link href={`/${locale}/tools`} className="font-bold text-teal-700 underline">{t.back}</Link></div>
      </div>
    </main>
  );
}
