import Link from "next/link";
import type { ToolInfo } from "./toolCatalog";

type Question = { q: string; a: string };

const categoryAdvice: Record<string, { example: string; accuracy: string; workflow: string; mistakes: string }> = {
  Finance: {
    example: "For a finance example, enter realistic values and check the currency, time period, interest rate and whether the amount is monthly or annual. For an EMI or investment estimate, compare the displayed principal, interest and total with a second calculation before making a financial commitment. A calculator is useful for planning, but it cannot know every bank fee, tax rule, contract term or future market return.",
    accuracy: "Financial outputs depend on assumptions. Interest may be calculated using different conventions, fees may be charged separately, and published exchange rates may differ from the rate offered by a bank or remittance provider. Read the labels and assumptions shown by the tool. Treat the result as an estimate unless the page explicitly identifies an official live data source.",
    workflow: "A practical workflow is to calculate a baseline, change one assumption at a time, and compare the results. Save the assumptions alongside the estimate so you can reproduce it later. For a loan, ask the lender for its official repayment schedule; for tax, confirm the current rules and your eligibility; for an investment, consider risk and fees as well as projected returns.",
    mistakes: "Common mistakes include mixing monthly and annual rates, entering a percentage as a decimal, forgetting fees, using the wrong currency, or treating an estimate as a guaranteed return. Check whether the calculator expects gross or net income and whether its period is monthly or yearly."
  },
  Text: {
    example: "For a text example, paste a short sample first and inspect how punctuation, spaces, line breaks, symbols and non-English characters are handled. If you are preparing an assignment, CV, article or social post, compare the output with the original before copying it into the final document. Different apps can count words and characters differently, especially when text contains emojis, compound characters or multiple spaces.",
    accuracy: "Text tools operate on the characters and rules available in the browser. Their result may differ from a word processor that applies its own language, tokenisation or formatting rules. Conversion tools may not preserve every font-specific symbol, and placeholder generators do not create factual or publish-ready writing. Review the output in the destination application.",
    workflow: "Use a small sample, check the result, then process the full text. Keep a copy of the original when changing case, removing duplicate lines or converting text. For Nepali or other Unicode text, test a few representative words and punctuation marks before using the output in an official form or document.",
    mistakes: "Typical problems include pasting formatted text when plain text is expected, overlooking leading or trailing spaces, assuming a character count equals a word count, and copying output before checking special characters. If the result looks different in another app, check that the destination supports the same Unicode characters and font."
  },
  Developer: {
    example: "For a developer example, start with a small, non-sensitive sample that represents the real input. Validate the result in the application or command-line environment where it will be used. For JSON, confirm that the output parses; for encoding, decode a test value back to the original; for hashes, compare the digest using an independent implementation. Never use a visual result alone as proof that a production payload is correct.",
    accuracy: "Developer utilities are helpers, not a replacement for testing or security review. Encodings such as Base64 are not encryption. A hash is only as useful as the algorithm and threat model allow. URL encoding must be applied to the correct URL component, and valid JSON can still have the wrong schema or business meaning. Check the specific algorithm and format before relying on a result.",
    workflow: "Keep a known input and expected output as a regression test. Test empty values, Unicode, special characters and larger inputs where relevant. Copy the generated result into your development environment and run the normal parser, test suite or validator there. Do not paste credentials, private keys, access tokens or confidential source code into an online utility.",
    mistakes: "Frequent errors include confusing encoding with encryption, hashing with reversible conversion, URL encoding with whole-URL rewriting, and syntactic validation with semantic validation. Also check whitespace, character encoding and case sensitivity. A one-character difference can change a hash or break a signed request."
  },
  Image: {
    example: "For an image example, use a copy of the original and choose a representative photo or graphic. Compare the output dimensions, file size and visual quality at normal viewing size. For a transparent logo, check that transparency remains; for a photograph, inspect fine detail, gradients and text. A smaller file is not automatically better if it makes important content unreadable.",
    accuracy: "Image conversion and compression can change quality, metadata, colour profiles or transparency depending on the source format and output settings. Some formats do not support every feature of another format. Always inspect the exported file in the app or website where it will be used, because display and colour can vary between browsers and devices.",
    workflow: "Keep the original image, process a copy, and export to the format requested by the destination. Check pixel dimensions as well as file size. If an upload form specifies a maximum width, height, aspect ratio or file size, follow those requirements exactly and verify the final file after downloading.",
    mistakes: "Common mistakes include choosing the wrong output format, changing the aspect ratio unintentionally, compressing an already compressed image repeatedly, and overlooking transparency or small text. Check both the visual result and the actual file properties before uploading or publishing."
  },
  Nepal: {
    example: "For a Nepal-specific example, enter the date, amount, units, location or other values exactly as requested by the page. Check whether the tool uses Bikram Sambat or Gregorian dates, NPR or another currency, local units or international units, and the applicable fiscal year. If the result relates to a government form, bill, tax, holiday or financial decision, compare it with the latest notice from the responsible Nepalese authority.",
    accuracy: "Nepal-specific rates, tax bands, tariffs, holidays and administrative rules can change. A calculator or converter may use a stated fiscal year, official reference data or assumptions that do not cover every personal circumstance. Read the date and limitations shown on the page. A result should not be treated as an official certificate, bill, tax assessment or legal determination.",
    workflow: "Use the tool to prepare an estimate or convert information, then verify important results against the relevant authority or original document. For financial and tax matters, check the current Inland Revenue Department or Nepal Rastra Bank information where applicable. For electricity, telecom or public notices, confirm details with the responsible provider or government office.",
    mistakes: "Common mistakes include using an outdated fiscal year, mixing BS and AD dates, entering a local unit as an international unit, omitting a country code, or assuming a national rule applies to every district or category. Check the selected year, region, unit and eligibility before relying on the output."
  },
  Math: {
    example: "For a maths example, enter simple values whose answer you can calculate by hand. Check whether the tool expects a decimal, fraction, percentage, date or unit, then compare the result with your manual calculation. For averages, identify whether the question asks for mean, median or mode; for unit conversion, confirm that both units measure the same physical quantity.",
    accuracy: "A calculator can only calculate from the values and formula supplied. Rounding, decimal precision, date boundaries and unit definitions can affect the displayed result. A correct arithmetic answer may still be inappropriate if the wrong formula or input units were selected. Check the method as well as the final number.",
    workflow: "Start with a known example, then enter the real values. Keep sufficient decimal places during intermediate calculations and round only when the task requires it. For homework or reports, show the formula and units so another person can follow how the answer was obtained.",
    mistakes: "Avoid mixing units, entering percentages in the wrong format, rounding too early, and confusing mean with median. For date calculations, check whether the start or end date is included. For fractions and ratios, make sure the input values represent the same kind of quantity."
  },
  SEO: {
    example: "For an SEO example, enter the exact page title, URL, keyword or content you want to review. Use a real page rather than a placeholder and interpret the output as a checklist, not as a search-engine ranking prediction. Compare recommendations with the page's purpose and search intent before changing important copy or technical settings.",
    accuracy: "SEO checks are snapshots and cannot reproduce every search engine's crawler, ranking system or user context. A score does not guarantee indexing, rankings, clicks or traffic. Search performance also depends on competition, content quality, links, site reliability and user satisfaction. Verify technical findings in the relevant search platform and with a live page test.",
    workflow: "Review one page at a time, fix critical technical issues first, and keep a record of changes. Confirm canonical URLs, indexability, internal links, mobile usability and page performance using the appropriate tools. After publishing, monitor impressions, clicks and indexing over time rather than judging success from a single score.",
    mistakes: "Do not stuff keywords, create near-duplicate pages solely to target variants, or assume that adding structured data guarantees a rich result. Check that the page answers the query and that every claim in the content is accurate. A high audit score cannot compensate for a page that does not help its visitor."
  },
  Business: {
    example: "For a business example, enter realistic assumptions and identify which values are estimates. Check whether the tool expects revenue, cost, margin, tax-inclusive prices or tax-exclusive prices. Run a second scenario with a different assumption to understand how sensitive the result is before using it in a quotation, budget or operational decision.",
    accuracy: "Business calculations depend on the assumptions entered and may not include every tax, fee, contract term or local requirement. A forecast is not a guarantee. Review the calculation method and confirm important figures against invoices, accounting records or advice from a qualified professional.",
    workflow: "Use the output as a planning aid: record your assumptions, compare scenarios, and verify the final figures against source documents. If the result will be shared with a client, supplier or regulator, explain the assumptions and retain the supporting calculation.",
    mistakes: "Avoid mixing revenue with profit, markup with margin, and tax-inclusive with tax-exclusive prices. Check units, periods and currencies. Do not treat an illustrative scenario as an actual quote or binding financial commitment."
  },
  PDF: {
    example: "For a PDF example, begin with a copy of the source document and a small representative file if possible. Check the page order, text, images, page size, annotations, links and signatures that matter to your task. After processing, open the downloaded PDF in a separate reader and compare the affected pages with the original before sending or submitting it.",
    accuracy: "PDF files can contain selectable text, scanned images, embedded fonts, forms, annotations, bookmarks and digital signatures. A particular operation may not preserve every feature in every file. Password protection, damaged structures and unusual fonts can also affect processing. Read the tool's on-page limits and inspect the output rather than assuming every document will behave identically.",
    workflow: "Keep an untouched original, perform one operation at a time, and give the output a clear filename. If you need several changes, verify each intermediate result before continuing. For official or signed documents, check whether editing is permitted and whether the receiving organisation requires the original digital signature.",
    mistakes: "Common mistakes include selecting the wrong pages, uploading a password-protected or damaged file, assuming a scan contains searchable text, and forgetting that page edits can affect numbering or bookmarks. Keep the original until you have checked the final document."
  }
};

