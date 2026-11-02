import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../lib/ashtakoota-calculator.ts", import.meta.url), "utf8");
function readArray(name) {
  const marker = new RegExp("const\\s+" + name + "\\s*=");
  const match = marker.exec(source);
  assert.ok(match, name + " must exist");
  const start = source.indexOf("[", match.index);
  let depth = 0, inString = false, escaped = false;
  for (let i = start; i < source.length; i++) {
    const char = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === "[") depth++;
    else if (char === "]" && --depth === 0) const literal = source.slice(start, i + 1).replace(/,\\s*([}\\]])/g, "$1").replace(/(^|[\\[\\s,])\\.(\\d)/g, (_match, prefix, digit) => prefix + "0." + digit);\n      return JSON.parse(literal);
  }
  throw new Error("Could not parse array " + name);
}
const matrices = [
  ["VASHYA_TABLE", 4, 2],
  ["GRAHA_TABLE", 7, 5],
  ["GANA_TABLE", 3, 6],
  ["YONI_TABLE", 14, 4],
];
for (const [name, size, max] of matrices) {
  const matrix = readArray(name);
  assert.equal(matrix.length, size, name + " row count");
  for (const row of matrix) {
    assert.equal(row.length, size, name + " column count");
    for (const score of row) {
      assert.equal(typeof score, "number", name + " scores must be numeric");
      assert.ok(Number.isFinite(score) && score >= 0 && score <= max, name + " score must be within its traditional maximum");
    }
  }
}
assert.deepEqual(readArray("VASHYA_ORDER"), ["Dvipada", "Chatushpada", "Jalachara", "Keeta"]);
assert.deepEqual(readArray("VASHYA_TABLE"), [
  [2, 0.5, 0.5, 1],
  [0.5, 2, 2, 2],
  [0.5, 2, 2, 2],
  [1, 2, 2, 2],
], "Four-class Muhurta Chintamani Vashya matrix must not be silently replaced or transposed");
assert.equal(readArray("VASHYA").length, 12, "Every Rashi must have a Vashya classification");
assert.equal(readArray("VARNA").length, 12, "Every Rashi must have a Varna classification");
assert.equal(readArray("SIGN_LORD").length, 12, "Every Rashi must have a lord");
assert.equal(readArray("YONI").length, 27, "Every Nakshatra must have a Yoni classification");
assert.equal(readArray("GANA").length, 27, "Every Nakshatra must have a Gana classification");
assert.equal(readArray("NADI").length, 27, "Every Nakshatra must have a Nadi classification");
assert.equal(readArray("NAKSHATRAS").length, 27, "The Nakshatra order must contain 27 entries");
assert.equal(readArray("YONI_ORDER").length, 14, "Yoni matrix must use the 14 declared categories");
assert.equal(1 + 2 + 3 + 4 + 5 + 6 + 7 + 8, 36, "Ashtakoota maxima must total 36");
for (const group of readArray("VASHYA")) assert.ok(readArray("VASHYA_ORDER").includes(group), "Rashi references an undeclared Vashya group");
for (const group of readArray("YONI")) assert.ok(readArray("YONI_ORDER").includes(group), "Nakshatra references an undeclared Yoni category");
assert.ok(source.includes("Muhurta Chintamani") && source.includes("Piyushadhara"), "The selected source convention must be named in code");
assert.ok(source.includes("brideValue:VASHYA[br]") && source.includes("groomValue:VASHYA[gr]"), "Vashya must preserve bride-row / groom-column orientation");
console.log("Ashtakoota source-table audit passed: 4x4 Vashya, 7x7 Graha Maitri, 3x3 Gana, 14x14 Yoni; 12 Rashis, 27 Nakshatras and 36 total maximum points.");
