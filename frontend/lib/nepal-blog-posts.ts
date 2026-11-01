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
      { heading: "How to convert a Nepali date to an English date", bullets: ["Open the NIROJ Tools Nepali Date Converter.", "Choose Nepali (BS) to English (AD).", "Enter the date in year-month-day order, for example 2083-01-01.", "Select Convert and review the Gregorian date and weekday.", "Copy the result only after checking that the original date was entered correctly."], paragraphs: ["The converter uses calendar data with a defined supported range. It rejects dates outside that range instead of guessing."] },
      { heading: "How to convert AD to BS", paragraphs: ["Choose English (AD) to Nepali (BS), enter a valid Gregorian date such as 2026-04-14 and convert it. The result includes the BS year, month and day. You can also view the result using Nepali digits.", "Use the date printed on the original document. Do not assume the date shown by a device is the same as the date printed on a certificate if the document was issued in a different time zone or calendar."] },
      { heading: "Common mistakes to avoid", bullets: ["Do not convert by subtracting a fixed 56 or 57 years.", "Check whether the input is BS or AD before converting.", "Use year-month-day order to avoid swapping month and day.", "Check the supported year range before converting old historical dates.", "For official forms, compare the result with the source certificate or an authoritative Nepali calendar."] }
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
      { heading: "What the Nepali calendar shows", paragraphs: ["The Bikram Sambat calendar has twelve months, from Baisakh through Chaitra. Month lengths are not identical to Gregorian months, so a fixed year offset cannot convert a date accurately.", "The NIROJ Tools calendar pairs each BS day with its Gregorian date and weekday. It currently does not label public holidays, tithi or festivals."] },
      { heading: "How to view a BS month", bullets: ["Open the Nepali Calendar tool.", "Enter a BS year within the supported range.", "Choose the month.", "Select Show Calendar to see matching AD dates and weekdays.", "For official holidays, compare the result with the current government holiday notice."] },
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
      { heading: "How to use the calculator", bullets: ["Enter each subject name.", "Enter the subject credit hours from the official course structure or grade sheet.", "Choose the grade point shown on your result.", "Add or remove subject rows as needed.", "Compare the estimate with your official transcript."] },
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
      { heading: "How to reduce a photo file size", bullets: ["Open the Loksewa and Online Form Photo Resizer.", "Choose the original image.", "Select a file-size target such as 50 KB or 200 KB.", "Choose a maximum image dimension and resize.", "Check the downloaded image against the vacancy or application notice."] },
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
      { heading: "How to use the calculator", bullets: ["Enter share quantity and purchase price.", "Enter the expected selling price.", "Enter current broker commission and SEBON rates.", "Enter applicable DP charge and CGT assumption.", "Review estimated purchase cost and net profit."] },
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
      { heading: "Convert digits in a sentence", bullets: ["Paste a number or sentence into the Nepali Unicode Digit Converter.", "Copy the Nepali-digit output for a Nepali document.", "Switch back to English digits when a system requires ASCII numerals."] }
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
      { heading: "How to convert Preeti to Unicode", bullets: ["Copy text from the old Preeti document.", "Open the Preeti ↔ Nepali Unicode Converter.", "Choose Preeti to Unicode.", "Paste the Preeti-encoded text and convert.", "Review the output carefully, especially punctuation, names and mixed English/Nepali text."] },
      { heading: "Convert Unicode back to Preeti", paragraphs: ["Choose Unicode Nepali to Preeti, paste the Unicode text and convert. The resulting encoded text should be placed in a document using the Preeti font to display as intended.", "Keep a copy of the original document. Different legacy fonts use different mappings, so text typed in Kantipur, PCS Nepali or another font may not convert correctly using a Preeti-only converter."] }
    ],
    faqs: [
      { question: "Does Preeti text equal Unicode Nepali?", answer: "No. Preeti is a legacy font encoding; Unicode stores Devanagari characters directly." },
      { question: "Can this convert Kantipur or PCS Nepali?", answer: "This tool targets Preeti. Other legacy fonts may use different character maps." },
      { question: "Should I check the converted text?", answer: "Yes. Review names, punctuation and mixed English/Nepali passages before using the result in an official document." }
    ],
    toolLinks: [{ label: "Preeti Unicode Converter", href: "/tools/preeti-unicode-converter" }, { label: "Nepali Digit Converter", href: "/tools/nepali-digit-converter" }]
  }

];
