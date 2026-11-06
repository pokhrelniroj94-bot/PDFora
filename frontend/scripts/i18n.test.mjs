// Unit tests for lib/i18n (pure logic). Run: npm run i18n:test  (Node 22.6+, no install needed)
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { ensureTypeStripping, frontendRoot, loadI18n } from "./lib/load-i18n.mjs";
import { getPdfToolCopy } from "../lib/i18n/pdf-tool-ui.ts";
import { nepaliToolGuides } from "../lib/i18n/tool-guides-ne.ts";
import { toolGuides } from "../lib/tool-guides.ts";
import { getPdfToolMetadata } from "../lib/i18n/pdf-tool-seo.ts";

ensureTypeStripping();
const { config, routing, translate, format, preference, switcher, metadata } = await loadI18n();

test("locale table: 10 locales, English default, Arabic is the only RTL", () => {
  assert.deepEqual([...config.locales], ["en", "ne", "hi", "es", "fr", "de", "ar", "zh", "ja", "ko"]);
  assert.equal(config.defaultLocale, "en");
  const rtl = config.locales.filter((l) => config.localeInfo[l].dir === "rtl");
  assert.deepEqual(rtl, ["ar"]);
  const names = config.locales.map((l) => config.localeInfo[l].nativeName);
  assert.equal(new Set(names).size, 10, "native names must be unique");
  assert.equal(config.localeInfo.ar.nativeName, "العربية");
  for (const l of config.locales) assert.equal(config.localeInfo[l].code, l);
});

test("publishing policy: only English is published; non-English is not routable without preview", () => {
  delete process.env.PDFORA_I18N_PREVIEW;
  assert.equal(config.isPublished("en"), true);
  for (const l of config.locales.filter((x) => x !== "en")) {
    assert.equal(config.isPublished(l), false, `${l} must start unpublished`);
    assert.equal(config.isRoutable(l), false);
  }
  assert.deepEqual(config.getRoutableLocales(), []);
  assert.equal(config.isRoutable("en"), false, "English is served unprefixed, never at /en");
  process.env.PDFORA_I18N_PREVIEW = "1";
  assert.deepEqual(config.getRoutableLocales(), ["ne", "hi", "es", "fr", "de", "ar", "zh", "ja", "ko"]);
  delete process.env.PDFORA_I18N_PREVIEW;
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

test("hreflang: none while nothing is published; reciprocal and absolute when available", () => {
  assert.equal(routing.hreflangMap("/"), undefined, "unpublished locales must produce no hreflang");
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
  assert.deepEqual(switcher.getSwitcherOptions("/").map((o) => o.locale), ["en"]);
  process.env.PDFORA_I18N_PREVIEW = "1";
  const home = switcher.getSwitcherOptions("/");
  assert.equal(home.length, 10);
  assert.equal(home.find((o) => o.locale === "ar").href, "/ar");
  assert.deepEqual(switcher.getSwitcherOptions("/merge-pdf").map((o) => o.locale), ["en"], "no localized /merge-pdf exists yet");
  delete process.env.PDFORA_I18N_PREVIEW;
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
  assert.equal(m("pt-BR"), undefined);
  assert.equal(m("ar_EG"), "ar");
  assert.equal(preference.detectBrowserLocale(["pt-BR", "fr-CA", "de"], ["en", "de"]), "de");
  assert.equal(preference.detectBrowserLocale(["fr"], ["en"]), undefined);
  assert.equal(preference.detectBrowserLocale([], ["en"]), undefined);
});

test("preference: cookie parse/serialize is strict", () => {
  assert.equal(preference.parseLocaleCookie("ar"), "ar");
  assert.equal(preference.parseLocaleCookie("../evil"), undefined);
  assert.equal(preference.parseLocaleCookie(undefined), undefined);
  assert.equal(preference.readLocaleFromCookieHeader("a=1; pdfora-locale=ko; b=2"), "ko");
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


test("PDF SEO metadata is unique, canonical and within search description length for all tools", () => {
  for (const guide of toolGuides) {
    const metadata = getPdfToolMetadata(guide.slug);
    assert.ok(String(metadata.title).includes(guide.name), guide.slug + " title must include the tool name");
    assert.ok(typeof metadata.description === "string" && metadata.description.length >= 80 && metadata.description.length <= 160, guide.slug + " description must be useful and within 160 characters");
    assert.equal(metadata.alternates.canonical, `https://pd-fora.vercel.app/${guide.slug}`, guide.slug + " canonical");
    assert.equal(metadata.robots.index, true, guide.slug + " is indexable in English");
  }
});
