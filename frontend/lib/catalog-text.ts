const MAX_INPUT_LENGTH = 1_000_000;
const MAX_ROWS = 10_000;
const MAX_COLUMNS = 500;

function safeSpreadsheetCell(value: unknown): string {
  const raw = value == null
    ? ""
    : typeof value === "object"
      ? (JSON.stringify(value) ?? "")
      : String(value);
  // Prefix a literal apostrophe before spreadsheet formula/control prefixes.
  // This keeps untrusted JSON values as text when a CSV is opened in Excel/Sheets.
  const safe = /^[\s\u0000-\u001f]*[=+\-@]/.test(raw) ? "'" + raw : raw;
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
  ].join("\r\n");
}


export function csvToJson(input: string): string {
  if (input.length > MAX_INPUT_LENGTH) throw new Error("CSV input is too large (maximum 1 MB).");
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  let quoteClosed = false;

  const finishCell = () => { row.push(cell); cell = ""; quoteClosed = false; };
  const finishRow = () => {
    finishCell();
    if (row.some((value) => value.trim() !== "")) rows.push(row);
    row = [];
  };

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') { cell += '"'; i += 1; }
        else { inQuotes = false; quoteClosed = true; }
      } else {
        cell += char;
      }
      continue;
    }

    if (quoteClosed) {
      if (char === ",") finishCell();
      else if (char === "\\r" || char === "\\n") {
        if (char === "\\r" && input[i + 1] === "\\n") i += 1;
        finishRow();
      } else {
        throw new Error("Unexpected characters after a quoted CSV field.");
      }
      continue;
    }

    if (char === '"') {
      if (cell.length !== 0) throw new Error("A quote may only start at the beginning of a CSV field.");
      inQuotes = true;
    } else if (char === ",") {
      finishCell();
    } else if (char === "\\r" || char === "\\n") {
      if (char === "\\r" && input[i + 1] === "\\n") i += 1;
      finishRow();
    } else {
      cell += char;
    }
  }

  if (inQuotes) throw new Error("CSV contains an unclosed quoted field.");
  if (cell.length > 0 || row.length > 0 || quoteClosed) finishRow();
  if (rows.length < 2) throw new Error("Provide a header row and at least one data row.");

  const headers = rows[0].map((header) => header.trim());
  if (headers.some((header) => !header)) throw new Error("CSV headers cannot be empty.");
  if (new Set(headers).size !== headers.length) throw new Error("CSV headers must be unique.");
  const data = rows.slice(1).map((values, index) => {
    if (values.length !== headers.length) {
      throw new Error("CSV row " + (index + 2) + " has " + values.length + " columns; expected " + headers.length + ".");
    }
    return Object.fromEntries(headers.map((header, column) => [header, values[column]]));
  });
  return JSON.stringify(data, null, 2);
}
