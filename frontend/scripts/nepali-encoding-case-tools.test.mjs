import assert from "node:assert/strict";
import { runNepaliEncodingCaseTool as run, caseTokens, nepaliEncodingCaseToolSlugs } from "../lib/i18n/nepali-encoding-case-tools.ts";
import { toRoman, fromRoman } from "../lib/roman-numerals.ts";

const text = (slug, values) => run(slug, values).text;
let assertions = 0;
const check = (fn) => { fn(); assertions += 1; };

// binary / hex round trips, including Devanagari (multi-byte UTF-8)
check(() => assert.equal(text("text-to-binary", { text: "Hi" }), "01001000 01101001"));
check(() => assert.equal(text("binary-to-text", { text: "01001000 01101001" }), "Hi"));
check(() => assert.equal(text("binary-to-text", { text: text("text-to-binary", { text: "नमस्ते" }) }), "नमस्ते"));
check(() => assert.equal(text("text-to-hex", { text: "Hello" }), "48 65 6c 6c 6f"));
check(() => assert.equal(text("hex-to-text", { text: "48:65-6c,6c 6f" }), "Hello"));
check(() => assert.equal(text("hex-to-text", { text: text("text-to-hex", { text: "नेपाल" }) }), "नेपाल"));
check(() => assert.equal(run("text-to-binary", { text: "" }).ok, false));
check(() => assert.equal(run("binary-to-text", { text: "0100" }).ok, false));
check(() => assert.equal(run("binary-to-text", { text: "11111111" }).ok, false)); // invalid UTF-8
check(() => assert.equal(run("hex-to-text", { text: "zz" }).ok, false));
check(() => assert.equal(run("hex-to-text", { text: "ff" }).ok, false));

// morse
check(() => assert.equal(text("morse-code-translator", { text: "SOS HELP", mode: "encode" }), "... --- ... / .... . .-.. .--."));
check(() => assert.equal(text("morse-code-translator", { text: "... --- ... / .... . .-.. .--.", mode: "decode" }), "sos help"));
check(() => assert.match(text("morse-code-translator", { text: "... ......", mode: "decode" }), /\?/));
check(() => assert.equal(run("morse-code-translator", { text: "नमस्ते", mode: "encode" }).ok, false));
check(() => assert.match(text("morse-code-translator", { text: "a नमस्ते", mode: "encode" }), /^\.-/));
check(() => assert.equal(run("morse-code-translator", { text: "   ", mode: "encode" }).ok, false));

// case converters (parity with English on Latin input, plus Unicode support)
check(() => assert.equal(text("camel-case-converter", { text: "Convert this phrase" }), "convertThisPhrase"));
check(() => assert.equal(text("snake-case-converter", { text: "Convert this phrase" }), "convert_this_phrase"));
check(() => assert.equal(text("kebab-case-converter", { text: "Convert this phrase" }), "convert-this-phrase"));
check(() => assert.equal(text("snake-case-converter", { text: "helloWorld XMLHttp" }), "hello_world_xmlhttp"));
check(() => assert.equal(text("kebab-case-converter", { text: "Café déjà" }), "cafe-deja"));
check(() => assert.equal(text("kebab-case-converter", { text: "नेपाली भाषा 2083" }), "नेपाली-भाषा-2083"));
check(() => assert.deepEqual(caseTokens("  --  "), []));
check(() => assert.equal(run("camel-case-converter", { text: "!!!" }).ok, false));

// JSON escape / unescape
check(() => assert.equal(text("json-escape-unescape", { text: 'a"b\nc', mode: "escape" }), 'a\\"b\\nc'));
check(() => assert.equal(text("json-escape-unescape", { text: 'a\\"b\\nc', mode: "unescape" }), 'a"b\nc'));
check(() => assert.equal(text("json-escape-unescape", { text: '"x\\ty"', mode: "unescape" }), "x\ty"));
check(() => assert.equal(text("json-escape-unescape", { text: "\\u0928", mode: "unescape" }), "न"));
check(() => assert.equal(run("json-escape-unescape", { text: "bad\\q", mode: "unescape" }).ok, false));
check(() => assert.equal(run("json-escape-unescape", { text: "123", mode: "unescape" }).ok, true));

// px / rem
check(() => assert.equal(text("px-rem-converter", { value: "24", root: "16", mode: "px-to-rem" }), "1.5000 rem"));
check(() => assert.equal(text("px-rem-converter", { value: "1.5", root: "16", mode: "rem-to-px" }), "24.0000 px"));
check(() => assert.equal(text("px-rem-converter", { value: "२४", root: "१६", mode: "px-to-rem" }), "1.5000 rem"));
check(() => assert.equal(run("px-rem-converter", { value: "24", root: "0", mode: "px-to-rem" }).ok, false));
check(() => assert.equal(run("px-rem-converter", { value: "", root: "16" }).ok, false));
check(() => assert.equal(run("px-rem-converter", { value: "abc", root: "16" }).ok, false));

// Roman numerals: parity with lib/roman-numerals.ts across the full range
check(() => { for (let n = 1; n <= 3999; n += 1) { assert.equal(text("roman-numeral-converter", { text: String(n) }), toRoman(n)); assert.equal(text("roman-numeral-converter", { text: toRoman(n) }), String(n)); } });
check(() => assert.equal(text("roman-numeral-converter", { text: "२०२६" }), "MMXXVI"));
check(() => assert.equal(text("roman-numeral-converter", { text: "mmxxvi" }), "2026"));
for (const bad of ["0", "4000", "IIII", "VX", "ABC", ""]) check(() => assert.equal(run("roman-numeral-converter", { text: bad }).ok, false));
check(() => assert.throws(() => fromRoman("IIII")));

// registry sanity
check(() => assert.equal(new Set(nepaliEncodingCaseToolSlugs).size, 11));
for (const slug of nepaliEncodingCaseToolSlugs) check(() => assert.ok(typeof run(slug, {}).text === "string" && run(slug, {}).text.length > 0));

console.log(`Nepali encoding/case/unit tool tests passed (${assertions} assertions).`);
