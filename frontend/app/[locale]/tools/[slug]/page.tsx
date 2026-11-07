import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ToolWorkspace from "../../../../components/AllTools";
import { isPublished } from "../../../../lib/i18n/config";
import { getTranslator } from "../../../../lib/i18n/messages";
import { buildLocalizedToolMetadata, localizedToolNotFoundMetadata } from "../../../../lib/tools/localized-metadata";
import { resolveLocalizedToolRequest } from "../../../../lib/tools/localized-route";
import NepaliUtilityWorkspace from "../../../../components/NepaliUtilityWorkspace";
import NepaliTextUtilityWorkspace from "../../../../components/NepaliTextUtilityWorkspace";
import NepaliMathUtilityWorkspace from "../../../../components/NepaliMathUtilityWorkspace";
import NepaliBusinessCalculatorWorkspace from "../../../../components/NepaliBusinessCalculatorWorkspace";
import NepaliDateTimeWorkspace from "../../../../components/NepaliDateTimeWorkspace";
import NepaliDeveloperTextWorkspace from "../../../../components/NepaliDeveloperTextWorkspace";
import NepaliNepalToolsWorkspace from "../../../../components/NepaliNepalToolsWorkspace";
import NepalLiveTools from "../../../../components/NepalLiveTools";
import NepaliFinanceCalculatorWorkspace from "../../../../components/NepaliFinanceCalculatorWorkspace";
import AIWritingTools from "../../../../components/AIWritingTools";
import ExtraTools from "../../../../components/ExtraTools";
import QuickUtilityTools from "../../../../components/QuickUtilityTools";
import NepaliSpecialCatalogWorkspace from "../../../../components/NepaliSpecialCatalogWorkspace";
import { nepaliLocalizedCareerSlugs, nepaliLocalizedFinancialSlugs, nepaliLocalizedPublicInfoSlugs, nepaliLocalizedUtilitySlugs } from "../../../../lib/i18n/nepali-tool-routes";

