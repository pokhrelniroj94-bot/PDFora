import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const source = fs.readFileSync(new URL("../lib/kundali-calculator.ts", import.meta.url), "utf8");
assert.ok(source.includes("Astronomy.Ecliptic(Astronomy.GeoVector(body, date, true))"), "Planet positions must use geocentric vectors, not heliocentric longitudes.");
assert.ok(source.includes("retrograde:true"), "Both Rahu and Ketu must be marked retrograde when the mean-node convention is used.");

const testSource = source.replace(
  'import DateConverter from "./nepali-date-converter";',
  `class DateConverter {
    constructor(value) { this.value = value; }
    toAd() { throw new Error("BS conversion is not part of this AD-only fixture"); }
    toBs() { const [year, month, date] = this.value.split("-").map(Number); return { year, month, date }; }
  }`,
);
const compiled = ts.transpileModule(testSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const tempDir = fs.mkdtempSync(path.join(process.cwd(), ".kundali-test-"));
try {
  const modulePath = path.join(tempDir, "kundali-calculator.mjs");
  fs.writeFileSync(modulePath, compiled);
  const { calculateJanmaKundali } = await import(pathToFileURL(modulePath).href);
  const result = calculateJanmaKundali({
    name: "Regression fixture",
    dateSystem: "AD",
    birthDate: "2000-01-01",
    birthTime: "12:00",
    placeId: "kathmandu",
  });

  assert.equal(result.planets.length, 9, "D1 chart must include seven classical planets plus Rahu and Ketu.");
  assert.equal(result.houses.length, 12, "D1 chart must contain twelve whole-sign houses.");
  assert.equal(result.navamsaHouses.length, 12, "D9 chart must contain twelve whole-sign houses.");
  assert.ok(result.lagna && result.moonSign && result.janmaNakshatra, "Ascendant, Moon sign and birth nakshatra must be populated.");
  assert.ok(Number.isFinite(result.lagnaDegree) && result.lagnaDegree >= 0 && result.lagnaDegree < 30, "Ascendant degree must be within its sign.");
  for (const planet of result.planets) {
    assert.ok(Number.isFinite(planet.longitude) && planet.longitude >= 0 && planet.longitude < 360, planet.key + " longitude must be normalized.");
    assert.ok(planet.house >= 1 && planet.house <= 12, planet.key + " must be assigned to a valid house.");
    assert.ok(planet.nakshatra && planet.navamsaSign, planet.key + " must have Nakshatra and Navamsa data.");
  }
  const rahu = result.planets.find((planet) => planet.key === "Rahu");
  const ketu = result.planets.find((planet) => planet.key === "Ketu");
  assert.ok(rahu && ketu, "Both lunar nodes must be present.");
  assert.equal(rahu.retrograde, true, "Mean Rahu is retrograde.");
  assert.equal(ketu.retrograde, true, "Mean Ketu is also retrograde.");
  const nodeSeparation = ((ketu.longitude - rahu.longitude + 360) % 360);
  assert.ok(Math.abs(nodeSeparation - 180) < 1e-9, "Ketu must be exactly opposite Rahu.");
  assert.throws(() => calculateJanmaKundali({
    name: "", dateSystem: "AD", birthDate: "2000-01-01", birthTime: "24:00", placeId: "kathmandu",
  }), /जन्मसमय/);
  assert.throws(() => calculateJanmaKundali({
    name: "", dateSystem: "AD", birthDate: "2001-02-29", birthTime: "12:00", placeId: "kathmandu",
  }), /जन्ममिति/);
  console.log("Janma Kundali regression tests passed: geocentric chart, D1/D9 houses, normalized planetary positions, exact Rahu/Ketu opposition and retrograde flags, and invalid-input rejection.");
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
