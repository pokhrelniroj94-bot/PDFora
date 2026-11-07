import { jsonToYaml, parseRequiredNumber, randomIntegerBelow } from "../lib/catalog-inputs";

describe("catalog input and serialization helpers", () => {
  test("required numeric fields reject blank and non-finite values but preserve zero", () => {
    expect(parseRequiredNumber("0")).toBe(0);
    expect(parseRequiredNumber(" 12.5 ")).toBe(12.5);
    expect(() => parseRequiredNumber("")).toThrow("blank fields");
    expect(() => parseRequiredNumber("   ")).toThrow("blank fields");
    expect(() => parseRequiredNumber("NaN")).toThrow("finite number");
    expect(() => parseRequiredNumber("Infinity")).toThrow("finite number");
  });

  test("JSON to YAML safely quotes strings and emits nested collections", () => {
    const yaml = jsonToYaml({
      "display name": "Asha: R",
      active: true,
      note: "line one\nline two",
      items: [1, "two", { nested: "value" }],
      emptyList: [],
      emptyObject: {},
    });
    expect(yaml).toBe([
      '"display name": "Asha: R"',
      '"active": true',
      '"note": "line one\\nline two"',
      '"items":',
      '  - 1',
      '  - "two"',
      '  -',
      '    "nested": "value"',
      '"emptyList": []',
      '"emptyObject": {}',
    ].join("\n"));
  });

  test("unbiased random integer helper rejects the incomplete modulo bucket", () => {
    const values = [0xffffffff, 5];
    expect(randomIntegerBelow(6, () => values.shift()!)).toBe(5);
    expect(randomIntegerBelow(0x100000000, () => 0xffffffff)).toBe(0xffffffff);
    expect(() => randomIntegerBelow(0, () => 0)).toThrow("between 1");
    expect(() => randomIntegerBelow(6, () => -1)).toThrow("unsigned 32-bit");
  });
});
