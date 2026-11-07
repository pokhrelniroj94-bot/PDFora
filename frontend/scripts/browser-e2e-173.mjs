import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, execFileSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { PDFDocument, PDFName, PDFString, StandardFonts } from "pdf-lib";

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
const aiTools = new Set(["ai-resume-writer", "ai-cover-letter-generator", "ai-humanizer", "market-ai"]);
const tools = [
  ...pdfRoutes.map((href) => ({ kind: "pdf", slug: href.slice(1), url: href })),
  ...catalogTools.map((tool) => ({ kind: "catalog", ...tool, url: "/tools/" + tool.slug })),
];

if (pdfRoutes.length !== 49 || catalogTools.length !== 124 || tools.length !== 173) {
  throw new Error("Expected 49 PDF routes + 124 catalog tools = 173; got " +
    pdfRoutes.length + " + " + catalogTools.length + " = " + tools.length);
}

const pngPath = path.join(tempDir, "pdfora-e2e-fixture.png");
const invalidImagePath = path.join(tempDir, "pdfora-invalid-image.png");
fs.writeFileSync(invalidImagePath, "PDFora E2E invalid image fixture");
const invalidPdfPath = path.join(tempDir, "pdfora-invalid-input.pdf");
fs.writeFileSync(invalidPdfPath, "This is intentionally not a valid PDF document.");
// Valid 1x1 PNG used by image and PDF-image conversion tests.
fs.writeFileSync(pngPath, Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGNgAAAAAgABSK+kcQAAAABJRU5ErkJggg==",
  "base64",
));
const converterPngPath = path.join(tempDir, "pdfora-converter-e2e-fixture.png");
fs.copyFileSync(pngPath, converterPngPath);

