"use client";

import Link from "next/link";
import { trackConsentAwareEvent } from "../lib/analytics-client";
import type { Locale } from "../lib/i18n/config";

type BlogToolCTAProps = {
  blogSlug: string;
  href: string;
  label: string;
  calculator?: boolean;
  locale?: Locale;
};

export default function BlogToolCTA({ blogSlug, href, label, calculator = false, locale = "en" }: BlogToolCTAProps) {
  const isNepali = locale === "ne";
  const prompt: Record<Locale, string> = {
    en: calculator ? "Ready to use your own numbers? Open the interactive calculator." : "Ready to try this workflow? Open the matching tool.",
    ne: "यो काम आफ्नै उदाहरणसँग गर्न चाहनुहुन्छ? सम्बन्धित टुल खोल्नुहोस्।",
    hi: "अपना QR कोड बनाने के लिए टूल खोलें।",
    bn: "আপনার QR কোড তৈরি করতে টুলটি খুলুন।",
    ur: "اپنا QR کوڈ بنانے کے لیے ٹول کھولیں۔",
    ar: "افتح الأداة لإنشاء رمز QR الخاص بك.",
    es: "Abre la herramienta para crear tu código QR.",
    fr: "Ouvrez l’outil pour créer votre QR code.",
    de: "Öffnen Sie das Tool, um Ihren QR-Code zu erstellen.",
    pt: "Abra a ferramenta para criar seu QR Code.",
    zh: "打开工具，创建您的二维码。",
    ja: "ツールを開いてQRコードを作成しましょう。",
  };
  const action: Record<Locale, string> = {
    en: "Open QR Code Generator", ne: "QR Code Generator खोल्नुहोस्", hi: "QR कोड जनरेटर खोलें",
    bn: "QR কোড জেনারেটর খুলুন", ur: "QR کوڈ جنریٹر کھولیں", ar: "افتح منشئ رمز QR",
    es: "Abrir generador de QR", fr: "Ouvrir le générateur QR", de: "QR-Code-Generator öffnen",
    pt: "Abrir gerador de QR", zh: "打开二维码生成器", ja: "QRコード生成ツールを開く",
  };
  const trackClick = () => {
    trackConsentAwareEvent("blog_to_tool_click", {
      blog_slug: blogSlug,
      tool_name: label,
      tool_path: href,
      language: locale,
    });
  };

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-teal-100 bg-teal-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-800">{prompt[locale]}</p>
      <Link
        href={href}
        onClick={trackClick}
        aria-label={isNepali ? action.ne : action[locale]}
        className="inline-flex items-center justify-center rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
      >
        {action[locale]}
      </Link>
    </div>
  );
}
