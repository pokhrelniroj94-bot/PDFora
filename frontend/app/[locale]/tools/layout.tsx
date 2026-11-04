import type { Metadata } from "next";
import Link from "next/link";

const site = "https://pd-fora.vercel.app";
const languages = [
  ["ne", "नेपाली"], ["hi", "हिन्दी"], ["es", "Español"], ["fr", "Français"],
  ["de", "Deutsch"], ["pt", "Português"], ["ar", "العربية"], ["bn", "বাংলা"],
  ["id", "Bahasa Indonesia"], ["zh", "简体中文"], ["ja", "日本語"],
] as const;

export const metadata: Metadata = {
  title: { default: "PDFora Tools", template: "%s | PDFora" },
  description: "Browse PDFora's online tools and utilities.",
  alternates: { canonical: `${site}/tools` },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default async function LocalizedToolsLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  return <>
    <nav aria-label="Choose interface language" className="border-b border-slate-200 bg-white px-4 py-2">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 text-xs">
        <span className="mr-1 font-semibold text-slate-500">Language:</span>
        {languages.map(([code, name]) => (
          <Link key={code} href={`/${code}/tools`} hrefLang={code} aria-current={locale === code ? "page" : undefined}
            className={locale === code ? "rounded-md bg-teal-700 px-2.5 py-1.5 font-bold text-white" : "rounded-md border border-slate-200 px-2.5 py-1.5 font-semibold text-slate-700 hover:border-teal-500"}>
            {name}
          </Link>
        ))}
      </div>
    </nav>
    {children}
  </>;
}
