import Link from "next/link";
import AdsterraNative from "../app/components/AdsterraNative";
import { getToolGuide } from "../lib/tool-guides";
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

export default function ToolSEOContent({ slug, locale = "en" }: { slug: string; locale?: string }) {
  const labels = seoLabels[locale as keyof typeof seoLabels] || seoLabels.en;
  const guide = getToolGuide(slug);
  if (!guide) return null;
  const faqs = [
    { q: `What does ${guide.name} do?`, a: guide.purpose },
    { q: `How do I ${guide.name.toLowerCase()} online?`, a: guide.steps.join(" ") },
    { q: `What should I check after using ${guide.name.toLowerCase()}?`, a: guide.caution },
    { q: "Which PDF tasks may I need next?", a: `Depending on your document workflow, related tasks include ${guide.related.map((item) => item.replace(/-/g, " ")).join(", ")}. Keep the original PDF and inspect each processed file before sharing it.` },
    { q: "Can I use this PDF tool on a phone?", a: "The tool is available in modern mobile browsers. File selection and download behaviour can vary by device, browser and available storage." },
    { q: "Should I keep a copy of the original PDF?", a: "Yes. Keep an untouched copy until you have opened and checked the final file and confirmed that it contains the pages and information you need." }
  ];
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) };
  return (
    <article className="mx-auto w-full max-w-4xl px-4 pb-14 sm:px-6"><div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">{labels[0]}</p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">{labels[1]} {guide.name} {labels[2]}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">{guide.purpose}</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">People search for phrases such as “{guide.keyword}” when they need to prepare a document for study, work, record keeping or an online submission. This guide explains the purpose of the operation, how to prepare a source file, what to check after processing and which limitations may affect the result. The exact controls are the ones displayed in the tool workspace above.</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">Before you begin, open the original PDF and check that it contains the correct pages. If the document is important, save an untouched backup. Check whether the receiving website has a maximum file size, page count, page dimension or other PDF requirement. Preparing the right source file is often more useful than repeating the operation after a preventable input mistake.</p>
      </section>
      <AdsterraNative />
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[3]} {guide.name.toLowerCase()} {labels[4]}</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-8 text-slate-700">
          <li>Open the {guide.name} workspace on this page and choose the PDF you want to process.</li>
          {guide.steps.map((step) => <li key={step}>{step}</li>)}
          <li>Wait until processing has finished, download the generated PDF and open it in a separate PDF reader.</li>
          <li>Compare the affected pages with your original document before sharing, printing or submitting the output.</li>
        </ol>
        <p className="mt-4 text-sm leading-8 text-slate-700">Use the controls that are actually available in the workspace. Different PDF operations have different settings, so do not assume that a page-selection option, compression level or editing control exists unless it is shown on this tool page.</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[5]}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">{guide.purpose} It may be useful when organising an assignment, preparing a report, arranging business records or meeting a document upload requirement. The best workflow depends on the source file and the reason you need to change it.</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">For example, a student may need a document in a particular order before uploading it to a college portal. An office worker may need to prepare a report for colleagues. A person keeping personal records may want a cleaner document that is easier to review. In every case, follow the recipient&apos;s instructions first; a technically valid PDF may still be rejected if it does not meet the required format.</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">If you are handling a large bundle, work on a copy and process a small sample first. This makes it easier to identify an unexpected change before it affects the whole document.</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[6]}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">{guide.caution}</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">PDF is a container format. A file may include selectable text, scanned page images, embedded fonts, bookmarks, form fields, annotations, hyperlinks and digital signatures. A particular operation may not preserve every feature in every document. Scanned pages can behave differently from text-based pages, and password protection or file damage can prevent processing.</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">If the output is intended for printing, inspect page dimensions, margins and image clarity. If it is intended for reading on screen, check that text is legible and links or bookmarks work where relevant. If it contains a digital signature, confirm whether the operation changes the signed content or invalidates the signature before using the result.</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[7]}</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-8 text-slate-700">
          <li>Keep an untouched copy of the original PDF until the final file has been checked.</li><li>Use a clear filename so you can distinguish the source document from the processed version.</li><li>Check the file size and page count before and after processing if those details matter.</li><li>Open the downloaded file in another PDF reader rather than relying only on a success message.</li><li>Review pages with tables, small text, images, stamps, signatures and handwritten notes carefully.</li><li>For an official upload, follow the receiving organisation&apos;s current requirements.</li>
        </ul>
        <p className="mt-4 text-sm leading-8 text-slate-700">If you do not get the expected result, stop before overwriting the original. Recheck the selected file and settings, then try again with a fresh copy where appropriate. Avoid running repeated operations on the only copy of an important document.</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[8]}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">PDFs can contain personal details, signatures, addresses, financial records or confidential business information. Upload only documents you are authorised to process. Read the site&apos;s privacy information before using it for sensitive records, and consider testing the workflow with a non-sensitive sample first.</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">Do not share a processed document until you have checked that it contains only the information intended for the recipient. Removing visible text from a page is not necessarily the same as securely redacting underlying data. If you need legally reliable redaction, use a tool specifically designed for redaction and verify the result with an appropriate professional workflow.</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[9]}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">If the PDF does not upload, first check that the file opens on your device and has the expected PDF extension and structure. A renamed image or document is not necessarily a valid PDF. Very large files, damaged files and password-protected documents may not be accepted by every operation. If the page displays a file-size or format limit, follow that limit rather than repeatedly uploading the same file.</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">If processing appears to stop, give the current request time to finish and check whether the browser is still working. Avoid pressing the action button several times, because repeated submissions can create duplicate jobs or downloads. If an error appears, note the message, check the input and try a smaller copy. You can also test with a simple PDF to see whether the issue is specific to the original document.</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">If the downloaded result does not look right, open it in another PDF reader and inspect the pages affected by the operation. Check page order, orientation, text visibility, image quality and file size. If the issue remains, return to the untouched source file and repeat the task with corrected settings rather than processing an already incorrect output again.</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[10]}</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">PDF tools are commonly used to prepare assignments, scanned certificates, office reports, invoices, application documents and personal records. Each receiving organisation may have its own requirements. A college portal may specify page order or file size; an employer may request a readable CV; and an online form may accept only a particular file type. Check those instructions before changing the document.</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">For a study document, pay attention to page order, diagrams, equations and small text. For a business report, check tables, headers, footers and page numbering. For an application or certificate, avoid changing signed or certified content unless the issuing or receiving organisation permits it. A convenient online operation should never override the rules that apply to the document.</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">When preparing multiple documents, use clear filenames and a consistent process. Keep the source file, perform the required operation, inspect the result and only then move to the next task. This makes it easier to find the correct version later and reduces the risk of submitting an outdated or incomplete document.</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">{labels[11]}</h2>
        <div className="mt-5 space-y-5">{faqs.map((item) => <div key={item.q}><h3 className="font-bold text-slate-950">{item.q}</h3><p className="mt-2 text-sm leading-8 text-slate-600">{item.a}</p></div>)}</div>
      </section>
      <section className="rounded-3xl border border-violet-100 bg-violet-50 p-6 sm:p-8">
        <h2 className="text-xl font-black text-slate-950">Related PDF tools and guides</h2>
        <p className="mt-3 text-sm leading-8 text-slate-700">Some PDF tasks are easier when completed in a sensible order. You may want to organise or prepare a document first, complete the main operation, and then inspect the final result. Use only the steps required for your document rather than applying every available operation.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/blog/${guide.blogSlug}`} className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-bold text-white hover:bg-violet-800">Read the complete {guide.name} guide</Link>
          {guide.related.map((slug) => { const related = getToolGuide(slug); return related ? <Link key={slug} href={`/${slug}`} className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-bold text-violet-800 hover:bg-violet-100">{related.name}</Link> : null; })}
        </div>
      </section>
    </div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /></article>
  );
}
