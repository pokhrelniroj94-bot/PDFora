import Link from "next/link";
import AdsterraNative from "../app/components/AdsterraNative";
import { getToolGuide } from "../lib/tool-guides";
import { nepaliToolGuides } from "../lib/i18n/tool-guides-ne";
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

const localizedToolNames: Record<string, Record<string, string>> = {
  ne: {
    "add-background": "PDF मा पृष्ठभूमि थप्नुहोस्", "add-blank-pages": "PDF मा खाली पृष्ठ थप्नुहोस्", "add-bookmarks": "PDF बुकमार्क थप्नुहोस्",
    "add-page-numbers": "PDF मा पृष्ठ नम्बर थप्नुहोस्", "bates-numbering": "PDF मा क्रमिक Bates नम्बर राख्नुहोस्", "compare-pdf": "दुई PDF तुलना गर्नुहोस्",
    "compress-pdf": "PDF को आकार घटाउनुहोस्", "crop-pdf": "PDF पृष्ठ काटछाँट गर्नुहोस्", "delete-pages": "PDF का पृष्ठ हटाउनुहोस्",
    "edit-pdf-metadata": "PDF विवरण (Metadata) सम्पादन गर्नुहोस्", "extract-bookmarks": "PDF बुकमार्क निकाल्नुहोस्", "extract-fonts": "PDF बाट फन्ट निकाल्नुहोस्",
    "extract-images": "PDF भित्रका तस्बिर निकाल्नुहोस्", "extract-page-images": "PDF का पृष्ठलाई तस्बिरमा निकाल्नुहोस्", "extract-pages": "PDF का छानिएका पृष्ठ निकाल्नुहोस्",
    "flatten-pdf": "PDF का फाराम र टिप्पणी स्थिर बनाउनुहोस्", "grayscale-pdf": "PDF लाई ग्रेस्केलमा बदल्नुहोस्", "header-footer": "PDF मा हेडर र फुटर थप्नुहोस्",
    "images-to-pdf": "तस्बिरलाई PDF मा बदल्नुहोस्", "merge-pdf": "PDF फाइल जोड्नुहोस्", "page-counter": "PDF पृष्ठ संख्या गन्नुहोस्",
    "pdf-information": "PDF को जानकारी हेर्नुहोस्", "pdf-to-bmp": "PDF लाई BMP मा बदल्नुहोस्", "pdf-to-csv": "PDF लाई CSV मा बदल्नुहोस्",
    "pdf-to-excel": "PDF लाई Excel मा बदल्नुहोस्", "pdf-to-html": "PDF लाई HTML मा बदल्नुहोस्", "pdf-to-jpg": "PDF लाई JPG मा बदल्नुहोस्",
    "pdf-to-json": "PDF लाई JSON मा बदल्नुहोस्", "pdf-to-markdown": "PDF लाई Markdown मा बदल्नुहोस्", "pdf-to-png": "PDF लाई PNG मा बदल्नुहोस्",
    "pdf-to-text": "PDF बाट Text निकाल्नुहोस्", "pdf-to-tiff": "PDF लाई TIFF मा बदल्नुहोस्", "pdf-to-webp": "PDF लाई WebP मा बदल्नुहोस्",
    "pdf-to-word": "PDF लाई Word मा बदल्नुहोस्", "protect-pdf": "PDF मा पासवर्ड सुरक्षा राख्नुहोस्", "remove-annotations": "PDF का टिप्पणी हटाउनुहोस्",
    "remove-attachments": "PDF का संलग्न फाइल हटाउनुहोस्", "remove-blank-pages": "PDF का खाली पृष्ठ हटाउनुहोस्", "remove-pdf-links": "PDF का लिंक हटाउनुहोस्",
    "remove-pdf-metadata": "PDF को Metadata हटाउनुहोस्", "reorder-pdf": "PDF पृष्ठको क्रम मिलाउनुहोस्", "repair-pdf": "बिग्रिएको PDF मर्मत गर्नुहोस्",
    "rotate-pdf": "PDF घुमाउनुहोस्", "rotate-selected-pages": "PDF का छानिएका पृष्ठ घुमाउनुहोस्", "sign-pdf": "PDF मा हस्ताक्षर गर्नुहोस्",
    "split-by-bookmarks": "बुकमार्कअनुसार PDF छुट्याउनुहोस्", "split-pdf": "PDF छुट्टाछुट्टै भागमा विभाजन गर्नुहोस्", "unlock-pdf": "PDF को पासवर्ड हटाउनुहोस्",
    "watermark": "PDF मा वाटरमार्क थप्नुहोस्"
  }
};
const localizedFaqs: Record<string, string[]> = {
  ne: [
    "{name} ले के गर्छ?",
    "{name} अनलाइन कसरी प्रयोग गर्ने?",
    "{name} प्रयोग गरेपछि के जाँच गर्ने?",
    "यसपछि कुन PDF काम उपयोगी हुन सक्छ?",
    "के यो PDF टुल मोबाइलमा चल्छ?",
    "मूल PDF को प्रतिलिपि राख्नुपर्छ?"
  ]
};

