import assert from "node:assert/strict";
import { runNepaliDataTool, translateDataError, nepaliDataToolSlugs } from "../lib/i18n/nepali-data-tools.ts";
import { csvToJson, jsonObjectsToCsv } from "../lib/catalog-text.ts";
import { jsonToYaml, randomIntegerBelow } from "../lib/catalog-inputs.ts";
import { addCalendarDays } from "../lib/date-time-calculations.ts";
import { businessDaysInclusive, gcd } from "../lib/catalog-calculations.ts";

// A deterministic "random" source so the tests are reproducible.
let seed = 12345;
const randomUint32 = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed; };
const deps = { csvToJson, jsonObjectsToCsv, jsonToYaml, addCalendarDays, businessDaysInclusive, gcd, randomIntegerBelow, randomUint32 };
const run = (slug, values) => runNepaliDataTool(slug, values, deps);
const devanagari = /[ऀ-ॿ]/;
let assertions = 0;
const check = (fn) => { fn(); assertions += 1; };

// CSV / JSON / YAML parity with the shared English helpers
check(() => assert.equal(run("csv-to-json", { text: "name,age\nAsha,22\nRavi,25" }).text, csvToJson("name,age\nAsha,22\nRavi,25")));
check(() => assert.deepEqual(JSON.parse(run("csv-to-json", { text: 'name,note\n"आशा","a, b"' }).text), [{ name: "आशा", note: "a, b" }]));
check(() => assert.equal(run("json-to-yaml", { text: '{"name":"Asha","age":22,"active":true}' }).text, '"name": "Asha"\n"age": 22\n"active": true'));
check(() => assert.equal(run("json-to-csv", { text: '[{"name":"Asha","age":22}]' }).text, '"name","age"\r\n"Asha","22"'));
// spreadsheet-formula guard is inherited from the English helper
check(() => assert.match(run("json-to-csv", { text: '[{"a":"=SUM(1,2)"}]' }).text, /"'=SUM\(1,2\)"/));

// Every English helper error becomes Nepali (no English leakage)
const errorCases = [
  ["csv-to-json", "only,header"], ["csv-to-json", 'a,b\n"x"y,2'], ["csv-to-json", 'a,b\nx"y,2'], ["csv-to-json", 'a,b\n"x,2'],
  ["csv-to-json", "a,a\n1,2"], ["csv-to-json", "a,\n1,2"], ["csv-to-json", "a,b\n1"],
  ["json-to-csv", "{"], ["json-to-csv", '{"a":1}'], ["json-to-csv", "[1,2]"],
  ["date-add-subtract-calculator", null], ["business-days-calculator", null],
];
for (const [slug, input] of errorCases) {
  const values = slug === "date-add-subtract-calculator" ? { date: "2026-02-30", days: "1" }
    : slug === "business-days-calculator" ? { start: "2026-13-01", end: "2026-01-01" }
    : { text: input };
  check(() => { const r = run(slug, values); assert.equal(r.ok, false); assert.match(r.text, devanagari, `${slug} error must be Nepali: ${r.text}`); assert.doesNotMatch(r.text, /Enter |Provide |must |CSV row/); });
}
check(() => assert.match(run("csv-to-json", { text: "a,b\n1" }).text, /पङ्क्ति २/));
check(() => assert.match(translateDataError(new Error("something unknown")), devanagari));
check(() => assert.match(translateDataError(new Error("Date range must not exceed 100 years.")), /१०० वर्ष/));
check(() => assert.equal(run("business-days-calculator", { start: "1900-01-01", end: "2026-01-01" }).ok, false));
check(() => assert.equal(run("json-to-yaml", { text: "{" }).ok, false));
check(() => assert.equal(run("csv-to-json", { text: "   " }).ok, false));

// validators
check(() => assert.equal(run("email-validator", { text: "hello@example.com" }).ok, true));
check(() => assert.equal(run("email-validator", { text: "hello@example" }).ok, false));
check(() => assert.equal(run("email-validator", { text: "a b@example.com" }).ok, false));
check(() => assert.equal(run("email-validator", { text: "" }).ok, false));
check(() => assert.match(run("url-validator", { text: "https://example.com/path?q=1" }).text, /Host: example.com\nPath: \/path\nQuery: \?q=1/));
check(() => assert.equal(run("url-validator", { text: "ftp://example.com" }).ok, false));
check(() => assert.equal(run("url-validator", { text: "not a url" }).ok, false));
check(() => assert.match(run("url-query-parser", { text: "https://example.com/search?q=pdf&page=2" }).text, /q = pdf\npage = 2/));
check(() => assert.match(run("url-query-parser", { text: "https://example.com/a" }).text, /फेला परेन/));
check(() => assert.match(run("password-strength-checker", { text: "Example-Strong-Password-2026" }).text, /बलियो/));
check(() => assert.match(run("password-strength-checker", { text: "abc" }).text, /कमजोर/));
check(() => assert.match(run("password-strength-checker", { text: "Abcdef12" }).text, /मध्यम/));
check(() => assert.equal(run("password-strength-checker", { text: "" }).ok, false));

