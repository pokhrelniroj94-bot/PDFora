import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PDForaTool from "../../../components/PDForaTool";
import Niroj77Tool from "../../../components/Niroj77Tool";
import ToolGuide from "../../../components/ToolGuide";
import { isLocale, isRoutable } from "../../../lib/i18n/config";
import { nepaliToolGuides } from "../../../lib/i18n/tool-guides-ne";
import { nepaliToolNames } from "../../../lib/i18n/pdf-tool-names-ne";
import { getNepaliPdfRoute, nepaliPdfRoutes } from "../../../lib/i18n/nepali-pdf-routes";
import { buildLocaleMetadata } from "../../../lib/i18n/metadata";
import NepseMarketDashboard from "../../../components/NepseMarketDashboard";
import ResumeBuilder from "../../../components/ResumeBuilder";
import NepaliStaticPage from "../../../components/NepaliStaticPage";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return [...Object.keys(nepaliPdfRoutes), "market", "resume-builder", "privacy", "terms", "about", "contact"].map((slug) => ({ locale: "ne", slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale === "ne" && slug === "market") {
    return buildLocaleMetadata({
      locale,
      path: "/market",
      title: "NEPSE बजार ड्यासबोर्ड | PDFora",
      description: "NEPSE सूचकाङ्क, शेयर मूल्य, बजारका बढेका/घटेका शेयर र ऐतिहासिक चार्टको नेपाली ड्यासबोर्ड।",
    });
  }
  if (locale === "ne" && slug === "resume-builder") {
    return buildLocaleMetadata({
      locale,
      path: "/resume-builder",
      title: "नेपाली रिजुमे बिल्डर तथा CV टेम्प्लेट | PDFora",
      description: "२० व्यावसायिक टेम्प्लेट, प्रत्यक्ष A4 पूर्वावलोकन र PDF निर्यातसहित नेपाली रिजुमे तथा CV बनाउनुहोस्।",
    });
  }
  const staticMetadata: Record<string, { title: string; description: string }> = {
    privacy: { title: "नेपाली गोपनीयता नीति | PDFora", description: "PDFora ले फाइल, कुकी, AI र तेस्रो पक्षका सेवासँग सम्बन्धित जानकारी कसरी सम्हाल्छ भन्ने नेपाली नीति।" },
    terms: { title: "नेपाली सेवा सर्तहरू | PDFora", description: "PDFora का सेवा प्रयोग, फाइल, उपलब्धता र दायित्वसम्बन्धी नेपाली सर्तहरू।" },
    about: { title: "PDFora बारेमा | नेपाली", description: "PDFora का PDF टुल, नेपाल उपयोगी क्याल्कुलेटर र प्लेटफर्मको उद्देश्यबारे नेपाली जानकारी।" },
    contact: { title: "PDFora सम्पर्क | नेपाली", description: "PDFora का टुल सहायता, सुझाव र गोपनीयता प्रश्नका लागि नेपाली सम्पर्क जानकारी।" },
  };
  if (locale === "ne" && staticMetadata[slug]) {
    return buildLocaleMetadata({ locale, path: `/${slug}`, ...staticMetadata[slug] });
  }
  const route = getNepaliPdfRoute(slug);
  if (!route || locale !== "ne") return { title: "Page not found", robots: { index: false, follow: true } };
  const name = nepaliToolNames[slug] ?? route.title;
  const guide = nepaliToolGuides[slug];
  return buildLocaleMetadata({
    locale,
    path: `/${slug}`,
    title: `${name} | PDFora`,
    description: guide?.purpose ?? route.description,
  });
}

export default async function NepaliPdfToolPage({ params }: Props) {
  const { locale, slug } = await params;
  if (locale === "ne" && slug === "market") {
    return <NepseMarketDashboard locale="ne" />;
  }
  if (locale === "ne" && slug === "resume-builder") {
    return <ResumeBuilder locale="ne" />;
  }
  if (locale === "ne" && ["privacy", "terms", "about", "contact"].includes(slug)) {
    return <NepaliStaticPage page={slug as "privacy" | "terms" | "about" | "contact"} />;
  }
  const route = getNepaliPdfRoute(slug);
  if (locale !== "ne" || !isLocale(locale) || !isRoutable(locale) || !route) notFound();

  const guide = nepaliToolGuides[slug];
  const localizedName = nepaliToolNames[slug] ?? route.title;
  const localizedDescription = guide?.purpose ?? route.description;
  const commonProps = {
    endpoint: route.endpoint,
    title: localizedName,
    description: localizedDescription,
    multiple: route.multiple,
    accept: route.accept,
    downloadName: route.downloadName,
    fieldName: route.fieldName,
    formField: route.formField,
    formPlaceholder: route.formPlaceholder,
    queryField: route.queryField,
    queryDefault: route.queryDefault,
  };

  return (
    <main lang="ne" className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">PDFora नेपाली PDF टुल</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-5xl">{nepaliToolNames[slug] ?? route.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">{localizedDescription}</p>
        </header>
        <div className="mt-8">
          {route.component === "pdfora" ? <PDForaTool {...commonProps} /> : <Niroj77Tool {...commonProps} extraFields={route.extraFields} />}
        </div>
        {guide && <ToolGuide guide={{ ...guide, slug, name: localizedName, keyword: "", related: [], blogSlug: "" }} />}
        {slug === "rotate-pdf" && (
          <section className="mx-auto mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">PDF का सबै पृष्ठ सही दिशामा कसरी घुमाउने?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              स्क्यानरबाट आएको कागजात, मोबाइलबाट खिचिएको पृष्ठ वा पुरानो रिपोर्टमा केही वा सबै पृष्ठ तेर्सो देखिन सक्छन्। घुमाउनुअघि कुन पृष्ठको दिशा बिग्रिएको छ भनेर PDF reader मा जाँच्नुहोस्। सबै पृष्ठ एउटै दिशामा बिग्रिएका छन् भने यो Rotate PDF उपकरण प्रयोग गर्नुहोस्।
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700">
              <li>मूल PDF को सुरक्षित प्रतिलिपि राख्नुहोस् र फाइल सही खुलेको पुष्टि गर्नुहोस्।</li>
              <li>माथिको उपकरणमा PDF अपलोड गरी आवश्यक rotation कोण छान्नुहोस्।</li>
              <li>प्रक्रिया पूरा भएपछि नयाँ PDF डाउनलोड गर्नुहोस्।</li>
              <li>पहिलो, बीचको र अन्तिम पृष्ठ खोलेर पाठ, चित्र र पृष्ठको दिशा जाँच्नुहोस्।</li>
            </ol>
            <h3 className="mt-6 font-bold text-slate-950">के केही पृष्ठ मात्र घुमाउनुपर्छ?</h3>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              कागजातमा एउटा वा केही पृष्ठ मात्र उल्टो छन् भने सबै पृष्ठ घुमाउँदा सही रहेका पृष्ठ पनि गलत हुन सक्छन्। त्यस्तो अवस्थामा <a className="font-semibold text-blue-700 underline" href="/ne/rotate-selected-pages">छानिएका PDF पृष्ठ घुमाउने उपकरण</a> प्रयोग गरी पृष्ठ नम्बर र नतिजा छुट्टाछुट्टै जाँच्नुहोस्।
            </p>
            <h3 className="mt-6 font-bold text-slate-950">घुमाउँदा PDF को सामग्री परिवर्तन हुन्छ?</h3>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              सामान्य rotation ले पृष्ठको दृश्य दिशा बदल्छ; यसले स्क्यान गरिएको चित्रभित्रको अक्षरलाई आफैँ editable text बनाउँदैन। हस्ताक्षर, तालिका वा फाराम भएका महत्त्वपूर्ण पृष्ठ डाउनलोडपछि फेरि जाँच्नुहोस्।
            </p>
          </section>
        )}
        {slug === "pdf-to-word" && (
          <section className="mx-auto mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">PDF लाई सम्पादनयोग्य Word फाइलमा बदल्दा के जाँच्ने?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              PDF-to-Word रूपान्तरण रिपोर्ट, पत्र वा assignment का पाठ संशोधन गर्न उपयोगी हुन्छ। तर PDF ले पृष्ठको देखिने बनावट सुरक्षित गर्छ; त्यसैले Word मा रूपान्तरण हुँदा अनुच्छेद, column, तालिका र चित्रको स्थान सर्न सक्छ। नतिजा मूल कागजातसँग तुलना गरेर मात्र प्रयोग गर्नुहोस्।
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700">
              <li>PDF reader मा एउटा वाक्य चयन गरेर selectable text छ कि जाँच्नुहोस्।</li>
              <li>माथिको उपकरणबाट फाइल रूपान्तरण गरी DOCX डाउनलोड गर्नुहोस्।</li>
              <li>Word वा मिल्दो editor मा खोलेर शीर्षक, अनुच्छेद, तालिका र page break जाँच्नुहोस्।</li>
              <li>नाम, मिति, रकम, विशेष चिन्ह र हस्ताक्षर मूल PDF सँग मिलाउनुहोस्।</li>
            </ol>
            <h3 className="mt-6 font-bold text-slate-950">स्क्यान गरिएको PDF किन फरक हुन्छ?</h3>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              स्क्यान गरिएको पृष्ठमा शब्दहरू चित्रका pixel का रूपमा हुन्छन्, selectable text का रूपमा होइनन्। यस्तो फाइलमा OCR आवश्यक पर्न सक्छ र OCR ले अंक, विरामचिह्न वा नेपाली अक्षर गलत चिन्न सक्छ। रूपान्तरणपछि सबै महत्त्वपूर्ण अंश प्रूफरिड गर्नुहोस्।
            </p>
            <h3 className="mt-6 font-bold text-slate-950">Word होइन, plain text चाहिएको हो?</h3>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              केवल पाठ निकालेर खोज्न वा अर्को ठाउँमा सार्न चाहनुहुन्छ भने <a className="font-semibold text-blue-700 underline" href="/ne/pdf-to-text">PDF बाट Text निकाल्ने उपकरण</a> उपयुक्त हुन सक्छ। त्यसले मूल layout राख्दैन; कुन format चाहिन्छ भन्ने आधारमा उपकरण छान्नुहोस्।
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
