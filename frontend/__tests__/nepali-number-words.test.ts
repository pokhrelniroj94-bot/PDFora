import { nepaliNumberWords } from "../lib/nepali-number-words";

describe("Nepali number words", () => {
  test("converts the complete 0–99 range", () => {
    expect(nepaliNumberWords(0)).toBe("शून्य");
    expect(nepaliNumberWords(51)).toBe("एकाउन्न");
    expect(nepaliNumberWords(54)).toBe("चवन्न");
    expect(nepaliNumberWords(59)).toBe("उनसट्ठी");
    expect(nepaliNumberWords(64)).toBe("चौसट्ठी");
    expect(nepaliNumberWords(92)).toBe("बयान्नब्बे");
    expect(nepaliNumberWords(75)).toBe("पचहत्तर");
    expect(nepaliNumberWords(99)).toBe("उनान्सय");
  });

  test("uses Nepali lakh, thousand and hundred groupings", () => {
    expect(nepaliNumberWords(100)).toBe("एक सय");
    expect(nepaliNumberWords(105)).toBe("एक सय पाँच");
    expect(nepaliNumberWords(1_234)).toBe("एक हजार दुई सय चौँतीस");
    expect(nepaliNumberWords(100_000)).toBe("एक लाख");
    expect(nepaliNumberWords(1_234_567)).toBe("बाह्र लाख चौँतीस हजार पाँच सय सतसट्ठी");
    expect(nepaliNumberWords(10_000_000)).toBe("एक करोड");
    expect(nepaliNumberWords(99_999_999)).toBe("नौ करोड उनान्सय लाख उनान्सय हजार नौ सय उनान्सय");
  });

  test("rejects values outside the supported whole-number range", () => {
    expect(() => nepaliNumberWords(-1)).toThrow("0 to 99,99,99,999");
    expect(() => nepaliNumberWords(1.5)).toThrow("whole number");
    expect(() => nepaliNumberWords(1_000_000_000)).toThrow("0 to 99,99,99,999");
  });
});