type Props = { params: Promise<{ locale: string; slug: string }> };
const nepaliTitles: Record<string, string> = {
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
  "url-extractor": "URL निकाल्ने",
  "phone-number-extractor": "फोन नम्बर निकाल्ने",
  "number-extractor": "संख्या निकाल्ने",
  "hashtag-extractor": "ह्यासट्याग निकाल्ने",
  "remove-duplicate-words": "दोहोरो शब्द हटाउने",
  "find-replace-text": "पाठ खोज्ने र बदल्ने",
  "palindrome-checker": "पालिन्ड्रोम जाँच",
  "acronym-generator": "संक्षिप्त रूप बनाउने",
  "text-to-binary": "पाठलाई बाइनरीमा बदल्ने",
  "binary-to-text": "बाइनरीलाई पाठमा बदल्ने",
  "text-to-hex": "पाठलाई Hex मा बदल्ने",
  "hex-to-text": "Hex लाई पाठमा बदल्ने",
  "morse-code-translator": "Morse Code रूपान्तरण",
  "camel-case-converter": "Camel Case रूपान्तरण",
  "snake-case-converter": "Snake Case रूपान्तरण",
  "kebab-case-converter": "Kebab Case रूपान्तरण",
  "html-tag-stripper": "HTML Tag हटाउने",
  "json-escape-unescape": "JSON Escape तथा Unescape",
  "url-query-parser": "URL Query Parameter जाँच",
  "url-validator": "URL ढाँचा जाँच",
  "email-validator": "इमेल ढाँचा जाँच",
  "password-strength-checker": "पासवर्ड बल जाँच",
  "uuid-generator": "UUID Generator",
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
  "nepal-forex-rates": "नेपाल राष्ट्र बैंक विनिमय दर",
  "nepal-salary-tax-calculator": "नेपाल तलब तथा आयकर क्याल्कुलेटर",
  "nepse-dividend-calculator": "NEPSE लाभांश तथा बोनस शेयर क्याल्कुलेटर",
  "nepse-market-news": "NEPSE तथा नेपाल बजार समाचार",
  "loan-emi-calculator": "ऋण EMI क्याल्कुलेटर",
  "compound-interest-sip-calculator": "चक्रवृद्धि ब्याज तथा SIP क्याल्कुलेटर",
  "discount-percentage-calculator": "छुट प्रतिशत क्याल्कुलेटर",
  "ai-resume-writer": "AI रिजुमे लेखक",
  "ai-cover-letter-generator": "AI कभर लेटर जेनेरेटर",
  "ai-humanizer": "AI पाठ परिष्कार तथा पुनर्लेखन",
  "password-generator": "सुरक्षित पासवर्ड जेनेरेटर",
  "xml-formatter-validator": "XML फर्म्याट तथा जाँच",
  "regex-tester": "Regular Expression परीक्षक",
  "jwt-decoder": "JWT Token Decoder",
  "color-contrast-checker": "रङ कन्ट्रास्ट जाँच",
  "css-minifier": "CSS Minifier",
  "json-to-csv": "JSON बाट CSV रूपान्तरण",
  "meta-title-checker": "SEO Meta Title जाँच",
  "meta-description-checker": "Meta Description जाँच",
  "keyword-density-checker": "Keyword Density जाँच",
  "robots-txt-generator": "Robots.txt Generator",
  "sitemap-generator": "XML Sitemap Generator",
  "open-graph-preview": "Open Graph Preview",
  "csv-to-json": "CSV बाट JSON रूपान्तरण",
  "json-to-yaml": "JSON बाट YAML रूपान्तरण",
  "random-number-generator": "अनियमित संख्या जेनेरेटर",
  "dice-roller": "पासा घुमाउने टुल",
  "unix-timestamp-converter": "Unix Timestamp रूपान्तरण",
  "date-add-subtract-calculator": "मितिमा दिन थप्ने वा घटाउने",
  "business-days-calculator": "कार्यदिन गणक",
  "px-rem-converter": "PX र REM रूपान्तरण",
  "aspect-ratio-calculator": "Aspect Ratio गणक",
  "color-converter": "HEX, RGB र HSL रङ रूपान्तरण",
  "css-gradient-generator": "CSS Gradient Generator",
  "roman-numeral-converter": "Roman Numeral रूपान्तरण",
  "savings-goal-calculator": "बचत लक्ष्य क्याल्कुलेटर",
  "currency-converter": "मुद्रा विनिमय क्याल्कुलेटर",
  "image-compressor": "तस्बिरको आकार घटाउने टुल",
  "image-format-converter": "तस्बिर ढाँचा रूपान्तरण",
  "color-picker-palette": "रङ छनोट तथा Palette Generator",
  "notes-to-pdf": "नोटबाट PDF बनाउनुहोस्",
  "nepal-share-calculator": "NEPSE शेयर खरिद/बिक्री क्याल्कुलेटर",
  "preeti-unicode-converter": "Preeti ↔ नेपाली Unicode रूपान्तरण",
  "nepali-unicode-typing": "नेपाली Unicode टाइपिङ",
};
const nepaliDescriptions: Record<string, string> = {
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
  "email-extractor": "पाठमा रहेका सम्भावित इमेल ठेगाना निकाल्नुहोस्; परिणाम पठाउनु अघि ठेगाना जाँच्नुहोस्।",
  "url-extractor": "पाठमा रहेका HTTP, HTTPS र www लिंकहरू निकाल्नुहोस्।",
  "phone-number-extractor": "पाठमा रहेका सम्भावित फोन नम्बर निकाल्नुहोस्; ढाँचा र स्वामित्व आफैं पुष्टि गर्नुहोस्।",
  "number-extractor": "पाठमा रहेका पूर्णांक तथा दशमलव संख्याहरू क्रमअनुसार निकाल्नुहोस्।",
  "hashtag-extractor": "नेपालीसहित Unicode अक्षर र अंक भएका hashtag निकाल्नुहोस्।",
  "remove-duplicate-words": "दोहोरो शब्द हटाएर पहिलो पटक आएको क्रम राख्नुहोस्; नतिजामा विरामचिह्न हटाइन्छ।",
  "find-replace-text": "पाठमा खोजिएको अंशका सबै मिल्दो occurrence अर्को पाठले बदल्नुहोस्।",
  "palindrome-checker": "खाली स्थान र विरामचिह्न बेवास्ता गरी पाठ दुवैतर्फबाट उस्तै पढिन्छ कि जाँच्नुहोस्।",
  "acronym-generator": "वाक्यांशका शब्दहरूको पहिलो अक्षर जोडेर संक्षिप्त रूप बनाउनुहोस्।",
  "text-to-binary": "पाठलाई UTF-8 बाइटको ८-बिट बाइनरी समूहमा बदल्नुहोस्।",
  "binary-to-text": "वैध ८-बिट बाइनरी समूहलाई UTF-8 पाठमा बदल्नुहोस्।",
  "text-to-hex": "पाठका UTF-8 बाइटलाई hexadecimal ढाँचामा बदल्नुहोस्।",
  "hex-to-text": "वैध hexadecimal बाइटलाई UTF-8 पाठमा बदल्नुहोस्।",
  "morse-code-translator": "अङ्ग्रेजी A–Z र 0–9 लाई Morse code मा वा Morse code बाट रूपान्तरण गर्नुहोस्।",
  "camel-case-converter": "शब्दहरूलाई camelCase शैलीमा जोड्नुहोस्।",
  "snake-case-converter": "शब्दहरूलाई snake_case शैलीमा बदल्नुहोस्।",
  "kebab-case-converter": "शब्दहरूलाई kebab-case शैलीमा बदल्नुहोस्।",
  "html-tag-stripper": "HTML tag हटाएर देखिने पाठ निकाल्नुहोस्; यसलाई सुरक्षा sanitizer नमान्नुहोस्।",
  "json-escape-unescape": "JSON string का विशेष अक्षरलाई escape वा unescape गर्नुहोस्।",
  "url-query-parser": "पूर्ण URL का query parameter निकालेर JSON मा देखाउनुहोस्।",
  "url-validator": "HTTP वा HTTPS URL को syntax जाँच्नुहोस्; वेबसाइट उपलब्धता जाँचिँदैन।",
  "email-validator": "इमेल ठेगानाको सामान्य syntax जाँच्नुहोस्; मेलबक्स अस्तित्व पुष्टि हुँदैन।",
  "password-strength-checker": "पासवर्डको लम्बाइ र अक्षर विविधता स्थानीय रूपमा जाँच्नुहोस्; यो सुरक्षा प्रमाणीकरण होइन।",
  "uuid-generator": "ब्राउजरको सुरक्षित randomUUID सुविधा प्रयोग गरी UUID v4 बनाउनुहोस्।",
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
  "nepal-forex-rates": "नेपाल राष्ट्र बैंकबाट उपलब्ध खरिद तथा बिक्री विनिमय दर हेर्नुहोस् र NPR रूपान्तरणको अनुमान जाँच्नुहोस्।",
  "nepal-salary-tax-calculator": "नेपालको लागू कर-ब्यान्ड र प्रविष्ट गरिएको आम्दानीका आधारमा तलब करको अनुमान निकाल्नुहोस्।",
  "nepse-dividend-calculator": "शेयर संख्याबाट नगद लाभांश, withholding tax र बोनस शेयरको अनुमान निकाल्नुहोस्।",
  "nepse-market-news": "प्रकाशन मिति र स्रोतसहित उपलब्ध नेपाल शेयर बजार तथा IPO समाचार हेर्नुहोस्।",
  "loan-emi-calculator": "ऋण रकम, ब्याजदर र अवधिबाट मासिक EMI, कुल ब्याज र कुल भुक्तानीको अनुमान निकाल्नुहोस्।",
  "compound-interest-sip-calculator": "मासिक SIP, अवधि र अपेक्षित प्रतिफलबाट लगानीको अनुमानित भविष्य मूल्य र लाभ जाँच्नुहोस्।",
  "discount-percentage-calculator": "मूल्य र छुट प्रतिशतबाट छुट रकम, अन्तिम मूल्य र प्रतिशत परिवर्तन निकाल्नुहोस्।",
  "ai-resume-writer": "तपाईंको वास्तविक अनुभवबाट ATS-अनुकूल रिजुमे सामग्री तयार गर्नुहोस्।",
  "ai-cover-letter-generator": "वास्तविक अनुभव र कामको विवरणबाट व्यावसायिक कभर लेटर तयार गर्नुहोस्।",
  "ai-humanizer": "अर्थ र तथ्य जोगाउँदै पाठलाई स्वाभाविक र स्पष्ट शैलीमा पुनर्लेखन गर्नुहोस्।",
  "password-generator": "ब्राउजरमै सुरक्षित random number generator प्रयोग गरी अनुकूल लम्बाइका पासवर्ड बनाउनुहोस्। पासवर्ड कतै पठाइँदैन।",
  "xml-formatter-validator": "XML syntax जाँच्नुहोस् र वैध XML लाई पढ्न सजिलो indentation मा मिलाउनुहोस्।",
  "regex-tester": "JavaScript regular expression लाई आफ्नो नमुना पाठमा परीक्षण गर्नुहोस्। संवेदनशील पाठ स्थानीय रूपमा जाँच्नुहोस्।",
  "jwt-decoder": "JWT को header र payload decode गरी देखाउनुहोस्। यसले signature verify गर्दैन र token सुरक्षित छ भन्ने प्रमाणित गर्दैन।",
  "color-contrast-checker": "अक्षर र पृष्ठभूमिको HEX रङबीच contrast ratio तथा WCAG AA/AAA मापदण्ड जाँच्नुहोस्।",
  "css-minifier": "CSS comment र अनावश्यक whitespace हटाएर compact CSS बनाउनुहोस्।",
  "json-to-csv": "JSON object को array लाई CSV ढाँचामा बदल्नुहोस्। सबै object मा मिल्दो column structure हुनुपर्छ।",
  "meta-title-checker": "पृष्ठ शीर्षकको character length जाँच्नुहोस् र खोज परिणामको snippet preview हेर्नुहोस्।",
  "meta-description-checker": "Meta description को लम्बाइ जाँच्नुहोस् र सम्भावित search snippet preview हेर्नुहोस्।",
  "keyword-density-checker": "पेस्ट गरिएको सामग्रीमा लक्षित keyword कति पटक आएको छ र अनुमानित density कति छ जाँच्नुहोस्।",
  "robots-txt-generator": "Sitemap URL र Disallow path का आधारमा robots.txt सामग्री बनाउनुहोस्। लागू गर्नु अघि नियम जाँच्नुहोस्।",
  "sitemap-generator": "वैध absolute URL को सूचीबाट साधारण XML sitemap बनाउनुहोस्। URL हरू सही र crawl गर्न मिल्ने छन् कि आफैं जाँच्नुहोस्।",
  "open-graph-preview": "Title, description, image र URL प्रयोग गरी Open Graph social-sharing preview बनाउनुहोस्।",
  "csv-to-json": "CSV header र row लाई JSON object को array मा रूपान्तरण गर्नुहोस्।",
  "json-to-yaml": "वैध JSON लाई YAML ढाँचामा बदल्नुहोस्।",
  "random-number-generator": "दिइएको न्यूनतम र अधिकतम सीमाभित्र cryptographically secure random integer बनाउनुहोस्।",
  "dice-roller": "१ देखि १०० वटासम्म छ-पाटे पासा घुमाएर नतिजा र जम्मा निकाल्नुहोस्।",
  "unix-timestamp-converter": "Unix timestamp लाई UTC र स्थानीय मितिमा रूपान्तरण गर्नुहोस्।",
  "date-add-subtract-calculator": "सुरुको मितिमा तोकिएको दिन थप्नुहोस् वा घटाउनुहोस्।",
  "business-days-calculator": "दुई मितिबीचका सोमबारदेखि शुक्रबारसम्मका दिन गणना गर्नुहोस्। सार्वजनिक बिदा स्वतः घटाइँदैन।",
  "px-rem-converter": "Root font size का आधारमा pixel र rem बीच रूपान्तरण गर्नुहोस्।",
  "aspect-ratio-calculator": "चौडाइ र उचाइबाट सरल aspect ratio र दशमलव अनुपात निकाल्नुहोस्।",
  "color-converter": "छ-अङ्कको HEX रङलाई RGB र HSL मानमा रूपान्तरण गर्नुहोस्।",
  "css-gradient-generator": "दुई HEX रङ र कोणका आधारमा CSS linear-gradient code बनाउनुहोस्।",
  "roman-numeral-converter": "१ देखि ३९९९ सम्मका पूर्णांकलाई Roman numeral मा वा canonical Roman numeral लाई अंकमा बदल्नुहोस्।",
  "savings-goal-calculator": "बचत लक्ष्य, अहिलेसम्मको बचत र समयावधिबाट हरेक महिना बचत गर्नुपर्ने रकम निकाल्नुहोस्। ब्याज समावेश छैन।",
  "currency-converter": "सार्वजनिक विनिमय दरबाट USD, NPR, INR र अन्य समर्थित मुद्राबीच रूपान्तरणको अनुमान निकाल्नुहोस्। बैंकको कारोबार दर फरक हुन सक्छ।",
  "image-compressor": "JPEG, PNG र WebP तस्बिरको आकार ब्राउजरमै घटाउनुहोस्। फाइल ५० MB भन्दा सानो हुनुपर्छ; GIF र BMP पुनः encoding हुँदा animation वा metadata हराउन सक्छ।",
  "image-format-converter": "समर्थित तस्बिरलाई WebP, JPEG वा PNG मा ब्राउजरमै रूपान्तरण गर्नुहोस्। पारदर्शिता र metadata सम्बन्धी फरक बुझेर format छान्नुहोस्।",
  "color-picker-palette": "HEX र RGB मानसहित रङ छान्नुहोस् र त्यसबाट हल्का shade भएको palette बनाउनुहोस्।",
  "notes-to-pdf": "नोट लेखेर browser print संवादबाट PDF मा सुरक्षित गर्नुहोस्। Unicode को देखावट उपकरणमा उपलब्ध font मा निर्भर हुन्छ।",
  "nepal-share-calculator": "शेयर संख्या, खरिद/बिक्री मूल्य र सम्पादन गर्न मिल्ने brokerage, SEBON, DP तथा CGT दरबाट नाफा अनुमान गर्नुहोस्। शुल्क र करका हालका नियम पुष्टि गर्नुहोस्।",
  "preeti-unicode-converter": "Preeti font मा लेखिएको पाठलाई नेपाली Unicode मा वा Unicode पाठलाई Preeti encoding मा बदल्नुहोस्। मूल पाठ सुरक्षित राखेर नतिजा जाँच्नुहोस्।",
  "nepali-unicode-typing": "Romanized नेपाली टाइप गरेर देवनागरी Unicode मा लिप्यन्तरण गर्नुहोस्। यो अनुवाद होइन; नाम र औपचारिक पाठ जाँच्नुहोस्।",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const request = resolveLocalizedToolRequest(locale, slug);
  if (request.status !== "ok") return localizedToolNotFoundMetadata;
  const metadata = buildLocalizedToolMetadata(request.locale, request.implementation.entry);
  if (request.locale === "ne" && (nepaliLocalizedUtilitySlugs.includes(request.implementation.slug as (typeof nepaliLocalizedUtilitySlugs)[number]) || nepaliLocalizedFinancialSlugs.includes(request.implementation.slug as (typeof nepaliLocalizedFinancialSlugs)[number]) || nepaliLocalizedCareerSlugs.includes(request.implementation.slug as (typeof nepaliLocalizedCareerSlugs)[number]) || nepaliLocalizedPublicInfoSlugs.includes(request.implementation.slug as (typeof nepaliLocalizedPublicInfoSlugs)[number]))) {
    return {
      ...metadata,
      title: `${nepaliTitles[request.implementation.slug]} | PDFora`,
      description: nepaliDescriptions[request.implementation.slug] ?? metadata.description,
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
  const nepaliSpecialToolSlugs = ["currency-converter", "image-compressor", "image-format-converter", "color-picker-palette", "notes-to-pdf", "nepal-share-calculator", "preeti-unicode-converter", "nepali-unicode-typing"];
  if (request.locale === "ne" && nepaliSpecialToolSlugs.includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली विशेष उपयोगी टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliSpecialCatalogWorkspace slug={toolSlug} /></section></main>;
  }
  const nepaliExtraToolSlugs = ["password-generator", "xml-formatter-validator", "regex-tester", "jwt-decoder", "color-contrast-checker", "css-minifier", "json-to-csv", "meta-title-checker", "meta-description-checker", "keyword-density-checker", "robots-txt-generator", "sitemap-generator", "open-graph-preview", "savings-goal-calculator"];
  const nepaliQuickUtilitySlugs = ["csv-to-json", "json-to-yaml", "random-number-generator", "dice-roller", "unix-timestamp-converter", "date-add-subtract-calculator", "business-days-calculator", "px-rem-converter", "aspect-ratio-calculator", "color-converter", "css-gradient-generator", "roman-numeral-converter"];
  if (request.locale === "ne" && nepaliExtraToolSlugs.includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली उपयोगी तथा SEO टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><ExtraTools slug={toolSlug} locale="ne" /></section></main>;
  }
  if (request.locale === "ne" && nepaliQuickUtilitySlugs.includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली गणना तथा रूपान्तरण टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><QuickUtilityTools slug={toolSlug} locale="ne" /></main>;
  }
  if (request.locale === "ne" && ["word-character-counter", "case-converter", "remove-duplicate-lines", "sort-lines", "reverse-text", "whitespace-cleaner", "character-frequency", "word-frequency-counter", "reading-time-calculator", "line-counter", "sentence-counter"].includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली टेक्स्ट टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliTextUtilityWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && ["json-formatter-validator", "base64-encoder-decoder", "url-encoder-decoder", "hash-generator", "text-diff-checker", "lorem-ipsum-generator", "html-encoder-decoder", "text-to-slug", "text-to-binary", "binary-to-text", "text-to-hex", "hex-to-text", "morse-code-translator", "camel-case-converter", "snake-case-converter", "kebab-case-converter", "html-tag-stripper", "json-escape-unescape", "url-query-parser", "url-validator", "email-validator", "password-strength-checker", "uuid-generator"].includes(toolSlug)) {
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
  if (request.locale === "ne" && nepaliLocalizedUtilitySlugs.includes(toolSlug as (typeof nepaliLocalizedUtilitySlugs)[number])) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली उपयोगी टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">यो पृष्ठका मुख्य निर्देशन र नतिजा नेपालीमा उपलब्ध छन्।</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliUtilityWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && nepaliLocalizedCareerSlugs.includes(toolSlug as (typeof nepaliLocalizedCareerSlugs)[number])) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली करियर तथा AI टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">वास्तविक विवरण प्रयोग गर्नुहोस्, AI नतिजा जाँच गर्नुहोस् र गोप्य जानकारी नपठाउनुहोस्।</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><AIWritingTools slug={toolSlug} locale="ne" /></section></main>;
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
