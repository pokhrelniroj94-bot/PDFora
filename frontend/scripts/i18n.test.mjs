// Unit tests for lib/i18n (pure logic). Run: npm run i18n:test  (Node 22.6+, no install needed)
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { ensureTypeStripping, frontendRoot, loadI18n } from "./lib/load-i18n.mjs";

ensureTypeStripping();
const {
  config, routing, translate, format, preference, switcher, metadata,
  "shared-ui": sharedUi, "nepali-pdf-routes": nepaliRoutes,
  "pdf-tool-names-ne": nepaliNames, "tool-guides-ne": nepaliGuides,
  "pdf-tool-ui": pdfToolUi, "tool-guides": toolGuidesModule,
  "pdf-tool-seo-core": pdfToolSeoCore, "pdf-tool-fields-ne": pdfToolFields,
  "nepali-localized-blog-posts": localizedBlogModule,
} = await loadI18n();
const { getPdfToolCopy } = pdfToolUi;
const { createTranslator } = translate;
const { nepaliToolGuides } = nepaliGuides;
const { nepaliToolNames } = nepaliNames;
const { toolGuides } = toolGuidesModule;
const { buildPdfToolMetadata } = pdfToolSeoCore;
const { getNepaliPdfFieldText } = pdfToolFields;
const { nepaliLocalizedBlogPosts } = localizedBlogModule;

test("every curated Nepali blog article is a real localized route with hreflang", () => {
  assert.equal(nepaliLocalizedBlogPosts.length, 29);
  for (const post of nepaliLocalizedBlogPosts) {
    const localizedPath = "/blog/" + post.slug;
    assert.equal(routing.hasLocalizedPage(localizedPath, "ne"), true, "Missing localized route: " + localizedPath);
    assert.equal(routing.hreflangMap(localizedPath)?.ne, "https://pd-fora.vercel.app/ne" + localizedPath);
  }
});

test("AI Help resets and aborts pending conversations when the locale changes", () => {
  const source = fs.readFileSync(path.join(frontendRoot, "components", "SiteAIHelp.tsx"), "utf8");
  assert.ok(source.includes("useRef<AbortController | null>(null)"), "AI Help must retain the active request controller");
  assert.ok(source.includes("requestController.current?.abort()"), "locale changes must abort the previous language request");
  assert.ok(source.includes("<SiteAIHelpConversation key={locale}"), "locale changes must remount a fresh conversation with the active-language greeting");
  assert.ok(source.includes("useEffect(() => () => {") && source.includes("requestController.current = null;"), "unmounting the old locale must abort and clear its pending request");
  assert.ok(source.includes("signal: controller.signal"), "AI requests must be cancellable");
  assert.ok(source.includes("if (!controller.signal.aborted) setError("), "aborted requests must not surface stale errors");
});

test("AI help derives locale prefixes from the central locale registry", () => {
  const source = fs.readFileSync(path.join(frontendRoot, "components", "SiteAIHelp.tsx"), "utf8");
  assert.ok(source.includes('import { localeFromPathname } from "../lib/i18n/shared-ui"'));
  assert.ok(source.includes('const locale = localeFromPathname(pathname)'));
  assert.ok(source.includes('new RegExp(`^/${locale}(?=/|$)`)'), "page context must strip the configured locale prefix");
  assert.ok(!source.includes("|id|"), "the AI help locale list must not contain an unsupported locale");
});

test("RTL and script font support covers Urdu, Arabic and Bengali", () => {
  const css = fs.readFileSync(path.join(frontendRoot, "app", "globals.css"), "utf8");
  assert.ok(css.includes(':lang(ar), :lang(ur)'), "Arabic and Urdu need script-aware font stacks");
  assert.ok(css.includes(':lang(bn)'), "Bengali needs a script-aware font stack");
  assert.ok(css.includes('[dir="rtl"] .i18n-flip'), "RTL directional icon helper must remain scoped to RTL");
  assert.ok(css.includes(".i18n-ltr { direction: ltr; unicode-bidi: isolate; }"), "URLs, filenames and code need LTR isolation in RTL text");
});

test("localized route layout applies the configured language and text direction", () => {
  const source = fs.readFileSync(path.join(frontendRoot, "app", "[locale]", "layout.tsx"), "utf8");
  assert.ok(source.includes("const info = localeInfo[locale]"), "layout must use the central locale registry");
  assert.ok(source.includes("lang={info.htmlLang}"), "layout must expose the locale-specific HTML language");
  assert.ok(source.includes("dir={info.dir}"), "layout must apply RTL for Arabic and Urdu");
  assert.ok(source.includes("data-locale={locale}"), "layout must expose the active locale for styling and diagnostics");
});

test("locale table: requested 12 locales, English default, Arabic and Urdu are RTL", () => {
  assert.deepEqual([...config.locales], ["en", "ne", "hi", "bn", "ur", "ar", "es", "fr", "de", "pt", "zh", "ja"]);
  assert.equal(config.defaultLocale, "en");
  const rtl = config.locales.filter((l) => config.localeInfo[l].dir === "rtl");
  assert.deepEqual(rtl, ["ur", "ar"]);
  const names = config.locales.map((l) => config.localeInfo[l].nativeName);
  assert.equal(new Set(names).size, 12, "native names must be unique");
  assert.equal(config.localeInfo.ar.nativeName, "العربية");
  for (const l of config.locales) assert.equal(config.localeInfo[l].code, l);
});

