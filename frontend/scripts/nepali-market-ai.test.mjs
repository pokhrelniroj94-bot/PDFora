import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync(new URL("../app/[locale]/tools/[slug]/page.tsx", import.meta.url), "utf8");
const workspace = fs.readFileSync(new URL("../components/MarketIntelligence.tsx", import.meta.url), "utf8");
const routes = fs.readFileSync(new URL("../lib/i18n/nepali-tool-routes.ts", import.meta.url), "utf8");
const verification = fs.readFileSync(new URL("../lib/tools/localized-verification.ts", import.meta.url), "utf8");
const metadata = fs.readFileSync(new URL("../lib/tools/localized-metadata.ts", import.meta.url), "utf8");
const sitemap = fs.readFileSync(new URL("../app/sitemap.ts", import.meta.url), "utf8");

assert.ok(routes.includes('"market-ai"'), "Market AI must be in the Nepali financial route registry");
assert.ok(page.includes('"market-ai": "बजार विश्लेषण तथा जोखिम परीक्षक"'), "Market AI must have a Nepali SEO title");
assert.ok(page.includes('"market-ai": "NEPSE को उपलब्ध ऐतिहासिक डेटा'), "Market AI must have an accurate Nepali SEO description");
assert.ok(page.includes('<MarketIntelligence locale="ne" />'), "Nepali route must pass locale to the existing market engine");
assert.ok(!verification.includes('"market-ai"'), "Market AI must remain outside the explicit indexing allowlist until human and browser review");
assert.ok(metadata.includes("isLocalizedToolIndexable(locale, entry.slug)") && metadata.includes("alternates: { canonical: base.alternates?.canonical }"), "Unverified Market AI must remain noindex and without hreflang");
assert.ok(sitemap.includes('filter((slug) => isLocalizedToolIndexable("ne", slug))'), "Only explicitly verified Nepali tools may enter the sitemap");
assert.ok(workspace.includes('locale?: "en" | "ne"'), "Market engine must preserve English and accept Nepali");
for (const phrase of [
  "बजार विश्लेषण तथा जोखिम परीक्षक", "सम्भावित खरिद अवस्था", "होल्ड / निगरानी",
  "जोखिमसम्बन्धी चेतावनी", "समाचारको धारणा:", "NEPSE AI अनुसन्धान प्रतिवेदन",
  "यो शैक्षिक प्रयोजनको प्राविधिक विश्लेषण सहायता हो",
]) assert.ok(workspace.includes(phrase), "Missing Nepali Market AI copy: " + phrase);

// Localization must not alter deterministic analysis, stale-data suppression, CSV validation,
// news cross-checking, or the optional AI explanation request.
for (const invariant of [
  "function analyse(points: Point[], asset: string)",
  "const finalSignal = stale ? \"Wait / neutral\" : signal",
  "Fewer than 50 valid price rows were found in the CSV.",
  "News service unavailable; a news-verified signal cannot be issued.",
  'kind: "market-explain"',
  "AI cannot override the computed signal",
]) assert.ok(workspace.includes(invariant), "Market AI safety/logic invariant missing: " + invariant);

console.log("Nepali Market AI localization and safety regression tests passed.");
