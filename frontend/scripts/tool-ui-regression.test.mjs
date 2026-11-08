import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const niroj = read("../components/Niroj77Tool.tsx");
const pdfora = read("../components/PDForaTool.tsx");
const utilities = read("../components/AllTools.tsx");
const homepage = read("../components/HomePageClient.tsx");

for (const [name, source] of [["Niroj77Tool", niroj], ["PDForaTool", pdfora]]) {
  assert.ok(source.includes('const imageUpload = accept.includes("image/")'), name + " must detect image uploads from the accepted MIME types");
  assert.ok(source.includes("Choose or drop image files"), name + " must show image-specific upload instructions");
  assert.ok(source.includes("Image files up to 50 MB each"), name + " must show the image upload size limit");
  assert.ok(source.includes("invalidImage"), name + " must reject unsupported image files, including drag-and-drop");
  assert.ok(source.includes("locale === \"ne\""), name + " must retain Nepali feedback");
}

assert.ok(utilities.includes("const u=URL.createObjectURL(new Blob([text],{type}))") && utilities.includes("window.setTimeout(()=>URL.revokeObjectURL(u),1000)"), "Image downloads must retain the generated object URL long enough to start");
assert.ok(utilities.includes("if(sourceUrl)URL.revokeObjectURL(sourceUrl)") && utilities.includes("if(outputUrl)URL.revokeObjectURL(outputUrl)"), "Image source and output object URLs must be cleaned up on success and failure");
assert.ok(utilities.includes("if(file.size>50*1024*1024)"), "Image tools must reject files over the advertised size limit");
assert.ok(!homepage.includes("upload the required file"), "Homepage utility cards must not give generic PDF-upload instructions");
assert.ok(homepage.includes("review the result before using or downloading it"), "Homepage cards must show neutral, tool-appropriate guidance");


const quickUtilities = read("../components/QuickUtilityTools.tsx");
const extraTools = read("../components/ExtraTools.tsx");
const nepalTools = read("../components/NepalTools.tsx");
const inputHelpers = read("../lib/catalog-inputs.ts");
const catalogText = read("../lib/catalog-text.ts");
assert.ok(quickUtilities.includes("parseRequiredNumber(get(k))"), "QuickUtilityTools must reject blank numeric fields");
assert.ok(extraTools.includes("parseRequiredNumber(val(k))"), "ExtraTools must reject blank numeric fields");
assert.ok(quickUtilities.includes("jsonToYaml(obj)"), "JSON-to-YAML must use the tested serializer");
assert.ok(quickUtilities.includes("result=csvToJson(t)"), "CSV-to-JSON must use the strict parser");
assert.ok(catalogText.includes("CSV row ") && catalogText.includes("unclosed quoted field"), "CSV parser must reject malformed and ragged rows");
assert.ok(quickUtilities.includes("randomBelow(6)+1"), "Dice rolls must use unbiased random integers");
assert.ok(extraTools.includes("chars[randomBelow(chars.length)]"), "Password characters must use unbiased random integers");
assert.ok(inputHelpers.includes("value >= limit"), "Random helper must reject the incomplete modulo bucket");
assert.ok(utilities.includes("raw.trim()===""?Number.NaN:Number(raw)"), "PDF/calculator workspace must reject blank and malformed numeric fields instead of coercing them to zero");
assert.ok(utilities.includes("wordCount>=8&&wordCount<=500"), "Lorem Ipsum generator must enforce its advertised word-count bounds");

assert.ok(nepalTools.includes('amount.trim()!==""&&rate.trim()!==""'), "Nepal VAT must reject blank amount and rate fields");
assert.ok(nepalTools.includes('number.trim()!==""&&Number.isSafeInteger(n)'), "Nepali number conversion must not treat blank input as zero");
assert.ok(nepalTools.includes('weight.trim()!==""&&Number.isFinite(n)'), "Tola/gram conversion must reject blank weight");
assert.ok(nepalTools.includes('shares,buyPrice,sellPrice,brokerRate,sebonRate,dpCharge,cgtRate].every(x=>x.trim()!=="")'), "NEPSE share calculator must require every charge and price input");

console.log("Tool UI regression checks passed: image upload copy, validation, object URL lifecycle and homepage guidance.");
