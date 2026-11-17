import type { BlogPost } from "./blog-posts";
import type { Locale } from "./i18n/config";

const sharedSources = [
  { label: "DENSO WAVE: QR Code basics and error correction", url: "https://www.qrcode.com/en/about/" },
  { label: "Google Search Central: Creating helpful, reliable, people-first content", url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
];

const copy: Partial<Record<Locale, Omit<BlogPost, "slug" | "updated" | "keyword" | "toolLinks" | "sources">>> = {
  hi: {
    title: "QR कोड कैसे बनाएं: लिंक, Wi-Fi और संपर्क",
    description: "वेबसाइट, Wi-Fi, संपर्क और इवेंट के लिए QR कोड बनाना, सही आकार चुनना और साझा करने से पहले स्कैन जाँचना सीखें।",
    readTime: "7 मिनट",
    intro: "QR कोड एक दो-आयामी संकेत है जिसमें वेबसाइट लिंक, छोटा संदेश, Wi-Fi विवरण, संपर्क कार्ड या कार्यक्रम की जानकारी रखी जा सकती है। इस गाइड में आप PDFora से सही प्रकार चुनना, कोड डाउनलोड करना, अलग फोन से जाँचना और निजी जानकारी सुरक्षित रखना सीखेंगे।",
    sections: [
      { heading: "1. तय करें कि QR कोड क्या खोलेगा", paragraphs: ["पहले उपयोग का उद्देश्य तय करें। पोस्टर या मेनू के लिए वेबसाइट लिंक, मेहमानों के लिए Wi-Fi, व्यावसायिक संपर्क के लिए vCard और तारीख व स्थान वाले निमंत्रण के लिए Event विकल्प चुनें। छोटा संदेश दिखाना हो तो Text उपयोग करें।", "केवल जरूरी जानकारी रखें। बहुत लंबा पाठ या अनावश्यक tracking parameters कोड को घना बना सकते हैं। अपनी वेबसाइट के लिए स्थिर HTTPS लिंक बेहतर है।"] },
      { heading: "2. PDFora से QR कोड बनाएं", paragraphs: ["QR Code Generator खोलें, सामग्री का प्रकार चुनें और विवरण सावधानी से भरें। नंबर, वर्तनी और लिंक जाँचें। आकार, खाली किनारा, error correction और रंग चुनकर preview बनाएं। सामान्य डिजिटल उपयोग के लिए PNG और डिजाइन या प्रिंट में आकार बदलने के लिए SVG डाउनलोड करें।"], bullets: ["URL, Text, Wi-Fi, Email, Phone, SMS, WhatsApp, Contact या Event चुनें।", "सिर्फ आवश्यक विवरण दर्ज करें और दोबारा जाँचें।", "स्कैन के लिए चारों ओर साफ खाली margin रखें।", "गहरे QR और हल्की पृष्ठभूमि से अच्छा contrast बनाएं।", "डाउनलोड के बाद दूसरे फोन से स्कैन करें।"] },
      { heading: "3. रंग, आकार और error correction चुनें", paragraphs: ["स्कैनर को गहरे modules और हल्की पृष्ठभूमि में स्पष्ट अंतर दिखना चाहिए। हल्के रंग, व्यस्त pattern या ऐसा background न चुनें जिसमें QR घुल जाए। सजावट से अधिक contrast महत्वपूर्ण है।", "Error correction कुछ हिस्सा खराब होने पर भी स्कैन में मदद कर सकता है, लेकिन अधिक स्तर कोड को घना बनाता है। सबसे ऊँचा स्तर हर बार बेहतर नहीं होता। वास्तविक आकार पर परीक्षण करें।"] },
      { heading: "4. प्रकाशित करने से पहले परीक्षण करें", paragraphs: ["सिर्फ स्क्रीन पर preview देखकर भरोसा न करें। डाउनलोड की गई फ़ाइल को दूसरे फोन से सामान्य रोशनी और वास्तविक दूरी पर स्कैन करें। प्रिंट के लिए छपे हुए कागज पर भी जाँचें। खुलने वाला लिंक, नंबर, Wi-Fi नाम और event विवरण सही होने चाहिए।", "QR को खींचकर अनुपात न बिगाड़ें और उसके चारों ओर का खाली हिस्सा न काटें। छोटा या घना कोड हो तो सामग्री संक्षिप्त करें या प्रिंट आकार बढ़ाएं।"] },
      { heading: "5. गोपनीयता और लिंक सुरक्षा", paragraphs: ["QR कोड encryption नहीं है। जिसे इसे स्कैन करने की पहुँच है, वह इसमें रखा Wi-Fi पासवर्ड या संपर्क विवरण पढ़ सकता है। केवल वही जानकारी शामिल करें जिसे साझा करना ठीक हो।", "QR स्कैन होना किसी वेबसाइट की सुरक्षा की गारंटी नहीं है। लिंक खोलने से पहले पूरा domain देखें और अनपेक्षित login, payment या download अनुरोध से सावधान रहें। PDFora QR चित्र बनाता है; वह गंतव्य वेबसाइट को प्रमाणित नहीं करता।"] }
    ],
    faqs: [
      { question: "क्या Wi-Fi के लिए QR कोड बना सकते हैं?", answer: "हाँ। Wi-Fi विकल्प में सही network name, password और security type भरें। ऐसे दूसरे उपकरण से परीक्षण करें जो पहले से नेटवर्क से जुड़ा न हो।" },
      { question: "PNG और SVG में क्या चुनें?", answer: "वेबसाइट और संदेशों के लिए PNG सुविधाजनक है। SVG vector format है और डिजाइन या प्रिंट में आकार बदलने के लिए उपयोगी है। प्रिंट के बाद भी स्कैन जाँचें।" },
      { question: "क्या static QR कोड expire होता है?", answer: "Static QR अपने आप expire नहीं होता। लेकिन उसमें मौजूद वेबसाइट, फोन नंबर या सेवा बदल जाए तो कोड पुराना पड़ सकता है।" },
      { question: "क्या QR में Wi-Fi password रखना सुरक्षित है?", answer: "केवल तब जब आप स्कैन करने वालों को नेटवर्क पहुँच देना चाहते हों। QR सामग्री पढ़ी जा सकती है और QR format पासवर्ड encrypt नहीं करता।" }
    ]
  },
  bn: {
    title: "QR কোড তৈরি করবেন যেভাবে: লিংক, Wi-Fi ও যোগাযোগ",
    description: "ওয়েবসাইট, Wi-Fi, যোগাযোগের তথ্য ও ইভেন্টের জন্য QR কোড তৈরি, আকার নির্বাচন এবং শেয়ারের আগে স্ক্যান পরীক্ষা শিখুন।",
    readTime: "৭ মিনিট",
    intro: "QR কোড হলো দ্বিমাত্রিক চিহ্ন, যেখানে ওয়েব ঠিকানা, ছোট লেখা, Wi-Fi তথ্য, যোগাযোগের কার্ড বা ইভেন্টের বিবরণ রাখা যায়। এই নির্দেশিকায় PDFora দিয়ে উপযুক্ত ধরন বেছে নেওয়া, কোড ডাউনলোড, অন্য ফোনে পরীক্ষা এবং ব্যক্তিগত তথ্য সুরক্ষার উপায় দেখানো হয়েছে।",
    sections: [
      { heading: "১. QR কোড দিয়ে কী করাতে চান ঠিক করুন", paragraphs: ["আগে ব্যবহার নির্ধারণ করুন। পোস্টার বা মেনুর জন্য ওয়েব লিংক, অতিথিদের জন্য Wi-Fi, ব্যবসায়িক যোগাযোগের জন্য vCard এবং তারিখ-স্থানসহ আমন্ত্রণের জন্য Event ধরন বেছে নিন। ছোট বার্তা দেখাতে Text ব্যবহার করুন।", "শুধু প্রয়োজনীয় তথ্য রাখুন। দীর্ঘ লেখা বা অপ্রয়োজনীয় tracking parameter কোড ঘন করে স্ক্যান কঠিন করতে পারে। নিজের ওয়েবসাইটের ক্ষেত্রে স্থিতিশীল HTTPS ঠিকানা ব্যবহার করুন।"] },
      { heading: "২. PDFora দিয়ে QR কোড তৈরি করুন", paragraphs: ["QR Code Generator খুলে বিষয়বস্তুর ধরন বেছে নিন। তথ্য লিখে বানান, নম্বর ও লিংক যাচাই করুন। আকার, চারপাশের ফাঁকা মার্জিন, error correction ও রং ঠিক করে preview তৈরি করুন। সাধারণ ডিজিটাল ব্যবহারে PNG এবং ডিজাইন বা প্রিন্টে বড়-ছোট করার জন্য SVG ডাউনলোড করুন।"], bullets: ["URL, Text, Wi-Fi, Email, Phone, SMS, WhatsApp, Contact বা Event বেছে নিন।", "শুধু দরকারি তথ্য দিন এবং আবার যাচাই করুন।", "চারপাশে পরিষ্কার ফাঁকা margin রাখুন।", "গাঢ় QR ও হালকা পটভূমি দিয়ে contrast বজায় রাখুন।", "ডাউনলোডের পর অন্য ফোন দিয়ে স্ক্যান করুন।"] },
      { heading: "৩. রং, আকার ও error correction বাছুন", paragraphs: ["স্ক্যানারকে গাঢ় module ও হালকা পটভূমির পার্থক্য স্পষ্ট দেখতে হবে। ফিকে রং, ব্যস্ত pattern বা QR-এর সঙ্গে মিশে যায় এমন পটভূমি এড়িয়ে চলুন। সাজসজ্জার চেয়ে contrast বেশি জরুরি।", "Error correction কোডের কিছু অংশ ক্ষতিগ্রস্ত হলেও পড়তে সাহায্য করতে পারে, তবে উচ্চ স্তরে কোড ঘন হয়। সর্বোচ্চ স্তর সব সময় সেরা নয়। চূড়ান্ত আকারে পরীক্ষা করুন।"] },
      { heading: "৪. প্রকাশের আগে পরীক্ষা করুন", paragraphs: ["শুধু preview দেখে নিশ্চিত হবেন না। ডাউনলোড করা ফাইল অন্য ফোনে স্বাভাবিক আলো ও ব্যবহারকারীর দূরত্ব থেকে স্ক্যান করুন। প্রিন্ট হলে কাগজেও পরীক্ষা করুন। খোলা লিংক, নম্বর, Wi-Fi নাম ও ইভেন্টের তথ্য ঠিক আছে কি না দেখুন।", "QR টেনে অনুপাত বদলাবেন না এবং চারপাশের ফাঁকা অংশ কাটবেন না। কোড ছোট বা ঘন হলে তথ্য সংক্ষিপ্ত করুন অথবা প্রিন্টের আকার বাড়ান।"] },
      { heading: "৫. গোপনীয়তা ও লিংকের নিরাপত্তা", paragraphs: ["QR কোড encryption নয়। যে কেউ স্ক্যান করতে পারলে এর Wi-Fi পাসওয়ার্ড বা যোগাযোগের তথ্য পড়তে পারে। শুধু শেয়ার করার অনুমতি আছে এমন তথ্য রাখুন।", "QR স্ক্যান হলেই গন্তব্য ওয়েবসাইট নিরাপদ—এমন নয়। লিংক খোলার আগে পুরো domain দেখুন এবং অপ্রত্যাশিত login, payment বা download অনুরোধে সতর্ক থাকুন। PDFora QR ছবি তৈরি করে; গন্তব্য সাইটের নিরাপত্তা যাচাই করে না।"] }
    ],
    faqs: [
      { question: "Wi-Fi-এর জন্য QR কোড বানানো যায়?", answer: "হ্যাঁ। Wi-Fi ধরন বেছে সঠিক network name, password ও security type দিন। আগে থেকে ওই নেটওয়ার্কে যুক্ত নয় এমন ডিভাইস দিয়ে পরীক্ষা করুন।" },
      { question: "PNG নাকি SVG ডাউনলোড করব?", answer: "ওয়েবসাইট ও বার্তার জন্য PNG সুবিধাজনক। SVG vector format, তাই ডিজাইন ও প্রিন্টে আকার বদলাতে ভালো। প্রিন্ট করা কোডও পরীক্ষা করুন।" },
      { question: "Static QR কোডের মেয়াদ শেষ হয়?", answer: "Static QR নিজে থেকে মেয়াদোত্তীর্ণ হয় না। তবে এর ভেতরের ওয়েব ঠিকানা, ফোন নম্বর বা সেবা বদলে গেলে কোডটি আর কার্যকর নাও থাকতে পারে।" },
      { question: "QR কোডে Wi-Fi password রাখা নিরাপদ?", answer: "শুধু তখনই রাখুন যখন স্ক্যান করতে পারা ব্যক্তিদের নেটওয়ার্কে প্রবেশাধিকার দিতে চান। QR-এর তথ্য পড়া যায়; ফরম্যাটটি password encrypt করে না।" }
    ]
  },
  ur: {
    title: "QR کوڈ کیسے بنائیں: لنک، Wi-Fi اور رابطے",
    description: "ویب سائٹ، Wi-Fi، رابطوں اور تقریبات کے لیے QR کوڈ بنانا، درست سائز چننا اور شیئر کرنے سے پہلے اسکین کی جانچ سیکھیں۔",
    readTime: "۷ منٹ",
    intro: "QR کوڈ ایک دو بُعدی نشان ہے جس میں ویب پتہ، مختصر متن، Wi-Fi کی معلومات، رابطہ کارڈ یا تقریب کی تفصیل رکھی جا سکتی ہے۔ یہ رہنما PDFora کے ذریعے درست قسم منتخب کرنے، کوڈ ڈاؤن لوڈ کرنے، دوسرے فون سے جانچنے اور نجی معلومات محفوظ رکھنے کا طریقہ بتاتا ہے۔",
    sections: [
      { heading: "۱۔ طے کریں QR کوڈ کیا کام کرے گا", paragraphs: ["پہلے مقصد طے کریں۔ پوسٹر یا مینو کے لیے ویب لنک، مہمانوں کے لیے Wi-Fi، کاروباری رابطے کے لیے vCard اور تاریخ و مقام والے دعوت نامے کے لیے Event منتخب کریں۔ مختصر پیغام کے لیے Text استعمال کریں۔", "صرف ضروری معلومات شامل کریں۔ طویل متن یا غیر ضروری tracking parameters کوڈ کو گھنا اور اسکین کرنا مشکل بنا سکتے ہیں۔ اپنی ویب سائٹ کے لیے مستحکم HTTPS پتہ بہتر ہے۔"] },
      { heading: "۲۔ PDFora سے QR کوڈ بنائیں", paragraphs: ["QR Code Generator کھولیں اور مواد کی قسم منتخب کریں۔ تفصیلات درج کرکے املا، نمبر اور لنک دوبارہ دیکھیں۔ سائز، خالی حاشیہ، error correction اور رنگ منتخب کرکے preview بنائیں۔ عام ڈیجیٹل استعمال کے لیے PNG اور ڈیزائن یا پرنٹ میں سائز بدلنے کے لیے SVG ڈاؤن لوڈ کریں۔"], bullets: ["URL، Text، Wi-Fi، Email، Phone، SMS، WhatsApp، Contact یا Event منتخب کریں۔", "صرف مطلوبہ معلومات درج کریں۔", "کوڈ کے گرد واضح خالی margin رکھیں۔", "گہرے QR اور ہلکے پس منظر سے اچھا contrast بنائیں۔", "ڈاؤن لوڈ کے بعد دوسرے فون سے اسکین کریں۔"] },
      { heading: "۳۔ رنگ، سائز اور error correction منتخب کریں", paragraphs: ["اسکینر کو گہرے modules اور ہلکے پس منظر میں واضح فرق نظر آنا چاہیے۔ مدھم رنگ، مصروف pattern یا ایسا پس منظر نہ چنیں جس میں QR گھل جائے۔ آرائش سے زیادہ contrast اہم ہے۔", "Error correction کوڈ کا کچھ حصہ خراب ہونے پر بھی پڑھنے میں مدد دے سکتا ہے، لیکن بلند سطح کوڈ کو زیادہ گھنا بناتی ہے۔ سب سے بلند سطح ہمیشہ بہتر نہیں۔ اصل سائز پر جانچیں۔"] },
      { heading: "۴۔ شائع کرنے سے پہلے جانچ کریں", paragraphs: ["صرف preview پر بھروسا نہ کریں۔ ڈاؤن لوڈ شدہ فائل کو دوسرے فون سے عام روشنی اور حقیقی فاصلے پر اسکین کریں۔ پرنٹ کے لیے چھپے ہوئے کاغذ پر بھی جانچیں۔ لنک، نمبر، Wi-Fi نام اور تقریب کی تفصیل درست ہونی چاہیے۔", "QR کو کھینچ کر اس کا تناسب نہ بدلیں اور اردگرد کا خالی حصہ نہ کاٹیں۔ کوڈ چھوٹا یا گھنا ہو تو مواد مختصر کریں یا پرنٹ کا سائز بڑھائیں۔"] },
      { heading: "۵۔ رازداری اور لنک کی حفاظت", paragraphs: ["QR کوڈ encryption نہیں ہے۔ اسے اسکین کرنے والا شخص اس میں موجود Wi-Fi پاس ورڈ یا رابطے کی معلومات پڑھ سکتا ہے۔ صرف وہی معلومات رکھیں جنہیں شیئر کرنا مناسب ہو۔", "QR اسکین ہونے سے ویب سائٹ محفوظ ثابت نہیں ہوتی۔ لنک کھولنے سے پہلے مکمل domain دیکھیں اور غیر متوقع login، payment یا download درخواستوں سے محتاط رہیں۔ PDFora QR تصویر بناتا ہے، منزل کی ویب سائٹ کی تصدیق نہیں کرتا۔"] }
    ],
    faqs: [
      { question: "کیا Wi-Fi کے لیے QR کوڈ بنایا جا سکتا ہے؟", answer: "جی ہاں۔ Wi-Fi اختیار میں درست network name، password اور security type درج کریں۔ ایسے دوسرے آلے سے جانچیں جو پہلے سے نیٹ ورک سے منسلک نہ ہو۔" },
      { question: "PNG یا SVG میں سے کیا ڈاؤن لوڈ کروں؟", answer: "ویب سائٹ اور پیغامات کے لیے PNG آسان ہے۔ SVG ایک vector فائل ہے جو ڈیزائن اور پرنٹ میں سائز بدلنے کے لیے موزوں ہے۔ پرنٹ کے بعد بھی اسکین جانچیں۔" },
      { question: "کیا static QR کوڈ کی میعاد ختم ہوتی ہے؟", answer: "Static QR خود بخود ختم نہیں ہوتا، لیکن اس میں موجود ویب پتہ، فون نمبر یا سروس بدل جائے تو کوڈ کام کرنا چھوڑ سکتا ہے۔" },
      { question: "کیا QR میں Wi-Fi پاس ورڈ رکھنا محفوظ ہے؟", answer: "صرف اسی وقت جب آپ اسکین کرنے والوں کو نیٹ ورک تک رسائی دینا چاہتے ہوں۔ QR کا مواد پڑھا جا سکتا ہے اور یہ فارمیٹ پاس ورڈ encrypt نہیں کرتا۔" }
    ]
  },
  es: {
    title: "Cómo crear un código QR: enlaces, Wi-Fi y contactos",
    description: "Crea códigos QR para sitios web, Wi-Fi, contactos y eventos; elige el tamaño adecuado y comprueba el escaneo antes de compartirlos.",
    readTime: "7 min de lectura",
    intro: "Un código QR es un símbolo bidimensional que puede guardar una dirección web, texto breve, datos de Wi-Fi, una tarjeta de contacto o información de un evento. Esta guía explica cómo elegir el formato adecuado en PDFora, descargar el código, probarlo con otro teléfono y proteger los datos privados.",
    sections: [
      { heading: "1. Decide qué debe hacer el código QR", paragraphs: ["Empieza por la acción que esperas del usuario. Usa una URL para carteles o menús, Wi-Fi para invitados, vCard para contactos profesionales y Event para invitaciones con fecha y lugar. Elige Text para mostrar una nota breve.", "Incluye solo lo necesario. Los textos largos y los parámetros de seguimiento innecesarios pueden crear un código más denso y difícil de leer. Para tu sitio, utiliza una dirección HTTPS estable."] },
      { heading: "2. Crea un código QR con PDFora", paragraphs: ["Abre QR Code Generator y selecciona el tipo de contenido. Introduce los datos y revisa la ortografía, los números y el enlace. Ajusta el tamaño, el margen libre, la corrección de errores y los colores; después genera la vista previa. Descarga PNG para usos digitales habituales o SVG para diseño e impresión escalable."], bullets: ["Elige URL, Text, Wi-Fi, Email, Phone, SMS, WhatsApp, Contact o Event.", "Introduce únicamente los datos necesarios.", "Deja un margen limpio alrededor del símbolo.", "Mantén buen contraste: código oscuro sobre fondo claro.", "Descarga el archivo y pruébalo con otro teléfono."] },
      { heading: "3. Elige bien el color, el tamaño y la corrección", paragraphs: ["El lector debe distinguir claramente los módulos oscuros del fondo claro. Evita colores pálidos, patrones recargados y fondos que se confundan con el código. El contraste importa más que la decoración.", "La corrección de errores añade redundancia y puede ayudar si una parte se daña, pero un nivel mayor también hace el código más denso. El nivel máximo no siempre es el mejor. Prueba el archivo al tamaño real."] },
      { heading: "4. Prueba el código antes de publicarlo", paragraphs: ["No confíes solo en la vista previa. Escanea el archivo descargado con otro teléfono, con luz normal y desde la distancia prevista. Si vas a imprimirlo, prueba también la copia en papel. Comprueba que la URL, el número, la red Wi-Fi y los datos del evento sean correctos.", "No estires el código ni recortes el margen blanco. Si resulta demasiado pequeño o denso, acorta el contenido o aumenta el tamaño de impresión."] },
      { heading: "5. Protege la privacidad y revisa los enlaces", paragraphs: ["Un código QR no es cifrado. Cualquier persona que pueda escanearlo puede leer los datos incluidos, como una contraseña Wi-Fi o información de contacto. Comparte solo lo que estés dispuesto a hacer público.", "Escanear un QR no garantiza que el destino sea seguro. Revisa el dominio completo antes de abrirlo y desconfía de solicitudes inesperadas de inicio de sesión, pago o descarga. PDFora crea la imagen QR, pero no certifica el sitio de destino."] }
    ],
    faqs: [
      { question: "¿Puedo crear un QR para Wi-Fi?", answer: "Sí. Selecciona Wi-Fi, introduce el nombre exacto de la red, la contraseña y el tipo de seguridad. Pruébalo con un dispositivo que aún no esté conectado." },
      { question: "¿Debo descargar PNG o SVG?", answer: "PNG es práctico para sitios y mensajes. SVG es vectorial y permite cambiar el tamaño en diseño e impresión. Comprueba también el resultado impreso." },
      { question: "¿Caduca un código QR estático?", answer: "No caduca por sí solo, pero la dirección web, el teléfono o el servicio que contiene pueden cambiar o dejar de funcionar." },
      { question: "¿Es seguro incluir una contraseña Wi-Fi?", answer: "Hazlo solo si quieres dar acceso a quienes puedan escanear el código. El contenido QR se puede leer y el formato no cifra la contraseña." }
    ]
  },
  fr: {
    title: "Créer un QR code : liens, Wi-Fi et contacts",
    description: "Créez des QR codes pour un site, le Wi-Fi, des contacts ou un événement, puis vérifiez leur lisibilité avant de les partager.",
    readTime: "7 min de lecture",
    intro: "Un QR code est un symbole en deux dimensions qui peut contenir une adresse web, un court texte, des paramètres Wi-Fi, une fiche contact ou des informations d’événement. Ce guide explique comment choisir le bon format dans PDFora, télécharger le code, le tester avec un autre téléphone et protéger les données privées.",
    sections: [
      { heading: "1. Définir l’action du QR code", paragraphs: ["Commencez par l’usage attendu. Une URL convient à une affiche ou un menu, le Wi-Fi facilite la connexion des invités, vCard partage des coordonnées professionnelles et Event convient à une invitation avec date et lieu. Utilisez Text pour une courte note.", "N’ajoutez que les informations utiles. Un texte long ou des paramètres de suivi superflus rendent le code plus dense et parfois plus difficile à lire. Pour votre site, privilégiez une adresse HTTPS stable."] },
      { heading: "2. Créer un QR code avec PDFora", paragraphs: ["Ouvrez QR Code Generator et choisissez le type de contenu. Saisissez les informations puis vérifiez l’orthographe, les numéros et le lien. Réglez la taille, la marge blanche, la correction d’erreurs et les couleurs, puis affichez l’aperçu. Téléchargez PNG pour les usages numériques courants ou SVG pour un visuel vectoriel destiné au design et à l’impression."], bullets: ["Choisissez URL, Text, Wi-Fi, Email, Phone, SMS, WhatsApp, Contact ou Event.", "Saisissez uniquement les données nécessaires.", "Conservez une marge libre autour du symbole.", "Assurez un contraste fort avec un code foncé sur fond clair.", "Téléchargez le fichier et testez-le avec un autre téléphone."] },
      { heading: "3. Choisir les couleurs, la taille et la correction", paragraphs: ["Le lecteur doit distinguer nettement les modules foncés du fond clair. Évitez les couleurs pâles, les motifs chargés et les fonds qui se confondent avec le code. Le contraste est plus important que l’effet décoratif.", "La correction d’erreurs ajoute de la redondance et peut aider si une partie est abîmée, mais un niveau élevé rend aussi le code plus dense. Le niveau maximal n’est pas toujours le meilleur. Testez le fichier à sa taille réelle."] },
      { heading: "4. Tester avant de publier", paragraphs: ["Ne vous fiez pas uniquement à l’aperçu. Scannez le fichier téléchargé avec un autre téléphone, dans des conditions d’éclairage normales et à la distance prévue. Pour une impression, testez aussi la version papier. Vérifiez l’URL, le numéro, le nom du réseau Wi-Fi et les détails de l’événement.", "Ne déformez pas le code et ne supprimez pas sa marge blanche. S’il est trop petit ou trop dense, raccourcissez le contenu ou augmentez la taille d’impression."] },
      { heading: "5. Protéger la confidentialité et vérifier les liens", paragraphs: ["Un QR code n’est pas un chiffrement. Toute personne capable de le scanner peut lire son contenu, notamment un mot de passe Wi-Fi ou des coordonnées. N’intégrez que des informations que vous acceptez de partager.", "Le scan d’un QR code ne garantit pas la sécurité du site de destination. Vérifiez le nom de domaine complet et méfiez-vous des demandes inattendues de connexion, de paiement ou de téléchargement. PDFora crée l’image QR, mais ne certifie pas le site cible."] }
    ],
    faqs: [
      { question: "Peut-on créer un QR code pour le Wi-Fi ?", answer: "Oui. Choisissez Wi-Fi, saisissez le nom exact du réseau, le mot de passe et le type de sécurité. Testez-le avec un appareil qui n’est pas déjà connecté." },
      { question: "Faut-il télécharger PNG ou SVG ?", answer: "PNG convient aux sites et aux messages. SVG est vectoriel et permet de redimensionner le visuel pour le design et l’impression. Testez aussi la version imprimée." },
      { question: "Un QR code statique expire-t-il ?", answer: "Il n’expire pas de lui-même, mais l’adresse web, le numéro ou le service qu’il contient peut changer ou devenir indisponible." },
      { question: "Est-il prudent d’inclure un mot de passe Wi-Fi ?", answer: "Uniquement si vous souhaitez donner accès au réseau aux personnes qui peuvent scanner le code. Le contenu est lisible et le format QR ne chiffre pas le mot de passe." }
    ]
  },
  de: {
    title: "QR-Code erstellen: Links, WLAN und Kontakte",
    description: "Erstellen Sie QR-Codes für Websites, WLAN, Kontakte und Veranstaltungen und prüfen Sie die Scanbarkeit vor dem Teilen.",
    readTime: "7 Min. Lesezeit",
    intro: "Ein QR-Code ist ein zweidimensionales Zeichen, das eine Webadresse, kurzen Text, WLAN-Zugangsdaten, einen Kontakt oder Veranstaltungsinformationen speichern kann. Diese Anleitung zeigt, wie Sie in PDFora das passende Format wählen, den Code herunterladen, mit einem anderen Smartphone testen und private Daten schützen.",
    sections: [
      { heading: "1. Zweck des QR-Codes festlegen", paragraphs: ["Überlegen Sie zuerst, was nach dem Scan passieren soll. Eine URL eignet sich für Plakate und Speisekarten, WLAN für Gäste, vCard für geschäftliche Kontaktdaten und Event für Einladungen mit Datum und Ort. Für eine kurze Mitteilung wählen Sie Text.", "Speichern Sie nur notwendige Angaben. Lange Texte und überflüssige Tracking-Parameter machen den Code dichter und erschweren möglicherweise das Scannen. Für Ihre Website ist eine stabile HTTPS-Adresse sinnvoll."] },
      { heading: "2. QR-Code mit PDFora erstellen", paragraphs: ["Öffnen Sie QR Code Generator und wählen Sie den Inhaltstyp. Tragen Sie die Angaben ein und prüfen Sie Schreibweise, Nummern und Link. Legen Sie Größe, freien Rand, Fehlerkorrektur und Farben fest und erzeugen Sie eine Vorschau. PNG eignet sich für übliche digitale Anwendungen, SVG für skalierbare Gestaltung und den Druck."], bullets: ["Wählen Sie URL, Text, Wi-Fi, Email, Phone, SMS, WhatsApp, Contact oder Event.", "Geben Sie nur die benötigten Informationen ein.", "Lassen Sie einen klaren freien Rand um das Symbol.", "Sorgen Sie für starken Kontrast: dunkler Code auf hellem Hintergrund.", "Laden Sie die Datei herunter und testen Sie sie mit einem anderen Smartphone."] },
      { heading: "3. Farbe, Größe und Fehlerkorrektur auswählen", paragraphs: ["Der Scanner muss dunkle Module deutlich vom hellen Hintergrund unterscheiden können. Vermeiden Sie blasse Farben, unruhige Muster und Hintergründe, in denen der Code untergeht. Kontrast ist wichtiger als Dekoration.", "Fehlerkorrektur ergänzt Redundanz und kann helfen, wenn ein Teil beschädigt ist. Eine höhere Stufe macht den Code jedoch dichter. Die höchste Stufe ist nicht immer die beste Wahl. Testen Sie die Datei in der tatsächlichen Größe."] },
      { heading: "4. Vor der Veröffentlichung testen", paragraphs: ["Verlassen Sie sich nicht nur auf die Vorschau. Scannen Sie die heruntergeladene Datei mit einem anderen Smartphone, bei normalem Licht und aus der vorgesehenen Entfernung. Bei Drucksachen testen Sie auch den Ausdruck. Prüfen Sie URL, Telefonnummer, WLAN-Name und Veranstaltungsdaten.", "Verzerren Sie den Code nicht und schneiden Sie den freien Rand nicht ab. Ist er zu klein oder zu dicht, kürzen Sie den Inhalt oder vergrößern Sie das Druckformat."] },
      { heading: "5. Datenschutz beachten und Links prüfen", paragraphs: ["Ein QR-Code ist keine Verschlüsselung. Wer ihn scannen kann, kann auch enthaltene WLAN-Passwörter oder Kontaktdaten lesen. Speichern Sie nur Informationen, die Sie teilen möchten.", "Ein QR-Scan bestätigt nicht, dass die Zielwebsite sicher ist. Prüfen Sie vor dem Öffnen die vollständige Domain und seien Sie bei unerwarteten Anmelde-, Zahlungs- oder Download-Aufforderungen vorsichtig. PDFora erstellt das QR-Bild, zertifiziert aber nicht die Zielwebsite."] }
    ],
    faqs: [
      { question: "Kann ich einen QR-Code für WLAN erstellen?", answer: "Ja. Wählen Sie Wi-Fi und geben Sie den genauen Netzwerknamen, das Passwort und den Sicherheitstyp ein. Testen Sie den Code mit einem Gerät, das noch nicht verbunden ist." },
      { question: "Soll ich PNG oder SVG herunterladen?", answer: "PNG ist praktisch für Websites und Nachrichten. SVG ist ein Vektorformat und eignet sich zum Skalieren für Design und Druck. Prüfen Sie auch den Ausdruck." },
      { question: "Läuft ein statischer QR-Code ab?", answer: "Der Code selbst läuft nicht automatisch ab. Die darin gespeicherte Website, Telefonnummer oder der Dienst kann sich jedoch ändern oder ausfallen." },
      { question: "Ist ein WLAN-Passwort im QR-Code sicher?", answer: "Nur wenn Sie den Personen mit Scan-Zugriff Netzwerkzugang geben möchten. QR-Inhalte sind lesbar; das Format verschlüsselt das Passwort nicht." }
    ]
  },
  pt: {
    title: "Como criar um QR Code: links, Wi-Fi e contatos",
    description: "Crie QR Codes para sites, Wi-Fi, contatos e eventos; escolha o tamanho adequado e teste a leitura antes de compartilhar.",
    readTime: "7 min de leitura",
    intro: "Um QR Code é um símbolo bidimensional que pode armazenar um endereço da web, texto curto, dados de Wi-Fi, um contato ou informações de um evento. Este guia mostra como escolher o formato certo no PDFora, baixar o código, testá-lo com outro celular e proteger informações privadas.",
    sections: [
      { heading: "1. Defina o que o QR Code deve fazer", paragraphs: ["Comece pela ação esperada. Use URL em cartazes ou cardápios, Wi-Fi para facilitar o acesso de convidados, vCard para contatos profissionais e Event para convites com data e local. Escolha Text para uma mensagem curta.", "Inclua somente o necessário. Textos longos e parâmetros de rastreamento desnecessários deixam o código mais denso e podem dificultar a leitura. Para seu site, prefira um endereço HTTPS estável."] },
      { heading: "2. Crie um QR Code com o PDFora", paragraphs: ["Abra QR Code Generator e selecione o tipo de conteúdo. Informe os dados e confira a escrita, os números e o link. Ajuste tamanho, margem livre, correção de erros e cores; depois gere a prévia. Baixe PNG para usos digitais comuns ou SVG para design e impressão com escala."], bullets: ["Escolha URL, Text, Wi-Fi, Email, Phone, SMS, WhatsApp, Contact ou Event.", "Informe apenas os dados necessários.", "Mantenha uma margem livre e nítida ao redor do símbolo.", "Use um código escuro sobre fundo claro para bom contraste.", "Baixe o arquivo e teste com outro celular."] },
      { heading: "3. Escolha cores, tamanho e correção", paragraphs: ["O leitor precisa distinguir os módulos escuros do fundo claro. Evite cores muito claras, padrões carregados e fundos que se misturem ao código. O contraste é mais importante que a decoração.", "A correção de erros adiciona redundância e pode ajudar se parte do código for danificada, mas níveis maiores também deixam o símbolo mais denso. O nível máximo nem sempre é melhor. Teste no tamanho final."] },
      { heading: "4. Teste antes de publicar", paragraphs: ["Não confie apenas na prévia. Leia o arquivo baixado com outro celular, em iluminação normal e na distância prevista. Se for imprimir, teste também a versão em papel. Confira o link, o telefone, o nome da rede Wi-Fi e os dados do evento.", "Não estique o código nem corte a margem livre. Se ficar pequeno ou denso demais, reduza o conteúdo ou aumente o tamanho da impressão."] },
      { heading: "5. Proteja a privacidade e confira os links", paragraphs: ["QR Code não é criptografia. Qualquer pessoa que consiga escaneá-lo pode ler o conteúdo, inclusive senha de Wi-Fi ou dados de contato. Inclua somente informações que você aceita compartilhar.", "Escanear um QR não garante que o destino seja seguro. Confira o domínio completo antes de abrir e tenha cuidado com pedidos inesperados de login, pagamento ou download. O PDFora cria a imagem QR, mas não certifica o site de destino."] }
    ],
    faqs: [
      { question: "Posso criar um QR Code para Wi-Fi?", answer: "Sim. Selecione Wi-Fi e informe o nome exato da rede, a senha e o tipo de segurança. Teste com um aparelho que ainda não esteja conectado." },
      { question: "Devo baixar PNG ou SVG?", answer: "PNG é prático para sites e mensagens. SVG é vetorial e permite redimensionar em projetos gráficos e impressos. Teste também a impressão final." },
      { question: "Um QR Code estático expira?", answer: "Ele não expira por conta própria, mas o endereço, telefone ou serviço armazenado pode mudar ou deixar de funcionar." },
      { question: "É seguro colocar a senha do Wi-Fi no QR?", answer: "Somente se você quiser dar acesso à rede a quem puder escanear. O conteúdo pode ser lido e o formato QR não criptografa a senha." }
    ]
  },
  ar: {
    title: "كيفية إنشاء رمز QR: الروابط والواي فاي وجهات الاتصال",
    description: "أنشئ رموز QR للمواقع وشبكات Wi-Fi وجهات الاتصال والفعاليات، واختبر إمكانية مسحها قبل مشاركتها.",
    readTime: "٧ دقائق",
    intro: "رمز QR هو شكل ثنائي الأبعاد يمكنه حفظ عنوان موقع أو نص قصير أو بيانات شبكة Wi-Fi أو بطاقة اتصال أو معلومات فعالية. يشرح هذا الدليل اختيار النوع المناسب في PDFora وتنزيل الرمز واختباره بهاتف آخر وحماية المعلومات الخاصة.",
    sections: [
      { heading: "١. حدّد ما الذي ينبغي أن يفعله الرمز", paragraphs: ["ابدأ بالغرض من الرمز. استخدم رابط URL للملصقات أو قوائم الطعام، وخيار Wi-Fi للضيوف، وvCard لبيانات العمل، وEvent لدعوة تتضمن التاريخ والمكان. اختر Text لعرض ملاحظة قصيرة.", "أضف المعلومات الضرورية فقط. قد تجعل النصوص الطويلة ومعلمات التتبع غير الضرورية الرمز أكثر كثافة وأصعب في المسح. استخدم عنوان HTTPS ثابتاً لموقعك."] },
      { heading: "٢. أنشئ رمز QR باستخدام PDFora", paragraphs: ["افتح QR Code Generator واختر نوع المحتوى. أدخل البيانات وراجع الإملاء والأرقام والرابط. حدّد الحجم والهامش الفارغ وتصحيح الأخطاء والألوان، ثم أنشئ المعاينة. نزّل PNG للاستخدام الرقمي المعتاد أو SVG للتصميم والطباعة القابلة لتغيير الحجم."], bullets: ["اختر URL أو Text أو Wi-Fi أو Email أو Phone أو SMS أو WhatsApp أو Contact أو Event.", "أدخل البيانات اللازمة فقط.", "اترك مساحة فارغة واضحة حول الرمز.", "استخدم رمزاً داكناً على خلفية فاتحة لتحقيق تباين جيد.", "نزّل الملف واختبره بهاتف آخر."] },
      { heading: "٣. اختر اللون والحجم وتصحيح الأخطاء", paragraphs: ["يجب أن يميّز القارئ بوضوح بين الوحدات الداكنة والخلفية الفاتحة. تجنّب الألوان الباهتة والأنماط المزدحمة والخلفيات التي يندمج معها الرمز. التباين أهم من الزخرفة.", "يضيف تصحيح الأخطاء بيانات احتياطية قد تساعد عند تلف جزء من الرمز، لكن المستوى الأعلى يجعل الرمز أكثر كثافة أيضاً. المستوى الأقصى ليس الأفضل دائماً. اختبر الملف بالحجم الفعلي."] },
      { heading: "٤. اختبر الرمز قبل نشره", paragraphs: ["لا تعتمد على المعاينة وحدها. امسح الملف الذي نزّلته بهاتف آخر وفي إضاءة عادية ومن المسافة المتوقعة. إذا كنت ستطبعه، اختبر النسخة الورقية أيضاً. تحقق من الرابط ورقم الهاتف واسم شبكة Wi-Fi وبيانات الفعالية.", "لا تمدّد الرمز ولا تقص الهامش الفارغ. إذا كان صغيراً أو كثيفاً جداً، اختصر المحتوى أو زد حجم الطباعة."] },
      { heading: "٥. احمِ الخصوصية وتحقق من الروابط", paragraphs: ["رمز QR ليس تشفيراً. يمكن لأي شخص يستطيع مسحه قراءة المحتوى، بما في ذلك كلمة مرور Wi-Fi أو بيانات الاتصال. لا تضع فيه إلا المعلومات التي تقبل مشاركتها.", "مسح الرمز لا يضمن أمان الموقع المقصود. افحص اسم النطاق كاملاً قبل فتح الرابط واحذر طلبات تسجيل الدخول أو الدفع أو التنزيل غير المتوقعة. ينشئ PDFora صورة الرمز ولا يعتمد سلامة الموقع الوجهة."] }
    ],
    faqs: [
      { question: "هل يمكن إنشاء رمز QR لشبكة Wi-Fi؟", answer: "نعم. اختر Wi-Fi وأدخل اسم الشبكة وكلمة المرور ونوع الحماية بدقة. اختبره بجهاز غير متصل بالشبكة مسبقاً." },
      { question: "هل أحمّل PNG أم SVG؟", answer: "PNG مناسب للمواقع والرسائل. أما SVG فهو متجهي ويسمح بتغيير الحجم للتصميم والطباعة. اختبر النسخة المطبوعة أيضاً." },
      { question: "هل تنتهي صلاحية رمز QR ثابت؟", answer: "لا تنتهي صلاحية الرمز نفسه تلقائياً، لكن قد يتغير عنوان الموقع أو رقم الهاتف أو الخدمة الموجودة بداخله." },
      { question: "هل وضع كلمة مرور Wi-Fi في الرمز آمن؟", answer: "افعل ذلك فقط إذا كنت تريد منح من يستطيع مسح الرمز حق الوصول إلى الشبكة. يمكن قراءة محتوى الرمز ولا يقوم تنسيق QR بتشفير كلمة المرور." }
    ]
  },
  zh: {
    title: "如何制作二维码：网址、Wi-Fi、联系人和活动",
    description: "为网站、Wi-Fi、联系人和活动创建二维码，选择合适尺寸，并在分享前测试扫码效果。",
    readTime: "7 分钟阅读",
    intro: "二维码是一种二维图形，可以保存网址、简短文字、Wi-Fi 信息、联系人名片或活动资料。本指南介绍如何使用 PDFora 选择合适类型、下载二维码、用另一部手机测试，并保护不应公开的个人信息。",
    sections: [
      { heading: "1. 先确定二维码的用途", paragraphs: ["先想清楚扫码后希望用户做什么。海报或菜单适合使用网址，访客连接网络可选 Wi-Fi，商务联系信息可用 vCard，包含日期和地点的邀请可选 Event。简短提示则使用 Text。", "只填写必要内容。过长的文字和不必要的跟踪参数会让二维码更密集，可能难以扫描。链接到自己的网站时，建议使用稳定的 HTTPS 地址。"] },
      { heading: "2. 使用 PDFora 创建二维码", paragraphs: ["打开 QR Code Generator，选择内容类型。输入信息后，仔细检查拼写、号码和链接。设置尺寸、留白边距、纠错等级和颜色，然后生成预览。普通数字用途可下载 PNG；设计或印刷且需要缩放时可下载 SVG。"], bullets: ["选择 URL、Text、Wi-Fi、Email、Phone、SMS、WhatsApp、Contact 或 Event。", "只输入当前用途所需的信息。", "在二维码四周保留清晰的空白边距。", "使用深色二维码和浅色背景，保持足够对比度。", "下载后用另一部手机实际扫码测试。"] },
      { heading: "3. 谨慎选择颜色、尺寸和纠错等级", paragraphs: ["扫码设备必须清楚区分深色模块和浅色背景。避免浅色前景、复杂图案，以及会让二维码融入其中的背景。可读性比装饰效果更重要。", "纠错功能增加冗余信息，在部分图形受损时可能仍可读取，但等级越高也可能让图案更密集。最高等级并非总是最佳选择，请按最终显示或印刷尺寸测试。"] },
      { heading: "4. 发布前务必测试", paragraphs: ["不要只依赖页面预览。请用另一部手机，在正常光线和实际使用距离下扫描下载的文件。如果要印刷，也要测试纸质成品。确认网址、电话号码、Wi-Fi 名称和活动信息完全正确。", "不要拉伸二维码，也不要裁掉周围留白。如果图案太小或太密，可缩短内容或增大印刷尺寸。"] },
      { heading: "5. 保护隐私并检查链接", paragraphs: ["二维码不是加密方式。任何能够扫描的人都可能读取其中内容，包括 Wi-Fi 密码或联系人信息。只放入你愿意分享的信息。", "成功扫码并不代表目标网站安全。打开前请检查完整域名，并警惕意外出现的登录、付款或下载要求。PDFora 负责生成二维码图片，不会验证目标网站是否安全。"] }
    ],
    faqs: [
      { question: "可以制作 Wi-Fi 二维码吗？", answer: "可以。选择 Wi-Fi，准确填写网络名称、密码和安全类型。请使用尚未连接该网络的设备进行测试。" },
      { question: "应该下载 PNG 还是 SVG？", answer: "PNG 适合网站和消息分享。SVG 是矢量格式，适合设计和印刷时调整尺寸。印刷后也请再次扫码测试。" },
      { question: "静态二维码会过期吗？", answer: "静态二维码本身不会自动过期，但其中的网址、电话号码或服务可能发生变化或停止使用。" },
      { question: "把 Wi-Fi 密码放进二维码安全吗？", answer: "只有在你愿意让能够扫码的人访问网络时才这样做。二维码内容可以被读取，二维码格式不会加密密码。" }
    ]
  },
  ja: {
    title: "QRコードの作り方：URL・Wi-Fi・連絡先・イベント",
    description: "Webサイト、Wi-Fi、連絡先、イベント用のQRコードを作成し、共有前に読み取りやすさを確認する方法を紹介します。",
    readTime: "約7分",
    intro: "QRコードは、Webアドレス、短いテキスト、Wi-Fi情報、連絡先、イベント情報などを保存できる二次元コードです。このガイドでは、PDForaで用途に合う形式を選び、ダウンロードし、別のスマートフォンで確認する方法と、個人情報を守るための注意点を説明します。",
    sections: [
      { heading: "1. QRコードの用途を決める", paragraphs: ["まず、読み取った人に何をしてほしいかを決めます。ポスターやメニューにはURL、来客のネット接続にはWi-Fi、仕事用の連絡先にはvCard、日時と場所を含む招待にはEventが便利です。短い案内文にはTextを選びます。", "必要な情報だけを入れましょう。長い文章や不要なトラッキングパラメータはコードを複雑にし、小さいサイズで読み取りにくくなることがあります。自分のサイトには安定したHTTPSアドレスを使います。"] },
      { heading: "2. PDForaでQRコードを作成する", paragraphs: ["QR Code Generatorを開き、内容の種類を選びます。情報を入力したら、スペル、電話番号、URLを確認します。サイズ、余白、誤り訂正レベル、色を設定してプレビューを作成します。一般的なデジタル用途にはPNG、デザインや印刷で拡大縮小する場合はSVGをダウンロードします。"], bullets: ["URL、Text、Wi-Fi、Email、Phone、SMS、WhatsApp、Contact、Eventから選択します。", "目的に必要な情報だけを入力します。", "コードの周囲に十分な余白を残します。", "濃いコードと明るい背景でコントラストを確保します。", "ダウンロード後、別のスマートフォンで読み取ります。"] },
      { heading: "3. 色・サイズ・誤り訂正を適切に選ぶ", paragraphs: ["読み取り機器が暗いモジュールと明るい背景をはっきり区別できる必要があります。薄い色、複雑な模様、コードと同化する背景は避けてください。装飾よりコントラストが重要です。", "誤り訂正は一部が損傷しても読み取れる可能性を高めますが、レベルを上げるとコードが密になります。最高レベルが常に最適とは限りません。実際に表示・印刷するサイズで試してください。"] },
      { heading: "4. 公開前に必ずテストする", paragraphs: ["プレビューだけで判断しないでください。ダウンロードしたファイルを別のスマートフォンで、通常の照明と想定距離から読み取ります。印刷する場合は紙に印刷した状態でも確認します。URL、電話番号、Wi-Fi名、イベント情報が正しいか確認してください。", "コードを縦横に引き伸ばしたり、周囲の余白を切り取ったりしないでください。小さすぎる、または密すぎる場合は内容を短くするか印刷サイズを大きくします。"] },
      { heading: "5. プライバシーを守りリンクを確認する", paragraphs: ["QRコードは暗号化ではありません。読み取れる人は、Wi-Fiパスワードや連絡先などの内容を確認できます。共有してよい情報だけを入れてください。", "QRコードを読み取れたからといって、リンク先が安全とは限りません。開く前にドメイン全体を確認し、突然表示されるログイン、支払い、ダウンロードの要求に注意してください。PDForaはQR画像を作成しますが、リンク先サイトの安全性を認証するものではありません。"] }
    ],
    faqs: [
      { question: "Wi-Fi用のQRコードを作れますか？", answer: "はい。Wi-Fiを選び、正確なネットワーク名、パスワード、セキュリティ方式を入力します。まだ接続していない端末でテストしてください。" },
      { question: "PNGとSVGのどちらをダウンロードすればよいですか？", answer: "WebサイトやメッセージにはPNGが便利です。SVGはベクター形式で、デザインや印刷時のサイズ変更に向いています。印刷後も読み取りを確認してください。" },
      { question: "静的QRコードに有効期限はありますか？", answer: "静的QRコード自体に自動的な期限はありません。ただし、保存したWebアドレス、電話番号、サービスが変更・停止される場合があります。" },
      { question: "Wi-FiパスワードをQRコードに入れても安全ですか？", answer: "読み取れる人にネットワーク利用を許可したい場合に限ってください。QRの内容は読み取ることができ、形式自体はパスワードを暗号化しません。" }
    ]
  }
};

const locales = ["hi", "bn", "ur", "es", "fr", "de", "pt", "ar", "zh", "ja"] as const;

export const localizedQrBlogPosts: BlogPost[] = locales.map((locale) => {
  const article = copy[locale];
  if (!article) throw new Error(`Missing QR guide translation: ${locale}`);
  return {
    ...article,
    slug: "qr-code-generator-guide",
    keyword: article.title,
    updated: "2026-11-17",
    toolLinks: [
      { label: article.title.includes("QR") ? "QR Code Generator" : "QR Code Generator", href: `/${locale}/tools/qr-code-generator` },
    ],
    sources: sharedSources,
  };
});

export function getLocalizedQrBlogPost(locale: Locale, slug: string): BlogPost | undefined {
  if (slug !== "qr-code-generator-guide") return undefined;
  return localizedQrBlogPosts.find((post, index) => locales[index] === locale);
}
