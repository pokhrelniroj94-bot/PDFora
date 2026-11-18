import Link from "next/link";
import AdsterraNative from "../app/components/AdsterraNative";
import { getToolGuide, toolGuides } from "../lib/tool-guides";
import { isGeneratedGuide } from "../lib/blog-posts";
import { nepaliToolGuides } from "../lib/i18n/tool-guides-ne";
import { nepaliToolNames } from "../lib/i18n/pdf-tool-names-ne";
import { hindiToolNames } from "../lib/i18n/pdf-tool-names-hi";
import { hindiToolGuides } from "../lib/i18n/tool-guides-hi";
const seoLabels = {
  en: ["PDFora practical guide", "What does", "do?", "How to", "step by step", "When is this PDF operation useful?", "PDF quality, compatibility and limitations", "Tips for a reliable result", "Privacy and safe document handling", "Troubleshooting common PDF problems", "Preparing PDFs for study, work and online forms", "Frequently asked questions"],
  ne: ["PDFora प्रयोगात्मक मार्गदर्शिका", "के गर्छ", "?", "कसरी", "चरणबद्ध रूपमा", "यो PDF प्रक्रिया कहिले उपयोगी हुन्छ?", "PDF गुणस्तर, अनुकूलता र सीमाहरू", "भरपर्दो नतिजाका लागि सुझाव", "गोपनीयता र सुरक्षित कागजात व्यवस्थापन", "सामान्य PDF समस्याको समाधान", "अध्ययन, काम र अनलाइन फारामका लागि PDF तयारी", "बारम्बार सोधिने प्रश्नहरू"],
  hi: ["PDFora व्यावहारिक मार्गदर्शिका", "क्या करता है", "?", "कैसे करें", "चरण-दर-चरण", "यह PDF प्रक्रिया कब उपयोगी है?", "PDF गुणवत्ता, अनुकूलता और सीमाएँ", "विश्वसनीय परिणाम के लिए सुझाव", "गोपनीयता और सुरक्षित दस्तावेज़ प्रबंधन", "PDF की सामान्य समस्याओं का समाधान", "पढ़ाई, काम और ऑनलाइन फ़ॉर्म के लिए PDF तैयार करना", "अक्सर पूछे जाने वाले प्रश्न"],
  es: ["Guía práctica de PDFora", "Qué hace", "?", "Cómo", "paso a paso", "¿Cuándo resulta útil esta operación PDF?", "Calidad, compatibilidad y limitaciones del PDF", "Consejos para obtener un resultado fiable", "Privacidad y manejo seguro de documentos", "Solución de problemas comunes de PDF", "Preparar PDF para estudiar, trabajar y formularios", "Preguntas frecuentes"],
  fr: ["Guide pratique PDFora", "Que fait", " ?", "Comment", "étape par étape", "Quand cette opération PDF est-elle utile ?", "Qualité, compatibilité et limites du PDF", "Conseils pour un résultat fiable", "Confidentialité et gestion sécurisée des documents", "Résoudre les problèmes PDF courants", "Préparer des PDF pour les études, le travail et les formulaires", "Questions fréquentes"],
  de: ["PDFora-Praxisleitfaden", "Was macht", "?", "So geht", "Schritt für Schritt", "Wann ist diese PDF-Funktion nützlich?", "PDF-Qualität, Kompatibilität und Einschränkungen", "Tipps für zuverlässige Ergebnisse", "Datenschutz und sicherer Umgang mit Dokumenten", "Häufige PDF-Probleme beheben", "PDFs für Studium, Arbeit und Online-Formulare vorbereiten", "Häufig gestellte Fragen"],
  ar: ["دليل PDFora العملي", "ما وظيفة", "؟", "كيفية", "خطوة بخطوة", "متى تكون عملية PDF هذه مفيدة؟", "جودة PDF والتوافق والقيود", "نصائح للحصول على نتيجة موثوقة", "الخصوصية والتعامل الآمن مع المستندات", "حل مشكلات PDF الشائعة", "إعداد ملفات PDF للدراسة والعمل والنماذج الإلكترونية", "الأسئلة الشائعة"],
  zh: ["PDFora 实用指南", "的作用是什么", "？", "如何", "分步操作", "此 PDF 操作适用于哪些情况？", "PDF 质量、兼容性与限制", "获得可靠结果的建议", "隐私与文档安全处理", "常见 PDF 问题排查", "为学习、工作和在线表单准备 PDF", "常见问题"],
  ja: ["PDFora 実用ガイド", "の機能", "とは？", "方法：", "手順", "この PDF 操作が役立つ場面", "PDF の品質・互換性・制限", "確実な結果を得るためのヒント", "プライバシーと安全な文書の取り扱い", "よくある PDF の問題を解決する", "学習・仕事・オンラインフォーム向けの PDF 準備", "よくある質問"],
  ko: ["PDFora 실용 가이드", "의 기능은 무엇인가요", "?", "방법:", "단계별 안내", "이 PDF 작업은 언제 유용한가요?", "PDF 품질, 호환성 및 제한 사항", "안정적인 결과를 위한 팁", "개인정보 보호 및 안전한 문서 처리", "일반적인 PDF 문제 해결", "학습, 업무 및 온라인 양식용 PDF 준비", "자주 묻는 질문"]
} as const;

