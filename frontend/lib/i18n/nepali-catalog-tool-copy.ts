const extraLabels: Record<string, Record<string, string>> = {
  "password-generator": { len: "पासवर्डको लम्बाइ (८–१२८)", count: "कति वटा पासवर्ड बनाउने (१–१०)" },
  "xml-formatter-validator": { text: "XML कोड" },
  "url-query-parser": { text: "पूरा URL" },
  "html-encoder-decoder": { text: "HTML वा साधारण पाठ", mode: "कार्य (encode वा decode)" },
  "regex-tester": { pattern: "Regular expression", flags: "Flags (g, i, m)", text: "परीक्षण गर्ने पाठ" },
  "jwt-decoder": { text: "JWT टोकन" },
  "color-contrast-checker": { fg: "अक्षरको रङ", bg: "पृष्ठभूमिको रङ" },
  "css-minifier": { text: "CSS कोड" },
  "json-to-csv": { text: "JSON object array" },
  "meta-title-checker": { text: "पृष्ठको शीर्षक" },
  "meta-description-checker": { text: "Meta description" },
  "keyword-density-checker": { text: "पृष्ठको सामग्री", keyword: "लक्षित keyword" },
  "robots-txt-generator": { site: "Sitemap URL (वैकल्पिक)", path: "रोक्ने path (वैकल्पिक)" },
  "sitemap-generator": { text: "प्रत्येक लाइनमा एउटा पूर्ण URL" },
  "open-graph-preview": { title: "पृष्ठको शीर्षक", description: "विवरण", image: "तस्बिर URL", url: "पृष्ठ URL" },
  "savings-goal-calculator": { target: "लक्ष्य बचत रकम", saved: "अहिलेसम्म बचत भएको रकम", months: "लक्ष्य पूरा गर्ने महिना" },
};
const quickLabels: Record<string, string> = {
  text: "पाठ वा इनपुट", wpm: "पढ्ने गति (शब्द/मिनेट)", find: "खोज्नुपर्ने पाठ", replace: "यसले बदल्ने पाठ",
  mode: "रूपान्तरणको प्रकार", weight: "तौल (किलो)", height: "उचाइ (सेमी)", age: "उमेर (वर्ष)", sex: "लिङ्ग",
  bill: "बिल रकम", tip: "टिप (%)", people: "व्यक्तिको संख्या", extra: "थप रकम", principal: "मूलधन",
  rate: "दर (%)", years: "वर्ष", sales: "बिक्री रकम", wage: "प्रति घण्टा ज्याला", hours: "हप्ताको घण्टा",
  value: "मान", a: "पहिलो मान", b: "दोस्रो मान", n: "पूर्णांक", min: "न्यूनतम", max: "अधिकतम",
  count: "संख्या", date: "सुरुको मिति", days: "थप्ने वा घटाउने दिन", start: "सुरु मिति", end: "अन्तिम मिति",
  root: "Root font size (px)", width: "चौडाइ (px)", angle: "कोण (डिग्री)",
};
const commonReplacements: [string, string][] = [
  ["No repeated value", "दोहोरिएको मान छैन"], ["No query parameters found.", "URL मा query parameter भेटिएन।"],
  ["No matches found.", "कुनै मिल्दो नतिजा भेटिएन।"], ["No words found.", "कुनै शब्द भेटिएन।"],
  ["No email addresses found.", "कुनै इमेल ठेगाना भेटिएन।"], ["No URLs found.", "कुनै URL भेटिएन।"],
  ["No phone-like numbers found.", "फोन नम्बरजस्तो मान भेटिएन।"], ["No numbers found.", "कुनै संख्या भेटिएन।"],
  ["No hashtags found.", "कुनै hashtag भेटिएन।"], ["Palindrome", "पालिन्ड्रोम हो"], ["Not a palindrome", "पालिन्ड्रोम होइन"],
  ["Characters: ", "अक्षर संख्या: "], ["Within a common 30–60 character review range; Google may display a different title.", "३०–६० अक्षरको सामान्य समीक्षा दायराभित्र छ; Google ले फरक शीर्षक देखाउन सक्छ।"],
  ["Review the title for clarity and usefulness. Character count is not a Google ranking rule.", "शीर्षक स्पष्ट र उपयोगी छ कि समीक्षा गर्नुहोस्। अक्षर संख्या Google को ranking नियम होइन।"],
  ["Within a practical 120–160 character review range; Google may generate a different snippet.", "१२०–१६० अक्षरको व्यावहारिक समीक्षा दायराभित्र छ; Google ले फरक snippet बनाउन सक्छ।"],
  ["Review the description for clarity and usefulness. There is no fixed Google character limit.", "विवरण स्पष्ट र उपयोगी छ कि समीक्षा गर्नुहोस्। Google ले तोकेको निश्चित अक्षर सीमा छैन।"],
  ["Use keywords naturally; no universal ideal density exists.", "Keyword स्वाभाविक रूपमा प्रयोग गर्नुहोस्; सबैका लागि एउटै आदर्श density हुँदैन।"],
  ["Rolls: ", "पासाको नतिजा: "], ["Total: ", "जम्मा: "], ["Valid URL", "मान्य URL"], ["Protocol: ", "Protocol: "], ["Host: ", "Host: "], ["Path: ", "Path: "], ["Query: ", "Query: "],
  ["Before tax: ", "करअघिको रकम: "], ["Total including tax: ", "करसहितको जम्मा: "], ["Tax amount: ", "कर रकम: "],
  ["Gross monthly: ", "कर कट्टीअघिको मासिक तलब: "], ["Estimated deduction: ", "अनुमानित कट्टी: "],
  ["Estimated monthly: ", "अनुमानित मासिक: "], ["Estimated annual: ", "अनुमानित वार्षिक: "],
  ["This local check does not test breached-password databases.", "यो स्थानीय जाँचले चोरी/फुटेका पासवर्डको database जाँच्दैन।"],
  ["Adult screening category: ", "वयस्कका लागि सामान्य BMI श्रेणी: "], ["BMI is not a diagnosis.", "BMI आफैंमा चिकित्सकीय निदान होइन।"],
  ["Count: ", "जम्मा संख्या: "], ["Mean: ", "औसत: "], ["Median: ", "मध्यिका: "], ["Mode: ", "बहुलक: "],
  ["Range: ", "दायरा: "], ["Words: ", "शब्द: "], ["Characters: ", "अक्षर: "], ["Sentences: ", "वाक्य: "],
  ["Paragraphs: ", "अनुच्छेद: "], ["Estimated reading time: ", "अनुमानित पढ्ने समय: "],
  ["Total lines: ", "जम्मा लाइन: "], ["Non-empty: ", "खाली नभएका: "], ["Unique: ", "फरक लाइन: "],
  ["Word count: ", "शब्द संख्या: "], ["Keyword occurrences: ", "Keyword भेटिएको पटक: "],
  ["Approximate density: ", "अनुमानित घनत्व: "], ["Remaining amount: ", "बाँकी रकम: "],
  ["Monthly savings needed: ", "हरेक महिना बचत गर्नुपर्ने रकम: "],
  ["Contrast ratio: ", "रङ कन्ट्रास्ट अनुपात: "], ["WCAG AA normal text (4.5:1): ", "WCAG AA सामान्य अक्षर (४.५:१): "],
  ["WCAG AA large text (3:1): ", "WCAG AA ठूला अक्षर (३:१): "], ["WCAG AAA normal text (7:1): ", "WCAG AAA सामान्य अक्षर (७:१): "],
  ["PASS", "उत्तीर्ण"], ["FAIL", "अनुत्तीर्ण"], ["Match: ", "मिलेको अंश: "], [" at index ", " — स्थान "],
  ["Header:\n", "Header (शीर्ष जानकारी):\n"], ["Payload:\n", "Payload (डाटा):\n"],
  ["Decoding does not verify the signature.", "यो decode मात्र हो; token को signature प्रमाणित गर्दैन।"],
  ["UTC: ", "UTC समय: "], ["Local: ", "स्थानीय समय: "], ["Weekdays (inclusive): ", "सुरु र अन्त्य दुवै समेटिएका कार्यदिन: "],
  ["Public holidays are not excluded.", "सार्वजनिक बिदा घटाइएको छैन।"], ["Aspect ratio: ", "आस्पेक्ट रेसियो: "],
  ["Decimal: ", "दशमलव अनुपात: "], ["HEX: ", "HEX: "], ["RGB: ", "RGB: "], ["HSL: ", "HSL: "],
  ["Selling price: ", "बिक्री मूल्य: "], ["Markup amount: ", "Markup रकम: "], ["Gross profit: ", "कुल नाफा: "],
  ["Profit margin: ", "नाफा मार्जिन: "], ["Break-even units: ", "लागत बराबर हुने बिक्री संख्या: "],
  ["Break-even revenue: ", "लागत बराबर हुने बिक्री रकम: "], ["Simple interest: ", "साधारण ब्याज: "],
  ["Total amount: ", "कुल रकम: "], ["Commission: ", "कमिसन: "], ["Weekly: ", "साप्ताहिक: "],
  ["Monthly average: ", "मासिक औसत: "], ["Annual: ", "वार्षिक: "], ["Estimated BMR: ", "अनुमानित BMR: "],
  ["Estimated future value: ", "अनुमानित भविष्यको मूल्य: "], ["Invested amount: ", "लगानी रकम: "],
  ["Estimated gain: ", "अनुमानित प्रतिफल: "], ["Monthly EMI: ", "मासिक EMI: "],
  ["Total repayment: ", "कुल भुक्तानी: "], ["Total interest: ", "कुल ब्याज: "],
  ["Original price: ", "मूल मूल्य: "], ["Price after discount: ", "छुटपछिको मूल्य: "],
  ["You save: ", "तपाईंको बचत: "], ["Estimated take-home monthly: ", "अनुमानित मासिक हातमा आउने रकम: "],
  ["Estimated take-home annual: ", "अनुमानित वार्षिक हातमा आउने रकम: "],
];
const errorTranslations: [string, string][] = [
  ["Password length must be 8–128 and quantity must be 1–10.", "पासवर्डको लम्बाइ ८–१२८ र संख्या १–१० बीच राख्नुहोस्।"],
  ["A JWT must have three dot-separated parts.", "JWT मा बिन्दुले छुट्याएका तीन भाग हुनुपर्छ।"],
  ["Invalid XML: ", "XML अमान्य छ: "], ["Only HTTP and HTTPS URLs are supported.", "HTTP वा HTTPS URL मात्र मान्य छन्।"],
  ["Enter the text to find.", "खोज्नुपर्ने पाठ लेख्नुहोस्।"], ["Enter a Unix timestamp.", "Unix timestamp लेख्नुहोस्।"],
  ["Enter 8-bit binary bytes separated by spaces.", "space ले छुट्याएका ८-bit binary समूह लेख्नुहोस्।"],
  ["Enter hexadecimal byte pairs, e.g. 48 65 6c 6c 6f.", "दुई-दुई अंकका hexadecimal byte लेख्नुहोस्, जस्तै 48 65 6c 6c 6f।"],
  ["Enter a six-digit HEX colour.", "६ अंकको HEX रङ लेख्नुहोस्।"],
  ["Enter a target keyword.", "लक्षित keyword लेख्नुहोस्।"], ["Enter at least one URL.", "कम्तीमा एउटा URL लेख्नुहोस्।"],
  ["URLs cannot contain control characters.", "URL मा नियन्त्रण अक्षर राख्न मिल्दैन।"], ["Disallow path must start with a single slash.", "Disallow path एउटै slash (/) बाट सुरु हुनुपर्छ।"],
  ["Disallow path cannot contain line breaks.", "Disallow path मा line break राख्न मिल्दैन।"], ["Sitemap URL cannot contain line breaks.", "Sitemap URL मा line break राख्न मिल्दैन।"],
  ["Only HTTP and HTTPS URLs are supported.", "HTTP र HTTPS URL मात्र समर्थित छन्।"],
  ["Enter a valid date.", "मान्य मिति लेख्नुहोस्।"], ["Enter a non-negative bill and at least one person.", "शून्य वा सोभन्दा बढी बिल रकम र कम्तीमा एक व्यक्ति लेख्नुहोस्।"],
  ["Enter whole-number bounds, a range up to 2^32 values, and 1–100 results.", "पूर्णांक सीमा, २³² सम्मको दायरा र १–१०० नतिजा राख्नुहोस्।"],
  ["Enter a whole number of dice from 1 to 100.", "१ देखि १०० सम्मको पूर्णांक पासा संख्या लेख्नुहोस्।"], ["Root font size must be positive.", "Root font size शून्यभन्दा ठूलो हुनुपर्छ।"],
  ["Width and height must be positive.", "चौडाइ र उचाइ शून्यभन्दा ठूलो हुनुपर्छ।"],
  ["Enter an integer from 1 to 3999.", "१ देखि ३९९९ सम्मको पूर्णांक लेख्नुहोस्।"],
  ["Invalid Roman numeral.", "Roman numeral अमान्य छ।"], ["Could not process this input.", "यो इनपुट प्रक्रिया गर्न सकिएन।"],
  ["Tool not implemented.", "यो टुलको कार्यान्वयन उपलब्ध छैन।"], ["Tool configuration missing.", "टुलको configuration भेटिएन।"],
];
export function nepaliExtraFieldLabel(slug: string, key: string, fallback: string): string {
  return extraLabels[slug]?.[key] ?? fallback;
}
export function nepaliQuickFieldLabel(key: string, fallback: string): string {
  return quickLabels[key] ?? fallback;
}
export function localizeNepaliToolOutput(slug: string, output: string): string {
  const codeOrData = new Set(["json-to-csv", "csv-to-json", "json-to-yaml", "xml-formatter-validator", "css-minifier", "robots-txt-generator", "sitemap-generator", "open-graph-preview", "json-formatter-validator", "base64-encoder-decoder", "url-encoder-decoder", "hash-generator", "html-encoder-decoder"]);
  if (codeOrData.has(slug)) return output;
  return commonReplacements.reduce((value, [from, to]) => value.replaceAll(from, to), output);
}
export function localizeNepaliToolError(message: string): string {
  for (const [from, to] of errorTranslations) if (message.includes(from)) return message.replace(from, to);
  return message;
}
