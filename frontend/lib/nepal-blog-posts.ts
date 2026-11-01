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
];
