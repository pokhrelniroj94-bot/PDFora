import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { PDFDocument, StandardFonts } from "pdf-lib";

const baseUrl = process.env.E2E_BASE_URL || "http://127.0.0.1:3000";
const chromePath = process.env.CHROME_BIN || "google-chrome";
const reportPath = path.resolve("../docs/qa/BROWSER_E2E_173_REPORT.json");
const timeoutMs = Number(process.env.E2E_TOOL_TIMEOUT_MS || 45000);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pdfora-e2e-"));
const downloadsDir = path.join(tempDir, "downloads");
fs.mkdirSync(downloadsDir, { recursive: true });

const read = (relative) => fs.readFileSync(new URL(relative, import.meta.url), "utf8");
const directorySource = read("../lib/tool-directory.ts");
const catalogSource = read("../components/toolCatalog.ts");
const pdfBlock = directorySource.split("const rawPdfTools")[1]?.split("\n];")[0] ?? "";
const pdfRoutes = [...pdfBlock.matchAll(/href:\s*"([^"]+)"/g)]
  .map((match) => match[1])
  .filter((href) => href !== "/ocr-pdf");
const catalogTools = [...catalogSource.matchAll(/\{slug:"([^"]+)",name:"([^"]+)",category:"([^"]+)"/g)]
  .filter((match) => match[1] !== "pdf-tools")
  .map((match) => ({ slug: match[1], name: match[2], category: match[3] }));
const aiTools = new Set(["ai-resume-writer", "ai-cover-letter-generator", "ai-humanizer"]);
const tools = [
  ...pdfRoutes.map((href) => ({ kind: "pdf", slug: href.slice(1), url: href })),
  ...catalogTools.map((tool) => ({ kind: "catalog", ...tool, url: "/tools/" + tool.slug })),
];

if (pdfRoutes.length !== 49 || catalogTools.length !== 124 || tools.length !== 173) {
  throw new Error("Expected 49 PDF routes + 124 catalog tools = 173; got " +
    pdfRoutes.length + " + " + catalogTools.length + " = " + tools.length);
}

const pdf = await PDFDocument.create();
const page = pdf.addPage([595, 842]);
const font = await pdf.embedFont(StandardFonts.Helvetica);
page.drawText("PDFora browser E2E fixture - page one", { x: 48, y: 780, size: 14, font });
page.drawText("Text extraction and processing test.", { x: 48, y: 750, size: 11, font });
const fixturePath = path.join(tempDir, "pdfora-e2e-fixture.pdf");
fs.writeFileSync(fixturePath, await pdf.save());

const pngPath = path.join(tempDir, "pdfora-e2e-fixture.png");
// Valid 1x1 transparent PNG for the browser-only image tools.
fs.writeFileSync(pngPath, Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j9S8AAAAASUVORK5CYII=",
  "base64",
));

const chrome = spawn(chromePath, [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  "--disable-background-networking", "--disable-extensions", "--hide-scrollbars",
  "--remote-debugging-port=9222", "--remote-allow-origins=*",
  "--user-data-dir=" + path.join(tempDir, "chrome-profile"), "about:blank",
], { stdio: "ignore" });

let browserVersion;
for (let attempt = 0; attempt < 60; attempt += 1) {
  try {
    const response = await fetch("http://127.0.0.1:9222/json/version");
    if (response.ok) { browserVersion = await response.json(); break; }
  } catch {}
  if (chrome.exitCode !== null) throw new Error("Chrome exited before DevTools became ready.");
  await delay(500);
}
if (!browserVersion) throw new Error("Chrome DevTools did not start.");