// colour, ratio, gradient
check(() => assert.equal(run("color-converter", { text: "#0f766e" }).text, "HEX: #0F766E\nRGB: 15, 118, 110\nHSL: 175°, 77%, 26%"));
check(() => assert.equal(run("color-converter", { text: "ffffff" }).text, "HEX: #FFFFFF\nRGB: 255, 255, 255\nHSL: 0°, 0%, 100%"));
check(() => assert.equal(run("color-converter", { text: "#12" }).ok, false));
check(() => assert.match(run("aspect-ratio-calculator", { width: "1920", height: "1080" }).text, /16:9\nदशमलव: 1\.77778/));
check(() => assert.match(run("aspect-ratio-calculator", { width: "१९२०", height: "१०८०" }).text, /16:9/));
check(() => assert.equal(run("aspect-ratio-calculator", { width: "0", height: "10" }).ok, false));
check(() => assert.equal(run("aspect-ratio-calculator", { width: "", height: "10" }).ok, false));
check(() => assert.equal(run("css-gradient-generator", { a: "#0f766e", b: "#38bdf8", angle: "135" }).text, "background: linear-gradient(135deg, #0f766e, #38bdf8);"));
check(() => assert.equal(run("css-gradient-generator", { a: "red", b: "#38bdf8", angle: "135" }).ok, false));
check(() => assert.equal(run("css-gradient-generator", { a: "#0f766e", b: "#38bdf8", angle: "" }).ok, false));

// timestamps and dates
check(() => { const r = run("unix-timestamp-converter", { text: "1793520000" }); assert.match(r.text, /UTC: 2026-11-01T08:00:00\.000Z/); assert.match(r.text, /नेपाल समय \(UTC\+५:४५\): 2026-11-01 13:45:00/); });
check(() => assert.match(run("unix-timestamp-converter", { text: "1793520000000" }).text, /UTC: 2026-11-01T08:00:00\.000Z/)); // milliseconds
check(() => assert.equal(run("unix-timestamp-converter", { text: "abc" }).ok, false));
check(() => assert.equal(run("unix-timestamp-converter", { text: "" }).ok, false));
check(() => assert.equal(run("date-add-subtract-calculator", { date: "2026-11-01", days: "30" }).text, "नतिजा मिति: 2026-12-01"));
check(() => assert.equal(run("date-add-subtract-calculator", { date: "2026-03-01", days: "-1" }).text, "नतिजा मिति: 2026-02-28"));
check(() => assert.equal(run("date-add-subtract-calculator", { date: "2026-11-01", days: "1.5" }).ok, false));
check(() => assert.equal(run("date-add-subtract-calculator", { date: "2026-11-01", days: "" }).ok, false));
check(() => assert.match(run("business-days-calculator", { start: "2026-11-02", end: "2026-11-08" }).text, /: 5\n/));
check(() => assert.match(run("business-days-calculator", { start: "2026-11-09", end: "2026-11-02" }).text, /: 6\n/)); // reversed range, inclusive

// random tools (deterministic source, bounds, validation)
check(() => { const out = run("random-number-generator", { min: "1", max: "100", count: "50" }).text.split("\n").map(Number); assert.equal(out.length, 50); assert.ok(out.every((n) => Number.isInteger(n) && n >= 1 && n <= 100)); });
check(() => assert.equal(run("random-number-generator", { min: "5", max: "5", count: "3" }).text, "5\n5\n5"));
for (const bad of [{ min: "10", max: "1", count: "1" }, { min: "1", max: "10", count: "0" }, { min: "1", max: "10", count: "101" }, { min: "1.5", max: "10", count: "1" }, { min: "", max: "10", count: "1" }, { min: "0", max: "4294967296", count: "1" }]) check(() => assert.equal(run("random-number-generator", bad).ok, false));
check(() => { const r = run("dice-roller", { count: "20" }).text; const rolls = r.split("\n")[0].replace("फालिएका अंक: ", "").split(", ").map(Number); assert.equal(rolls.length, 20); assert.ok(rolls.every((n) => n >= 1 && n <= 6)); assert.match(r, new RegExp(`जम्मा: ${rolls.reduce((a, b) => a + b, 0)}$`)); });
for (const bad of ["0", "101", "2.5", "", "x"]) check(() => assert.equal(run("dice-roller", { count: bad }).ok, false));

// registry sanity: every slug returns a Nepali, non-empty message even with empty input
check(() => assert.equal(new Set(nepaliDataToolSlugs).size, 15));
for (const slug of nepaliDataToolSlugs) check(() => { const r = run(slug, {}); assert.ok(r.text.length > 0); assert.match(r.text, devanagari, `${slug} empty-input message must be Nepali`); });

console.log(`Nepali data/validator/date/random tool tests passed (${assertions} assertions).`);
