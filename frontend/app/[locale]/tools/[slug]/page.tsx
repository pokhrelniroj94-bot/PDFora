import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolWorkspace from "../../../../components/AllTools";
import LocalizedToolContent from "../../../../components/LocalizedToolContent";
import { toolCatalog } from "../../../../components/toolCatalog";
import { isLocale, isRoutable, isToolContentPublished, localeInfo, SITE_URL, toolContentPublishedLocales } from "../../../../lib/i18n/config";
import { getLocalizedEntry } from "../../../../lib/i18n/messages";

type Props = { params: Promise<{ locale: string; slug: string }> };
type ToolEntry = { title?: string; description?: string; example?: string; accuracy?: string; workflow?: string; mistakes?: string };
type GuideEntry = { purpose?: string; steps?: string[]; caution?: string };
type CalculatorEntry = { formula?: string; inputs?: string[]; outputs?: string[]; assumptions?: string };
type FAQEntry = { q?: string; a?: string };

export const dynamicParams = true;

function isToolEntry(value: unknown): value is Required<ToolEntry> {
  if (!value || typeof value !== "object") return false;
  const item = value as ToolEntry;
  return ["title", "description", "example", "accuracy", "workflow", "mistakes"].every((key) => typeof item[key as keyof ToolEntry] === "string" && Boolean(item[key as keyof ToolEntry]?.trim()));
}
function isGuideEntry(value: unknown): value is Required<GuideEntry> {
  if (!value || typeof value !== "object") return false;
  const item = value as GuideEntry;
  return typeof item.purpose === "string" && Boolean(item.purpose.trim()) && typeof item.caution === "string" && Boolean(item.caution.trim()) && Array.isArray(item.steps) && item.steps.length >= 3 && item.steps.every((step) => typeof step === "string" && step.trim());
}
function isCalculatorEntry(value: unknown): value is Required<CalculatorEntry> {
  if (!value || typeof value !== "object") return false;
  const item = value as CalculatorEntry;
  return typeof item.formula === "string" && Boolean(item.formula.trim()) && Array.isArray(item.inputs) && item.inputs.length > 0 && Array.isArray(item.outputs) && item.outputs.length > 0 && typeof item.assumptions === "string" && Boolean(item.assumptions.trim());
}
function isFaqs(value: unknown): value is Required<FAQEntry>[] {
  return Array.isArray(value) && value.length >= 3 && value.every((item) => item && typeof item.q === "string" && item.q.trim() && typeof item.a === "string" && item.a.trim());
}

async function getPageContent(locale: import("../../../../lib/i18n/config").Locale, slug: string) {
  const [tool, guide, calculator, faqs, ui] = await Promise.all([
    getLocalizedEntry(locale, "tools", slug),
    getLocalizedEntry(locale, "guides", slug),
    getLocalizedEntry(locale, "calculators", slug),
    getLocalizedEntry(locale, "faqs", slug),
    import("../../../../lib/i18n/messages").then(({ getTranslator }) => getTranslator(locale, ["common", "tools", "guides", "calculators", "faqs"]))
  ]);
  return { tool, guide, calculator, faqs, ui };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isRoutable(locale) || (!isToolContentPublished(locale) && process.env.PDFORA_I18N_PREVIEW !== "1")) {
    return { title: "Page not found", robots: { index: false, follow: false } };
  }
  const base = toolCatalog.find((item) => item.slug === slug);
  if (!base || slug === "pdf-tools") return { title: "Page not found", robots: { index: false, follow: false } };
  const content = await getPageContent(locale, slug);
  if (!isToolEntry(content.tool) || !isFaqs(content.faqs)) return { title: "Translation incomplete", robots: { index: false, follow: false } };
  return {
    title: content.tool.title,
    description: content.tool.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/tools/${slug}`,
      languages: Object.fromEntries([
        ["en", `${SITE_URL}/tools/${slug}`],
        ...toolContentPublishedLocales.map((activeLocale) => [activeLocale, `${SITE_URL}/${activeLocale}/tools/${slug}`]),
        ["x-default", `${SITE_URL}/tools/${slug}`]
      ])
    },
    robots: { index: isToolContentPublished(locale), follow: true }
  };
}

export default async function LocalizedToolPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isRoutable(locale) || (!isToolContentPublished(locale) && process.env.PDFORA_I18N_PREVIEW !== "1")) notFound();
  const base = toolCatalog.find((item) => item.slug === slug);
  if (!base || slug === "pdf-tools") notFound();
  const { tool, guide, calculator, faqs, ui } = await getPageContent(locale, slug);
  if (!isToolEntry(tool) || !isFaqs(faqs)) notFound();
  const validGuide = isGuideEntry(guide) ? guide : undefined;
  const validCalculator = isCalculatorEntry(calculator) ? calculator : undefined;
  const info = localeInfo[locale];
  return <>
    <main className="flex-1" lang={info.htmlLang} dir={info.dir}>
      <div className="mx-auto max-w-7xl px-4 pt-5">
        <p className="text-xs font-semibold text-amber-700" role="note">{ui("common.previewBanner")}</p>
      </div>
      <ToolWorkspace slug={slug} />
      <LocalizedToolContent tool={tool} guide={validGuide} calculator={validCalculator} faqs={faqs}
        labels={{
          overview: String(ui("guides.overview")), example: String(ui("guides.example")),
          workflow: String(ui("tools.workflow")), accuracy: String(ui("tools.accuracy")),
          mistakes: String(ui("tools.mistakes")), steps: String(ui("guides.steps")),
          caution: String(ui("guides.caution")), formula: String(ui("calculators.formula")),
          inputs: String(ui("calculators.inputs")), outputs: String(ui("calculators.outputs")),
          assumptions: String(ui("calculators.assumptions")), faqs: String(ui("faqs.heading"))
        }} />
    </main>
  </>;
}
