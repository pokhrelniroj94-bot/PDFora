import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const pdf = [...read("lib/legacy-tool-slugs.ts").matchAll(/"([a-z0-9-]+)"/g)].map(m => m[1]);
const catalog = [...read("components/toolCatalog.ts").matchAll(/\{slug:"([^"]+)",name:"[^"]+",category:"[^"]+"/g)].map(m => m[1]).filter(s => s !== "pdf-tools");
const pdfRoutes = [...read("lib/i18n/nepali-pdf-routes.ts").matchAll(/"([a-z0-9-]+)":\s*\{/g)].map(m => m[1]);
const routeSource = read("lib/i18n/nepali-tool-routes.ts");
const utility = [...routeSource.matchAll(/"([a-z0-9-]+)"/g)].map(m => m[1]);
const page = read("app/[locale]/tools/[slug]/page.tsx");
const pdfPage = read("app/[locale]/[slug]/page.tsx");
const verification = read("lib/tools/localized-verification.ts");
const all = [...pdf, ...catalog];
const registered = new Set([...pdfRoutes, ...utility]);
const tests = [];
function test(name, fn) { tests.push([name, fn]); }
for (const slug of all) {
  test(slug, () => {
    assert.ok(registered.has(slug), "Nepali route must be registered");
    if (pdf.includes(slug)) {
      assert.match(pdfPage, /getNepaliPdfRoute/);
      assert.match(read("lib/i18n/pdf-tool-names-ne.ts"), new RegExp(slug));
    } else {
      assert.match(page, new RegExp(slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
    assert.ok(!verification.includes(`"${slug}"`) || verification.includes(slug), "Index allowlist must remain source-defined");
  });
}
let failures = 0;
for (const [name, fn] of tests) {
  try { fn(); } catch (error) { failures++; console.error(`FAIL ${name}: ${error.message}`); }
}
console.log(`Nepali route regression: ${tests.length - failures}/${tests.length} passed; ${failures} failed.`);
if (tests.length !== 174 || failures) process.exitCode = 1;
