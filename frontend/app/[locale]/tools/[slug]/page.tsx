import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ToolWorkspace from "../../../../components/AllTools";
import ResumeBuilder from "../../../../components/ResumeBuilder";
import { isPublished } from "../../../../lib/i18n/config";
import { getTranslator } from "../../../../lib/i18n/messages";
import { buildLocalizedToolMetadata, localizedToolNotFoundMetadata } from "../../../../lib/tools/localized-metadata";
import { fitLocaleDescription } from "../../../../lib/i18n/metadata";
import { resolveLocalizedToolRequest } from "../../../../lib/tools/localized-route";
import NepaliUtilityWorkspace from "../../../../components/NepaliUtilityWorkspace";
import NepaliBrowserOnlyGrowthTools from "../../../../components/NepaliBrowserOnlyGrowthTools";
import NepaliTextUtilityWorkspace from "../../../../components/NepaliTextUtilityWorkspace";
import NepaliExtraTextWorkspace from "../../../../components/NepaliExtraTextWorkspace";
import NepaliMathUtilityWorkspace from "../../../../components/NepaliMathUtilityWorkspace";
import NepaliBusinessCalculatorWorkspace from "../../../../components/NepaliBusinessCalculatorWorkspace";
import NepaliDateTimeWorkspace from "../../../../components/NepaliDateTimeWorkspace";
import NepaliDeveloperTextWorkspace from "../../../../components/NepaliDeveloperTextWorkspace";
import NepaliDataToolsWorkspace from "../../../../components/NepaliDataToolsWorkspace";
import NepaliEncodingCaseWorkspace from "../../../../components/NepaliEncodingCaseWorkspace";
import NepaliNepalToolsWorkspace from "../../../../components/NepaliNepalToolsWorkspace";
import NepalLiveTools from "../../../../components/NepalLiveTools";
import NepaliFinanceCalculatorWorkspace from "../../../../components/NepaliFinanceCalculatorWorkspace";
import NepaliRemainingToolsWorkspace from "../../../../components/NepaliRemainingToolsWorkspace";
import NepaliTypingTool from "../../../../components/NepaliTypingTool";
import { nepaliLocalizedFinancialSlugs, nepaliLocalizedPublicInfoSlugs, nepaliLocalizedUtilitySlugs } from "../../../../lib/i18n/nepali-tool-routes";

