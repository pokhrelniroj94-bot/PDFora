import assert from "node:assert/strict";
import { runNepaliTextTool } from "../lib/i18n/nepali-text-tools.ts";

assert.equal(runNepaliTextTool("word-character-counter", "नमस्ते world"), "शब्द: 2\nअक्षर (space सहित): 12\nअक्षर (space बाहेक): 11\nअनुच्छेद: 1");
assert.equal(runNepaliTextTool("case-converter", "Hello World", { caseMode: "lower" }), "hello world");
assert.equal(runNepaliTextTool("case-converter", "hello world", { caseMode: "title" }), "Hello World");
assert.equal(runNepaliTextTool("remove-duplicate-lines", "क\nख\nक\n"), "क\nख\n");
assert.equal(runNepaliTextTool("sort-lines", "ख\nक\n"), "क\nख\n");
assert.equal(runNepaliTextTool("reverse-text", "नेपाल"), "लापेन");
assert.equal(runNepaliTextTool("whitespace-cleaner", "  hello   world  \n\n  नमस्ते  "), "hello world\nनमस्ते");
assert.equal(runNepaliTextTool("character-frequency", "aba"), "a — 2\nb — 1");
assert.equal(runNepaliTextTool("word-frequency-counter", "Hello hello नमस्ते"), "hello — 2\nनमस्ते — 1");
assert.match(runNepaliTextTool("reading-time-calculator", "one two three", { wordsPerMinute: 60 }), /60 शब्द\/मिनेट/);
assert.equal(runNepaliTextTool("line-counter", "a\n\nb"), "कुल लाइन: 3\nखाली लाइन: 1\nसामग्री भएका लाइन: 2");
assert.equal(runNepaliTextTool("sentence-counter", "पहिलो वाक्य। दोस्रो वाक्य!"), "अनुमानित वाक्य: 2\nशब्द: 4");
assert.equal(runNepaliTextTool("word-character-counter", ""), "शब्द: 0\nअक्षर (space सहित): 0\nअक्षर (space बाहेक): 0\nअनुच्छेद: 0");
assert.equal(runNepaliTextTool("email-extractor", "Contact a@example.com or a@example.com and b@test.org"), "a@example.com\\nb@test.org");
assert.equal(runNepaliTextTool("url-extractor", "See https://example.com/page, then www.example.org!"), "https://example.com/page\\nwww.example.org");
assert.equal(runNepaliTextTool("phone-number-extractor", "Call +977 980-123-4567 or 123"), "+977 980-123-4567");
assert.equal(runNepaliTextTool("number-extractor", "कुल १२.५ र -42.75"), "१२.५\\n-42.75");
assert.equal(runNepaliTextTool("hashtag-extractor", "#नेपाली #PDFora #नेपाली"), "#नेपाली\\n#PDFora");
assert.equal(runNepaliTextTool("remove-duplicate-words", "PDFora pdfora tools tools"), "PDFora tools");
assert.equal(runNepaliTextTool("find-replace-text", "hello hello", { findText: "hello", replaceText: "नमस्ते" }), "नमस्ते नमस्ते");
assert.equal(runNepaliTextTool("find-replace-text", "hello", { findText: "" }), "खोज्नुपर्ने पाठ प्रविष्ट गर्नुहोस्।");
assert.equal(runNepaliTextTool("palindrome-checker", "A man, a plan, a canal: Panama"), "यो पाठ पालिन्ड्रोम हो।");
assert.equal(runNepaliTextTool("palindrome-checker", "नेपाल"), "यो पाठ पालिन्ड्रोम होइन।");
assert.equal(runNepaliTextTool("acronym-generator", "World Health Organization"), "WHO");

console.log("Nepali text utility functional tests passed (24 assertions).");
