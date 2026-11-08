import assert from "node:assert/strict";
import { getNepaliExtraTextToolCopy, runNepaliExtraTextTool } from "../lib/i18n/nepali-extra-text-tools.ts";

assert.equal(runNepaliExtraTextTool("email-extractor", "a@example.com a@example.com test@domain.org"), "a@example.com\ntest@domain.org");
assert.equal(runNepaliExtraTextTool("url-extractor", "See https://example.com/a, then http://test.org"), "https://example.com/a\nhttp://test.org");
assert.equal(runNepaliExtraTextTool("phone-number-extractor", "Call +977 980-123-4567 or 9812345678"), "+977 980-123-4567\n9812345678");
assert.equal(runNepaliExtraTextTool("number-extractor", "कुल १२ र 25.5"), "१२\n25.5");
assert.equal(runNepaliExtraTextTool("hashtag-extractor", "#नेपाल #PDFora #नेपाल"), "#नेपाल\n#PDFora");
assert.equal(runNepaliExtraTextTool("remove-duplicate-words", "नेपाल नेपाल राम्रो देश"), "नेपाल राम्रो देश");
assert.equal(runNepaliExtraTextTool("find-replace-text", "नेपाली भाषा", "भाषा", "भाषा राम्रो"), "नेपाली भाषा राम्रो");
assert.match(runNepaliExtraTextTool("palindrome-checker", "नमन"), /एउटै पढिन्छ/);
assert.equal(runNepaliExtraTextTool("acronym-generator", "World Health Organization"), "WHO");

for (const slug of ["email-extractor", "url-extractor", "phone-number-extractor", "number-extractor", "hashtag-extractor", "remove-duplicate-words", "find-replace-text", "palindrome-checker", "acronym-generator"]) {
  const copy = getNepaliExtraTextToolCopy(slug);
  assert.ok(copy.purpose.length > 40 && copy.steps.length >= 3 && copy.limitation.length > 40 && copy.example.length > 10, slug + " must include useful localized guidance");
}
console.log("Nepali extra text tool tests passed (9 tools, functionality and guidance).");
