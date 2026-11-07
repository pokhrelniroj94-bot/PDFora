import { isLocale, type Locale } from "./config";

export type SharedUiCopy = {
  footerNavigation: string;
  allTools: string;
  guides: string;
  about: string;
  contact: string;
  language: string;
  languageHint: string;
  englishHomepageNotice: string;
  directoryLabel: string;
  directoryEyebrow: string;
  directoryTitle: string;
  directoryDescription: string;
  directoryLink: string;
  cookie: {
    consentLabel: string;
    privacyChoices: string;
    consentDescription: string;
    rejectOptional: string;
    customize: string;
    acceptAll: string;
    settings: string;
    settingsDescription: string;
    essential: string;
    essentialDescription: string;
    alwaysOn: string;
    analytics: string;
    analyticsDescription: string;
    advertising: string;
    advertisingDescription: string;
    closeSettings: string;
    savePreferences: string;
    privacyPolicy: string;
  };
  groups: Record<"Organize PDF" | "Convert PDF" | "Edit PDF" | "Secure & manage", string>;
};

const english: SharedUiCopy = {
  footerNavigation: "Footer navigation",
  allTools: "All Tools",
  guides: "Guides & Tutorials",
  about: "About PDFora",
  contact: "Contact",
  language: "Language",
  languageHint: "Choose a translated page where available; otherwise a clear fallback is shown.",
  englishHomepageNotice: "Nepali homepage available; other pages are being translated.",
  directoryLabel: "Explore PDFora PDF tools",
  directoryEyebrow: "PDFora toolbox",
  directoryTitle: "Explore all tools",
  directoryDescription: "PDF tools are here, with finance, text, developer and image utilities in our all-tools hub.",
  directoryLink: "Explore finance, text, developer & image tools →",
  cookie: {
    consentLabel: "Cookie consent",
    privacyChoices: "Your privacy choices",
    consentDescription: "PDFora uses essential storage to keep the site working. With your permission, analytics cookies help us understand site usage. You can change your choice anytime in Cookie settings.",
    rejectOptional: "Reject optional",
    customize: "Customize",
    acceptAll: "Accept all",
    settings: "Cookie settings",
    settingsDescription: "Choose which optional cookies PDFora may use. Essential storage is always active because it supports core site functions and remembers your privacy choice.",
    essential: "Essential",
    essentialDescription: "Required for basic site operation",
    alwaysOn: "Always on",
    analytics: "Analytics",
    analyticsDescription: "Helps us understand visits and improve tools",
    advertising: "Advertising",
    advertisingDescription: "Stores your preference for advertising-related technologies",
    closeSettings: "Close cookie settings",
    savePreferences: "Save preferences",
    privacyPolicy: "Read our privacy policy",
  },
  groups: {
    "Organize PDF": "Organize PDF",
    "Convert PDF": "Convert PDF",
    "Edit PDF": "Edit PDF",
    "Secure & manage": "Secure & manage",
  },
};

