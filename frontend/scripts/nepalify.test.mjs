import assert from "node:assert/strict";
import { availableLayouts, format } from "../lib/nepalify/index.ts";

assert.deepEqual(availableLayouts(), ["romanized", "traditional"]);
assert.match(format("Namaste Nepal", { layout: "romanized" }), /[\u0900-\u097F]/);
assert.match(format("asdf", { layout: "traditional" }), /[\u0900-\u097F]/);
assert.equal(format("Hello, world!", { layout: "romanized" }).includes(","), true);
assert.equal(format("123", { layout: "romanized" }), "१२३");
assert.equal(format("123", { layout: "traditional" }), "१२३");
assert.throws(() => format("test", { layout: "invalid" }), /Invalid Nepalify layout/);
console.log("Nepalify local formatter tests passed: romanized, traditional, punctuation, Devanagari digits and invalid-layout handling.");