const pdf = await PDFDocument.create();
const page = pdf.addPage([595, 842]);
const font = await pdf.embedFont(StandardFonts.Helvetica);
page.drawText("PDFora browser E2E fixture - page one", { x: 48, y: 780, size: 14, font });
page.drawText("Text extraction and processing test.", { x: 48, y: 750, size: 11, font });
const embeddedImage = await pdf.embedPng(fs.readFileSync(pngPath));
page.drawImage(embeddedImage, { x: 48, y: 640, width: 80, height: 80 });
// Add a ruled table so PDF-to-Excel and PDF-to-CSV have extractable content.
const tableX = 48, tableY = 560, colWidth = 100, rowHeight = 24;
for (let row = 0; row <= 3; row += 1) {
  page.drawLine({ start: { x: tableX, y: tableY - row * rowHeight }, end: { x: tableX + 2 * colWidth, y: tableY - row * rowHeight }, thickness: 0.8 });
}
for (let col = 0; col <= 2; col += 1) {
  page.drawLine({ start: { x: tableX + col * colWidth, y: tableY }, end: { x: tableX + col * colWidth, y: tableY - 3 * rowHeight }, thickness: 0.8 });
}
[["Name", "Amount"], ["Asha", "100"], ["Ravi", "250"]].forEach((row, rowIndex) => {
  row.forEach((value, colIndex) => page.drawText(value, {
    x: tableX + colIndex * colWidth + 6,
    y: tableY - (rowIndex + 1) * rowHeight + 7,
    size: 10,
    font,
  }));
});
// A second blank page exercises page deletion, blank-page removal and multi-page operations.
pdf.addPage([595, 842]);
// Add one outline entry for bookmark extraction/splitting workflows.
const outlineRoot = pdf.context.obj({ Type: PDFName.of("Outlines"), Count: 1 });
const outlineRootRef = pdf.context.register(outlineRoot);
const outlineItem = pdf.context.obj({
  Title: PDFString.of("PDFora E2E Bookmark"),
  Parent: outlineRootRef,
  Dest: [page.ref, PDFName.of("Fit")],
});
const outlineItemRef = pdf.context.register(outlineItem);
outlineRoot.set(PDFName.of("First"), outlineItemRef);
outlineRoot.set(PDFName.of("Last"), outlineItemRef);
pdf.catalog.set(PDFName.of("Outlines"), outlineRootRef);
const fixturePath = path.join(tempDir, "pdfora-e2e-fixture.pdf");
fs.writeFileSync(fixturePath, await pdf.save());

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
    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error("Chrome DevTools WebSocket connection timed out."));
    }, 10000);
    ws.addEventListener("open", () => { clearTimeout(timeout); resolve(); }, { once: true });
    ws.addEventListener("error", (event) => {
      clearTimeout(timeout);
      reject(event.error || new Error("Chrome DevTools WebSocket connection failed."));
    }, { once: true });
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
    }, 30000).unref?.();
  });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", {
      expression, returnByValue: true, awaitPromise: true, userGesture: true,
    });
    if (result.exceptionDetails) {
      const detail = result.exceptionDetails;
      const stack = detail.exception?.details?.stackTrace?.callFrames
        ?.map((frame) => `${frame.url || "<anonymous>"}:${frame.lineNumber + 1}:${frame.columnNumber + 1}`)
        .join(" <- ");
      throw new Error([
        detail.exception?.description || detail.text,
        stack ? "stack: " + stack : "",
        detail.text ? "text: " + detail.text : "",
      ].filter(Boolean).join(" | "));
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
    state = result ?? "";
    if (state === "interactive" || state === "complete") break;
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

async function setFirstTextArea(page, value) {
  return page.evaluate(`(() => {
    const element = document.querySelector("textarea");
    if (!element) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    setter?.call(element, ${JSON.stringify(value)});
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  })()`);
}

async function setFieldByLabel(page, labelText, value) {
  return page.evaluate(`(() => {
    const expectedLabel = ${JSON.stringify(labelText)}.trim().toLowerCase();
    const label = [...document.querySelectorAll("label")].find((element) =>
      element.innerText.trim().toLowerCase().startsWith(expectedLabel));
    const field = label?.querySelector("input,textarea");
    if (!field) return false;
    const prototype = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
    setter?.call(field, ${JSON.stringify(value)});
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  })()`);
}


async function seedPdfFields(page, slug) {
  const expression = [
    "(() => {",
    "  const controls = [...document.querySelectorAll('input:not([type=\"file\"]), textarea')];",
    "  const updated = [];",
    "  for (const control of controls) {",
    "    if (control.value?.trim()) continue;",
    "    const label = [...(control.labels || [])].map((item) => item.innerText).join(' ');",
    "    const key = [label, control.getAttribute('aria-label'), control.placeholder, control.name, control.id].filter(Boolean).join(' ').toLowerCase();",
    "    let value = '1';",
    "    if (/password|passphrase|owner key|user key/.test(key)) value = 'PDFora-E2E-123!';",
    "    else if (/watermark|header|footer|text|signature|name|reason|title/.test(key)) value = 'PDFora E2E';",
    "    else if (/degree|rotation|angle/.test(key)) value = '90';",
    "    else if (/page|range|order|crop|margin|width|height|top|bottom|left|right/.test(key)) value = '1';",
    "    if (control instanceof HTMLTextAreaElement && !/page|range|order/.test(key)) value = 'PDFora E2E test';",
    "    const prototype = control instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;",
    "    const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;",
    "    setter?.call(control, value);",
    "    control.dispatchEvent(new Event('input', { bubbles: true }));",
    "    control.dispatchEvent(new Event('change', { bubbles: true }));",
    "    updated.push({ label: key, value });",
    "  }",
    "  return updated;",
    "})()",
  ].join("\n");
  return page.evaluate(expression);
}


async function validateDownloadedFile(filePath) {
  const bytes = fs.readFileSync(filePath);
  if (!bytes.length) throw new Error("Downloaded output is empty: " + path.basename(filePath));
  const extension = path.extname(filePath).toLowerCase();
  const hasPrefix = (...values) => values.every((value, index) => bytes[index] === value);
  if (extension === ".pdf") {
    const document = await PDFDocument.load(bytes, { ignoreEncryption: true });
    if (document.getPageCount() < 1) throw new Error("Downloaded PDF has no pages: " + path.basename(filePath));
  } else if ([".zip", ".docx", ".xlsx", ".pptx", ".odt", ".ods"].includes(extension)) {
    if (!hasPrefix(0x50, 0x4b)) throw new Error("Downloaded archive/Office file has no ZIP signature: " + path.basename(filePath));
    const archiveCheck = execFileSync("python3", ["-c", [
      "import json, os, sys, zipfile",
      "p = sys.argv[1]",
      "with zipfile.ZipFile(p) as z:",
      "  infos = z.infolist()",
      "  if not infos: raise SystemExit('Archive contains no entries')",
      "  bad = z.testzip()",
      "  if bad: raise SystemExit('CRC failure: ' + bad)",
      "  names = set(z.namelist())",
      "  ext = os.path.splitext(p)[1].lower()",
      "  required = {'.docx': 'word/document.xml', '.xlsx': 'xl/workbook.xml', '.pptx': 'ppt/presentation.xml', '.odt': 'mimetype', '.ods': 'mimetype'}.get(ext)",
      "  if required and required not in names: raise SystemExit('Missing required Office document part: ' + required)",
      "  print(json.dumps({'entries': len(infos), 'uncompressedBytes': sum(x.file_size for x in infos), 'crc': 'ok', 'requiredPart': required}))",
    ].join("\\n"), filePath], { encoding: "utf8", timeout: 15000 }).trim();
    return { file: path.basename(filePath), bytes: bytes.length, extension, valid: true, archiveCheck: JSON.parse(archiveCheck) };
  } else if (extension === ".png") {
    if (!hasPrefix(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) throw new Error("Downloaded PNG signature is invalid: " + path.basename(filePath));
  } else if ([".jpg", ".jpeg"].includes(extension)) {
    if (!hasPrefix(0xff, 0xd8, 0xff)) throw new Error("Downloaded JPEG signature is invalid: " + path.basename(filePath));
  } else if (extension === ".webp") {
    if (bytes.subarray(0, 4).toString() !== "RIFF" || bytes.subarray(8, 12).toString() !== "WEBP") throw new Error("Downloaded WebP signature is invalid: " + path.basename(filePath));
  } else if (extension === ".bmp") {
    if (bytes.subarray(0, 2).toString() !== "BM") throw new Error("Downloaded BMP signature is invalid: " + path.basename(filePath));
  } else if ([".tif", ".tiff"].includes(extension)) {
    const littleEndian = hasPrefix(0x49, 0x49, 0x2a, 0x00);
    const bigEndian = hasPrefix(0x4d, 0x4d, 0x00, 0x2a);
    if (!littleEndian && !bigEndian) throw new Error("Downloaded TIFF signature is invalid: " + path.basename(filePath));
  } else if ([".txt", ".csv", ".json", ".html", ".htm", ".md", ".xml", ".rtf"].includes(extension)) {
    if (!bytes.toString("utf8").trim()) throw new Error("Downloaded text output is empty: " + path.basename(filePath));
  }
  return { file: path.basename(filePath), bytes: bytes.length, extension, valid: true };
}

const results = [];
let browserFailures = 0;
let fatalBrowserError = false;
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

    // Exercise every tool at a narrow mobile viewport, then verify basic keyboard
    // reachability and accessible names before returning to the desktop viewport.
    await page.send("Emulation.setDeviceMetricsOverride", {
      width: 390, height: 844, deviceScaleFactor: 1, mobile: true,
    });
    await delay(120);
    const mobileState = await page.evaluate(`(() => {
      const root = document.documentElement;
      const main = document.querySelector("main");
      const visible = (element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
      };
      const unnamedButtons = [...document.querySelectorAll("button")].filter((element) =>
        visible(element) && !((element.innerText || "").trim() || element.getAttribute("aria-label") ||
          element.getAttribute("aria-labelledby") || element.getAttribute("title")));
      const unnamedLinks = [...document.querySelectorAll("a[href]")].filter((element) =>
        visible(element) && !((element.innerText || "").trim() || element.getAttribute("aria-label") ||
          element.getAttribute("aria-labelledby") || element.querySelector("img[alt]")));
      const unnamedFields = [...document.querySelectorAll("input:not([type=hidden]), textarea, select")].filter((element) =>
        visible(element) && !(element.labels?.length || element.getAttribute("aria-label") ||
          element.getAttribute("aria-labelledby") || element.getAttribute("title")));
      return {
        viewport: { width: innerWidth, height: innerHeight },
        documentWidth: root.scrollWidth,
        viewportWidth: root.clientWidth,
        mainWidth: main?.scrollWidth || 0,
        mainClientWidth: main?.clientWidth || 0,
        lang: root.getAttribute("lang") || "",
        mainCount: document.querySelectorAll("main").length,
        h1Count: document.querySelectorAll("h1").length,
        unnamedButtons: unnamedButtons.length,
        unnamedLinks: unnamedLinks.length,
        unnamedFields: unnamedFields.length,
      };
    })()`);
    row.mobileViewport = mobileState;
    if (mobileState.viewport.width > 400) {
      throw new Error("Mobile emulation did not apply a device-width viewport: " + JSON.stringify(mobileState.viewport));
    }
    if (mobileState.documentWidth > mobileState.viewportWidth + 2 ||
        mobileState.mainWidth > mobileState.mainClientWidth + 2) {
      throw new Error("Mobile horizontal overflow at 390px: " + JSON.stringify(mobileState));
    }
    row.checks.push("390px mobile viewport has no document/main horizontal overflow");

    const focusStart = await page.evaluate(`(() => {
      const visible = (element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
      };
      const candidate = [...document.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )].find(visible);
      if (!candidate) return null;
      candidate.focus();
      window.__pdforaFocusStart = candidate;
      return { tag: candidate.tagName, id: candidate.id, name: candidate.getAttribute("name"), text: (candidate.innerText || candidate.getAttribute("aria-label") || candidate.getAttribute("title") || "").trim().slice(0, 100) };
    })()`);
    if (!focusStart) throw new Error("No visible keyboard-focusable control exists.");
    await page.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
    await page.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
    const keyboardState = await page.evaluate(`(() => {
      const active = document.activeElement;
      return {
        tag: active?.tagName || "",
        text: (active?.innerText || active?.getAttribute("aria-label") || active?.getAttribute("title") || "").trim().slice(0, 100),
        isBody: active === document.body,
        advanced: active !== window.__pdforaFocusStart,
      };
    })()`);
    row.keyboardNavigation = { start: focusStart, afterTab: keyboardState };
    if (!keyboardState.tag || keyboardState.isBody || !keyboardState.advanced) {
      throw new Error("Tab key did not advance focus from the first visible interactive control.");
    }
    row.checks.push("keyboard Tab reaches a focusable element");

    row.accessibility = {
      langPresent: Boolean(mobileState.lang),
      mainLandmarkCount: mobileState.mainCount,
      h1Count: mobileState.h1Count,
      unnamedVisibleButtons: mobileState.unnamedButtons,
      unnamedVisibleLinks: mobileState.unnamedLinks,
      unnamedVisibleFields: mobileState.unnamedFields,
    };
    if (!mobileState.lang || mobileState.mainCount !== 1 || mobileState.h1Count !== 1) {
      throw new Error("Basic document semantics failed: " + JSON.stringify(row.accessibility));
    }
    if (mobileState.unnamedButtons || mobileState.unnamedLinks || mobileState.unnamedFields) {
      row.accessibility.status = "PARTIAL";
      row.accessibility.note = "Visible controls without accessible names/labels need manual review.";
    } else {
      row.accessibility.status = "PASS";
    }
    row.checks.push("document language, main landmark and one primary heading verified");

    await page.send("Emulation.setDeviceMetricsOverride", {
      width: 1280, height: 900, deviceScaleFactor: 1, mobile: false,
    });
    await delay(100);

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
        await page.send("DOM.setFileInputFiles", { nodeId, files: tool.slug === "images-to-pdf" ? [pngPath] : tool.slug === "merge-pdf" || tool.slug === "compare-pdf" ? [fixturePath, fixturePath] : [fixturePath] });
      }
      const fixtureName = tool.slug === "images-to-pdf" ? path.basename(pngPath) : path.basename(fixturePath);
      const expectedFileCount = tool.slug === "merge-pdf" || tool.slug === "compare-pdf" ? 2 : 1;
      const attached = await page.evaluate("document.body.innerText.split(" + JSON.stringify(fixtureName) + ").length - 1");
      if (attached < expectedFileCount) throw new Error("PDF fixture selection was not reflected in the upload workspace.");
      row.checks.push("PDF file selected");
      row.seededFields = await seedPdfFields(page, tool.slug);
      if (tool.slug === "reorder-pdf") {
        await page.evaluate("(() => { const field = [...document.querySelectorAll('input:not([type=file]), textarea')].find((item) => item.type !== 'number'); if (!field) return false; const prototype = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set; setter?.call(field, '1,2'); field.dispatchEvent(new Event('input', { bubbles: true })); field.dispatchEvent(new Event('change', { bubbles: true })); return true; })()");
      }
      const downloadsBefore = new Set(fs.readdirSync(downloadsDir).filter((name) => !name.endsWith(".crdownload")));
      const action = await page.evaluate(`(() => {
        const buttons = [...document.querySelectorAll("button")].filter((b) => !b.disabled);
        const preferred = buttons.find((b) => /merge|split|compress|convert|process|rotate|delete|extract|watermark|protect|unlock|sign|repair|count|information|compare|flatten|crop|reorder|bookmark|metadata|grayscale|background|page number|header|footer|remove|export|run/i.test(b.innerText));
        const primary = buttons.find((b) => typeof b.className === "string" && b.className.includes("bg-gradient-to-r") && b.className.includes("w-full"));
        const button = primary || preferred || buttons.find((b) => !/reset|clear|back|choose|remove file/i.test(b.innerText));
        if (button) { button.click(); return button.innerText.trim(); }
        return "";
      })()`);
      if (!action) throw new Error("PDF tool has no enabled processing action.");
      row.action = action;
      row.checks.push("processing action clicked");
      const start = Date.now();
      let finalState = null;
      while (Date.now() - start < timeoutMs) {
        finalState = await page.evaluate(`(() => ({
          body: document.body?.innerText?.slice(0, 16000) || "",
          alerts: [...document.querySelectorAll('[role="alert"]')].map((e) => e.innerText.trim()).filter(Boolean),
          statuses: [...document.querySelectorAll('[role="status"]')].map((e) => ({
            text: e.innerText.trim(),
            className: typeof e.className === "string" ? e.className : "",
          })).filter((e) => e.text),
          links: [...document.querySelectorAll('a[download]')].map((a) => a.download),
          busy: !!document.querySelector('button[disabled]'),
        }))()`);
        const downloadCount = fs.readdirSync(downloadsDir).filter((name) => !name.endsWith(".crdownload") && !downloadsBefore.has(name)).length;
        const statusText = finalState.statuses.map((status) => status.text).join(" | ");
        if (downloadCount > downloadsBefore.size || finalState.links.length || (statusText && !/processing|please wait/i.test(statusText)) || finalState.alerts.length) break;
        await delay(500);
      }
      if (finalState?.alerts.length) throw new Error(finalState.alerts.join(" | "));
      const newDownloadNames = fs.readdirSync(downloadsDir).filter((name) => !name.endsWith(".crdownload") && !downloadsBefore.has(name));
      const validatedDownloads = [];
      for (const name of newDownloadNames) validatedDownloads.push(await validateDownloadedFile(path.join(downloadsDir, name)));
      row.downloadCount = validatedDownloads.length;
      row.downloadedFiles = validatedDownloads;
      const statusText = finalState?.statuses?.map((status) => status.text).join(" | ") ?? "";
      const statusClass = finalState?.statuses?.map((status) => status.className).join(" ") ?? "";
      const invalidPdfNode = await page.send("DOM.getDocument", { depth: 1 });
      const invalidPdfInput = await page.send("DOM.querySelector", { nodeId: invalidPdfNode.root.nodeId, selector: 'input[type="file"]' });
      if (!invalidPdfInput.nodeId) throw new Error("PDF tool lost its file input before invalid-file testing.");
      await page.send("DOM.setFileInputFiles", { nodeId: invalidPdfInput.nodeId, files: [invalidPdfPath] });
      if (tool.slug !== "images-to-pdf") {
        const invalidPdfAction = await page.evaluate(`(() => { const button = [...document.querySelectorAll("button")].find((item) => item.innerText.trim() === ${JSON.stringify(action)} && !item.disabled); if (!button) return false; button.click(); return true; })()`);
        if (!invalidPdfAction) throw new Error("PDF tool did not expose its processing action for invalid-file testing.");
      }
      let invalidPdfStatus = null;
      const invalidPdfStarted = Date.now();
      while (Date.now() - invalidPdfStarted < 10000) {
        invalidPdfStatus = await page.evaluate(`(() => { const status = document.querySelector('[role="status"]'); return status ? { text: status.innerText.trim(), className: typeof status.className === "string" ? status.className : "" } : null; })()`);
        if (invalidPdfStatus && /text-red-700|border-red-200/.test(invalidPdfStatus.className)) break;
        await delay(250);
      }
      if (!invalidPdfStatus || !/text-red-700|border-red-200/.test(invalidPdfStatus.className)) throw new Error("Invalid PDF input was not rejected with a visible error status.");
      row.checks.push("invalid PDF input rejected with a visible error status");
      if (tool.slug === "extract-fonts" && /No extractable embedded fonts were found/i.test(statusText)) {
        row.checks.push("expected negative path: fixture uses standard non-embedded fonts; tool reports that no embedded fonts can be extracted");
        row.output = statusText;
        row.evidenceLevel = "negative-path-response-observed-fixture-limitation";
        row.outputVerified = true;
        row.status = "PASS";
        row.evidenceLevel = "expected-negative-path-verified";
        return row;
      }
      if (/red-\d{2,3}|text-red/i.test(statusClass) || /error|failed|invalid|could not|unavailable/i.test(statusText)) {
        throw new Error(statusText || "PDF tool reported a processing error.");
      }
      if (!finalState || (!finalState.links.length && row.downloadCount === 0 && !statusText)) {
        throw new Error("No processing status or downloaded output appeared after upload.");
      }
      row.checks.push("processing response appeared");
      row.output = statusText || finalState.body.slice(-700);
      row.downloadLinks = finalState.links;
      row.outputVerified = validatedDownloads.length > 0;
      row.evidenceLevel = validatedDownloads.length > 0 ? "downloaded-file-bytes-and-signature-validated" : "processing-response-only";
      row.status = validatedDownloads.length > 0 ? "PASS" : "PARTIAL";
    } else {
      if (!initial.heading) throw new Error("Catalog tool page is missing its main heading.");
      if (aiTools.has(tool.slug)) {
        if (tool.slug === "market-ai") {
          row.checks.push("Market AI page route rendered; live model execution requires the protected Preview deployment");
          row.status = "PARTIAL";
          row.evidenceLevel = "route-smoke-only-live-provider-not-called";
          return row;
        }
        const setup = await page.evaluate(`(() => {
          const humanizer = location.pathname.endsWith("/ai-humanizer");
          const field = humanizer
            ? document.querySelector("main textarea")
            : document.querySelector('main input[placeholder="e.g. Finance Assistant"]');
          const consent = document.querySelector('main input[type="checkbox"]');
          if (!field || !consent) return { ready: false };
          const prototype = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
          const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
          setter?.call(field, humanizer ? "The report is due on 15 November 2026." : "Finance Assistant");
          field.dispatchEvent(new Event("input", { bubbles: true }));
          field.dispatchEvent(new Event("change", { bubbles: true }));
          consent.click();
          window.__pdforaAiSmoke = null;
          const nativeFetch = window.fetch.bind(window);
          window.fetch = async (input, init) => {
            if (String(input).includes("/api/ai-writing")) {
              window.__pdforaAiSmoke = { url: String(input), body: JSON.parse(String(init?.body || "{}")) };
              return new Response(JSON.stringify({ text: "Synthetic AI response for UI verification." }), {
                status: 200, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
              });
            }
            return nativeFetch(input, init);
          };
          return { ready: true };
        })()`);
        if (!setup.ready) throw new Error("AI form is missing its required input or privacy consent control.");
        const buttonText = tool.slug === "ai-humanizer" ? "Humanize text"
          : tool.slug === "ai-cover-letter-generator" ? "Generate cover letter" : "Generate resume content";
        const clicked = await page.evaluate(`(() => {
          const button = [...document.querySelectorAll("main button")].find((item) => item.innerText.trim() === ${JSON.stringify(buttonText)});
          if (!button || button.disabled) return false;
          button.click();
          return true;
        })()`);
        if (!clicked) throw new Error("AI generate button did not enable after valid input and privacy consent.");
        let aiState = null;
        for (let attempt = 0; attempt < 20; attempt += 1) {
          await delay(100);
          aiState = await page.evaluate(`(() => ({
            request: window.__pdforaAiSmoke || null,
            output: document.querySelector('main textarea[aria-label="Generated result"]')?.value || "",
            busy: [...document.querySelectorAll("main button")].some((button) => button.disabled && /generating/i.test(button.innerText))
          }))()`);
          if (aiState.output) break;
        }
        if (!aiState?.request || aiState.request.body?.kind !== tool.slug) {
          throw new Error("AI form did not send the expected task to /api/ai-writing.");
        }
        if (!aiState.output.includes("Synthetic AI response")) {
          throw new Error("AI UI did not render the successful API response.");
        }
        row.checks.push("privacy consent enabled generation; correct task payload sent; generated response displayed (provider mocked)");
        row.output = aiState.output;
        row.outputVerified = true;
        row.status = "PASS";
        row.evidenceLevel = "ai-ui-flow-verified-with-mocked-api";
        return row;
      }
      if (tool.slug === "nepal-electricity-bill-calculator") {
        const links = await page.evaluate('[...document.querySelectorAll("a[href]")].map((a) => a.href)');
        if (!links.some((href) => href.includes("erc.gov.np/electricity-calculator"))) throw new Error("Official ERC calculator handoff link is missing.");
        row.checks.push("official ERC calculator handoff link present");
        row.outputVerified = true;
        row.status = "PASS";
        return row;
      }
      if (tool.slug === "nepal-public-holidays-2083") {
        const state = await page.evaluate('(() => ({ rows: document.querySelectorAll("tbody tr").length, links: [...document.querySelectorAll("a[href]")].map((a) => a.href), body: document.body?.innerText || "", search: !!document.querySelector("input") }))()');
        if (state.rows < 30) throw new Error("2083 public-holiday table is missing expected entries.");
        if (!state.links.some((href) => href.includes("moha.gov.np/en/page/government-and-public-holidays-in-2083"))) throw new Error("Official MoHA public-holiday source link is missing.");
        if (!/Last Updated:\s*2083-07-20 15:42:42/.test(state.body)) throw new Error("Holiday page must disclose the exact MoHA source page update timestamp.");
        if (!state.search) throw new Error("Holiday list is missing its search input.");
        await page.evaluate(`(() => {
          const input = document.querySelector("input");
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
          setter.call(input, "Tihar");
          input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: "Tihar" }));
        })()`);
        await delay(150);
        const searched = await page.evaluate('({ rows: document.querySelectorAll("tbody tr").length, body: document.querySelector("tbody")?.innerText || "" })');
        if (!searched.rows || !/Tihar/i.test(searched.body)) throw new Error("Holiday search did not filter to the requested Tihar entry.");
        await page.evaluate(`(() => { const input = document.querySelector("input"); const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set; setter.call(input, ""); input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "deleteContentBackward" })); })()`);
        await delay(150);
        const community = await page.evaluate(`(() => {
          const button = [...document.querySelectorAll("button")].find((item) => item.innerText.trim() === "Community");
          if (!button) return false;
          button.click();
          return true;
        })()`);
        if (!community) throw new Error("Holiday category filter button is missing.");
        await delay(150);
        const filtered = await page.evaluate('({ rows: document.querySelectorAll("tbody tr").length, body: document.querySelector("tbody")?.innerText || "" })');
        if (!filtered.rows || !/Haritalika Teej|Jitiya Parwa|Muhammad Jayanti|Guru Nanak Jayanti|Siruwa Pawani/.test(filtered.body)) throw new Error("Community holiday filter did not show community observances.");
        row.checks.push("2083 holiday table, search, community filter and official MoHA source verified");
        row.outputVerified = true;
        row.status = "PASS";
        return row;
      }
      if (tool.slug === "word-character-counter" || tool.slug === "case-converter") {
        await setFirstTextArea(page, "PDFora tools make everyday tasks faster.");
      } else if (tool.slug === "base64-encoder-decoder") {
        await setFirstTextArea(page, "PDFora E2E test");
      } else if (tool.slug === "url-encoder-decoder") {
        await setFirstTextArea(page, "https://example.com/a path?q=hello world");
      } else if (tool.slug === "notes-to-pdf") {
        await setFirstTextArea(page, "PDFora E2E Notes\\nThis is a browser-generated test document.");
      } else if (tool.slug === "jwt-decoder") {
        await setFieldByLabel(page, "JWT token", "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJlMmUiLCJyb2xlIjoidGVzdGVyIn0.");
      } else if (tool.slug === "nepali-unicode-typing") {
        await setFirstTextArea(page, "Namaste Nepal");
      } else if (tool.slug === "preeti-unicode-converter") {
        await setFirstTextArea(page, "g]kfn ;/sf/sf");
      } else if (tool.slug === "nepali-date-converter") {
        await setFieldByLabel(page, "English date", "2026-11-07");
      } else if (tool.slug === "nepal-phone-validator") {
        await setFieldByLabel(page, "Phone number", "9800000000");
      } else if (tool.slug === "nepal-land-area-converter") {
        await setFieldByLabel(page, "Ropani", "1");
        await setFieldByLabel(page, "Aana", "0");
        await setFieldByLabel(page, "Paisa", "0");
        await setFieldByLabel(page, "Daam", "0");
        await setFieldByLabel(page, "Bigha", "0");
        await setFieldByLabel(page, "Kattha", "0");
        await setFieldByLabel(page, "Dhur", "0");
        await setFieldByLabel(page, "Area (square feet)", "0");
      }
      if (tool.slug === "word-character-counter" || tool.slug === "case-converter") {
        await setFirstTextArea(page, "PDFora tools make everyday tasks faster.");
      } else if (tool.slug === "base64-encoder-decoder") {
        await setFirstTextArea(page, "PDFora E2E test");
      } else if (tool.slug === "url-encoder-decoder") {
        await setFirstTextArea(page, "https://example.com/a path?q=hello world");
      } else if (tool.slug === "notes-to-pdf") {
        await setFirstTextArea(page, "PDFora E2E Notes\\nThis is a browser-generated test document.");
      } else if (tool.slug === "jwt-decoder") {
        await setFirstTextArea(page, "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJlMmUiLCJyb2xlIjoidGVzdGVyIn0.");
      } else if (tool.slug === "nepali-unicode-typing") {
        await setFirstTextArea(page, "Namaste Nepal");
      } else if (tool.slug === "nepali-date-converter") {
        await setFieldByLabel(page, "English date", "2026-11-07");
      } else if (tool.slug === "nepal-phone-validator") {
        await setFieldByLabel(page, "Phone number", "9800000000");
      } else if (tool.slug === "nepal-land-area-converter") {
        await setFieldByLabel(page, "Ropani", "1");
      } else if (tool.slug === "nepali-calendar") {
        await setFieldByLabel(page, "BS year", "2083");
        await page.evaluate("(() => { const select = [...document.querySelectorAll('select')].find((item) => [...item.options].some((option) => option.value === '1')); if (!select) return false; select.value = '1'; select.dispatchEvent(new Event('change', { bubbles: true })); return true; })()");
      } else if (tool.slug === "resume-builder") {
        const seeded = await Promise.all([
          setFieldByLabel(page, "Full name", "PDFora E2E Candidate"),
          setFieldByLabel(page, "Professional title", "Quality Assurance Analyst"),
          setFieldByLabel(page, "About you", "Experienced tester focused on reliable web applications."),
          setFieldByLabel(page, "Skills (comma separated)", "Testing, JavaScript, Accessibility"),
        ]);
        if (seeded.some((value) => !value)) throw new Error("Resume builder test could not locate one or more labelled fields.");
      } else if (tool.slug === "notes-to-pdf") {
        await setFieldByLabel(page, "Document title", "PDFora E2E Notes");
      }
      if (tool.slug === "case-converter") {
        const buttonClicked = await page.evaluate("(() => { const button = [...document.querySelectorAll('button')].find((item) => item.innerText.trim().toUpperCase() === 'UPPERCASE' && !item.disabled); button?.click(); return !!button; })()");
        if (!buttonClicked) throw new Error("Case converter uppercase action is missing.");
      }
      if (tool.slug === "notes-to-pdf") {
        await page.evaluate(`(() => {
          window.__pdforaPrintCapture = { html: "", printed: false, focused: false };
          window.open = () => {
            const popup = {
              document: {
                open() {},
                write(value) { window.__pdforaPrintCapture.html += value; },
                close() { popup.focus(); popup.print(); },
              },
              focus() { window.__pdforaPrintCapture.focused = true; },
              print() { window.__pdforaPrintCapture.printed = true; },
            };
            return popup;
          };
        })()`);
      }
      if (tool.slug === "image-compressor" || tool.slug === "image-format-converter" || tool.slug === "loksewa-photo-resizer") {
        const inputNode = await page.send("DOM.getDocument", { depth: 1 });
        const query = await page.send("DOM.querySelector", { nodeId: inputNode.root.nodeId, selector: 'input[type="file"]' });
        if (!query.nodeId) throw new Error("Image tool has no file input.");
        const imageFixture = tool.slug === "image-format-converter" ? converterPngPath : pngPath;
        await page.send("DOM.setFileInputFiles", { nodeId: query.nodeId, files: [imageFixture] });
        const selected = await page.evaluate("document.querySelector('input[type=file]')?.files?.length || 0");
        if (!selected) throw new Error("Image fixture was not attached.");
        row.checks.push("image file selected");
      }
      if (tool.slug === "nepal-forex-rates") await delay(20000);
      else if (["currency-converter", "nepse-market-news", "preeti-unicode-converter", "nepali-unicode-typing"].includes(tool.slug)) await delay(5000);
      const catalogDownloadsBefore = new Set(fs.readdirSync(downloadsDir).filter((name) => !name.endsWith(".crdownload")));
      const clicked = tool.slug === "nepal-forex-rates" ? "" : await page.evaluate(`(() => {
        const buttons = [...document.querySelectorAll("button")].filter((b) => !b.disabled);
        const patterns = /^(run tool|calculate.*|convert.*|generate.*|check.*|format json|minify|encode|decode|create pdf|create.*|compress image|convert image|get latest exchange rate|refresh.*|resize.*|process.*|show calendar)$/i;
        const button = buttons.find((b) => patterns.test(b.innerText.trim()));
        if (button) { button.click(); return button.innerText.trim(); }
        return "";
      })()`);
      if (tool.slug === "nepal-forex-rates") {
        row.checks.push("initial official-rate fetch inspected without triggering a redundant refresh");
      } else if (clicked) {
        row.action = clicked;
        row.checks.push("primary action clicked");
        await delay(["currency-converter", "nepse-market-news", "preeti-unicode-converter", "nepali-unicode-typing"].includes(tool.slug) ? 1500 : 800);
      } else {
        row.checks.push("reactive output/controls inspected (no submit button by design)");
      }
      if (["image-compressor", "image-format-converter", "loksewa-photo-resizer"].includes(tool.slug)) {
        const downloadStarted = Date.now();
        let downloadedNames = [];
        while (Date.now() - downloadStarted < 5000) {
          downloadedNames = fs.readdirSync(downloadsDir).filter((name) => !name.endsWith(".crdownload") && !catalogDownloadsBefore.has(name));
          if (downloadedNames.length > 0) break;
          await delay(250);
        }
        if (downloadedNames.length !== 1) throw new Error("Expected exactly one processed image download; received " + downloadedNames.length + ".");
        row.downloadedFiles = [await validateDownloadedFile(path.join(downloadsDir, downloadedNames[0]))];
        row.downloadCount = row.downloadedFiles.length;
        row.checks.push("downloaded image bytes and file signature validated");

      }
      const finalState = await page.evaluate(`(() => {
        const scope = document.querySelector("main") || document.body;
        return {
          body: scope.innerText?.slice(0, 16000) || "",
          alerts: [...scope.querySelectorAll('[role="alert"]')].map((e) => e.innerText.trim()).filter(Boolean),
          live: [...scope.querySelectorAll('[aria-live]')].map((e) => e.innerText.trim()).filter(Boolean),
          tables: [...scope.querySelectorAll('table')].map((table) => table.innerText).join('\\n'),
          inputs: scope.querySelectorAll("input,textarea,select").length,
          inputValues: [...scope.querySelectorAll("input,textarea,select")].map((input) => ({ value: input.value || "", type: input.type || input.tagName.toLowerCase() })),
          storyLinks: scope.querySelectorAll("section ul li a").length,
        };
      })()`);
      if (["image-compressor", "image-format-converter", "loksewa-photo-resizer"].includes(tool.slug)) {
        const invalidInputNode = await page.send("DOM.getDocument", { depth: 1 });
        const invalidInput = await page.send("DOM.querySelector", { nodeId: invalidInputNode.root.nodeId, selector: 'input[type="file"]' });
        if (!invalidInput.nodeId) throw new Error("Image tool lost its file input before invalid-file testing.");
        await page.send("DOM.setFileInputFiles", { nodeId: invalidInput.nodeId, files: [invalidImagePath] });
        const errorAction = await page.evaluate(`(() => { const button = [...document.querySelectorAll("main button")].find((item) => /compress image|convert image|resize and download/i.test(item.innerText) && !item.disabled); if (!button) return false; button.click(); return true; })()`);
        if (!errorAction) throw new Error("Image tool did not expose its processing action for invalid-file testing.");
        let invalidError = "";
        const invalidStarted = Date.now();
        while (Date.now() - invalidStarted < 5000) {
          invalidError = await page.evaluate("document.querySelector('main')?.innerText || ''");
          if (/Could not read this image format|Image could not be opened/i.test(invalidError)) break;
          await delay(200);
        }
        if (!/Could not read this image format|Image could not be opened/i.test(invalidError)) throw new Error("Invalid image input was not rejected with a visible error message.");
        row.checks.push("invalid image file rejected with a visible error message");
      }
      if (tool.slug === "lorem-ipsum-generator") {
        const clickedDownload = await page.evaluate(`(() => { const button = [...document.querySelectorAll("main button")].find((item) => /download text/i.test(item.innerText)); if (!button) return false; button.click(); return true; })()`);
        if (!clickedDownload) throw new Error("Lorem Ipsum generator did not expose its text download action.");
        const downloadStarted = Date.now();
        let names = [];
        while (Date.now() - downloadStarted < 5000) {
          names = fs.readdirSync(downloadsDir).filter((name) => !name.endsWith(".crdownload") && !catalogDownloadsBefore.has(name));
          if (names.length > 0) break;
          await delay(200);
        }
        if (names.length !== 1) throw new Error("Lorem Ipsum text download did not produce exactly one file.");
        const textFile = fs.readFileSync(path.join(downloadsDir, names[0]), "utf8");
        if (!textFile.includes("lorem ipsum") || textFile.trim().length < 50) throw new Error("Lorem Ipsum text download content is empty or incorrect.");
        row.downloadedFiles = [{ file: names[0], bytes: Buffer.byteLength(textFile), contentVerified: true }];
        row.downloadCount = 1;
        row.checks.push("downloaded text file content and non-empty bytes verified");
      }
      if (tool.slug === "resume-builder") {
        const clickedPrint = await page.evaluate(`(() => { window.__pdforaResumePrintCalled = false; window.print = () => { window.__pdforaResumePrintCalled = true; }; const button = [...document.querySelectorAll("main button")].find((item) => /download CV as PDF/i.test(item.innerText)); if (!button) return false; button.click(); return true; })()`);
        if (!clickedPrint || !(await page.evaluate("window.__pdforaResumePrintCalled === true"))) throw new Error("Resume Builder PDF export button did not invoke the browser print flow.");
        const printed = await page.send("Page.printToPDF", { printBackground: true, preferCSSPageSize: true });
        const pdfBytes = Buffer.from(printed.data, "base64");
        const parsedPdf = await PDFDocument.load(pdfBytes);
        if (parsedPdf.getPageCount() < 1 || pdfBytes.length < 500) throw new Error("Resume Builder print flow did not generate a valid non-empty PDF.");
        row.printedPdf = { pages: parsedPdf.getPageCount(), bytes: pdfBytes.length };
        row.checks.push("resume PDF export button, browser print flow and generated PDF bytes verified");
      }

      if (tool.slug === "nepal-forex-rates") {
        let forexState = null;
        const forexStarted = Date.now();
        while (Date.now() - forexStarted < 35000) {
          forexState = await page.evaluate(`(() => {
            const scope = document.querySelector("main") || document.body;
            const rows = [...scope.querySelectorAll("table tbody tr")].map((row) => row.innerText.trim());
            const alert = scope.querySelector('[role="alert"]')?.innerText?.trim() || "";
            const conversion = scope.querySelector(".pdfora-pop-in")?.innerText?.trim() || "";
            return {
              rows: rows.length,
              hasUsd: rows.some((row) => /\\bUSD/.test(row)),
              hasNpr: /\\bNPR\\b/.test(conversion) && /\\b100\\s+USD\\b/.test(conversion),
              conversion,
              alert,
              body: scope.innerText?.slice(0, 1200) || "",
            };
          })()`);
          if ((forexState.hasUsd && forexState.hasNpr) || forexState.alert) break;
          await delay(500);
        }
        if (forexState?.hasUsd && forexState.hasNpr && /Nepal Rastra Bank/i.test(forexState.body)) {
          row.output = forexState.conversion.slice(0, 700);
          row.checks.push("official USD row and live NPR conversion rendered; stale-rate notice remains visible when applicable");
          row.outputVerified = true;
          row.status = "PASS";
          row.evidenceLevel = "official-usd-row-and-npr-conversion-verified";
          return row;
        }
        if (forexState?.alert) throw new Error("NRB forex source returned an error: " + forexState.alert);
        throw new Error(`NRB forex data did not render a verifiable USD/NPR conversion within 35 seconds (rows=${forexState?.rows ?? 0}, conversion=${forexState?.conversion ?? ""}, body=${forexState?.body ?? ""}).`);
      }
      if (tool.slug === "word-character-counter") {
        const textState = await page.evaluate("({ value: document.querySelector('main textarea')?.value || '', content: (document.querySelector('main')?.innerText || '').replace(/\\s+/g, ' ') })");
        if (textState.value !== "PDFora tools make everyday tasks faster." || !/Words\s+6\b/.test(textState.content) || !/Characters\s+40\b/.test(textState.content) || !/Sentences\s+1\b/.test(textState.content) || !/Paragraphs\s+1\b/.test(textState.content)) {
          throw new Error("Word & character counter did not show the expected 6 words, 40 characters, 1 sentence and 1 paragraph.");
        }
        row.checks.push("live word, character, sentence and paragraph counts verified");
        row.outputVerified = true;
        row.status = "PASS";
        row.evidenceLevel = "exact-live-counter-values-verified";
        return row;
      }
      if (tool.slug === "case-converter") {
        const converted = await page.evaluate("document.querySelector('main textarea')?.value || ''");
        if (converted !== "PDFORA TOOLS MAKE EVERYDAY TASKS FASTER.") {
          throw new Error(`Case converter uppercase output mismatch; actual: ${converted}`);
        }
        row.checks.push("uppercase conversion verified against exact textarea value");
        row.outputVerified = true;
        row.status = "PASS";
        row.evidenceLevel = "exact-transformed-input-value-verified";
        return row;
      }
      if (tool.slug === "notes-to-pdf") {
        const capture = await page.evaluate("window.__pdforaPrintCapture");
        if (!capture?.html.includes("PDFora E2E Notes") || !capture.html.includes("PDFora E2E Notes") || !capture.html.includes("window.print") || !capture.html.includes("@page{size:A4") || !capture.printed || !capture.focused) {
          throw new Error("Notes-to-PDF did not build the expected A4 print document and invoke the print flow.");
        }
        if (!finalState.body.includes("Print dialog opened")) throw new Error("Notes-to-PDF did not confirm its Save as PDF instructions.");
        row.checks.push("A4 print document generated, title/content escaped into HTML, print flow invoked");
        row.outputVerified = true;
        row.status = "PASS";
        row.evidenceLevel = "print-document-and-window-print-call-verified";
        return row;
      }
      if (tool.slug === "resume-builder") {
        await delay(300);
        const preview = await page.evaluate("document.querySelector('#resume-paper')?.innerText || ''");
        const templates = await page.evaluate("document.querySelectorAll('button[aria-label]').length");
        if (!preview.includes("PDFora E2E Candidate") || !preview.includes("Quality Assurance Analyst") || !preview.includes("Experienced tester focused on reliable web applications.") || !preview.includes("Testing") || templates < 20) {
          throw new Error(`Resume builder preview/template assertion failed (templates=${templates}, preview=${preview.slice(0, 500)}).`);
        }
        row.checks.push("live CV preview reflects personal details, summary and skills; 20 templates rendered");
        row.outputVerified = true;
        row.status = "PASS";
        row.evidenceLevel = "live-preview-and-template-count-verified";
        return row;
      }
      if (tool.slug === "nepse-market-news") {
        const tabClicked = await page.evaluate("(() => { const tab = [...document.querySelectorAll('main button[role=tab]')].find((button) => /Nepal market/i.test(button.innerText)); tab?.click(); return !!tab; })()");
        if (!tabClicked) throw new Error("NEPSE news page is missing its Nepal market tab.");
        await delay(400);
        const newsState = await page.evaluate("({ links: [...document.querySelectorAll('main section ul li a')].map(a => a.href), body: document.querySelector('main')?.innerText || '' })");
        const validLinks = newsState.links.filter((href) => /^https:\/\//i.test(href));
        if (validLinks.length > 0 && /NEPSE official/.test(newsState.body) && /SEBON official/.test(newsState.body)) {
          row.checks.push("Nepal market tab shows live HTTPS publisher headlines and official NEPSE/SEBON source links");
          row.outputVerified = true;
          row.status = "PASS";
          row.evidenceLevel = "nepal-market-headline-links-and-official-sources-verified";
        } else {
          row.checks.push("Nepal market tab and official source links rendered; no live Nepal-market headlines were returned");
          row.evidenceLevel = "nepal-market-empty-feed-and-official-sources";
        }
        return row;
      }
      if (tool.slug === "nepali-calendar") {
        const calendar = await page.evaluate("({ rows: document.querySelectorAll('main tbody tr').length, body: document.querySelector('main tbody')?.innerText || '' })");
        if (calendar.rows < 25 || !/2026-04-/.test(calendar.body)) throw new Error("Nepali calendar did not produce a populated 2083 BS month with AD dates.");
        row.checks.push("2083 BS calendar generated with day, AD date and weekday rows");
        row.outputVerified = true;
        row.status = "PASS";
        row.evidenceLevel = "calendar-table-content-verified";
        return row;
      }
      if (tool.slug === "nepali-unicode-typing") {
        const output = await page.evaluate("document.querySelectorAll('main textarea')[1]?.value || ''");
        if (!/[\u0900-\u097F]/.test(output)) throw new Error("Nepali typing did not convert romanized input into Devanagari output.");
        row.checks.push("Romanized input converted to Devanagari output textarea");
        row.outputVerified = true;
        row.status = "PASS";
        row.evidenceLevel = "unicode-output-value-verified";
        return row;
      }
      if (tool.slug === "preeti-unicode-converter") {
        const preetiStarted = Date.now();
        let preetiClicked = false;
        while (Date.now() - preetiStarted < 12000 && !preetiClicked) {
          preetiClicked = await page.evaluate('(() => { const button = document.querySelector("main button:not([disabled])"); if (!button) return false; button.click(); return true; })()');
          if (!preetiClicked) await delay(250);
        }
        if (!preetiClicked) throw new Error("Preeti converter did not become ready or expose its forward conversion action.");
        await delay(250);
        const output = await page.evaluate("document.querySelector('main [aria-live]')?.innerText || ''");
        if (!output.includes("नेपाल सरकारका")) throw new Error("Preeti converter did not correctly convert the known sample to नेपाल सरकारका.");
        const switched = await page.evaluate("(() => { const select = document.querySelector('main select'); if (!select) return false; select.value = 'to-preeti'; select.dispatchEvent(new Event('change', { bubbles: true })); return true; })()");
        if (!switched) throw new Error("Preeti converter is missing its reverse-conversion selector.");
        await setFirstTextArea(page, output);
        const reverseClicked = await page.evaluate("(() => { const button = [...document.querySelectorAll('main button')].find((item) => item.innerText.trim() === 'Convert text' && !item.disabled); if (!button) return false; button.click(); return true; })()");
        if (!reverseClicked) throw new Error("Preeti converter reverse action is unavailable.");
        await delay(200);
        const reversed = await page.evaluate("document.querySelector('main [aria-live]')?.innerText || ''");
        if (!reversed || !/[A-Za-z]/.test(reversed)) throw new Error("Unicode-to-Preeti reverse conversion did not return encoded text.");
        row.checks.push("Preeti → Unicode and Unicode → Preeti conversions verified");
        row.outputVerified = true;
        row.status = "PASS";
        row.evidenceLevel = "bidirectional-preeti-unicode-output-verified";
        return row;
      }
      if (tool.slug === "uuid-generator") {
        const generated = finalState.live.join("\n").trim().split(/\r?\n/).filter(Boolean);
        const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (generated.length !== 5 || generated.some((value) => !uuidV4.test(value))) {
          throw new Error("UUID generator must return exactly five valid RFC 4122 version 4 UUIDs.");
        }
        row.checks.push("five generated UUID v4 values validated");
        row.outputVerified = true;
        row.status = "PASS";
        row.evidenceLevel = "five-uuid-v4-values-validated";
        return row;
      }
      if (tool.slug === "color-picker-palette") {
        const colorState = await page.evaluate("({ value: document.querySelector('main input[type=color]')?.value, body: document.querySelector('main')?.innerText || '', swatches: [...document.querySelectorAll('main button[title]')].map(b => b.title) })");
        if (colorState.value !== "#0f766e" || !colorState.body.includes("#0F766E") || !colorState.body.includes("15, 118, 110") || colorState.swatches.length < 5) throw new Error("Color picker did not show the selected HEX/RGB values and five palette swatches.");
        row.checks.push("selected color, HEX, RGB and five palette swatches verified");
        row.outputVerified = true;
        row.status = "PASS";
        row.evidenceLevel = "color-picker-values-and-palette-verified";
        return row;
      }
      if (/Tool configuration missing|Tool not implemented|This utility is not available yet|Nepal utility not found/i.test(finalState.body)) {
        throw new Error("Tool reported an unavailable handler/configuration.");
      }
      const expectedOutputs = {
        "loan-emi-calculator": "Monthly EMI: NPR 21,247.04",
        "compound-interest-sip-calculator": "Estimated future value: NPR 1,024,224.89",
        "discount-percentage-calculator": "Price after discount: 800",
        "lorem-ipsum-generator": "lorem ipsum dolor sit amet",
        "text-diff-checker": "No differences found.",
        "base64-encoder-decoder": "UERGb3JhIEUyRSB0ZXN0",
        "url-encoder-decoder": "https%3A%2F%2Fexample.com%2Fa%20path%3Fq%3Dhello%20world",
        "fraction-calculator": "5/6",
        "unit-converter": "1000.0000 m",
        "jwt-decoder": "\"sub\": \"e2e\"",
        "line-counter": "Total lines: 4",
        "text-to-binary": "01001000 01100101 01101100 01101100 01101111",
        "bmi-calculator": "BMI: 22.5",
        "bmr-calculator": "Estimated BMR: 1593 kcal/day",
        "unix-timestamp-converter": "UTC: 2026-11-01T08:00:00.000Z",
        "json-formatter-validator": '"name": "PDFora"',
        "hash-generator": "SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "percentage-change-calculator": "20.00% increase",
        "average-calculator": "Mean: 25",
        "ratio-simplifier": "2:3",
        "date-difference-calculator": "0 days",
        "time-duration-calculator": "8 hours 0 minutes",
        "remove-duplicate-lines": "apple\nbanana",
        "sort-lines": "apple\nBanana\nOrange",
        "reverse-text": "dlrow olleH",
        "text-to-slug": "my-awesome-website",
        "whitespace-cleaner": "Remove extra spaces",
        "character-frequency": "a : 3",
        "html-encoder-decoder": "&lt;h1&gt;Hello &amp; welcome&lt;/h1&gt;",
        "regex-tester": "Match: Cat at index 0",
        "color-contrast-checker": "Contrast ratio: 17.74:1",
        "css-minifier": ".card{color:#333;padding:16px}",
        "json-to-csv": '"name","age"',
        "meta-title-checker": "Characters: 30",
        "meta-description-checker": "Characters: 93",
        "keyword-density-checker": "Word count: 9",
        "robots-txt-generator": "User-agent: *",
        "sitemap-generator": "<urlset",
        "open-graph-preview": "og:title: Your page title",
        "profit-margin-calculator": "Profit margin: 40.00%",
        "markup-calculator": "Selling price: 84.00",
        "break-even-calculator": "Break-even units: 500",
        "sales-tax-calculator": "Total including tax: 1130.00",
        "salary-breakdown-calculator": "Gross monthly: 50000.00",
        "savings-goal-calculator": "Monthly savings needed: 7500.00",
        "url-query-parser": "q = pdf",
        "xml-formatter-validator": "<root>",
        "word-frequency-counter": "save — 2",
        "reading-time-calculator": "4 words",
        "sentence-counter": "Sentences: 3",
        "email-extractor": "hello@example.com",
        "url-extractor": "https://example.com",
        "phone-number-extractor": "+977-9812345678",
        "number-extractor": "2026",
        "hashtag-extractor": "#PDFora",
        "remove-duplicate-words": "the quick brown fox",
        "find-replace-text": "Hi world. Hi again.",
        "binary-to-text": "Hi",
        "text-to-hex": "48 65 6c 6c 6f",
        "hex-to-text": "Hello",
        "morse-code-translator": "... --- ... / .... . .-.. .--.",
        "palindrome-checker": "Palindrome",
        "acronym-generator": "NAASA",
        "camel-case-converter": "convertThisPhrase",
        "snake-case-converter": "convert_this_phrase",
        "kebab-case-converter": "convert-this-phrase",
        "html-tag-stripper": "HelloWelcome back.",
        "csv-to-json": "Asha",
        "json-to-yaml": '"name": "Asha"',
        "json-escape-unescape": "Line one\\nLine two",
        "url-validator": "Valid URL",
        "email-validator": "Basic email syntax looks valid.",
        "password-strength-checker": "Criteria met: 5/5",
        "tip-calculator": "Per person: 1375.00",
        "split-bill-calculator": "Per person: 1000.00",
        "simple-interest-calculator": "Simple interest: 2400.00",
        "commission-calculator": "Commission: 5000.00",
        "hourly-to-salary-calculator": "Weekly: 600.00",
        "percentage-of-number-calculator": "37.5000",
        "gcd-lcm-calculator": "GCD: 12",
        "prime-number-checker": "97 is prime",
        "date-add-subtract-calculator": "2026-12-01",
        "business-days-calculator": "Weekdays (inclusive): 21",
        "px-rem-converter": "1.5000 rem",
        "aspect-ratio-calculator": "16:9",
        "color-converter": "HEX: #0F766E",
        "css-gradient-generator": "background: linear-gradient(135deg, #0f766e, #38bdf8);",
        "roman-numeral-converter": "MMXXVI",
        "nepali-vat-calculator": "Total including VAT: NPR 1,130",
        "nepal-land-area-converter": "5,476 sq ft",
        "nepali-number-converter": "बाह्र लाख",
        "nepal-phone-validator": "Valid-looking Nepal mobile number format",
        "gold-tola-gram-converter": "11.6638 grams",
        "nepali-digit-converter": "नेपाली अंक: नेपाल २०८३ साल",
        "neb-gpa-calculator": "3.20 / 4.00",
        "nepal-share-calculator": "Total buy cost: NPR 20075.00",
        "nepal-salary-tax-calculator": "Estimated annual income tax: NPR 30,000.00",
        "nepse-dividend-calculator": "Estimated cash dividend after tax: NPR 950.00",
      };
      const expectedPatterns = {
        "age-calculator": /\d+ years, \d+ months, \d+ days/,
        "word-character-counter": /Words\s*6/,
        "case-converter": /PDFORA TOOLS MAKE EVERYDAY TASKS FASTER\./,
        "color-picker-palette": /#0F766E/,
        "nepali-unicode-typing": /[\u0900-\u097F]/,
        "preeti-unicode-converter": /[\u0900-\u097F]/,
        "currency-converter": /1 USD = [\d,.]+ NPR/,
        "password-generator": /^[^\n]{20}\n[^\n]{20}\n[^\n]{20}$/,
        "uuid-generator": /^(?:[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\n?){5}$/i,
        "random-number-generator": /^\d+(?:\n\d+){4}$/,
        "dice-roller": /^Rolls: [1-6], [1-6]\nTotal: \d+$/,
        "image-compressor": /^Done\. Original:/,
        "image-format-converter": /^Done\. Original:/,
        "loksewa-photo-resizer": /Ready: 1 × 1 px/,
        "nepali-date-converter": /\d{4}-\d{2}-\d{2} BS/,
        "nepali-calendar": /(?:BS day|BS गते)[\s\S]*(?:AD date|AD मिति)[\s\S]*(?:Weekday|बार)/,
        "nepal-forex-rates": /USD[\s\S]*NPR/,
      };
      const expected = expectedOutputs[tool.slug];
      const expectedPattern = expectedPatterns[tool.slug];
      const liveText = finalState.live.join("\n") + "\n" + finalState.tables + (["word-character-counter", "color-picker-palette", "nepal-land-area-converter", "preeti-unicode-converter"].includes(tool.slug) ? "\n" + finalState.body : "") + (["case-converter", "nepali-unicode-typing", "preeti-unicode-converter"].includes(tool.slug) ? "\n" + finalState.inputValues.map((input) => input.value).join("\n") : "");
      const normalizedLiveText = liveText.replace(/\s+/g, " ").trim();
      let outputMatches = expected ? normalizedLiveText.includes(expected.replace(/\s+/g, " ").trim()) : expectedPattern ? expectedPattern.test(liveText) : false;
      if (tool.slug === "nepse-market-news") {
        outputMatches = finalState.storyLinks > 0 || /No recent stories were returned by the feed/i.test(finalState.body);
      } else if (tool.slug === "password-generator") {
        const generated = liveText.split(/\r?\n/).map((line) => line.trim()).filter((line) => /^[\x21-\x7e]{20}$/.test(line));
        outputMatches = generated.length >= 3;
      } else if (tool.slug === "random-number-generator") {
        const generated = liveText.split(/\r?\n/).map((line) => line.trim()).filter((line) => /^\d+$/.test(line)).map(Number);
        outputMatches = generated.length >= 1 && generated.every((value) => Number.isInteger(value) && value >= 1 && value <= 100);
      } else if (tool.slug === "dice-roller") {
        const match = liveText.match(/Rolls:\s*(\d+)\s*,\s*(\d+)[\s\S]*?Total:\s*(\d+)/);
        outputMatches = !!match && Number(match[1]) >= 1 && Number(match[1]) <= 6 && Number(match[2]) >= 1 && Number(match[2]) <= 6 && Number(match[3]) === Number(match[1]) + Number(match[2]);
      }
      if ((expected || expectedPattern) && !outputMatches) {
        throw new Error("Expected output was not found for " + tool.slug + "; actual: " + liveText.slice(0, 300));
      }
      if (!finalState.inputs && !/calendar|market|news|resume|holiday|dashboard|typing|uuid-generator/i.test(tool.slug)) {
        throw new Error("Tool rendered no interactive inputs.");
      }
      const editableInputCheck = await page.evaluate(`(() => {
        const field = [...document.querySelectorAll("main input:not([type=file]), main textarea")].find((item) => !item.disabled && !item.readOnly && !["checkbox", "radio", "button", "submit", "reset"].includes(item.type));
        if (!field) return { tested: false };
        const prototype = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
        setter?.call(field, "");
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
        return { tested: true };
      })()`);
      if (editableInputCheck.tested) {
        await delay(150);
        const emptyInputText = await page.evaluate("document.querySelector('main')?.innerText || ''");
        if (/\bNaN\b|\bInfinity\b|\[object Object\]/.test(emptyInputText)) throw new Error("Clearing an editable input produced an invalid numeric or object output.");
        row.checks.push("empty-input edge case did not render NaN, Infinity or object output");
      }
      if (tool.slug === "loan-emi-calculator") {
        const invalidState = await page.evaluate(`(() => {
          const fields = [...document.querySelectorAll('main input:not([type="file"])')];
          const alert = document.querySelector('main [role="alert"]')?.innerText || "";
          return { count: fields.length, values: fields.map((field) => field.value), alert };
        })()`);
        if (invalidState.count !== 3 || !/loan amount|interest rate|loan term/i.test(invalidState.alert)) {
          throw new Error("EMI validation must keep all three editable fields visible and explain invalid input.");
        }
        await page.evaluate(`(() => {
          const field = document.querySelectorAll('main input:not([type="file"])')[0];
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
          setter?.call(field, "1000000");
          field.dispatchEvent(new Event("input", { bubbles: true }));
          field.dispatchEvent(new Event("change", { bubbles: true }));
        })()`);
        await delay(150);
        await page.evaluate(`(() => {
          const field = document.querySelectorAll('main input:not([type="file"])')[2];
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
          setter?.call(field, "60.5");
          field.dispatchEvent(new Event("input", { bubbles: true }));
          field.dispatchEvent(new Event("change", { bubbles: true }));
        })()`);
        await delay(150);
        const fractionalState = await page.evaluate(`(() => ({
          count: document.querySelectorAll('main input:not([type="file"])').length,
          alert: document.querySelector('main [role="alert"]')?.innerText || ""
        }))()`);
        if (fractionalState.count !== 3 || !/whole-number|whole number/i.test(fractionalState.alert)) {
          throw new Error("EMI must reject fractional months without hiding editable controls.");
        }
        await page.evaluate(`(() => {
          const field = document.querySelectorAll('main input:not([type="file"])')[2];
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
          setter?.call(field, "60");
          field.dispatchEvent(new Event("input", { bubbles: true }));
          field.dispatchEvent(new Event("change", { bubbles: true }));
        })()`);
        await delay(150);
        const recovered = await page.evaluate("document.querySelector('main')?.innerText || ''");
        if (!recovered.includes("Monthly EMI:") || !recovered.includes("21,247.04")) {
          throw new Error("EMI did not recover after correcting invalid values.");
        }
        row.checks.push("invalid and fractional input retained all fields; corrected values restored the expected EMI");
      }
      if (finalState.alerts.some((alert) => /error|failed|invalid|could not|unavailable/i.test(alert))) {
        throw new Error(finalState.alerts.join(" | "));
      }
      row.output = finalState.live.filter(Boolean).join(" | ").slice(0, 700) || finalState.body.slice(-700);
      row.outputVerified = ((expected || expectedPattern) && outputMatches) || finalState.live.some((value) => value.trim().length > 0);
      row.evidenceLevel = (expected || expectedPattern) && outputMatches ? "expected-output-assertion" : row.outputVerified ? "live-output-observed-not-oracle-checked" : "route-and-controls-smoke-only";
      row.checks.push("workspace output inspected");

      // Every tool also receives a real Nepali-route smoke check. This verifies
      // the localized URL, document language, visible Devanagari content and
      // absence of the explicit English-fallback notice without claiming a
      // native-speaker review or full functional certification.
      const nepaliPath = tool.kind === "pdf"
        ? "/ne" + tool.url
        : tool.slug === "resume-builder" ? "/ne/resume-builder" : "/ne/tools/" + tool.slug;
      const nepaliUrl = new URL(nepaliPath, baseUrl).toString();
      const localizedNavigation = await page.send("Page.navigate", { url: nepaliUrl });
      if (localizedNavigation.errorText) throw new Error("Nepali route navigation failed for " + tool.slug + ": " + localizedNavigation.errorText);
      const localizedStarted = Date.now();
      let localizedReady = { state: "", path: "" };
      while (Date.now() - localizedStarted < 15000) {
        localizedReady = await page.evaluate("(() => ({ state: document.readyState, path: location.pathname }))()");
        if (localizedReady.path === nepaliPath &&
            (localizedReady.state === "interactive" || localizedReady.state === "complete")) break;
        await delay(200);
      }
      if (localizedReady.path !== nepaliPath) {
        throw new Error("Nepali route did not finish navigation to " + nepaliPath + ": " + JSON.stringify(localizedReady));
      }
      await delay(500);
      const nepaliState = await page.evaluate(`(() => {
        const body = document.body?.innerText || "";
        return {
          lang: document.documentElement.getAttribute("lang") || "",
          title: document.title || "",
          heading: document.querySelector("h1")?.innerText?.trim() || "",
          headingCount: document.querySelectorAll("h1").length,
          mainCount: document.querySelectorAll("main").length,
          hasDevanagari: /[\\u0900-\\u097F]/.test(body),
          englishFallbackNotice: body.includes("यस पृष्ठको टुल इन्टरफेस अझै पूर्ण रूपमा नेपालीमा अनुवाद गरिएको छैन"),
          bodyLength: body.trim().length,
        };
      })()`);
      row.nepaliLocale = { path: nepaliPath, ...nepaliState };
      if (nepaliState.lang !== "ne" || !nepaliState.heading || nepaliState.headingCount !== 1 ||
          nepaliState.mainCount !== 1 || !nepaliState.hasDevanagari ||
          nepaliState.englishFallbackNotice || nepaliState.bodyLength < 80) {
        throw new Error("Nepali localized route did not pass visible-language checks: " + JSON.stringify(row.nepaliLocale));
      }
      row.nepaliLocale.status = "PASS";
      row.checks.push("Nepali route has lang=ne, one main/h1, visible Devanagari content and no English-fallback notice");
      row.status = (expected || expectedPattern) && outputMatches && row.outputVerified ? "PASS" : "PARTIAL";
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    row.errors.push(message);
    row.browserExceptions = page?.events
      ?.filter((event) => event.method === "Runtime.exceptionThrown" || event.method === "Log.entryAdded")
      .slice(-8)
      .map((event) => ({ method: event.method, details: event.params?.exceptionDetails?.exception?.description || event.params?.entry?.text || event.params?.exceptionDetails?.text || "" })) || [];
    row.status = "FAIL";
    browserFailures += 1;
    if (message.includes("DevTools WebSocket connection timed out")) fatalBrowserError = true;
  } finally {
    if (page) await page.close();
  }
  return row;
}

try {
  for (let index = 0; index < tools.length; index += 1) {
    const result = await runTool(tools[index], index);
    results.push(result);
    console.log((result.status === "PASS" ? "PASS " : result.status === "PARTIAL" ? "PARTIAL " : "FAIL ") +
      result.index + "/173 " + result.slug + " — " +
      (result.errors[0] || result.checks.join(", ")));
    if (fatalBrowserError) break;
  }
} finally {
  chrome.kill("SIGTERM");
}

const report = {
  generatedAt: new Date().toISOString(),
  sourceCommit: process.env.GITHUB_SHA || "unknown",
  baseUrl,
  expected: { pdf: 49, catalog: 124, total: 173, nepaliLocalizedRoutes: 173 },
  methodology: {
    browser: "Headless Chromium via Chrome DevTools Protocol; Node.js 22 native WebSocket",
    pdf: "Open each PDF route, attach a generated one-page PDF, click the processing action and inspect completion/output state.",
    catalog: "Open each catalog route, inspect the rendered workspace, execute its primary action when present and inspect output/error state. Every tool also checks its Nepali route for lang=ne, one main/h1, visible Devanagari content and no explicit English-fallback notice. PASS requires an explicit expected-output assertion; un-oracled output or route-only checks are PARTIAL.",
    ai: "AI tools are route-smoke-tested only; execution is intentionally skipped per project scope and is always PARTIAL.",
    limitations: "This is a browser route and workflow smoke suite, not complete functional certification for all 173 tools. PASS is reserved for explicit expected-output assertions; PARTIAL means a route rendered or a processing state/output appeared without a full expected-output oracle. The suite checks 390px horizontal overflow, Tab focus, document language/landmarks/headings and visible control names. It does not replace visual comparison, exhaustive input boundaries, WCAG contrast measurements or manual screen-reader testing.",
  },
  counts: {
    total: results.length,
    pass: results.filter((row) => row.status === "PASS").length,
    partial: results.filter((row) => row.status === "PARTIAL").length,
    fail: results.filter((row) => row.status === "FAIL").length,
    pdf: results.filter((row) => row.kind === "pdf").length,
    catalog: results.filter((row) => row.kind === "catalog").length,
    aiExecutionSkipped: results.filter((row) => aiTools.has(row.slug)).length,
    nepaliRoutePass: results.filter((row) => row.nepaliLocale?.status === "PASS").length,
    nepaliRouteFail: results.filter((row) => row.nepaliLocale?.status !== "PASS").length,
  },
  results,
};
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
console.log("BROWSER E2E SUMMARY " + JSON.stringify(report.counts));
if (browserFailures) process.exitCode = 1;