const nepali: SharedUiCopy = {
  footerNavigation: "फुटर नेभिगेसन",
  allTools: "सबै टुलहरू",
  guides: "गाइड तथा ट्युटोरियल",
  about: "PDFora बारेमा",
  contact: "सम्पर्क",
  language: "भाषा",
  languageHint: "अनुवाद उपलब्ध भएको पृष्ठ छान्नुहोस्; नभए स्पष्ट fallback देखाइन्छ।",
  englishHomepageNotice: "हाल नेपाली होमपेज उपलब्ध छ; अन्य पेजहरू अनुवाद हुँदैछन्।",
  directoryLabel: "PDFora का PDF टुलहरू",
  directoryEyebrow: "PDFora टुल संग्रह",
  directoryTitle: "सबै PDF टुलहरू",
  directoryDescription: "PDF टुलसँगै वित्त, टेक्स्ट, डेभलपर र इमेज उपयोगिताहरू सबै टुल पृष्ठमा उपलब्ध छन्।",
  directoryLink: "वित्त, टेक्स्ट, डेभलपर र इमेज टुलहरू हेर्नुहोस् →",
  cookie: {
    consentLabel: "कुकी सहमति",
    privacyChoices: "तपाईंका गोपनीयता विकल्प",
    consentDescription: "साइट चलाउन PDFora ले आवश्यक भण्डारण प्रयोग गर्छ। तपाईंको अनुमतिमा विश्लेषणात्मक कुकीले साइट प्रयोग बुझ्न मद्दत गर्छ। कुकी सेटिङबाट विकल्प जुनसुकै बेला बदल्न सकिन्छ।",
    rejectOptional: "वैकल्पिक अस्वीकार",
    customize: "अनुकूलन",
    acceptAll: "सबै स्वीकार",
    settings: "कुकी सेटिङ",
    settingsDescription: "PDFora ले प्रयोग गर्न पाउने वैकल्पिक कुकी छान्नुहोस्। आवश्यक भण्डारण सधैं सक्रिय हुन्छ, किनकि यसले मुख्य सुविधा र तपाईंको गोपनीयता विकल्प सम्झन्छ।",
    essential: "आवश्यक",
    essentialDescription: "साइटको आधारभूत सञ्चालनका लागि आवश्यक",
    alwaysOn: "सधैं सक्रिय",
    analytics: "विश्लेषण",
    analyticsDescription: "भ्रमण बुझ्न र टुल सुधार्न मद्दत गर्छ",
    advertising: "विज्ञापन",
    advertisingDescription: "विज्ञापनसम्बन्धी प्रविधिका लागि तपाईंको विकल्प सम्झन्छ",
    closeSettings: "कुकी सेटिङ बन्द गर्नुहोस्",
    savePreferences: "विकल्प सुरक्षित गर्नुहोस्",
    privacyPolicy: "गोपनीयता नीति पढ्नुहोस्",
  },
  groups: {
    "Organize PDF": "PDF मिलाउने",
    "Convert PDF": "PDF रूपान्तरण",
    "Edit PDF": "PDF सम्पादन",
    "Secure & manage": "सुरक्षा र व्यवस्थापन",
  },
};

