import assert from "node:assert/strict";
import { runNepaliFinalTool as run, formatXml, stripHtml } from "../lib/i18n/nepali-final-tools.ts";

// Expected values below were computed independently in Python (not by this implementation).
const noDom = { parseXml: () => ({ errorText: null, serialized: "" }), htmlToText: () => "" };
const devanagari = /[ऀ-ॿ]/;
let assertions = 0;
const check = (fn) => { fn(); assertions += 1; };

// --- savings goal -----------------------------------------------------------------------------
const base = { target: "100000", saved: "10000", months: "12", rate: "5", frequency: "monthly" };
check(() => {
  const r = run("savings-goal-calculator", base, noDom);
  assert.equal(r.ok, true);
  assert.match(r.text, /मासिक \(१२ पटक\)/);
  assert.match(r.text, /प्रति महिना चाहिने निक्षेप: NPR 7,288\.01/);
  assert.match(r.text, /हालको बचतको मूल्य: NPR 10,511\.62/);
  assert.match(r.text, /ब्याज आम्दानी: NPR 511\.62/);
  assert.match(r.text, /कुल रकम: NPR 97,967\.70/);
});
check(() => { const r = run("savings-goal-calculator", { ...base, frequency: "weekly" }, noDom); assert.match(r.text, /साप्ताहिक \(५२ पटक\)/); assert.match(r.text, /प्रति हप्ता चाहिने निक्षेप: NPR 1,679\.08/); });
check(() => assert.match(run("savings-goal-calculator", { ...base, rate: "0" }, noDom).text, /NPR 7,500\.00/));
check(() => assert.match(run("savings-goal-calculator", { ...base, saved: "२०००००" }, noDom).text, /निक्षेप: NPR 0\.00/)); // already above target, Devanagari digits
for (const bad of [{ months: "0" }, { months: "1.5" }, { months: "" }, { target: "" }, { target: "-1" }, { saved: "-5" }, { rate: "101" }, { rate: "-1" }, { rate: "abc" }]) {
  check(() => { const r = run("savings-goal-calculator", { ...base, ...bad }, noDom); assert.equal(r.ok, false); assert.match(r.text, devanagari); });
}

// --- NEPSE share calculator -------------------------------------------------------------------
const share = { shares: "100", buy: "200", sell: "220", broker: "0.36", sebon: "0.015", dp: "25", cgt: "5" };
check(() => {
  const r = run("nepal-share-calculator", share, noDom);
  assert.equal(r.ok, true);
  assert.match(r.text, /कुल खरिद लागत: NPR 20,075\.00/);
  assert.match(r.text, /खरिद मूल्य: NPR 20,000\.00/);
  assert.match(r.text, /अनुमानित बिक्री शुल्क: NPR 107\.50/);
  assert.match(r.text, /CGT अघिको नाफा\/नोक्सान: NPR 1,817\.50/);
  assert.match(r.text, /CGT अनुमान: NPR 90\.88/);
  assert.match(r.text, /खुद नाफा\/नोक्सान अनुमान: NPR 1,726\.63/);
});
check(() => { const r = run("nepal-share-calculator", { ...share, sell: "150" }, noDom); assert.match(r.text, /CGT अनुमान: NPR 0\.00/); assert.match(r.text, /NPR -/); }); // loss: no CGT
for (const bad of [{ shares: "0" }, { shares: "1.5" }, { shares: "" }, { buy: "-1" }, { sell: "x" }, { dp: "-1" }, { broker: "101" }, { cgt: "-1" }, { sebon: "" }]) {
  check(() => { const r = run("nepal-share-calculator", { ...share, ...bad }, noDom); assert.equal(r.ok, false); assert.match(r.text, devanagari); });
}

// --- XML / HTML via injected parser (real DOM parsing is exercised in the Chromium E2E) ----------
const fakeXml = { parseXml: (raw) => raw.includes("<bad") ? { errorText: "error on line 1", serialized: "" } : { errorText: null, serialized: raw }, htmlToText: (raw) => raw.replace(/<[^>]+>/g, "") };
check(() => assert.equal(formatXml("<root><item id=\"1\">Hello</item></root>", fakeXml).text, "<root>\n  <item id=\"1\">Hello</item>\n</root>"));
check(() => assert.equal(formatXml("<bad", fakeXml).ok, false));
check(() => assert.match(formatXml("<bad", fakeXml).text, /XML मान्य छैन/));
check(() => assert.equal(formatXml("   ", fakeXml).ok, false));
check(() => assert.equal(formatXml("x".repeat(1_000_001), fakeXml).ok, false));
check(() => assert.equal(stripHtml("<h1>Hello</h1><p>Welcome <b>back</b>.</p>", fakeXml).text, "HelloWelcome back."));
check(() => assert.equal(stripHtml("", fakeXml).ok, false));
check(() => assert.equal(stripHtml("x".repeat(1_000_001), fakeXml).ok, false));

console.log(`Nepali final tools (savings, share, XML, HTML) tests passed (${assertions} assertions).`);