export default function ToolSEOContent({ slug, locale = "en" }: { slug: string; locale?: string }) {
  const labels = seoLabels[locale as keyof typeof seoLabels] || seoLabels.en;
  const baseGuide = getToolGuide(slug);
  if (!baseGuide) return null;
  const guide = locale === "ne" && nepaliToolGuides[slug] ? { ...baseGuide, ...nepaliToolGuides[slug] } : baseGuide;
  const toolName = localizedToolNames[locale]?.[slug] || guide.name;
  const faqs = [
    { q: localizedFaqs[locale]?.[0]?.replace("{name}", toolName) || `What does ${toolName} do?`, a: guide.purpose },
    { q: localizedFaqs[locale]?.[1]?.replace("{name}", toolName) || `How do I ${toolName.toLowerCase()} online?`, a: guide.steps.join(" ") },
    { q: localizedFaqs[locale]?.[2]?.replace("{name}", toolName) || `What should I check after using ${toolName.toLowerCase()}?`, a: guide.caution },
    { q: localizedFaqs[locale]?.[3] || "Which PDF tasks may I need next?", a: locale === "ne" ? `तपाईंको कामअनुसार सम्बन्धित टुलहरू प्रयोग गर्न सक्नुहुन्छ: ${guide.related.map((item) => item.replace(/-/g, " ")).join(", ")}। मूल PDF सुरक्षित राख्नुहोस् र नतिजा साझा गर्नुअघि जाँच्नुहोस्।` : `Depending on your document workflow, related tasks include ${guide.related.map((item) => item.replace(/-/g, " ")).join(", ")}. Keep the original PDF and inspect each processed file before sharing it.` },
    { q: localizedFaqs[locale]?.[4] || "Can I use this PDF tool on a phone?", a: locale === "ne" ? "यो टुल आधुनिक मोबाइल ब्राउजरमा उपलब्ध छ। फाइल छान्ने र डाउनलोड गर्ने तरिका तपाईंको डिभाइस, ब्राउजर र उपलब्ध स्टोरेजअनुसार फरक हुन सक्छ।" : "The tool is available in modern mobile browsers. File selection and download behaviour can vary by device, browser and available storage." },
    { q: localizedFaqs[locale]?.[5] || "Should I keep a copy of the original PDF?", a: locale === "ne" ? "हो। अन्तिम फाइल खोलेर जाँच नगरेसम्म र आवश्यक पृष्ठ तथा जानकारी भएको पुष्टि नगरेसम्म मूल PDF को नबदलिएको प्रतिलिपि राख्नुहोस्।" : "Yes. Keep an untouched copy until you have opened and checked the final file and confirmed that it contains the pages and information you need." }
  ];
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) };
  return (
    <article className="mx-auto w-full max-w-4xl px-4 pb-14 sm:px-6"><div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">{labels[0]}</p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">{labels[1]} {toolName} {labels[2]}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">{guide.purpose}</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? `अध्ययन, कार्यालयको काम, अभिलेख व्यवस्थापन वा अनलाइन आवेदनका लागि PDF तयार गर्दा यो प्रक्रिया उपयोगी हुन सक्छ। यस मार्गदर्शिकामा ${toolName} को उपयोग, फाइल तयार गर्ने तरिका, प्रक्रिया पूरा भएपछि जाँच्नुपर्ने कुरा र सम्भावित सीमाबारे जानकारी दिइएको छ। वास्तविक विकल्पहरू माथिको टुलमा देखाइएका विकल्पअनुसार हुन्छन्।` : `People search for phrases such as “${guide.keyword}” when they need to prepare a document for study, work, record keeping or an online submission. This guide explains the purpose of the operation, how to prepare a source file, what to check after processing and which limitations may affect the result. The exact controls are the ones displayed in the tool workspace above.`}</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "सुरु गर्नुअघि मूल PDF खोलेर आवश्यक पृष्ठ र सामग्री ठीक छन् कि जाँच्नुहोस्। महत्त्वपूर्ण कागजात भए नबदलिएको प्रतिलिपि छुट्टै राख्नुहोस्। फाइल बुझाउने वेबसाइटले आकार, पृष्ठ संख्या, पृष्ठको मापन वा अन्य PDF सर्त तोकेको छ कि पहिले हेर्नुहोस्। गलत फाइल छानेर प्रक्रिया दोहोर्‍याउनुभन्दा सुरुमा सही फाइल तयार गर्नु राम्रो हुन्छ।" : "Before you begin, open the original PDF and check that it contains the correct pages. If the document is important, save an untouched backup. Check whether the receiving website has a maximum file size, page count, page dimension or other PDF requirement. Preparing the right source file is often more useful than repeating the operation after a preventable input mistake."}</p>
      </section>
      <AdsterraNative />
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[3]} {toolName.toLowerCase()} {labels[4]}</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-8 text-slate-700">
          <li>{locale === "ne" ? `यस पृष्ठको ${toolName} टुल खोल्नुहोस् र प्रशोधन गर्न चाहेको PDF छान्नुहोस्।` : `Open the ${guide.name} workspace on this page and choose the PDF you want to process.`}</li>
          {guide.steps.map((step) => <li key={step}>{step}</li>)}
          <li>{locale === "ne" ? "प्रक्रिया पूरा भएपछि बनेको PDF डाउनलोड गर्नुहोस् र अर्को PDF रिडरमा खोलेर जाँच्नुहोस्।" : "Wait until processing has finished, download the generated PDF and open it in a separate PDF reader."}</li>
          <li>{locale === "ne" ? "नतिजा साझा, प्रिन्ट वा बुझाउनुअघि परिवर्तन भएका पृष्ठलाई मूल कागजातसँग तुलना गर्नुहोस्।" : "Compare the affected pages with your original document before sharing, printing or submitting the output."}</li>
        </ol>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "टुलमा देखिएका नियन्त्रण मात्र प्रयोग गर्नुहोस्। फरक PDF कामका सेटिङ पनि फरक हुन्छन्; पृष्ठ छान्ने, कम्प्रेस स्तर वा सम्पादन विकल्प टुलमा देखिएको छैन भने उपलब्ध छ भनेर नमान्नुहोस्।" : "Use the controls that are actually available in the workspace. Different PDF operations have different settings, so do not assume that a page-selection option, compression level or editing control exists unless it is shown on this tool page."}</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[5]}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">{guide.purpose} locale === "ne" ? "यो प्रक्रिया असाइनमेन्ट मिलाउन, रिपोर्ट तयार गर्न, कार्यालयका अभिलेख व्यवस्थित गर्न वा अनलाइन फाराममा कागजात अपलोड गर्न उपयोगी हुन सक्छ। उपयुक्त तरिका मूल फाइल र परिवर्तन गर्नुपर्ने कारणमा निर्भर हुन्छ।" : "It may be useful when organising an assignment, preparing a report, arranging business records or meeting a document upload requirement. The best workflow depends on the source file and the reason you need to change it."</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "उदाहरणका लागि, कलेजको पोर्टलमा बुझाउनुअघि विद्यार्थीले कागजातको पृष्ठक्रम मिलाउनुपर्ने हुन सक्छ। कार्यालयमा सहकर्मीलाई रिपोर्ट पठाउनुअघि फाइल तयार गर्नुपर्ने हुन सक्छ। व्यक्तिगत अभिलेख राख्ने व्यक्तिले पढ्न सजिलो प्रतिलिपि चाहन सक्छ। जुनसुकै अवस्थामा पनि प्राप्त गर्ने निकायको निर्देशन पहिले पालना गर्नुहोस्; PDF खुले पनि तोकिएको ढाँचा नमिलेमा अस्वीकार हुन सक्छ।" : "For example, a student may need a document in a particular order before uploading it to a college portal. An office worker may need to prepare a report for colleagues. A person keeping personal records may want a cleaner document that is easier to review. In every case, follow the recipient&apos;s instructions first; a technically valid PDF may still be rejected if it does not meet the required format."}</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "धेरै फाइल वा लामो कागजातमा काम गर्दा प्रतिलिपिबाट सुरु गर्नुहोस् र पहिले केही पृष्ठमा परीक्षण गर्नुहोस्। यसो गर्दा अप्रत्याशित परिवर्तन भए सम्पूर्ण कागजातमा असर पर्नुअघि थाहा पाउन सकिन्छ।" : "If you are handling a large bundle, work on a copy and process a small sample first. This makes it easier to identify an unexpected change before it affects the whole document."}</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[6]}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">{guide.caution}</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "PDF भित्र छान्न मिल्ने पाठ, स्क्यान गरिएका पृष्ठका तस्बिर, इम्बेड गरिएका फन्ट, बुकमार्क, फारामका फिल्ड, टिप्पणी, लिंक र डिजिटल हस्ताक्षर हुन सक्छन्। प्रत्येक प्रक्रिया सबै फाइलमा यी सबै सुविधा जस्ताको तस्तै राख्न सक्षम नहुन सक्छ। स्क्यान गरिएको PDF र पाठमा आधारित PDF फरक तरिकाले प्रशोधन हुन सक्छन्; पासवर्ड सुरक्षा वा फाइल बिग्रिएको अवस्थाले प्रक्रिया रोक्न सक्छ।" : "PDF is a container format. A file may include selectable text, scanned page images, embedded fonts, bookmarks, form fields, annotations, hyperlinks and digital signatures. A particular operation may not preserve every feature in every document. Scanned pages can behave differently from text-based pages, and password protection or file damage can prevent processing."}</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "प्रिन्ट गर्ने हो भने पृष्ठको मापन, मार्जिन र तस्बिरको स्पष्टता जाँच्नुहोस्। स्क्रिनमा पढ्ने हो भने अक्षर प्रस्ट छन् कि र आवश्यक लिंक वा बुकमार्क चल्छन् कि हेर्नुहोस्। डिजिटल हस्ताक्षर भएको फाइलमा प्रक्रिया गर्दा हस्ताक्षर गरिएको सामग्री परिवर्तन हुन्छ वा हस्ताक्षर अमान्य हुन्छ कि बुझेर मात्र नतिजा प्रयोग गर्नुहोस्।" : "If the output is intended for printing, inspect page dimensions, margins and image clarity. If it is intended for reading on screen, check that text is legible and links or bookmarks work where relevant. If it contains a digital signature, confirm whether the operation changes the signed content or invalidates the signature before using the result."}</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[7]}</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-8 text-slate-700">
          <li>{locale === "ne" ? "अन्तिम फाइल जाँच पूरा नहुँदासम्म मूल PDF को नबदलिएको प्रतिलिपि सुरक्षित राख्नुहोस्।" : "Keep an untouched copy of the original PDF until the final file has been checked."}</li><li>{locale === "ne" ? "मूल र प्रशोधन गरिएको फाइल छुट्याउन स्पष्ट नाम राख्नुहोस्।" : "Use a clear filename so you can distinguish the source document from the processed version."}</li><li>{locale === "ne" ? "आवश्यक भए प्रक्रिया अघि र पछि फाइलको आकार तथा पृष्ठ संख्या तुलना गर्नुहोस्।" : "Check the file size and page count before and after processing if those details matter."}</li><li>{locale === "ne" ? "सफलताको सन्देशमा मात्र भर नपरी डाउनलोड गरिएको फाइल अर्को PDF रिडरमा खोल्नुहोस्।" : "Open the downloaded file in another PDF reader rather than relying only on a success message."}</li><li>{locale === "ne" ? "तालिका, साना अक्षर, तस्बिर, छाप, हस्ताक्षर र हातले लेखिएका टिप्पणी भएका पृष्ठ ध्यानपूर्वक जाँच्नुहोस्।" : "Review pages with tables, small text, images, stamps, signatures and handwritten notes carefully."}</li><li>{locale === "ne" ? "आधिकारिक रूपमा बुझाउँदा सम्बन्धित निकायका हालका सर्त पालना गर्नुहोस्।" : "For an official upload, follow the receiving organisation&apos;s current requirements."}</li>
        </ul>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "अपेक्षित नतिजा नआए मूल फाइलमाथि लेख्नुअघि प्रक्रिया रोक्नुहोस्। छानिएको फाइल र सेटिङ फेरि जाँच्नुहोस् अनि आवश्यक भए नयाँ प्रतिलिपिबाट प्रयास गर्नुहोस्। महत्त्वपूर्ण कागजातको एउटै प्रतिलिपिमा पटक-पटक प्रक्रिया नचलाउनुहोस्।" : "If you do not get the expected result, stop before overwriting the original. Recheck the selected file and settings, then try again with a fresh copy where appropriate. Avoid running repeated operations on the only copy of an important document."}</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[8]}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "PDF मा व्यक्तिगत विवरण, हस्ताक्षर, ठेगाना, वित्तीय अभिलेख वा गोप्य व्यावसायिक जानकारी हुन सक्छ। आफूलाई प्रशोधन गर्ने अनुमति भएको कागजात मात्र अपलोड गर्नुहोस्। संवेदनशील फाइल प्रयोग गर्नुअघि वेबसाइटको गोपनीयता नीति पढ्नुहोस् र सम्भव भए पहिले व्यक्तिगत विवरण नभएको नमुना फाइलबाट परीक्षण गर्नुहोस्।" : "PDFs can contain personal details, signatures, addresses, financial records or confidential business information. Upload only documents you are authorised to process. Read the site&apos;s privacy information before using it for sensitive records, and consider testing the workflow with a non-sensitive sample first."}</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "प्रशोधन गरिएको कागजात प्राप्तकर्तालाई दिनुअघि त्यसमा पठाउनुपर्ने जानकारी मात्र छ कि जाँच्नुहोस्। पृष्ठमा देखिने पाठ हटाउनु र फाइलभित्रको गोप्य डेटा सुरक्षित रूपमा मेटाउनु एउटै कुरा होइन। कानुनी रूपमा भरपर्दो गोप्य जानकारी मेटाउन आवश्यक भए त्यसैका लागि बनेको redaction टुल र उपयुक्त व्यावसायिक प्रक्रिया प्रयोग गर्नुहोस्।" : "Do not share a processed document until you have checked that it contains only the information intended for the recipient. Removing visible text from a page is not necessarily the same as securely redacting underlying data. If you need legally reliable redaction, use a tool specifically designed for redaction and verify the result with an appropriate professional workflow."}</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[9]}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "PDF अपलोड नभए पहिले आफ्नो डिभाइसमा फाइल खुल्छ कि र यसको वास्तविक ढाँचा PDF नै हो कि जाँच्नुहोस्। नाम मात्र .pdf राखिएको फोटो वा अर्को कागजात वास्तविक PDF नहुन सक्छ। धेरै ठूलो, बिग्रिएको वा पासवर्डले सुरक्षित गरिएको फाइल सबै टुलले स्वीकार नगर्न सक्छन्। पृष्ठमा आकार वा ढाँचाको सीमा देखाइएको छ भने त्यही पालना गर्नुहोस्।" : "If the PDF does not upload, first check that the file opens on your device and has the expected PDF extension and structure. A renamed image or document is not necessarily a valid PDF. Very large files, damaged files and password-protected documents may not be accepted by every operation. If the page displays a file-size or format limit, follow that limit rather than repeatedly uploading the same file."}</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "प्रक्रिया रोकिएजस्तो देखिए हालको अनुरोध पूरा हुन केही समय दिनुहोस् र ब्राउजर चलिरहेको छ कि जाँच्नुहोस्। एउटै बटन पटक-पटक नथिच्नुहोस्; यसले दोहोरिएका काम वा डाउनलोड बनाउन सक्छ। त्रुटि आए सन्देश टिप्नुहोस्, इनपुट फाइल जाँच्नुहोस् र आवश्यक भए सानो प्रतिलिपिबाट प्रयास गर्नुहोस्। समस्या मूल फाइलमै छ कि बुझ्न साधारण PDF बाट पनि परीक्षण गर्न सकिन्छ।" : "If processing appears to stop, give the current request time to finish and check whether the browser is still working. Avoid pressing the action button several times, because repeated submissions can create duplicate jobs or downloads. If an error appears, note the message, check the input and try a smaller copy. You can also test with a simple PDF to see whether the issue is specific to the original document."}</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "डाउनलोड गरिएको नतिजा ठीक नदेखिए अर्को PDF रिडरमा खोलेर परिवर्तन भएका पृष्ठ जाँच्नुहोस्। पृष्ठक्रम, दिशा, पाठको दृश्यता, तस्बिरको गुणस्तर र फाइल आकार हेर्नुहोस्। समस्या बाँकी रहे गलत नतिजालाई फेरि प्रशोधन गर्नुको सट्टा मूल प्रतिलिपिबाट सही सेटिङसहित पुनः प्रयास गर्नुहोस्।" : "If the downloaded result does not look right, open it in another PDF reader and inspect the pages affected by the operation. Check page order, orientation, text visibility, image quality and file size. If the issue remains, return to the untouched source file and repeat the task with corrected settings rather than processing an already incorrect output again."}</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[10]}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "PDF टुल असाइनमेन्ट, स्क्यान प्रमाणपत्र, कार्यालय रिपोर्ट, बिल, आवेदन र व्यक्तिगत अभिलेख तयार गर्न प्रयोग हुन्छन्। कागजात बुझाउने प्रत्येक निकायका आफ्नै सर्त हुन सक्छन्। कलेज पोर्टलले पृष्ठक्रम वा फाइल आकार तोक्न सक्छ, रोजगारदाताले पढ्न सजिलो CV माग्न सक्छ, र अनलाइन फारामले निश्चित फाइल ढाँचा मात्र स्वीकार्न सक्छ। कागजात परिवर्तन गर्नुअघि ती निर्देशन जाँच्नुहोस्।" : "PDF tools are commonly used to prepare assignments, scanned certificates, office reports, invoices, application documents and personal records. Each receiving organisation may have its own requirements. A college portal may specify page order or file size; an employer may request a readable CV; and an online form may accept only a particular file type. Check those instructions before changing the document."}</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "पढाइका कागजातमा पृष्ठक्रम, चित्र, समीकरण र साना अक्षर जाँच्नुहोस्। व्यावसायिक रिपोर्टमा तालिका, हेडर, फुटर र पृष्ठ नम्बर हेर्नुहोस्। आवेदन वा प्रमाणपत्रमा जारी गर्ने वा प्राप्त गर्ने निकायको अनुमति बिना हस्ताक्षर वा प्रमाणित सामग्री परिवर्तन नगर्नुहोस्। अनलाइन टुलको सुविधा भन्दा कागजातमा लागू हुने नियम महत्त्वपूर्ण हुन्छ।" : "For a study document, pay attention to page order, diagrams, equations and small text. For a business report, check tables, headers, footers and page numbering. For an application or certificate, avoid changing signed or certified content unless the issuing or receiving organisation permits it. A convenient online operation should never override the rules that apply to the document."}</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">{locale === "ne" ? "धेरै कागजात तयार गर्दा स्पष्ट फाइल नाम र एउटै व्यवस्थित प्रक्रिया अपनाउनुहोस्। मूल फाइल सुरक्षित राख्नुहोस्, आवश्यक काम गर्नुहोस्, नतिजा जाँच्नुहोस् र त्यसपछि मात्र अर्को कागजातमा जानुहोस्। यसले सही संस्करण भेट्न सजिलो बनाउँछ र पुरानो वा अपूरो फाइल बुझाउने जोखिम घटाउँछ।" : "When preparing multiple documents, use clear filenames and a consistent process. Keep the source file, perform the required operation, inspect the result and only then move to the next task. This makes it easier to find the correct version later and reduces the risk of submitting an outdated or incomplete document."}</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[11]}</h2>
        <div className="mt-5 space-y-5">{faqs.map((item) => <div key={item.q}><h3 className="font-bold text-slate-950">{item.q}</h3><p className="mt-2 text-sm leading-8 text-slate-600">{item.a}</p></div>)}</div>
      </section>
      <section className="rounded-3xl border border-violet-100 bg-violet-50 p-6 sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{locale === "ne" ? "सम्बन्धित PDF टुल र मार्गदर्शिका" : "Related PDF tools and guides"}</h2>
        <p className="mt-3 text-sm leading-8 text-slate-700">{locale === "ne" ? "केही PDF काम सही क्रममा गर्दा सजिलो हुन्छ। पहिले कागजात व्यवस्थित गर्नुहोस्, त्यसपछि मुख्य प्रक्रिया पूरा गरी अन्तिम नतिजा जाँच्नुहोस्। आवश्यक काम मात्र गर्नुहोस्; उपलब्ध सबै प्रक्रिया अनावश्यक रूपमा लागू नगर्नुहोस्।" : "Some PDF tasks are easier when completed in a sensible order. You may want to organise or prepare a document first, complete the main operation, and then inspect the final result. Use only the steps required for your document rather than applying every available operation."}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/blog/${guide.blogSlug}`} className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-bold text-white hover:bg-violet-800">{locale === "ne" ? `${toolName} को विस्तृत मार्गदर्शिका पढ्नुहोस्` : `Read the complete ${toolName} guide`}</Link>
          {guide.related.map((slug) => { const related = getToolGuide(slug); return related ? <Link key={slug} href={`${locale === "en" ? "" : `/${locale}`}/${slug}`} className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-bold text-violet-800 hover:bg-violet-100">{localizedToolNames[locale]?.[slug] || related.name}</Link> : null; })}
        </div>
      </section>
    </div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /></article>
  );
}