const localized: Partial<Record<Locale, Omit<SharedUiCopy, "cookie" | "groups"> & {
  cookie: SharedUiCopy["cookie"];
  groups: SharedUiCopy["groups"];
}>> = {
  hi: {
    footerNavigation: "फ़ुटर नेविगेशन", allTools: "सभी टूल", guides: "गाइड और ट्यूटोरियल", about: "PDFora के बारे में", contact: "संपर्क",
    language: "भाषा", languageHint: "जहाँ अनुवाद उपलब्ध हो वहाँ वह पृष्ठ चुनें; अन्यथा स्पष्ट वैकल्पिक संदेश दिखेगा।",
    englishHomepageNotice: "नेपाली होमपेज उपलब्ध है; अन्य पृष्ठों का अनुवाद जारी है।",
    directoryLabel: "PDFora के PDF टूल देखें", directoryEyebrow: "PDFora टूलबॉक्स", directoryTitle: "सभी टूल देखें",
    directoryDescription: "PDF टूल के साथ वित्त, टेक्स्ट, डेवलपर और इमेज उपयोगिताएँ हमारे सभी टूल केंद्र में उपलब्ध हैं।",
    directoryLink: "वित्त, टेक्स्ट, डेवलपर और इमेज टूल देखें →",
    cookie: { consentLabel: "कुकी सहमति", privacyChoices: "आपकी गोपनीयता पसंद", consentDescription: "PDFora साइट चलाने के लिए आवश्यक स्टोरेज का उपयोग करता है। आपकी अनुमति से एनालिटिक्स कुकी साइट के उपयोग को समझने में मदद करती हैं। आप कुकी सेटिंग में कभी भी अपनी पसंद बदल सकते हैं।", rejectOptional: "वैकल्पिक अस्वीकार करें", customize: "अनुकूलित करें", acceptAll: "सभी स्वीकार करें", settings: "कुकी सेटिंग", settingsDescription: "चुनें कि PDFora किन वैकल्पिक कुकी का उपयोग कर सकता है। आवश्यक स्टोरेज हमेशा सक्रिय रहता है क्योंकि यह मुख्य सुविधाओं और आपकी गोपनीयता पसंद को बनाए रखता है।", essential: "आवश्यक", essentialDescription: "साइट के मूल संचालन के लिए ज़रूरी", alwaysOn: "हमेशा चालू", analytics: "एनालिटिक्स", analyticsDescription: "विज़िट समझने और टूल बेहतर बनाने में मदद करता है", advertising: "विज्ञापन", advertisingDescription: "विज्ञापन-संबंधी तकनीकों के लिए आपकी पसंद सहेजता है", closeSettings: "कुकी सेटिंग बंद करें", savePreferences: "पसंद सहेजें", privacyPolicy: "हमारी गोपनीयता नीति पढ़ें" },
    groups: { "Organize PDF": "PDF व्यवस्थित करें", "Convert PDF": "PDF बदलें", "Edit PDF": "PDF संपादित करें", "Secure & manage": "सुरक्षा और प्रबंधन" },
  },
  bn: {
    footerNavigation: "ফুটার নেভিগেশন", allTools: "সব টুল", guides: "গাইড ও টিউটোরিয়াল", about: "PDFora সম্পর্কে", contact: "যোগাযোগ",
    language: "ভাষা", languageHint: "অনুবাদ পাওয়া গেলে সেই পৃষ্ঠা বেছে নিন; না থাকলে স্পষ্ট বিকল্প বার্তা দেখানো হবে।",
    englishHomepageNotice: "নেপালি হোমপেজ উপলব্ধ; অন্যান্য পৃষ্ঠার অনুবাদ চলছে।",
    directoryLabel: "PDFora PDF টুল দেখুন", directoryEyebrow: "PDFora টুলবক্স", directoryTitle: "সব টুল দেখুন",
    directoryDescription: "PDF টুলের পাশাপাশি অর্থ, টেক্সট, ডেভেলপার ও ছবি-সংক্রান্ত ইউটিলিটি আমাদের সব টুল কেন্দ্রে রয়েছে।",
    directoryLink: "অর্থ, টেক্সট, ডেভেলপার ও ছবি টুল দেখুন →",
    cookie: { consentLabel: "কুকি সম্মতি", privacyChoices: "আপনার গোপনীয়তার পছন্দ", consentDescription: "সাইট সচল রাখতে PDFora প্রয়োজনীয় স্টোরেজ ব্যবহার করে। আপনার অনুমতিতে অ্যানালিটিক্স কুকি সাইটের ব্যবহার বুঝতে সাহায্য করে। কুকি সেটিংস থেকে যেকোনো সময় পছন্দ বদলাতে পারেন।", rejectOptional: "ঐচ্ছিক কুকি প্রত্যাখ্যান", customize: "পছন্দ নির্ধারণ", acceptAll: "সব গ্রহণ", settings: "কুকি সেটিংস", settingsDescription: "PDFora কোন ঐচ্ছিক কুকি ব্যবহার করতে পারবে তা বেছে নিন। মূল সাইট-সুবিধা ও আপনার গোপনীয়তার পছন্দ সংরক্ষণের জন্য প্রয়োজনীয় স্টোরেজ সবসময় চালু থাকে।", essential: "প্রয়োজনীয়", essentialDescription: "সাইটের মৌলিক কাজের জন্য দরকার", alwaysOn: "সবসময় চালু", analytics: "অ্যানালিটিক্স", analyticsDescription: "ভিজিট বুঝতে ও টুল উন্নত করতে সাহায্য করে", advertising: "বিজ্ঞাপন", advertisingDescription: "বিজ্ঞাপন-সম্পর্কিত প্রযুক্তির জন্য আপনার পছন্দ সংরক্ষণ করে", closeSettings: "কুকি সেটিংস বন্ধ করুন", savePreferences: "পছন্দ সংরক্ষণ করুন", privacyPolicy: "আমাদের গোপনীয়তা নীতি পড়ুন" },
    groups: { "Organize PDF": "PDF সাজান", "Convert PDF": "PDF রূপান্তর", "Edit PDF": "PDF সম্পাদনা", "Secure & manage": "নিরাপত্তা ও ব্যবস্থাপনা" },
  },
  ur: {
    footerNavigation: "فٹر نیویگیشن", allTools: "تمام ٹولز", guides: "رہنما اور سبق", about: "PDFora کے بارے میں", contact: "رابطہ",
    language: "زبان", languageHint: "جہاں ترجمہ دستیاب ہو وہ صفحہ منتخب کریں؛ ورنہ واضح متبادل پیغام دکھایا جائے گا۔",
    englishHomepageNotice: "نیپالی ہوم پیج دستیاب ہے؛ دیگر صفحات کا ترجمہ جاری ہے۔",
    directoryLabel: "PDFora کے PDF ٹولز دیکھیں", directoryEyebrow: "PDFora ٹول باکس", directoryTitle: "تمام ٹولز دیکھیں",
    directoryDescription: "PDF ٹولز کے ساتھ مالیات، متن، ڈویلپر اور تصاویر کی افادیتیں ہمارے تمام ٹولز مرکز میں دستیاب ہیں۔",
    directoryLink: "مالیات، متن، ڈویلپر اور تصاویر کے ٹولز دیکھیں ←",
    cookie: { consentLabel: "کوکی کی رضامندی", privacyChoices: "آپ کی رازداری کی ترجیحات", consentDescription: "PDFora ویب سائٹ چلانے کے لیے ضروری اسٹوریج استعمال کرتا ہے۔ آپ کی اجازت سے تجزیاتی کوکیز سائٹ کے استعمال کو سمجھنے میں مدد دیتی ہیں۔ آپ کوکی سیٹنگز میں کسی بھی وقت اپنی ترجیح بدل سکتے ہیں۔", rejectOptional: "اختیاری کوکیز مسترد کریں", customize: "ترتیبات بدلیں", acceptAll: "سب قبول کریں", settings: "کوکی سیٹنگز", settingsDescription: "منتخب کریں کہ PDFora کون سی اختیاری کوکیز استعمال کر سکتا ہے۔ بنیادی خصوصیات اور آپ کی رازداری کی ترجیح محفوظ رکھنے کے لیے ضروری اسٹوریج ہمیشہ فعال رہتا ہے۔", essential: "ضروری", essentialDescription: "ویب سائٹ کے بنیادی کام کے لیے لازمی", alwaysOn: "ہمیشہ فعال", analytics: "تجزیات", analyticsDescription: "وزٹس سمجھنے اور ٹولز بہتر بنانے میں مدد دیتا ہے", advertising: "اشتہارات", advertisingDescription: "اشتہارات سے متعلق ٹیکنالوجیز کے لیے آپ کی ترجیح محفوظ کرتا ہے", closeSettings: "کوکی سیٹنگز بند کریں", savePreferences: "ترجیحات محفوظ کریں", privacyPolicy: "ہماری رازداری کی پالیسی پڑھیں" },
    groups: { "Organize PDF": "PDF منظم کریں", "Convert PDF": "PDF تبدیل کریں", "Edit PDF": "PDF میں ترمیم", "Secure & manage": "تحفظ اور انتظام" },
  },
  ar: {
    footerNavigation: "التنقل في التذييل", allTools: "كل الأدوات", guides: "الأدلة والشروحات", about: "عن PDFora", contact: "اتصل بنا",
    language: "اللغة", languageHint: "اختر صفحة مترجمة عند توفرها؛ وإلا فستظهر رسالة بديلة واضحة.",
    englishHomepageNotice: "الصفحة الرئيسية باللغة النيبالية متاحة؛ وتجري ترجمة الصفحات الأخرى.",
    directoryLabel: "استكشف أدوات PDFora", directoryEyebrow: "مجموعة أدوات PDFora", directoryTitle: "استكشف جميع الأدوات",
    directoryDescription: "تتوفر أدوات PDF إلى جانب أدوات المال والنصوص والمطورين والصور في مركز جميع الأدوات.",
    directoryLink: "استكشف أدوات المال والنصوص والمطورين والصور ←",
    cookie: { consentLabel: "الموافقة على ملفات تعريف الارتباط", privacyChoices: "خيارات الخصوصية", consentDescription: "يستخدم PDFora مساحة تخزين أساسية لتشغيل الموقع. وبموافقتك، تساعد ملفات التحليلات على فهم استخدام الموقع. يمكنك تغيير اختيارك في أي وقت من إعدادات ملفات تعريف الارتباط.", rejectOptional: "رفض الاختيارية", customize: "تخصيص", acceptAll: "قبول الكل", settings: "إعدادات ملفات تعريف الارتباط", settingsDescription: "اختر ملفات تعريف الارتباط الاختيارية التي يمكن أن يستخدمها PDFora. يظل التخزين الأساسي مفعلاً لدعم وظائف الموقع وحفظ اختيار الخصوصية.", essential: "أساسية", essentialDescription: "مطلوبة لتشغيل الموقع الأساسي", alwaysOn: "مفعّلة دائماً", analytics: "التحليلات", analyticsDescription: "تساعدنا على فهم الزيارات وتحسين الأدوات", advertising: "الإعلانات", advertisingDescription: "تحفظ اختيارك بشأن تقنيات الإعلانات", closeSettings: "إغلاق إعدادات ملفات تعريف الارتباط", savePreferences: "حفظ التفضيلات", privacyPolicy: "اقرأ سياسة الخصوصية" },
    groups: { "Organize PDF": "تنظيم PDF", "Convert PDF": "تحويل PDF", "Edit PDF": "تعديل PDF", "Secure & manage": "الحماية والإدارة" },
  },
  es: {
    footerNavigation: "Navegación del pie de página", allTools: "Todas las herramientas", guides: "Guías y tutoriales", about: "Acerca de PDFora", contact: "Contacto",
    language: "Idioma", languageHint: "Elige una página traducida cuando esté disponible; de lo contrario, se mostrará una alternativa clara.",
    englishHomepageNotice: "La página principal en nepalí está disponible; las demás páginas se están traduciendo.",
    directoryLabel: "Explora las herramientas PDF de PDFora", directoryEyebrow: "Herramientas de PDFora", directoryTitle: "Explora todas las herramientas",
    directoryDescription: "Además de herramientas PDF, nuestro centro reúne utilidades de finanzas, texto, desarrollo e imágenes.",
    directoryLink: "Explora herramientas de finanzas, texto, desarrollo e imágenes →",
    cookie: { consentLabel: "Consentimiento de cookies", privacyChoices: "Tus opciones de privacidad", consentDescription: "PDFora utiliza almacenamiento esencial para mantener el sitio en funcionamiento. Con tu permiso, las cookies de analítica nos ayudan a comprender el uso del sitio. Puedes cambiar tu elección en cualquier momento en la configuración de cookies.", rejectOptional: "Rechazar opcionales", customize: "Personalizar", acceptAll: "Aceptar todas", settings: "Configuración de cookies", settingsDescription: "Elige qué cookies opcionales puede utilizar PDFora. El almacenamiento esencial siempre está activo porque permite las funciones básicas y recuerda tu elección de privacidad.", essential: "Esenciales", essentialDescription: "Necesarias para el funcionamiento básico del sitio", alwaysOn: "Siempre activas", analytics: "Analítica", analyticsDescription: "Nos ayuda a comprender las visitas y mejorar las herramientas", advertising: "Publicidad", advertisingDescription: "Guarda tu preferencia sobre tecnologías relacionadas con la publicidad", closeSettings: "Cerrar configuración de cookies", savePreferences: "Guardar preferencias", privacyPolicy: "Lee nuestra política de privacidad" },
    groups: { "Organize PDF": "Organizar PDF", "Convert PDF": "Convertir PDF", "Edit PDF": "Editar PDF", "Secure & manage": "Seguridad y gestión" },
  },
  fr: {
    footerNavigation: "Navigation de pied de page", allTools: "Tous les outils", guides: "Guides et tutoriels", about: "À propos de PDFora", contact: "Contact",
    language: "Langue", languageHint: "Choisissez une page traduite lorsqu’elle est disponible ; sinon, un message de remplacement explicite s’affiche.",
    englishHomepageNotice: "La page d’accueil en népalais est disponible ; les autres pages sont en cours de traduction.",
    directoryLabel: "Découvrir les outils PDF de PDFora", directoryEyebrow: "Boîte à outils PDFora", directoryTitle: "Découvrir tous les outils",
    directoryDescription: "En plus des outils PDF, notre espace regroupe des utilitaires de finance, de texte, de développement et d’image.",
    directoryLink: "Découvrir les outils de finance, texte, développement et image →",
    cookie: { consentLabel: "Consentement aux cookies", privacyChoices: "Vos choix de confidentialité", consentDescription: "PDFora utilise un stockage essentiel au fonctionnement du site. Avec votre autorisation, les cookies analytiques nous aident à comprendre l’utilisation du site. Vous pouvez modifier votre choix à tout moment dans les paramètres des cookies.", rejectOptional: "Refuser les optionnels", customize: "Personnaliser", acceptAll: "Tout accepter", settings: "Paramètres des cookies", settingsDescription: "Choisissez les cookies facultatifs que PDFora peut utiliser. Le stockage essentiel reste toujours actif pour assurer les fonctions principales et mémoriser votre choix de confidentialité.", essential: "Essentiels", essentialDescription: "Nécessaires au fonctionnement de base du site", alwaysOn: "Toujours actifs", analytics: "Analyse", analyticsDescription: "Nous aide à comprendre les visites et à améliorer les outils", advertising: "Publicité", advertisingDescription: "Enregistre votre choix concernant les technologies publicitaires", closeSettings: "Fermer les paramètres des cookies", savePreferences: "Enregistrer les préférences", privacyPolicy: "Lire notre politique de confidentialité" },
    groups: { "Organize PDF": "Organiser les PDF", "Convert PDF": "Convertir les PDF", "Edit PDF": "Modifier les PDF", "Secure & manage": "Sécurité et gestion" },
  },
  de: {
    footerNavigation: "Fußzeilennavigation", allTools: "Alle Tools", guides: "Anleitungen und Tutorials", about: "Über PDFora", contact: "Kontakt",
    language: "Sprache", languageHint: "Wähle eine übersetzte Seite, sofern verfügbar; andernfalls wird ein deutlicher Ersatzhinweis angezeigt.",
    englishHomepageNotice: "Die nepalesische Startseite ist verfügbar; weitere Seiten werden übersetzt.",
    directoryLabel: "PDFora-PDF-Tools entdecken", directoryEyebrow: "PDFora-Werkzeugkasten", directoryTitle: "Alle Tools entdecken",
    directoryDescription: "Neben PDF-Tools bietet unser Toolbereich Dienstprogramme für Finanzen, Text, Entwicklung und Bilder.",
    directoryLink: "Tools für Finanzen, Text, Entwicklung und Bilder entdecken →",
    cookie: { consentLabel: "Cookie-Einwilligung", privacyChoices: "Deine Datenschutzeinstellungen", consentDescription: "PDFora verwendet erforderlichen Speicher, damit die Website funktioniert. Mit deiner Zustimmung helfen Analyse-Cookies uns, die Nutzung der Website zu verstehen. Du kannst deine Auswahl jederzeit in den Cookie-Einstellungen ändern.", rejectOptional: "Optionale ablehnen", customize: "Anpassen", acceptAll: "Alle akzeptieren", settings: "Cookie-Einstellungen", settingsDescription: "Wähle aus, welche optionalen Cookies PDFora verwenden darf. Erforderlicher Speicher bleibt immer aktiv, da er grundlegende Funktionen unterstützt und deine Datenschutzauswahl speichert.", essential: "Erforderlich", essentialDescription: "Für den grundlegenden Betrieb der Website notwendig", alwaysOn: "Immer aktiv", analytics: "Analyse", analyticsDescription: "Hilft uns, Besuche zu verstehen und Tools zu verbessern", advertising: "Werbung", advertisingDescription: "Speichert deine Auswahl zu werbebezogenen Technologien", closeSettings: "Cookie-Einstellungen schließen", savePreferences: "Einstellungen speichern", privacyPolicy: "Datenschutzerklärung lesen" },
    groups: { "Organize PDF": "PDF organisieren", "Convert PDF": "PDF konvertieren", "Edit PDF": "PDF bearbeiten", "Secure & manage": "Sicherheit und Verwaltung" },
  },
  pt: {
    footerNavigation: "Navegação do rodapé", allTools: "Todas as ferramentas", guides: "Guias e tutoriais", about: "Sobre o PDFora", contact: "Contato",
    language: "Idioma", languageHint: "Escolha uma página traduzida quando disponível; caso contrário, será exibida uma alternativa clara.",
    englishHomepageNotice: "A página inicial em nepalês está disponível; as demais páginas estão sendo traduzidas.",
    directoryLabel: "Explore as ferramentas PDF do PDFora", directoryEyebrow: "Caixa de ferramentas PDFora", directoryTitle: "Explore todas as ferramentas",
    directoryDescription: "Além de ferramentas PDF, nosso centro reúne utilitários de finanças, texto, desenvolvimento e imagens.",
    directoryLink: "Explore ferramentas de finanças, texto, desenvolvimento e imagens →",
    cookie: { consentLabel: "Consentimento de cookies", privacyChoices: "Suas escolhas de privacidade", consentDescription: "O PDFora usa armazenamento essencial para manter o site funcionando. Com sua permissão, cookies de análise ajudam a entender o uso do site. Você pode mudar sua escolha a qualquer momento nas configurações de cookies.", rejectOptional: "Rejeitar opcionais", customize: "Personalizar", acceptAll: "Aceitar todos", settings: "Configurações de cookies", settingsDescription: "Escolha quais cookies opcionais o PDFora pode usar. O armazenamento essencial permanece sempre ativo porque oferece suporte às funções principais e guarda sua escolha de privacidade.", essential: "Essenciais", essentialDescription: "Necessários para o funcionamento básico do site", alwaysOn: "Sempre ativos", analytics: "Análise", analyticsDescription: "Ajuda a entender as visitas e melhorar as ferramentas", advertising: "Publicidade", advertisingDescription: "Armazena sua preferência sobre tecnologias relacionadas à publicidade", closeSettings: "Fechar configurações de cookies", savePreferences: "Salvar preferências", privacyPolicy: "Leia nossa política de privacidade" },
    groups: { "Organize PDF": "Organizar PDF", "Convert PDF": "Converter PDF", "Edit PDF": "Editar PDF", "Secure & manage": "Segurança e gestão" },
  },
  zh: {
    footerNavigation: "页脚导航", allTools: "所有工具", guides: "指南与教程", about: "关于 PDFora", contact: "联系",
    language: "语言", languageHint: "如果有对应的翻译页面，请选择该页面；否则会显示明确的替代提示。",
    englishHomepageNotice: "尼泊尔语首页已开放；其他页面正在翻译中。",
    directoryLabel: "探索 PDFora PDF 工具", directoryEyebrow: "PDFora 工具箱", directoryTitle: "探索所有工具",
    directoryDescription: "除了 PDF 工具，所有工具中心还提供财务、文本、开发者和图像实用工具。",
    directoryLink: "探索财务、文本、开发者和图像工具 →",
    cookie: { consentLabel: "Cookie 同意", privacyChoices: "你的隐私选项", consentDescription: "PDFora 使用必要存储来维持网站运行。经你许可，分析 Cookie 可帮助我们了解网站使用情况。你可以随时在 Cookie 设置中更改选择。", rejectOptional: "拒绝可选项", customize: "自定义", acceptAll: "全部接受", settings: "Cookie 设置", settingsDescription: "选择 PDFora 可以使用哪些可选 Cookie。必要存储始终启用，因为它支持网站核心功能并记住你的隐私选择。", essential: "必要", essentialDescription: "网站基本运行所必需", alwaysOn: "始终启用", analytics: "分析", analyticsDescription: "帮助我们了解访问情况并改进工具", advertising: "广告", advertisingDescription: "保存你对广告相关技术的偏好", closeSettings: "关闭 Cookie 设置", savePreferences: "保存偏好设置", privacyPolicy: "阅读隐私政策" },
    groups: { "Organize PDF": "整理 PDF", "Convert PDF": "转换 PDF", "Edit PDF": "编辑 PDF", "Secure & manage": "安全与管理" },
  },
  ja: {
    footerNavigation: "フッターナビゲーション", allTools: "すべてのツール", guides: "ガイドとチュートリアル", about: "PDFora について", contact: "お問い合わせ",
    language: "言語", languageHint: "翻訳済みページがある場合は選択してください。ない場合は明確な代替メッセージが表示されます。",
    englishHomepageNotice: "ネパール語のホームページを利用できます。他のページは翻訳中です。",
    directoryLabel: "PDFora の PDF ツールを見る", directoryEyebrow: "PDFora ツールボックス", directoryTitle: "すべてのツールを見る",
    directoryDescription: "PDF ツールに加え、金融、テキスト、開発者、画像向けの便利なツールを一覧で利用できます。",
    directoryLink: "金融・テキスト・開発者・画像ツールを見る →",
    cookie: { consentLabel: "Cookie の同意", privacyChoices: "プライバシー設定", consentDescription: "PDFora はサイトの動作に必要なストレージを使用します。許可をいただいた場合、分析 Cookie はサイトの利用状況の把握に役立ちます。Cookie 設定からいつでも選択を変更できます。", rejectOptional: "任意の Cookie を拒否", customize: "カスタマイズ", acceptAll: "すべて許可", settings: "Cookie 設定", settingsDescription: "PDFora が使用できる任意の Cookie を選択してください。必要なストレージは、基本機能を支えプライバシー設定を保存するため、常に有効です。", essential: "必須", essentialDescription: "サイトの基本動作に必要", alwaysOn: "常に有効", analytics: "分析", analyticsDescription: "アクセス状況の把握とツール改善に役立ちます", advertising: "広告", advertisingDescription: "広告関連技術に関する設定を保存します", closeSettings: "Cookie 設定を閉じる", savePreferences: "設定を保存", privacyPolicy: "プライバシーポリシーを読む" },
    groups: { "Organize PDF": "PDF の整理", "Convert PDF": "PDF の変換", "Edit PDF": "PDF の編集", "Secure & manage": "セキュリティと管理" },
  },
};

const copies: Partial<Record<Locale, SharedUiCopy>> = { en: english, ne: nepali };
for (const [locale, copy] of Object.entries(localized) as [Locale, typeof localized[Locale]][]) {
  if (copy) copies[locale] = { ...english, ...copy, cookie: { ...english.cookie, ...copy.cookie }, groups: { ...english.groups, ...copy.groups } };
}

export function getSharedUiCopy(locale: Locale): SharedUiCopy {
  return copies[locale] ?? english;
}

export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && isLocale(first) ? first : "en";
}
