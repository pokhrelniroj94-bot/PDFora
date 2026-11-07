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
    toolLinks: [{ label: "Nepali Date Converter", href: "/tools/nepali-date-converter" }, { label: "Date Difference Calculator", href: "/tools/date-difference-calculator" }, { label: "Age Calculator", href: "/tools/age-calculator" }],
    sources: [{ label: "Nepal Panchanga Nirnayak Development Committee", url: "https://www.npns.gov.np/" }, { label: "Kathmandu Metropolitan City: BS / AD calendar", url: "https://kathmandu.gov.np/en/calendar" }]
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
    toolLinks: [{ label: "Nepal VAT Calculator", href: "/tools/nepali-vat-calculator" }, { label: "Percentage Calculator", href: "/tools/percentage-of-number-calculator" }, { label: "Discount Calculator", href: "/tools/discount-percentage-calculator" }],
    sources: [{ label: "Inland Revenue Department: VAT calculation FAQ", url: "https://ird.gov.np/faq/?gid=98" }, { label: "Inland Revenue Department: Acts and tax laws", url: "https://ird.gov.np/category/acts/" }]
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
    toolLinks: [{ label: "Tola to Gram Converter", href: "/tools/gold-tola-gram-converter" }],
    sources: [{ label: "Department of Industry: Standard Measurement and Weight Act schedule", url: "https://doind.gov.np/uploads/notices/Notices-2023101619250565.pdf" }]
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
    toolLinks: [{ label: "Nepali Calendar", href: "/tools/nepali-calendar" }, { label: "BS to AD Date Converter", href: "/tools/nepali-date-converter" }],
    sources: [{ label: "Nepal Panchanga Nirnayak Development Committee", url: "https://www.npns.gov.np/" }, { label: "Ministry of Home Affairs: Government and public holidays in 2083", url: "https://moha.gov.np/en/page/government-and-public-holidays-in-2083" }]
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
    toolLinks: [{ label: "NEB GPA Calculator", href: "/tools/neb-gpa-calculator" }, { label: "Percentage Calculator", href: "/tools/percentage-of-number-calculator" }],
    sources: [{ label: "National Examinations Board: Letter grading and assessment notice", url: "https://neb.gov.np/neb-notice-file/Notices-202509271000503094.pdf" }]
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
    toolLinks: [{ label: "NEPSE Share Calculator", href: "/tools/nepal-share-calculator" }, { label: "Percentage Calculator", href: "/tools/percentage-of-number-calculator" }],
    sources: [{ label: "Nepal Stock Exchange: Official stock-wise prices", url: "https://www.nepalstock.com/stockWisePrices" }]
  },
  {
    slug: "english-to-nepali-digits-converter-guide", title: "English to Nepali Numbers: Convert 123 into १२३",
    description: "Convert English digits to Nepali Devanagari digits and back while keeping the rest of your text unchanged.", keyword: "English to Nepali digits converter", updated: "2026-11-01", readTime: "3 min read",
    intro: "Nepali documents and messages often use Devanagari digits, while websites, spreadsheets and international forms may use English digits. A digit converter makes it easy to switch the number characters.",
    sections: [
      { heading: "Nepali and English digit mapping", paragraphs: ["The digits map one-to-one: 0 = ०, 1 = १, 2 = २, 3 = ३, 4 = ४, 5 = ५, 6 = ६, 7 = ७, 8 = ८ and 9 = ९.", "Only digits change. Letters, spaces, punctuation and other text remain unchanged."] },
      { heading: "Convert digits in a sentence", paragraphs: [], bullets: ["Paste a number or sentence into the Nepali Unicode Digit Converter.", "Copy the Nepali-digit output for a Nepali document.", "Switch back to English digits when a system requires ASCII numerals."] },
      { heading: "Where should you use Nepali digits?", paragraphs: ["Devanagari digits can make Nepali-language notices, letters and local records easier to read. However, online forms, bank systems, spreadsheets and international services may require standard ASCII digits (0–9). Follow the receiving system’s instructions instead of assuming one format works everywhere."] }
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
    title: "How to Check Your Nepal Electricity Bill: Official ERC Calculator and 2083 Tariff",
    description: "Learn which meter details to prepare, how to use the official ERC electricity calculator and where to verify Nepal's current tariff.",
    keyword: "official ERC electricity bill calculator Nepal",
    updated: "2026-11-07",
    readTime: "6 min read",
    intro: "A Nepal electricity bill depends on the applicable consumer category, connection details, units consumed during the billing period and the tariff schedule in force. The Electricity Regulatory Commission issued a new tariff directive in 2083. Because rates and categories can change, this guide points readers to the live official calculator instead of repeating a fixed rate table that may become outdated.",
    sections: [
      { heading: "Why a static electricity-bill estimate can mislead", paragraphs: ["A reliable bill check needs the correct consumer category, connection and fuse capacity, billing period, meter reading and applicable tariff options. Minimum charges, taxes, adjustments, arrears or later tariff changes can affect the final amount.", "A simple online formula that hard-codes old unit rates can give a confident-looking but incorrect result. PDFora therefore does not calculate a bill from fixed tariff assumptions; it links to the current ERC calculator and official notice."] },
      { heading: "Prepare the details from your NEA bill", paragraphs: [], bullets: ["Find the consumer category and connection details on your latest bill.", "Note the meter or fuse capacity shown for your account.", "Use the units (kWh) and exact billing period from the meter reading, not an approximate daily average.", "Keep any previous balance, adjustment or late-fee line visible so you do not confuse it with the current-period energy charge."] },
      { heading: "Use the official ERC electricity calculator", paragraphs: [], bullets: ["Open the Electricity Regulatory Commission calculator linked below.", "Choose the matching consumer category, connection and fuse capacity.", "Enter the units consumed for the billing period and select the tariff options requested by the official tool.", "Review the result, then confirm that the category and period match your NEA bill.", "Read the 2083 tariff directive if you need to understand the applicable schedule."] },
      { heading: "Compare the result with your actual NEA bill", paragraphs: ["The official calculator result is only as accurate as the details entered. Your issued bill may also show arrears, meter-reading adjustments, service charges or other account-specific items. If the amount differs, check the reading dates and contact NEA or the relevant service centre rather than changing tariff assumptions yourself."] }
    ],
    faqs: [
      { question: "Does PDFora calculate my electricity bill?", answer: "No. PDFora links to the live official ERC calculator and does not display an estimate based on hard-coded tariff rates." },
      { question: "Which details should I enter?", answer: "Use the consumer category, connection or fuse capacity and kWh consumption shown for your account. Follow the fields requested by the official ERC calculator." },
      { question: "Why might the calculator result differ from my NEA bill?", answer: "The billing period, meter reading, arrears, adjustments, account category or tariff changes may differ from the details entered." },
      { question: "Where can I verify the current tariff?", answer: "Check the ERC electricity calculator and its 2083 tariff directive, then compare the account details with your NEA bill." }
    ],
    toolLinks: [{ label: "Open the official ERC electricity bill calculator", href: "/tools/nepal-electricity-bill-calculator" }],
    sources: [
      { label: "Electricity Regulatory Commission official bill calculator", url: "https://www.erc.gov.np/electricity-calculator" },
      { label: "ERC 2083 electricity tariff directive", url: "https://www.erc.gov.np/detail/314" },
      { label: "NEA consumer tariff information", url: "https://www.nea.org.np/en/pages/consumer-tariff-rates" }
    ],
  },
  {
    slug: "nepal-public-holidays-2083-calendar-guide",
    title: "Nepal Government Public Holidays 2083: Full Calendar and Regional Notes",
    description: "Search the 2083 BS public holiday list with AD dates, national holidays and community-specific observances.",
    keyword: "Nepal public holidays 2083",
    updated: "2026-11-07",
    readTime: "6 min read",
    intro: "Nepal's public holiday notice includes national holidays as well as dates that apply only to particular regions, communities or groups. The Ministry of Home Affairs source page shows its 2083 notice was displays “Last Updated: 2083-07-20 15:42:42”. This guide is a searchable transcription of that notice, not a live feed; later amendments may change details. Checking the scope of a holiday matters when planning government visits, school work, travel or business deadlines.",
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
  }
];