type Props = { params: Promise<{ locale: string; slug: string }> };
const nepaliTitles: Record<string, string> = {
  "resume-builder": "व्यावसायिक रिजुमे तथा CV निर्माता",
  "csv-to-json": "CSV बाट JSON",
  "json-to-yaml": "JSON बाट YAML",
  "json-to-csv": "JSON बाट CSV",
  "url-validator": "URL जाँचकर्ता",
  "email-validator": "इमेल जाँचकर्ता",
  "password-strength-checker": "पासवर्ड बल जाँचकर्ता",
  "url-query-parser": "URL Query पार्सर",
  "color-converter": "रङ रूपान्तरण (HEX → RGB/HSL)",
  "aspect-ratio-calculator": "Aspect Ratio क्याल्कुलेटर",
  "css-gradient-generator": "CSS Gradient जेनेरेटर",
  "unix-timestamp-converter": "Unix Timestamp रूपान्तरण",
  "date-add-subtract-calculator": "मिति जोड्ने / घटाउने क्याल्कुलेटर",
  "business-days-calculator": "कार्यदिन क्याल्कुलेटर",
  "random-number-generator": "अनियमित सङ्ख्या जेनेरेटर",
  "dice-roller": "पासा फाल्ने टुल",
  "text-to-binary": "पाठबाट बाइनरी",
  "binary-to-text": "बाइनरीबाट पाठ",
  "text-to-hex": "पाठबाट Hexadecimal",
  "hex-to-text": "Hexadecimal बाट पाठ",
  "morse-code-translator": "मोर्स कोड अनुवादक",
  "camel-case-converter": "camelCase रूपान्तरण",
  "snake-case-converter": "snake_case रूपान्तरण",
  "kebab-case-converter": "kebab-case रूपान्तरण",
  "json-escape-unescape": "JSON Escape / Unescape",
  "px-rem-converter": "px ↔ rem रूपान्तरण",
  "roman-numeral-converter": "रोमन अंक रूपान्तरण",
  "nepali-digit-converter": "नेपाली अंक रूपान्तरण",
  "nepali-number-converter": "नेपाली नम्बर रूपान्तरण",
  "nepali-date-converter": "नेपाली मिति रूपान्तरण",
  "nepal-electricity-bill-calculator": "आधिकारिक विद्युत् बिल क्याल्कुलेटर",
  "nepal-public-holidays-2083": "नेपाल सार्वजनिक बिदा २०८३",
  "nepal-phone-validator": "नेपाल मोबाइल नम्बर जाँच",
  "gold-tola-gram-converter": "तोला र ग्राम रूपान्तरण",
  "nepali-calendar": "नेपाली पात्रो",
  "loksewa-photo-resizer": "लोकसेवा फोटो रिसाइजर",
  "nepal-land-area-converter": "रोपनी आना क्षेत्रफल रूपान्तरण",
  "nepali-vat-calculator": "नेपाल VAT क्याल्कुलेटर",
  "neb-gpa-calculator": "NEB GPA क्याल्कुलेटर",
  "word-character-counter": "शब्द तथा अक्षर गणक",
  "case-converter": "अक्षर शैली रूपान्तरण",
  "remove-duplicate-lines": "दोहोरो लाइन हटाउने",
  "sort-lines": "लाइन क्रम मिलाउने",
  "reverse-text": "पाठ उल्ट्याउने",
  "whitespace-cleaner": "खाली स्थान सफा गर्ने",
  "character-frequency": "अक्षर आवृत्ति गणक",
  "word-frequency-counter": "शब्द आवृत्ति गणक",
  "reading-time-calculator": "पढ्ने समय गणक",
  "line-counter": "लाइन गणक",
  "sentence-counter": "वाक्य गणक",
  "email-extractor": "इमेल ठेगाना निकाल्ने",
  "url-extractor": "वेब ठेगाना निकाल्ने",
  "phone-number-extractor": "फोन नम्बर निकाल्ने",
  "number-extractor": "संख्या निकाल्ने",
  "hashtag-extractor": "ह्यासट्याग निकाल्ने",
  "remove-duplicate-words": "दोहोरो शब्द हटाउने",
  "find-replace-text": "पाठ खोज्ने र बदल्ने",
  "palindrome-checker": "उल्टो पढ्दा उस्तै हुने शब्द जाँच",
  "acronym-generator": "संक्षिप्त नाम बनाउने",
  "percentage-change-calculator": "प्रतिशत परिवर्तन क्याल्कुलेटर",
  "average-calculator": "औसत क्याल्कुलेटर",
  "ratio-simplifier": "अनुपात सरल बनाउने",
  "fraction-calculator": "भिन्न क्याल्कुलेटर",
  "percentage-of-number-calculator": "संख्याको प्रतिशत क्याल्कुलेटर",
  "gcd-lcm-calculator": "GCD तथा LCM क्याल्कुलेटर",
  "prime-number-checker": "अभाज्य संख्या जाँच",
  "unit-converter": "एकाइ रूपान्तरण",
  "age-calculator": "उमेर क्याल्कुलेटर",
  "date-difference-calculator": "मिति अन्तर क्याल्कुलेटर",
  "time-duration-calculator": "समय अवधि क्याल्कुलेटर",
  "bmi-calculator": "BMI क्याल्कुलेटर",
  "bmr-calculator": "BMR क्याल्कुलेटर",
  "tip-calculator": "टिप क्याल्कुलेटर",
  "split-bill-calculator": "बिल बाँडफाँट क्याल्कुलेटर",
  "simple-interest-calculator": "साधारण ब्याज क्याल्कुलेटर",
  "profit-margin-calculator": "नाफा मार्जिन क्याल्कुलेटर",
  "markup-calculator": "Markup क्याल्कुलेटर",
  "break-even-calculator": "ब्रेक-इभेन क्याल्कुलेटर",
  "sales-tax-calculator": "बिक्री कर क्याल्कुलेटर",
  "salary-breakdown-calculator": "तलब विवरण क्याल्कुलेटर",
  "commission-calculator": "कमिसन क्याल्कुलेटर",
  "hourly-to-salary-calculator": "घण्टाको ज्यालाबाट तलब क्याल्कुलेटर",
  "json-formatter-validator": "JSON फर्म्याट तथा जाँच",
  "base64-encoder-decoder": "Base64 Encode / Decode",
  "url-encoder-decoder": "URL Encode / Decode",
  "hash-generator": "Hash Generator",
  "text-diff-checker": "Text Diff Checker",
  "lorem-ipsum-generator": "Lorem Ipsum Generator",
  "html-encoder-decoder": "HTML Encode / Decode",
  "text-to-slug": "Text to Slug Converter",
  "nepse-technical-analysis": "NEPSE प्राविधिक विश्लेषण",
  "nepal-forex-rates": "नेपाल राष्ट्र बैंक विनिमय दर",
  "nepal-salary-tax-calculator": "नेपाल तलब तथा आयकर क्याल्कुलेटर",
  "nepse-dividend-calculator": "NEPSE लाभांश तथा बोनस शेयर क्याल्कुलेटर",
  "nepse-market-news": "NEPSE तथा नेपाल बजार समाचार",
  "loan-emi-calculator": "ऋण EMI क्याल्कुलेटर",
  "compound-interest-sip-calculator": "चक्रवृद्धि ब्याज तथा SIP क्याल्कुलेटर",
  "discount-percentage-calculator": "छुट प्रतिशत क्याल्कुलेटर",
  "xml-formatter-validator": "XML फर्म्याट तथा जाँच",
  "notes-to-pdf": "नोटबाट PDF",
  "html-tag-stripper": "HTML Tag हटाउने",
  "savings-goal-calculator": "बचत लक्ष्य क्याल्कुलेटर",
  "nepal-share-calculator": "शेयर नाफा–नोक्सान क्याल्कुलेटर",
  "password-generator": "सुरक्षित पासवर्ड बनाउने",
  "uuid-generator": "UUID बनाउने",
  "regex-tester": "Regex जाँचकर्ता",
  "jwt-decoder": "JWT Decoder",
  "color-picker-palette": "रङ छान्ने तथा प्यालेट",
  "color-contrast-checker": "रङ Contrast जाँच",
  "css-minifier": "CSS Minifier",
  "meta-title-checker": "Meta Title जाँच",
  "meta-description-checker": "Meta Description जाँच",
  "keyword-density-checker": "Keyword Density जाँच",
  "robots-txt-generator": "robots.txt Generator",
  "sitemap-generator": "XML Sitemap Generator",
  "open-graph-preview": "Open Graph Preview",
  "currency-converter": "मुद्रा रूपान्तरण",
  "image-compressor": "तस्बिर कम्प्रेसर",
  "image-format-converter": "तस्बिर Format रूपान्तरण",
  "preeti-unicode-converter": "Preeti बाट Unicode रूपान्तरण",
  "nepali-unicode-typing": "नेपाली Unicode टाइपिङ",
  "email-signature-generator": "व्यावसायिक इमेल हस्ताक्षर निर्माता",
  "timezone-meeting-planner": "समय क्षेत्र बैठक योजनाकार",
  "image-dpi-calculator": "तस्बिर DPI तथा PPI क्याल्कुलेटर",
  "video-bitrate-calculator": "भिडियो बिटरेट क्याल्कुलेटर",
  "markdown-table-generator": "Markdown तालिका निर्माता",
};
const nepaliDescriptions: Record<string, string> = {
  "xml-formatter-validator": "XML syntax जाँचेर सुरक्षित रूपमा indentation मिलाउनुहोस्।",
  "notes-to-pdf": "नोट ब्राउजरमै लेखेर Print संवादबाट PDF का रूपमा सुरक्षित गर्नुहोस्।",
  "html-tag-stripper": "HTML snippet बाट देखिने पाठ ब्राउजरमै निकाल्नुहोस्।",
  "savings-goal-calculator": "लक्ष्य, हालको बचत, अवधि र अनुमानित ब्याजका आधारमा मासिक बचत निकाल्नुहोस्।",
  "nepal-share-calculator": "शेयर कारोबारको नाफा वा नोक्सान तपाईंले दिएको शुल्क र कर दरअनुसार अनुमान गर्नुहोस्।",
  "password-generator": "ब्राउजरमै क्रिप्टोग्राफिक random बाट पासवर्ड बनाउनुहोस्; कुनै डेटा सर्भरमा पठाइँदैन।",
  "uuid-generator": "Web Crypto API प्रयोग गरी UUID v4 बनाउनुहोस्।",
  "regex-tester": "JavaScript regular expression बाट पाठमा मिल्ने अंशहरू जाँच्नुहोस्।",
  "jwt-decoder": "JWT header र payload ब्राउजरमै decode गर्नुहोस्; signature verify हुँदैन।",
  "color-picker-palette": "HEX रङ छान्नुहोस् र त्यसको RGB मान हेर्नुहोस्।",
  "color-contrast-checker": "दुई HEX रङबीच contrast ratio र WCAG AA/AAA अनुपालन जाँच्नुहोस्।",
  "css-minifier": "CSS बाट comment र अनावश्यक whitespace हटाएर compact बनाउनुहोस्।",
  "meta-title-checker": "Meta title को अक्षर संख्या र सामान्य SERP guideline जाँच्नुहोस्।",
  "meta-description-checker": "Meta description को लम्बाइ जाँच्नुहोस्; Google snippet को ग्यारेन्टी हुँदैन।",
  "keyword-density-checker": "लेखमा exact-match keyword को आवृत्ति र प्रतिशत अनुमान गर्नुहोस्।",
  "robots-txt-generator": "आधारभूत robots.txt तयार गर्नुहोस्; deploy अघि crawler नियम जाँच्नुहोस्।",
  "sitemap-generator": "दिइएका canonical URL बाट XML sitemap बनाउनुहोस्।",
  "open-graph-preview": "शीर्षक, विवरण र image URL बाट social sharing preview हेर्नुहोस्।",
  "currency-converter": "सार्वजनिक विनिमय-दर API बाट विभिन्न मुद्राको अनुमानित रूपान्तरण गर्नुहोस्; कारोबारअघि आधिकारिक दर पुष्टि गर्नुहोस्।",
  "image-compressor": "तस्बिरलाई WebP मा कम्प्रेस गर्नुहोस्। फाइल ब्राउजरमै प्रशोधन हुन्छ र सर्भरमा अपलोड हुँदैन।",
  "image-format-converter": "PNG, JPEG र WebP बीच तस्बिर रूपान्तरण गर्नुहोस्; फाइल ब्राउजरमै प्रशोधन हुन्छ।",
  "preeti-unicode-converter": "पुरानो Preeti font encoding लाई नेपाली Unicode मा बदल्नुहोस्; reverse conversion अनुमानित हुन्छ।",
  "nepali-unicode-typing": "अङ्ग्रेजी अक्षरमा नेपाली शब्द टाइप गरी देवनागरी Unicode मा बदल्नुहोस्.",
  "email-signature-generator": "आफ्नो नाम, पद, कम्पनी र सम्पर्क विवरणसहित HTML इमेल हस्ताक्षर ब्राउजरमै तयार गर्नुहोस्।",
  "timezone-meeting-planner": "विभिन्न समय क्षेत्र र सहरमा बैठकको स्थानीय समय तुलना गर्नुहोस्।",
  "image-dpi-calculator": "प्रिन्ट आकारअनुसार तस्बिरको PPI र आवश्यक पिक्सेल आयाम गणना गर्नुहोस्।",
  "video-bitrate-calculator": "भिडियो अवधि, लक्षित फाइल आकार, अडियो बिटरेट र अतिरिक्त स्थानका आधारमा भिडियो बिटरेट अनुमान गर्नुहोस्।",
  "markdown-table-generator": "Tab छुट्याइएको पाठलाई Markdown तालिकामा रूपान्तरण गर्नुहोस्; सबै प्रशोधन ब्राउजरमै हुन्छ।",
  "resume-builder": "२० वटा व्यावसायिक टेम्प्लेट, प्रत्यक्ष A4 पूर्वावलोकन, सम्पादनयोग्य खण्ड र PDF निर्यात प्रयोग गरी व्यवस्थित CV बनाउनुहोस्।",
  "csv-to-json": "पहिलो पङ्क्तिलाई शीर्षक मानेर CSV डेटालाई JSON array मा बदल्नुहोस्।",
  "json-to-yaml": "JSON डेटालाई पढ्न सजिलो YAML ढाँचामा बदल्नुहोस्।",
  "json-to-csv": "JSON object हरूको array लाई Excel/Sheets मा खोल्न मिल्ने CSV मा बदल्नुहोस्।",
  "url-validator": "URL को बनोट जाँचेर protocol, host, path र query छुट्याउनुहोस्।",
  "email-validator": "इमेल ठेगानाको आधारभूत बनोट मान्य छ कि छैन जाँच्नुहोस्।",
  "password-strength-checker": "पासवर्डले आधारभूत मापदण्ड कति पूरा गर्छ भनी स्थानीय रूपमा जाँच्नुहोस्।",
  "url-query-parser": "URL भित्रका query parameter हरू कुञ्जी र मानमा छुट्याएर हेर्नुहोस्।",
  "color-converter": "HEX रङलाई RGB र HSL मान सहित हेर्नुहोस्।",
  "aspect-ratio-calculator": "चौडाइ र उचाइबाट सरल aspect ratio निकाल्नुहोस्।",
  "css-gradient-generator": "दुई रङ र कोणबाट CSS linear-gradient कोड बनाउनुहोस्।",
  "unix-timestamp-converter": "Unix timestamp लाई UTC र नेपाल समयमा बदल्नुहोस्।",
  "date-add-subtract-calculator": "कुनै मितिमा दिन थपेर वा घटाएर नयाँ मिति निकाल्नुहोस्।",
  "business-days-calculator": "दुई मितिबीच शनिबार–आइतबार बाहेकका कार्यदिन गन्नुहोस्।",
  "random-number-generator": "दिइएको दायराभित्र सुरक्षित अनियमित पूर्ण सङ्ख्या बनाउनुहोस्।",
  "dice-roller": "१ देखि १०० वटासम्म ६-पाटे पासा फाल्नुहोस्।",
  "text-to-binary": "कुनै पनि पाठ (नेपाली सहित) UTF-8 बाइटमा बदली ८-bit बाइनरी समूहमा देखाउनुहोस्।",
  "binary-to-text": "खाली स्थानले छुट्याइएका ८-bit बाइनरी समूहलाई UTF-8 पाठमा फर्काउनुहोस्।",
  "text-to-hex": "पाठलाई UTF-8 बाइटमा बदली hexadecimal (आधार १६) मा देखाउनुहोस्।",
  "hex-to-text": "Hex बाइट जोडालाई UTF-8 पाठमा फर्काउनुहोस्।",
  "morse-code-translator": "अङ्ग्रेजी अक्षर र अंकलाई मोर्स कोडमा बदल्नुहोस् वा मोर्स कोडबाट पाठ निकाल्नुहोस्।",
  "camel-case-converter": "पाठलाई प्रोग्रामिङमा प्रयोग हुने camelCase नाममा बदल्नुहोस्।",
  "snake-case-converter": "पाठलाई underscore ले जोडिएको snake_case नाममा बदल्नुहोस्।",
  "kebab-case-converter": "पाठलाई hyphen ले जोडिएको kebab-case नाममा बदल्नुहोस्।",
  "json-escape-unescape": "पाठलाई JSON string मा सुरक्षित बनाउनुहोस् वा escape गरिएको string खोल्नुहोस्।",
  "px-rem-converter": "CSS मा px र rem एकाइबीच रूपान्तरण गर्नुहोस्।",
  "roman-numeral-converter": "१ देखि ३९९९ सम्मका सङ्ख्या र रोमन अंकबीच रूपान्तरण गर्नुहोस्।",
  "nepali-digit-converter": "अङ्ग्रेजी अंकलाई नेपाली देवनागरी अंकमा र नेपाली अंकलाई अङ्ग्रेजी अंकमा रूपान्तरण गर्नुहोस्।",
  "nepali-number-converter": "नम्बरलाई नेपाली अंकमा देखाउनुहोस् र नेपाली लाख तथा करोडको ढाँचा जाँच्नुहोस्।",
  "nepali-date-converter": "विक्रम संवत् र इस्वी संवत्का मितिहरूबीच रूपान्तरण गर्नुहोस् र समर्थित मिति दायरा जाँच्नुहोस्।",
  "nepal-electricity-bill-calculator": "विद्युत् नियमन आयोगको अद्यावधिक आधिकारिक क्याल्कुलेटरबाट जडान प्रकार, फ्युज क्षमता, मौसम र kWh खपतअनुसार बिल निकाल्नुहोस्।",
  "nepal-public-holidays-2083": "२०८३ सालका राष्ट्रिय, क्षेत्रीय तथा समुदायअनुसारका सार्वजनिक बिदा खोज्नुहोस्। मिति र लागू हुने क्षेत्र आधिकारिक गृह मन्त्रालयको सूचनासँग जाँच्नुहोस्।",
  "nepal-phone-validator": "नेपालको सामान्य १० अङ्कको मोबाइल नम्बर ढाँचा जाँच्नुहोस् र +977 अन्तर्राष्ट्रिय ढाँचा हेर्नुहोस्।",
  "gold-tola-gram-converter": "तोला र ग्रामबीच तौल रूपान्तरण गर्नुहोस्। १ तोला = ११.६६३८०३८ ग्रामको मान प्रयोग गरिएको छ।",
  "nepali-calendar": "समर्थित BS वर्ष र महिनाको पात्रोमा AD मिति तथा बार हेर्नुहोस्। सार्वजनिक बिदा र तिथि यसमा समावेश छैनन्।",
  "loksewa-photo-resizer": "लोकसेवा तथा अनलाइन फारामका लागि फोटोको पिक्सेल आयाम र JPEG फाइल आकार घटाउनुहोस्। आवेदनको आधिकारिक मापदण्ड छुट्टै जाँच्नुहोस्।",
  "nepal-land-area-converter": "रोपनी, आना, पैसा र दामलाई वर्गफुट तथा वर्गमिटरमा रूपान्तरण गर्नुहोस्।",
  "nepali-vat-calculator": "नेपालको १३ प्रतिशत VAT थप्नुहोस् वा VAT सहितको रकमबाट आधार मूल्य र कर छुट्याउनुहोस्।",
  "neb-gpa-calculator": "विषयको credit hour र grade point प्रयोग गरेर credit-weighted NEB GPA अनुमान गर्नुहोस्।",
  "word-character-counter": "शब्द, अक्षर, खाली स्थान र अनुच्छेदको संख्या गणना गर्नुहोस्।",
  "case-converter": "अङ्ग्रेजी पाठलाई uppercase, lowercase वा title case मा बदल्नुहोस्।",
  "remove-duplicate-lines": "दोहोरिएका लाइन हटाएर पहिलो आएको क्रम सुरक्षित राख्नुहोस्।",
  "sort-lines": "पाठका लाइनलाई वर्णक्रममा मिलाउनुहोस्।",
  "reverse-text": "पाठको अक्षर क्रम उल्ट्याउनुहोस्।",
  "whitespace-cleaner": "अतिरिक्त space, tab र खाली लाइन व्यवस्थित गर्नुहोस्।",
  "character-frequency": "पाठमा प्रत्येक अक्षर कति पटक आएको छ गणना गर्नुहोस्।",
  "word-frequency-counter": "पाठमा प्रत्येक शब्दको आवृत्ति गणना गर्नुहोस्।",
  "reading-time-calculator": "शब्द संख्या र पढ्ने गतिका आधारमा अनुमानित समय निकाल्नुहोस्।",
  "line-counter": "कुल, खाली र सामग्री भएका लाइन छुट्याउनुहोस्।",
  "sentence-counter": "विरामचिह्नका आधारमा वाक्य संख्या अनुमान गर्नुहोस्।",
  "email-extractor": "पाठबाट इमेल ठेगाना पहिचान गरी अद्वितीय सूची बनाउनुहोस्।",
  "url-extractor": "पाठमा भएका HTTP र HTTPS लिङ्क निकालेर सूची बनाउनुहोस्।",
  "phone-number-extractor": "पाठमा भएका सम्भावित फोन नम्बर पहिचान गर्नुहोस् र प्रयोगअघि पुष्टि गर्नुहोस्।",
  "number-extractor": "पाठबाट पूर्णाङ्क र दशमलव संख्या निकाल्नुहोस्।",
  "hashtag-extractor": "सामाजिक सञ्जालको पाठबाट अद्वितीय ह्यासट्याग निकाल्नुहोस्।",
  "remove-duplicate-words": "दोहोरिएका शब्द हटाई पहिलो पटक आएको क्रम कायम राख्नुहोस्।",
  "find-replace-text": "पाठभित्र खोजिएको शब्द वा वाक्यांशलाई अर्को पाठले बदल्नुहोस्।",
  "palindrome-checker": "खाली स्थान र विरामचिह्न बेवास्ता गरी पाठ दुवैतर्फ एउटै पढिन्छ कि जाँच्नुहोस्।",
  "acronym-generator": "वाक्यांशका शब्दको सुरुका अक्षरबाट संक्षिप्त नाम बनाउनुहोस्।",
  "percentage-change-calculator": "सुरुको र नयाँ मानबाट प्रतिशत वृद्धि वा कमी निकाल्नुहोस्।",
  "average-calculator": "अल्पविराम वा space ले छुट्याएका संख्याको औसत निकाल्नुहोस्।",
  "ratio-simplifier": "दुई पूर्णांकको अनुपातलाई सबैभन्दा सरल रूपमा बदल्नुहोस्।",
  "fraction-calculator": "दुई भिन्न जोड्नुहोस्, घटाउनुहोस्, गुणन वा भाग गर्नुहोस्।",
  "percentage-of-number-calculator": "कुनै संख्याको चाहिएको प्रतिशत निकाल्नुहोस्।",
  "gcd-lcm-calculator": "दुई पूर्णांकको महत्तम समापवर्तक र लघुत्तम समापवर्त्य निकाल्नुहोस्।",
  "prime-number-checker": "कुनै पूर्णांक अभाज्य हो वा होइन जाँच गर्नुहोस्।",
  "unit-converter": "लम्बाइ र तौलका सामान्य एकाइहरूबीच रूपान्तरण गर्नुहोस्।",
  "age-calculator": "जन्म मिति र गणना मितिका आधारमा वर्ष, महिना, दिन र कुल दिन निकाल्नुहोस्।",
  "date-difference-calculator": "दुई मितिबीचको दिन, हप्ता र औसत महिनाको अन्तर निकाल्नुहोस्।",
  "time-duration-calculator": "दुई समयबीचको घण्टा र मिनेट निकाल्नुहोस्; राति पार हुने समय पनि समर्थन गर्छ।",
  "bmi-calculator": "तौल र उचाइबाट वयस्कको BMI र सामान्य screening वर्ग निकाल्नुहोस्; यो चिकित्सकीय निदान होइन।",
  "bmr-calculator": "उमेर, उचाइ, तौल र Mifflin–St Jeor सूत्रबाट आधारभूत दैनिक ऊर्जा खर्च अनुमान गर्नुहोस्।",
  "tip-calculator": "बिल रकम, टिप प्रतिशत र व्यक्ति संख्याबाट टिप तथा प्रति व्यक्ति रकम निकाल्नुहोस्।",
  "split-bill-calculator": "कुल बिललाई व्यक्तिको संख्याले बराबर बाँडेर प्रति व्यक्ति रकम निकाल्नुहोस्।",
  "simple-interest-calculator": "मूलधन, वार्षिक ब्याजदर र अवधिबाट साधारण ब्याज तथा कुल रकम निकाल्नुहोस्।",
  "profit-margin-calculator": "बिक्री रकम र लागतबाट नाफा वा घाटा तथा बिक्री रकममा आधारित नाफा मार्जिन निकाल्नुहोस्।",
  "markup-calculator": "लागतमा markup प्रतिशत थपेर बिक्री मूल्य, नाफा रकम र बिक्री मार्जिन निकाल्नुहोस्।",
  "break-even-calculator": "स्थिर लागत र प्रति एकाइ लागतका आधारमा लागत उठाउन आवश्यक बिक्री मात्रा निकाल्नुहोस्।",
  "sales-tax-calculator": "आफूले दिएको करदर प्रयोग गरी कर रकम र करसहितको कुल मूल्य निकाल्नुहोस्।",
  "salary-breakdown-calculator": "मासिक तलबबाट प्रयोगकर्ताले दिएको कर, सञ्चय कोष र अन्य कटौती घटाएर हातमा आउने रकम निकाल्नुहोस्।",
  "commission-calculator": "बिक्री रकम र कमिसन दरबाट कमिसन रकम निकाल्नुहोस्।",
  "hourly-to-salary-calculator": "प्रति घण्टा ज्याला, साप्ताहिक काम र वार्षिक कामका हप्ताबाट अनुमानित तलब निकाल्नुहोस्।",
  "json-formatter-validator": "JSON डेटा मान्य छ कि छैन जाँच्नुहोस् र पढ्न सजिलो गरी फर्म्याट गर्नुहोस्।",
  "base64-encoder-decoder": "UTF-8 पाठलाई Base64 मा बदल्नुहोस् वा Base64 बाट पाठ निकाल्नुहोस्।",
  "url-encoder-decoder": "URL मा प्रयोग हुने विशेष अक्षर encode वा decode गर्नुहोस्।",
  "hash-generator": "पाठको SHA-256, SHA-384 वा SHA-512 hash स्थानीय ब्राउजरमै निकाल्नुहोस्।",
  "text-diff-checker": "दुई पाठ तुलना गरी थपिएका, हटाइएका र उस्तै लाइन देखाउनुहोस्।",
  "lorem-ipsum-generator": "डिजाइन तथा लेआउट परीक्षणका लागि नमुना placeholder पाठ बनाउनुहोस्।",
  "html-encoder-decoder": "HTML का विशेष अक्षर encode वा समर्थित entity decode गर्नुहोस्।",
  "text-to-slug": "पाठलाई URL-friendly slug मा बदल्नुहोस्; नेपाली Unicode अक्षर सुरक्षित रहन्छन्।",
  "nepse-technical-analysis": "उपलब्ध NEPSE ऐतिहासिक मूल्यबाट RSI, EMA, MACD, जोखिम र समर्थन/प्रतिरोधको नियममा आधारित विश्लेषण हेर्नुहोस्। डेटा अपूर्ण वा पुरानो भए नतिजा सीमित हुन सक्छ।",
  "nepal-forex-rates": "नेपाल राष्ट्र बैंकबाट उपलब्ध खरिद तथा बिक्री विनिमय दर हेर्नुहोस् र NPR रूपान्तरणको अनुमान जाँच्नुहोस्।",
  "nepal-salary-tax-calculator": "नेपालको लागू कर-ब्यान्ड र प्रविष्ट गरिएको आम्दानीका आधारमा तलब करको अनुमान निकाल्नुहोस्।",
  "nepse-dividend-calculator": "शेयर संख्याबाट नगद लाभांश, withholding tax र बोनस शेयरको अनुमान निकाल्नुहोस्।",
  "nepse-market-news": "प्रकाशन मिति र स्रोतसहित उपलब्ध नेपाल शेयर बजार तथा IPO समाचार हेर्नुहोस्।",
  "loan-emi-calculator": "ऋण रकम, ब्याजदर र अवधिबाट मासिक EMI, कुल ब्याज र कुल भुक्तानीको अनुमान निकाल्नुहोस्।",
  "compound-interest-sip-calculator": "मासिक SIP, अवधि र अपेक्षित प्रतिफलबाट लगानीको अनुमानित भविष्य मूल्य र लाभ जाँच्नुहोस्।",
  "discount-percentage-calculator": "मूल्य र छुट प्रतिशतबाट छुट रकम, अन्तिम मूल्य र प्रतिशत परिवर्तन निकाल्नुहोस्।",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const request = resolveLocalizedToolRequest(locale, slug);
  if (request.status !== "ok") return localizedToolNotFoundMetadata;
  const metadata = buildLocalizedToolMetadata(request.locale, request.implementation.entry);
  if (request.locale === "ne" && (["email-signature-generator", "timezone-meeting-planner", "image-dpi-calculator", "video-bitrate-calculator", "markdown-table-generator"].includes(request.implementation.slug) || nepaliLocalizedUtilitySlugs.includes(request.implementation.slug as (typeof nepaliLocalizedUtilitySlugs)[number]) || nepaliLocalizedFinancialSlugs.includes(request.implementation.slug as (typeof nepaliLocalizedFinancialSlugs)[number]) || nepaliLocalizedPublicInfoSlugs.includes(request.implementation.slug as (typeof nepaliLocalizedPublicInfoSlugs)[number]))) {
    return {
      ...metadata,
      title: nepaliTitles[request.implementation.slug],
      description: fitLocaleDescription(nepaliDescriptions[request.implementation.slug] ?? metadata.description),
    };
  }
  return metadata;
}

