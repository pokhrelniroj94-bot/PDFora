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
  if (tool.slug === "nepali-date-converter") {
    return <article className="mx-auto max-w-4xl px-4 pb-14 sm:px-6"><div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-teal-700">Nepal date utility</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Convert Nepali Bikram Sambat dates to English AD dates</h2>
        <p className="mt-4 leading-8 text-slate-700">Convert a Gregorian date into its Bikram Sambat (BS) equivalent, or convert a Nepali BS date into the Gregorian calendar. The converter supports dates from BS 1975 through BS 2099 and displays the weekday, Nepali month name and Devanagari digits.</p>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black text-slate-950">How to convert BS and AD dates</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 leading-8 text-slate-700">
          <li>Choose the conversion direction: English AD to Nepali BS, or Nepali BS to English AD.</li>
          <li>Enter the date in year-month-day order, for example 2026-01-01 or 2082-09-17.</li>
          <li>Select Convert date and wait for the result.</li>
          <li>Check the converted year, month, day and weekday before copying it into a form or document.</li>
        </ol>
        <p className="mt-4 leading-7 text-slate-700">The converter accepts English or Nepali digits and common separators such as hyphens, slashes and dots. The date must be a real calendar date; invalid month lengths are rejected.</p>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black text-slate-950">Supported date range and accuracy</h2>
        <p className="mt-4 leading-8 text-slate-700">Bikram Sambat month lengths vary by year, so a reliable conversion must use published calendar data rather than adding a fixed number of years or days. This tool uses a date-conversion library with a defined supported range. Dates outside that range are rejected instead of estimated.</p>
        <p className="mt-3 leading-8 text-slate-700">For citizenship records, passports, court documents, tax filings, banking records or government applications, compare the converted date with the original document and the relevant authority&apos;s calendar. This online result is not an official certificate.</p>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black text-slate-950">Frequently asked questions</h2>
        <div className="mt-4 space-y-4">{uniqueFaqItems.map((item) => <div key={item.q}><h3 className="font-bold text-slate-900">{item.q}</h3><p className="mt-1 leading-7 text-slate-700">{item.a}</p></div>)}</div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black text-slate-950">Related Nepal tools</h2>
        <div className="mt-4 flex flex-wrap gap-3">{related.map((item) => <Link key={item.slug} href={`/tools/${item.slug}`} className="rounded-lg border border-teal-200 px-3 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50">{item.name}</Link>)}</div>
      </section>
    </div></article>;
  }
  if (["neb-gpa-calculator","nepal-land-area-converter","nepal-vat-calculator","nepal-share-calculator"].includes(tool.slug)) {
    const guides: Record<string, { eyebrow: string; heading: string; intro: string; steps: string[]; formula: string; example: string; caution: string }> = {
      "neb-gpa-calculator": {
        eyebrow: "NEB education calculator",
        heading: "Calculate NEB GPA using subject credit hours and grade points",
        intro: "Enter every subject shown on your grade sheet, including its credit hours and grade point. The calculator weights each subject by its credit hours, so a higher-credit subject contributes more to the final GPA than a lower-credit subject with the same grade point.",
        steps: ["Add or remove subject rows until the list matches your grade sheet.", "Enter the subject name and its credit hours exactly as shown by your school.", "Choose the corresponding grade point from the grade-point column; do not enter raw marks.", "Review the weighted points for every subject, total credits and final GPA out of 4.00."],
        formula: "GPA = Σ(subject credit hours × subject grade point) ÷ Σ(subject credit hours)",
        example: "If a subject has 3 credit hours and a grade point of 4.0, it contributes 12 weighted points. If all subjects together contribute 72 weighted points across 20 credit hours, GPA = 72 ÷ 20 = 3.60.",
        caution: "The displayed grade-point choices are a calculator assumption based on a commonly used NEB scale. Different programmes or updated directives may use different rules. Use the exact credit hours and grade points on your official grade sheet and confirm your result with NEB or your school."
      },
      "nepal-land-area-converter": {
        eyebrow: "Nepal land measurement converter",
        heading: "Convert Ropani, Aana, Paisa, Daam, Bigha, Kattha and Dhur",
        intro: "Convert traditional hill-region and Terai-region land units into square feet and square metres. Enter the values in the matching section; the tool calculates each system independently so an empty square-foot field does not hide the hill-unit result.",
        steps: ["For hill measurements, enter Ropani, Aana, Paisa and Daam in the first section.", "For a known square-foot area, enter the total in the square-feet section to see equivalent hill and Terai units.", "For Terai measurements, enter Bigha, Kattha and Dhur in the final section.", "Compare the square-foot and square-metre totals, then check the unit convention used in the original land record."],
        formula: "Hill: 1 Ropani = 5,476 sq ft = 16 Aana = 64 Paisa = 256 Daam. Terai: 1 Bigha = 72,900 sq ft = 20 Kattha = 400 Dhur.",
        example: "1 Ropani + 8 Aana = 5,476 + (8 × 342.25) = 8,214 square feet. One Bigha equals 72,900 square feet under the common Terai conversion.",
        caution: "These are standard unit conversions, not a land survey or title verification. Plot boundaries, official recorded area and local cadastral details must be confirmed with the relevant Land Revenue Office or Survey Office before a purchase, sale or legal filing."
      },
      "nepali-vat-calculator": {
        eyebrow: "Nepal VAT calculator",
        heading: "Add 13% VAT to a price or extract VAT from an inclusive total",
        intro: "Use the calculator to estimate VAT in Nepalese rupees. Choose whether the entered amount is before VAT or already includes VAT, and confirm the rate field before calculating.",
        steps: ["Enter the base price or VAT-inclusive total in NPR.", "Check the VAT percentage; 13% is preselected but the field can be edited.", "Choose Add VAT to base price or Extract VAT from VAT-inclusive price.", "Review the base amount, VAT amount and final inclusive amount separately."],
        formula: "Add VAT: VAT = base price × rate ÷ 100; total = base price + VAT. Extract VAT: base price = inclusive total ÷ (1 + rate ÷ 100).",
        example: "At 13%, NPR 1,000 before VAT produces NPR 130 VAT and NPR 1,130 including VAT. If NPR 1,130 already includes 13% VAT, the pre-VAT amount is NPR 1,000.",
        caution: "This is a simple arithmetic estimate. Exemptions, zero-rated supplies, registration status, invoice rules and special tax treatment are not assessed. Confirm the current law and transaction category with the Inland Revenue Department or a qualified tax professional."
      },
      "nepal-share-calculator": {
        eyebrow: "NEPSE share profit calculator",
        heading: "Estimate NEPSE share buying cost, selling proceeds and net profit",
        intro: "Enter the number of shares, purchase price and expected selling price. The calculator estimates charges using the editable broker commission, SEBON fee, DP charge and CGT assumptions, then shows the difference between gross and estimated net profit.",
        steps: ["Enter the whole-number share quantity and the buy price per share.", "Enter the expected sell price per share.", "Review broker commission, SEBON fee, DP charge and CGT assumptions; change them to match your transaction.", "Compare total buy cost, sale proceeds, charges, profit before CGT and estimated net profit."],
        formula: "Gross profit = (sell price − buy price) × shares. Estimated net profit = gross profit − estimated buy charges − estimated sell charges − estimated CGT.",
        example: "For 100 shares bought at NPR 200 and sold at NPR 220, gross price difference is NPR 2,000 before transaction charges and tax. The final estimate depends on the rates entered in the calculator.",
        caution: "Broker commission tiers, SEBON and DP charges, capital-gains tax and holding-period rules can change or depend on investor type. The editable defaults are assumptions, not a live broker tariff. Use your broker's contract note and current tax rules for the final settlement."
      }
    };
    const guide = guides[tool.slug];
    if (guide) return <article className="mx-auto max-w-4xl px-4 pb-14 sm:px-6"><div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-widest text-teal-700">{guide.eyebrow}</p><h2 className="mt-2 text-2xl font-black text-slate-950">{guide.heading}</h2><p className="mt-4 leading-8 text-slate-700">{guide.intro}</p></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-black text-slate-950">How to use this calculator</h2><ol className="mt-4 list-decimal space-y-3 pl-5 leading-8 text-slate-700">{guide.steps.map((step) => <li key={step}>{step}</li>)}</ol></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-black text-slate-950">Formula and worked example</h2><p className="mt-3 rounded-xl bg-slate-50 p-4 font-semibold leading-7 text-slate-900">{guide.formula}</p><p className="mt-4 leading-8 text-slate-700">{guide.example}</p></section>
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8"><h2 className="text-xl font-black text-slate-950">Accuracy and important limitations</h2><p className="mt-3 leading-8 text-slate-700">{guide.caution}</p></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-black text-slate-950">Frequently asked questions</h2><div className="mt-4 space-y-4">{uniqueFaqItems.map((item) => <div key={item.q}><h3 className="font-bold text-slate-900">{item.q}</h3><p className="mt-1 leading-7 text-slate-700">{item.a}</p></div>)}</div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-black text-slate-950">Related tools</h2><div className="mt-4 flex flex-wrap gap-3">{related.map((item) => <Link key={item.slug} href={`/tools/${item.slug}`} className="rounded-lg border border-teal-200 px-3 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50">{item.name}</Link>)}{guideSlug && <Link href={`/blog/${guideSlug}`} className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800">Read related guide</Link>}</div></section>
    </div></article>;
  }
  const nepalGuides: Record<string, { heading: string; intro: string; steps: string[]; example: string; note: string }> = {
    "nepali-vat-calculator": {
      heading: "Calculate 13% Nepal VAT and extract VAT from an inclusive price",
      intro: "Use this calculator to add Nepal's standard 13% value added tax to a base price, or separate the VAT component from a VAT-inclusive total. The rate field is editable, so check whether a special rate or exemption applies to your transaction before calculating.",
      steps: ["Enter the amount in NPR, making clear whether it is before VAT or already VAT-inclusive.", "Keep the default 13% rate for a standard-rate example, or change it only when the applicable tax treatment is confirmed.", "Choose Add VAT for a base price or Extract VAT for an amount that already includes VAT.", "Review the base amount, VAT amount and final total separately, then compare the figures with the invoice."],
      example: "For a base price of NPR 1,000 at 13%, VAT is NPR 130 and the total is NPR 1,130. If NPR 1,130 already includes 13% VAT, the VAT component is NPR 130 and the base amount is NPR 1,000.",
      note: "This is an arithmetic calculator, not a determination that a supply is taxable at 13%. Nepal VAT registration, zero-rated supplies, exemptions, input-tax credits, invoice rules and other conditions depend on the VAT Act and current IRD guidance. Confirm the correct treatment with IRD or a qualified tax professional."
    },
    "nepali-number-converter": {
      heading: "Convert numbers into English words and Nepali digits",
      intro: "Enter a whole number to display its Devanagari digits and English number words using the thousand, lakh and crore grouping system. This is useful when preparing amounts, forms and notes that need Indian/Nepal-style number grouping.",
      steps: ["Enter a whole number using English or Nepali digits.", "Check the English words and Devanagari digit output.", "Copy the result only after checking the number against your source.", "For cheques or legal documents, follow the wording format required by the receiving institution."],
      example: "For example, 125000 is grouped as 1 lakh 25 thousand. The tool also displays the digits as १,२,५,०,०,०.",
      note: "The current tool supports whole numbers in its stated range and English words with lakh/crore grouping. It does not provide full Nepali-language spelling for every large number; verify wording before using it on an official cheque or document."
    },
    "nepal-phone-validator": {
      heading: "Check Nepal mobile number format and +977 country code",
      intro: "Check whether a mobile number matches the common 10-digit Nepal mobile format and view its international form with the +977 country code. This is a format check only.",
      steps: ["Enter the mobile number with or without spaces, hyphens or brackets.", "You may include the +977 or 977 country prefix.", "Review the local 10-digit number and international format.", "If the format is rejected, compare it with the number provided by the mobile operator."],
      example: "A local number such as 98XXXXXXXX is displayed internationally as +977 98XXXXXXXX when it matches the accepted format.",
      note: "A valid-looking number does not prove that a SIM is active, assigned, reachable or registered to a particular person. The tool does not contact telecom networks."
    },
    "gold-tola-gram-converter": {
      heading: "Convert gold and silver weight between tola and grams",
      intro: "Convert a jewellery or bullion weight from tola to grams, or grams back to tola. The converter uses the standard mass relationship of one tola to approximately 11.6638038 grams.",
      steps: ["Choose Tola to grams or Grams to tola.", "Enter the weight as a non-negative number.", "Read the converted weight and the conversion factor.", "Use the weight shown on the jeweller's scale for a purchase or sale calculation."],
      example: "1 tola = 11.6638 grams approximately. Therefore, 2.5 tola is about 29.1595 grams.",
      note: "This tool converts weight only. It does not provide live gold prices, purity testing, making charges, wastage, hallmark verification or a jewellery valuation."
    },
    "nepali-digit-converter": {
      heading: "Convert English digits to Nepali Devanagari digits",
      intro: "Convert the numerals 0–9 between English and Nepali Devanagari while leaving the rest of the text unchanged. It is useful for Nepali documents, notices, dates and everyday text.",
      steps: ["Type or paste a line containing numbers and text.", "Review the Nepali digit output and the English digit output.", "Choose the version you need and copy it.", "Check dates, phone numbers and account references carefully before submitting a form."],
      example: "The text 'नेपाल 2083 साल' becomes 'नेपाल २०८३ साल' in Nepali-digit form.",
      note: "Only the digits are converted. Words, punctuation, spaces and other characters remain as entered; the tool does not translate the text."
    },
    "nepali-calendar": {
      heading: "View a Bikram Sambat month with Gregorian dates",
      intro: "Choose a BS year and month to view the corresponding AD dates and weekdays. This calendar view is designed for checking date correspondence, not for replacing an official holiday notice.",
      steps: ["Enter a Bikram Sambat year within the displayed supported range.", "Choose one of the 12 Nepali months.", "Select Show calendar and review each BS day with its AD date and weekday.", "Check official government notices separately for public holidays and regional observances."],
      example: "A calendar row pairs one BS day with the Gregorian date on which that day falls and the weekday name.",
      note: "The calendar data has a defined supported range and may not include festival names or every local observance. Verify public holidays with the relevant government notice."
    },
    "loksewa-photo-resizer": {
      heading: "Resize and compress a photo for Loksewa and Nepal online forms",
      intro: "Prepare a JPEG photo under a selected 50 KB, 100 KB or 200 KB target and limit its maximum width or height. This can help with online forms that specify a file-size limit.",
      steps: ["Select a copy of the photo you want to resize.", "Choose the file-size target required by the form.", "Choose the maximum image dimension.", "Resize and download the JPEG, then check its file size and appearance before uploading."],
      example: "If an application form permits a photo up to 100 KB, select the 100 KB target and confirm that the downloaded file is below that limit.",
      note: "A file-size target alone does not guarantee compliance. Forms may also require a specific aspect ratio, pixel dimensions, background, crop or file format. Follow the exact vacancy or government notice."
    },
    "preeti-unicode-converter": {
      heading: "Convert legacy Preeti Nepali text to Unicode",
      intro: "Convert text encoded in the legacy Preeti font mapping into standard Unicode Devanagari, or reverse Unicode Nepali text back to Preeti encoding. This is useful when moving older Nepali documents into modern applications.",
      steps: ["Choose Preeti to Unicode or Unicode to Preeti.", "Paste text that is actually encoded in the selected format.", "Select Convert text and inspect the output.", "Copy the converted text and check it in the destination app with a compatible font."],
      example: "A paragraph copied from an old Preeti-encoded document may look like Latin characters until it is converted to Unicode Nepali.",
      note: "This converts character encoding, not the meaning of text. Mixed fonts, unsupported glyphs, formatting and non-Preeti text may need manual correction. Keep the original document."
    },
    "nepal-salary-tax-calculator": {
      heading: "Estimate Nepal individual salary tax for FY 2083/84",
      intro: "Use annual salary and the calculator's available tax-status and deduction inputs to estimate resident individual income tax for the selected fiscal year. Progressive bands apply to portions of taxable income rather than one flat rate to the entire salary.",
      steps: ["Choose the correct tax status and applicable options shown in the calculator.", "Enter annual salary and any supported deductions or allowances.", "Review the tax calculated in each band, total annual tax and monthly equivalent.", "Compare the estimate with payroll calculations and current Inland Revenue Department guidance."],
      example: "With progressive taxation, the first portion of taxable income is charged at its band rate, and only income in a higher band is charged at the higher rate.",
      note: "This estimate is based on the stated FY 2083/84 assumptions and does not automatically cover every benefit, deduction, credit, employment type or special tax status. Confirm the current law and your circumstances with IRD or a tax professional."
    },
    "nepal-electricity-bill-calculator": {
      heading: "Estimate a Nepal domestic electricity bill from monthly units",
      intro: "Estimate a single-phase domestic electricity bill by entering monthly energy consumption in units (kWh) and selecting the meter capacity supported by the calculator. The estimate separates energy-block charges and applicable minimum or VAT assumptions.",
      steps: ["Enter the total units consumed during the billing period.", "Choose the single-phase meter capacity matching your NEA connection.", "Review the estimated energy charge, minimum charge and VAT components.", "Compare the estimate with your actual NEA bill and the current tariff notice."],
      example: "If a household consumes 100 units in a month, the calculator applies the applicable energy blocks rather than multiplying every unit by one flat rate.",
      note: "The estimator is limited to the connection types and assumptions stated in the tool. It is not suitable for commercial, industrial or unsupported three-phase tariffs. Confirm the applicable tariff and bill adjustments with NEA."
    },
    "nepal-public-holidays-2083": {
      heading: "Check Nepal public holidays for Bikram Sambat 2083",
      intro: "Browse the 2083 BS holiday calendar and check each listed holiday's corresponding Gregorian date and any national, regional or community-specific note supplied with the calendar.",
      steps: ["Browse or search the holiday list by name or date.", "Check the BS date and its corresponding AD date.", "Read whether the notice applies nationally or only to a specified region or community.", "Confirm any work, school or bank closure with the latest official notice."],
      example: "A holiday listed with both BS and AD dates lets you match a Nepali calendar date to the Gregorian date used by many digital calendars.",
      note: "Government holiday lists can be amended and local closures may differ. Confirm the latest notice from the Government of Nepal or the relevant provincial or local authority before making travel or work plans."
    },
    "nepali-unicode-typing": {
      heading: "Type Nepali Unicode using a Roman English keyboard",
      intro: "Type Romanized Nepali with an English keyboard and convert the input into Devanagari Unicode text in your browser. You can then copy the result into messages, assignments, forms or documents that support Unicode.",
      steps: ["Click the typing area and enter Nepali words using Roman letters.", "Review the Devanagari suggestions or converted text as you type.", "Correct names, uncommon words and punctuation before copying.", "Paste the Unicode text into the destination application and check font support."],
      example: "Romanized input such as 'namaste' can be converted into the corresponding Nepali Unicode text, depending on the transliteration mapping.",
      note: "Romanized typing is phonetic and may offer multiple spellings for the same sound. Review names, technical terms and official text manually; the tool does not translate English into Nepali."
    }
  };
  if (tool.category === "Nepal" && nepalGuides[tool.slug]) {
    const guide = nepalGuides[tool.slug];
    return <article className="mx-auto max-w-4xl px-4 pb-14 sm:px-6"><div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-widest text-teal-700">Nepal utility guide</p><h2 className="mt-2 text-2xl font-black text-slate-950">{guide.heading}</h2><p className="mt-4 leading-8 text-slate-700">{guide.intro}</p></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-black text-slate-950">How to use the tool</h2><ol className="mt-4 list-decimal space-y-3 pl-5 leading-8 text-slate-700">{guide.steps.map((step) => <li key={step}>{step}</li>)}</ol></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-black text-slate-950">Example</h2><p className="mt-3 leading-8 text-slate-700">{guide.example}</p></section>
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8"><h2 className="text-xl font-black text-slate-950">Accuracy and limitations</h2><p className="mt-3 leading-8 text-slate-700">{guide.note}</p></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-black text-slate-950">Frequently asked questions</h2><div className="mt-4 space-y-4">{uniqueFaqItems.map((item) => <div key={item.q}><h3 className="font-bold text-slate-900">{item.q}</h3><p className="mt-1 leading-7 text-slate-700">{item.a}</p></div>)}</div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-black text-slate-950">Related Nepal tools</h2><div className="mt-4 flex flex-wrap gap-3">{related.map((item) => <Link key={item.slug} href={`/tools/${item.slug}`} className="rounded-lg border border-teal-200 px-3 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50">{item.name}</Link>)}{guideSlug && <Link href={`/blog/${guideSlug}`} className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800">Read related guide</Link>}</div></section>
    </div></article>;
  }

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

  const toolAdvice: Record<string, { example: string; accuracy: string; workflow: string; mistakes: string }> = {
    "loan-emi-calculator": { example: "For a NPR 1,000,000 loan at 10% annual interest over 60 months, compare the monthly EMI with the total repayment and total interest. The result assumes a reducing-balance loan with monthly payments.", accuracy: "The estimate excludes lender-specific fees, insurance, floating-rate changes, penalties and payment-date conventions. Your bank's repayment schedule is authoritative.", workflow: "Change one input at a time—principal, annual rate or loan term—and compare how EMI and total interest move. A longer term may lower the EMI but increase total interest.", mistakes: "Do not enter a monthly interest rate in the annual-rate field. Check that the term is in months and that the displayed amount is in the same currency as the loan." },
    "compound-interest-sip-calculator": { example: "Enter a monthly contribution, investment period, expected annual return and any initial investment. The calculator assumes month-end contributions and a constant monthly return.", accuracy: "Investment returns are not guaranteed. The estimate does not automatically account for market volatility, fees, taxes, inflation or missed contributions.", workflow: "Compare conservative, base and optimistic return assumptions. Also compare the final value with the total amount invested so the estimated gain is clear.", mistakes: "Do not treat an assumed annual return as a guaranteed rate or confuse monthly contribution with the initial lump-sum investment." },
    "discount-percentage-calculator": { example: "A product priced at NPR 1,000 with a 20% discount costs NPR 800 before any extra fees. The tool also calculates what percentage one value is of another.", accuracy: "The result is arithmetic only and does not include delivery charges, coupons, tax or store-specific terms unless they are included in the input.", workflow: "Enter the original price and discount rate, then compare the final price and savings. Use the percentage fields separately when you want to calculate one value as a share of another.", mistakes: "Enter 20 for 20%, not 0.20. Check that the discount is between 0 and 100 and that the original price is not negative." },
    "percentage-change-calculator": { example: "If a value rises from 100 to 120, the percentage change is a 20% increase. A fall from 100 to 80 is a 20% decrease.", accuracy: "Percentage change uses the original value as the baseline and cannot be calculated when the original value is zero.", workflow: "Use the same unit and time basis for both values. Check the sign and whether the result is labelled as an increase or decrease.", mistakes: "Do not reverse the original and new values. A change from 120 to 100 is not the same percentage as a change from 100 to 120." },
    "average-calculator": { example: "For 10, 20, 30 and 40, the mean is 25, the median is 25, the range is 30 and there is no repeated mode.", accuracy: "The mean can be strongly affected by extreme values. The mode may be absent or multiple values may share the highest frequency.", workflow: "Enter values separated by commas, semicolons or spaces. Review the count, mean, median, mode and range to understand the distribution rather than relying on the mean alone.", mistakes: "Do not include labels or currency symbols in the number list. Check decimal separators and make sure every value is intentional." },
    "fraction-calculator": { example: "For addition, 1/2 + 1/3 = 5/6. The calculator supports addition, subtraction, multiplication and division of fractions.", accuracy: "The calculator expects whole-number numerators and non-zero denominators. Division by a zero fraction is undefined.", workflow: "Enter both numerators and denominators, select the operation, then check the simplified fraction and decimal equivalent.", mistakes: "Do not put a denominator in the numerator field. Keep denominators non-zero and confirm the selected operation before using the result." },
    "age-calculator": { example: "Enter a date of birth and the date to calculate as of. The result is expressed as completed years, months and days.", accuracy: "The result depends on the dates entered and calendar month lengths. It is not an identity or legal age verification.", workflow: "Use the date of birth exactly as recorded and select the intended reference date. Check the day, month and year order in the input fields.", mistakes: "Do not swap the birth date and reference date. A reference date earlier than the birth date is invalid." },
    "date-difference-calculator": { example: "The calculator returns the absolute number of days between two dates and also gives approximate weeks and average months.", accuracy: "Weeks and average months are derived from the day count; calendar months have different lengths. The day difference does not count inclusive endpoints as separate extra days.", workflow: "Enter both dates in the same calendar and check whether you need elapsed days or an inclusive count for your task.", mistakes: "Do not interpret an average month as an exact calendar month. Check the start and end dates before copying the day total." },
    "time-duration-calculator": { example: "A start time of 09:00 and end time of 17:30 produces 8 hours 30 minutes. An end time earlier than the start is treated as crossing midnight.", accuracy: "The tool calculates clock duration and does not account for daylight-saving changes, unpaid breaks or shift rules.", workflow: "Enter both times in 24-hour format and decide whether the end time is on the same day or the following day.", mistakes: "Check AM/PM conversion when using a 12-hour clock and subtract breaks separately if the task requires paid working time." },
    "profit-margin-calculator": { example: "If an item costs NPR 700 and sells for NPR 1,000, gross profit is NPR 300 and gross margin is 30% of the selling price.", accuracy: "The calculator uses only the entered cost and selling price. It does not include overhead, tax, shipping, returns or other operating expenses.", workflow: "Enter unit cost and selling price on the same basis, then compare gross profit with the margin percentage.", mistakes: "Do not confuse profit margin (profit divided by selling price) with markup (profit divided by cost)." },
    "markup-calculator": { example: "A 25% markup on a NPR 800 cost adds NPR 200 and gives a selling price of NPR 1,000.", accuracy: "This calculation applies a markup percentage to cost. It does not calculate a target profit margin or include tax and overhead.", workflow: "Enter the cost and desired markup percentage, then review the markup amount and suggested selling price.", mistakes: "Do not enter the desired margin as though it were a markup. Margin and markup use different denominators." },
    "break-even-calculator": { example: "If fixed costs are NPR 50,000, selling price is NPR 500 and variable cost is NPR 300 per unit, break-even is 250 units before rounding to a whole unit.", accuracy: "The estimate assumes fixed costs and per-unit variable costs remain constant and all units sell at the same price.", workflow: "Use the same period for fixed costs and sales assumptions. Review both break-even units and break-even revenue.", mistakes: "Selling price must exceed variable cost. Do not mix monthly fixed costs with annual sales volume." },
    "sales-tax-calculator": { example: "Adding 10% tax to NPR 1,000 gives NPR 1,100. Removing 10% tax from NPR 1,100 gives a pre-tax amount of NPR 1,000.", accuracy: "The tool applies a simple percentage and does not determine which tax rate, exemption or jurisdiction applies to a transaction.", workflow: "Choose add-tax or remove-tax mode carefully, enter the amount and rate, then inspect the tax component and total.", mistakes: "When removing tax, enter the tax-inclusive amount. Do not simply subtract the percentage from the inclusive total." },
    "salary-breakdown-calculator": { example: "A monthly gross salary of NPR 50,000 with a 10% illustrative deduction produces NPR 5,000 estimated deductions and NPR 45,000 take-home.", accuracy: "This is a simple deduction-rate estimate, not a Nepal statutory payroll or income-tax calculator. It does not model allowances, social security, provident fund or progressive tax bands.", workflow: "Enter gross monthly salary and an assumed deduction percentage. Compare the estimated monthly and annual take-home values with an actual payslip.", mistakes: "Do not use this simple deduction field as a substitute for the Nepal salary tax calculator or an employer's payroll statement." },
    "savings-goal-calculator": { example: "If your target is NPR 120,000, you have already saved NPR 30,000 and have 9 months remaining, the required monthly saving is NPR 10,000.", accuracy: "The estimate divides the remaining target evenly across the number of months and excludes interest, investment returns, inflation and fees.", workflow: "Enter your target, current savings and the number of months remaining. Recalculate when your savings or deadline changes.", mistakes: "Use the amount still needed rather than adding current savings twice. Enter a positive number of months." },
    "simple-interest-calculator": { example: "For NPR 10,000 at 5% simple interest for 2 years, interest is NPR 1,000 and the total is NPR 11,000.", accuracy: "Simple interest is calculated on the original principal and does not compound. Actual deposits or loans may use different conventions and fees.", workflow: "Check principal, annual rate and time period. Make sure the time is expressed in years as expected by the tool.", mistakes: "Do not enter a monthly rate as an annual rate or confuse simple interest with compound interest." },
    "commission-calculator": { example: "A 3% commission on NPR 100,000 in sales is NPR 3,000 before any deductions.", accuracy: "The estimate uses one flat commission rate and does not model tiered targets, refunds, taxes or employer-specific terms.", workflow: "Enter the eligible sales amount and commission percentage, then compare the result with the written commission agreement.", mistakes: "Check whether the rate applies to gross sales, net sales or collected revenue before relying on the amount." },
    "hourly-to-salary-calculator": { example: "At NPR 500 per hour for 40 paid hours each week, estimated annual gross pay is NPR 1,040,000 and average monthly gross pay is about NPR 86,666.67.", accuracy: "The estimate assumes 52 paid weeks and does not subtract leave, unpaid time, overtime rules, tax or other deductions.", workflow: "Enter the hourly wage and typical paid hours per week. Compare weekly, average monthly and annual gross figures.", mistakes: "Do not assume 4 weeks equals one average month. Check whether the hours entered are paid hours and whether work is available all year." },
    "tip-calculator": { example: "A 10% tip on a NPR 2,000 bill is NPR 200. The calculator also divides the total including tip by the number of people.", accuracy: "This is a simple tip estimate and does not account for service charges already included in a bill.", workflow: "Enter the bill, tip percentage and number of people. Check the total and per-person share before settling.", mistakes: "Check whether the bill already includes a service charge and enter the number of people as a positive whole number." },
    "split-bill-calculator": { example: "A NPR 3,000 bill plus NPR 200 extra split between four people gives NPR 800 per person.", accuracy: "The tool divides the total evenly. It does not calculate unequal shares, itemised orders or separate tax rates.", workflow: "Enter the bill, any extra amount and the number of people sharing it. Confirm whether everyone is paying an equal share.", mistakes: "Do not forget to include any extra charge or use the number of items instead of the number of people." }
  };
  const advice = toolAdvice[tool.slug] ?? categoryAdvice[tool.category] ?? categoryAdvice.Math;
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
          
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">How to use the {title} step by step</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-8 text-slate-700">
            <li><strong>Prepare the right input.</strong> {inputNote} The task on this page is to {taskDescription.toLowerCase()}.</li>
            <li><strong>Open the tool and read its labels.</strong> Confirm that you are using the correct utility. Read the field names, units, format hints and options before entering information.</li>
            <li><strong>Enter a representative sample.</strong> If the task is unfamiliar, start with a small sample or values whose expected result you can check. This helps reveal input mistakes early.</li>
            <li><strong>Use the available control.</strong> Some tools update automatically as you type; others require a Convert, Calculate or Process action. Follow the control shown in the workspace.</li>
            <li><strong>Review the output.</strong> Check the result, compare it with the original or a known answer, and look for missing content, unexpected formatting or implausible values.</li>
            <li><strong>Save or copy only after checking.</strong> Use the output only when it meets the requirements of your task. Keep the original until you no longer need it.</li>
          </ol>
          
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
          <p className="mt-4 leading-8 text-slate-700">Use only the information needed for the task. Do not enter passwords, authentication codes, bank-card details, private keys or other secrets. For files or business records, review the site privacy policy and keep an untouched original until you have checked the output.</p>
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