const localizedFaqs: Record<string, string[]> = {
  ne: [
    "{name} ले के गर्छ?",
    "{name} अनलाइन कसरी प्रयोग गर्ने?",
    "{name} प्रयोग गरेपछि के जाँच गर्ने?",
    "{name} पछि कुन PDF काम उपयोगी हुन सक्छ?"
  ],
  hi: [
    "“{name}” टूल क्या करता है?",
    "“{name}” ऑनलाइन कैसे इस्तेमाल करें?",
    "“{name}” इस्तेमाल करने के बाद क्या जाँचना चाहिए?",
    "“{name}” के बाद कौन-सा PDF काम उपयोगी हो सकता है?"
  ]
};

export default function ToolSEOContent({ slug, locale = "en" }: { slug: string; locale?: string }) {
  const labels = seoLabels[locale as keyof typeof seoLabels] || seoLabels.en;
  const baseGuide = getToolGuide(slug);
  if (!baseGuide) return null;
  const guide = locale === "ne" && nepaliToolGuides[slug]
    ? { ...baseGuide, ...nepaliToolGuides[slug] }
    : locale === "hi" && hindiToolGuides[slug]
      ? { ...baseGuide, ...hindiToolGuides[slug] }
      : baseGuide;
  const toolName = locale === "ne" ? nepaliToolNames[slug] || guide.name : locale === "hi" ? hindiToolNames[slug] || guide.name : guide.name;
  const localizeGuideText = (value: string) => locale !== "ne" ? value : toolGuides.reduce(
    (text, item) => nepaliToolNames[item.slug] ? text.replaceAll(item.name, nepaliToolNames[item.slug]) : text,
    value,
  );
  const localizedGuide = locale === "ne" ? {
    ...guide,
    purpose: localizeGuideText(guide.purpose),
    steps: guide.steps.map(localizeGuideText),
    caution: localizeGuideText(guide.caution),
  } : guide;
  const faqs = [
    { q: localizedFaqs[locale]?.[0]?.replace("{name}", toolName) || `What does ${toolName} do?`, a: localizedGuide.purpose },
    { q: localizedFaqs[locale]?.[1]?.replace("{name}", toolName) || `How do I ${toolName.toLowerCase()} online?`, a: localizedGuide.steps.join(" ") },
    { q: localizedFaqs[locale]?.[2]?.replace("{name}", toolName) || `What should I check after using ${toolName.toLowerCase()}?`, a: localizedGuide.caution },
    { q: localizedFaqs[locale]?.[3]?.replace("{name}", toolName) || `What should I do after ${toolName.toLowerCase()}?`, a: locale === "hi" ? `आपके काम के अनुसार संबंधित टूल इस्तेमाल कर सकते हैं: ${guide.related.map((item) => hindiToolNames[item] || item).join(", ")}। मूल PDF सुरक्षित रखें और नतीजा साझा करने से पहले जाँच लें।` : locale === "ne" ? `तपाईंको कामअनुसार सम्बन्धित टुलहरू प्रयोग गर्न सक्नुहुन्छ: ${guide.related.map((item) => nepaliToolNames[item] || item).join(", ")}। मूल PDF सुरक्षित राख्नुहोस् र नतिजा साझा गर्नुअघि जाँच्नुहोस्।` : `Depending on your document workflow, related tasks include ${guide.related.map((item) => item.replace(/-/g, " ")).join(", ")}. Keep the original PDF and inspect each processed file before sharing it.` }
  ];  const pageUrl = `https://pd-fora.vercel.app${locale === "en" ? "" : `/${locale}`}/${slug}`;
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: toolName,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    description: localizedGuide.purpose,
    url: pageUrl,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "ne" ? "गृहपृष्ठ" : locale === "hi" ? "मुखपृष्ठ" : "Home", item: "https://pd-fora.vercel.app" },
      { "@type": "ListItem", position: 2, name: locale === "ne" ? "सबै PDF टुल" : locale === "hi" ? "सभी PDF टूल" : "PDF Tools", item: "https://pd-fora.vercel.app/tools" },
      { "@type": "ListItem", position: 3, name: toolName, item: pageUrl }
    ]
  };
  return (
    <article className="mx-auto w-full max-w-4xl px-4 pb-14 sm:px-6"><div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">{labels[0]}</p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">{locale === "hi" ? `“${toolName}” टूल क्या करता है?` : `${labels[1]} ${toolName} ${labels[2]}`}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">{localizedGuide.purpose}</p>
        
        
      </section>
      <AdsterraNative />
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{locale === "hi" ? `“${toolName}” कैसे इस्तेमाल करें: चरण-दर-चरण` : `${labels[3]} ${toolName.toLowerCase()} ${labels[4]}`}</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-8 text-slate-700">
          {localizedGuide.steps.map((step) => <li key={step}>{step}</li>)}
          
        </ol>
        
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{locale === "ne" ? "सीमा र ध्यान दिनुपर्ने कुरा" : locale === "hi" ? "सीमाएँ और ध्यान देने वाली बातें" : "Important limitations"}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">{localizedGuide.caution}</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{locale === "ne" ? "गोपनीयता र सुरक्षित फाइल प्रयोग" : locale === "hi" ? "गोपनीयता और फ़ाइलों का सुरक्षित इस्तेमाल" : "Privacy and safe file handling"}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "फाइल छान्नुअघि माथि देखाइएको प्रशोधन सूचना पढ्नुहोस्। टुल र चयन गरिएको विकल्पअनुसार फाइल ब्राउजरमै प्रशोधन हुन सक्छ वा PDFora को प्रशोधन सेवामा पठाइन सक्छ। संवेदनशील कागजात प्रयोग गर्नुअघि यो तरिका स्वीकार्य छ कि छैन सुनिश्चित गर्नुहोस्।" : locale === "hi" ? "फ़ाइल चुनने से पहले ऊपर दिखाई गई प्रोसेसिंग सूचना पढ़ें। टूल और चुने गए विकल्पों के अनुसार फ़ाइल आपके ब्राउज़र में ही प्रोसेस हो सकती है या PDFora की प्रोसेसिंग सेवा को भेजी जा सकती है। संवेदनशील दस्तावेज़ इस्तेमाल करने से पहले पक्का कर लें कि यह तरीका आपको स्वीकार्य है।" : "Read the processing notice shown above before choosing a file. Depending on the tool and selected options, the file may be processed locally in your browser or sent to PDFora's processing service. Make sure that method is acceptable before using sensitive documents."}</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{locale === "ne" ? "नतिजा जाँच्नुहोस्" : locale === "hi" ? "नतीजा जाँचें" : "Check the output"}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "डाउनलोड गरिएको नतिजा त्यसको फाइल ढाँचालाई समर्थन गर्ने उपयुक्त एपमा खोल्नुहोस्। PDF भए पृष्ठक्रम र पाठ; तस्बिर भए स्पष्टता र आकार; spreadsheet वा text फाइल भए स्तम्भ, encoding र महत्त्वपूर्ण मान जाँच्नुहोस्।" : locale === "hi" ? "डाउनलोड किए गए नतीजे को ऐसे ऐप में खोलें जो उसके फ़ाइल प्रारूप को समर्थन देता हो। PDF हो तो पृष्ठों का क्रम और टेक्स्ट; चित्र हो तो स्पष्टता और आकार; स्प्रेडशीट या टेक्स्ट फ़ाइल हो तो कॉलम, एन्कोडिंग और ज़रूरी मान जाँचें।" : "Open the downloaded result in an app that supports its output format. For PDFs, check page order and text; for images, check clarity and dimensions; for spreadsheets or text exports, check columns, encoding and important values."}</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "प्रक्रिया असफल भए फाइलको ढाँचा, आकार र पासवर्ड सुरक्षा जाँच्नुहोस्। एउटै अनुरोध पटक-पटक नपठाउनुहोस्; आवश्यक भए मूल फाइलको प्रतिलिपिबाट पुनः प्रयास गर्नुहोस्।" : locale === "hi" ? "प्रोसेसिंग विफल हो तो फ़ाइल का प्रारूप, आकार और पासवर्ड सुरक्षा जाँचें। एक ही अनुरोध बार-बार न भेजें; ज़रूरत हो तो मूल फ़ाइल की नई प्रति से दोबारा कोशिश करें।" : "If processing fails, check the file format, size and password protection. Avoid submitting the same request repeatedly; try again with a fresh copy of the original if needed."}</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{locale === "ne" ? "यो PDF टुल कहिले प्रयोग गर्ने?" : locale === "hi" ? "इस PDF टूल का उपयोग कब करें?" : "When should you use this PDF tool?"}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">
          {locale === "ne"
            ? `${toolName} त्यतिबेला उपयोगी हुन्छ जब तपाईंलाई ${localizedGuide.purpose.charAt(0).toLowerCase()}${localizedGuide.purpose.slice(1)} आवश्यक हुन्छ। माथिको टुलमा आफ्नो कागजात खोल्नुहोस्, उपलब्ध विकल्पअनुसार प्रक्रिया पूरा गर्नुहोस् र डाउनलोड गर्नुअघि नतिजा जाँच्नुहोस्।`
            : locale === "hi"
              ? `${toolName} तब उपयोगी है जब आपको ${localizedGuide.purpose.charAt(0).toLowerCase()}${localizedGuide.purpose.slice(1)} की आवश्यकता हो। ऊपर दिए गए टूल में अपना दस्तावेज़ खोलें, उपलब्ध विकल्पों के अनुसार प्रक्रिया पूरी करें और डाउनलोड करने से पहले परिणाम जाँचें।`
              : `${toolName} is useful when your document workflow requires this specific operation: ${localizedGuide.purpose} Open the tool above, choose the available options that match your file, complete the operation and inspect the downloaded result before sharing or submitting it.`}
        </p>
        <p className="mt-3 text-sm leading-8 text-slate-700">
          {locale === "ne"
            ? `“${toolName} अनलाइन कसरी प्रयोग गर्ने?”, “प्रक्रियापछि PDF मा के जाँच्ने?” र “PDF को गुणस्तर कसरी सुनिश्चित गर्ने?” जस्ता प्रश्नको उत्तरका लागि यस पृष्ठको चरण, सीमा र FAQ हेर्नुहोस्।`
            : locale === "hi"
              ? `“${toolName} ऑनलाइन कैसे इस्तेमाल करें?”, “प्रोसेसिंग के बाद PDF में क्या जाँचें?” और “PDF की गुणवत्ता कैसे जाँचें?” जैसे सवालों के लिए इस पेज के चरण, सीमाएँ और FAQ देखें।`
              : `This guide also addresses practical search questions such as “how to use ${toolName.toLowerCase()} online”, “what should I check after processing a PDF” and “how can I verify PDF quality after processing”. The steps, limitations and FAQs below provide the task-specific details rather than a generic list of PDF keywords.`}
        </p>
        <p className="mt-3 text-sm leading-8 text-slate-700">
          {locale === "ne"
            ? "फाइलको प्रकार, आकार, पासवर्ड सुरक्षा वा भित्री संरचनाले नतिजा फरक पार्न सक्छ। महत्त्वपूर्ण कागजातका लागि मूल फाइल सुरक्षित राख्नुहोस् र अन्तिम PDF छुट्टै reader मा खोलेर जाँच्नुहोस्।"
            : locale === "hi"
              ? "फ़ाइल का प्रकार, आकार, पासवर्ड सुरक्षा या आंतरिक संरचना परिणाम को प्रभावित कर सकती है। ज़रूरी दस्तावेज़ के लिए मूल फ़ाइल सुरक्षित रखें और अंतिम PDF को अलग reader में खोलकर जाँचें।"
              : "File type, size, password protection and internal document structure can affect the result. Keep the original for important documents and open the finished PDF in a separate reader to verify the pages and content."}
        </p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[11]}</h2>
        <div className="mt-5 space-y-5">{faqs.map((item) => <div key={item.q}><h3 className="font-bold text-slate-950">{item.q}</h3><p className="mt-2 text-sm leading-8 text-slate-600">{item.a}</p></div>)}</div>
      </section>
      <section className="rounded-3xl border border-violet-100 bg-violet-50 p-6 sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{locale === "hi" ? "संबंधित PDF टूल" : locale === "ne" ? (isGeneratedGuide(guide.blogSlug) ? "सम्बन्धित PDF टुल" : "सम्बन्धित PDF टुल र मार्गदर्शिका") : (isGeneratedGuide(guide.blogSlug) ? "Related PDF tools" : "Related PDF tools and guides")}</h2>
        <p className="mt-3 text-sm leading-8 text-slate-700">{locale === "ne" ? "केही PDF काम सही क्रममा गर्दा सजिलो हुन्छ। पहिले कागजात व्यवस्थित गर्नुहोस्, त्यसपछि मुख्य प्रक्रिया पूरा गरी अन्तिम नतिजा जाँच्नुहोस्। आवश्यक काम मात्र गर्नुहोस्; उपलब्ध सबै प्रक्रिया अनावश्यक रूपमा लागू नगर्नुहोस्।" : locale === "hi" ? "कुछ PDF काम सही क्रम में करने पर आसान हो जाते हैं। पहले दस्तावेज़ को व्यवस्थित करें, फिर मुख्य प्रक्रिया पूरी करें और अंत में अंतिम नतीजा जाँचें। केवल ज़रूरी काम ही करें; उपलब्ध हर प्रक्रिया को बेवजह लागू न करें।" : "Some PDF tasks are easier when completed in a sensible order. You may want to organise or prepare a document first, complete the main operation, and then inspect the final result. Use only the steps required for your document rather than applying every available operation."}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {!isGeneratedGuide(guide.blogSlug) && locale !== "hi" && <Link href={locale === "ne" ? `/ne/blog/${guide.blogSlug}` : `/blog/${guide.blogSlug}`} className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-bold text-white hover:bg-violet-800">{locale === "ne" ? `${toolName} को विस्तृत मार्गदर्शिका पढ्नुहोस्` : `Read the complete ${toolName} guide`}</Link>}
          {guide.related.map((slug) => { const related = getToolGuide(slug); return related ? <Link key={slug} href={`${locale === "en" ? "" : `/${locale}`}/${slug}`} className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-bold text-violet-800 hover:bg-violet-100">{(locale === "ne" ? nepaliToolNames[slug] : locale === "hi" ? hindiToolNames[slug] : undefined) || related.name}</Link> : null; })}
        </div>
      </section>
    </div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} /></article>
  );
}
