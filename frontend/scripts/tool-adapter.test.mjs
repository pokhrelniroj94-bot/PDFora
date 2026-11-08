// QA for the tool adapter and the localized tool route.
// Run: npm run tools:test   (Node 22.6+, no install needed)
// Every expectation is derived from the real catalog / legacy list; no tool count is hard-coded.
// This checks logic and static contracts. It does NOT render React or start Next.js:
// rendering, real 404 status codes and the build are checked by `npm run build` and the HTTP
// checks listed in docs/i18n/ARCHITECTURE.md.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { ensureTypeStripping, frontendRoot, loadToolAdapter } from "./lib/load-i18n.mjs";

ensureTypeStripping();
const mods = await loadToolAdapter();
const { toolCatalog } = mods.toolCatalog;
const { legacyToolSlugs } = mods["legacy-tool-slugs"];
const { createCatalogResolver, resolveCatalogTool, listAdaptableSlugs, RESERVED_CATALOG_SLUGS, MAX_SLUG_LENGTH } = mods.adapter;
const { resolveLocalizedToolRequest } = mods["localized-route"];
const { buildLocalizedToolMetadata, localizedToolNotFoundMetadata } = mods["localized-metadata"];
const { verifiedLocalizedTools, isLocalizedToolIndexable } = mods["localized-verification"];
const { locales, isPublished, isRoutable } = mods.config;
const { absoluteUrl } = mods.routing;

const read = (rel) => fs.readFileSync(path.join(frontendRoot, rel), "utf8");
const nonEnglish = locales.filter((l) => l !== "en");
const withPreview = (fn) => {
  const before = process.env.PDFORA_I18N_PREVIEW;
  process.env.PDFORA_I18N_PREVIEW = "1";
  try { return fn(); } finally { if (before === undefined) delete process.env.PDFORA_I18N_PREVIEW; else process.env.PDFORA_I18N_PREVIEW = before; }
};
const withoutPreview = (fn) => {
  const before = process.env.PDFORA_I18N_PREVIEW;
  delete process.env.PDFORA_I18N_PREVIEW;
  try { return fn(); } finally { if (before !== undefined) process.env.PDFORA_I18N_PREVIEW = before; }
};

