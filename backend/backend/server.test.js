const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { after, before, test } = require("node:test");
const { PDFDocument } = require("pdf-lib");
const { app, parsePages } = require("./server");

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("parsePages bounds, normalizes, and deduplicates page numbers", () => {
  assert.deepEqual(parsePages("3, 1,3,0,-2,2.5,NaN"), [3, 1]);
  assert.throws(() => parsePages(Array.from({ length: 501 }, (_, index) => index + 1).join(",")), {
    status: 413,
    message: "Select no more than 500 page numbers.",
  });
});

test("page selection limit returns 413 and removes uploaded temporary files", async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage();
  const bytes = await pdf.save();
  const pages = Array.from({ length: 501 }, (_, index) => index + 1).join(",");
  const uploads = path.join(__dirname, "uploads");

  for (const endpoint of ["/api/delete-pages", "/api/extract-pages"]) {
    const form = new FormData();
    form.append("file", new Blob([bytes], { type: "application/pdf" }), "sample.pdf");
    form.append("pages", pages);
    const response = await fetch(`${baseUrl}${endpoint}`, { method: "POST", body: form });
    assert.equal(response.status, 413, `${endpoint} should preserve the parser's client error status`);
    assert.match((await response.json()).detail, /no more than 500 page numbers/);
    assert.deepEqual(fs.readdirSync(uploads), [], `${endpoint} should clean up its uploaded temporary file`);
  }
});

