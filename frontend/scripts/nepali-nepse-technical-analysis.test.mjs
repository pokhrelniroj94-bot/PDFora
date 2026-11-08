import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync(new URL("../app/[locale]/tools/[slug]/page.tsx", import.meta.url), "utf8");
const workspace = fs.readFileSync(new URL("../components/MarketIntelligence.tsx", import.meta.url), "utf8");
const routes = fs.readFileSync(new URL("../lib/i18n/nepali-tool-routes.ts", import.meta.url), "utf8");
const verification = fs.readFileSync(new URL("../lib/tools/localized-verification.ts", import.meta.url), "utf8");
const metadata = fs.readFileSync(new URL("../lib/tools/localized-metadata.ts", import.meta.url), "utf8");
const sitemap = fs.readFileSync(new URL("../app/sitemap.ts", import.meta.url), "utf8");

const slug = "nepse-technical-analysis";
assert.ok(routes.includes(`"${slug}"`), "NEPSE Technical Analysis must be in the Nepali financial route registry");
assert.ok(!routes.includes('"market-ai"'), "The retired market-ai slug must not be a Nepali route");
assert.ok(page.includes('"nepse-technical-analysis": "बजार विश्लेषण तथा जोखिम परीक्षक"'), "NEPSE Technical Analysis must have a Nepali SEO title");
assert.ok(page.includes('"nepse-technical-analysis": "NEPSE को उपलब्ध ऐतिहासिक'), "NEPSE Technical Analysis must have an accurate Nepali SEO description");
assert.ok(page.includes('<MarketIntelligence locale="ne"'), "Nepali route must pass locale to the existing market engine");
assert.ok(!verification.includes('"nepse-technical-analysis"') && !verification.includes('"market-ai"'), "NEPSE Technical Analysis must remain outside the Nepali indexing allowlist until human and browser review");
assert.ok(metadata.includes("isLocalizedToolIndexable(locale, entry.slug)") && metadata.includes("alternates: { canonical: base.alternates?.canonical }"), "Unverified NEPSE Technical Analysis must remain noindex and without hreflang");
assert.ok(sitemap.includes('filter((slug) => isLocalizedToolIndexable("ne", slug))'), "Only explicitly verified Nepali tools may enter the sitemap");
assert.ok(workspace.includes('locale?: "en" | "ne"'), "Market engine must preserve English and accept Nepali");
for (const phrase of [
  "बजार विश्लेषण तथा जोखिम परीक्षक", "सम्भावित खरिद अवस्था", "होल्ड / निगरानी",
  "जोखिमसम्बन्धी चेतावनी", "समाचारको धारणा:",
  "यो शैक्षिक प्रयोजनको प्राविधिक विश्लेषण सहायता हो",
]) assert.ok(workspace.includes(phrase), "Missing Nepali NEPSE Technical Analysis copy: " + phrase);

// Localization must not alter deterministic analysis, stale-data suppression, CSV validation,
// news cross-checking. The AI explanation feature has been retired and must not return.
for (const invariant of [
  "function analyse(points: Point[], asset: string, sourceMeta?",
  "const stale = hasStaleMarketData(last.date, asset);",
  'if (stale) qualityWarnings.push("Latest daily candle is stale for the market calendar.")',
  'const signal = actionable ? technicalSignal : "Wait / neutral";',
  "CSV needs Date/Time and Close columns.",
  "Fewer than 100 valid price rows were found in the CSV.",
  "No sufficiently relevant recent headlines found. News sentiment is unavailable, not neutral.",
  "No sufficiently relevant recent headlines found. News sentiment is unavailable, not neutral.",
]) assert.ok(workspace.includes(invariant), "NEPSE Technical Analysis safety/logic invariant missing: " + invariant);

for (const forbidden of ["market-explain", "/api/ai", "AI cannot change", "NEPSE AI", "Workers AI"]) {
  assert.ok(!workspace.includes(forbidden), "Retired AI feature must not remain in the workspace: " + forbidden);
}
assert.ok(!/\bAI\b/.test(workspace), "User-facing market workspace must not mention AI");
assert.ok(!page.includes('"market-ai": "'), "Retired market-ai slug must not keep Nepali metadata");

console.log("Nepali NEPSE Technical Analysis localization and safety regression tests passed.");
