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
  const uniqueFaqItems = questions.slice(0, 4);
  if (tool.slug === "nepse-market-news" || tool.slug === "nepse-dividend-calculator") {
    const news = tool.slug === "nepse-market-news";
    const heading = news ? "Nepal stock market headlines, IPO and FPO updates" : "Calculate NEPSE cash dividend and bonus shares";
    const intro = news
      ? "Use this Nepal market news panel to discover recent NEPSE coverage, IPO and FPO announcements, allotment reporting and listed-company updates. The feed groups market headlines separately from public-issue coverage and links to the publisher's original article."
      : "Estimate a cash dividend and bonus-share entitlement from your eligible share quantity and a company's declared percentage. The calculator separates gross cash dividend, an editable withholding-tax assumption, estimated net cash and bonus shares.";
    return <article className="mx-auto max-w-4xl px-4 pb-14 sm:px-6"><div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-widest text-rose-700">Nepal stock market tools</p><h2 className="mt-2 text-2xl font-black text-slate-950">{heading}</h2><p className="mt-4 leading-8 text-slate-700">{intro}</p></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-black text-slate-950">{news ? "How the automatic news feed works" : "How the dividend estimate works"}</h2>{news ? <><p className="mt-4 leading-8 text-slate-700">The market feed searches for Nepal stock-market and NEPSE coverage. The IPO feed searches for public issue, FPO and allotment reporting. Headlines include a publisher label and publication time. The service refreshes its cached search results periodically; it is a discovery feed, not a live market terminal or an official exchange disclosure feed.</p><ol className="mt-4 list-decimal space-y-2 pl-5 leading-8 text-slate-700"><li>Open the NEPSE and Market Updates or IPO, FPO and Allotment Updates section.</li><li>Check the publisher and publication time shown below each headline.</li><li>Open the original article and read the complete report.</li><li>Confirm price-sensitive information with NEPSE and the listed company.</li><li>Confirm issue dates and allotment results with the issuer, issue manager, SEBON or CDSC.</li></ol></> : <><p className="mt-4 leading-8 text-slate-700">Cash dividend percentage is applied to the eligible paid-up or face-value basis specified in the company notice; it is not automatically a percentage of the current market price. The tool uses the share quantity and percentage entered by the user. Bonus shares are estimated by multiplying eligible shares by the declared bonus percentage.</p><ol className="mt-4 list-decimal space-y-2 pl-5 leading-8 text-slate-700"><li>Enter the number of shares eligible on the book-closure date.</li><li>Enter the cash dividend and bonus-share percentages from the company notice.</li><li>Adjust the withholding-tax assumption only after checking the applicable tax rule.</li><li>Review gross cash, estimated tax, net cash and bonus-share entitlement.</li><li>Compare the estimate with the final corporate-action notice and CDSC credit.</li></ol></>}</section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-black text-slate-950">Official sources and limitations</h2><p className="mt-4 leading-8 text-slate-700">{news ? "Search feeds can contain duplicate stories, delayed coverage or results that mention a keyword without confirming an event. Headlines are not official notices, verified live prices, investment advice or a recommendation to buy or sell." : "The calculator does not connect to a Demat account, verify book-closure eligibility, determine fractional entitlements or calculate every investor's tax situation. Company resolutions and current law determine the final amount."}</p><div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold"><a className="text-teal-700 underline" href="https://www.nepalstock.com/" target="_blank" rel="noreferrer">NEPSE</a><a className="text-teal-700 underline" href="https://www.sebon.gov.np/" target="_blank" rel="noreferrer">SEBON</a><a className="text-teal-700 underline" href="https://meroshare.cdsc.com.np/" target="_blank" rel="noreferrer">CDSC Mero Share</a></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-black text-slate-950">Frequently asked questions</h2><div className="mt-5 space-y-5">{uniqueFaqItems.map((item) => <div key={item.q}><h3 className="font-bold text-slate-950">{item.q}</h3><p className="mt-2 leading-7 text-slate-600">{item.a}</p></div>)}</div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-black text-slate-950">Related Nepal tools and guides</h2><div className="mt-4 flex flex-wrap gap-3">{related.map((item) => <Link key={item.slug} href={`/tools/${item.slug}`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50">{item.name}</Link>)}{guideSlug && <Link href={`/blog/${guideSlug}`} className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white">Read the detailed guide</Link>}</div></section>
    </div></article>;
  }
  if (tool.slug === "nepal-forex-rates") {
    return (
      <article className="mx-auto max-w-4xl px-4 pb-14 sm:px-6">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700">Nepal finance utility</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Nepal Rastra Bank exchange rates today</h2>
            <p className="mt-4 leading-8 text-slate-700">Use this page to check Nepal Rastra Bank (NRB) foreign-currency buying and selling rates against the Nepalese rupee (NPR). The rate table is retrieved from NRB&apos;s published foreign-exchange data. It displays the publication date, currency code, quoted unit, buying rate and selling rate so you can compare currencies using the correct unit.</p>
            <p className="mt-3 leading-8 text-slate-700">The converter supports both foreign currency to NPR and NPR to foreign currency calculations. It uses the NRB buying rate when converting foreign currency into NPR and the NRB selling rate when estimating how much foreign currency NPR can buy.</p>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">How to convert foreign currency to Nepalese rupees</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 leading-8 text-slate-700">
              <li>Wait for the latest available NRB rate date and currency table to load.</li>
              <li>Select the currency, such as USD, EUR, GBP, INR or JPY.</li>
              <li>Choose foreign currency to NPR (buying) or NPR to foreign currency (selling).</li>
              <li>Enter the amount and read the calculated estimate. Check the quoted unit shown for the currency.</li>
              <li>For a bank transaction, confirm the actual rate and fees with your bank or remittance provider.</li>
            </ol>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">How NRB buying and selling rates work</h2>
            <p className="mt-4 leading-8 text-slate-700">The buying rate is the NPR amount represented by the quoted foreign-currency unit when a bank buys that currency. The selling rate is the NPR amount charged for the same quoted unit when a bank sells it. The selling rate is normally higher than the buying rate.</p>
            <p className="mt-3 leading-8 text-slate-700">NRB may quote some currencies per 10 or 100 units instead of one unit. For example, if a currency is quoted per 100 units, the rate shown in the table applies to 100 units. PDFora uses the published unit in its calculations rather than assuming every rate is per one unit.</p>
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
              <p className="font-bold text-slate-900">Calculation formulas</p>
              <p>Foreign currency to NPR = amount × buying rate ÷ quoted unit</p>
              <p>NPR to foreign currency = NPR amount × quoted unit ÷ selling rate</p>
              <p className="mt-2 text-xs text-slate-500">These are reference-rate estimates before any bank spread, service fee or remittance charge.</p>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">Why the displayed rate date may not be today</h2>
            <p className="mt-4 leading-8 text-slate-700">NRB publishes foreign-exchange rates on working days. If the page is opened on a weekend or public holiday, the latest available published working-day rate may be shown. A rate date earlier than today&apos;s date does not by itself mean the data is incorrect; check the publication date and compare it with NRB&apos;s official foreign-exchange page.</p>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">Accuracy, source and limitations</h2>
            <p className="mt-4 leading-8 text-slate-700">The source is Nepal Rastra Bank&apos;s official foreign-exchange API and, if that endpoint is unavailable, its official published foreign-exchange page. The data is presented as an NRB reference rate, not as a guaranteed cash, card, bank-counter or remittance quote. Individual banks and money changers may publish different customer rates and fees.</p>
            <p className="mt-3 leading-8 text-slate-700">If rates cannot be retrieved, the tool shows an error and lets you retry; it does not silently present an old value as today&apos;s rate. For a payment, exchange or accounting decision, verify the rate directly with NRB or the financial provider handling the transaction.</p>
            <a className="mt-3 inline-block text-sm font-semibold text-teal-700 underline" href="https://www.nrb.org.np/forex/" target="_blank" rel="noreferrer">Check Nepal Rastra Bank&apos;s official exchange rates</a>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">Frequently asked questions</h2>
            <div className="mt-5 space-y-5">
              {uniqueFaqItems.map((item) => <div key={item.q}><h3 className="font-bold text-slate-950">{item.q}</h3><p className="mt-2 leading-7 text-slate-600">{item.a}</p></div>)}
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-950">Related Nepal tools</h2>
            <p className="mt-3 leading-7 text-slate-700">Continue with another Nepal-focused calculator or converter:</p>
            <div className="mt-4 flex flex-wrap gap-3">{related.map((item) => <Link key={item.slug} href={`/tools/${item.slug}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50">{item.name}</Link>)}{guideSlug && <Link href={`/blog/${guideSlug}`} className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800">Read the NRB exchange-rate guide</Link>}</div>
          </section>
        </div>
      </article>
    );
  }

  const advice = categoryAdvice[tool.category] ?? categoryAdvice.Math;
  const title = tool.name;
  const taskDescription = tool.description.replace(/[.!?]$/, "");
  const preparation: Record<string, string> = {
    PDF: "Keep an untouched copy of the original PDF. Check whether it contains scans, forms, bookmarks, annotations or digital signatures that may affect the result.",
    Finance: "Have the principal or amount, rate, currency and calculation period ready. Check whether the rate is annual or monthly and whether fees or taxes are included.",
    Text: "Prepare the exact text you want to process. Preserve a backup if you are replacing, removing, sorting or converting text in bulk.",
    Developer: "Prepare a small representative sample and know the target format or encoding. Do not use real passwords, API keys, private tokens or confidential source code.",
    Image: "Use a copy of the source image and check the required output format, dimensions, transparency and maximum file size before exporting.",
    Math: "Check the units and input format for each value. For dates, identify the start and end date; for percentages, confirm whether the value is entered as a number or decimal.",
    SEO: "Copy the exact page URL, title, description or content you intend to audit. Treat the output as a diagnostic aid and verify important findings on the live page.",
    Business: "Collect the relevant cost, selling price, revenue, wage or target figures. Confirm the time period and whether tax is included before calculating.",
    Nepal: "Check the applicable fiscal year, BS or AD date, NPR amount, local unit and eligibility conditions. Verify official matters with the responsible Nepalese authority."
  };
  const inputNote = preparation[tool.category] ?? "Prepare the source information requested by the tool and check the units, format and assumptions before processing.";
  // Keep only FAQs written for this tool or its category.
  return (
    <article className="mx-auto max-w-4xl px-4 pb-14 sm:px-6">
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700">Complete tool guide</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">What is the {title}?</h2>
          <p className="mt-4 leading-8 text-slate-700">{tool.description} This page explains the purpose of the tool, the information to prepare, how to interpret the result and the checks worth making before you use it. The aim is to help you complete one clear task without installing extra software or guessing which settings to choose.</p>
          <p className="mt-4 leading-8 text-slate-700">Unlike a general-purpose editor, {title} is intended for the specific job described here: {taskDescription}. It is most useful when you already know the source material and the format or result you need. Review the tool labels and any limitations before relying on the output.</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">How to use the {title} step by step</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-8 text-slate-700">
            <li><strong>Prepare the right input.</strong> {inputNote} The task on this page is to {taskDescription.toLowerCase()}.</li>
            <li><strong>Open the tool and read its labels.</strong> Confirm that you are using the correct utility. Read the field names, units, format hints and options before entering information.</li>
            <li><strong>Enter a representative sample.</strong> If the task is unfamiliar, start with a small sample or values whose expected result you can check. This helps reveal input mistakes early.</li>
            <li><strong>Run the tool.</strong> Submit the input once and wait for the operation to finish. Avoid repeatedly clicking the action while a request is still processing.</li>
            <li><strong>Review the output.</strong> Check the result, compare it with the original or a known answer, and look for missing content, unexpected formatting or implausible values.</li>
            <li><strong>Save or copy only after checking.</strong> Use the output only when it meets the requirements of your task. Keep the original until you no longer need it.</li>
          </ol>
          <p className="mt-4 leading-8 text-slate-700">Use this page when you need to {taskDescription.toLowerCase()}. Start with a representative input, inspect the output against the original or a known reference, and only then use the result in your next step. The available controls and supported input formats are shown in the tool workspace above.</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Example and practical use cases</h2>
          <p className="mt-4 leading-8 text-slate-700">{advice.example}</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Accuracy, assumptions and limitations</h2>
          <p className="mt-4 leading-8 text-slate-700">{advice.accuracy}</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Tips for a reliable workflow</h2>
          <p className="mt-4 leading-8 text-slate-700">{advice.workflow}</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Common mistakes to avoid</h2>
          <p className="mt-4 leading-8 text-slate-700">{advice.mistakes}</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Privacy and safe use</h2>
          <p className="mt-4 leading-8 text-slate-700">Only provide the information needed to complete the task. Do not enter passwords, authentication codes, bank card details or other secrets into a general-purpose utility. For personal documents or business records, read the site&apos;s privacy information and consider whether you are authorised to upload or process the material. If you are unsure, use a non-sensitive sample first.</p>
          <p className="mt-4 leading-8 text-slate-700">When a result is important, keep a source copy and retain any supporting records required by your organisation. If you discover an error, return to the original input, correct it and repeat the process rather than trying to patch an unreliable output.</p>
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
