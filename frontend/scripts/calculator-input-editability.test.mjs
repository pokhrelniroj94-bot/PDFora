import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const quick = fs.readFileSync(path.join(root, "components/QuickUtilityTools.tsx"), "utf8");
const extra = fs.readFileSync(path.join(root, "components/ExtraTools.tsx"), "utf8");
const all = fs.readFileSync(path.join(root, "components/AllTools.tsx"), "utf8");

assert.ok(quick.includes("numeric.has(key)?\"\":value"), "Quick calculator numeric examples must start empty");
assert.ok(quick.includes('isCalculator&&numeric.has(key)?\"number\":\"text\"'), "Quick calculator number fields must use native number inputs");
assert.ok(quick.includes("placeholder={isCalculator&&numeric.has(key)?example[key]:undefined}"), "Quick calculator examples must be hints, not locked values");
assert.ok(quick.includes("Clear inputs") && quick.includes("setV(example)"), "Quick calculators must offer clear and restore-example actions");

assert.ok(extra.includes('isCalculator&&f.type===\"number\"?\"\":f.value'), "Catalog calculator numeric examples must start empty");
assert.ok(extra.includes("placeholder={isCalculator&&f.type===\"number\"?f.value:undefined}"), "Catalog calculator examples must be placeholders");
assert.ok(extra.includes("Clear numbers") && extra.includes("Restore example"), "Catalog calculators must offer clear and restore actions");
assert.ok(!extra.includes('a:e.target.value===\"reverse\"?\"120\":\"100\"'), "Changing percentage mode must not silently reinsert sample values");

assert.ok(all.includes('const num=(k:string,d?:number)=>{const raw=v(k,d===undefined?\"\":String(d));'), "Clearing a number must not silently fall back to an example or zero");
assert.ok(all.includes('type=\"number\" inputMode=\"decimal\" step=\"any\"'), "Finance calculator fields must use editable numeric inputs");
assert.ok(all.includes("const clearCalculatorInputs=()=>{setValues({});setOutput(\"\");}"), "Finance calculators must expose a clear action");
assert.ok(all.includes('placeholder=\"e.g. 1000000\"'), "Examples must be shown as hints rather than prefilled numbers");
console.log("Calculator input editability regression checks passed.");
