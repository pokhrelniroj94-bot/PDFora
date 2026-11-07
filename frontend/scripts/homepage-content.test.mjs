import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const homepage = fs.readFileSync(path.join(root, "components/HomePageClient.tsx"), "utf8");
const catalog = fs.readFileSync(path.join(root, "components/toolCatalog.ts"), "utf8");

const expected = [
  ["/tools/loan-emi-calculator", "annual interest rate", "total interest"],
  ["/tools/notes-to-pdf", "paste your notes", "print dialog"],
  ["/tools/nepal-share-calculator", "share quantity", "profit or loss"],
];
for (const [href, ...phrases] of expected) {
  const entry = homepage.match(new RegExp(`"${href.replace(/[.*+?^\\{}()|[\]\\\\]/g, "\\\\  assert.ok(homepage.includes(`"${href}"`), `Homepage must provide a specific usage guide for ${href}`);
  for (const phrase of phrases) {
    assert.ok(homepage.toLowerCase().includes(phrase.toLowerCase()), `Missing useful homepage instruction for ${href}: ${phrase}`);
  }")}":\\s*"([^"]+)"`));
  assert.ok(entry, `Homepage must provide a specific usage guide for ${href}`);
  for (const phrase of phrases) {
    assert.ok(entry[1].toLowerCase().includes(phrase.toLowerCase()), `Missing task-specific instruction for ${href}: ${phrase}`);
  }
}
assert.ok(!homepage.includes("upload the required file, follow the options and download the result"), "Homepage fallback must not falsely imply every tool requires file uploads");
for (const slug of ["loan-emi-calculator", "notes-to-pdf", "nepal-share-calculator"]) {
  assert.ok(catalog.includes(`slug:"${slug}"`), `Popular tool metadata must reference real catalog entry: ${slug}`);
}
console.log("Homepage content checks passed: popular calculator, Notes-to-PDF and NEPSE cards have accurate task-specific instructions.");