let nextId = 0;
async function openPage(url) {
  const targetResponse = await fetch("http://127.0.0.1:9222/json/new?about:blank", { method: "PUT" });
  if (!targetResponse.ok) throw new Error("Could not create browser tab: " + targetResponse.status);
  const target = await targetResponse.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  const pending = new Map();
  const events = [];
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const entry = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) entry.reject(new Error(message.error.message));
      else entry.resolve(message.result ?? {});
    } else if (message.method) {
      events.push(message);
      if (events.length > 100) events.shift();
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
    setTimeout(() => {
      if (pending.has(id)) { pending.delete(id); reject(new Error("CDP timeout: " + method)); }
    }, 15000).unref?.();
  });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", {
      expression, returnByValue: true, awaitPromise: true, userGesture: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    }
    return result.result?.value;
  };
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  try { await send("Page.setDownloadBehavior", { behavior: "allow", downloadPath: downloadsDir }); } catch {}
  const nav = await send("Page.navigate", { url: baseUrl + url });
  if (nav.errorText) throw new Error(nav.errorText);
  const started = Date.now();
  let state = "";
  while (Date.now() - started < 20000) {
    const result = await evaluate("document.readyState");
    state = result.value ?? "";
    if (state === "complete") break;
    await delay(200);
  }
  // Allow React hydration and dynamically imported tool components to mount.
  await delay(700);
  return {
    send, events,
    evaluate,
    close: async () => { try { ws.close(); } catch {} try { await fetch("http://127.0.0.1:9222/json/close/" + target.id); } catch {} },
  };
}

