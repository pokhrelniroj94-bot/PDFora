const MAX_INPUT_LENGTH = 1_000_000;
const MAX_ROWS = 10_000;
const MAX_COLUMNS = 500;

function safeSpreadsheetCell(value: unknown): string {
  const raw = value == null
    ? ""
    : typeof value === "object"
      ? JSON.stringify(value)
      : String(value);
  // Prefix a literal apostrophe before spreadsheet formula/control prefixes.
  // This keeps untrusted JSON values as text when a CSV is opened in Excel/Sheets.
  const safe = /^[\\s\\u0000-\\u001f]*[=+\\-@]/.test(raw) ? "'" + raw : raw;
  return '"' + safe.replace(/"/g, '""') + '"';
}

export function jsonObjectsToCsv(input: string): string {
  if (input.length > MAX_INPUT_LENGTH) {
    throw new Error("JSON input is too large (maximum 1 MB).");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    throw new Error("Enter valid JSON.");
  }

  if (!Array.isArray(parsed) || !parsed.every(
    (row) => row !== null && typeof row === "object" && !Array.isArray(row),
  )) {
    throw new Error("Input must be an array of JSON objects.");
  }
  if (parsed.length > MAX_ROWS) {
    throw new Error("CSV export is limited to 10,000 rows.");
  }

  const rows = parsed as Record<string, unknown>[];
  const keys = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  if (keys.length > MAX_COLUMNS) {
    throw new Error("CSV export is limited to 500 columns.");
  }
  if (keys.length === 0) return "";

  return [
    keys.map(safeSpreadsheetCell).join(","),
    ...rows.map((row) => keys.map((key) => safeSpreadsheetCell(row[key])).join(",")),
  ].join("\\r\\n");
}
