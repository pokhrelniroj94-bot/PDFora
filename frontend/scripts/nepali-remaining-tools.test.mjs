import assert from "node:assert/strict";
import test from "node:test";
import { analyzeKeywordDensity, buildRobotsTxt, buildSitemap, calculateContrast, calculateSavings, calculateShare, decodeJwt, findRegexMatches, minifyCss } from "../lib/i18n/nepali-remaining-tools.ts";

test("savings calculator handles zero interest and an existing balance", () => {
  assert.deepEqual(calculateSavings(100000, 10000, 12, 0), { remaining: 90000, monthlyDeposit: 7500 });
  assert.deepEqual(calculateSavings(100000, 120000, 12, 0), { remaining: 0, monthlyDeposit: 0 });
});

test("savings calculator applies monthly compounding for a positive annual rate", () => {
  const noInterest = calculateSavings(100000, 10000, 12, 0);
  const withInterest = calculateSavings(100000, 10000, 12, 12);
  assert.ok(Number.isFinite(withInterest.monthlyDeposit));
  assert.ok(withInterest.monthlyDeposit < noInterest.monthlyDeposit);
});

test("savings calculator rejects invalid boundaries", () => {
  for (const values of [[0, 0, 12, 0], [100, -1, 12, 0], [100, 0, 0, 0], [100, 0, 12, -1], [100, 0, Infinity, 0]]) {
    assert.throws(() => calculateSavings(...values), /मान जाँच/);
  }
});

test("share calculator calculates profit, fee, tax and DP fee", () => {
  const result = calculateShare(10, 100, 120, 0, 5, 25);
  assert.deepEqual(result, { buyValue: 1000, sellValue: 1200, gross: 200, fees: 0, tax: 10, net: 165 });
});

test("share calculator does not charge profit tax on a loss", () => {
  const result = calculateShare(10, 120, 100, 0, 5, 25);
  assert.equal(result.gross, -200);
  assert.equal(result.tax, 0);
  assert.equal(result.net, -225);
});

test("share calculator deducts fees before estimating tax", () => {
  const result = calculateShare(10, 100, 120, 1, 10, 25);
  assert.equal(result.fees, 22);
  assert.equal(result.tax, 17.8);
  assert.equal(result.net, 135.2);
});

test("share calculator rejects invalid quantities and negative costs/rates", () => {
  for (const values of [[0, 100, 120, 0, 0, 0], [1, -1, 120, 0, 0, 0], [1, 100, 120, -1, 0, 0], [1, 100, 120, 0, -1, 0], [1, 100, 120, 0, 0, -1], [1, NaN, 120, 0, 0, 0]]) {
    assert.throws(() => calculateShare(...values), /मान शून्य वा सकारात्मक/);
  }
});


test("regex tester enforces global matching and reports offsets", () => {
  assert.deepEqual(findRegexMatches("a1 b2", "\\d", ""), [
    { index: 1, value: "1", offset: 1 },
    { index: 2, value: "2", offset: 4 },
  ]);
  assert.throws(() => findRegexMatches("abc", "[", "g"));
  assert.throws(() => findRegexMatches("a".repeat(10001), "a"), /१०,०००/);
  assert.throws(() => findRegexMatches("a".repeat(100), "(a+)+$"), /Nested वा repeated/);
  assert.throws(() => findRegexMatches("abc", "a".repeat(257)), /२५६/);
});

test("JWT decoder parses header and payload but never verifies the signature", () => {
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const token = [encode({ alg: "HS256", typ: "JWT" }), encode({ sub: "123", role: "user" }), "signature"].join(".");
  const decoded = decodeJwt(token);
  assert.deepEqual(decoded.header, { alg: "HS256", typ: "JWT" });
  assert.deepEqual(decoded.payload, { sub: "123", role: "user" });
  assert.equal(decoded.signatureVerified, false);
  assert.throws(() => decodeJwt("not.a.jwt.token"), /तीन भाग/);
});

test("CSS minifier removes comments and redundant whitespace", () => {
  assert.equal(minifyCss("/* note */ .card { color: teal; padding: 4px; }"), ".card{color:teal;padding:4px}");
});

test("WCAG contrast checker calculates black/white ratio and rejects malformed colors", () => {
  const result = calculateContrast("#000", "#fff");
  assert.equal(result.ratio, 21);
  assert.equal(result.aaNormal, true);
  assert.equal(result.aaaNormal, true);
  assert.throws(() => calculateContrast("red", "#fff"), /#RGB/);
});

test("keyword density is case-insensitive and uses Unicode word tokens", () => {
  const density = analyzeKeywordDensity("PDFora pdfora नेपाली", "PDFora");
  assert.equal(density.totalWords, 3);
  assert.equal(density.count, 2);
  assert.ok(Math.abs(density.density - 200 / 3) < 1e-10);
  const phrase = analyzeKeywordDensity("free pdf tools and free online pdf tools", "free pdf tools");
  assert.equal(phrase.count, 2);
  assert.equal(phrase.density, 6 / 8 * 100);
  assert.deepEqual(analyzeKeywordDensity("नेपाली नेपाली", ""), {
    totalWords: 2, count: 0, density: 0,
  });
});

test("sitemap generator validates URLs and escapes XML text", () => {
  const xml = buildSitemap(["https://example.com/?a=1&b=2", "https://example.com/about"]);
  assert.match(xml, /a=1&amp;b=2/);
  assert.match(buildSitemap(["https://example.com/?q=%3E"]).replace(/&amp;/g, "&"), /&gt;/);
  assert.equal((xml.match(/<url>/g) ?? []).length, 2);
  assert.throws(() => buildSitemap(["javascript:alert(1)"]), /अमान्य URL/);
  assert.throws(() => buildSitemap([]), /कम्तीमा एउटा URL/);
  assert.throws(() => buildSitemap(Array.from({ length: 50001 }, (_, index) => `https://example.com/${index}`)), /५०,०००/);
});

test("robots generator uses an allow-by-default policy and validates sitemap URL", () => {
  assert.equal(buildRobotsTxt(), "User-agent: *\nAllow: /\n");
  assert.match(buildRobotsTxt("https://example.com/sitemap.xml"), /Sitemap: https:\/\/example.com\/sitemap.xml/);
  assert.throws(() => buildRobotsTxt("javascript:alert(1)"), /HTTP वा HTTPS/);
  assert.throws(() => buildRobotsTxt("https://example.com/\nDisallow: /secret"), /नयाँ लाइन/);
});