test("all twelve locales load translated common, accessibility and SEO namespaces", () => {
  const read = (locale, namespace) => JSON.parse(
    fs.readFileSync(path.join(frontendRoot, "lib", "i18n", "messages", locale, namespace + ".json"), "utf8"),
  );
  const source = {
    common: read("en", "common"),
    accessibility: read("en", "accessibility"),
    seo: read("en", "seo"),
  };
  for (const locale of config.locales) {
    const messages = {
      common: read(locale, "common"),
      accessibility: read(locale, "accessibility"),
      seo: read(locale, "seo"),
    };
    const t = createTranslator({ locale, messages, fallback: locale === "en" ? undefined : source });
    assert.ok(t("common.language").trim(), locale + " language label must not be empty");
    assert.ok(t("accessibility.languageSwitcher").trim(), locale + " switcher label must not be empty");
    assert.ok(t("seo.home.title").trim(), locale + " homepage SEO title must not be empty");
    if (locale !== "en") {
      assert.notEqual(t("common.language"), source.common.language, locale + " language label must be translated");
      assert.notEqual(t("accessibility.languageSwitcher"), source.accessibility.languageSwitcher, locale + " accessibility label must be translated");
      assert.notEqual(t("seo.home.title"), source.seo.home.title, locale + " SEO title must be translated");
    }
    assert.ok(t("accessibility.currentLanguage", { name: "PDFora test" }).includes("PDFora test"), locale + " placeholder must interpolate");
  }
});

test("publishing policy: English and reviewed Nepali routes are published", () => {
  delete process.env.PDFORA_I18N_PREVIEW;
  assert.equal(config.isPublished("en"), true);
  assert.equal(config.isPublished("ne"), true);
  for (const l of config.locales.filter((x) => !["en", "ne"].includes(x))) {
    assert.equal(config.isPublished(l), false, `${l} must start unpublished`);
    assert.equal(config.isRoutable(l), false);
  }
  assert.deepEqual(config.getRoutableLocales(), ["ne"]);
  assert.equal(config.isRoutable("en"), false, "English is served unprefixed, never at /en");
  process.env.PDFORA_I18N_PREVIEW = "1";
  assert.deepEqual(config.getRoutableLocales(), ["ne", "hi", "bn", "ur", "ar", "es", "fr", "de", "pt", "zh", "ja"]);
  delete process.env.PDFORA_I18N_PREVIEW;
});

test("shared UI coverage: all twelve locales have complete translated site chrome", () => {
  const required = ["footerNavigation", "allTools", "guides", "about", "contact", "language", "languageHint", "directoryLabel", "directoryEyebrow", "directoryTitle", "directoryDescription", "directoryLink"];
  const nestedKeys = (value) => Object.keys(value).sort();
  const english = sharedUi.getSharedUiCopy("en");
  for (const locale of config.locales) {
    const copy = sharedUi.getSharedUiCopy(locale);
    for (const key of required) assert.equal(typeof copy[key], "string", `${locale}.${key} must be translated`);
    assert.deepEqual(nestedKeys(copy.groups), nestedKeys(english.groups), `${locale} group keys must match English`);
    assert.deepEqual(nestedKeys(copy.cookie), nestedKeys(english.cookie), `${locale} cookie keys must match English`);
    for (const [key, value] of Object.entries(copy.cookie)) assert.ok(value.trim(), `${locale}.cookie.${key} must not be empty`);
    if (locale !== "en") {
      assert.notEqual(copy.allTools, english.allTools, `${locale}.allTools must not silently fall back to English`);
      assert.notEqual(copy.directoryTitle, english.directoryTitle, `${locale}.directoryTitle must be translated`);
    }
  }
  assert.equal(sharedUi.localeFromPathname("/ne/merge-pdf"), "ne");
  assert.equal(sharedUi.localeFromPathname("/merge-pdf"), "en");
  assert.equal(sharedUi.getSharedUiCopy("ne").directoryTitle, "सबै PDF टुलहरू");
  assert.equal(sharedUi.localeFromPathname("/toString"), "en");
  assert.equal(sharedUi.localeFromPathname("/constructor"), "en");
  assert.equal(sharedUi.localeFromPathname("/ar/tools/example"), "ar");
});

test("shared navigation preserves unavailable Nepali destinations", () => {
  assert.equal(routing.localizedOrFallbackPath("/tools", "ne"), "/ne?from=%2Ftools");
  assert.equal(routing.localizedOrFallbackPath("/tools/loan-emi-calculator", "ne"), "/ne/tools/loan-emi-calculator");
  assert.equal(routing.localizedOrFallbackPath("/tools/ai-resume-writer", "ne"), "/ne/tools/ai-resume-writer");
  assert.equal(routing.localizedOrFallbackPath("/tools/json-formatter-validator", "ne"), "/ne/tools/json-formatter-validator");
  assert.equal(routing.localizedOrFallbackPath("/blog", "ne"), "/ne/blog");
  assert.equal(routing.nepaliLocalizedRoutePaths.size, 150, "All localized routes must be represented in the route registry");
  assert.equal(routing.localizedOrFallbackPath("/merge-pdf", "ne"), "/ne/merge-pdf");
});

