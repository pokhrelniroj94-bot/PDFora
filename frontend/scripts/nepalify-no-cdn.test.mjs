// Extra regression checks for the locally vendored Nepalify engine (lib/nepalify) and the no-CDN policy.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ensureTypeStripping, loadTsFiles, frontendRoot } from "./lib/load-i18n.mjs";

ensureTypeStripping();
const { index } = await loadTsFiles(["lib/nepalify/index.ts"]);
const r = (t) => index.format(t, { layout: "romanized" });
assert.equal(r("nms/te"), "नमस्ते");
assert.equal(r("nms/te mero deS nepal ho"), "नमस्ते मेरो देश नेपाल हो");
assert.equal(r("Dn/yvad"), "धन्यवाद");
assert.equal(r("namaste"), "नामासते", "romanized layout is a keyboard layout, not phonetic");
assert.match(r("namaste mero desh nepal ho"), /[ऀ-ॿ]/u);
assert.equal(r(""), "");
assert.equal(r("kKgG<cCjJYqQxXNtTdDnpPbBmyrlvsSzh"), "कखगघङछचजझञटठडढणतथदधनपफबभमयरलवसशषह");
assert.equal(r("HA[{fF]}OWZ"), "अआइईउऊएऐओऔऋ");
assert.ok(!/function|\[object/.test(r("toString __proto__ constructor")));

assert.match(fs.readFileSync(path.join(frontendRoot, "lib/nepalify/LICENSE"), "utf8"), /Suvash Thapaliya/);

// No runtime CDN loading of the typing engine anywhere in shipped source, and CSP does not allow CDN scripts for it.
const offenders = [];
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
  if (["node_modules", ".next", ".git"].includes(e.name)) continue;
  const p = path.join(d, e.name);
  if (e.isDirectory()) walk(p);
  else if (/\.(tsx?|mjs|js)$/.test(e.name) && /(cdn\.jsdelivr\.net|unpkg\.com)[^"'`]*nepalify|nepalify[^"'`]*(jsdelivr|unpkg)/i.test(fs.readFileSync(p, "utf8"))) offenders.push(p);
} };
for (const d of ["components", "app", "lib"]) walk(path.join(frontendRoot, d));
assert.deepEqual(offenders, [], "Nepalify must not load from a CDN");
assert.ok(!/cdn\.jsdelivr\.net|unpkg\.com/.test(fs.readFileSync(path.join(frontendRoot, "next.config.ts"), "utf8")), "CSP must not allow jsDelivr/unpkg");
console.log("Nepalify no-CDN and keyboard-layout regression checks passed.");