const results = [];
let browserFailures = 0;
async function runTool(tool, index) {
  const row = { index: index + 1, kind: tool.kind, slug: tool.slug, status: "FAIL", checks: [], errors: [] };
  let page;
  try {
    page = await openPage(tool.url);
    const initial = await page.evaluate(`(() => ({
      title: document.title,
      heading: document.querySelector("h1")?.innerText?.trim() || "",
      body: document.body?.innerText?.slice(0, 12000) || "",
      inputs: document.querySelectorAll("input,textarea,select").length,
      fileInputs: document.querySelectorAll('input[type="file"]').length,
      buttons: [...document.querySelectorAll("button")].map((b) => b.innerText.trim()).filter(Boolean),
      alerts: [...document.querySelectorAll('[role="alert"]')].map((e) => e.innerText.trim()).filter(Boolean),
    }))()`);
    if (!initial || !initial.body || /Application error|Internal Server Error|404: This page could not be found/i.test(initial.body)) {
      throw new Error("Page did not render a usable tool workspace.");
    }
    row.heading = initial.heading;
    row.inputCount = initial.inputs;
    row.fileInputCount = initial.fileInputs;
    row.buttonCount = initial.buttons.length;
    row.checks.push("route rendered");
    if (/Tool configuration missing|Tool not implemented|not configured\./i.test(initial.body)) {
      throw new Error("Tool rendered a missing/unimplemented configuration message.");
    }

    if (tool.kind === "pdf") {
      const inputNode = await page.send("DOM.getDocument", { depth: 1 });
      const queries = await page.send("DOM.querySelectorAll", {
        nodeId: inputNode.root.nodeId, selector: 'input[type="file"]',
      });
      if (!queries.nodeIds?.length) throw new Error("PDF page has no file upload input.");
      for (const nodeId of queries.nodeIds) {
        await page.send("DOM.setFileInputFiles", { nodeId, files: [fixturePath] });
      }
      const attached = await page.evaluate("[...document.querySelectorAll('input[type=file]')].filter((input) => input.files?.length).length");
      if (attached !== queries.nodeIds.length) throw new Error("PDF fixture was not attached to every upload field.");
      row.checks.push("PDF file selected");
      const action = await page.evaluate(`(() => {
        const buttons = [...document.querySelectorAll("button")].filter((b) => !b.disabled);
        const preferred = buttons.find((b) => /merge|split|compress|convert|process|rotate|delete|extract|watermark|protect|unlock|sign|repair|count|information|compare|flatten|crop|reorder|bookmark|metadata|grayscale|background|page number|header|footer|remove|export|run/i.test(b.innerText));
        const button = preferred || buttons.find((b) => !/reset|clear|back|choose/i.test(b.innerText));
        if (button) { button.click(); return button.innerText.trim(); }
        return "";
      })()`);
      if (!action) throw new Error("PDF tool has no enabled processing action.");
      row.action = action;
      row.checks.push("processing action clicked");
      const start = Date.now();
      const downloadsBefore = fs.readdirSync(downloadsDir).length;
      let finalState = null;
      while (Date.now() - start < timeoutMs) {
        finalState = await page.evaluate(`(() => ({
          body: document.body?.innerText?.slice(-6000) || "",
          alerts: [...document.querySelectorAll('[role="alert"]')].map((e) => e.innerText.trim()).filter(Boolean),
          links: [...document.querySelectorAll('a[download]')].map((a) => a.download),
          busy: !!document.querySelector('button[disabled]'),
        }))()`);
        const downloadCount = fs.readdirSync(downloadsDir).filter((name) => !name.endsWith(".crdownload")).length;
        if (downloadCount > downloadsBefore || finalState.links.length || /download|completed|success|ready|processed|pages found|page count|metadata/i.test(finalState.body) || finalState.alerts.length) break;
        await delay(500);
      }
      if (finalState?.alerts.length) throw new Error(finalState.alerts.join(" | "));
      if (!finalState || (!finalState.links.length && !/download|completed|success|ready|processed|pages found|page count|metadata/i.test(finalState.body))) {
        throw new Error("No processing result or explicit completion/error state appeared after upload.");
      }
      row.checks.push("processing response appeared");
      row.output = finalState.body.slice(-700);
      row.downloadLinks = finalState.links;
      const downloadsAfter = fs.readdirSync(downloadsDir).filter((name) => !name.endsWith(".crdownload")).length;
      row.downloadCount = Math.max(0, downloadsAfter - downloadsBefore);
      row.outputVerified = finalState.links.length > 0 || row.downloadCount > 0 || /completed|success|ready|processed|pages found|page count|metadata/i.test(finalState.body);
    } else {
      if (!initial.heading) throw new Error("Catalog tool page is missing its main heading.");
      if (aiTools.has(tool.slug)) {
        row.checks.push("AI page route rendered; execution intentionally skipped");
        row.status = "PASS";
        return row;
      }
      if (tool.slug === "image-compressor" || tool.slug === "image-format-converter") {
        const inputNode = await page.send("DOM.getDocument", { depth: 1 });
        const query = await page.send("DOM.querySelector", { nodeId: inputNode.root.nodeId, selector: 'input[type="file"]' });
        if (!query.nodeId) throw new Error("Image tool has no file input.");
        await page.send("DOM.setFileInputFiles", { nodeId: query.nodeId, files: [pngPath] });
        const selected = await page.evaluate("document.querySelector('input[type=file]')?.files?.length || 0");
        if (!selected) throw new Error("Image fixture was not attached.");
        row.checks.push("image file selected");
      }
      const clicked = await page.evaluate(`(() => {
        const buttons = [...document.querySelectorAll("button")].filter((b) => !b.disabled);
        const patterns = /^(run tool|calculate.*|convert.*|generate.*|check.*|format json|minify|encode|decode|create pdf|create.*|compress image|convert image|get latest exchange rate|refresh.*|resize.*|process.*)$/i;
        const button = buttons.find((b) => patterns.test(b.innerText.trim()));
        if (button) { button.click(); return button.innerText.trim(); }
        return "";
      })()`);
      if (clicked) {
        row.action = clicked;
        row.checks.push("primary action clicked");
        await delay(tool.slug === "currency-converter" || tool.slug === "nepal-forex-rates" ? 5000 : 500);
      } else {
        row.checks.push("reactive output/controls inspected (no submit button by design)");
      }
      const finalState = await page.evaluate(`(() => ({
        body: document.body?.innerText?.slice(-8000) || "",
        alerts: [...document.querySelectorAll('[role="alert"]')].map((e) => e.innerText.trim()).filter(Boolean),
        live: [...document.querySelectorAll('[aria-live]')].map((e) => e.innerText.trim()).filter(Boolean),
        inputs: document.querySelectorAll("input,textarea,select").length,
      }))()`);
      if (/Tool configuration missing|Tool not implemented|This utility is not available yet|Nepal utility not found/i.test(finalState.body)) {
        throw new Error("Tool reported an unavailable handler/configuration.");
      }
      const expectedOutputs = {
        "bmi-calculator": "BMI: 22.5",
        "bmr-calculator": "Estimated BMR: 1568 kcal/day",
        "unit-converter": "1000",
        "fraction-calculator": "5/6",
        "csv-to-json": "Asha",
        "json-to-yaml": "name: Asha",
        "roman-numeral-converter": "MMXXVI",
        "business-days-calculator": "Weekdays (inclusive): 21",
        "text-to-binary": "01001000 01100101 01101100 01101100 01101111",
        "aspect-ratio-calculator": "16:9",
        "percentage-of-number-calculator": "37.5000",
        "line-counter": "Total lines: 4",
        "nepali-number-converter": "बाह्र लाख",
      };
      const expected = expectedOutputs[tool.slug];
      const liveText = finalState.live.join("\\n");
      if (expected && !liveText.includes(expected)) {
        throw new Error("Expected output was not found: " + expected + "; actual: " + liveText.slice(0, 300));
      }
      if (!finalState.inputs && !/calendar|market|news|resume|holiday|dashboard|typing/i.test(tool.slug)) {
        throw new Error("Tool rendered no interactive inputs.");
      }
      if (finalState.alerts.some((alert) => /error|failed|invalid|could not|unavailable/i.test(alert))) {
        throw new Error(finalState.alerts.join(" | "));
      }
      row.output = finalState.live.filter(Boolean).join(" | ").slice(0, 700) || finalState.body.slice(-700);
      row.outputVerified = finalState.live.some((value) => value.trim().length > 0);
      row.checks.push("workspace output inspected");
    }
    row.status = "PASS";
  } catch (error) {
    row.errors.push(error instanceof Error ? error.message : String(error));
    row.status = "FAIL";
    browserFailures += 1;
  } finally {
    if (page) await page.close();
  }
  return row;
}