test("Nepali PDF tool back navigation stays in the active locale", () => {
  const source = fs.readFileSync(path.join(frontendRoot, "components", "PDForaTool.tsx"), "utf8");
  assert.ok(source.includes("href={homeHref}"), "the tool back link must use the locale-aware home destination");
  assert.ok(source.includes('const homeHref = locale === "en" ? "/" : `/${locale}`;'));
});

test("Nepali homepage renders reviewed content and honest fallback links", () => {
  const source = fs.readFileSync(path.join(frontendRoot, "components", "NepaliHomePage.tsx"), "utf8");
  for (const phrase of ["नेपालीमा उपलब्ध PDF टुलहरू", "सोधिने प्रश्नहरू", "सबै टुलहरू", "PDFora बारेमा"]) {
    assert.ok(source.includes(phrase), `Nepali homepage must include reviewed copy: ${phrase}`);
  }
  assert.ok(source.includes('const fallback = (path: string) => localizedOrFallbackPath(path, "ne")'));
  assert.ok(source.includes('fallback("/tools")'));
  assert.ok(source.includes('fallback("/blog")'));
  assert.ok(source.includes('href={`/ne/${slug}`}'));
});

test("Nepali utility workspace contains real localized calculator surfaces", () => {
  const source = fs.readFileSync(path.join(frontendRoot, "components", "NepaliUtilityWorkspace.tsx"), "utf8");
  for (const phrase of ["नेपाली अंक रूपान्तरण", "विक्रम संवत्", "रोपनी–आना–पैसा–दाम", "नेपाल VAT क्याल्कुलेटर", "NEB GPA क्याल्कुलेटर"]) {
    assert.ok(source.includes(phrase), `Nepali utility workspace must include: ${phrase}`);
  }
  for (const slug of ["nepali-digit-converter", "nepali-number-converter", "nepali-date-converter", "nepal-land-area-converter", "nepali-vat-calculator", "neb-gpa-calculator"]) {
    assert.ok(source.includes(`slug === "${slug}"`), `${slug} must have a localized implementation`);
  }
});

test("Nepali market and finance surfaces contain localized rendered UI", () => {
  const dashboard = fs.readFileSync(path.join(frontendRoot, "components", "NepseMarketDashboard.tsx"), "utf8");
  const finance = fs.readFileSync(path.join(frontendRoot, "components", "NepalLiveTools.tsx"), "utf8");
  const news = fs.readFileSync(path.join(frontendRoot, "components", "NepalMarketNews.tsx"), "utf8");
  for (const phrase of ["NEPSE बजार ड्यासबोर्ड", "बजार डेटा अद्यावधिक गर्नुहोस्", "उच्च माग", "सूचीबद्ध कम्पनीहरू"]) {
    assert.ok(dashboard.includes(phrase), `Nepali dashboard must include: ${phrase}`);
  }
  for (const phrase of ["नेपाल राष्ट्र बैंक विनिमय दर", "दर अद्यावधिक गर्नुहोस्", "खरिद · NPR", "नेपाल तलब / आयकर क्याल्कुलेटर", "NEPSE नगद लाभांश तथा बोनस शेयर क्याल्कुलेटर"]) {
    assert.ok(finance.includes(phrase), `Nepali finance UI must include: ${phrase}`);
  }
  const calculators = fs.readFileSync(path.join(frontendRoot, "components", "NepaliFinanceCalculatorWorkspace.tsx"), "utf8");
  for (const phrase of ["ऋण EMI क्याल्कुलेटर", "चक्रवृद्धि ब्याज तथा SIP क्याल्कुलेटर", "छुट प्रतिशत क्याल्कुलेटर"]) {
    assert.ok(calculators.includes(phrase), `Nepali financial calculator must include: ${phrase}`);
  }
  for (const phrase of ["विश्व समाचार र नेपाल बजार समाचार", "समाचार अद्यावधिक गर्नुहोस्", "NEPSE तथा बजार अद्यावधिक"]) {
    assert.ok(news.includes(phrase), `Nepali market news UI must include: ${phrase}`);
  }
});

test("Nepali AI writing routes contain localized rendered UI", () => {
  const source = fs.readFileSync(path.join(frontendRoot, "components", "AIWritingTools.tsx"), "utf8");
  const routeSource = fs.readFileSync(path.join(frontendRoot, "app", "[locale]", "tools", "[slug]", "page.tsx"), "utf8");
  for (const phrase of ["AI रिजुमे लेखक", "AI कभर लेटर जेनेरेटर", "AI पाठ परिष्कार तथा पुनर्लेखन", "तपाईंको नतिजा", "गोपनीयता:"]) {
    assert.ok(source.includes(phrase), `Nepali AI writing UI must include: ${phrase}`);
  }
  for (const slug of ["ai-resume-writer", "ai-cover-letter-generator", "ai-humanizer"]) {
    assert.ok(routeSource.includes(`"${slug}"`), `${slug} must retain its localized route`);
  }
});

