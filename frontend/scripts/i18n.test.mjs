// Unit tests for lib/i18n (pure logic). Run: npm run i18n:test  (Node 22.6+, no install needed)
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { ensureTypeStripping, frontendRoot, loadI18n } from "./lib/load-i18n.mjs";

ensureTypeStripping();
const {
  config, routing, translate, "shared-ui": sharedUi,
  "nepali-localized-blog-posts": localizedBlogModule,
} = await loadI18n();
const { createTranslator } = translate;
const { nepaliLocalizedBlogPosts } = localizedBlogModule;

test("every curated Nepali blog article is a real localized route with hreflang", () => {
  assert.equal(nepaliLocalizedBlogPosts.length, 29);
  for (const post of nepaliLocalizedBlogPosts) {
    const localizedPath = "/blog/" + post.slug;
    assert.equal(routing.hasLocalizedPage(localizedPath, "ne"), true, "Missing localized route: " + localizedPath);
    assert.equal(routing.hreflangMap(localizedPath)?.ne, "https://pd-fora.vercel.app/ne" + localizedPath);
  }
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
  assert.equal(routing.localizedOrFallbackPath("/tools/nepse-technical-analysis", "ne"), "/ne/tools/nepse-technical-analysis");
  assert.equal(routing.localizedOrFallbackPath("/tools/json-formatter-validator", "ne"), "/ne/tools/json-formatter-validator");
  assert.equal(routing.localizedOrFallbackPath("/blog", "ne"), "/ne/blog");
  assert.equal(routing.nepaliLocalizedRoutePaths.size, 165, "All localized routes must be represented in the route registry");
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

