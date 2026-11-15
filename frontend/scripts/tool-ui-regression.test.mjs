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
assert.ok(sharedPdfGuide.includes("Depending on the tool and selected options") && sharedPdfGuide.includes("PDFora's processing service"), "Shared PDF guidance must explain both local and service processing");
assert.ok(sharedPdfGuide.includes("Read the processing notice shown above") && sharedPdfGuide.includes("Avoid submitting the same request repeatedly"), "Shared PDF guidance must keep accurate processing and troubleshooting advice");
assert.doesNotMatch(sharedPdfGuide, /\{labels\[(?:5|6|7|8|9|10)\]\}/, "Shared PDF guide must not render generic boilerplate sections on every tool page");
assert.ok(sharedPdfGuide.includes("app that supports its output format") && sharedPdfGuide.includes("spreadsheets or text exports"), "Shared PDF guide must check the actual output format, not assume every tool downloads a PDF");
assert.equal((sharedPdfGuide.match(/\{ q:/g) || []).length, 4, "Shared PDF FAQs must stay concise and tool-specific");
assert.doesNotMatch(sharedPdfGuide, /Can I use this PDF tool on a phone|Should I keep a copy of the original PDF/, "Shared PDF FAQs must not repeat generic questions across every tool");
assert.ok(sharedPdfGuide.includes("!isGeneratedGuide(guide.blogSlug)") && sharedPdfGuide.includes("/ne/blog/${guide.blogSlug}"), "Tool pages must link only to curated blog guides and use the Nepali guide URL when localized");

for (const page of ["rotate-pdf", "pdf-to-jpg", "pdf-to-word", "split-pdf", "images-to-pdf", "delete-pages", "extract-pages", "add-background", "bates-numbering", "pdf-to-csv", "pdf-to-bmp", "pdf-to-tiff", "pdf-to-json", "page-counter", "extract-fonts", "add-bookmarks", "pdf-to-markdown", "remove-pdf-links", "remove-attachments", "remove-annotations", "split-by-bookmarks", "remove-pdf-metadata", "pdf-information"]) {
  const pageSource = read("../app/" + page + "/page.tsx");
  assert.doesNotMatch(pageSource, /ToolGuide|getRequiredToolGuide/, page + " must not duplicate the shared SEO guide rendered by Niroj77Tool");
  assert.ok(pageSource.includes("showSeoContent={false}"), page + " must use its own page-specific SEO guide without appending the shared duplicate");
  const pageLayout = read("../app/" + page + "/layout.tsx");
  assert.doesNotMatch(pageLayout, /ToolSEOContent/, page + " must not append the same shared SEO guide from its layout");
  assert.doesNotMatch(pageSource, /How to use/, page + " must not render a second page-level how-to block beside the shared tool guide");
}

const mergePage = read("../app/merge-pdf/page.tsx");
assert.ok(mergePage.includes("showSeoContent={false}") && mergePage.includes("showInlineGuide={false}"), "Merge PDF must use its hand-written guide without a second shared guide block");
assert.ok(pdfora.includes("showInlineGuide = true") && pdfora.includes("{!showSeoContent && ("), "PDForaTool must not render duplicate how-to and privacy sections beside the shared SEO guide");

const mergeLimitCopy = read("../components/PDForaTool.tsx");
assert.ok(mergeLimitCopy.includes('endpoint === "/api/merge"') && mergeLimitCopy.includes("Combined PDF upload limit: 50 MB total"), "Merge PDF must display its combined 50 MB limit, not a per-file limit");
assert.ok(mergeLimitCopy.includes("Merging PDFs locally in your browser") && mergeLimitCopy.includes("No files were uploaded to the server"), "Merge PDF must disclose its actual browser-only processing path");
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
assert.ok(niroj.includes('endpoint === "/api/images-to-pdf" ?') && niroj.includes("Combined image upload limit: 50 MB total"), "Images to PDF must display its combined upload limit");
assert.ok(niroj.includes('imageUpload ? "Choose image files" : "Choose PDF files"'), "Image upload input must have an image-specific accessible label");
assert.ok(niroj.includes('(endpoint === "/api/images-to-pdf" || browserOnly)') && niroj.includes("The combined size of all selected images must not exceed 50 MB."), "Images to PDF must enforce the 50 MB combined limit for both browser and service paths");

const imagesToPdfPage = read("../app/images-to-pdf/page.tsx");
assert.ok(imagesToPdfPage.includes("JPG, JPEG and PNG files are processed in your") && imagesToPdfPage.includes("WebP files may use the PDFora processing service"), "Images to PDF must distinguish browser-supported formats from WebP service fallback");
const watermarkPage = read("../app/watermark/page.tsx");
assert.ok(watermarkPage.includes("compatible ASCII watermark text") && watermarkPage.includes("Nepali characters") && watermarkPage.includes("may not render correctly"), "Watermark must disclose ASCII browser processing and the limitations of service fallback text");
const signPage = read("../app/sign-pdf/page.tsx");
assert.ok(signPage.includes("basic English/ASCII characters") && signPage.includes("not a certificate-based digital signature"), "Typed signature must disclose its character and signature-type limitations");
assert.ok(niroj.includes("Processing depends on image format") && niroj.includes("WebP files use the PDFora processing service"), "Images to PDF must explain its format-dependent processing before file selection");
assert.ok(niroj.includes('file.type ? file.type === "image/jpeg" || file.type === "image/png"'), "Images to PDF must not treat a WebP MIME file with a JPG filename as a local JPEG");
assert.ok(niroj.includes("Processing depends on watermark text") && niroj.includes("Local typed-signature processing"), "Conditional text-based PDF tools must not show a blanket server-processing claim before input");
assert.ok(niroj.includes(String.raw`endpoint === "/api/sign" && !/^[\x20-\x7E]+$/.test(value.trim())`) && niroj.includes("the PDF will not be uploaded"), "Unsupported typed-signature characters must be rejected before any file upload");
assert.ok(niroj.includes('case "/api/delete-pages": return { type: "deletePages", pages: value } as const;'), "Delete Pages must be wired to the browser worker when local processing is advertised");
const pdfWorker = read("../app/tools/pdfWorkerImpl.ts");
assert.ok(pdfWorker.includes('case "deletePages":'), "Delete Pages browser processing must have a matching worker implementation");


const consent = read("../components/CookieConsent.tsx");
const nativeAds = read("../app/components/AdsterraNative.tsx");
const rootLayout = read("../app/layout.tsx");
assert.ok(consent.includes('preferences?.advertising && <Script src="https://bauval.org/14/38ed7250c45fe280d3bdcf13969b4498"'), "Global advertising script must load only after explicit advertising consent");
assert.ok(consent.includes('new CustomEvent("pdfora:consent-updated"'), "Consent changes must notify advertising placements immediately");
assert.ok(consent.includes("if (revokingAdvertising) window.location.reload()"), "Revoking advertising consent must reload without previously injected ad scripts");
assert.ok(nativeAds.includes('JSON.parse(saved).advertising === true') && nativeAds.includes('if (!allowed) return null;'), "Native ad placements must remain absent until advertising consent is granted");
assert.ok(!rootLayout.includes("bauval.org/14/38ed7250c45fe280d3bdcf13969b4498"), "Root layout must not load advertising scripts unconditionally");
assert.ok(!rootLayout.includes('import AdsterraNative from "./components/AdsterraNative"') && !rootLayout.includes("<AdsterraNative />"), "Ads must use page-specific placements rather than a global root slot");
assert.ok(utilities.includes('import AdsterraNative from "../app/components/AdsterraNative"') && (utilities.match(/<AdsterraNative \/>/g) || []).length >= 4, "Tool pages and directory must retain their individual native ad placements");
assert.ok(!utilities.includes("AdsterraSkyscraper"), "Skyscraper/banner ads must be restricted to blog pages");
assert.ok(read("../app/blog/page.tsx").includes("<AdsterraNative />") && read("../app/blog/page.tsx").includes("<AdsterraSkyscraper />"), "Blog listing must retain its distinct native and skyscraper placements");
assert.ok(read("../app/blog/[slug]/page.tsx").includes("<AdsterraNative />") && read("../app/blog/[slug]/page.tsx").includes("<AdsterraSkyscraper />"), "Blog articles must retain their distinct native and skyscraper placements");

console.log("Tool UI regression checks passed: image upload copy, validation, object URL lifecycle and homepage guidance.");
