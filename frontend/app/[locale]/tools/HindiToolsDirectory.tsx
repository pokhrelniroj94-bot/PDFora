import Link from "next/link";
import { notFound } from "next/navigation";
import { hindiMathToolSlugs } from "../../../lib/i18n/hindi-math-tools";
import { hindiBusinessToolSlugs } from "../../../lib/i18n/hindi-business-tools";
import { buildLocaleMetadata } from "../../../lib/i18n/metadata";
import type { Metadata } from "next";
import { nepaliPdfRoutes } from "../../../lib/i18n/nepali-pdf-routes";
import { hindiToolNames } from "../../../lib/i18n/pdf-tool-names-hi";

const entries: Record<string,string> = {
"qr-code-generator":"QR कोड जनरेटर",
"percentage-change-calculator":"प्रतिशत परिवर्तन कैलकुलेटर","average-calculator":"औसत कैलकुलेटर","ratio-simplifier":"अनुपात सरल करें","fraction-calculator":"भिन्न कैलकुलेटर","percentage-of-number-calculator":"संख्या का प्रतिशत","gcd-lcm-calculator":"GCD और LCM कैलकुलेटर","prime-number-checker":"अभाज्य संख्या जाँच","unit-converter":"इकाई परिवर्तक","bmi-calculator":"BMI कैलकुलेटर","bmr-calculator":"BMR कैलकुलेटर","tip-calculator":"टिप कैलकुलेटर","split-bill-calculator":"बिल बाँटें","simple-interest-calculator":"साधारण ब्याज कैलकुलेटर",
"profit-margin-calculator":"लाभ मार्जिन कैलकुलेटर","markup-calculator":"मार्कअप कैलकुलेटर","break-even-calculator":"ब्रेक-ईवन कैलकुलेटर","sales-tax-calculator":"बिक्री कर कैलकुलेटर","salary-breakdown-calculator":"वेतन विवरण कैलकुलेटर","commission-calculator":"कमीशन कैलकुलेटर","hourly-to-salary-calculator":"प्रति घंटा वेतन कैलकुलेटर",
"age-calculator":"आयु कैलकुलेटर","date-difference-calculator":"तारीख अंतर कैलकुलेटर","time-duration-calculator":"समय अवधि कैलकुलेटर",
"loan-emi-calculator":"ऋण EMI कैलकुलेटर","compound-interest-sip-calculator":"चक्रवृद्धि ब्याज और SIP","discount-percentage-calculator":"छूट प्रतिशत कैलकुलेटर","savings-goal-calculator":"बचत लक्ष्य कैलकुलेटर",
"nepali-vat-calculator":"नेपाल VAT कैलकुलेटर","nepal-land-area-converter":"नेपाल भूमि क्षेत्रफल परिवर्तक","gold-tola-gram-converter":"तोला और ग्राम परिवर्तक","nepal-phone-validator":"नेपाल मोबाइल नंबर जाँच","neb-gpa-calculator":"NEB GPA कैलकुलेटर","nepal-share-calculator":"NEPSE शेयर लाभ / हानि",
"word-character-counter":"शब्द और अक्षर गणक","case-converter":"अक्षर शैली बदलें","remove-duplicate-lines":"दोहराई पंक्तियाँ हटाएँ","sort-lines":"पंक्तियाँ क्रमबद्ध करें","reverse-text":"टेक्स्ट उलटें","whitespace-cleaner":"खाली स्थान साफ़ करें","character-frequency":"अक्षर आवृत्ति","word-frequency-counter":"शब्द आवृत्ति","reading-time-calculator":"पढ़ने का समय","line-counter":"पंक्ति गणक","sentence-counter":"वाक्य गणक","email-extractor":"ईमेल निकालें","url-extractor":"URL निकालें","phone-number-extractor":"फोन नंबर निकालें","number-extractor":"संख्याएँ निकालें","hashtag-extractor":"हैशटैग निकालें","remove-duplicate-words":"दोहराए शब्द हटाएँ","find-replace-text":"खोजें और बदलें","palindrome-checker":"Palindrome जाँच","acronym-generator":"संक्षिप्त नाम बनाएँ",
"json-formatter-validator":"JSON फ़ॉर्मेटर और वैलिडेटर","base64-encoder-decoder":"Base64 एन्कोडर / डिकोडर","url-encoder-decoder":"URL एन्कोडर / डिकोडर","hash-generator":"हैश जनरेटर","text-diff-checker":"टेक्स्ट तुलना","lorem-ipsum-generator":"Lorem Ipsum जनरेटर","html-encoder-decoder":"HTML एन्कोडर / डिकोडर","text-to-slug":"टेक्स्ट से URL Slug","image-compressor":"इमेज कंप्रेसर","image-format-converter":"इमेज फ़ॉर्मेट कनवर्टर","image-dpi-calculator":"इमेज DPI कैलकुलेटर"
"resume-builder":"हिंदी रिज़्यूमे बिल्डर",
"currency-converter":"मुद्रा परिवर्तक",
"color-picker-palette":"HEX रंग चुनने का टूल",
"password-generator":"सुरक्षित पासवर्ड जनरेटर",
"uuid-generator":"UUID v4 जनरेटर",
"regex-tester":"Regex जाँच टूल",
"jwt-decoder":"JWT डिकोडर",
"color-contrast-checker":"WCAG रंग कंट्रास्ट जाँच",
"css-minifier":"CSS मिनिफ़ायर",
"json-to-csv":"JSON से CSV कनवर्टर",
"meta-title-checker":"Meta Title लंबाई जाँच",
"meta-description-checker":"Meta Description लंबाई जाँच",
"keyword-density-checker":"कीवर्ड घनत्व कैलकुलेटर",
"robots-txt-generator":"robots.txt जनरेटर",
"sitemap-generator":"XML Sitemap जनरेटर",
"open-graph-preview":"Open Graph पूर्वावलोकन",
"url-query-parser":"URL Query पार्सर",
"xml-formatter-validator":"XML फ़ॉर्मेटर और वैलिडेटर",
"notes-to-pdf":"नोट से PDF",
"text-to-binary":"टेक्स्ट से बाइनरी कनवर्टर",
"binary-to-text":"बाइनरी से टेक्स्ट कनवर्टर",
"text-to-hex":"टेक्स्ट से Hex कनवर्टर",
"hex-to-text":"Hex से टेक्स्ट कनवर्टर",
"morse-code-translator":"Morse Code अनुवादक",
"camel-case-converter":"camelCase कनवर्टर",
"snake-case-converter":"snake_case कनवर्टर",
"kebab-case-converter":"kebab-case कनवर्टर",
"html-tag-stripper":"HTML टैग हटाने का टूल",
"csv-to-json":"CSV से JSON कनवर्टर",
"json-to-yaml":"JSON से YAML कनवर्टर",
"json-escape-unescape":"JSON Escape और Unescape टूल",
"url-validator":"URL वैलिडेटर",
"email-validator":"ईमेल प्रारूप जाँच",
"password-strength-checker":"पासवर्ड मज़बूती जाँच",
"random-number-generator":"रैंडम नंबर जनरेटर",
"dice-roller":"ऑनलाइन पासा रोलर",
"unix-timestamp-converter":"Unix Timestamp कनवर्टर",
"date-add-subtract-calculator":"तारीख जोड़ें या घटाएँ",
"business-days-calculator":"कार्यदिवस कैलकुलेटर",
"px-rem-converter":"px से rem कनवर्टर",
"aspect-ratio-calculator":"Aspect Ratio कैलकुलेटर",
"color-converter":"HEX RGB HSL रंग कनवर्टर",
"css-gradient-generator":"CSS Gradient जनरेटर",
"roman-numeral-converter":"रोमन अंक कनवर्टर",
"nepali-date-converter":"विक्रम संवत् तारीख परिवर्तक",
"nepali-number-converter":"देवनागरी संख्या प्रारूप परिवर्तक",
"nepali-calendar":"नेपाली कैलेंडर 2083",
"nepali-digit-converter":"देवनागरी अंक परिवर्तक",
"loksewa-photo-resizer":"लोकसेवा फोटो रिसाइज़र",
"preeti-unicode-converter":"Preeti से Unicode कनवर्टर",
"nepal-forex-rates":"नेपाल मुद्रा रूपांतरण कैलकुलेटर",
"nepal-salary-tax-calculator":"नेपाल वेतन और कर अनुमानक",
"nepal-electricity-bill-calculator":"नेपाल बिजली बिल अनुमानक",
"nepal-public-holidays-2083":"नेपाल अवकाश योजना 2083",
"nepali-unicode-typing":"नेपाली Unicode टाइपिंग टूल",
"nepse-market-news":"NEPSE बाजार समाचार फ़ीड",
"nepse-dividend-calculator":"NEPSE लाभांश और बोनस कैलकुलेटर",
"email-signature-generator":"ईमेल हस्ताक्षर जनरेटर",
"timezone-meeting-planner":"समय क्षेत्र बैठक योजनाकार",
"video-bitrate-calculator":"वीडियो बिटरेट कैलकुलेटर",
"markdown-table-generator":"Markdown तालिका जनरेटर",
};
const dates=["age-calculator","date-difference-calculator","time-duration-calculator"];
const finance=["loan-emi-calculator","compound-interest-sip-calculator","discount-percentage-calculator","savings-goal-calculator"];
const nepal=["nepali-vat-calculator","nepal-land-area-converter","gold-tola-gram-converter","nepal-phone-validator","neb-gpa-calculator","nepal-share-calculator"];
const textTools=["word-character-counter","case-converter","remove-duplicate-lines","sort-lines","reverse-text","whitespace-cleaner","character-frequency","word-frequency-counter","reading-time-calculator","line-counter","sentence-counter","email-extractor","url-extractor","phone-number-extractor","number-extractor","hashtag-extractor","remove-duplicate-words","find-replace-text","palindrome-checker","acronym-generator"];
const dev=["json-formatter-validator","base64-encoder-decoder","url-encoder-decoder","hash-generator","text-diff-checker","lorem-ipsum-generator","html-encoder-decoder","text-to-slug"];
const additionalTools=["password-generator","uuid-generator","regex-tester","jwt-decoder","color-picker-palette","color-contrast-checker","css-minifier","meta-title-checker","meta-description-checker","keyword-density-checker","robots-txt-generator","sitemap-generator","open-graph-preview","json-to-csv","url-query-parser","xml-formatter-validator","notes-to-pdf","text-to-binary","binary-to-text","text-to-hex","hex-to-text","morse-code-translator","camel-case-converter","snake-case-converter","kebab-case-converter","html-tag-stripper","csv-to-json","json-to-yaml","json-escape-unescape","url-validator","email-validator","password-strength-checker","random-number-generator","dice-roller","unix-timestamp-converter","date-add-subtract-calculator","business-days-calculator","px-rem-converter","aspect-ratio-calculator","color-converter","css-gradient-generator","roman-numeral-converter","qr-code-generator","nepali-digit-converter","nepali-number-converter","currency-converter","nepse-dividend-calculator","resume-builder","nepali-date-converter","nepali-calendar","loksewa-photo-resizer","preeti-unicode-converter","nepal-forex-rates","nepal-salary-tax-calculator","nepal-electricity-bill-calculator","nepal-public-holidays-2083","nepali-unicode-typing","nepse-market-news"];
const groups=[["गणित कैलकुलेटर",hindiMathToolSlugs],["व्यापार कैलकुलेटर",hindiBusinessToolSlugs],["तारीख और समय",dates],["वित्तीय कैलकुलेटर",finance],["नेपाल उपयोगिता",nepal],["टेक्स्ट टूल",textTools],["डेवलपर टूल",dev],["इमेज टूल",["image-compressor","image-format-converter","image-dpi-calculator"]],["अन्य डेवलपर और उपयोगिता टूल",additionalTools],["उत्पादकता टूल",["email-signature-generator","timezone-meeting-planner","video-bitrate-calculator","markdown-table-generator"]]];
export async function generateMetadata():Promise<Metadata>{return buildLocaleMetadata({locale:"hi",path:"/tools",title:"हिंदी ऑनलाइन टूल और कैलकुलेटर | PDFora",description:"हिंदी में प्रतिशत, गणित, वित्त, तारीख, टेक्स्ट, डेवलपर और नेपाल उपयोगिता टूल इस्तेमाल करें। उपलब्ध टूल का स्पष्ट हिंदी इंटरफ़ेस और ब्राउज़र में गणना।"});}
export default async function HindiToolsDirectory({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;if(locale!=="hi")notFound();
 return <main lang="hi" className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6"><header className="mb-10"><p className="text-sm font-bold text-teal-700">PDFora · हिंदी टूल संग्रह</p><h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">हिंदी में उपलब्ध ऑनलाइन टूल</h1><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">नीचे दिए गए टूल के मुख्य फ़ॉर्म, निर्देश और परिणाम हिंदी में उपलब्ध हैं। जिन टूल का अनुवाद और परीक्षण पूरा नहीं हुआ है, उन्हें इस सूची में शामिल नहीं किया गया है।</p></header><div className="grid gap-9"><section><h2 className="text-xl font-black text-slate-900">हिंदी PDF टूल (49)</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Object.keys(nepaliPdfRoutes).map(slug=><Link key={slug} href={`/hi/${slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 font-bold text-slate-800 hover:border-teal-400">{hindiToolNames[slug]??slug}<span className="mt-2 block text-xs font-semibold text-teal-700">टूल खोलें →</span></Link>)}</div></section>{groups.map(([title,slugs])=><section key={title as string}><h2 className="text-xl font-black text-slate-900">{title as string}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{(slugs as readonly string[]).map(slug=><Link key={slug} href={`/hi/tools/${slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 font-bold text-slate-800 hover:border-teal-400">{entries[slug]??slug}<span className="mt-2 block text-xs font-semibold text-teal-700">टूल खोलें →</span></Link>)}</div></section>)}</div><p className="mt-10 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-7 text-amber-900">यह हिंदी पूर्वावलोकन है। अन्य टूल का अनुवाद पूरा होने और जाँच के बाद ही उन्हें प्रकाशित किया जाएगा।</p></main>;
}
