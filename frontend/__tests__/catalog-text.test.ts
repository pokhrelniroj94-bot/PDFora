import { jsonObjectsToCsv } from "../lib/catalog-text";

describe("spreadsheet-safe JSON to CSV", () => {
  test("exports object arrays with a stable union of columns and RFC-style quoting", () => {
    expect(jsonObjectsToCsv(JSON.stringify([
      { name: "Asha, Rai", note: 'said "hello"', age: 22 },
      { name: "Ravi\\nKumar", age: 25, active: true },
    ]))).toBe(
      '"name","note","age","active"\\r\\n"Asha, Rai","said ""hello""","22",""\\r\\n"Ravi\\nKumar","","25","true"',
    );
  });

  test("neutralizes spreadsheet formula injection in headers and values", () => {
    const csv = jsonObjectsToCsv(JSON.stringify([
      { "=1+1": "=HYPERLINK(\"https://evil.example\",\"click\")", plus: "+SUM(1,2)", minus: "-1+2", at: "@SUM(1,2)", tab: "\\t=cmd" },
    ]));
    expect(csv).toContain('"\'=1+1"');
    expect(csv).toContain('"\'=HYPERLINK(""https://evil.example"",""click"")"');
    expect(csv).toContain('"\'+SUM(1,2)"');
    expect(csv).toContain('"\'-1+2"');
    expect(csv).toContain('"\'@SUM(1,2)"');
    expect(csv).toContain('"\'\\t=cmd"');
  });

  test("serializes nested values and handles empty arrays", () => {
    expect(jsonObjectsToCsv('[{"meta":{"ok":true},"tags":["a","b"]}]')).toBe(
      '"meta","tags"\\r\\n"{""ok"":true}","[""a"",""b""]"',
    );
    expect(jsonObjectsToCsv("[]")).toBe("");
  });

  test("rejects malformed, non-object, and oversized inputs", () => {
    expect(() => jsonObjectsToCsv("{")).toThrow("valid JSON");
    expect(() => jsonObjectsToCsv('[1,2]')).toThrow("array of JSON objects");
    expect(() => jsonObjectsToCsv('{"name":"Asha"}')).toThrow("array of JSON objects");
    expect(() => jsonObjectsToCsv(" ".repeat(1_000_001))).toThrow("1 MB");
  });
});