try {
  for (let index = 0; index < tools.length; index += 1) {
    const result = await runTool(tools[index], index);
    results.push(result);
    console.log((result.status === "PASS" ? "PASS " : "FAIL ") +
      result.index + "/173 " + result.slug + " — " +
      (result.errors[0] || result.checks.join(", ")));
  }
} finally {
  chrome.kill("SIGTERM");
}

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  expected: { pdf: 49, catalog: 124, total: 173 },
  methodology: {
    browser: "Headless Chromium via Chrome DevTools Protocol; Node.js 22 native WebSocket",
    pdf: "Open each PDF route, attach a generated one-page PDF, click the processing action and inspect completion/output state.",
    catalog: "Open each catalog route, inspect the rendered workspace, execute its primary action when present and inspect output/error state.",
    ai: "AI tools are route-smoke-tested only; execution is intentionally skipped per project scope.",
    limitations: "This is a browser smoke/E2E pass, not visual pixel comparison, exhaustive input-boundary coverage or manual assistive-technology testing. PDF downloads are recorded when exposed as download links; browser download bytes are not yet independently parsed.",
  },
  counts: {
    total: results.length,
    pass: results.filter((row) => row.status === "PASS").length,
    fail: results.filter((row) => row.status === "FAIL").length,
    pdf: results.filter((row) => row.kind === "pdf").length,
    catalog: results.filter((row) => row.kind === "catalog").length,
    aiExecutionSkipped: results.filter((row) => aiTools.has(row.slug)).length,
  },
  results,
};
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
console.log("BROWSER E2E SUMMARY " + JSON.stringify(report.counts));
if (browserFailures) process.exitCode = 1;