export default function CatalogToolSEOContent({
  tool,
  questions,
  related,
  guideSlug
}: {
  tool: ToolInfo;
  questions: Question[];
  related: ToolInfo[];
  guideSlug?: string;
}) {
  const advice = categoryAdvice[tool.category] ?? categoryAdvice.Math;
  const title = tool.name;
  const faqItems = [
    { q: `What does the ${title} do?`, a: tool.description },
    { q: `How do I use the ${title}?`, a: `Open this page, enter or upload the information requested by the ${title}, check the available options, run the tool and review the result before copying or downloading it.` },
    { q: "Is the result guaranteed to be correct?", a: "No. Results depend on the input, the method and any assumptions described on this page. Verify important outputs independently, especially before financial, legal, medical, security or production use." },
    { q: "Can I use this tool on a phone?", a: "The page is designed for modern browsers. The exact experience can vary by device, browser, screen size and file permissions. If a control does not work, try an updated browser or a desktop device." },
    { q: "What should I do if the result looks wrong?", a: "Check the input format, units, selected options and any error message. Try a small sample and compare the output with a known result. Do not rely on an unexpected result until you understand the cause." },
    { q: "Should I enter confidential information?", a: "Avoid entering passwords, payment details, personal identifiers or confidential business data unless you have reviewed the site&apos;s privacy information and are comfortable with the processing involved." },
    ...questions.slice(0, 3).map((item) => ({ q: item.q, a: item.a }))
  ];
  const uniqueFaqItems = faqItems.filter((item, index) => faqItems.findIndex((candidate) => candidate.q === item.q) === index);
  return (
    <article className="mx-auto max-w-4xl px-4 pb-14 sm:px-6">
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700">Complete tool guide</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">What is the {title}?</h2>
          <p className="mt-4 leading-8 text-slate-700">{tool.description} This page explains the purpose of the tool, the information to prepare, how to interpret the result and the checks worth making before you use it. The aim is to help you complete one clear task without installing extra software or guessing which settings to choose.</p>
          <p className="mt-4 leading-8 text-slate-700">People often look for a free online {title.toLowerCase()} when they need a quick answer, a conversion or a practical file workflow. Before starting, identify the result you actually need. Check the input format, units, date range and any requirements from the website, school, employer, bank or public office that will receive the output.</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">How to use the {title} step by step</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-8 text-slate-700">
            <li><strong>Prepare the input.</strong> Collect the source text, file, values or dates needed for the task. Check for missing information and keep a copy of anything you may need to restore.</li>
            <li><strong>Open the tool and read its labels.</strong> Confirm that you are using the correct utility. Read the field names, units, format hints and options before entering information.</li>
            <li><strong>Enter a representative sample.</strong> If the task is unfamiliar, start with a small sample or values whose expected result you can check. This helps reveal input mistakes early.</li>
            <li><strong>Run the tool.</strong> Submit the input once and wait for the operation to finish. Avoid repeatedly clicking the action while a request is still processing.</li>
            <li><strong>Review the output.</strong> Check the result, compare it with the original or a known answer, and look for missing content, unexpected formatting or implausible values.</li>
            <li><strong>Save or copy only after checking.</strong> Use the output only when it meets the requirements of your task. Keep the original until you no longer need it.</li>
          </ol>
          <p className="mt-4 leading-8 text-slate-700">{tool.description} The exact controls can vary by utility, so follow the instructions displayed in the workspace rather than assuming every tool has the same fields or options.</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Example and practical use cases</h2>
          <p className="mt-4 leading-8 text-slate-700">{advice.example}</p>
          <p className="mt-4 leading-8 text-slate-700">A useful habit is to write down the input and expected output for one simple test. If the result matches, move on to the real task. If it does not, check the units, punctuation, selected mode and any assumptions before trying again. This small test can prevent mistakes from being repeated across a larger file or dataset.</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Accuracy, assumptions and limitations</h2>
          <p className="mt-4 leading-8 text-slate-700">{advice.accuracy}</p>
          <p className="mt-4 leading-8 text-slate-700">The tool should be used for the task described on this page. It does not replace a qualified professional, an official government or financial record, a specialist application, or the instructions of the organisation receiving your result. If the output affects money, eligibility, compliance, health, legal rights or production systems, confirm it using an authoritative source.</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Tips for a reliable workflow</h2>
          <p className="mt-4 leading-8 text-slate-700">{advice.workflow}</p>
          <p className="mt-4 leading-8 text-slate-700">Use a modern, updated browser and a stable connection. If the page appears stuck, wait for the current action to finish before retrying. For a file-based task, check that the file is in the expected format and is not damaged or password-protected unless the tool explicitly supports it. For a calculation, check every unit and decimal separator.</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Common mistakes to avoid</h2>
          <p className="mt-4 leading-8 text-slate-700">{advice.mistakes}</p>
          <p className="mt-4 leading-8 text-slate-700">Another avoidable mistake is using an output without opening or checking it. A successful message only indicates that the tool completed its operation; it does not prove that the result meets every external requirement. Always review the final output before sharing, submitting or publishing it.</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Privacy and safe use</h2>
          <p className="mt-4 leading-8 text-slate-700">Only provide the information needed to complete the task. Do not enter passwords, authentication codes, bank card details or other secrets into a general-purpose utility. For personal documents or business records, read the site&apos;s privacy information and consider whether you are authorised to upload or process the material. If you are unsure, use a non-sensitive sample first.</p>
          <p className="mt-4 leading-8 text-slate-700">When a result is important, keep a source copy and retain any supporting records required by your organisation. If you discover an error, return to the original input, correct it and repeat the process rather than trying to patch an unreliable output.</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Who can benefit from this tool?</h2>
          <p className="mt-4 leading-8 text-slate-700">This utility is intended for people who need to complete the task described above without installing a separate desktop application. Depending on the category, it may fit a student&apos;s study workflow, a small business owner&apos;s routine calculations, a developer&apos;s quick checks, a content creator&apos;s text or image preparation, or someone completing a Nepal-specific everyday task. Choose it because its purpose matches your actual requirement, not simply because it appears in a list of online tools.</p>
          <p className="mt-4 leading-8 text-slate-700">If you are comparing several utilities, look at the accepted input, the output format, the options available and any stated limitations. A tool that appears similar may use a different formula, conversion rule or file-processing method. When the task is important, compare the result with a trusted reference or the original source document.</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Troubleshooting: what to check when it does not work</h2>
          <p className="mt-4 leading-8 text-slate-700">If the tool does not accept your input, first check that the information is in the format requested by the page. Remove accidental spaces, confirm the selected unit or file type, and make sure required fields are not empty. For a file upload, try a smaller sample and confirm that the file opens normally on your device. For a calculation, recheck decimal separators, date format, currency and the time period.</p>
          <p className="mt-4 leading-8 text-slate-700">If the page appears unresponsive, wait for the current operation to finish before submitting again. Refreshing during an upload or processing step may interrupt the task. You can also try an updated browser or another device to determine whether the problem is specific to the browser. If an error message appears, read it carefully and avoid repeatedly submitting the same invalid input.</p>
          <p className="mt-4 leading-8 text-slate-700">When the output is unexpected, return to the original input and change one setting at a time. Compare a small test case with a known answer. This makes it easier to identify whether the issue comes from the input, the selected option, a file limitation or the assumptions used by the tool.</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Choosing the right online tool</h2>
          <p className="mt-4 leading-8 text-slate-700">Before choosing a utility, define the output you need and check whether the receiving website, school, employer or service provider has its own instructions. For example, a document upload may require a particular file format or size; a finance estimate may need a specific fiscal year and tax category; and a developer workflow may require a particular encoding or data structure. These requirements should guide your choice of tool.</p>
          <p className="mt-4 leading-8 text-slate-700">Use a dedicated specialist application when you need advanced editing, regulated calculations, official certification, high-volume processing or guarantees that this browser-based utility does not provide. The online tool is best treated as a convenient helper for the task it explicitly supports. Keep a record of important assumptions and verify the final result before relying on it.</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Frequently asked questions about {title}</h2>
          <div className="mt-5 space-y-5">
            {uniqueFaqItems.map((item) => <div key={item.q}><h3 className="font-bold text-slate-950">{item.q}</h3><p className="mt-2 leading-7 text-slate-600">{item.a}</p></div>)}
          </div>
        </section>
        <section className="rounded-2xl border border-teal-100 bg-teal-50 p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Related tools and further reading</h2>
          <p className="mt-3 leading-7 text-slate-700">You may also find these related utilities useful for the next step in your workflow. Choose the tool that matches the task rather than repeating the same operation unnecessarily.</p>
          <div className="mt-4 flex flex-wrap gap-3">{related.map((item) => <Link key={item.slug} href={`/tools/${item.slug}`} className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-100">{item.name}</Link>)}{guideSlug && <Link href={`/blog/${guideSlug}`} className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800">Read the detailed guide</Link>}</div>
          <p className="mt-4 text-sm leading-7 text-slate-600">For the best result, read the instructions on the tool page, test a small input and verify the final output before using it in an important task.</p>
        </section>
      </div>
    </article>
  );
}
