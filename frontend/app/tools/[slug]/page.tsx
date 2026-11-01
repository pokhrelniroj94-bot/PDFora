import Link from "next/link";
import type { Metadata } from "next";
import ToolWorkspace from "../../../components/AllTools";
import { toolCatalog } from "../../../components/toolCatalog";

const site = "https://pd-fora.vercel.app";
export function generateStaticParams() {
  return toolCatalog.map((tool) => ({ slug: tool.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolCatalog.find((item) => item.slug === slug);
  if (!tool) return { title: "Tool not found", robots: { index: false, follow: true } };
  const title = `${tool.name} – Free Online Tool | NIROJ Tools`;
  const description = tool.description.length > 155 ? tool.description.slice(0, 152).trimEnd() + "..." : tool.description;
  const canonical = `/tools/${tool.slug}`;
  return {
    title, description,
    keywords: [...new Set([tool.name, ...tool.keywords.split(/[, ]+/).filter(Boolean), "free online tool", "NIROJ Tools"])],
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: { type: "website", title, description, url: canonical, siteName: "NIROJ Tools" },
    twitter: { card: "summary_large_image", title, description },
  };
}
export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolCatalog.find((item) => item.slug === slug);
  if (!tool) return <ToolWorkspace slug={slug} />;
  const related = toolCatalog.filter((item) => item.category === tool.category && item.slug !== slug && item.slug !== "pdf-tools").slice(0, 4);
  const questions = [
    { q: `What does the ${tool.name} do?`, a: tool.description },
    { q: "How do I use this online tool?", a: "Enter the requested values or paste your content, check the options, run the tool and review the output before copying or saving it." },
    { q: "Should I verify the result?", a: "Yes. Check important outputs independently, especially before financial, legal, medical, security or production use." }
  ];
  const software = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: tool.name, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", description: tool.description, url: `${site}/tools/${slug}`, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site },
      { "@type": "ListItem", position: 2, name: "All Tools", item: `${site}/tools` },
      { "@type": "ListItem", position: 3, name: tool.name, item: `${site}/tools/${slug}` },
    ],
  };
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: questions.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    <ToolWorkspace slug={slug} />
    <section className="mx-auto max-w-4xl px-4 pb-12">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-black text-slate-950">How to use {tool.name}</h2>
        <p className="mt-3 leading-7 text-slate-700">{tool.description} Start with a representative sample, check every field and run the tool. Review the result before copying it into another app or using it in a workflow.</p>
        <h3 className="mt-6 text-lg font-bold text-slate-900">Practical tips</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-slate-700"><li>Check units, input format and available options before processing.</li><li>Try a small sample first and compare the result with an expected output.</li><li>Keep a source copy and verify important results independently.</li></ul>
        <h3 className="mt-6 text-lg font-bold text-slate-900">Frequently asked questions</h3>
        <div className="mt-3 space-y-4">{questions.map((item) => <div key={item.q}><h4 className="font-semibold text-slate-900">{item.q}</h4><p className="mt-1 leading-7 text-slate-600">{item.a}</p></div>)}</div>
        <p className="mt-5"><Link className="font-semibold text-teal-700 underline" href={`/blog/${slug}-guide`}>Read the complete {tool.name} guide</Link></p>
      </article>
      <nav aria-label="Related tools" className="mt-6"><h2 className="text-xl font-bold text-slate-900">Related {tool.category} tools</h2><div className="mt-3 flex flex-wrap gap-3">{related.map((item) => <Link key={item.slug} href={`/tools/${item.slug}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-teal-700 hover:border-teal-500">{item.name}</Link>)}</div></nav>
    </section>
  </>;
}
