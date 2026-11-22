// Verifies the vendored Nepalify runtime (lib/vendor/nepalify) and that no runtime CDN is used for it.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ensureTypeStripping, loadTsFiles, frontendRoot } from "./lib/load-i18n.mjs";

ensureTypeStripping();
const dir = "lib/vendor/nepalify";
const mods = await loadTsFiles(["types.ts", "romanized.ts", "traditional.ts", "index.ts"].map((f) => `${dir}/${f}`));
const { format, availableLayouts, fetchLayout, isValidLayout } = mods.index;
const r = (t) => format(t, { layout: "romanized" });

assert.equal(r("nms/te"), "नमस्ते");
assert.equal(r("nms/te mero deS nepal ho"), "नमस्ते मेरो देश नेपाल हो");
assert.equal(r("Dn/yvad"), "धन्यवाद");
assert.equal(r("namaste"), "नामासते", "romanized layout is a keyboard layout, not phonetic");
assert.match(r("namaste mero desh nepal ho"), /[ऀ-ॿ]/u);
assert.equal(r("Hello 123!"), r("Hello 123!"));
assert.equal(r(""), "");
assert.equal(r("constructor"), r("constructor"), "prototype keys must not leak");
assert.ok(!/function|\[object/.test(r("toString __proto__ constructor")));
assert.deepEqual([...availableLayouts()].sort(), ["romanized", "traditional"]);
assert.ok(isValidLayout("romanized") && !isValidLayout("nope"));
assert.throws(() => fetchLayout("nope"), /Invalid Layout/);
assert.equal(mods.romanized.default.formatKey("k"), "क");
assert.equal(mods.traditional.default.formatKey("\u0000"), undefined);

for (const f of ["LICENSE", "index.ts", "romanized.ts", "traditional.ts", "types.ts"]) assert.ok(fs.existsSync(path.join(frontendRoot, dir, f)), f);
assert.match(fs.readFileSync(path.join(frontendRoot, dir, "LICENSE"), "utf8"), /Suvash Thapaliya/);

// No runtime CDN loading of Nepalify anywhere in shipped source.
const offenders = [];
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
  if (["node_modules", ".next", ".git"].includes(e.name)) continue;
  const p = path.join(d, e.name);
  if (e.isDirectory()) walk(p);
  else if (/\.(tsx?|mjs|js)$/.test(e.name) && !p.includes("/scripts/") && /(cdn\.jsdelivr\.net|unpkg\.com)[^"'`]*nepalify|nepalify[^"'`]*(jsdelivr|unpkg)/i.test(fs.readFileSync(p, "utf8"))) offenders.push(p);
} };
for (const d of ["components", "app", "lib"]) walk(path.join(frontendRoot, d));
assert.deepEqual(offenders, [], "Nepalify must not load from a CDN");
assert.ok(!/cdn\.jsdelivr\.net/.test(fs.readFileSync(path.join(frontendRoot, "next.config.ts"), "utf8")), "CSP should not allow jsDelivr");
console.log("nepalify vendored runtime tests passed");
