import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import ToolWorkspace from "../../../components/AllTools";
import CatalogToolSEOContent from "../../../components/CatalogToolSEOContent";
import { toolCatalog } from "../../../components/toolCatalog";
import { blogPosts } from "../../../lib/blog-posts";
import { legacyToolSlugSet } from "../../../lib/legacy-tool-slugs";

const site = "https://pd-fora.vercel.app";
export function generateStaticParams() {
  return toolCatalog.filter((tool) => tool.slug !== "pdf-tools").map((tool) => ({ slug: tool.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolCatalog.find((item) => item.slug === slug);
  if (!tool || slug === "pdf-tools") return { title: "Page not found", robots: { index: false, follow: true } };
  const title = `Free ${tool.name} Online`;
  const socialTitle = `${tool.name} Online | PDFora`;
  const description = `${tool.description.replace(/[.!?]$/, "")}. Use this free online ${tool.category.toLowerCase()} tool on PDFora. Review the result before saving or sharing.`.slice(0, 160);
  const keywords = [tool.name, ...tool.keywords.split(/[, ]+/).filter(Boolean), `${tool.name.toLowerCase()} online`, `free ${tool.name.toLowerCase()}`];
  const canonical = legacyToolSlugSet.has(slug) ? `${site}/${slug}` : `${site}/tools/${slug}`;
  return {
    title, description, keywords,
    alternates: { canonical },
    robots: { index: slug !== "ocr-pdf", follow: true },
    openGraph: { type: "website", title: socialTitle, description, url: canonical, siteName: "PDFora", images: [{ url: `/tools/${tool.slug}/opengraph-image`, width: 1200, height: 630, alt: `${tool.name} on PDFora` }] },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [`/tools/${tool.slug}/opengraph-image`] },
  };
}
export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolCatalog.find((item) => item.slug === slug);
  if (!tool || slug === "pdf-tools") notFound();
  if (legacyToolSlugSet.has(slug)) permanentRedirect(`/${slug}`);
  const related = toolCatalog.filter((item) => item.category === tool.category && item.slug !== slug && item.slug !== "pdf-tools").slice(0, 4);
  const guide = blogPosts.find((post) => post.toolLinks.some((link) => link.href === `/tools/${slug}`));
  const categoryChecks: Record<string, string> = {
    PDF: "Check page order, layout, selectable text, links, forms and signatures in the exported file. Keep the original document until you have verified the result.",
    Finance: "Check the currency, time period, rate, fees and assumptions. Compare the estimate with an official statement or provider quote before making a financial decision.",
    Text: "Check punctuation, line breaks, spaces and Unicode characters in the result. Keep a copy of the original text before making bulk changes.",
    Developer: "Test the output with a parser, test suite or independent implementation. Never treat encoding as encryption or paste secrets into a public utility.",
    Image: "Inspect dimensions, file size, image quality, transparency and colour after export. Keep the original image in case you need to retry with different settings.",
    Math: "Verify the formula, units, decimal precision and rounding. Test a simple example with a known answer before relying on a larger calculation.",
    SEO: "Check the live page, canonical URL, indexability, search intent and actual search-platform reports. A tool score does not guarantee rankings or indexing.",
    Business: "Confirm whether the inputs represent revenue, cost, margin, tax-inclusive prices or tax-exclusive prices. Record assumptions before using the result in a budget or quote.",
    Nepal: "Check the applicable fiscal year, BS or AD date, currency, units, region and eligibility. Verify important results against the latest responsible government or provider notice."
  };
  const categoryNote = categoryChecks[tool.category] ?? "Check the input format, units and assumptions, then compare an important result with a trusted reference.";
  const defaultQuestions = [
    { q: `What does the ${tool.name} do?`, a: tool.description },
    { q: `What should I check when using the ${tool.name}?`, a: categoryNote },
    { q: `What should I prepare before using the ${tool.name}?`, a: `${tool.description} Prepare the source information requested by the fields shown in the tool, and check units or file formats before processing.` },
    { q: `Can I rely on the ${tool.name} result as an official record?`, a: "No. This online utility is a practical aid. Confirm important financial, legal, government, medical or compliance results with the responsible authority or qualified professional." }
  ];
  const questionsBySlug: Record<string, { q: string; a: string }[]> = {
    "neb-gpa-calculator": [
      { q: "How is GPA calculated?", a: "Multiply each subject's grade point by its credit hours, add those weighted points, then divide by the total credit hours. GPA = Σ(credit × grade point) ÷ Σ(credit hours)." },
      { q: "Should I enter marks or grade points?", a: "Enter the grade point from your official grade sheet, not raw marks. Select the matching letter grade and enter the subject's credit hours." },
      { q: "Why does a 4-credit subject affect GPA more?", a: "A subject with more credit hours has a larger weight in the calculation. For example, 4 credits at 3.5 contributes 14 weighted points, while 2 credits at 3.5 contributes 7." },
      { q: "Is this an official NEB GPA result?", a: "No. This is an estimate using the displayed grade-point assumptions. Confirm your programme's grading scale and credit hours with the official NEB result or school." }
    ],
    "nepal-land-area-converter": [
      { q: "How many square feet are in one ropani?", a: "One standard ropani is 5,476 square feet, equal to 16 aana, 64 paisa or 256 daam." },
      { q: "How many square feet are in one bigha?", a: "The common Terai conversion is 72,900 square feet, equal to 20 kattha or 400 dhur." },
      { q: "Can I convert ropani and bigha directly?", a: "Yes. The converter first converts each local unit to square feet, then shows equivalent values in the hill and Terai systems as well as square metres." },
      { q: "Can I use this conversion for a land purchase or legal deed?", a: "Use it as a reference calculation only. Confirm the parcel's official area, boundary and unit with the cadastral record and relevant land revenue office." }
    ],
    "nepal-vat-calculator": [
      { q: "What VAT rate is preselected?", a: "The calculator starts with 13%, but the rate field is editable. Confirm the applicable rate and tax treatment with current Inland Revenue Department guidance." },
      { q: "How do I add VAT to a price?", a: "Multiply the pre-VAT amount by the VAT rate to get VAT, then add VAT to the base amount. At 13%, NPR 1,000 becomes NPR 1,130." },
      { q: "How do I remove VAT from a VAT-inclusive amount?", a: "Divide the inclusive amount by 1 plus the VAT rate as a decimal. At 13%, divide by 1.13 to find the pre-VAT base." },
      { q: "Is this an official tax assessment?", a: "No. It is a simple estimate and does not determine tax eligibility, exemptions or the correct treatment of a specific transaction." }
    ],
    "nepal-share-calculator": [
      { q: "Does the share calculator include transaction charges?", a: "It estimates broker commission, SEBON fee, DP charge and capital-gains tax using the editable assumptions shown in the form." },
      { q: "Are the default charges guaranteed to be current?", a: "No. Rates and tax treatment can change and may depend on transaction value, holding period and investor category. Confirm the current applicable charges." },
      { q: "How is estimated net profit calculated?", a: "The tool subtracts estimated purchase and sale charges from the gross price difference, then subtracts the estimated CGT from positive profit." },
      { q: "Does this guarantee the exact amount credited by my broker?", a: "No. It is a planning estimate, not a broker contract note or tax statement. Use your broker's final settlement report for the actual figure." }
    ],
    "nepali-date-converter": [
      { q: "Which dates does the Nepali date converter support?", a: "It supports Bikram Sambat dates from 1975-01-01 through 2099-12-30 and Gregorian dates from 1918-04-13 through 2043-04-13. Dates outside this range are rejected." },
      { q: "Can I convert both AD to BS and BS to AD?", a: "Yes. Choose English (AD) to Nepali (BS) or Nepali (BS) to English (AD), then enter the date in year-month-day order." },
      { q: "Does it accept Nepali digits?", a: "Yes. The converter accepts Devanagari numerals as well as English digits and supports common date separators." },
      { q: "Is the converted date an official government record?", a: "No. It is an online conversion aid. Verify dates used for legal, financial or government records against the original document and relevant authority." }
    ],
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
    "nepse-market-news": [
      { q: "Where do the market and IPO headlines come from?", a: "The page fetches Google News RSS search results for Nepal stock-market and IPO topics. Each headline links to the publisher; it is not an official NEPSE notice feed." },
      { q: "Are headlines live NEPSE trading data?", a: "No. Headlines are automatically refreshed search results, not live prices, order-book data or confirmed corporate actions. Check NEPSE, SEBON, CDSC or the issuing company before acting." },
      { q: "How often is the feed refreshed?", a: "The server caches feed responses for about 15 minutes and serves stale results briefly during provider interruptions." }
    ],
    "nepse-dividend-calculator": [
      { q: "How are cash dividends calculated?", a: "The estimate multiplies your eligible share quantity by the declared cash-dividend percentage and subtracts the editable withholding-tax assumption." },
      { q: "How are bonus shares estimated?", a: "The calculator multiplies eligible shares by the declared bonus percentage. Fractional entitlements and book-closure rules are not determined by this estimate." },
      { q: "Is the result an official CDSC credit?", a: "No. Confirm eligibility, final tax and credited shares with the company, CDSC and Mero Share." }
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
  const canonicalUrl = legacyToolSlugSet.has(slug) ? `${site}/${slug}` : `${site}/tools/${slug}`;
  const software = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: tool.name, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", description: tool.description, url: canonicalUrl, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site },
      { "@type": "ListItem", position: 2, name: "All Tools", item: `${site}/tools` },
      { "@type": "ListItem", position: 3, name: tool.name, item: canonicalUrl },
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
