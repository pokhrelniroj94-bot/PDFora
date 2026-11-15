import fs from "node:fs";
import assert from "node:assert/strict";

const source = fs.readFileSync(new URL("../lib/nepali-localized-blog-posts.ts", import.meta.url), "utf8");
const cited = {
  "english-to-nepali-digits-converter-guide": "unicode.org",
  "compress-pdf-to-under-1mb-online": "helpx.adobe.com",
  "merge-multiple-pdf-files-into-one-document": "helpx.adobe.com",
  "convert-jpg-images-to-one-pdf-on-phone": "helpx.adobe.com",
  "convert-pdf-pages-to-jpg-images": "helpx.adobe.com",
  "split-pdf-and-extract-selected-pages": "helpx.adobe.com",
  "reduce-pdf-file-size-for-email-attachment": "support.google.com/mail",
  "convert-pdf-table-to-excel-spreadsheet": "helpx.adobe.com",
  "convert-pdf-to-editable-word-document": "helpx.adobe.com",
  "pdf-to-text-guide-online": "helpx.adobe.com",
  "savings-goal-calculator-guide": "investor.gov",
  "reading-time-calculator-guide": "sciencedirect.com",
  "pdf-to-csv-guide-online": "rfc-editor.org",
};
for (const [slug, host] of Object.entries(cited)) {
  const start = source.indexOf(`slug: "${slug}"`);
  assert.notEqual(start, -1, `missing Nepali blog record: ${slug}`);
  const end = source.indexOf("\n    toolLinks:", start);
  assert.notEqual(end, -1, `missing toolLinks boundary: ${slug}`);
  const record = source.slice(start, end);
  assert.match(record, /sources:\s*\[/, `missing sources array: ${slug}`);
  assert.ok(record.includes(host), `missing expected source host: ${slug}`);
}
assert.equal(Object.keys(cited).length, 13);
console.log("Nepali blog source review checks passed: 13 cited records");