test("catalog integrity: unique slugs, and every non-reserved entry is adaptable", () => {
  const slugs = toolCatalog.map((t) => t.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate catalog slugs");
  const expected = toolCatalog.filter((t) => !RESERVED_CATALOG_SLUGS.has(t.slug)).map((t) => t.slug);
  assert.ok(expected.length > 0, "catalog must not be empty");
  assert.deepEqual(listAdaptableSlugs(), expected);
  for (const entry of toolCatalog) {
    if (RESERVED_CATALOG_SLUGS.has(entry.slug)) continue;
    const r = resolveCatalogTool(entry.slug);
    assert.equal(r.ok, true, entry.slug);
    assert.equal(r.implementation.kind, "catalog-workspace");
    assert.equal(r.implementation.slug, entry.slug);
    assert.equal(r.implementation.entry, entry, "the adapter must hand back the real catalog entry, not a copy");
  }
});

test("adapter rejects reserved, PDF-root, unknown and malformed slugs; never returns a tool for them", () => {
  for (const reserved of RESERVED_CATALOG_SLUGS) assert.deepEqual(resolveCatalogTool(reserved), { ok: false, slug: reserved, reason: "reserved-entry" });
  assert.ok(legacyToolSlugs.length > 0);
  for (const slug of legacyToolSlugs) assert.equal(resolveCatalogTool(slug).reason, "pdf-root-tool", slug);
  const malformed = ["", "UPPER", "a b", "../etc/passwd", "a/b", "a%2Fb", "-x", "x-", "a--b", "tool.", "x".repeat(MAX_SLUG_LENGTH + 1), "<script>", "ünicode"];
  for (const slug of malformed) assert.equal(resolveCatalogTool(slug).reason, "invalid-slug", JSON.stringify(slug));
  for (const bad of [null, undefined, 42, {}, [], ["merge-pdf"]]) assert.equal(resolveCatalogTool(bad).reason, "invalid-slug");
  assert.equal(resolveCatalogTool("definitely-not-a-real-tool").reason, "unknown-tool");
  for (const result of [resolveCatalogTool("nope-nope"), resolveCatalogTool("pdf-tools"), resolveCatalogTool("")]) assert.equal("implementation" in result, false);
});

test("adapter rejects incomplete catalog entries instead of rendering them", () => {
  const resolve = createCatalogResolver([
    { slug: "ok-tool", name: "Ok", category: "Text", description: "Fine", keywords: "" },
    { slug: "no-name", name: "  ", category: "Text", description: "x", keywords: "" },
    { slug: "no-desc", name: "N", category: "Text", description: "", keywords: "" },
    { slug: "no-cat", name: "N", category: "", description: "x", keywords: "" },
  ]);
  assert.equal(resolve("ok-tool").ok, true);
  for (const slug of ["no-name", "no-desc", "no-cat"]) assert.equal(resolve(slug).reason, "incomplete-entry", slug);
  assert.equal(resolve("missing").reason, "unknown-tool");
});

test("every adaptable slug is actually referenced by an existing handler (no unimplemented registry entries)", () => {
  const handlers = ["AllTools", "ExtraTools", "QuickUtilityTools", "NepalTools", "NepalLiveTools", "NepaliTypingTool", "ResumeBuilder"]
    .map((name) => `components/${name}.tsx`)
    .filter((rel) => fs.existsSync(path.join(frontendRoot, rel)))
    .map(read);
  assert.ok(handlers.length >= 5, "expected the existing handler components to be present");
  const missing = listAdaptableSlugs().filter((slug) => !handlers.some((src) => src.includes(`"${slug}"`) || src.includes(`'${slug}'`)));
  assert.deepEqual(missing, [], "catalog slugs that no handler mentions");
});

test("localized route: invalid locales, English and unpublished locales are 404 without preview", () => {
  withoutPreview(() => {
    const slug = listAdaptableSlugs()[0];
    for (const bad of [null, undefined, 7, "", "xx", "NE", "../ne", "ne/", "zh-CN"]) {
      assert.deepEqual(resolveLocalizedToolRequest(bad, slug), { status: "not-found", reason: "invalid-locale" }, String(bad));
    }
    assert.deepEqual(resolveLocalizedToolRequest("en", slug), { status: "not-found", reason: "locale-not-served" }, "English is served unprefixed");
    for (const l of nonEnglish) {
      assert.equal(isRoutable(l), isPublished(l));
      assert.equal(resolveLocalizedToolRequest(l, slug).status, isPublished(l) ? "ok" : "not-found", l);
    }
  });
});

test("localized route: preview mode serves every adaptable slug in every non-English locale", () => {
  withPreview(() => {
    for (const l of nonEnglish) {
      for (const slug of listAdaptableSlugs()) {
        const r = resolveLocalizedToolRequest(l, slug);
        assert.equal(r.status, "ok", `${l}/${slug}`);
        assert.equal(r.locale, l);
        assert.equal(r.implementation.slug, slug);
      }
    }
    assert.equal(resolveLocalizedToolRequest("en", listAdaptableSlugs()[0]).status, "not-found");
  });
});

test("localized route: unknown, placeholder and PDF-root slugs are 404 in every locale (no fake tools)", () => {
  withPreview(() => {
    for (const l of nonEnglish) {
      assert.deepEqual(resolveLocalizedToolRequest(l, "not-a-tool"), { status: "not-found", reason: "unknown-tool" });
      assert.deepEqual(resolveLocalizedToolRequest(l, "pdf-tools"), { status: "not-found", reason: "reserved-entry" });
      assert.deepEqual(resolveLocalizedToolRequest(l, "../merge-pdf"), { status: "not-found", reason: "invalid-slug" });
      for (const slug of legacyToolSlugs) assert.deepEqual(resolveLocalizedToolRequest(l, slug), { status: "not-found", reason: "pdf-root-tool" }, `${l}/${slug}`);
    }
  });
});

test("metadata: default-deny indexing, self-referencing canonical, no hreflang, catalog-only text", () => {
  for (const l of nonEnglish) {
    for (const entry of toolCatalog.filter((t) => !RESERVED_CATALOG_SLUGS.has(t.slug))) {
      const m = buildLocalizedToolMetadata(l, entry);
      const expectIndex = isPublished(l) && isLocalizedToolIndexable(l, entry.slug);
      assert.deepEqual(m.robots, expectIndex ? { index: true, follow: true } : { index: false, follow: isPublished(l) }, `${l}/${entry.slug}`);
      assert.equal(m.alternates.canonical, absoluteUrl(`/tools/${entry.slug}`, l), "canonical must be the localized URL itself");
      assert.ok(m.alternates.canonical.startsWith("https://pd-fora.vercel.app/"));
      assert.notEqual(m.alternates.canonical, absoluteUrl(`/tools/${entry.slug}`, "en"), "must not canonicalize to English");
      assert.notEqual(m.alternates.canonical, absoluteUrl("/", l), "must not canonicalize to the homepage");
      assert.equal(m.alternates.languages, undefined, "no hreflang until a translation genuinely exists");
      assert.equal(m.title, `${entry.name} | PDFora`);
      assert.equal(m.description, entry.description);
    }
  }
  assert.deepEqual(localizedToolNotFoundMetadata.robots, { index: false, follow: true });
  const nepaliCatalogTool = toolCatalog.find((entry) => entry.slug === "loan-emi-calculator");
  assert.ok(nepaliCatalogTool);
  const nepaliMetadata = buildLocalizedToolMetadata("ne", nepaliCatalogTool);
  assert.deepEqual(nepaliMetadata.robots, { index: false, follow: true });
  assert.equal(nepaliMetadata.alternates.languages, undefined, "noindex Nepali tools must not emit hreflang");
});

test("verification registry: only published locales and adaptable tools may ever be listed", () => {
  const adaptable = new Set([...listAdaptableSlugs(), ...legacyToolSlugs]);
  for (const [locale, slugs] of Object.entries(verifiedLocalizedTools)) {
    assert.ok(locales.includes(locale) && locale !== "en", `unknown locale ${locale}`);
    assert.equal(isPublished(locale), true, `${locale} lists verified tools but is not published`);
    for (const slug of slugs) assert.ok(adaptable.has(slug), `${locale} verifies unknown/unadaptable tool ${slug}`);
  }
  for (const l of nonEnglish) for (const slug of adaptable) {
    const listed = verifiedLocalizedTools[l]?.includes(slug) === true;
    assert.equal(isLocalizedToolIndexable(l, slug), listed);
  }
});

test("route file contract: validates through the resolver, 404s, no JSON-LD, English-declared tool UI, no indexing", () => {
  const page = read("app/[locale]/tools/[slug]/page.tsx");
  assert.match(page, /resolveLocalizedToolRequest\(/);
  assert.match(page, /notFound\(\)/);
  assert.match(page, /<ToolWorkspace slug=\{toolSlug\} \/>/, "must reuse the existing ToolWorkspace");
  assert.match(page, /lang="en" dir="ltr"/, "untranslated tool UI must be declared English");
  assert.doesNotMatch(page, /ld\+json|SoftwareApplication|FAQPage/, "English structured data must not be attached to localized URLs");
  assert.doesNotMatch(page, /index:\s*true/, "indexing is decided only in lib/tools/localized-metadata.ts");
  assert.doesNotMatch(page, /generateStaticParams/, "no speculative static generation of localized tool pages");
  const meta = read("lib/tools/localized-metadata.ts");
  assert.match(meta, /isPublished\(locale\) && isLocalizedToolIndexable/);
});

test("scope guards: English tool execution stays independent while approved hreflang is reciprocal", () => {
  const englishToolPage = read("app/tools/[slug]/page.tsx");
  assert.doesNotMatch(englishToolPage, /resolveLocalizedToolRequest|buildLocalizedToolMetadata|NepaliNepalToolsWorkspace/, "English tool execution must not be routed through localized workspace handlers");
  assert.match(englishToolPage, /isLocalizedToolIndexable\("ne", slug\)/, "Only explicitly approved Nepali tool equivalents may appear in English hreflang");
  assert.match(englishToolPage, /hreflangMap\(canonicalPath\)/, "Approved translations must receive reciprocal alternate URLs");
  const sitemap = read("app/sitemap.ts");
  assert.match(sitemap, /nepaliLocalizedUtilitySlugs/);
  assert.match(sitemap, /nepaliLocalizedFinancialSlugs/);
  assert.match(sitemap, /nepaliLocalizedPublicInfoSlugs/);
  assert.match(sitemap, /\/ne\/tools\/\$\{slug\}/);
  assert.match(sitemap, /\/ne\/market/);
  assert.match(sitemap, /\/ne\/resume-builder/);
  assert.doesNotMatch(read("app/robots.ts"), /i18n|lib\/tools/, "robots policy must not change");
});

test("existing specialized components are untouched by this migration", () => {
  const all = read("components/AllTools.tsx");
  assert.match(all, /export default function ToolWorkspace\(/);
  for (const name of ["PDForaTool", "Niroj77Tool"]) {
    const src = read(`components/${name}.tsx`);
    assert.match(src, /export default function \w+\(/, `${name} default export`);
    assert.doesNotMatch(src, /lib\/tools|localized-verification|resolveLocalizedToolRequest/, `${name} must not depend on the adapter`);
  }
});
