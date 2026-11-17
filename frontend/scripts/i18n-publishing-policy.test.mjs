import assert from "node:assert/strict";
import { ensureTypeStripping, loadI18n, loadToolAdapter } from "./lib/load-i18n.mjs";

ensureTypeStripping();

// Production publishing must never be widened by a preview environment variable.
delete process.env.PDFORA_I18N_PREVIEW;

const i18n = await loadI18n();
const tools = await loadToolAdapter();
const { config, routing, switcher } = i18n;
const { metadata, "legacy-tool-slugs": legacyModule, toolCatalog: catalogModule, "nepali-localized-blog-posts": blogModule } = tools;
const { getSwitcherOptions } = switcher;
const { buildLocaleMetadata } = metadata;
const { legacyToolSlugs } = legacyModule;
const { toolCatalog } = catalogModule;
const { nepaliLocalizedBlogPosts } = blogModule;

const legacy = new Set(legacyToolSlugs);
const toolPaths = new Set([
  ...legacyToolSlugs.map((slug) => `/${slug}`),
  ...toolCatalog
    .filter((tool) => tool.slug !== "pdf-tools" && tool.slug !== "ocr-pdf" && !legacy.has(tool.slug))
    .map((tool) => `/tools/${tool.slug}`),
]);

assert.equal(toolPaths.size, 175, "publishing gate must cover the complete 175-tool inventory");

for (const locale of config.locales) {
  if (locale === config.defaultLocale) continue;

  if (!config.isPublished(locale)) {
    assert.equal(config.isRoutable(locale), false, `${locale} must remain unroutable in production`);
    assert.equal(routing.hasLocalizedPage("/", locale), false, `${locale} must not advertise an untranslated homepage`);
    assert.equal(routing.hasIndexableLocalizedPage("/", locale), false, `${locale} must not become indexable without reviewed content`);
    assert.equal(routing.hasLocalizedPage("/tools/qr-code-generator", locale), true, `${locale} must serve the independently translated QR Generator`);
    assert.equal(routing.hasIndexableLocalizedPage("/tools/qr-code-generator", locale), true, `${locale} QR Generator must be indexable`);
    const qrMetadata = buildLocaleMetadata({ locale, path: "/tools/qr-code-generator", title: "QR Generator", description: "Create QR codes in your language." });
    assert.deepEqual(qrMetadata.robots, { index: true, follow: true }, `${locale} QR Generator metadata must be indexable`);

    const fallbackMetadata = buildLocaleMetadata({
      locale,
      path: "/",
      title: config.localeFallbackCopy[locale].title,
      description: config.localeFallbackCopy[locale].message,
    });
    assert.deepEqual(fallbackMetadata.robots, { index: false, follow: false }, `${locale} unpublished metadata must stay noindex,nofollow`);
    assert.equal(fallbackMetadata.alternates?.languages, undefined, `${locale} fallback must not emit hreflang`);
    continue;
  }

  assert.equal(routing.hasLocalizedPage("/", locale), true, `${locale} needs a real localized homepage`);
  assert.equal(routing.hasLocalizedPage("/tools", locale), true, `${locale} needs a localized tools directory`);

  for (const path of toolPaths) {
    assert.equal(
      routing.hasLocalizedPage(path, locale),
      true,
      `${locale} is published but has no localized equivalent for ${path}`,
    );
  }

  for (const post of nepaliLocalizedBlogPosts) {
    assert.equal(
      routing.hasLocalizedPage(`/blog/${post.slug}`, locale),
      true,
      `${locale} is published but has no localized equivalent for blog/${post.slug}`,
    );
  }
}

const nepaliEligible = buildLocaleMetadata({
  locale: "ne",
  path: "/merge-pdf",
  title: "पीडीएफ जोड्नुहोस्",
  description: "धेरै PDF फाइललाई एउटै फाइलमा जोड्नुहोस्।",
});
assert.deepEqual(nepaliEligible.robots, { index: true, follow: true });
assert.equal(nepaliEligible.alternates?.canonical, "https://pd-fora.vercel.app/ne/merge-pdf", "approved localized pages need a self-referencing canonical");
assert.equal(nepaliEligible.alternates?.languages?.en, "https://pd-fora.vercel.app/merge-pdf", "approved translations need reciprocal English hreflang");
assert.equal(nepaliEligible.alternates?.languages?.ne, "https://pd-fora.vercel.app/ne/merge-pdf", "approved translations need reciprocal Nepali hreflang");
assert.equal(nepaliEligible.alternates?.languages?.["x-default"], "https://pd-fora.vercel.app/merge-pdf");

const unapprovedCatalogNepali = buildLocaleMetadata({
  locale: "ne",
  path: "/tools/average-calculator",
  title: "औसत क्याल्कुलेटर",
  description: "दिइएका संख्याको औसत निकाल्नुहोस्।",
});
assert.deepEqual(unapprovedCatalogNepali.robots, { index: true, follow: true });
assert.equal(unapprovedCatalogNepali.alternates?.languages?.ne, "https://pd-fora.vercel.app/ne/tools/average-calculator");
assert.equal(unapprovedCatalogNepali.alternates?.languages?.en, "https://pd-fora.vercel.app/tools/average-calculator");

const unverifiedNepali = buildLocaleMetadata({
  locale: "ne",
  path: "/tools/ocr-pdf",
  title: "OCR PDF",
  description: "OCR is not an available localized tool.",
});
assert.deepEqual(unverifiedNepali.robots, { index: false, follow: true });
assert.equal(unverifiedNepali.alternates?.languages, undefined);
assert.deepEqual(
  getSwitcherOptions("/tools/ocr-pdf").map((option) => option.locale),
  ["en"],
  "language switcher must not link to an unlocalized or unavailable tool",
);

assert.deepEqual(
  getSwitcherOptions("/").map((option) => option.locale),
  config.locales.filter((locale) => locale === "en" || config.isPublished(locale)),
  "language selector must show only production-published equivalents",
);

assert.deepEqual(
  getSwitcherOptions("/tools/qr-code-generator").map((option) => option.locale),
  config.locales,
  "QR Generator language selector must offer all 12 independently published translations",
);

const qrHreflang = routing.hreflangMap("/tools/qr-code-generator");
for (const locale of config.locales) {
  const expected = locale === "en" ? "https://pd-fora.vercel.app/tools/qr-code-generator" : `https://pd-fora.vercel.app/${locale}/tools/qr-code-generator`;
  assert.equal(qrHreflang?.[config.localeInfo[locale].hreflang], expected, `${locale} QR page needs reciprocal hreflang`);
}
assert.equal(qrHreflang?.["x-default"], qrHreflang?.en, "QR x-default must point to the English canonical page");

for (const locale of config.locales) {
  if (locale === "en") continue;
  const request = tools["localized-route"].resolveLocalizedToolRequest(locale, "qr-code-generator");
  assert.equal(request.status, "ok", `${locale} QR route must resolve`);
  const unrelated = tools["localized-route"].resolveLocalizedToolRequest(locale, "average-calculator");
  if (!config.isPublished(locale)) assert.equal(unrelated.status, "not-found", `${locale} must not expose unrelated catalog tools`);
}

console.log("i18n publishing policy: all published locales have complete tool-route coverage; unpublished locales remain noindex and absent from hreflang/switcher.");
