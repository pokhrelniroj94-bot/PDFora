import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const quick = fs.readFileSync(path.join(root, "components/QuickUtilityTools.tsx"), "utf8");
const extra = fs.readFileSync(path.join(root, "components/ExtraTools.tsx"), "utf8");
const all = fs.readFileSync(path.join(root, "components/AllTools.tsx"), "utf8");
const specialist = fs.readFileSync(path.join(root, "components/BrowserOnlyGrowthTools.tsx"), "utf8");

assert.ok(quick.includes('numeric.has(key)?"":value'), "Quick calculator numeric examples must start empty");
assert.ok(quick.includes('isCalculator&&numeric.has(key)?"number":"text"'), "Quick calculator number fields must use native number inputs");
assert.ok(quick.includes("placeholder={isCalculator&&numeric.has(key)?example[key]:undefined}"), "Quick calculator examples must be hints, not locked values");
assert.ok(quick.includes("Clear inputs") && quick.includes("setV(example)"), "Quick calculators must offer clear and restore-example actions");

assert.ok(extra.includes('isCalculator&&f.type!=="select"?"":f.value'), "Catalog calculator inputs must start empty except selectors");
assert.ok(extra.includes("placeholder={isCalculator?f.value:undefined}"), "Catalog calculator examples must be placeholders on non-selector inputs");
assert.ok(extra.includes("Clear inputs") && extra.includes("Restore example"), "Catalog calculators must offer clear and restore actions");
assert.ok(!extra.includes('a:e.target.value==="reverse"?"120":"100"'), "Changing percentage mode must not silently reinsert sample values");

assert.ok(all.includes('const num=(k:string,d?:number)=>{const raw=v(k,d===undefined?"":String(d));'), "Clearing a number must not silently fall back to an example or zero");
assert.ok(all.includes('type="number" inputMode="decimal" step="any"'), "Finance calculator fields must use editable numeric inputs");
assert.ok(all.includes("const clearCalculatorInputs=()=>{setValues({});setOutput(\"\");}"), "Finance calculators must expose a clear action");
assert.ok(all.includes('field("principal","Loan amount (NPR)","e.g. 1000000")'), "Finance examples must be hints rather than prefilled numbers");
assert.ok(all.includes('const complete=["principal","rate","months"].every(k=>v(k).trim()!=="")'), "EMI must wait until all required inputs are entered before validating");
assert.ok(all.includes('const complete=["monthly","years","rate"].every(k=>v(k).trim()!=="")'), "SIP must wait until all required inputs are entered before validating");
assert.ok(all.includes('const complete=["price","discount","part","whole"].every(k=>v(k).trim()!=="")'), "Discount and percentage must wait until all required inputs are entered before validating");
assert.ok(all.includes('role="status" className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600"'), "Incomplete calculator inputs must show neutral guidance instead of an error");

assert.ok(specialist.includes('const [width, setWidth] = useState("")') && specialist.includes('const [minutes, setMinutes] = useState("")'), "DPI and bitrate calculator examples must start empty");
assert.ok(specialist.includes('setWidth("");setHeight("");setPrintWidth("");setPrintHeight("")') && specialist.includes('setMinutes("");setSeconds("");setSize("");setAudio("");setOverhead("")'), "Specialist calculators must expose clear-input actions");
console.log("Calculator input editability regression checks passed.");