/**
 * Localized catalog-tool route (/ne/tools/<slug>, /ar/tools/<slug>, ...). English stays at the
 * unprefixed /tools/<slug> and is not touched.
 *
 * Only slugs accepted by the tool adapter render; everything else is a 404 (no fallback tool).
 * Explicitly localized routes render their dedicated locale-specific workspaces and copy below.
 * Remaining registered routes use the English ToolWorkspace with an honest language notice.
 * Tool routes stay noindex until native-language review and functional verification are complete.
 * No English JSON-LD is attached to localized URLs.
 */
export default async function LocalizedToolPage({ params }: Props) {
  const { locale, slug } = await params;
  const request = resolveLocalizedToolRequest(locale, slug);
  if (request.status !== "ok") notFound();
  const t = await getTranslator(request.locale, ["common"]);
  const toolSlug = request.implementation.slug;
  if (request.locale === "ne" && toolSlug === "nepali-unicode-typing") { return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><h1 className="text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliTypingTool locale="ne" /></section></main>; }
  if (request.locale === "ne" && ["xml-formatter-validator", "notes-to-pdf", "html-tag-stripper", "savings-goal-calculator", "nepal-share-calculator", "password-generator", "uuid-generator", "regex-tester", "jwt-decoder", "color-picker-palette", "color-contrast-checker", "css-minifier", "meta-title-checker", "meta-description-checker", "keyword-density-checker", "robots-txt-generator", "sitemap-generator", "open-graph-preview", "currency-converter", "image-compressor", "image-format-converter", "preeti-unicode-converter"].includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली उपयोगी टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliRemainingToolsWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && toolSlug === "resume-builder") {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली करियर टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div>
      <ResumeBuilder locale="ne" />
    </main>;
  }
  if (request.locale === "ne" && ["email-extractor", "url-extractor", "phone-number-extractor", "number-extractor", "hashtag-extractor", "remove-duplicate-words", "find-replace-text", "palindrome-checker", "acronym-generator"].includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली टेक्स्ट उपयोगिता</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliExtraTextWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && ["word-character-counter", "case-converter", "remove-duplicate-lines", "sort-lines", "reverse-text", "whitespace-cleaner", "character-frequency", "word-frequency-counter", "reading-time-calculator", "line-counter", "sentence-counter"].includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली टेक्स्ट टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliTextUtilityWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && ["json-formatter-validator", "base64-encoder-decoder", "url-encoder-decoder", "hash-generator", "text-diff-checker", "lorem-ipsum-generator", "html-encoder-decoder", "text-to-slug"].includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली Developer तथा Text Tools</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliDeveloperTextWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && ["age-calculator", "date-difference-calculator", "time-duration-calculator"].includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली मिति तथा समय टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliDateTimeWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && ["profit-margin-calculator", "markup-calculator", "break-even-calculator", "sales-tax-calculator", "salary-breakdown-calculator", "commission-calculator", "hourly-to-salary-calculator"].includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली व्यवसाय तथा लेखा टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliBusinessCalculatorWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && ["percentage-change-calculator", "average-calculator", "ratio-simplifier", "fraction-calculator", "percentage-of-number-calculator", "gcd-lcm-calculator", "prime-number-checker", "unit-converter", "bmi-calculator", "bmr-calculator", "tip-calculator", "split-bill-calculator", "simple-interest-calculator"].includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली गणित टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliMathUtilityWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && ["nepal-phone-validator", "gold-tola-gram-converter", "nepali-calendar", "loksewa-photo-resizer"].includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाल उपयोगी टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliNepalToolsWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && ["text-to-binary", "binary-to-text", "text-to-hex", "hex-to-text", "morse-code-translator", "camel-case-converter", "snake-case-converter", "kebab-case-converter", "json-escape-unescape", "px-rem-converter", "roman-numeral-converter"].includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली एन्कोडिङ तथा केस रूपान्तरण टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliEncodingCaseWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && ["csv-to-json", "json-to-yaml", "json-to-csv", "url-validator", "email-validator", "password-strength-checker", "url-query-parser", "color-converter", "aspect-ratio-calculator", "css-gradient-generator", "unix-timestamp-converter", "date-add-subtract-calculator", "business-days-calculator", "random-number-generator", "dice-roller"].includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली डेटा, जाँच तथा डेभलपर टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliDataToolsWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && ["email-signature-generator","timezone-meeting-planner","image-dpi-calculator","video-bitrate-calculator","markdown-table-generator"].includes(toolSlug)) {
    const titles:Record<string,string>={"email-signature-generator":"व्यावसायिक इमेल हस्ताक्षर निर्माता","timezone-meeting-planner":"समय क्षेत्र बैठक योजनाकार","image-dpi-calculator":"तस्बिर DPI तथा PPI क्याल्कुलेटर","video-bitrate-calculator":"भिडियो बिटरेट क्याल्कुलेटर","markdown-table-generator":"Markdown तालिका निर्माता"};
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 sm:px-6"><h1 className="mb-6 text-3xl font-black">{titles[toolSlug]}</h1><NepaliBrowserOnlyGrowthTools slug={toolSlug as "email-signature-generator"|"timezone-meeting-planner"|"image-dpi-calculator"|"video-bitrate-calculator"|"markdown-table-generator"}/></main>;
  }
  if (request.locale === "ne" && nepaliLocalizedUtilitySlugs.includes(toolSlug as (typeof nepaliLocalizedUtilitySlugs)[number])) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली उपयोगी टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">यो पृष्ठका मुख्य निर्देशन र नतिजा नेपालीमा उपलब्ध छन्।</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliUtilityWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && nepaliLocalizedPublicInfoSlugs.includes(toolSlug as (typeof nepaliLocalizedPublicInfoSlugs)[number])) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपालका आधिकारिक सेवा तथा सार्वजनिक सूचना</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepalLiveTools slug={toolSlug} locale="ne" /></section></main>;
  }

  if (request.locale === "ne" && nepaliLocalizedFinancialSlugs.includes(toolSlug as (typeof nepaliLocalizedFinancialSlugs)[number])) {
    if (["loan-emi-calculator", "compound-interest-sip-calculator", "discount-percentage-calculator"].includes(toolSlug)) {
      return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली वित्तीय टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliFinanceCalculatorWorkspace slug={toolSlug} /></section></main>;
    }
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली वित्तीय टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">आधिकारिक स्रोत वा स्पष्ट गणना धारणासहितको नेपाली इन्टरफेस। बजार र दरसम्बन्धी डेटा उपलब्ध नभएमा त्यसैको सूचना देखाइन्छ।</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepalLiveTools slug={toolSlug} locale="ne" /></section></main>;
  }
  return (
    <>
      <div role="note" className="mx-auto mt-4 w-full max-w-4xl space-y-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {!isPublished(request.locale) && <p>{t("common.previewBanner")}</p>}
        <p>
          {t("common.toolEnglishNotice")}{" "}
          <Link href={`/tools/${toolSlug}`} lang="en" hrefLang="en" className="font-semibold underline">
            {t("common.viewEnglishTool")}
          </Link>
        </p>
      </div>
      <div lang="en" dir="ltr">
        <ToolWorkspace slug={toolSlug} />
      </div>
    </>
  );
}
