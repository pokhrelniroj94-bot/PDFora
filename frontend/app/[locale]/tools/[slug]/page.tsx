import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolWorkspace from "../../../../components/AllTools";
import { toolCatalog } from "../../../../components/toolCatalog";
import { legacyToolSlugSet } from "../../../../lib/legacy-tool-slugs";

const site = "https://pd-fora.vercel.app";
const locales = ["ne","hi","es","fr","de","pt","ar","bn","id","zh","ja"];

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    toolCatalog.filter((tool) => tool.slug !== "pdf-tools").map((tool) => ({ locale, slug: tool.slug }))
  );
}

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
  return <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}><ToolWorkspace slug={slug} locale={locale} /></div>;
}
