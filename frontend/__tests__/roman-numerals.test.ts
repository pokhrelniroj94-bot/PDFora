import { convertRomanNumeral, fromRoman, toRoman } from "../lib/roman-numerals";

describe("Roman numeral converter", () => {
  test("converts the full supported range in both directions", () => {
    expect(toRoman(1)).toBe("I");
    expect(toRoman(4)).toBe("IV");
    expect(toRoman(944)).toBe("CMXLIV");
    expect(toRoman(3999)).toBe("MMMCMXCIX");
    expect(fromRoman("MCMXCIV")).toBe(1994);
    expect(fromRoman("mmxxvi")).toBe(2026);
  });

  test("rejects empty, non-canonical and out-of-range Roman numerals", () => {
    for (const value of ["", "IIII", "VV", "VX", "IC", "IIV", "MMMM", "ABC"]) {
      expect(() => fromRoman(value)).toThrow();
    }
  });

  test("UI conversion rejects empty and invalid decimal inputs", () => {
    expect(convertRomanNumeral("  XIV ")).toBe("14");
    expect(convertRomanNumeral("2026")).toBe("MMXXVI");
    expect(() => convertRomanNumeral("")).toThrow("Enter a number");
    expect(() => convertRomanNumeral("0")).toThrow("1 to 3999");
    expect(() => convertRomanNumeral("4000")).toThrow("1 to 3999");
    expect(() => convertRomanNumeral("1.5")).toThrow("valid Roman numeral");
  });
});
