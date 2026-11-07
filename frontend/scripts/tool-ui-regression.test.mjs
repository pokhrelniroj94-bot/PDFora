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

console.log("Tool UI regression checks passed: image upload copy, validation, object URL lifecycle and homepage guidance.");
