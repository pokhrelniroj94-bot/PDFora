import type { BlogPost } from "./blog-posts";

export const nepalBlogPosts: BlogPost[] = [
  {
    slug: "nepali-date-converter-bs-to-ad-guide",
    title: "Nepali Date Converter: How to Convert BS to AD and AD to BS",
    description: "Learn how to convert Bikram Sambat dates to Gregorian dates and back, check date formats and avoid common Nepali miti conversion mistakes.",
    keyword: "Nepali date converter BS to AD",
    updated: "2026-11-01",
    readTime: "6 min read",
    intro: "Nepal uses the Bikram Sambat (BS) calendar for many everyday and official purposes, while international forms, software and databases often request Gregorian (AD) dates. A reliable BS to AD converter helps you move between the two formats without relying on a fixed year difference.",
    sections: [
      { heading: "What is the difference between BS and AD dates?", paragraphs: ["Bikram Sambat is Nepal's official calendar. Its New Year begins around mid-April, and its months do not have the same fixed lengths as Gregorian months. Gregorian dates are used widely in international systems, passports, software and online services.", "A BS year is roughly 56 to 57 years ahead of the corresponding AD year, but subtracting 56 or 57 is not a complete conversion. The exact day and month must be checked against calendar data."] },
      { heading: "How to convert a Nepali date to an English date", bullets: ["Open the PDFora Nepali Date Converter.", "Choose Nepali (BS) to English (AD).", "Enter the date in year-month-day order, for example 2083-01-01.", "Select Convert and review the Gregorian date and weekday.", "Copy the result only after checking that the original date was entered correctly."], paragraphs: ["The converter uses calendar data with a defined supported range. It rejects dates outside that range instead of guessing."] },
      { heading: "How to convert AD to BS", paragraphs: ["Choose English (AD) to Nepali (BS), enter a valid Gregorian date such as 2026-04-14 and convert it. The result includes the BS year, month and day. You can also view the result using Nepali digits.", "Use the date printed on the original document. Do not assume the date shown by a device is the same as the date printed on a certificate if the document was issued in a different time zone or calendar."] },
      { heading: "Common mistakes to avoid", paragraphs: [], bullets: ["Do not convert by subtracting a fixed 56 or 57 years.", "Check whether the input is BS or AD before converting.", "Use year-month-day order to avoid swapping month and day.", "Check the supported year range before converting old historical dates.", "For official forms, compare the result with the source certificate or an authoritative Nepali calendar."] }
    ],
    faqs: [
      { question: "Is BS the same as the Nepali calendar?", answer: "Yes. BS means Bikram Sambat, the calendar commonly used for Nepali dates (miti)." },
      { question: "Can I convert 2083 BS to AD?", answer: "Yes, if the complete date falls within the converter's supported calendar range. Enter year, month and day rather than the year alone." },
      { question: "Can I convert AD to BS on my phone?", answer: "Yes. The converter is designed to work in a modern mobile browser as well as on a computer." },
      { question: "Is subtracting 56 years enough?", answer: "No. BS and AD year boundaries and month lengths differ. Use a calendar-data-based converter for the exact date." }
    ],
    toolLinks: [{ label: "Nepali Date Converter", href: "/tools/nepali-date-converter" }, { label: "Date Difference Calculator", href: "/tools/date-difference-calculator" }, { label: "Age Calculator", href: "/tools/age-calculator" }]
  },
  {
    slug: "nepal-vat-calculator-13-percent-guide",
    title: "13% VAT Calculator Nepal: How to Add or Remove VAT",
    description: "Understand how to calculate 13 percent VAT in Nepal, find the VAT amount in a bill and extract VAT from a VAT-inclusive price.",
    keyword: "13 percent VAT calculator Nepal",
    updated: "2026-11-01",
    readTime: "5 min read",
    intro: "When preparing a quotation, checking a purchase bill or estimating a VAT-inclusive price in Nepal, it helps to separate the base amount from the VAT amount. This guide explains the arithmetic behind a 13% example and how to use a VAT calculator.",
    sections: [
      { heading: "How 13% VAT is calculated", paragraphs: ["For a simple example at a 13% rate, multiply the taxable base amount by 0.13 to calculate VAT. Add that VAT to the base amount to calculate the VAT-inclusive total. For a base price of NPR 1,000, the example VAT is NPR 130 and the total is NPR 1,130.", "The applicable rate and tax treatment depend on the goods or services and current law. Do not assume every transaction has the same treatment; verify current rules with the Inland Revenue Department or a qualified tax professional."] },
      { heading: "How to add VAT to a price", bullets: ["Open the Nepal VAT Calculator.", "Enter the amount before VAT in NPR.", "Enter 13 as the rate for a standard-rate example.", "Choose Add VAT to base price.", "Review the base amount, VAT amount and total."], paragraphs: ["Formula: VAT = base amount × rate ÷ 100. Total = base amount + VAT."] },
      { heading: "How to remove VAT from a VAT-inclusive price", paragraphs: ["If a displayed price already includes VAT, do not calculate 13% of the displayed total and subtract it. Instead, divide the VAT-inclusive total by 1.13 to find the base amount when the 13% rate applies. The VAT portion is the difference between the total and the base amount.", "For example, NPR 1,130 including 13% VAT contains a base amount of NPR 1,000 and VAT of NPR 130."] },
      { heading: "Keep invoices and tax records accurate", paragraphs: ["A calculator is useful for checking arithmetic, but it does not decide whether a supply is taxable, exempt or subject to a different treatment. Keep valid invoices and supporting records, and follow the current tax rules that apply to your business.", "For returns, registration, input-tax credits or legal compliance, use official guidance rather than relying only on an online calculator."] }
    ],
    faqs: [
      { question: "How much is 13% VAT on NPR 1,000?", answer: "For a taxable base of NPR 1,000 at 13%, VAT is NPR 130 and the total is NPR 1,130." },
      { question: "How do I remove 13% VAT from a total?", answer: "Divide the VAT-inclusive total by 1.13 to estimate the base amount. Subtract the base amount from the total to find the VAT portion." },
      { question: "Does every product in Nepal have 13% VAT?", answer: "No. Tax treatment can vary by goods, services and applicable law. Check current official guidance." }
    ],
    toolLinks: [{ label: "Nepal VAT Calculator", href: "/tools/nepali-vat-calculator" }, { label: "Percentage Calculator", href: "/tools/percentage-of-number-calculator" }, { label: "Discount Calculator", href: "/tools/discount-percentage-calculator" }]
  },
  {
    slug: "ropani-aana-paisa-daam-land-measurement-guide",
    title: "Ropani to Aana, Paisa and Daam: Nepal Land Measurement Guide",
    description: "Learn the traditional Nepali land measurement units ropani, aana, paisa and daam, with square feet and square metre conversions.",
    keyword: "Ropani to Aana converter Nepal",
    updated: "2026-11-01",
    readTime: "5 min read",
    intro: "Land listings and property discussions in many parts of Nepal use ropani, aana, paisa and daam. Converting these units into square feet or square metres makes it easier to compare areas, understand plans and communicate measurements.",
    sections: [
      { heading: "How the ropani system is divided", paragraphs: ["One ropani is divided into 16 aana. One aana is divided into 4 paisa, and one paisa is divided into 4 daam. This means one ropani contains 64 paisa or 256 daam.", "A commonly used conversion is 1 ropani = 5,476 square feet. Therefore 1 aana = 342.25 square feet, 1 paisa = 85.5625 square feet and 1 daam = 21.390625 square feet."] },
      { heading: "Convert ropani, aana, paisa and daam", bullets: ["Enter the number of ropani in the converter.", "Add the aana, paisa and daam portions.", "Review the total square feet and square metres.", "Use the reverse converter to convert a square-foot area into ropani and aana equivalents."], paragraphs: ["The calculator adds each part using its square-foot equivalent. For example, 2 aana equals 684.5 square feet."] },
      { heading: "Square feet and square metres", paragraphs: ["Square feet are commonly used in property listings and building discussions, while square metres are the SI unit used in many technical and international contexts. One square metre is approximately 10.7639 square feet.", "Use enough decimal places for comparison, but do not treat a rounded online conversion as a legal boundary measurement."] },
      { heading: "Important checks before buying or selling land", paragraphs: ["A conversion tool only changes units. It does not verify the parcel's actual surveyed area, boundary, ownership, access, zoning or title. Before a property transaction, compare the measurement with official cadastral records and obtain professional or government verification.", "Different regions may commonly use different traditional land units. Make sure the unit written on a document is the one you are converting."] }
    ],
    faqs: [
      { question: "How many aana are in one ropani?", answer: "There are 16 aana in one ropani." },
      { question: "How many square feet are in one aana?", answer: "One aana is commonly taken as 342.25 square feet." },
      { question: "How many square feet are in one ropani?", answer: "One ropani is commonly taken as 5,476 square feet." },
      { question: "Can this calculator be used for legal land measurement?", answer: "No. It is a unit converter only. Use official survey and cadastral records for legal measurements." }
    ],
    toolLinks: [{ label: "Ropani–Aana Converter", href: "/tools/nepal-land-area-converter" }, { label: "Unit Converter", href: "/tools/unit-converter" }]
  },
  {
    slug: "tola-to-gram-gold-weight-conversion-nepal",
    title: "Tola to Gram Conversion in Nepal: Gold and Silver Weight",
    description: "Find how many grams are in one tola, convert grams to tola and understand the difference between weight conversion and gold pricing.",
    keyword: "tola to gram converter Nepal",
    updated: "2026-11-01",
    readTime: "4 min read",
    intro: "Gold and silver weights in Nepal are often discussed in tola, while international jewellery specifications and digital scales commonly show grams. A tola-to-gram converter makes it easier to compare the same weight in both units.",
    sections: [
      { heading: "How many grams are in one tola?", paragraphs: ["One tola is approximately 11.6638038 grams. To convert tola into grams, multiply the tola value by 11.6638038. To convert grams into tola, divide the gram value by the same factor.", "For example, 1 tola is about 11.664 grams and 5 tola is about 58.319 grams. The converter displays additional decimal places for convenience."] },
      { heading: "Convert tola into grams", bullets: ["Open the Tola to Gram Converter.", "Choose Tola to grams.", "Enter the weight in tola.", "Read the result in grams and check the decimal precision required."], paragraphs: ["For the reverse calculation, select Grams to tola and enter the gram value."] },
      { heading: "Weight is not the same as gold price", paragraphs: ["This tool converts weight only. It does not provide a live gold rate, purity assessment, jewellery making charge, tax, buyback price or final shop quotation.", "The value of jewellery can depend on purity, market rate, workmanship and seller terms. Confirm the weight and price with the jeweller before making a purchase or sale."] }
    ],
    faqs: [
      { question: "How many grams is 1 tola?", answer: "One tola is approximately 11.6638038 grams." },
      { question: "How do I convert grams to tola?", answer: "Divide the gram weight by 11.6638038." },
      { question: "Does the converter show today's gold price?", answer: "No. It converts weight only and does not fetch live gold prices." }
    ],
    toolLinks: [{ label: "Tola to Gram Converter", href: "/tools/gold-tola-gram-converter" }]
  },
  {
    slug: "nepali-number-to-words-lakh-crore-guide",
    title: "How to Write Numbers in Words Using Lakh and Crore",
    description: "Understand the Nepali and Indian numbering system and convert large numbers into English words, lakh, crore and Nepali digits.",
    keyword: "Nepali number to words lakh crore",
    updated: "2026-11-01",
    readTime: "4 min read",
    intro: "Numbers in Nepal are commonly grouped using thousand, lakh and crore. This format appears in budgets, cheques, invoices, salary discussions and financial documents. Converting a number into words can help with reading and checking amounts.",
    sections: [
      { heading: "Thousand, lakh and crore", paragraphs: ["In the South Asian numbering system, one lakh is 100,000 and one crore is 10,000,000. Commas are commonly placed as 1,00,000 and 1,00,00,000 respectively.", "This differs from the international grouping style, which commonly uses millions and billions. When preparing a document, follow the format requested by the bank, organisation or recipient."] },
      { heading: "Convert a number into words", bullets: ["Open the Nepali Number to Words tool.", "Enter a whole number without currency symbols.", "Read the English words and Nepali digit display.", "Check the amount against the original figure before using it in a document."], paragraphs: ["The current utility supports values up to 99,99,99,999 and uses lakh/crore grouping for English words."] },
      { heading: "Use words carefully on financial documents", paragraphs: ["For cheques, contracts and invoices, make sure the words and numeric amount match exactly. Include the currency name separately when required, and do not rely on an automatic converter without proofreading the final document.", "The tool is a writing aid, not a bank or accounting validation service."] }
    ],
    faqs: [
      { question: "How much is one lakh?", answer: "One lakh equals 100,000." },
      { question: "How much is one crore?", answer: "One crore equals 10,000,000." },
      { question: "Does the tool write all Nepali number words?", answer: "It displays Nepali digits and a limited Nepali word reading range; English words use lakh and crore grouping. Review the output for formal documents." }
    ],
    toolLinks: [{ label: "Nepali Number Converter", href: "/tools/nepali-number-converter" }, { label: "VAT Calculator", href: "/tools/nepali-vat-calculator" }]
  }
  ,
  {
    slug: "nepali-calendar-bs-month-guide", title: "Nepali Calendar 2083: How to Read BS Dates and AD Weekdays",
    description: "Use a Bikram Sambat month calendar to match Nepali dates with Gregorian dates and weekdays.", keyword: "Nepali calendar 2083", updated: "2026-11-01", readTime: "4 min read",
    intro: "Nepali dates are used for school forms, government documents, festivals and everyday planning. A month view that shows both BS and AD dates can reduce confusion when a form asks for an English date.",
    sections: [
      { heading: "What the Nepali calendar shows", paragraphs: ["The Bikram Sambat calendar has twelve months, from Baisakh through Chaitra. Month lengths are not identical to Gregorian months, so a fixed year offset cannot convert a date accurately.", "The PDFora calendar pairs each BS day with its Gregorian date and weekday. It currently does not label public holidays, tithi or festivals."] },
      { heading: "How to view a BS month", paragraphs: [], bullets: ["Open the Nepali Calendar tool.", "Enter a BS year within the supported range.", "Choose the month.", "Select Show Calendar to see matching AD dates and weekdays.", "For official holidays, compare the result with the current government holiday notice."] },
      { heading: "Check dates before official use", paragraphs: ["Use the date printed on your certificate or official record. A calendar is a conversion aid, not proof of a person's date of birth or document issue date."] }
    ],
    faqs: [{ question: "Does it show public holidays?", answer: "The current month view shows BS dates, AD dates and weekdays, not holidays or festivals." }, { question: "Can I view 2083 BS?", answer: "Yes, within the supported calendar range." }],
    toolLinks: [{ label: "Nepali Calendar", href: "/tools/nepali-calendar" }, { label: "BS to AD Date Converter", href: "/tools/nepali-date-converter" }]
  },
  {
    slug: "neb-gpa-calculator-nepal-guide", title: "NEB GPA Calculator Nepal: Credit Hours and Grade Points Explained",
    description: "Understand the credit-weighted GPA formula and calculate an estimated NEB GPA from subject grade points.", keyword: "NEB GPA calculator Nepal", updated: "2026-11-01", readTime: "5 min read",
    intro: "Students often need to calculate an estimated GPA from subject grades and credit hours. The weighted formula matters because subjects may not all carry the same credit hours.",
    sections: [
      { heading: "The weighted GPA formula", paragraphs: ["GPA = sum of (subject credit hours × subject grade point) divided by total credit hours. A subject with more credit hours contributes more to the final GPA.", "The NEB publication by the Provincial Examination Management Office, Karnali, describes the credit-hour weighted GPA formula. Use the credit hours and grade points from the current official rules and your grade sheet."] },
      { heading: "How to use the calculator", paragraphs: [], bullets: ["Enter each subject name.", "Enter the subject credit hours from the official course structure or grade sheet.", "Choose the grade point shown on your result.", "Add or remove subject rows as needed.", "Compare the estimate with your official transcript."] },
      { heading: "Important limitations", paragraphs: ["The calculator uses a commonly used letter-grade scale as a helper. It cannot decide eligibility, pass status, practical/theory weighting or special grading rules. Check the current NEB directive and your school/college."] }
    ],
    faqs: [{ question: "How is GPA calculated?", answer: "Multiply each subject's grade point by its credit hours, add the products, then divide by total credit hours." }, { question: "Can I use this for TU BBA GPA?", answer: "TU programmes may use different rules. Check your faculty's grading regulation." }],
    toolLinks: [{ label: "NEB GPA Calculator", href: "/tools/neb-gpa-calculator" }, { label: "Percentage Calculator", href: "/tools/percentage-of-number-calculator" }]
  },
  {
    slug: "loksewa-online-form-photo-resizer-guide", title: "How to Resize a Photo to 50KB or 200KB for Loksewa and Online Forms",
    description: "Compress a photo in your browser to a chosen KB limit and understand why official image dimensions still matter.", keyword: "Loksewa photo resizer 50KB", updated: "2026-11-01", readTime: "4 min read",
    intro: "Many online applications set a maximum photo file size. A photo that is too large may fail to upload even when it looks correct on screen. Compressing it to a required KB limit can help.",
    sections: [
      { heading: "How to reduce a photo file size", paragraphs: [], bullets: ["Open the Loksewa and Online Form Photo Resizer.", "Choose the original image.", "Select a file-size target such as 50 KB or 200 KB.", "Choose a maximum image dimension and resize.", "Check the downloaded image against the vacancy or application notice."] },
      { heading: "File size is not image dimensions", paragraphs: ["A 50 KB image can still have the wrong width, height, aspect ratio, background or crop. Some forms require particular pixel dimensions or a signature format.", "The tool compresses the image to a selected size target. It does not know the rules of every Loksewa, bank or government portal."] },
      { heading: "Keep an original copy", paragraphs: ["Keep an untouched copy of the original image. Review the compressed image for blur before uploading. The browser-based tool processes the image locally on your device."] }
    ],
    faqs: [{ question: "Can I make a photo exactly 50 KB?", answer: "The tool aims to produce a file at or below the selected size target; the final size can be smaller." }, { question: "Will it guarantee upload acceptance?", answer: "No. Follow the exact pixel dimensions, aspect ratio, background and file type in the application notice." }],
    toolLinks: [{ label: "Loksewa Photo Resizer", href: "/tools/loksewa-photo-resizer" }]
  },
  {
    slug: "nepse-share-buy-sell-profit-calculator-guide", title: "NEPSE Share Calculator: Estimate Buy Cost, Selling Charges and Profit",
    description: "Estimate NEPSE share transaction cost and profit using editable broker commission, SEBON, DP and CGT assumptions.", keyword: "NEPSE share buy sell calculator", updated: "2026-11-01", readTime: "5 min read",
    intro: "The profit on a share trade is not always just the selling price minus the buying price. Transaction charges and capital gains tax assumptions affect the final amount received.",
    sections: [
      { heading: "What to include", paragraphs: ["Start with share quantity and buy and sell prices. Add broker commission and applicable regulatory charges to the purchase and sale sides. A depository participant charge may also apply on a sale.", "Capital gains tax depends on investor category and holding period. Use the current applicable rate rather than assuming one rate applies to every trade."] },
      { heading: "How to use the calculator", paragraphs: [], bullets: ["Enter share quantity and purchase price.", "Enter the expected selling price.", "Enter current broker commission and SEBON rates.", "Enter applicable DP charge and CGT assumption.", "Review estimated purchase cost and net profit."] },
      { heading: "Verify current charges", paragraphs: ["Brokerage schedules and tax rules can change. The tool keeps rates editable and does not claim to fetch live broker tariffs. Confirm rates with your broker, CDSC, SEBON and tax authority before trading."] }
    ],
    faqs: [{ question: "Does it show live NEPSE prices?", answer: "No. Enter your own buy and sell prices." }, { question: "Is CGT fixed for everyone?", answer: "No. Tax can depend on holding period and investor category. Confirm current rules." }],
    toolLinks: [{ label: "NEPSE Share Calculator", href: "/tools/nepal-share-calculator" }, { label: "Percentage Calculator", href: "/tools/percentage-of-number-calculator" }]
  },
  {
    slug: "english-to-nepali-digits-converter-guide", title: "English to Nepali Numbers: Convert 123 into १२३",
    description: "Convert English digits to Nepali Devanagari digits and back while keeping the rest of your text unchanged.", keyword: "English to Nepali digits converter", updated: "2026-11-01", readTime: "3 min read",
    intro: "Nepali documents and messages often use Devanagari digits, while websites, spreadsheets and international forms may use English digits. A digit converter makes it easy to switch the number characters.",
    sections: [
      { heading: "Nepali and English digit mapping", paragraphs: ["The digits map one-to-one: 0 = ०, 1 = १, 2 = २, 3 = ३, 4 = ४, 5 = ५, 6 = ६, 7 = ७, 8 = ८ and 9 = ९.", "Only digits change. Letters, spaces, punctuation and other text remain unchanged."] },
      { heading: "Convert digits in a sentence", paragraphs: [], bullets: ["Paste a number or sentence into the Nepali Unicode Digit Converter.", "Copy the Nepali-digit output for a Nepali document.", "Switch back to English digits when a system requires ASCII numerals."] }
    ],
    faqs: [{ question: "Does this translate English words into Nepali?", answer: "No. It converts digit characters only." }, { question: "Will punctuation and text be preserved?", answer: "Yes. Only digit characters are replaced." }],
    toolLinks: [{ label: "Nepali Digit Converter", href: "/tools/nepali-digit-converter" }, { label: "Nepali Number to Words", href: "/tools/nepali-number-converter" }]
  }

  ,
  {
    slug: "preeti-to-unicode-nepali-font-converter-guide",
    title: "Preeti to Unicode Converter: Convert Old Nepali Text Online",
    description: "Learn how to convert legacy Preeti font text into readable Nepali Unicode and convert Unicode back to Preeti.",
    keyword: "Preeti to Unicode converter",
    updated: "2026-11-01",
    readTime: "4 min read",
    intro: "Many older Nepali documents were typed using the Preeti font. When copied into a modern website, email or Unicode document, the text can appear as Latin characters. A Preeti-to-Unicode converter helps recover readable Devanagari text.",
    sections: [
      { heading: "Why old Preeti text looks like English", paragraphs: ["Preeti is a legacy font encoding: the stored characters are Latin-key characters that display Nepali glyphs when the Preeti font is applied. Without the font, copied text may look like a string of English letters and symbols.", "Unicode Nepali stores Devanagari characters directly, so it is generally more suitable for modern websites, search, email and cross-device documents."] },
      { heading: "How to convert Preeti to Unicode", paragraphs: [], bullets: ["Copy text from the old Preeti document.", "Open the Preeti ↔ Nepali Unicode Converter.", "Choose Preeti to Unicode.", "Paste the Preeti-encoded text and convert.", "Review the output carefully, especially punctuation, names and mixed English/Nepali text."] },
      { heading: "Convert Unicode back to Preeti", paragraphs: ["Choose Unicode Nepali to Preeti, paste the Unicode text and convert. The resulting encoded text should be placed in a document using the Preeti font to display as intended.", "Keep a copy of the original document. Different legacy fonts use different mappings, so text typed in Kantipur, PCS Nepali or another font may not convert correctly using a Preeti-only converter."] }
    ],
    faqs: [
      { question: "Does Preeti text equal Unicode Nepali?", answer: "No. Preeti is a legacy font encoding; Unicode stores Devanagari characters directly." },
      { question: "Can this convert Kantipur or PCS Nepali?", answer: "This tool targets Preeti. Other legacy fonts may use different character maps." },
      { question: "Should I check the converted text?", answer: "Yes. Review names, punctuation and mixed English/Nepali passages before using the result in an official document." }
    ],
    toolLinks: [{ label: "Preeti Unicode Converter", href: "/tools/preeti-unicode-converter" }, { label: "Nepali Digit Converter", href: "/tools/nepali-digit-converter" }]
  }

  ,
  {
    slug: "nepal-rastra-bank-daily-exchange-rates-guide",
    title: "Nepal Rastra Bank Exchange Rate Today: How to Check USD, INR and Other Currencies",
    description: "Learn how to read NRB buying and selling rates, currency units and convert foreign currency into Nepalese rupees.",
    keyword: "Nepal Rastra Bank exchange rate today",
    updated: "2026-11-01",
    readTime: "5 min read",
    intro: "People sending remittances, travelling abroad, paying for imports or comparing foreign-currency values often need the Nepal Rastra Bank reference exchange rate. NRB publishes buying and selling prices, and some currencies are quoted in units of 10 or 100 rather than one.",
    sections: [
      { heading: "What are NRB buying and selling rates?", paragraphs: ["The buying rate is the reference amount in NPR at which a bank buys a foreign currency. The selling rate is the reference amount at which a bank sells that currency. Individual banks and money changers may quote different rates.", "Always check the unit shown beside the currency. For example, if the rate is quoted per 100 Indian rupees, divide or multiply using that 100-unit basis rather than treating the rate as one INR."] },
      { heading: "How to use the NRB rate tool", paragraphs: [], bullets: ["Open the NRB Daily Exchange Rates tool.", "Refresh to load the latest rate published by NRB.", "Find the currency code and check its unit, buying rate and selling rate.", "For foreign currency to NPR, use the buying-rate calculation.", "For NPR to foreign currency, use the selling-rate calculation."] },
      { heading: "Why the latest date may be earlier than today", paragraphs: ["NRB publishes rates on working days. Weekends and public holidays may have no new rate. The tool checks a short recent date range and displays the latest rate record returned by NRB."] }
    ],
    faqs: [
      { question: "Are NRB rates the same as remittance rates?", answer: "Not necessarily. Remittance providers and individual banks may offer their own rates and fees." },
      { question: "Why does INR show a unit of 100?", answer: "The NRB publishes some currencies against a quoted unit such as 100 or 10. The converter uses the unit supplied by the API." },
      { question: "Does the tool use live rates?", answer: "It requests the latest available published NRB rate when you refresh; it does not guarantee intraday bank rates." }
    ],
    toolLinks: [{ label: "NRB Exchange Rates", href: "/tools/nepal-forex-rates" }, { label: "General Currency Converter", href: "/tools/currency-converter" }],
    sources: [{ label: "Nepal Rastra Bank exchange rates", url: "https://www.nrb.org.np/forex" }, { label: "NRB Forex API documentation", url: "https://www.nrb.org.np/api-docs-v1/" }],
  },
  {
    slug: "nepal-salary-income-tax-calculator-2083-84-guide",
    title: "Nepal Salary Tax Calculator 2083/84: Understand the New Income Tax Slabs",
    description: "Understand progressive personal income tax bands for FY 2083/84 and estimate annual and monthly tax on taxable income.",
    keyword: "Nepal salary tax calculator 2083/84",
    updated: "2026-11-01",
    readTime: "6 min read",
    intro: "Salary tax in Nepal is progressive: different portions of taxable income are charged at different rates. A useful estimate starts with annual taxable income, then applies each band in order rather than applying one percentage to the entire salary.",
    sections: [
      { heading: "How progressive tax works", paragraphs: ["The FY 2083/84 natural-person tax-rate notice published by the Inland Revenue Department lists the current individual tax bands. The first band is NPR 1,000,000 at 1% where the charge applies, followed by NPR 500,000 at 10%, NPR 1,000,000 at 20%, NPR 1,500,000 at 27%, and income above NPR 4,000,000 at 29%.", "Some statutory situations are exempt from the 1% first-band charge. Taxable income is not always the same as gross salary: eligible deductions, contributions and allowances may affect the calculation."] },
      { heading: "How to estimate monthly salary tax", paragraphs: [], bullets: ["Find annual taxable income after eligible deductions.", "Enter that annual figure in the FY 2083/84 salary tax calculator.", "Select the first-band exemption only if it genuinely applies to your case.", "Review the band-by-band tax and monthly average.", "Compare the estimate with your employer payroll statement or an IRD-approved calculation."] },
      { heading: "What this calculator does not decide", paragraphs: ["This estimate is for resident natural persons and does not automatically account for every rebate, insurance deduction, retirement contribution, special income category, non-resident case or individual tax credit. Confirm your situation with IRD or a qualified tax professional."] }
    ],
    faqs: [
      { question: "Is the tax rate applied to the full salary?", answer: "No. Each progressive rate applies only to the portion of taxable income in its band." },
      { question: "Is the 1% first band charged for everyone?", answer: "No. The law contains exceptions. Select the exemption only when the statutory conditions apply." },
      { question: "Is the result the exact take-home pay?", answer: "No. It is a tax estimate and excludes payroll items or deductions that are not entered." }
    ],
    toolLinks: [{ label: "Nepal Salary Tax Calculator", href: "/tools/nepal-salary-tax-calculator" }, { label: "Percentage Calculator", href: "/tools/percentage-of-number-calculator" }],
    sources: [{ label: "Inland Revenue Department tax rates and incentives", url: "https://ird.gov.np/category/taxrateincentives/" }],
  },
  {
    slug: "nea-electricity-bill-calculator-nepal-guide",
    title: "NEA Electricity Bill Calculator Nepal: Units, Meter Capacity and VAT Explained",
    description: "Estimate a domestic electricity bill using monthly units, meter capacity, block rates and current tax assumptions.",
    keyword: "NEA electricity bill calculator Nepal",
    updated: "2026-11-01",
    readTime: "6 min read",
    intro: "A household electricity bill depends on monthly units consumed, the meter capacity and the applicable minimum and energy charges. Block billing means the price of each band applies only to the units within that band.",
    sections: [
      { heading: "How domestic block billing works", paragraphs: ["The estimator uses a published single-phase domestic schedule for 5A, 15A, 30A and 60A connections. The first block and monthly minimum charge differ by meter size, while higher consumption blocks use their respective unit rates.", "It also includes an estimated 5% VAT on energy charges above 50 units and an optional 2% early-payment rebate. These assumptions should be checked against the latest bill and official tariff guidance."] },
      { heading: "How to estimate your bill", paragraphs: [], bullets: ["Check your monthly consumption in kWh (units) from the meter reading.", "Choose the meter capacity printed on your bill or meter card.", "Select the early-payment rebate only if you expect to pay within the eligible period.", "Review the energy charge, minimum charge, VAT and estimated total.", "Compare the estimate with the current bill and official ERC calculator."] },
      { heading: "When not to use this estimator", paragraphs: ["This estimator is for single-phase domestic connections only. Commercial, industrial, three-phase, time-of-day and special tariff customers need the applicable tariff category and demand charges. Use the official Electricity Regulatory Commission calculator for those cases."] }
    ],
    faqs: [
      { question: "Does it calculate commercial electricity bills?", answer: "No. It estimates single-phase domestic bills only. Use the official ERC calculator for commercial or other categories." },
      { question: "Why is my NEA bill different?", answer: "Your bill may include arrears, meter/account adjustments, tariff changes or other items not included in this estimate." },
      { question: "Is the estimate an official bill?", answer: "No. The actual bill issued by NEA is final. Check current ERC and NEA tariff information." }
    ],
    toolLinks: [{ label: "NEA Electricity Bill Calculator", href: "/tools/nepal-electricity-bill-calculator" }],
    sources: [{ label: "Electricity Regulatory Commission official bill calculator", url: "https://www.erc.gov.np/electricity-calculator" }, { label: "NEA consumer tariff rates", url: "https://www.nea.org.np/en/pages/consumer-tariff-rates" }],
  },
  {
    slug: "nepal-public-holidays-2083-calendar-guide",
    title: "Nepal Government Public Holidays 2083: Full Calendar and Regional Notes",
    description: "Search the 2083 BS public holiday list with AD dates, national holidays and community-specific observances.",
    keyword: "Nepal public holidays 2083",
    updated: "2026-11-01",
    readTime: "6 min read",
    intro: "Nepal's public holiday notice includes national holidays as well as dates that apply only to particular regions, communities or groups. Checking the scope of a holiday matters when planning government visits, school work, travel or business deadlines.",
    sections: [
      { heading: "National and restricted holidays", paragraphs: ["The Ministry of Home Affairs publishes the annual government and public holiday notice. Some entries are nationwide, while others apply to the Kathmandu Valley, particular communities, women employees, educational institutions or specific Terai and Hill districts.", "Several lunar observances may be announced later after the date is confirmed. A calendar should label these as to be announced rather than guessing a date."] },
      { heading: "How to search the 2083 calendar", paragraphs: [], bullets: ["Open the Nepal Public Holidays 2083 tool.", "Search by holiday name, BS date or AD date.", "Use the category filters to show national, regional, community-specific or to-be-announced entries.", "Open the Ministry of Home Affairs notice before relying on a date for an official deadline."] },
      { heading: "Check local and institutional notices", paragraphs: ["Provincial governments, local bodies, schools, banks and private employers may follow additional or different closure notices. The calendar is a searchable guide to the published federal list, not a promise that every institution will close."] }
    ],
    faqs: [
      { question: "Are all listed holidays nationwide?", answer: "No. Some dates apply only to specified regions or communities. Read the notes beside each entry." },
      { question: "Why are some dates marked TBA?", answer: "Some lunar or locally determined observances require a later official announcement." },
      { question: "Where can I verify the official notice?", answer: "Use the Ministry of Home Affairs Government and Public Holidays 2083 page linked from the calendar." }
    ],
    toolLinks: [{ label: "Nepal Public Holidays 2083", href: "/tools/nepal-public-holidays-2083" }, { label: "Nepali Calendar", href: "/tools/nepali-calendar" }],
    sources: [{ label: "Ministry of Home Affairs: Government and Public Holidays 2083", url: "https://moha.gov.np/en/page/government-and-public-holidays-in-2083" }],
  },
  {
    slug: "nepali-unicode-typing-online-guide",
    title: "How to Type Nepali Online Using an English Keyboard",
    description: "Convert Romanized Nepali words into Devanagari Unicode text for messages, documents and online forms.",
    keyword: "Nepali Unicode typing online",
    updated: "2026-11-01",
    readTime: "4 min read",
    intro: "You do not need a physical Nepali keyboard to write Nepali text. A Romanized typing tool lets you type Nepali sounds with English letters and convert the result into Devanagari Unicode.",
    sections: [
      { heading: "Romanized typing is not translation", paragraphs: ["Typing namaste and converting it to नमस्ते changes the script based on pronunciation. It does not translate an English sentence into Nepali meaning.", "Different spellings can produce different results, so names, formal words and uncommon terms should be reviewed."] },
      { heading: "How to type Nepali Unicode", paragraphs: [], bullets: ["Open the Nepali Unicode Typing tool.", "Type a Nepali word using Roman letters, such as namaste or dhanyabad.", "Convert the text and review the Devanagari output.", "Edit the output if a spelling needs correction.", "Copy the text or download it as a UTF-8 text file."] },
      { heading: "Unicode versus legacy Preeti fonts", paragraphs: ["Unicode Nepali is suitable for modern websites, email, messaging and documents. Old Preeti-font text uses a legacy character mapping and should be converted with a separate Preeti-to-Unicode tool rather than treated as ordinary Romanized Nepali."] }
    ],
    faqs: [
      { question: "Does this tool translate English into Nepali?", answer: "No. It transliterates Romanized Nepali sounds into Devanagari script." },
      { question: "Can I paste the output into Word and Facebook?", answer: "Yes. The output is Unicode text and can be copied into applications that support Devanagari." },
      { question: "Can it convert old Preeti documents?", answer: "Use the separate Preeti ↔ Unicode converter for legacy Preeti-encoded text." }
    ],
    toolLinks: [{ label: "Nepali Unicode Typing", href: "/tools/nepali-unicode-typing" }, { label: "Preeti Unicode Converter", href: "/tools/preeti-unicode-converter" }],
    sources: [{ label: "Nepalify open-source typing library", url: "https://github.com/suvash/nepalify" }],
  }

  ,
  {
    slug: "nepal-mobile-number-format-checker-guide",
    title: "Nepal Mobile Number Format: Check 96, 97, 98 and +977 Numbers",
    description: "Learn the basic 10-digit Nepal mobile format, country code +977 and how to check a number's format before using it in a form.",
    keyword: "Nepal mobile number format checker",
    updated: "2026-11-01",
    readTime: "4 min read",
    intro: "Nepal mobile numbers use a 10-digit national format. Online forms may ask for the local number or the international +977 format, so checking the digits and country code before submitting can prevent simple formatting mistakes.",
    sections: [
      { heading: "Basic Nepal mobile number format", paragraphs: ["The National Numbering Allocation Plan published by the Nepal Telecommunications Authority describes cellular mobile numbers as 10 digits, with the first two digits used as the system code. The 96, 97 and 98 ranges are used in the national numbering plan.", "Ncell has also announced new numbers beginning with 971. Prefix allocations and operator ranges can change, so a format check should not be treated as proof that a number is active or belongs to a particular person."] },
      { heading: "How to format a number with +977", paragraphs: [], bullets: ["Enter the 10-digit local mobile number.", "If the number already starts with +977, the checker removes the country code before validating the national part.", "Use the generated +977 format when an international form asks for a country code.", "Check the number against the original SIM or account record before submitting."] },
      { heading: "What a format checker cannot confirm", paragraphs: ["A valid-looking number may be inactive, unassigned, suspended or incorrectly entered. The tool checks the number pattern only; it does not connect to telecom operator systems or verify SIM ownership."] }
    ],
    faqs: [
      { question: "How many digits are in a Nepal mobile number?", answer: "The national mobile number format uses 10 digits, excluding the +977 country code." },
      { question: "Does +977 count as part of the 10 digits?", answer: "No. +977 is Nepal's international country calling code and is written before the 10-digit national number." },
      { question: "Can the tool verify whether a SIM is active?", answer: "No. It checks number formatting only, not network status, ownership or SIM activation." }
    ],
    toolLinks: [{ label: "Nepal Phone Number Validator", href: "/tools/nepal-phone-validator" }],
    sources: [{ label: "Nepal Telecommunications Authority: National Numbering Allocation Plan", url: "https://nta.gov.np/uploads/contents/National%20Numbering%20Allocation%20Plan.pdf" }, { label: "Ncell announcement of the 971 number range", url: "https://www.ncell.com.np/en/about/media-room/press-release/ncell-begins-issuing-new-mobile-numbers-starting-with-971" }]
  }


  ,{
    slug: "nepse-market-news-and-ipo-updates",
    title: "NEPSE News and Nepal IPO Updates: How to Verify Market Information",
    description: "Follow Nepal stock-market headlines, IPO and FPO updates, allotment notices and official sources. Learn how to distinguish news search results from confirmed exchange disclosures.",
    keyword: "NEPSE news Nepal IPO FPO updates",
    updated: "2026-11-02",
    readTime: "5 min read",
    intro: "Investors in Nepal often need to follow market news, public issues, dividend announcements and allotment updates across several websites. PDFora's Nepal market news panel collects recent search-feed headlines in one place and links readers to the original publisher. It is a discovery tool, not an official exchange notice service or a live trading terminal.",
    sections: [
      { heading: "What the market news panel shows", paragraphs: ["The market section searches for Nepal stock-market and NEPSE coverage. A separate IPO section searches for public issues, FPOs and allotment-related reporting. Each result includes a headline, publisher label, publication time and a link to the source article.", "The feed is refreshed from a news search provider and cached briefly to reduce repeated requests. Search results can contain duplicate coverage, older stories or headlines that mention a keyword without reporting a confirmed event."] },
      { heading: "Where to verify IPO and FPO information", paragraphs: ["Before applying for an issue, check the issuing company's official prospectus and notices, SEBON approvals and the CDSC Mero Share portal for application and allotment information. A news headline is not proof that an issue is open, that an application has been accepted or that shares have been allotted."] },
      { heading: "How to use NEPSE news responsibly", paragraphs: ["Use headlines as a starting point for research, then confirm each event from the original publisher and the relevant official notice."], bullets: ["Open the headline and read the full article, not only its title.", "Check the publication date and whether the article has been updated.", "Confirm price-sensitive disclosures with NEPSE and the listed company.", "Confirm IPO/FPO opening and closing dates with the official issue manager and prospectus.", "Do not make a trading decision from an automatically aggregated headline alone."] },
      { heading: "Limitations of automatic news aggregation", paragraphs: ["News search feeds depend on the provider's indexing and ranking. They may omit a story, show multiple reports about the same event or display an item later than its original publication. The panel does not provide verified real-time prices, order books, broker recommendations or investment advice."] }
    ],
    faqs: [
      { question: "Does PDFora show official live NEPSE prices?", answer: "No. This feature aggregates news headlines. It does not show official live market prices or order-book data." },
      { question: "Are IPO dates and allotment results guaranteed to be current?", answer: "No. Verify every opening date, closing date and allotment result through the issuer, issue manager, SEBON or CDSC." },
      { question: "Why can the same story appear more than once?", answer: "Different publishers may cover the same event, and news search feeds can return overlapping results." }
    ],
    toolLinks: [{ label: "NEPSE Market & IPO News", href: "/tools/nepse-market-news" }, { label: "NEPSE Share Buy/Sell Calculator", href: "/tools/nepal-share-calculator" }, { label: "Dividend & Bonus Share Calculator", href: "/tools/nepse-dividend-calculator" }],
    sources: [{ label: "Nepal Stock Exchange", url: "https://www.nepalstock.com/" }, { label: "Securities Board of Nepal", url: "https://www.sebon.gov.np/" }, { label: "CDSC Mero Share", url: "https://meroshare.cdsc.com.np/" }]
  },
  {
    slug: "nepse-cash-dividend-and-bonus-share-calculator-guide",
    title: "NEPSE Cash Dividend and Bonus Share Calculator Guide",
    description: "Learn how to estimate Nepal share cash dividends, withholding tax and bonus-share entitlement from your eligible holdings.",
    keyword: "NEPSE cash dividend bonus share calculator Nepal",
    updated: "2026-11-02",
    readTime: "4 min read",
    intro: "A company may announce a cash dividend, bonus shares or a combination of both. The amount credited to an investor depends on eligible holdings on the book-closure date, the declared percentage and the applicable tax and corporate-action rules. PDFora's calculator provides a quick estimate from the percentages you enter.",
    sections: [
      { heading: "How a cash dividend percentage works", paragraphs: ["A cash dividend declared at a percentage is generally calculated against the applicable paid-up value per share, not automatically against the market price. For example, a 10% cash dividend on 100 eligible shares with a face value of NPR 100 implies a gross estimate of NPR 1,000 before any applicable withholding tax. Check the company's notice for the exact basis."] },
      { heading: "How bonus shares are estimated", paragraphs: ["A 5% bonus-share declaration applied to 100 eligible shares gives a simple estimate of 5 bonus shares. The final credited quantity depends on the official corporate action, book-closure eligibility and how fractional entitlements are handled."] },
      { heading: "Using the PDFora calculator", paragraphs: ["The calculator turns the share quantity and declared percentages into an indicative cash and bonus-share estimate. Enter figures from the issuer announcement rather than estimating the percentages from market-price movements."], bullets: ["Enter the number of shares eligible for the corporate action.", "Enter the announced cash-dividend percentage, if any.", "Enter the announced bonus-share percentage, if any.", "Set the withholding-tax assumption only after checking the current applicable rule.", "Compare the estimate with the company notice and final CDSC/Mero Share credit."] },
      { heading: "Important limitations", paragraphs: ["The calculator does not check your Demat holdings, book-closure date, company paid-up value, fractional entitlements or tax category. It does not connect to CDSC or a broker account. Treat the output as a planning estimate and confirm the final corporate-action statement."] }
    ],
    faqs: [
      { question: "Is a 10% cash dividend calculated on the current market price?", answer: "Not necessarily. The declared percentage is commonly based on paid-up or face value as specified in the company notice. Read the exact resolution before calculating." },
      { question: "Will every investor receive the estimated bonus shares?", answer: "Only eligible shareholders under the book-closure and corporate-action rules receive the final allotment. The calculator cannot verify eligibility." },
      { question: "Does the calculator confirm dividend tax?", answer: "No. Tax treatment can depend on current law and investor circumstances. Verify the applicable withholding rate with the company or tax authority." }
    ],
    toolLinks: [{ label: "NEPSE Dividend & Bonus Share Calculator", href: "/tools/nepse-dividend-calculator" }, { label: "NEPSE Share Buy/Sell Calculator", href: "/tools/nepal-share-calculator" }],
    sources: [{ label: "Nepal Stock Exchange", url: "https://www.nepalstock.com/" }, { label: "CDSC", url: "https://cdsc.com.np/" }, { label: "Inland Revenue Department", url: "https://ird.gov.np/" }]
  },

  {
    slug: "nepal-fixed-deposit-calculator-guide",
    title: "Nepal Fixed Deposit Calculator: Estimate FD Interest and Maturity",
    description: "Learn how to estimate fixed-deposit maturity value, compounding and tax assumptions when comparing Nepal bank FD products.",
    keyword: "Nepal fixed deposit calculator",
    updated: "2026-11-02",
    readTime: "5 min read",
    intro: "A fixed deposit estimate helps compare how principal, interest rate, deposit term and compounding frequency affect maturity value. The final bank payout depends on the product's own terms and current tax rules.",
    sections: [
      { heading: "What inputs affect FD maturity?", paragraphs: ["The principal is the amount deposited, the annual interest rate is the advertised return, and the term determines how long interest can accrue. Compounding frequency affects how often earned interest is added to the balance."] },
      { heading: "How to use the calculator", paragraphs: ["Follow these steps using the terms shown in the bank\u0027s current FD product disclosure."], bullets: ["Enter the deposit amount in NPR.", "Enter the bank's annual interest rate and term in months.", "Choose the compounding frequency stated by the bank.", "Set an appropriate tax assumption and review gross interest and estimated maturity."] },
      { heading: "Important limitations", paragraphs: ["Banks may use different day-count conventions, interest payout options, minimum terms, premature withdrawal penalties and withholding rules. Confirm the exact product disclosure and current IRD guidance before depositing."] }
    ],
    faqs: [{ question: "Does every Nepal bank compound FD interest quarterly?", answer: "No. Compounding and payout rules depend on the specific bank product. Use the terms published by the bank." }],
    toolLinks: [{ label: "Nepal Fixed Deposit Calculator", href: "/tools/nepal-fixed-deposit-calculator" }],
    sources: [{ label: "Nepal Rastra Bank", url: "https://www.nrb.org.np/" }, { label: "Inland Revenue Department", url: "https://ird.gov.np/" }]
  },
  {
    slug: "nepal-remittance-calculator-guide",
    title: "Nepal Remittance Calculator: Estimate the NPR Amount Received",
    description: "Understand how exchange rates and transfer fees affect the amount received by a family in Nepal.",
    keyword: "Nepal remittance calculator",
    updated: "2026-11-02",
    readTime: "5 min read",
    intro: "A remittance payout depends on the amount sent, the provider's exchange rate and any transfer or recipient fee. Comparing the final NPR amount is more useful than comparing an exchange rate alone.",
    sections: [
      { heading: "How remittance payout is estimated", paragraphs: ["Multiply the amount sent by the quoted NPR exchange rate, then subtract any fee charged in NPR. If the provider deducts a fee from the sending currency, convert that fee consistently before comparing offers."] },
      { heading: "How to compare providers", paragraphs: ["Use the same transfer amount and payout currency when comparing quotes."], bullets: ["Check the recipient amount, not just the advertised rate.", "Confirm who pays the transfer fee.", "Check whether intermediary or recipient-bank charges apply.", "Compare quotes for the same sending amount and payout method."] },
      { heading: "Important limitations", paragraphs: ["The calculator does not connect to remittance companies or fetch a live quote. Actual exchange rates and fees vary by provider, destination, transfer method and time."] }
    ],
    faqs: [{ question: "Does this show live remittance rates?", answer: "No. Enter the rate and fees quoted by your chosen provider." }],
    toolLinks: [{ label: "Nepal Remittance Calculator", href: "/tools/nepal-remittance-calculator" }],
    sources: [{ label: "Nepal Rastra Bank", url: "https://www.nrb.org.np/" }]
  },
  {
    slug: "nepal-ipo-profit-calculator-guide",
    title: "Nepal IPO Profit Calculator: Kitta, Selling Charges and Tax",
    description: "Estimate IPO share profit or loss after broker commission, SEBON fee, DP charge and capital-gains tax assumptions.",
    keyword: "Nepal IPO profit calculator",
    updated: "2026-11-02",
    readTime: "6 min read",
    intro: "IPO allotment does not guarantee a profit. The final result depends on the sale price, share quantity, broker tariff, transaction fees and applicable capital-gains tax.",
    sections: [
      { heading: "Calculate the gross gain or loss", paragraphs: ["Multiply the allotted share quantity by the sale price to estimate gross sale value. Subtract the original allotment cost to find the gross gain or loss before selling charges."] },
      { heading: "Include selling charges", paragraphs: ["Add each current selling charge so the estimate reflects net proceeds rather than only the gross price difference."], bullets: ["Enter the actual allotted kitta and IPO price.", "Use a realistic sale price scenario.", "Update broker commission, SEBON fee and DP charge from the current tariff.", "Select a tax assumption only after checking the applicable holding-period rule."] },
      { heading: "Important limitations", paragraphs: ["This is a planning estimate, not a broker contract note. Charges, minimum fees, tax treatment and settlement rules can change. Confirm current terms with your broker and the Inland Revenue Department."] }
    ],
    faqs: [{ question: "Does the tool know the actual listing price?", answer: "No. The sale price is an assumption entered by the user and may differ from the market price." }],
    toolLinks: [{ label: "Nepal IPO Profit Calculator", href: "/tools/nepal-ipo-profit-calculator" }, { label: "NEPSE Share Calculator", href: "/tools/nepal-share-calculator" }],
    sources: [{ label: "Nepal Stock Exchange", url: "https://www.nepalstock.com/" }, { label: "Inland Revenue Department", url: "https://ird.gov.np/" }]
  },

  {
    slug: "janam-kundli-lagna-rashi-nakshatra-dasha-guide",
    title: "Janam Kundli Guide: Lagna, Rashi, Nakshatra and Vimshottari Dasha",
    description: "Understand Vedic birth chart basics, birth time and time zones, Lagna, Moon sign, nakshatra, houses and Vimshottari dasha for India and Nepal.",
    keyword: "janam kundli, janam kundli online, kundli lagna rashi nakshatra, Vedic birth chart India",
    updated: "2026-11-02",
    readTime: "7 min read",
    intro: "A Janam Kundli is a traditional Vedic astrology chart calculated from birth date, local birth time and birthplace. Correct coordinates and time-zone conversion matter: India uses Asia/Kolkata while Nepal uses Asia/Kathmandu, a 15-minute difference. Astrology is a traditional belief system, not a scientifically proven way to predict life events.",
    sections: [
      { heading: "Birth details and local time", paragraphs: ["Use the time from a reliable birth record and choose the actual birthplace. Do not use Nepal's time zone for an Indian birth. City-centre coordinates are approximate; enter precise coordinates for a village or a birth near an ascendant boundary."] },
      { heading: "Lagna, Rashi and houses", paragraphs: ["Lagna (Ascendant) is the sign rising on the eastern horizon at the birth moment. Rashi commonly refers to the Moon sign in Indian usage. The D1 chart places planets in signs and houses according to a selected house convention. Lagna and Moon sign are different chart factors."] },
      { heading: "Nakshatra and pada", paragraphs: ["The sidereal zodiac is commonly divided into 27 nakshatras, each spanning 13 degrees and 20 minutes. Each nakshatra has four padas. Ayanamsha and birth-time differences can matter near a boundary."] },
      { heading: "Vimshottari Mahadasha", paragraphs: ["Vimshottari is a traditional 120-year planetary-period sequence. Its starting period and birth balance are derived from the Moon's position in its birth nakshatra. Dates depend on the selected year-length convention and precise lunar longitude."] },
      { heading: "Compare charts carefully", paragraphs: ["Use matching date, time zone, coordinates, ayanamsha, node choice and house system when comparing software. Astrological interpretations are not scientifically validated predictions and should not replace professional advice."] }
    ],
    faqs: [
      { question: "Can I create a Kundli for someone born in India?", answer: "Yes. Select a supported Indian city or enter precise coordinates and the correct time zone, such as Asia/Kolkata." },
      { question: "What is the difference between Lagna and Rashi?", answer: "Lagna is the sign rising at the eastern horizon at birth. Rashi commonly refers to the Moon sign." },
      { question: "Does birth time affect Kundli?", answer: "Yes. The ascendant and houses can change with birth time, especially near sign boundaries." }
    ],
    toolLinks: [{ label: "Janma Kundali / Birth Chart", href: "/tools/nepali-janma-kundali" }, { label: "Hindu Panchang Calculator", href: "/tools/nepal-panchang-calculator" }]
  },
  {
    slug: "hindu-panchang-tithi-nakshatra-yoga-karana-guide",
    title: "Hindu Panchang Guide: Tithi, Nakshatra, Yoga and Karana",
    description: "Learn the five limbs of Hindu Panchang and why tithi, local sunrise, city and regional calendar conventions matter in India and Nepal.",
    keyword: "Hindu panchang, tithi today, nakshatra today, panchang calculator India Nepal",
    updated: "2026-11-02",
    readTime: "6 min read",
    intro: "A Hindu Panchang is a traditional lunisolar almanac. Its five main limbs are tithi, vara (weekday), nakshatra, yoga and karana. Displayed values and festival observances can depend on local sunrise, geography and regional tradition.",
    sections: [
      { heading: "What is a Tithi?", paragraphs: ["A tithi is based on the angular separation of the geocentric Moon and Sun. There are 30 tithis in a lunar month: 15 in Shukla Paksha and 15 in Krishna Paksha. A tithi can begin or end at any time, not only midnight."] },
      { heading: "Nakshatra, Yoga and Karana", paragraphs: ["Nakshatra tracks the Moon through 27 sidereal sectors. Yoga uses the combined sidereal longitudes of the Sun and Moon. Karana is half of a tithi. Regional almanacs may apply additional traditional rules for observances."] },
      { heading: "Why city and sunrise matter", paragraphs: ["Sunrise and sunset depend on latitude, longitude, elevation and date. A Panchang for Delhi should not reuse Kathmandu sunrise. Local time-zone conversion is also required. India and Nepal do not necessarily follow the same official or regional almanac for every festival, so confirm important observances with a trusted local Panchang."] },
      { heading: "Calculation limitations", paragraphs: ["Online calculations can use different ephemerides, ayanamsha values, sunrise definitions and rounding rules. City-centre coordinates are approximate. Compare settings and source data, not only the displayed tithi name."] }
    ],
    faqs: [
      { question: "Is tithi the same everywhere in India?", answer: "The astronomical tithi is global at a given instant, but the tithi assigned to a local Panchang day and festival observance can depend on local sunrise and regional rules." },
      { question: "Why can a tithi span two dates?", answer: "A tithi can begin or end at any time of day and may cross local midnight or sunrise." },
      { question: "Can I use this Panchang calculator in India?", answer: "Yes, supported Indian cities use Asia/Kolkata for local time display. It is an astronomical reference, not a replacement for a regional official almanac." }
    ],
    toolLinks: [{ label: "Hindu Panchang Calculator", href: "/tools/nepal-panchang-calculator" }, { label: "Janma Kundali / Birth Chart", href: "/tools/nepali-janma-kundali" }]
  },
  {
    slug: "janam-kundli-kaise-padhe-lagna-rashi-nakshatra-hindi",
    title: "जन्म कुंडली कैसे पढ़ें? लग्न, राशि, नक्षत्र और महादशा की जानकारी",
    description: "जन्म कुंडली के लग्न, चंद्र राशि, नक्षत्र, भाव और विंशोत्तरी महादशा को सरल हिंदी में समझें। जन्म समय और स्थान की शुद्धता क्यों जरूरी है, जानें।",
    keyword: "जन्म कुंडली ऑनलाइन, जन्म कुंडली कैसे देखें, लग्न राशि नक्षत्र, हिंदी कुंडली, janam kundli",
    updated: "2026-11-02",
    readTime: "6 min read",
    intro: "जन्म कुंडली एक पारंपरिक वैदिक ज्योतिषीय चार्ट है, जिसे जन्म तिथि, जन्म के स्थानीय समय और जन्म स्थान के आधार पर बनाया जाता है। सही समय क्षेत्र और स्थान के निर्देशांक जरूरी हैं। ज्योतिष की व्याख्याएं पारंपरिक मान्यताओं पर आधारित हैं; इन्हें वैज्ञानिक रूप से प्रमाणित भविष्यवाणी नहीं माना जाना चाहिए।",
    sections: [
      { heading: "1. जन्म तिथि, समय और स्थान सही भरें", paragraphs: ["जन्म प्रमाण या परिवार के विश्वसनीय रिकॉर्ड में दिया गया समय भरें और वास्तविक जन्म स्थान चुनें। भारत के लिए Asia/Kolkata और नेपाल के लिए Asia/Kathmandu समय क्षेत्र है; दोनों में 15 मिनट का अंतर है। भारतीय जन्म के लिए नेपाल का समय क्षेत्र न चुनें।", "शहर के केंद्र के निर्देशांक अनुमानित होते हैं। गांव या शहर से दूर जन्म स्थान के लिए सही अक्षांश, देशांतर और IANA समय क्षेत्र दें।"] },
      { heading: "2. लग्न और चंद्र राशि में अंतर", paragraphs: ["लग्न वह राशि है जो जन्म के समय पूर्वी क्षितिज पर उदित हो रही होती है। सामान्य भारतीय प्रयोग में राशि अक्सर चंद्र राशि को कहा जाता है। लग्न और चंद्र राशि अलग-अलग ज्योतिषीय संकेत हैं।"] },
      { heading: "3. नक्षत्र और चरण", paragraphs: ["निरयन राशि चक्र को सामान्यतः 27 नक्षत्रों में बांटा जाता है। प्रत्येक नक्षत्र 13 डिग्री 20 मिनट का होता है और उसके चार चरण होते हैं। अयनांश या जन्म समय में छोटा अंतर भी सीमा के पास परिणाम बदल सकता है।"] },
      { heading: "4. विंशोत्तरी महादशा", paragraphs: ["विंशोत्तरी दशा पारंपरिक 120-वर्षीय ग्रह अवधि प्रणाली है। जन्म के समय चंद्रमा जिस नक्षत्र में होता है, उससे पहली महादशा और उसका शेष भाग निकाला जाता है। अलग गणना परंपराओं में दशा की तारीखें अलग हो सकती हैं।"] },
      { heading: "5. ऑनलाइन कुंडली की तुलना कैसे करें", paragraphs: ["दो कुंडलियों की तुलना करते समय जन्म समय, समय क्षेत्र, निर्देशांक, अयनांश, राहु-केतु की गणना और भाव प्रणाली समान रखें। अलग सेटिंग होने पर परिणाम भी अलग हो सकते हैं।", "कुंडली को चिकित्सा, कानूनी, वित्तीय या अन्य पेशेवर सलाह का विकल्प न बनाएं।"] }
    ],
    faqs: [
      { question: "क्या भारत में जन्मे व्यक्ति की कुंडली बना सकते हैं?", answer: "हां। समर्थित भारतीय शहर चुनें या सही निर्देशांक और Asia/Kolkata समय क्षेत्र के साथ अपना स्थान भरें।" },
      { question: "लग्न और राशि में क्या अंतर है?", answer: "लग्न जन्म समय पर पूर्वी क्षितिज पर उदित राशि है। आम उपयोग में राशि से चंद्र राशि का अर्थ लिया जाता है।" },
      { question: "क्या जन्म समय गलत होने से कुंडली बदलती है?", answer: "हां। विशेषकर राशि सीमा के पास लग्न और भाव बदल सकते हैं।" }
    ],
    toolLinks: [{ label: "ऑनलाइन जन्म कुंडली", href: "/tools/nepali-janma-kundali" }, { label: "हिंदू पंचांग कैलकुलेटर", href: "/tools/nepal-panchang-calculator" }]
  },
  {
    slug: "aaj-ka-panchang-tithi-nakshatra-yoga-karana-hindi-guide",
    title: "आज का पंचांग: तिथि, नक्षत्र, योग और करण क्या होते हैं?",
    description: "हिंदू पंचांग के पांच अंगों, तिथि, नक्षत्र, योग, करण और स्थानीय सूर्योदय का महत्व सरल हिंदी में समझें।",
    keyword: "आज का पंचांग, आज की तिथि, आज का नक्षत्र, हिंदी पंचांग, तिथि कैलकुलेटर",
    updated: "2026-11-02",
    readTime: "5 min read",
    intro: "हिंदू पंचांग एक पारंपरिक चंद्र-सौर कैलेंडर है। इसके पांच मुख्य अंग तिथि, वार, नक्षत्र, योग और करण हैं। किसी दिन का पंचांग स्थानीय सूर्योदय, स्थान और क्षेत्रीय परंपरा के अनुसार समझा जाता है।",
    sections: [
      { heading: "तिथि क्या होती है?", paragraphs: ["तिथि सूर्य और चंद्रमा के बीच कोणीय दूरी पर आधारित होती है। एक चंद्र मास में शुक्ल पक्ष की 15 और कृष्ण पक्ष की 15 तिथियां होती हैं। तिथि आधी रात को ही शुरू या समाप्त नहीं होती; इसका समय दिन में कभी भी बदल सकता है।"] },
      { heading: "नक्षत्र, योग और करण", paragraphs: ["नक्षत्र निरयन राशि चक्र में चंद्रमा की स्थिति बताता है। योग सूर्य और चंद्रमा की संयुक्त निरयन स्थिति से निकाला जाता है। करण आधी तिथि के बराबर होता है।"] },
      { heading: "स्थान और सूर्योदय क्यों जरूरी हैं?", paragraphs: ["सूर्योदय और सूर्यास्त अक्षांश, देशांतर, ऊंचाई और तारीख पर निर्भर करते हैं। दिल्ली के पंचांग में काठमांडू का सूर्योदय इस्तेमाल नहीं करना चाहिए। स्थानीय समय क्षेत्र से ही सही घड़ी का समय मिलता है।", "भारत और नेपाल में पंचांग की कई अवधारणाएं समान हैं, लेकिन सभी त्योहारों के लिए सरकारी या क्षेत्रीय पंचांग और पालन नियम एक जैसे हों, यह जरूरी नहीं। महत्वपूर्ण व्रत और पूजा के लिए स्थानीय विश्वसनीय पंचांग देखें।"] },
      { heading: "ऑनलाइन पंचांग की सीमाएं", paragraphs: ["अलग-अलग वेबसाइट अयनांश, खगोलीय डेटा, सूर्योदय की परिभाषा और राउंडिंग में अलग नियम अपना सकती हैं। इसलिए केवल तिथि का नाम नहीं, बल्कि गणना की विधि और स्रोत भी देखें।"] }
    ],
    faqs: [
      { question: "क्या पूरे भारत में तिथि एक ही होती है?", answer: "एक ही क्षण पर खगोलीय तिथि समान होती है, लेकिन स्थानीय पंचांग में दिन की तिथि और त्योहार का पालन सूर्योदय तथा क्षेत्रीय नियमों पर निर्भर कर सकता है।" },
      { question: "तिथि दो तारीखों में क्यों दिख सकती है?", answer: "तिथि किसी भी समय शुरू या समाप्त हो सकती है और स्थानीय मध्यरात्रि या सूर्योदय को पार कर सकती है।" },
      { question: "क्या यह पंचांग कैलकुलेटर भारत में काम करता है?", answer: "हां, उपलब्ध भारतीय शहरों के लिए Asia/Kolkata स्थानीय समय इस्तेमाल होता है। इसे आधिकारिक क्षेत्रीय पंचांग का विकल्प न मानें।" }
    ],
    toolLinks: [{ label: "हिंदू पंचांग कैलकुलेटर", href: "/tools/nepal-panchang-calculator" }, { label: "जन्म कुंडली", href: "/tools/nepali-janma-kundali" }]
  }

  ,
  {
    slug: "nepali-janma-kundali-lagna-rashi-nakshatra-guide",
    title: "जन्मकुण्डली कसरी बनाउने? लग्न, राशि, नक्षत्र र नवांश बुझ्नुहोस्",
    description: "जन्ममिति, सही स्थानीय समय र जन्मस्थानबाट जन्मकुण्डली कसरी बन्छ भन्ने जान्नुहोस्। लग्न, चन्द्र राशि, नक्षत्र, D1, नवांश D9 र विम्शोत्तरी महादशा सरल नेपालीमा बुझ्नुहोस्।",
    keyword: "नेपाली जन्मकुण्डली, जन्मकुण्डली अनलाइन, लग्न राशि नक्षत्र, नवांश कुण्डली, D9",
    updated: "2026-11-02",
    readTime: "7 min read",
    intro: "जन्मकुण्डली परम्परागत वैदिक ज्योतिषमा जन्मको मिति, स्थानीय समय र स्थानका आधारमा तयार गरिने चार्ट हो। जन्मस्थानको सही समय क्षेत्र र निर्देशाङ्क प्रयोग नगर्दा लग्न र भाव फरक पर्न सक्छन्। ज्योतिषीय व्याख्या परम्परागत विश्वासमा आधारित हुन्छ; यसलाई वैज्ञानिक रूपमा प्रमाणित भविष्यवाणी मान्नु हुँदैन।",
    sections: [
      { heading: "जन्ममिति, समय र स्थान किन सही हुनुपर्छ?", paragraphs: ["जन्म अभिलेखमा भएको स्थानीय समय प्रयोग गर्नुहोस्। नेपालका लागि Asia/Kathmandu र भारतका लागि Asia/Kolkata समय क्षेत्र हो; यी दुईमा १५ मिनेटको फरक छ। भारतमा जन्मिएको व्यक्तिको कुण्डली बनाउँदा नेपालकै समय क्षेत्र राख्नु हुँदैन।", "सहरका केन्द्रका निर्देशाङ्क अनुमानित हुन्छन्। गाउँ वा सहरबाहिरको जन्मस्थानका लागि वास्तविक अक्षांश, देशान्तर र सही IANA समय क्षेत्र राख्नु राम्रो हुन्छ।"] },
      { heading: "लग्न र चन्द्र राशि फरक कुरा हुन्", paragraphs: ["जन्मको क्षणमा पूर्वी क्षितिजमा उदाउँदै गरेको राशि लग्न हो। सामान्य प्रयोगमा राशि भन्नाले प्रायः चन्द्र राशि बुझिन्छ। लग्न र चन्द्र राशि एउटै नहुन सक्छन्।"] },
      { heading: "नक्षत्र, पाद र नवांश D9", paragraphs: ["निरयन राशि चक्रलाई २७ नक्षत्रमा विभाजन गरिन्छ। प्रत्येक नक्षत्रका चार पाद हुन्छन्। नवांश D9 मा प्रत्येक राशिलाई नौ बराबर भागमा विभाजन गरी ग्रह र लग्नको नवांश राशि निकालिन्छ। जन्मसमय वा अयनांशको सानो फरकले सीमामा नतिजा बदल्न सक्छ।"] },
      { heading: "विम्शोत्तरी महादशा", paragraphs: ["विम्शोत्तरी दशा परम्परागत १२० वर्षे ग्रह-अवधि प्रणाली हो। जन्मको समयमा चन्द्रमा रहेको नक्षत्रबाट पहिलो महादशा र बाँकी अवधि निकालिन्छ। गणना परम्परा र वर्षको लम्बाइ फरक हुँदा मिति केही फरक आउन सक्छ।"] },
      { heading: "अनलाइन कुण्डली कसरी जाँच्ने?", paragraphs: ["दुई कुण्डली तुलना गर्दा जन्मसमय, समय क्षेत्र, निर्देशाङ्क, अयनांश, राहु-केतुको विधि र भाव प्रणाली समान राख्नुहोस्। यो रिपोर्ट परम्परागत ज्योतिषीय गणना हो, स्वास्थ्य, कानुनी वा वित्तीय सल्लाहको विकल्प होइन।"] }
    ],
    faqs: [
      { question: "के भारतमा जन्मिएको व्यक्तिको पनि कुण्डली बनाउन मिल्छ?", answer: "मिल्छ। उपलब्ध भारतीय सहर छान्नुहोस् वा सही निर्देशाङ्क र Asia/Kolkata समय क्षेत्र राखेर आफ्नै जन्मस्थान प्रविष्ट गर्नुहोस्।" },
      { question: "लग्न र चन्द्र राशिमा के फरक छ?", answer: "लग्न जन्मको समयमा पूर्वी क्षितिजमा उदाएको राशि हो। चन्द्र राशि जन्मको समयमा चन्द्रमा रहेको राशि हो।" },
      { question: "D9 नवांश कुण्डली के हो?", answer: "D9 नवांशमा प्रत्येक निरयन राशिलाई नौ बराबर भागमा बाँडेर ग्रह र लग्नको नवांश स्थिति निकालिन्छ।" }
    ],
    toolLinks: [{ label: "नेपाली जन्मकुण्डली", href: "/tools/nepali-janma-kundali" }, { label: "नेपाल र भारत पञ्चाङ्ग", href: "/tools/nepal-panchang-calculator" }]
  },
  {
    slug: "nepali-hindu-panchang-tithi-nakshatra-guide",
    title: "पञ्चाङ्ग कसरी हेर्ने? तिथि, नक्षत्र, योग, करण र सूर्योदय",
    description: "हिन्दू पञ्चाङ्गका पाँच अङ्ग, तिथि, नक्षत्र, योग, करण र स्थानीय सूर्योदयको अर्थ सरल नेपालीमा बुझ्नुहोस्। नेपाल र भारतको स्थानीय समय किन महत्त्वपूर्ण छ, जान्नुहोस्।",
    keyword: "नेपाली पञ्चाङ्ग, आजको तिथि, आजको नक्षत्र, तिथि गणना, पञ्चाङ्ग क्याल्कुलेटर",
    updated: "2026-11-02",
    readTime: "6 min read",
    intro: "पञ्चाङ्ग परम्परागत चन्द्र-सौर पात्रो हो। यसका पाँच मुख्य अङ्ग तिथि, वार, नक्षत्र, योग र करण हुन्। दैनिक पञ्चाङ्गको व्याख्या स्थानीय सूर्योदय, स्थान र क्षेत्रीय परम्परासँग सम्बन्धित हुन्छ।",
    sections: [
      { heading: "तिथि के हो?", paragraphs: ["तिथि सूर्य र चन्द्रमाबीचको कोणीय दूरीका आधारमा निकालिन्छ। एक चन्द्र महिनामा शुक्ल पक्षका १५ र कृष्ण पक्षका १५ तिथि हुन्छन्। तिथि मध्यरातमा मात्र सुरु वा अन्त्य हुँदैन; दिनको जुनसुकै समयमा परिवर्तन हुन सक्छ।"] },
      { heading: "नक्षत्र, योग र करण", paragraphs: ["नक्षत्रले निरयन राशि चक्रमा चन्द्रमाको स्थिति देखाउँछ। योग सूर्य र चन्द्रमाको संयुक्त निरयन देशान्तरबाट निकालिन्छ। करण आधा तिथिको अवधि हो।"] },
      { heading: "स्थानीय सूर्योदय र समय क्षेत्र", paragraphs: ["सूर्योदय र सूर्यास्त अक्षांश, देशान्तर, उचाइ र मितिअनुसार फरक हुन्छन्। दिल्लीको पञ्चाङ्गमा काठमाडौंको सूर्योदय प्रयोग गर्नु हुँदैन। भारतका लागि Asia/Kolkata र नेपालका लागि Asia/Kathmandu समय क्षेत्र प्रयोग गर्नुपर्छ।", "नेपाल र भारतमा धेरै पञ्चाङ्ग अवधारणा समान भए पनि सबै पर्व, व्रत र पूजाका क्षेत्रीय नियम समान नहुन सक्छन्। महत्त्वपूर्ण धार्मिक observance का लागि स्थानीय विश्वसनीय पञ्चाङ्गसँग पुष्टि गर्नुहोस्।"] },
      { heading: "अनलाइन पञ्चाङ्गका सीमाहरू", paragraphs: ["वेबसाइटअनुसार खगोलीय ephemeris, अयनांश, सूर्योदयको परिभाषा र rounding फरक हुन सक्छ। त्यसैले तिथि नाम मात्र होइन, गणना विधि र स्थान पनि जाँच्नुहोस्।"] }
    ],
    faqs: [
      { question: "के नेपाल र भारतमा एउटै तिथि हुन्छ?", answer: "एउटै क्षणमा खगोलीय तिथि एउटै हुन्छ, तर स्थानीय पञ्चाङ्गको दिन र पर्व पालन सूर्योदय तथा क्षेत्रीय नियमअनुसार फरक हुन सक्छ।" },
      { question: "तिथि दुई दिनमा किन देखिन्छ?", answer: "तिथि कुनै पनि समयमा सुरु वा अन्त्य हुन सक्छ र मध्यरात वा सूर्योदय पार गर्न सक्छ।" },
      { question: "के पञ्चाङ्ग क्याल्कुलेटर भारतमा पनि चल्छ?", answer: "चल्छ। उपलब्ध भारतीय सहरका लागि Asia/Kolkata स्थानीय समय प्रयोग हुन्छ। यसलाई आधिकारिक क्षेत्रीय पञ्चाङ्गको विकल्प नमान्नुहोस्।" }
    ],
    toolLinks: [{ label: "नेपाल र भारत पञ्चाङ्ग", href: "/tools/nepal-panchang-calculator" }, { label: "नेपाली जन्मकुण्डली", href: "/tools/nepali-janma-kundali" }]
  }
];