test("all localized Nepali catalog tools have localized metadata", () => {
  const source = fs.readFileSync(path.join(frontendRoot, "app", "[locale]", "tools", "[slug]", "page.tsx"), "utf8");
  const registry = fs.readFileSync(path.join(frontendRoot, "lib", "i18n", "nepali-tool-routes.ts"), "utf8");
  const slugs = [...registry.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
  const descriptionBlock = source.match(/const nepaliDescriptions:[\s\S]*?\n\};/)?.[0] ?? "";
  const titleBlock = source.match(/const nepaliTitles:[\s\S]*?\n\};/)?.[0] ?? "";
  for (const slug of slugs) {
    assert.ok(titleBlock.includes(`"${slug}"`), `${slug} needs a Nepali title`);
    assert.ok(descriptionBlock.includes(`"${slug}"`), `${slug} needs a Nepali metadata description`);
  }
});

test("Nepali math utilities have dedicated localized route and interface", () => {
  const route = fs.readFileSync(path.join(frontendRoot, "app", "[locale]", "tools", "[slug]", "page.tsx"), "utf8");
  const component = fs.readFileSync(path.join(frontendRoot, "components", "NepaliMathUtilityWorkspace.tsx"), "utf8");
  const logic = fs.readFileSync(path.join(frontendRoot, "lib", "i18n", "nepali-math-tools.ts"), "utf8");
  for (const slug of ["percentage-change-calculator", "average-calculator", "ratio-simplifier", "fraction-calculator", "percentage-of-number-calculator", "gcd-lcm-calculator", "prime-number-checker", "unit-converter"]) {
    assert.ok(route.includes(`"${slug}"`), `${slug} must have a localized route`);
    assert.ok(component.includes(`"${slug}"`), `${slug} must have localized UI copy`);
    assert.ok(logic.includes(`slug === "${slug}"`), `${slug} must have calculation logic`);
  }
  for (const phrase of ["प्रतिशत परिवर्तन क्याल्कुलेटर", "औसत क्याल्कुलेटर", "भिन्न क्याल्कुलेटर", "एकाइ रूपान्तरण"]) {
    assert.ok(component.includes(phrase), `Nepali math UI must include ${phrase}`);
  }
});

test("Nepali date and time calculators have localized routes and visible copy", () => {
  const route = fs.readFileSync(path.join(frontendRoot, "app", "[locale]", "tools", "[slug]", "page.tsx"), "utf8");
  const component = fs.readFileSync(path.join(frontendRoot, "components", "NepaliDateTimeWorkspace.tsx"), "utf8");
  const logic = fs.readFileSync(path.join(frontendRoot, "lib", "i18n", "nepali-date-time-tools.ts"), "utf8");
  for (const slug of ["age-calculator", "date-difference-calculator", "time-duration-calculator"]) {
    assert.ok(route.includes(`"${slug}"`), `${slug} must have a localized route`);
    assert.ok(component.includes(`"${slug}"`), `${slug} must have localized UI copy`);
    assert.ok(logic.includes(`slug === "${slug}"`), `${slug} must have calculation logic`);
  }
  assert.ok(route.includes("नेपाली मिति तथा समय टुल"))
  assert.ok(component.includes("उमेर क्याल्कुलेटर"));
  assert.ok(logic.includes("Date.UTC"));
});

test("Nepali developer and text tools have localized routes and interfaces", () => {
  const route = fs.readFileSync(path.join(frontendRoot, "app", "[locale]", "tools", "[slug]", "page.tsx"), "utf8");
  const component = fs.readFileSync(path.join(frontendRoot, "components", "NepaliDeveloperTextWorkspace.tsx"), "utf8");
  const logic = fs.readFileSync(path.join(frontendRoot, "lib", "i18n", "nepali-developer-text-tools.ts"), "utf8");
  for (const slug of ["json-formatter-validator", "base64-encoder-decoder", "url-encoder-decoder", "hash-generator", "text-diff-checker", "lorem-ipsum-generator", "html-encoder-decoder", "text-to-slug"]) {
    assert.ok(route.includes(`"${slug}"`), `${slug} must have a localized route`);
    assert.ok(component.includes(`"${slug}"`), `${slug} must have localized UI copy`);
    if (slug === "hash-generator") assert.ok(logic.includes("runNepaliHashTool"), `${slug} must have processing logic`);
    else assert.ok(logic.includes(`slug === "${slug}"`), `${slug} must have processing logic`);
  }
  for (const phrase of ["JSON फर्म्याट तथा जाँच", "Base64 Encode / Decode", "Text Diff Checker", "नेपाली Unicode अक्षर सुरक्षित"]) {
    assert.ok(component.includes(phrase) || route.includes(phrase), `Nepali developer UI must include ${phrase}`);
  }
});

