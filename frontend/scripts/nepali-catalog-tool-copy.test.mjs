import assert from "node:assert/strict";
import {
  localizeNepaliToolError,
  localizeNepaliToolOutput,
  nepaliExtraFieldLabel,
  nepaliQuickFieldLabel,
} from "../lib/i18n/nepali-catalog-tool-copy.ts";

assert.equal(nepaliExtraFieldLabel("password-generator", "len", "Length"), "पासवर्डको लम्बाइ (८–१२८)");
assert.equal(nepaliExtraFieldLabel("savings-goal-calculator", "months", "Months"), "लक्ष्य पूरा गर्ने महिना");
assert.equal(nepaliQuickFieldLabel("date", "Date"), "सुरुको मिति");
assert.equal(localizeNepaliToolOutput("meta-title-checker", "Characters: 52\nWithin a common 30–60 character review range; Google may display a different title."), "अक्षर संख्या: 52\n३०–६० अक्षरको सामान्य समीक्षा दायराभित्र छ; Google ले फरक शीर्षक देखाउन सक्छ।");
assert.equal(localizeNepaliToolOutput("regex-tester", "Match: hello at index 4"), "मिलेको अंश: hello — स्थान 4");
assert.equal(localizeNepaliToolOutput("dice-roller", "Rolls: 2, 5\nTotal: 7"), "पासाको नतिजा: 2, 5\nजम्मा: 7");
assert.equal(localizeNepaliToolOutput("json-to-csv", "name,age\nAsha,22"), "name,age\nAsha,22", "machine-readable output must remain unchanged");
assert.equal(localizeNepaliToolOutput("robots-txt-generator", "User-agent: *\nAllow: /"), "User-agent: *\nAllow: /", "robots.txt directives must remain machine-readable");
assert.equal(localizeNepaliToolError("Enter a target keyword."), "लक्षित keyword लेख्नुहोस्।");
assert.equal(localizeNepaliToolError("A JWT must have three dot-separated parts."), "JWT मा बिन्दुले छुट्याएका तीन भाग हुनुपर्छ।");

console.log("Nepali catalog utility copy tests passed (10 assertions).");
