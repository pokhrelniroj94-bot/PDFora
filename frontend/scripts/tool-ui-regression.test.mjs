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

assert.ok(utilities.includes("window.setTimeout(()=>URL.revokeObjectURL(outputUrl),1000)"), "Image downloads must retain the generated object URL long enough to start");
assert.ok(utilities.includes("if(sourceUrl) URL.revokeObjectURL(sourceUrl)"), "Image source object URLs must be cleaned up");
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
assert.ok(utilities.includes("if(!raw.trim())return Number.NaN"), "PDF/calculator workspace must not coerce blank or malformed numeric fields to zero");
assert.ok(utilities.includes("wordCount>=8&&wordCount<=500"), "Lorem Ipsum generator must enforce its advertised word-count bounds");

assert.ok(nepalTools.includes('amount.trim()!==""&&rate.trim()!==""'), "Nepal VAT must reject blank amount and rate fields");
assert.ok(nepalTools.includes('number.trim()!==""&&Number.isSafeInteger(n)'), "Nepali number conversion must not treat blank input as zero");
assert.ok(nepalTools.includes('weight.trim()!==""&&Number.isFinite(n)'), "Tola/gram conversion must reject blank weight");
assert.ok(nepalTools.includes('shares,buyPrice,sellPrice,brokerRate,sebonRate,dpCharge,cgtRate].every(x=>x.trim()!=="")'), "NEPSE share calculator must require every charge and price input");

const sharedPdfGuide = read("../components/ToolSEOContent.tsx");
assert.ok(sharedPdfGuide.includes("some supported operations run locally in your browser") && sharedPdfGuide.includes("PDFora&apos;s processing service"), "Shared PDF guidance must explain both local and service processing");
assert.ok(sharedPdfGuide.includes("If the PDF is not accepted or processing does not start"), "Shared PDF troubleshooting must not imply every tool uploads files");
assert.ok(sharedPdfGuide.includes("appropriate viewer or app") && sharedPdfGuide.includes("supports its output format") && !sharedPdfGuide.includes("another PDF reader"), "Shared PDF guide must check the actual output format, not assume every tool downloads a PDF");

const mergeLimitCopy = read("../components/PDForaTool.tsx");
assert.ok(mergeLimitCopy.includes('endpoint === "/api/merge"') && mergeLimitCopy.includes("Combined PDF upload limit: 50 MB total"), "Merge PDF must display its combined 50 MB limit, not a per-file limit");
const toolGuideSource = read("../lib/tool-guides.ts");
assert.ok(toolGuideSource.includes("The processing method depends on the operation and supported options"), "Generic PDF guides must distinguish browser access from processing location");
assert.ok(!toolGuideSource.includes("PDFora provides this workflow in a browser"), "Generic PDF guides must not imply that every operation processes locally");

const deletePagesPage = read("../app/delete-pages/page.tsx");
assert.ok(deletePagesPage.includes("runs locally in your browser") && deletePagesPage.includes("not uploaded to PDFora&apos;s processing server"), "Delete Pages must disclose its local browser processing method");

const pdfToJpgPage = read("../app/pdf-to-jpg/page.tsx");
assert.ok(pdfToJpgPage.includes("processing service"), "PDF to JPG must disclose that the selected PDF uses the processing service");
assert.doesNotMatch(pdfToJpgPage, /browser-based workflow|directly from your browser on desktop/i, "PDF to JPG must not claim local browser processing while it uses the server endpoint");

const compressPage = read("../app/compress-pdf/page.tsx");
assert.ok(compressPage.includes("PDFora processing service") && compressPage.includes("not compressed") && compressPage.includes("locally in your browser"), "Compress PDF must disclose server processing");
const imagesToPdfPage = read("../app/images-to-pdf/page.tsx");
assert.ok(imagesToPdfPage.includes("JPG, JPEG and PNG files are processed in your") && imagesToPdfPage.includes("WebP files may use the PDFora processing service"), "Images to PDF must distinguish browser-supported formats from WebP service fallback");
const watermarkPage = read("../app/watermark/page.tsx");
assert.ok(watermarkPage.includes("Compatible ASCII text") && watermarkPage.includes("Nepali characters") && watermarkPage.includes("processing service"), "Watermark must disclose the ASCII browser and non-ASCII service paths");
assert.ok(niroj.includes('case "/api/delete-pages": return { type: "deletePages", pages: value } as const;'), "Delete Pages must be wired to the browser worker when local processing is advertised");
const pdfWorker = read("../app/tools/pdfWorkerImpl.ts");
assert.ok(pdfWorker.includes('case "deletePages":'), "Delete Pages browser processing must have a matching worker implementation");

console.log("Tool UI regression checks passed: image upload copy, validation, object URL lifecycle and homepage guidance.");
