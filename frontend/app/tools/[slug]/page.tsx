import type { Metadata } from "next";
import ToolWorkspace from "../../../components/AllTools";
import CatalogToolSEOContent from "../../../components/CatalogToolSEOContent";
import { toolCatalog } from "../../../components/toolCatalog";
import { blogPosts } from "../../../lib/blog-posts";

const site = "https://pd-fora.vercel.app";
export function generateStaticParams() {
  return toolCatalog.map((tool) => ({ slug: tool.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolCatalog.find((item) => item.slug === slug);
  if (!tool) return { title: "Tool not found", robots: { index: false, follow: true } };
  const title = `${tool.name} Online`;
  const socialTitle = `${title} | PDFora`;
  const description = tool.description.length > 155 ? tool.description.slice(0, 152).trimEnd() + "..." : tool.description;
  const canonical = `${site}/tools/${tool.slug}`;
  return {
    title, description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: { type: "website", title: socialTitle, description, url: canonical, siteName: "PDFora", images: [{ url: `/tools/${tool.slug}/opengraph-image`, width: 1200, height: 630, alt: `${tool.name} on PDFora` }] },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [`/tools/${tool.slug}/opengraph-image`] },
  };
}
export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolCatalog.find((item) => item.slug === slug);
  if (!tool) return <ToolWorkspace slug={slug} />;
  const related = toolCatalog.filter((item) => item.category === tool.category && item.slug !== slug && item.slug !== "pdf-tools").slice(0, 4);
  const guide = blogPosts.find((post) => post.toolLinks.some((link) => link.href === `/tools/${slug}`));
  const defaultQuestions = [
    { q: `What does the ${tool.name} do?`, a: tool.description },
    { q: "How do I use this online tool?", a: "Enter the requested values or paste your content, check the options, run the tool and review the output before copying or saving it." },
    { q: "Should I verify the result?", a: "Yes. Check important outputs independently, especially before financial, legal, medical, security or production use." }
  ];
  const questionsBySlug: Record<string, { q: string; a: string }[]> = {
    "nepal-forex-rates": [
      { q: "Where do the exchange rates come from?", a: "The tool requests the latest available published rates from the Nepal Rastra Bank official foreign-exchange API." },
      { q: "Why may the rate date be earlier than today?", a: "NRB may not publish a new rate on weekends or public holidays, so the latest available working-day rate is displayed." },
      { q: "Are these the exact rates at every bank?", a: "No. Individual banks, money changers and remittance providers may offer different rates and fees." }
    ],
    "nepal-salary-tax-calculator": [
      { q: "Does the calculator apply progressive tax bands?", a: "Yes. It calculates each taxable portion in the FY 2083/84 individual rate bands instead of applying one rate to the whole income." },
      { q: "Is the first 1% band charged for everyone?", a: "No. Statutory exceptions exist. Select the exemption only if it applies to your circumstances." },
      { q: "Does the estimate include every deduction and rebate?", a: "No. It is a resident natural-person estimate and does not automatically include every deduction, credit or special tax category." }
    ],
    "nepal-electricity-bill-calculator": [
      { q: "Which electricity connections does this estimator support?", a: "It estimates single-phase domestic 5A, 15A, 30A and 60A connections only." },
      { q: "Can I use it for a commercial or three-phase bill?", a: "No. Use the official Electricity Regulatory Commission calculator for commercial, industrial, three-phase or other tariff categories." },
      { q: "Is this the final NEA bill amount?", a: "No. The estimate may exclude arrears and account-specific adjustments. Your NEA bill is final." }
    ],
    "nepal-public-holidays-2083": [
      { q: "Are all holidays nationwide?", a: "No. Some apply only to specified regions, communities, women employees or educational institutions. Read each entry's note." },
      { q: "Why are some holiday dates shown as TBA?", a: "Some lunar or locally determined observances require a later official announcement." },
      { q: "Where can I verify the official list?", a: "Check the Ministry of Home Affairs Government and Public Holidays 2083 notice linked on the tool page." }
    ],
    "nepali-unicode-typing": [
      { q: "Does Nepali typing translate English into Nepali?", a: "No. It converts Romanized Nepali sounds into Devanagari Unicode; it does not translate English meaning." },
      { q: "Can I use the text in Word or online forms?", a: "Yes. The result is Unicode text that can be copied into applications supporting Devanagari." },
      { q: "Can this convert old Preeti text?", a: "Use the separate Preeti to Unicode converter for legacy Preeti-encoded text." }
    ]
  };
  const questions = questionsBySlug[slug] ?? defaultQuestions;
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
    <CatalogToolSEOContent tool={tool} questions={questions} related={related} guideSlug={guide?.slug} />
  </>;
}
