export type HomeLocale = {
  code: string;
  name: string;
  nativeName: string;
  dir?: "rtl";
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  primary: string;
  secondary: string;
  popular: string;
  toolsIntro: string;
  tools: { href: string; title: string; description: string }[];
  note: string;
  footer: string;
};

export const homeLocales: Record<string, HomeLocale> = {
  hi: {
    code: "hi", name: "Hindi", nativeName: "हिन्दी",
    title: "मुफ़्त ऑनलाइन PDF टूल और उपयोगी डिजिटल टूल | PDFora",
    description: "PDF फ़ाइलों को मर्ज, स्प्लिट, कंप्रेस और कन्वर्ट करें। PDFora के उपयोगी ऑनलाइन टूल मुफ़्त में इस्तेमाल करें।",
    eyebrow: "आपका रोज़मर्रा का डिजिटल कार्यक्षेत्र",
    heading: "कम मेहनत में, ज़्यादा काम।",
    intro: "PDF संपादन, इमेज कन्वर्ज़न और रोज़मर्रा के डिजिटल कामों के लिए सरल ऑनलाइन टूल। किसी सॉफ़्टवेयर को इंस्टॉल करने की ज़रूरत नहीं।",
    primary: "सभी टूल देखें", secondary: "लोकप्रिय टूल",
    popular: "लोकप्रिय PDF टूल", toolsIntro: "अपना काम चुनें और संबंधित टूल खोलें।",
    tools: [
      { href: "/merge-pdf", title: "PDF जोड़ें", description: "कई PDF फ़ाइलों को एक दस्तावेज़ में जोड़ें।" },
      { href: "/split-pdf", title: "PDF विभाजित करें", description: "पृष्ठों या चुनी हुई रेंज को अलग करें।" },
      { href: "/compress-pdf", title: "PDF का आकार घटाएँ", description: "PDF फ़ाइल को साझा करने के लिए छोटा करें।" },
      { href: "/pdf-to-word", title: "PDF से Word", description: "समर्थित PDF को संपादन योग्य Word दस्तावेज़ में बदलें।" },
      { href: "/pdf-to-jpg", title: "PDF से JPG", description: "PDF पृष्ठों को JPG चित्रों में बदलें।" },
      { href: "/rotate-pdf", title: "PDF घुमाएँ", description: "पृष्ठों को सही दिशा में घुमाएँ।" },
    ],
    note: "नोट: अभी टूल के कार्यक्षेत्र अंग्रेज़ी में खुलते हैं। स्थानीयकृत टूल इंटरफ़ेस चरणबद्ध तरीके से जोड़े जा रहे हैं।",
    footer: "© 2026 PDFora — मुफ़्त ऑनलाइन टूल",
  },
  es: {
    code: "es", name: "Spanish", nativeName: "Español",
    title: "Herramientas PDF gratuitas en línea | PDFora",
    description: "Une, divide, comprime y convierte archivos PDF con las herramientas gratuitas en línea de PDFora.",
    eyebrow: "Tu espacio digital para el día a día",
    heading: "Haz más. Con menos esfuerzo.",
    intro: "Herramientas sencillas en línea para editar PDF, convertir imágenes y resolver tareas digitales cotidianas. No necesitas instalar software.",
    primary: "Ver todas las herramientas", secondary: "Herramientas populares",
    popular: "Herramientas PDF populares", toolsIntro: "Elige una tarea y abre la herramienta correspondiente.",
    tools: [
      { href: "/merge-pdf", title: "Unir PDF", description: "Combina varios archivos PDF en un solo documento." },
      { href: "/split-pdf", title: "Dividir PDF", description: "Separa páginas o rangos de páginas." },
      { href: "/compress-pdf", title: "Comprimir PDF", description: "Reduce el tamaño del archivo para compartirlo." },
      { href: "/pdf-to-word", title: "PDF a Word", description: "Convierte PDF compatibles en documentos Word editables." },
      { href: "/pdf-to-jpg", title: "PDF a JPG", description: "Convierte las páginas PDF en imágenes JPG." },
      { href: "/rotate-pdf", title: "Girar PDF", description: "Gira las páginas a la orientación correcta." },
    ],
    note: "Nota: por ahora, las herramientas se abren con su interfaz en inglés. Las interfaces traducidas se incorporarán gradualmente.",
    footer: "© 2026 PDFora — Herramientas gratuitas en línea",
  },
  fr: {
    code: "fr", name: "French", nativeName: "Français",
    title: "Outils PDF gratuits en ligne | PDFora",
    description: "Fusionnez, divisez, compressez et convertissez vos fichiers PDF avec les outils gratuits de PDFora.",
    eyebrow: "Votre espace numérique au quotidien",
    heading: "Faites-en plus, simplement.",
    intro: "Des outils en ligne simples pour modifier des PDF, convertir des images et accomplir vos tâches numériques. Aucun logiciel à installer.",
    primary: "Voir tous les outils", secondary: "Outils populaires",
    popular: "Outils PDF populaires", toolsIntro: "Choisissez une tâche pour ouvrir l’outil correspondant.",
    tools: [
      { href: "/merge-pdf", title: "Fusionner des PDF", description: "Réunissez plusieurs fichiers PDF dans un seul document." },
      { href: "/split-pdf", title: "Diviser un PDF", description: "Séparez des pages ou des plages de pages." },
      { href: "/compress-pdf", title: "Compresser un PDF", description: "Réduisez la taille du fichier pour le partager." },
      { href: "/pdf-to-word", title: "PDF en Word", description: "Convertissez les PDF compatibles en documents Word modifiables." },
      { href: "/pdf-to-jpg", title: "PDF en JPG", description: "Convertissez les pages PDF en images JPG." },
      { href: "/rotate-pdf", title: "Faire pivoter un PDF", description: "Faites pivoter les pages dans le bon sens." },
    ],
    note: "Remarque : les outils s’ouvrent actuellement avec une interface en anglais. Les interfaces traduites seront ajoutées progressivement.",
    footer: "© 2026 PDFora — Outils gratuits en ligne",
  },
  de: {
    code: "de", name: "German", nativeName: "Deutsch",
    title: "Kostenlose Online-PDF-Tools | PDFora",
    description: "PDF-Dateien kostenlos online zusammenfügen, teilen, komprimieren und konvertieren mit PDFora.",
    eyebrow: "Ihr digitaler Arbeitsbereich für jeden Tag",
    heading: "Mehr erledigen. Einfacher arbeiten.",
    intro: "Einfache Online-Tools zum Bearbeiten von PDFs, Konvertieren von Bildern und für alltägliche digitale Aufgaben. Keine Installation erforderlich.",
    primary: "Alle Tools ansehen", secondary: "Beliebte Tools",
    popular: "Beliebte PDF-Tools", toolsIntro: "Wählen Sie eine Aufgabe und öffnen Sie das passende Tool.",
    tools: [
      { href: "/merge-pdf", title: "PDF zusammenfügen", description: "Führen Sie mehrere PDF-Dateien zu einem Dokument zusammen." },
      { href: "/split-pdf", title: "PDF teilen", description: "Trennen Sie Seiten oder bestimmte Seitenbereiche." },
      { href: "/compress-pdf", title: "PDF komprimieren", description: "Verringern Sie die Dateigröße zum einfachen Teilen." },
      { href: "/pdf-to-word", title: "PDF zu Word", description: "Wandeln Sie unterstützte PDFs in bearbeitbare Word-Dokumente um." },
      { href: "/pdf-to-jpg", title: "PDF zu JPG", description: "Konvertieren Sie PDF-Seiten in JPG-Bilder." },
      { href: "/rotate-pdf", title: "PDF drehen", description: "Drehen Sie Seiten in die richtige Ausrichtung." },
    ],
    note: "Hinweis: Die Tools öffnen sich derzeit mit englischer Benutzeroberfläche. Übersetzte Tool-Oberflächen werden schrittweise ergänzt.",
    footer: "© 2026 PDFora — Kostenlose Online-Tools",
  },
  pt: {
    code: "pt", name: "Portuguese", nativeName: "Português",
    title: "Ferramentas PDF gratuitas online | PDFora",
    description: "Junte, divida, comprima e converta arquivos PDF com as ferramentas online gratuitas da PDFora.",
    eyebrow: "Seu espaço digital para o dia a dia",
    heading: "Faça mais, com menos esforço.",
    intro: "Ferramentas online simples para editar PDFs, converter imagens e realizar tarefas digitais do cotidiano. Não é preciso instalar programas.",
    primary: "Ver todas as ferramentas", secondary: "Ferramentas populares",
    popular: "Ferramentas PDF populares", toolsIntro: "Escolha uma tarefa e abra a ferramenta correspondente.",
    tools: [
      { href: "/merge-pdf", title: "Juntar PDF", description: "Combine vários arquivos PDF em um único documento." },
      { href: "/split-pdf", title: "Dividir PDF", description: "Separe páginas ou intervalos de páginas." },
      { href: "/compress-pdf", title: "Comprimir PDF", description: "Reduza o tamanho do arquivo para compartilhar." },
      { href: "/pdf-to-word", title: "PDF para Word", description: "Converta PDFs compatíveis em documentos Word editáveis." },
      { href: "/pdf-to-jpg", title: "PDF para JPG", description: "Converta páginas PDF em imagens JPG." },
      { href: "/rotate-pdf", title: "Girar PDF", description: "Gire as páginas para a orientação correta." },
    ],
    note: "Nota: por enquanto, as ferramentas abrem com a interface em inglês. As interfaces traduzidas serão adicionadas gradualmente.",
    footer: "© 2026 PDFora — Ferramentas online gratuitas",
  },
  ar: {
    code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl",
    title: "أدوات PDF مجانية عبر الإنترنت | PDFora",
    description: "ادمج ملفات PDF وقسّمها واضغطها وحوّلها باستخدام أدوات PDFora المجانية عبر الإنترنت.",
    eyebrow: "مساحتك الرقمية للمهام اليومية",
    heading: "أنجز المزيد بسهولة.",
    intro: "أدوات بسيطة عبر الإنترنت لتحرير ملفات PDF وتحويل الصور وإنجاز المهام الرقمية اليومية، دون الحاجة إلى تثبيت برامج.",
    primary: "عرض جميع الأدوات", secondary: "الأدوات الشائعة",
    popular: "أدوات PDF الشائعة", toolsIntro: "اختر المهمة وافتح الأداة المناسبة.",
    tools: [
      { href: "/merge-pdf", title: "دمج ملفات PDF", description: "اجمع عدة ملفات PDF في مستند واحد." },
      { href: "/split-pdf", title: "تقسيم PDF", description: "افصل الصفحات أو نطاقات محددة من الصفحات." },
      { href: "/compress-pdf", title: "ضغط PDF", description: "قلّل حجم الملف لتسهيل مشاركته." },
      { href: "/pdf-to-word", title: "تحويل PDF إلى Word", description: "حوّل ملفات PDF المدعومة إلى مستندات Word قابلة للتحرير." },
      { href: "/pdf-to-jpg", title: "تحويل PDF إلى JPG", description: "حوّل صفحات PDF إلى صور JPG." },
      { href: "/rotate-pdf", title: "تدوير PDF", description: "دوّر الصفحات إلى الاتجاه الصحيح." },
    ],
    note: "ملاحظة: تُفتح الأدوات حاليًا بواجهة باللغة الإنجليزية. ستتم إضافة واجهات الأدوات المترجمة تدريجيًا.",
    footer: "© 2026 PDFora — أدوات مجانية عبر الإنترنت",
  },
  bn: {
    code: "bn", name: "Bengali", nativeName: "বাংলা",
    title: "বিনামূল্যে অনলাইন PDF টুল | PDFora",
    description: "PDFora-এর বিনামূল্যের অনলাইন টুল দিয়ে PDF একত্র করুন, ভাগ করুন, সংকুচিত করুন এবং রূপান্তর করুন।",
    eyebrow: "প্রতিদিনের ডিজিটাল কাজের জায়গা",
    heading: "কম পরিশ্রমে আরও কাজ করুন।",
    intro: "PDF সম্পাদনা, ছবি রূপান্তর এবং দৈনন্দিন ডিজিটাল কাজের জন্য সহজ অনলাইন টুল। কোনো সফটওয়্যার ইনস্টল করতে হবে না।",
    primary: "সব টুল দেখুন", secondary: "জনপ্রিয় টুল",
    popular: "জনপ্রিয় PDF টুল", toolsIntro: "আপনার কাজ বেছে নিয়ে সংশ্লিষ্ট টুল খুলুন।",
    tools: [
      { href: "/merge-pdf", title: "PDF একত্র করুন", description: "একাধিক PDF ফাইলকে একটি নথিতে যুক্ত করুন।" },
      { href: "/split-pdf", title: "PDF ভাগ করুন", description: "পৃষ্ঠা বা নির্দিষ্ট পৃষ্ঠার অংশ আলাদা করুন।" },
      { href: "/compress-pdf", title: "PDF সংকুচিত করুন", description: "শেয়ার করার জন্য PDF ফাইলের আকার কমান।" },
      { href: "/pdf-to-word", title: "PDF থেকে Word", description: "সমর্থিত PDF সম্পাদনাযোগ্য Word নথিতে রূপান্তর করুন।" },
      { href: "/pdf-to-jpg", title: "PDF থেকে JPG", description: "PDF পৃষ্ঠাগুলো JPG ছবিতে রূপান্তর করুন।" },
      { href: "/rotate-pdf", title: "PDF ঘোরান", description: "পৃষ্ঠা সঠিক দিক অনুযায়ী ঘোরান।" },
    ],
    note: "দ্রষ্টব্য: বর্তমানে টুলগুলো ইংরেজি ইন্টারফেসে খোলে। অনূদিত টুল ইন্টারফেস ধাপে ধাপে যোগ করা হবে।",
    footer: "© 2026 PDFora — বিনামূল্যের অনলাইন টুল",
  },
  id: {
    code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia",
    title: "Alat PDF Online Gratis | PDFora",
    description: "Gabungkan, pisahkan, kompres, dan konversi file PDF dengan alat online gratis dari PDFora.",
    eyebrow: "Ruang kerja digital untuk kebutuhan harian",
    heading: "Selesaikan lebih banyak dengan mudah.",
    intro: "Alat online sederhana untuk mengedit PDF, mengonversi gambar, dan menyelesaikan pekerjaan digital sehari-hari. Tanpa instalasi perangkat lunak.",
    primary: "Lihat semua alat", secondary: "Alat populer",
    popular: "Alat PDF populer", toolsIntro: "Pilih pekerjaan Anda dan buka alat yang sesuai.",
    tools: [
      { href: "/merge-pdf", title: "Gabungkan PDF", description: "Satukan beberapa file PDF menjadi satu dokumen." },
      { href: "/split-pdf", title: "Pisahkan PDF", description: "Pisahkan halaman atau rentang halaman tertentu." },
      { href: "/compress-pdf", title: "Kompres PDF", description: "Kurangi ukuran file agar lebih mudah dibagikan." },
      { href: "/pdf-to-word", title: "PDF ke Word", description: "Ubah PDF yang didukung menjadi dokumen Word yang dapat diedit." },
      { href: "/pdf-to-jpg", title: "PDF ke JPG", description: "Ubah halaman PDF menjadi gambar JPG." },
      { href: "/rotate-pdf", title: "Putar PDF", description: "Putar halaman ke orientasi yang benar." },
    ],
    note: "Catatan: saat ini alat terbuka dengan antarmuka berbahasa Inggris. Antarmuka alat terjemahan akan ditambahkan secara bertahap.",
    footer: "© 2026 PDFora — Alat online gratis",
  },
};

export const supportedHomeLanguages = Object.values(homeLocales).map((locale) => ({
  code: locale.code,
  name: locale.name,
  nativeName: locale.nativeName,
  href: locale.code === "en" ? "/" : `/${locale.code}`,
}));

export const homeLanguageAlternates: Record<string, string> = {
  en: "https://pd-fora.vercel.app/",
  ne: "https://pd-fora.vercel.app/ne",
  ...Object.fromEntries(Object.keys(homeLocales).filter((code) => code !== "en" && code !== "ne").map((code) => [code, `https://pd-fora.vercel.app/${code}`])),
  "x-default": "https://pd-fora.vercel.app/",
};
