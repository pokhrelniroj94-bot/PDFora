import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import ToolWorkspace from "../../../components/AllTools";
import CatalogToolSEOContent from "../../../components/CatalogToolSEOContent";
import { toolCatalog } from "../../../components/toolCatalog";
import { blogPosts } from "../../../lib/blog-posts";
import { legacyToolSlugSet } from "../../../lib/legacy-tool-slugs";
import { SITE_URL } from "../../../lib/site-config";

const site = SITE_URL;
export function generateStaticParams() {
  return toolCatalog.filter((tool) => tool.slug !== "pdf-tools").map((tool) => ({ slug: tool.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolCatalog.find((item) => item.slug === slug);
  if (!tool || slug === "pdf-tools") return { title: "Page not found", robots: { index: false, follow: true } };
  const seoOverrides: Record<string, { title: string; description: string }> = {
    "neb-gpa-calculator": { title: "NEB GPA Calculator – Calculate GPA by Credit Hours", description: "Calculate NEB GPA from subject grade points and credit hours. See weighted points per subject, total credits, formula and estimated GPA out of 4.00." },
    "nepal-land-area-converter": { title: "Ropani Aana to Sq Ft Converter – Bigha Kattha Dhur", description: "Convert Ropani, Aana, Paisa, Daam, Bigha, Kattha and Dhur to square feet and square metres with clear unit breakdowns." },
    "nepali-vat-calculator": { title: "Nepal VAT Calculator 13% – Add or Remove VAT", description: "Calculate 13% VAT in NPR. Add VAT to a base price or extract VAT from an inclusive total with a clear base, tax and total breakdown." },
    "nepal-share-calculator": { title: "NEPSE Share Profit Calculator – Broker Fees & CGT", description: "Estimate NEPSE share cost and net profit with broker commission, SEBON and DP fees, plus capital gains tax based on holding period and investor type." },
    "nepali-date-converter": { title: "Nepali Date Converter – BS to AD and AD to BS", description: "Convert Bikram Sambat Nepali dates to Gregorian AD dates and back. See Nepali month names, weekday and Devanagari digits." },
    "nepali-number-converter": { title: "Nepali Number Converter – Number to Words & Digits", description: "Convert numbers into English words using thousand, lakh and crore and display the same number in Nepali Devanagari digits." },
    "nepal-phone-validator": { title: "Nepal Mobile Number Checker – +977 Format", description: "Check the common 10-digit Nepal mobile number format and display its international +977 format. No call or SIM lookup is performed." },
    "gold-tola-gram-converter": { title: "Tola to Gram Converter – Nepali Gold Weight", description: "Convert gold and silver weight between tola and grams using 1 tola = 11.6638038 grams. Fast two-way conversion." },
    "nepali-digit-converter": { title: "Nepali Unicode Digit Converter – English to Nepali", description: "Convert English digits 0–9 to Nepali Devanagari digits and back while preserving the rest of your text." },
    "nepali-calendar": { title: "Nepali Calendar 2083 – BS Month and AD Dates", description: "View Bikram Sambat calendar months with corresponding Gregorian dates and weekdays. Check the supported BS calendar range." },
    "nepal-panchang-today": { title: "Today’s Nepali Panchang – Tithi & Sunrise", description: "See today’s Kathmandu tithi, Panchang and sunrise/sunset from Miti, which verifies its data against Nepal’s official Rashtriya Panchanga. Kathmandu-only view." },
    "nepal-panchang-calculator": { title: "Panchang Calculator – Tithi, Nakshatra & Rahu Kaal", description: "Calculate tithi, nakshatra, yoga, karana, sunrise, sunset and Rahu Kaal for supported cities in India and Nepal using local time." },
    "nepali-guna-milan": { title: "36 Guna Milan Calculator – Traditional Ashtakoota Matching", description: "Compare birth charts using the traditional 36-point Ashtakoota system, including Varna, Vashya, Tara, Yoni, Gana, Bhakoot and Nadi. Supports Nepali, Hindi and English." },
    "nepali-janma-kundali": { title: "Free Janam Kundli – Vedic Birth Chart & Dasha", description: "Create a Vedic birth chart from birth date, local time and place. Supports Nepal and India, BS and AD dates, D1 and D9 charts, Lagna, Rashi and Dasha." },
    "loksewa-photo-resizer": { title: "Loksewa Photo Resizer – Compress to 50KB, 100KB or 200KB", description: "Resize and compress a photo for Nepal online forms with 50KB, 100KB or 200KB targets. Check official photo rules before uploading." },
    "preeti-unicode-converter": { title: "Preeti to Unicode Converter – Nepali Text", description: "Convert legacy Preeti-encoded Nepali text to Unicode Devanagari and convert Unicode Nepali text back to Preeti." },
    "nepal-salary-tax-calculator": { title: "Nepal Salary Tax Calculator FY 2083/84", description: "Estimate Nepal resident individual income tax for FY 2083/84 using progressive tax bands. Review annual and monthly tax estimates." },
    "nepal-electricity-bill-calculator": { title: "NEA Electricity Bill Calculator – Nepal Domestic", description: "Estimate a Nepal single-phase domestic electricity bill from monthly units and meter capacity, including energy blocks and VAT assumptions." },
    "nepse-dividend-calculator": { title: "NEPSE Dividend Calculator – Cash Dividend & Bonus", description: "Estimate NEPSE cash dividend after editable withholding tax and calculate bonus shares from your eligible share quantity." },
    "nepal-public-holidays-2083": { title: "Nepal Public Holidays 2083 – BS and AD Calendar", description: "Browse Nepal public holidays for 2083 BS with Gregorian dates and notes for national, regional and community-specific holidays." },
    "nepal-forex-rates": { title: "Nepal Rastra Bank Forex Rates & Charts – NPR Exchange Rates", description: "See official NRB currency buying and selling rates, convert NPR and explore historical daily charts. Open TradingView charts for supported currency pairs." },
    "nepal-fixed-deposit-calculator": { title: "Nepal Fixed Deposit Calculator – FD Interest & Maturity", description: "Estimate Nepal bank fixed-deposit interest, compound maturity value and after-tax return using an editable annual rate and compounding frequency." },
    "nepal-remittance-calculator": { title: "Nepal Remittance Calculator – Calculate NPR Received", description: "Estimate how much NPR a recipient gets after an exchange rate and remittance transfer fee. Compare payout assumptions in Nepal." },
    "nepal-ipo-profit-calculator": { title: "Nepal IPO Profit Calculator – Kitta, Charges & CGT", description: "Estimate Nepal IPO profit or loss after tiered secondary-market selling commission, SEBON fee, DP charge and CGT based on holding period and investor type." },
    "loan-emi-calculator": { title: "Loan EMI Calculator – Monthly Payment & Interest", description: "Calculate monthly loan EMI, total repayment and total interest from principal, annual interest rate and loan term in months." },
    "compound-interest-sip-calculator": { title: "SIP & Compound Interest Calculator – Future Value", description: "Estimate SIP future value, total monthly investments and projected gain using an expected annual return and investment period." },
    "average-calculator": { title: "Average Calculator – Mean, Median, Mode & Range", description: "Calculate mean, median, mode, range and count from a list of numbers. Enter values separated by commas, semicolons or spaces." },
    "profit-margin-calculator": { title: "Profit Margin Calculator – Gross Profit & Margin %", description: "Calculate gross profit and profit margin from product cost and selling price. Understand margin percentage before other expenses." },
    "break-even-calculator": { title: "Break-Even Calculator – Units and Revenue", description: "Calculate break-even sales quantity and revenue using fixed costs, selling price and variable cost per unit." },
    "percentage-change-calculator": { title: "Percentage Change Calculator – Increase or Decrease", description: "Calculate percentage increase or decrease between an original value and a new value with a clear direction and percentage result." },
    "age-calculator": { title: "Age Calculator – Exact Years, Months and Days", description: "Calculate age in completed years, months and days from a date of birth and a selected reference date." },
    "fraction-calculator": { title: "Fraction Calculator – Add, Subtract, Multiply & Divide", description: "Add, subtract, multiply or divide two fractions. View the simplified fraction and decimal result." },

    "bmi-calculator": { title: "BMI Calculator – Body Mass Index from Height & Weight", description: "Calculate body mass index from height and weight. Check the BMI formula and understand why the result is a screening estimate, not a diagnosis." },
    "bmr-calculator": { title: "BMR Calculator – Basal Metabolic Rate Estimate", description: "Estimate basal metabolic rate from age, height and weight. Understand the difference between BMR and daily maintenance calories." },
    "unit-converter": { title: "Unit Converter – Length, Weight, Temperature & Volume", description: "Convert common units for length, mass, temperature and volume. Select compatible units and check the converted value instantly." },
    "ratio-simplifier": { title: "Ratio Simplifier – Reduce Ratios to Lowest Terms", description: "Simplify a ratio to its lowest whole-number terms using the greatest common divisor. Check equivalent ratios with clear steps." },
    "gcd-lcm-calculator": { title: "GCD and LCM Calculator – Greatest Common Divisor", description: "Find the greatest common divisor and least common multiple of integers. Use the results to simplify fractions and solve number problems." },
    "prime-number-checker": { title: "Prime Number Checker – Test Integers and Find Factors", description: "Check whether an integer is prime or composite and inspect its factors. Includes clear handling for values below 2." },
    "business-days-calculator": { title: "Business Days Calculator – Count Weekdays Between Dates", description: "Count weekdays between two dates while excluding Saturdays and Sundays. Check date boundaries and account separately for public holidays." },
    "unix-timestamp-converter": { title: "Unix Timestamp Converter – Seconds & Milliseconds to Date", description: "Convert Unix timestamps in seconds or milliseconds into readable UTC dates and times, then compare with your local timezone." },
    "date-add-subtract-calculator": { title: "Date Calculator – Add or Subtract Days from a Date", description: "Add or subtract a chosen number of days from a starting date. Check the resulting date across month, year and leap-year boundaries." },
    "aspect-ratio-calculator": { title: "Aspect Ratio Calculator – Find Image Width & Height", description: "Calculate image and video aspect ratios or derive a proportional width or height without stretching the original dimensions." },
    "px-rem-converter": { title: "PX to REM Converter – CSS Units with Root Font Size", description: "Convert CSS pixel values to rem and rem to pixels using an editable root font size. Useful for responsive typography and spacing." },
    "color-contrast-checker": { title: "Color Contrast Checker – WCAG Text Accessibility", description: "Check foreground and background colour contrast ratios and review WCAG guidance for normal and large text." },
    "word-character-counter": { title: "Word Counter – Count Words, Characters & Reading Time", description: "Count words, characters with or without spaces, sentences and paragraphs, and estimate reading time for pasted text." },
    "reading-time-calculator": { title: "Reading Time Calculator – Estimate Article Reading Minutes", description: "Estimate how many minutes an article takes to read from its word count and reading-speed assumption." },
    "json-formatter-validator": { title: "JSON Formatter & Validator – Pretty Print or Minify JSON", description: "Format, minify and validate JSON syntax with readable indentation. Check malformed JSON before using it in an application." },
    "base64-encoder-decoder": { title: "Base64 Encoder & Decoder – Convert Text Online", description: "Encode text to Base64 or decode Base64 back to text in your browser. Base64 is an encoding, not encryption." },
    "url-encoder-decoder": { title: "URL Encoder & Decoder – Percent Encode URL Components", description: "Encode or decode URL query values and components with percent encoding. Avoid double-encoding and preserve URL structure." },
    "hash-generator": { title: "Hash Generator – Create SHA-256 and SHA-1 Digests", description: "Generate SHA-256 or SHA-1 hashes from text in your browser. Learn the difference between hashing, encoding and encryption." },
    "image-compressor": { title: "Image Compressor – Reduce JPG, PNG & WebP File Size", description: "Compress JPEG, PNG and WebP images and review the balance between file size, dimensions and visual quality before download." },
    "image-format-converter": { title: "Image Converter – Convert PNG, JPG & WebP Online", description: "Convert images between PNG, JPEG and WebP formats. Check transparency, image quality and file size after conversion." },
    "nepse-market-news": { title: "Nepal Stock Market News – NEPSE & IPO Updates", description: "Browse recent Nepal stock market and IPO headlines with publication dates and links to the original publishers. Verify notices with official sources." },
    "nepali-unicode-typing": { title: "Nepali Unicode Typing Tool – Type in Devanagari", description: "Convert Romanized Nepali typing into Unicode Devanagari text. Review spelling, conjuncts and punctuation before using the text in a document." },
    "currency-converter": { title: "Currency Converter – Convert NPR, USD, INR & More", description: "Convert currencies using the available public exchange-rate source. Check the rate timestamp and compare with bank fees and offered rates." },
  };
  const seo = seoOverrides[slug];
  const fallbackTitle = `${tool.name} – Free Online Tool`;
  const title = seo?.title ?? (fallbackTitle.length <= 60 ? fallbackTitle : `${tool.name.slice(0, 42).trimEnd()} – Online Tool`);
  const socialTitle = `${tool.name} Online | PDFora`;
  const fallbackDescription = `${tool.description.replace(/[.!?]$/, "")}. Use PDFora online to complete this task and check the result before saving or sharing.`;
  const description = seo?.description ?? (fallbackDescription.length <= 160
    ? fallbackDescription
    : `${fallbackDescription.slice(0, 157).replace(/\s+\S*$/, "").trimEnd()}...`);
  const canonical = legacyToolSlugSet.has(slug) ? `${site}/${slug}` : `${site}/tools/${slug}`;
  return {
    title, description,
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
  const defaultQuestionsByCategory: Record<string, { q: string; a: string }[]> = {
    PDF: [
      { q: `What does the ${tool.name} do?`, a: tool.description },
      { q: "Will the tool change my original PDF?", a: "Keep your original file. Review the exported PDF for page order, text, images, forms, bookmarks, annotations and signatures before replacing or sharing it." },
      { q: "Can I use the result as an official or signed document?", a: "The tool does not certify a document or validate legal signatures. Check the requirements of the organisation receiving the file." },
      { q: "What should I check after processing?", a: categoryNote }
    ],
    Finance: [
      { q: `What does the ${tool.name} calculate?`, a: tool.description },
      { q: "Are the financial results guaranteed?", a: "No. Results depend on the entered assumptions and may exclude provider fees, taxes, inflation, market changes or contract-specific terms." },
      { q: "Which inputs should I double-check?", a: "Confirm the currency, rate, period, payment frequency and whether amounts are gross or net before relying on an estimate." },
      { q: "Can I use the result as an official financial quote?", a: "No. Compare important decisions with the relevant bank, financial provider, contract or official statement." }
    ],
    Math: [
      { q: `What does the ${tool.name} calculate?`, a: tool.description },
      { q: "How can I check the result?", a: "Test a small example with a known answer, confirm the input units and inspect the rounding shown by the tool." },
      { q: "What happens if I enter invalid values?", a: "The tool should show an input error for unsupported or impossible values. Correct the input rather than interpreting an error as a result." },
      { q: "Are units and rounding important?", a: "Yes. Keep units consistent and check whether the output is rounded, approximate or an exact count." }
    ],
    Business: [
      { q: `What does the ${tool.name} calculate?`, a: tool.description },
      { q: "Does the estimate include every business expense?", a: "Not unless those expenses are specifically included in the inputs. Consider overhead, fees, returns, tax and other operating costs separately." },
      { q: "Can I use this for a business quote or tax filing?", a: "Treat the result as a planning estimate. Confirm the figures with your accounting records and applicable tax or contract rules." },
      { q: "What should I verify before using the result?", a: categoryNote }
    ],
    Text: [
      { q: `What does the ${tool.name} do?`, a: tool.description },
      { q: "Does it preserve punctuation and Unicode text?", a: "Behaviour depends on the specific operation. Test Nepali text, emojis, punctuation and line breaks with a short sample before processing a large block." },
      { q: "Can I undo a text conversion?", a: "Keep a copy of the original text before replacing, sorting, cleaning or converting it. Some transformations cannot be reversed exactly." },
      { q: "Is pasted text uploaded?", a: "Check the tool's privacy information and the page's stated processing method. Do not paste passwords, access tokens or confidential information into a general utility." }
    ],
    Developer: [
      { q: `What does the ${tool.name} do?`, a: tool.description },
      { q: "Does a valid result guarantee secure or correct code?", a: "No. Syntax validation or decoding does not prove that data is safe, secure or semantically correct. Test it in the target application." },
      { q: "Is encoding the same as encryption?", a: "No. Base64, URL encoding and similar formats are reversible representations, not encryption or access control." },
      { q: "What data should I avoid entering?", a: "Do not paste passwords, private keys, API tokens, session cookies or confidential production data into an online utility." }
    ],
    Image: [
      { q: `What does the ${tool.name} do?`, a: tool.description },
      { q: "Will the converted image look exactly like the original?", a: "Not always. Format conversion and compression can change quality, transparency, metadata or colour. Inspect the exported file before using it." },
      { q: "How do I choose the right output?", a: "Check the destination's required format, dimensions, aspect ratio, transparency and file-size limit." },
      { q: "Should I keep the original image?", a: "Yes. Keep an untouched copy so you can retry with different dimensions or quality settings." }
    ],
    SEO: [
      { q: `What does the ${tool.name} check or generate?`, a: tool.description },
      { q: "Does a good tool result guarantee Google rankings?", a: "No. Search visibility depends on page quality, relevance, indexing, competition, links and many other signals. Use the result as a diagnostic aid." },
      { q: "Should I verify the result on the live page?", a: "Yes. Check the rendered page, source HTML, canonical URL, robots directives and search-platform reports where relevant." },
      { q: "Can SEO recommendations become outdated?", a: "Yes. Search engine guidance and display behaviour can change. Recheck important recommendations against current official documentation." }
    ]
  };
  const defaultQuestions = defaultQuestionsByCategory[tool.category] ?? [
    { q: `What does the ${tool.name} do?`, a: tool.description },
    { q: "What should I check before using it?", a: categoryNote },
    { q: "How can I verify the output?", a: "Test a small example and compare the result with a trusted reference before relying on it." },
    { q: "Does the tool replace official advice or verification?", a: "No. Confirm important legal, financial, government or compliance matters with the responsible authority." }
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
    "nepali-vat-calculator": [
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
    "loan-emi-calculator": [
      { q: "How is monthly EMI calculated?", a: "The calculator uses the reducing-balance EMI formula with the annual interest rate converted to a monthly rate and the loan term entered in months." },
      { q: "Does the EMI include bank fees and insurance?", a: "No. It estimates principal and interest only. Check the lender's repayment schedule for fees, insurance, floating rates and other charges." },
      { q: "Why does a longer loan term increase total interest?", a: "A longer term spreads repayment over more months. The monthly EMI may fall, but interest can accumulate for longer." }
    ],
    "compound-interest-sip-calculator": [
      { q: "Does the SIP calculator assume monthly deposits?", a: "Yes. It assumes monthly deposits at the end of each month and a constant monthly return based on the annual rate entered." },
      { q: "Are the estimated investment returns guaranteed?", a: "No. The future value is a mathematical projection, not a guaranteed market return or investment recommendation." },
      { q: "Does the result include fees and taxes?", a: "No. The estimate does not automatically deduct investment fees, taxes or inflation." }
    ],
    "average-calculator": [
      { q: "What statistics does the average calculator show?", a: "It calculates count, mean, median, mode and range from the numbers entered." },
      { q: "How should I separate the numbers?", a: "Use commas, semicolons or spaces between valid numbers. Avoid mixing text labels with the number list." },
      { q: "What if there is no repeated number?", a: "The tool reports that there is no repeated value for the mode when every number occurs only once." }
    ],
    "profit-margin-calculator": [
      { q: "How is gross profit margin calculated?", a: "Gross profit is selling price minus cost. Profit margin is gross profit divided by selling price, multiplied by 100." },
      { q: "Is profit margin the same as markup?", a: "No. Margin divides profit by selling price, while markup divides profit by cost." },
      { q: "Does the calculator include overhead and tax?", a: "No. It uses only the entered cost and selling price, so it is a gross margin estimate before other expenses." }
    ],
    "break-even-calculator": [
      { q: "What is the break-even point?", a: "It is the sales volume where revenue covers fixed and variable costs, leaving no profit or loss under the entered assumptions." },
      { q: "Why must selling price exceed variable cost?", a: "Each unit must contribute a positive amount toward fixed costs. If price does not exceed variable cost, selling more units cannot cover fixed costs." },
      { q: "Does it round the required units?", a: "Yes. It rounds the calculated break-even quantity up to the next whole unit and also shows estimated break-even revenue." }
    ],
    "salary-breakdown-calculator": [
      { q: "Is this Nepal's official salary tax calculator?", a: "No. It applies a simple editable deduction percentage and is not a statutory payroll or progressive income-tax calculation." },
      { q: "Can I convert monthly salary into annual take-home?", a: "Yes. The tool estimates monthly gross, deduction, monthly take-home and annual take-home based on the same simple deduction assumption." },
      { q: "Should I use this for a final payslip?", a: "No. Compare with your employer's payroll statement and use the dedicated Nepal salary-tax calculator for a separate FY-specific tax estimate." }
    ],
    "savings-goal-calculator": [
      { q: "How is monthly savings needed calculated?", a: "The calculator subtracts current savings from the target and divides the remaining amount by the number of months available." },
      { q: "Does it include interest or investment returns?", a: "No. It assumes you save the same amount each month and excludes interest, investment returns, fees and inflation." },
      { q: "What if I have already reached my target?", a: "The remaining amount and monthly savings needed are shown as zero when current savings meet or exceed the target." }
    ],
    "nepali-number-converter": [
      { q: "Does it use the lakh and crore number system?", a: "Yes. English number words use thousand, lakh and crore grouping for the supported whole-number range." },
      { q: "Can it convert Nepali digits?", a: "It displays the entered number in Devanagari digits as well as English words." },
      { q: "Does it spell every number in Nepali words?", a: "No. The current tool does not include full Nepali word spelling for every large number. Check the output and use another verified source if Nepali wording is required." }
    ],
    "nepal-phone-validator": [
      { q: "Which Nepal mobile number formats are checked?", a: "The checker recognises common 10-digit mobile numbers beginning with 96, 97 or 98, with an optional +977 or 977 country prefix." },
      { q: "Does a valid result mean the SIM is active?", a: "No. It checks number format only and does not contact telecom operators or confirm assignment, activity or reachability." },
      { q: "How do I write a Nepal number internationally?", a: "Use +977 followed by the 10-digit local mobile number, without the local trunk prefix." }
    ],
    "gold-tola-gram-converter": [
      { q: "How many grams are in one tola?", a: "One tola is approximately 11.6638038 grams." },
      { q: "Can I convert grams back to tola?", a: "Yes. Select the grams-to-tola direction and enter the weight in grams." },
      { q: "Does it calculate today's gold price?", a: "No. It converts weight only and does not include live gold prices, purity, making charges or wastage." }
    ],
    "nepali-digit-converter": [
      { q: "Which digits does the converter change?", a: "It converts English numerals 0–9 to Nepali Devanagari numerals ०–९ and back." },
      { q: "Does it translate the text too?", a: "No. It changes digits only; words, punctuation and spaces are preserved." },
      { q: "Can I convert a full sentence with numbers?", a: "Yes. Paste the sentence and the converter changes the digits wherever they appear." }
    ],
    "nepali-calendar": [
      { q: "Can I see both BS and AD dates?", a: "Yes. The calendar displays each Bikram Sambat day alongside its corresponding Gregorian date and weekday." },
      { q: "Does the calendar show every public holiday?", a: "No. Festival and public-holiday labels may not be included. Check official holiday notices separately." },
      { q: "What if my BS year is outside the supported range?", a: "The tool rejects years outside its published calendar-data range rather than estimating dates." }
    ],
    "loksewa-photo-resizer": [
      { q: "Which file-size targets are available?", a: "The tool offers 50 KB, 100 KB and 200 KB targets, with selectable maximum image dimensions." },
      { q: "Does it guarantee my Loksewa photo will be accepted?", a: "No. The form may also specify crop, aspect ratio, background, dimensions or file type. Follow the exact official notice." },
      { q: "What format does the resized photo use?", a: "The tool exports the resized image as JPEG." }
    ],
    "preeti-unicode-converter": [
      { q: "What does Preeti to Unicode conversion do?", a: "It maps text encoded with the legacy Preeti font layout into standard Unicode Devanagari text." },
      { q: "Can I convert Unicode back to Preeti?", a: "Yes. Choose Unicode Nepali to Preeti before converting." },
      { q: "Will it preserve document formatting?", a: "It converts text encoding, not full document layout. Check formatting and glyphs in the destination application." }
    ],
    "nepal-salary-tax-calculator": [
      { q: "Which fiscal year does it calculate?", a: "The tool is labelled for Nepal FY 2083/84 and uses the progressive bands configured for that year." },
      { q: "Does it apply one tax rate to all salary?", a: "No. It calculates the taxable portions across progressive bands." },
      { q: "Is the result my final payroll tax?", a: "No. Allowances, deductions, rebates, employment category and personal circumstances can change the liability. Confirm with IRD or payroll." }
    ],
    "nepal-electricity-bill-calculator": [
      { q: "Which meter capacities are supported?", a: "The estimator supports single-phase domestic 5A, 15A, 30A and 60A connections as labelled in the tool." },
      { q: "Can I use it for commercial electricity bills?", a: "No. It is intended for the supported single-phase domestic tariff assumptions, not commercial or industrial tariffs." },
      { q: "Will the estimate exactly match my NEA bill?", a: "Not necessarily. Check the current tariff, meter category, minimum charge, VAT and any adjustments on your actual bill." }
    ],
    "nepal-public-holidays-2083": [
      { q: "Which year does this holiday calendar cover?", a: "It lists Nepal public holidays for Bikram Sambat 2083." },
      { q: "Are all holidays applicable throughout Nepal?", a: "No. Some notices can apply only to specific regions, communities or institutions. Read the note for each holiday." },
      { q: "Can holiday dates change?", a: "Government notices can be amended. Confirm the latest official announcement before making travel or work plans." }
    ],
    "nepali-unicode-typing": [
      { q: "Can I type Nepali with an English keyboard?", a: "Yes. Enter Romanized Nepali and the tool converts it into Devanagari Unicode text." },
      { q: "Does it translate English sentences into Nepali?", a: "No. It transliterates Romanized Nepali sounds; it is not a translation service." },
      { q: "Why should I review the converted words?", a: "Romanized input can map to multiple Nepali spellings, especially for names and uncommon words. Review the result before using it." }
    ],
    "bmi-calculator": [
      { q: "How is BMI calculated?", a: "BMI is weight in kilograms divided by height in metres squared. For example, 70 kg at 1.75 m gives a BMI of about 22.86." },
      { q: "Does BMI measure body fat directly?", a: "No. BMI is a screening measure based on height and weight and does not directly measure body fat or individual health." },
      { q: "Can I use adult BMI ranges for children?", a: "No. Children and teenagers need age- and sex-specific BMI-for-age interpretation from an appropriate health professional." }
    ],
    "bmr-calculator": [
      { q: "What does BMR mean?", a: "Basal metabolic rate estimates the energy the body uses at rest to maintain basic functions." },
      { q: "Is BMR the same as daily maintenance calories?", a: "No. Total daily energy expenditure also includes movement, exercise and digestion, so it is generally higher than BMR." },
      { q: "Is the result an exact metabolic measurement?", a: "No. It is an equation-based estimate. A laboratory measurement may differ." }
    ],
    "unit-converter": [
      { q: "Which units can I convert?", a: "The available categories include common length, mass, temperature and volume units. The options shown in the converter define the supported units." },
      { q: "Can I convert any two units?", a: "Only compatible units should be converted, such as metres to feet or kilograms to pounds. Different physical quantities cannot be directly converted without additional information." },
      { q: "Why is temperature conversion different?", a: "Celsius, Fahrenheit and Kelvin conversions use offset formulas, not just a simple multiplication factor." }
    ],
    "ratio-simplifier": [
      { q: "How do I simplify a ratio?", a: "Divide both terms by their greatest common divisor. For example, 12:18 becomes 2:3 after dividing both terms by 6." },
      { q: "Does simplifying change the ratio?", a: "No. Dividing both terms by the same non-zero factor preserves the relationship." },
      { q: "Can I simplify ratios with different units?", a: "Convert both quantities to the same unit before simplifying so the comparison is meaningful." }
    ],
    "gcd-lcm-calculator": [
      { q: "What is the difference between GCD and LCM?", a: "GCD is the largest integer that divides each input exactly; LCM is the smallest positive integer that is a multiple of each input." },
      { q: "How can I check the answer for two positive integers?", a: "For two positive integers, GCD multiplied by LCM equals the product of the two numbers." },
      { q: "Can I enter decimal values?", a: "Use integers when the calculator asks for whole numbers. Decimals are not standard inputs for integer GCD and LCM calculations." }
    ],
    "prime-number-checker": [
      { q: "What is a prime number?", a: "A prime number is an integer greater than 1 with exactly two positive factors: 1 and itself." },
      { q: "Is 1 a prime number?", a: "No. The number 1 has only one positive factor, so it is neither prime nor composite." },
      { q: "Does the checker show factors for composite numbers?", a: "The tool can list factors for composite inputs where supported; review the output to see which integers divide the number exactly." }
    ],
    "business-days-calculator": [
      { q: "Which days are excluded?", a: "The calculator excludes Saturdays and Sundays. It does not automatically remove every Nepal public holiday unless that feature is explicitly provided." },
      { q: "Does it include the start and end dates?", a: "Check the date-count convention stated in the result. Inclusive business-day counts can differ from elapsed weekday counts." },
      { q: "Are Nepal public holidays removed automatically?", a: "No. Treat this as a weekday count and check applicable government, regional or employer holidays separately." }
    ],
    "unix-timestamp-converter": [
      { q: "What is a Unix timestamp?", a: "It is a count of seconds or milliseconds since 1970-01-01 00:00:00 UTC, depending on the format used by the source." },
      { q: "How can I tell seconds from milliseconds?", a: "Common modern timestamps have about 10 digits in seconds and 13 digits in milliseconds, but validate the source format rather than relying only on digit count." },
      { q: "Why does local time differ from UTC?", a: "UTC is a global reference time. Local display applies the selected or device timezone offset." }
    ],
    "aspect-ratio-calculator": [
      { q: "What is an aspect ratio?", a: "It is the proportional relationship between width and height, commonly written as 16:9 or 4:3." },
      { q: "Will the calculator resize my image file?", a: "No. It calculates proportions and dimensions; use an image editor or resizer to change the actual file." },
      { q: "How do I avoid stretching an image?", a: "Keep the same aspect ratio when changing width or height, or crop the image if a different frame is required." }
    ],
    "word-character-counter": [
      { q: "Does the counter include spaces?", a: "It displays the character counts according to the labels shown, including or excluding spaces where available." },
      { q: "Why can counts differ from Microsoft Word or social media?", a: "Apps may count emoji, Unicode graphemes, punctuation and line breaks differently. Follow the limit of the platform where you will publish." },
      { q: "Can I count Nepali text?", a: "Yes, paste Unicode Nepali text and review the count. Different software may treat combined characters and punctuation differently." }
    ],
    "json-formatter-validator": [
      { q: "Does formatting JSON change its data?", a: "Pretty printing changes whitespace and indentation, not the parsed data structure. Minifying removes unnecessary whitespace." },
      { q: "Does valid JSON mean my API payload is correct?", a: "No. Syntax validation does not confirm that required fields, data types or application-specific schema rules are satisfied." },
      { q: "Can I use comments in JSON?", a: "Strict JSON does not support comments or trailing commas. Remove them before validating standard JSON." }
    ],
    "currency-converter": [
      { q: "Where do currency exchange rates come from?", a: "The rate source and timestamp are displayed by the tool where available. Rates from banks, remittance providers and card networks can differ." },
      { q: "Will I receive exactly the converted amount?", a: "Not necessarily. Providers may apply their own buying or selling rate, spread and service fees." },
      { q: "Why can the rate date be older than today?", a: "Some public rate sources update only on working days. Weekends and public holidays may leave the previous published rate as the latest available." }
    ],
    "password-generator": [
      { q: "How long should a generated password be?", a: "Use a long, unique password that meets the destination service's requirements. A password manager can generate and store it safely." },
      { q: "Should I reuse a generated password?", a: "No. Use a different password for each account so a breach at one service does not expose other accounts." },
      { q: "Where should I save the password?", a: "Save it directly in a reputable password manager. Avoid plain-text notes, public documents or sending passwords in messages." }
    ],
    "password-strength-checker": [
      { q: "Does a strong score guarantee password security?", a: "No. A score is only a heuristic and cannot prove that a password is unique or has not appeared in a data breach." },
      { q: "Should I enter my real password into a checker?", a: "Only if you have verified how the page processes and protects input. Safer practice is to test a sample rather than reuse an actual account password." },
      { q: "What makes a password safer?", a: "Length, uniqueness and unpredictable generation matter. A password manager helps create and store different passwords for every account." }
    ],
    "image-compressor": [
      { q: "Will image compression reduce quality?", a: "It can, especially with lossy formats such as JPEG and WebP. Inspect the exported image at its intended display size." },
      { q: "Can I compress an image to an exact file size?", a: "A target size may be approximate because the final bytes depend on image content, dimensions and encoding settings." },
      { q: "Should I keep the original image?", a: "Yes. Keep an untouched copy so you can retry with a different quality or dimension setting." }
    ],
    "base64-encoder-decoder": [
      { q: "Is Base64 encryption?", a: "No. Base64 is a reversible encoding that changes how bytes are represented. It does not protect information with a secret key." },
      { q: "Can I decode a Base64 string?", a: "Yes. Choose decode mode and provide valid Base64 input. The decoded bytes must also match the expected text encoding." },
      { q: "Is it safe to encode passwords in Base64?", a: "No. Anyone can decode Base64. Never use it as password protection or secret storage." }
    ],
    "hash-generator": [
      { q: "Can a hash be converted back to the original text?", a: "A cryptographic hash is designed to be one-way; it is not a reversible encoding." },
      { q: "Which hash algorithm should I use?", a: "For general modern integrity checks, SHA-256 is preferable to legacy MD5 or SHA-1. Follow the security requirements of your application." },
      { q: "Is a hash the same as encryption?", a: "No. Encryption is reversible with a key; hashing produces a fixed-size digest and has no decryption step." }
    ],
    "url-encoder-decoder": [
      { q: "What does URL encoding do?", a: "It represents characters that are not safe or reserved in a URL component using percent-encoded bytes." },
      { q: "Should I encode the entire URL?", a: "Usually no. Encode the query value or individual path component, not URL separators such as the scheme, slashes and query delimiters." },
      { q: "Why do spaces sometimes appear as plus signs?", a: "HTML form encoding commonly represents spaces as plus signs, while percent encoding often uses %20. Use the convention required by the destination." }
    ],
    "reading-time-calculator": [
      { q: "How is reading time estimated?", a: "The estimate divides the word count by an assumed reading speed, usually expressed in words per minute." },
      { q: "Is the reading time exact?", a: "No. Reading speed varies with topic, language, formatting, tables and reader familiarity." },
      { q: "Can I change the reading speed?", a: "Use the available words-per-minute setting if provided, and compare estimates using the same speed assumption." }
    ],
    "random-number-generator": [
      { q: "Are the minimum and maximum values included?", a: "The tool describes an inclusive range, meaning both the entered minimum and maximum may be generated." },
      { q: "Can the generator avoid duplicate values?", a: "Check whether a unique-values option is enabled. Independent random draws can repeat unless uniqueness is specifically enforced." },
      { q: "Can I use it for an official lottery?", a: "No. Do not use a general-purpose browser utility as a certified or regulated lottery drawing system." }
    ],
    "nepali-date-converter": [
      { q: "Which dates does the Nepali date converter support?", a: "It supports Bikram Sambat dates from 1975-01-01 through 2083-12-30 and Gregorian dates from 1918-04-13 through 2027-04-13. Future BS years are not extrapolated; they are added only when published calendar data is available." },
      { q: "Can I convert both AD to BS and BS to AD?", a: "Yes. Choose English (AD) to Nepali (BS) or Nepali (BS) to English (AD), then enter the date in year-month-day order." },
      { q: "Does it accept Nepali digits?", a: "Yes. The converter accepts Devanagari numerals as well as English digits and supports common date separators." },
      { q: "Is the converted date an official government record?", a: "No. It is an online conversion aid. Verify dates used for legal, financial or government records against the original document and relevant authority." }
    ],
    "nepal-forex-rates": [
      { q: "Where do the exchange rates come from?", a: "The tool requests the latest available published rates from the Nepal Rastra Bank official foreign-exchange API." },
      { q: "Why may the rate date be earlier than today?", a: "NRB may not publish a new rate on weekends or public holidays, so the latest available working-day rate is displayed." },
      { q: "Are these the exact rates at every bank?", a: "No. Individual banks, money changers and remittance providers may offer different rates and fees." }
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
    
    "nepal-fixed-deposit-calculator": [
      { q: "Does this match every Nepal bank FD product?", a: "No. Banks may use different day-count, compounding, payout, tax and premature-withdrawal rules. Confirm the specific product terms." },
      { q: "Is the interest tax assumption guaranteed?", a: "No. It is editable for estimation. Check current IRD rules and your personal tax treatment." }
    ],
    "nepal-remittance-calculator": [
      { q: "Does the calculator fetch live remittance rates?", a: "No. Enter the rate and fee quoted by your provider. Actual payout rates and fees can vary by service and destination." },
      { q: "Can the recipient receive less than this estimate?", a: "Yes. Intermediary-bank deductions, provider charges, exchange-rate spreads or recipient fees may affect the final amount." }
    ],
    "nepal-ipo-profit-calculator": [
      { q: "Does the calculator include broker fees on IPO allotment?", a: "No. IPO allotment is treated as a primary-market purchase. Broker commission, SEBON fee and DP charge are estimated for the later secondary-market sale." },
      { q: "How is capital-gains tax estimated?", a: "The calculator uses 5% for an individual holding shares for 365 days or less, 3.75% for more than 365 days, and 10% for an institution. Verify the current Gazette and your tax status." },
      { q: "Does it guarantee the IPO listing price?", a: "No. The sale price is an input chosen by the user; listing and market prices can move." }
    ],
    "nepal-panchang-calculator": [
      { q: "How is this Nepal Panchang calculated?", a: "The calculator uses Astronomy Engine ephemerides for the Sun and Moon, Lahiri/Chitrapaksha sidereal conversion for nakshatra and yoga, and local sunrise as the Panchang day anchor. The selected city coordinates and Nepal time zone are used for sunrise and sunset." },
      { q: "Does this exactly match Nepal's official Rashtriya Panchanga?", a: "Not necessarily. This is an astronomical reference using a documented calculation convention. The official Nepal Rashtriya Panchanga may apply traditional siddhanta, regional and ritual conventions that produce differences." },
      { q: "Which locations can I calculate?", a: "The current version provides city-centre coordinates for Kathmandu, Ilam, Biratnagar, Pokhara, Janakpur, Nepalgunj, Dhangadhi, Birgunj, Dharan, Butwal and Bharatpur." },
      { q: "Does it provide wedding muhurta or festival decisions?", a: "No. It does not infer personalized auspicious times or decide festival observance. Confirm important rituals with the official Nepal Panchanga and an approved local calendar." }
    ],
    "nepali-janma-kundali": [
      { q: "जन्मकुण्डली बनाउन के-के चाहिन्छ?", a: "जन्ममिति, जन्मसमय र जन्मस्थान आवश्यक हुन्छ। भारत वा नेपालका सहर छान्न सकिन्छ; अन्य देशका लागि निर्देशाङ्क र IANA समय क्षेत्र चाहिन्छ। लग्न र भावको गणनामा केही मिनेटको समय फरकले पनि नतिजा बदल्न सक्छ।" },
      { q: "के नेपाली विक्रम संवत् मिति राख्न मिल्छ?", a: "मिल्छ। हालको BS converter ले १९७५ देखि २०८३ सालसम्मको प्रकाशित मिति तालिका प्रयोग गर्छ। यो दायराबाहिरको जन्ममितिका लागि AD विकल्प प्रयोग गर्नुहोस्।" },
      { q: "कुन ज्योतिषीय पद्धति प्रयोग हुन्छ?", a: "ग्रहका geocentric apparent ecliptic positions, Lahiri/Chitrapaksha sidereal conversion, whole-sign houses, mean Rahu/Ketu र Vimshottari Mahadasha प्रयोग हुन्छ। फरक अयनांश वा भाव पद्धति अपनाउने सफ्टवेयरसँग केही अन्तर आउन सक्छ।" },
      { q: "के यो Hamro Patro सँग ठ्याक्कै मिल्छ?", a: "Hamro Patro को आन्तरिक ephemeris, ayanamsa र house-system configuration सार्वजनिक रूपमा पुष्टि नभएकाले ठ्याक्कै उस्तै हुने ग्यारेन्टी गर्न सकिँदैन। महत्त्वपूर्ण प्रयोगअघि अर्को विश्वसनीय पञ्चाङ्ग वा ज्योतिष सफ्टवेयरसँग विवरण मिलाउनुहोस्।" },
      { q: "जन्मस्थान किन आवश्यक छ?", a: "जन्मस्थानको अक्षांश, देशान्तर र समय क्षेत्रले स्थानीय sidereal time र लग्न गणनामा असर गर्छ। भारतका लागि Asia/Kolkata र नेपालका लागि Asia/Kathmandu स्वतः प्रयोग हुन्छ। सहर-केन्द्रका निर्देशाङ्क अनुमानित हुन्छन्; थप शुद्धताका लागि सही निर्देशाङ्क राख्नुहोस्।" },
      { q: "Can I make a Janam Kundli for an Indian birthplace?", a: "Yes. Select Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Jaipur, Varanasi, Lucknow, Ahmedabad, Pune or Bhopal. The calculator applies Asia/Kolkata to these Indian cities. Other places require coordinates and the correct IANA time zone." },
      { q: "क्या कुंडली हिंदी और अंग्रेज़ी में देख सकते हैं?", a: "हाँ। कुंडली टूल में नेपाली, English और हिन्दी भाषा चुनने का विकल्प है।" },
      { q: "मेरो जन्म विवरण कहाँ पठाइन्छ?", a: "कुण्डली गणना तपाईंको ब्राउजरमै हुन्छ। नाम, जन्ममिति, समय र स्थान कुनै गणना API मा पठाइँदैन वा स्वचालित रूपमा सुरक्षित गरिँदैन।" }
    ],
    "nepal-panchang-today": [
      { q: "Which location does the daily Panchang show?", a: "The embedded daily Panchang is for Kathmandu, Nepal only. Do not apply its timings to another district." },
      { q: "Can I choose a past date or another city?", a: "No. This is a live Kathmandu daily reference. Use the separate Hindu Panchang Calculator for a selectable date and supported Nepal or Indian city city." },
      { q: "Where does the daily Panchang data come from?", a: "The embedded view is supplied by Miti (Yarsa Himalaya), which documents its source data, published coverage and attribution on its own site." }
    ],
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
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.name}`,
    description: tool.description,
    step: [
      { "@type": "HowToStep", position: 1, name: "Prepare your input", text: `Read the instructions for ${tool.name} and prepare the file or values requested by the tool.` },
      { "@type": "HowToStep", position: 2, name: "Enter details", text: "Enter the required information and check units, formats and options before continuing." },
      { "@type": "HowToStep", position: 3, name: "Run the tool", text: "Use the Calculate, Convert, Generate or Process control shown on the page." },
      { "@type": "HowToStep", position: 4, name: "Review the result", text: "Check the output, assumptions and limitations. Save or copy it only after confirming it is suitable for your task." },
    ],
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    <ToolWorkspace slug={slug} />
    <CatalogToolSEOContent tool={tool} questions={questions} related={related} guideSlug={guide?.slug} />
  </>;
}