test("Nepali Resume Builder preserves all templates and print-safe Devanagari output", () => {
  const source = fs.readFileSync(path.join(frontendRoot, "components", "ResumeBuilder.tsx"), "utf8");
  const routeSource = fs.readFileSync(path.join(frontendRoot, "app", "[locale]", "[slug]", "page.tsx"), "utf8");
  const templateBlock = source.match(/const templates = \[([\s\S]*?)\n\];/);
  assert.equal(templateBlock?.[1].match(/\bid:\s*"/g)?.length, 20, "Resume Builder must retain all 20 templates");
  for (const phrase of ["व्यावसायिक रिजुमे बिल्डर", "प्रत्यक्ष CV पूर्वावलोकन", "PDF निर्यात", "प्रोफाइल तस्बिर", "Noto Sans Devanagari", "A4 प्रिन्ट ढाँचा"]) {
    assert.ok(source.includes(phrase), `Nepali Resume Builder must include: ${phrase}`);
  }
  assert.ok(routeSource.includes('slug === "resume-builder"'));
  assert.ok(routeSource.includes('<ResumeBuilder locale="ne" />'));
  assert.ok(source.includes('@page { size: A4; margin: 0; }'));
  assert.ok(source.includes('id="resume-paper" lang={ne ? "ne" : "en"}'));
});

test("Nepali blog routes contain complete translated article content", () => {
  const source = fs.readFileSync(path.join(frontendRoot, "lib", "nepali-localized-blog-posts.ts"), "utf8");
  const page = fs.readFileSync(path.join(frontendRoot, "app", "[locale]", "blog", "[slug]", "page.tsx"), "utf8");
  for (const phrase of ["नेपाली मिति कन्भर्टर", "नेपालमा १३% VAT", "रोपनी, आना, पैसा र दाम", "बारम्बार सोधिने प्रश्न"]) {
    assert.ok(source.includes(phrase) || page.includes(phrase), `Nepali blog content must include: ${phrase}`);
  }
  assert.equal((source.match(/slug: "/g) ?? []).length, 29);
  assert.ok(page.includes('inLanguage: "ne"'));
  assert.ok(page.includes('href="/ne/blog"'));
});

test("Nepali legal and static routes contain complete localized copy", () => {
  const source = fs.readFileSync(path.join(frontendRoot, "components", "NepaliStaticPage.tsx"), "utf8");
  const routeSource = fs.readFileSync(path.join(frontendRoot, "app", "[locale]", "[slug]", "page.tsx"), "utf8");
  for (const phrase of ["गोपनीयता नीति", "सेवा प्रयोगका सर्तहरू", "PDFora बारेमा", "PDFora लाई सम्पर्क गर्नुहोस्", "अन्तिम अद्यावधिक"]) {
    assert.ok(source.includes(phrase), `Nepali static content must include: ${phrase}`);
  }
  for (const slug of ["privacy", "terms", "about", "contact"]) assert.ok(routeSource.includes(`"${slug}"`), `${slug} must have a localized route`);
});

test("all 49 PDF tools have registered Nepali routes, names and guide copy", async () => {
  const slugs = Object.keys(nepaliRoutes.nepaliPdfRoutes);
  const directorySource = fs.readFileSync(path.join(frontendRoot, "lib", "tool-directory.ts"), "utf8");
  const pdfBlock = directorySource.split("const rawPdfTools")[1]?.split("\n];")[0] ?? "";
  const expected = [...pdfBlock.matchAll(/href:\s*"([^"]+)"/g)].map((match) => match[1].replace(/^\//, "")).filter((slug) => slug !== "ocr-pdf").sort();
  assert.equal(slugs.length, 49);
  assert.deepEqual([...slugs].sort(), expected);
  for (const slug of slugs) {
    const route = nepaliRoutes.nepaliPdfRoutes[slug];
    assert.equal(route.slug, slug);
    assert.ok(route.endpoint.startsWith("/api/"), slug + " needs its original backend endpoint");
    assert.ok(route.downloadName, slug + " needs a download filename");
    assert.ok(["pdfora", "niroj"].includes(route.component), slug + " needs the correct PDF processor");
    assert.ok(nepaliNames.nepaliToolNames[slug], slug + " needs a Nepali tool name");
    const guide = nepaliGuides.nepaliToolGuides[slug];
    assert.ok(guide?.purpose && guide.steps.length > 0 && guide.caution, slug + " needs Nepali guide copy");
    for (const field of route.extraFields ?? []) {
      assert.notEqual(getNepaliPdfFieldText(field.label), field.label, slug + " field label needs Nepali translation: " + field.label);
    }
  }
});

test("routing: English URLs are unchanged, others are prefixed", () => {
  assert.equal(routing.localizePath("/merge-pdf", "en"), "/merge-pdf");
  assert.equal(routing.localizePath("/", "en"), "/");
  assert.equal(routing.localizePath("/", "ar"), "/ar");
  assert.equal(routing.localizePath("/tools/loan-emi-calculator", "ja"), "/ja/tools/loan-emi-calculator");
  assert.equal(routing.localizePath("tools/x/?a=1#h", "ko"), "/ko/tools/x");
  assert.equal(routing.localizePath("/blog/", "en"), "/blog");
});

test("routing: stripLocale", () => {
  assert.deepEqual(routing.stripLocale("/ar/tools/x"), { locale: "ar", path: "/tools/x" });
  assert.deepEqual(routing.stripLocale("/ne"), { locale: "ne", path: "/" });
  assert.deepEqual(routing.stripLocale("/merge-pdf"), { locale: "en", path: "/merge-pdf" });
  assert.deepEqual(routing.stripLocale("/"), { locale: "en", path: "/" });
  assert.deepEqual(routing.stripLocale("/arx/tools"), { locale: "en", path: "/arx/tools" });
  assert.deepEqual(routing.stripLocale("/en/tools"), { locale: "en", path: "/en/tools" }, "/en is not a locale prefix");
  for (const l of config.locales) assert.deepEqual(routing.stripLocale(routing.localizePath("/tools/x", l)).path, "/tools/x");
});

test("routing: absolute URLs keep existing canonical conventions", () => {
  assert.equal(routing.absoluteUrl("/", "en"), "https://pd-fora.vercel.app");
  assert.equal(routing.absoluteUrl("/", "ne"), "https://pd-fora.vercel.app/ne");
  assert.equal(routing.absoluteUrl("/tools/x", "de"), "https://pd-fora.vercel.app/de/tools/x");
});

test("hreflang: only reviewed English/Nepali equivalents are advertised", () => {
  const homeMap = routing.hreflangMap("/");
  assert.deepEqual(Object.keys(homeMap).sort(), ["en", "ne", "x-default"]);
  const avail = new Set(["ne", "ar"]);
  const map = routing.hreflangMap("/tools/x", { isAvailable: (l) => avail.has(l) });
  assert.deepEqual(Object.keys(map).sort(), ["ar", "en", "ne", "x-default"]);
  assert.equal(map["x-default"], map.en);
  for (const url of Object.values(map)) assert.match(url, /^https:\/\/pd-fora\.vercel\.app/);
  assert.equal(map.ar, "https://pd-fora.vercel.app/ar/tools/x");
  assert.equal(routing.hreflangMap("/x", { isAvailable: () => false }), undefined);
});

test("switcher: never offers an unavailable page", () => {
  delete process.env.PDFORA_I18N_PREVIEW;
  assert.deepEqual(switcher.getSwitcherOptions("/").map((o) => o.locale), ["en", "ne"]);
  process.env.PDFORA_I18N_PREVIEW = "1";
  const home = switcher.getSwitcherOptions("/");
  assert.deepEqual(home.map((o) => o.locale), ["en", "ne"]);
  assert.deepEqual(switcher.getSwitcherOptions("/merge-pdf").map((o) => o.locale), ["en", "ne"]);
  assert.deepEqual(switcher.getSwitcherOptions("/about").map((o) => o.locale), ["en", "ne"], "only reviewed static pages offer Nepali");
  delete process.env.PDFORA_I18N_PREVIEW;
});

test("metadata: unreviewed Nepali PDF routes remain crawlable but noindex", () => {
  const approved = metadata.buildLocaleMetadata({
    locale: "ne",
    path: "/merge-pdf",
    title: "पीडीएफ जोड्नुहोस्",
    description: "धेरै पीडीएफ फाइललाई एउटै फाइलमा जोड्नुहोस्।",
  });
  assert.deepEqual(approved.robots, { index: true, follow: true });
  assert.ok(approved.alternates.languages?.ne);

  const pending = metadata.buildLocaleMetadata({
    locale: "ne",
    path: "/images-to-pdf",
    title: "तस्बिरबाट PDF",
    description: "धेरै तस्बिरलाई एउटै PDF मा रूपान्तरण गर्नुहोस्।",
  });
  assert.deepEqual(pending.robots, { index: false, follow: true });
  assert.equal(pending.alternates.languages, undefined);
  assert.equal(pending.alternates.canonical, "https://pd-fora.vercel.app/ne/images-to-pdf");
});

test("metadata: unpublished locales are noindex with no hreflang; canonical is self-referencing", () => {
  const m = metadata.buildLocaleMetadata({ locale: "ar", path: "/", title: "T", description: "D" });
  assert.equal(m.alternates.canonical, "https://pd-fora.vercel.app/ar");
  assert.equal(m.alternates.languages, undefined);
  assert.deepEqual(m.robots, { index: false, follow: false });
  assert.equal(m.openGraph.locale, "ar");
});

test("preference: browser language matching", () => {
  const m = preference.matchLocale;
  assert.equal(m("ne-NP"), "ne");
  assert.equal(m("EN-us"), "en");
  assert.equal(m("zh-CN"), "zh");
  assert.equal(m("zh-Hans"), "zh");
  assert.equal(m("zh-TW"), undefined);
  assert.equal(m("zh-Hant-HK"), undefined);
  assert.equal(m("pt-BR"), "pt");
  assert.equal(m("ar_EG"), "ar");
  assert.equal(preference.detectBrowserLocale(["pt-BR", "fr-CA", "de"], ["en", "de"]), "de");
  assert.equal(preference.detectBrowserLocale(["fr"], ["en"]), undefined);
  assert.equal(preference.detectBrowserLocale([], ["en"]), undefined);
});

test("preference: cookie parse/serialize is strict", () => {
  assert.equal(preference.parseLocaleCookie("ar"), "ar");
  assert.equal(preference.parseLocaleCookie("../evil"), undefined);
  assert.equal(preference.parseLocaleCookie(undefined), undefined);
  assert.equal(preference.readLocaleFromCookieHeader("a=1; pdfora-locale=pt; b=2"), "pt");
  assert.equal(preference.readLocaleFromCookieHeader("pdfora-locale=xx"), undefined);
  const c = preference.localeCookieString("de", { secure: true });
  assert.match(c, /^pdfora-locale=de; Path=\/; Max-Age=31536000; SameSite=Lax; Secure$/);
});

test("preference: storeLocalePreference writes the cookie and never throws", () => {
  const original = globalThis.document;
  try {
    globalThis.document = { cookie: "" };
    preference.storeLocalePreference("ja");
    assert.match(globalThis.document.cookie, /^pdfora-locale=ja; Path=\//);
    Object.defineProperty(globalThis, "document", { value: { set cookie(_v) { throw new Error("blocked"); } }, configurable: true, writable: true });
    assert.doesNotThrow(() => preference.storeLocalePreference("ja"));
    delete globalThis.document;
    assert.doesNotThrow(() => preference.storeLocalePreference("ja"), "no document (server) is a no-op");
  } finally {
    if (original === undefined) delete globalThis.document; else globalThis.document = original;
  }
});

test("translate: interpolation, plurals, fallback reporting", () => {
  const messages = { a: { hello: "Hi {name}", files: { one: "{count} file", other: "{count} files" } } };
  const missing = [];
  const t = translate.createTranslator({ locale: "en", messages, onMissing: (k) => missing.push(k) });
  assert.equal(t("a.hello", { name: "Sita" }), "Hi Sita");
  assert.equal(t("a.hello"), "Hi {name}", "unknown placeholders stay visible");
  assert.equal(t("a.files", { count: 1 }), "1 file");
  assert.equal(t("a.files", { count: 5 }), "5 files");
  assert.equal(t("a.nope"), "a.nope");
  assert.deepEqual(missing, ["a.nope"]);
  const ar = translate.createTranslator({ locale: "ar", messages: { n: { zero: "z", one: "o", two: "t", few: "f", many: "m", other: "x" } } });
  assert.equal(ar("n", { count: 2 }), "t");
  assert.equal(ar("n", { count: 0 }), "z");
  assert.equal(ar("n", { count: 5 }), "f");
  const ne = translate.createTranslator({ locale: "ne", messages: {}, fallback: { k: "English text" }, onMissing: (k) => missing.push(`ne:${k}`) });
  assert.equal(ne("k"), "English text");
  assert.ok(missing.includes("ne:k"), "fallback use must be reported, never silent");
});

test("format: digits stay Latin by default in every locale", () => {
  const nonLatin = /[٠-٩۰-۹०-९]/;
  for (const l of config.locales) {
    assert.doesNotMatch(format.formatNumber(l, 1234567.5), nonLatin, `${l} number`);
    // Separators/grouping are locale-specific (e.g. Nepali/Hindi use lakh grouping: 12,34,567.5); the digits must be intact.
    assert.equal(format.formatNumber(l, 1234567.5).replace(/\D/g, ""), "12345675", `${l} keeps every digit`);
    assert.doesNotMatch(format.formatCurrency(l, 1500, "NPR"), nonLatin, `${l} currency`);
    assert.doesNotMatch(format.formatDate(l, new Date(Date.UTC(2026, 10, 5)), { dateStyle: "short", timeZone: "UTC" }), nonLatin, `${l} date`);
  }
  assert.equal(format.formatNumber("en", 1234.5), "1,234.5");
});

test("message files: English source files exist and parse as JSON", () => {
  const dir = path.join(frontendRoot, "lib", "i18n", "messages", "en");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  assert.ok(files.length >= 3);
  for (const f of files) {
    const tree = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    assert.equal(typeof tree, "object", f);
  }
});

test("PDF tool UI dictionaries cover every supported locale", () => {
  for (const locale of config.locales) {
    const copy = getPdfToolCopy(`/${locale}/merge-pdf`);
    for (const [key, value] of Object.entries(copy)) {
      assert.equal(typeof value, "string", `${locale}.${key} must be a string`);
      assert.ok(value.trim().length > 0, `${locale}.${key} must not be empty`);
    }
  }
  assert.equal(getPdfToolCopy("/unknown/merge-pdf").chooseFile, getPdfToolCopy("/merge-pdf").chooseFile);
});


test("Nepali PDF guide translations cover all 49 live tool slugs", () => {
  assert.equal(toolGuides.length, 49, "catalog should contain 49 enabled PDF tools");
  assert.equal(Object.keys(nepaliToolGuides).length, 49, "all 49 tools must have Nepali copy");
  for (const guide of toolGuides) {
    const translated = nepaliToolGuides[guide.slug];
    assert.ok(translated, guide.slug + " must have a Nepali guide");
    assert.ok(translated.purpose.trim(), guide.slug + " purpose");
    assert.ok(translated.caution.trim(), guide.slug + " caution");
    assert.equal(translated.steps.length, 3, guide.slug + " must have three steps");
    assert.ok(translated.steps.every((step) => step.trim()), guide.slug + " step copy");
  }
});


test("Nepali PDF tool names cover every live PDF slug", () => {
  assert.equal(Object.keys(nepaliToolNames).length, 49);
  for (const guide of toolGuides) {
    assert.ok(nepaliToolNames[guide.slug]?.trim(), guide.slug + " must have a Nepali display name");
  }
});


test("PDF SEO metadata is unique, canonical and within search description length for all tools", () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const guide of toolGuides) {
    const metadata = buildPdfToolMetadata(guide, guide.slug);
    assert.ok(String(metadata.title).includes(guide.name), guide.slug + " title must include the tool name");
    assert.ok(String(metadata.title).length <= 70, guide.slug + " title should remain concise");
    assert.ok(!titles.has(metadata.title), guide.slug + " title must be unique");
    titles.add(metadata.title);
    assert.ok(typeof metadata.description === "string" && metadata.description.length >= 80 && metadata.description.length <= 160, guide.slug + " description must be useful and within 160 characters");
    assert.ok(!descriptions.has(metadata.description), guide.slug + " description must be unique");
    descriptions.add(metadata.description);
    assert.equal(metadata.alternates.canonical, `https://pd-fora.vercel.app/${guide.slug}`, guide.slug + " canonical");
    assert.equal(metadata.robots.index, true, guide.slug + " is indexable in English");
  }
});


test("Nepali PDF form labels and placeholders have reviewed translations", () => {
  const samples = [
    ["Background text", "पृष्ठभूमिको पाठ"],
    ["Number of blank pages to add", "थप्नुपर्ने खाली पृष्ठ संख्या"],
    ["Starting number", "सुरु हुने नम्बर"],
    ["Password (minimum 6 characters)", "पासवर्ड (कम्तीमा ६ अक्षर)"],
    ["Page order (example: 3,1,2)", "पृष्ठक्रम (उदाहरण: ३,१,२)"],
    ["Enter watermark text", "वाटरमार्कको पाठ लेख्नुहोस्"]
  ];
  for (const [source, translated] of samples) assert.equal(getNepaliPdfFieldText(source), translated);
  assert.equal(getNepaliPdfFieldText("Unmapped field"), "Unmapped field", "unknown fields must remain visible rather than disappear");
});


import { buildPdfToolLocalizedMetadata } from "../lib/i18n/pdf-tool-localized-metadata.ts";

test("localized PDF metadata: self canonicals, reciprocal hreflang and indexing gate", () => {
  const pendingEn = buildPdfToolLocalizedMetadata({ locale: "en", slug: "merge-pdf", title: "Merge PDF Online", description: "Combine PDF files online.", translations: { en: true, ne: false } });
  assert.equal(pendingEn.alternates.canonical, "https://pd-fora.vercel.app/merge-pdf");
  assert.deepEqual(pendingEn.robots, { index: true, follow: true });
  assert.equal(pendingEn.alternates.languages, undefined, "do not advertise an incomplete translation");

  const pendingNe = buildPdfToolLocalizedMetadata({ locale: "ne", slug: "merge-pdf", title: "पीडीएफ जोड्नुहोस्", description: "धेरै पीडीएफ फाइललाई एउटै फाइलमा जोड्नुहोस्।", translations: { en: true, ne: false } });
  assert.equal(pendingNe.alternates.canonical, "https://pd-fora.vercel.app/ne/merge-pdf");
  assert.deepEqual(pendingNe.robots, { index: false, follow: false });

  const published = buildPdfToolLocalizedMetadata({ locale: "ne", slug: "merge-pdf", title: "पीडीएफ जोड्नुहोस्", description: "धेरै पीडीएफ फाइललाई एउटै फाइलमा जोड्नुहोस्।", translations: { en: true, ne: true } });
  assert.equal(published.alternates.canonical, "https://pd-fora.vercel.app/ne/merge-pdf");
  assert.deepEqual(published.alternates.languages, {
    en: "https://pd-fora.vercel.app/merge-pdf",
    ne: "https://pd-fora.vercel.app/ne/merge-pdf",
    "x-default": "https://pd-fora.vercel.app/merge-pdf",
  });
  assert.deepEqual(published.robots, { index: true, follow: true });
  assert.throws(() => buildPdfToolLocalizedMetadata({ locale: "en", slug: "../bad", title: "x", description: "y", translations: { en: true, ne: true } }));
});


test("site language selector only advertises published locales", () => {
  const source = fs.readFileSync(path.join(frontendRoot, "components", "SiteLanguageBar.tsx"), "utf8");
  assert.ok(
    source.includes('locales.filter((item) => localeInfo[item].status === "published")'),
    "the rendered selector must derive options from the central publication status",
  );
  assert.ok(source.includes("publishedLocales.map("), "only the filtered locale list may render options");
});


test("Nepali business calculator pages are wired to dedicated localized logic", () => {
  const page = fs.readFileSync(path.join(frontendRoot, "app", "[locale]", "tools", "[slug]", "page.tsx"), "utf8");
  const workspace = fs.readFileSync(path.join(frontendRoot, "components", "NepaliBusinessCalculatorWorkspace.tsx"), "utf8");
  assert.ok(page.includes("NepaliBusinessCalculatorWorkspace"));
  for (const slug of ["profit-margin-calculator", "markup-calculator", "break-even-calculator", "sales-tax-calculator", "salary-breakdown-calculator", "commission-calculator", "hourly-to-salary-calculator"]) {
    assert.ok(page.includes(`"${slug}"`), `${slug} must be routed to a Nepali page`);
    assert.ok(workspace.includes(`"${slug}"`), `${slug} must have a localized workspace`);
  }
});
