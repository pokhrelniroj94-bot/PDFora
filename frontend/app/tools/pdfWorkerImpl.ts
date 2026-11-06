// PDF Worker implementation (pure functions) using pdf-lib
// This file contains the core PDF manipulation logic that can be imported
// both by the WebWorker (frontend/app/tools/pdfWorker.ts) and the Jest unit tests.

import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

/**
 * Supported PDF commands. Each command carries the minimal parameters required.
 */
export type PdfCommand =
  | { type: "merge" }
  | { type: "split"; pages: string } // e.g. "1,3-5"
  | { type: "extract"; pages: string }
  | { type: "deletePages"; pages: string }
  | { type: "reorder"; order: string } // e.g. "3,1,2"
  | { type: "rotate"; angle: number } // 0,90,180,270
  | { type: "addPageNumbers"; start: number; format?: string }
  | { type: "watermark"; text: string; opacity?: number }
  | { type: "compress" };

/** Utility: parse a page list like "1,3-5" into zeroÃ¢â‚¬â€˜based indices */
function parsePageList(pages: string, pageCount: number): number[] {
  const result: Set<number> = new Set();
  const parts = pages.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (isNaN(start) || isNaN(end)) {
        throw new Error(`Invalid page range token: '${part}'`);
      }
      if (start > end) {
        throw new Error(`Reversed page range: '${part}'`);
      }
      // page numbers are 1Ã¢â‚¬â€˜based
      if (start < 1 || end > pageCount) {
        throw new Error(`Page range out of bounds: '${part}'`);
      }
      for (let i = start - 1; i <= end - 1; i++) result.add(i);
    } else {
      const idx = parseInt(part, 10);
      if (isNaN(idx)) {
        throw new Error(`Invalid page number: '${part}'`);
      }
      if (idx < 1 || idx > pageCount) {
        throw new Error(`Page number out of bounds: '${part}'`);
      }
      result.add(idx - 1);
    }
  }
  const sorted = Array.from(result).sort((a, b) => a - b);
  if (sorted.length === 0) {
    throw new Error('No valid pages selected');
  }
  return sorted;
}

/** Utility: parse an order list like "3,1,2" (1Ã¢â‚¬â€˜based) */
function parseOrder(order: string, pageCount: number): number[] {
  const parts = order.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);
  const result: number[] = [];
  for (const part of parts) {
    const idx = parseInt(part, 10) - 1;
    if (!isNaN(idx) && idx >= 0 && idx < pageCount) result.push(idx);
  }
  return result;
}

/** Main entry point */
export async function processPdf(
  cmd: PdfCommand,
  files: File[]
): Promise<{ blob: Blob; blobs?: {blob: Blob; filename: string}[]; warnings?: string[] }> {
  if (!files.length) throw new Error("No files provided");

  // Load all PDFs first
  const pdfDocs = await Promise.all(
    files.map(async (f) => {
      const arrayBuffer =
        typeof f.arrayBuffer === "function"
          ? await f.arrayBuffer()
          : await new Promise<ArrayBuffer>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                  resolve(reader.result);
                } else {
                  reject(new Error("Unable to read PDF file."));
                }
              };
              reader.onerror = () =>
                reject(reader.error ?? new Error("Unable to read PDF file."));
              reader.readAsArrayBuffer(f);
            });
      try {
        return await PDFDocument.load(arrayBuffer);
      } catch {
        throw new Error(`Invalid PDF: ${f.name}`);
      }
    })
  );

  // Helper to create a new empty document
  const outputDoc = await PDFDocument.create();
  const warnings: string[] = [];
  let resultBlob: Blob | undefined;
  let resultBlobs: {blob: Blob; filename: string}[] | undefined;

  // Helper to finalize a single-document result from outputDoc
  async function finalizeSingle(): Promise<void> {
    const pdfBytes = await outputDoc.save();
    const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
    new Uint8Array(pdfBuffer).set(pdfBytes);
    resultBlob = new Blob([pdfBuffer], { type: "application/pdf" });
  }

  // Helper to compute filename for split parts
  function defaultFilename(base: string, index: number): string {
    return `${base}-part-${index}.pdf`;
  }

  switch (cmd.type) {
    case "merge": {
      for (const doc of pdfDocs) {
        const pages = await outputDoc.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => outputDoc.addPage(p));
      }
      break;
    }
    case "split": {
      // Split may produce multiple PDFs if page ranges are disjoint (comma-separated segments)
      const src = pdfDocs[0];
      const pageCount = src.getPageCount();
      const rawSegments = cmd.pages.split(/[;,]+/).map(s => s.trim()).filter(Boolean);
      const blobs: {blob: Blob; filename: string}[] = [];
      let partIndex = 1;
      for (const seg of rawSegments) {
        const indices = parsePageList(seg, pageCount);
        const partDoc = await PDFDocument.create();
        const pages = await partDoc.copyPages(src, indices);
        pages.forEach(p => partDoc.addPage(p));
        const pdfBytes = await partDoc.save();
        const pdfBuffer = new ArrayBuffer(pdfBytes.length);
        new Uint8Array(pdfBuffer).set(pdfBytes);
        const blob = new Blob([pdfBuffer], { type: "application/pdf" });
        const filename = defaultFilename(src.getTitle?.() || "output", partIndex);
        blobs.push({blob, filename});
        partIndex++;
      }
      if (blobs.length === 1) {
        resultBlob = blobs[0].blob;
      } else {
        resultBlobs = blobs;
      }
      break;
    }
    case "extract": {
      // Extract behaves like split but returns a single PDF (first segment)
      const src = pdfDocs[0];
      const pageCount = src.getPageCount();
      const indices = parsePageList(cmd.pages, pageCount);
      const pages = await outputDoc.copyPages(src, indices);
      pages.forEach(p => outputDoc.addPage(p));
      await finalizeSingle();
      break;
    }
    case "deletePages": {
      const src = pdfDocs[0];
      const pageCount = src.getPageCount();
      const toDelete = new Set(parsePageList(cmd.pages, pageCount));
      const keepIndices = src
        .getPageIndices()
        .filter((i) => !toDelete.has(i));
      const pages = await outputDoc.copyPages(src, keepIndices);
      pages.forEach((p) => outputDoc.addPage(p));
      break;
    }
    case "reorder": {
      const src = pdfDocs[0];
      const pageCount = src.getPageCount();
      const order = parseOrder(cmd.order, pageCount);
      const pages = await outputDoc.copyPages(src, order);
      pages.forEach((p) => outputDoc.addPage(p));
      break;
    }
    case "rotate": {
      const src = pdfDocs[0];
      const degree = degrees(cmd.angle);
      const pages = await outputDoc.copyPages(src, src.getPageIndices());
      pages.forEach((p) => p.setRotation(degree));
      pages.forEach((p) => outputDoc.addPage(p));
      break;
    }
    case "addPageNumbers": {
      const src = pdfDocs[0];
      const pages = await outputDoc.copyPages(src, src.getPageIndices());
      const font = await outputDoc.embedFont(StandardFonts.Helvetica);
      pages.forEach((p, idx) => {
        const number = cmd.start + idx;
        const txt = cmd.format ? cmd.format.replace("%d", String(number)) : String(number);
        const { width } = p.getSize();
        p.drawText(txt, {
          x: width - 50,
          y: 20,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
        outputDoc.addPage(p);
      });
      break;
    }
    case "watermark": {
      const src = pdfDocs[0];
      const pages = await outputDoc.copyPages(src, src.getPageIndices());
      const font = await outputDoc.embedFont(StandardFonts.HelveticaBold);
      const opacity = typeof cmd.opacity === "number" ? cmd.opacity : 0.3;
      pages.forEach((p) => {
        const { width, height } = p.getSize();
        p.drawText(cmd.text, {
          x: width / 2 - 100,
          y: height / 2,
          size: 48,
          font,
          color: rgb(0.75, 0.75, 0.75),
          rotate: degrees(45),
          opacity,
        });
        outputDoc.addPage(p);
      });
      break;
    }
    case "compress": {
      // pdf-lib does not provide compression; return original with a warning
      warnings.push("Compression not supported by pdf-lib; returning original PDF.");
      const src = pdfDocs[0];
      const pages = await outputDoc.copyPages(src, src.getPageIndices());
      pages.forEach((p) => outputDoc.addPage(p));
      break;
    }
    default:
      const exhaustive: never = cmd;
      void exhaustive;
      throw new Error("Unsupported PDF command");
  }

  let blob = resultBlob ?? resultBlobs?.[0]?.blob;

  if (!blob) {
    const pdfBytes = await outputDoc.save();
    const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
    new Uint8Array(pdfBuffer).set(pdfBytes);
    blob = new Blob([pdfBuffer], { type: "application/pdf" });
  }

  return {
    blob,
    blobs: resultBlobs,
    warnings: warnings.length ? warnings : undefined,
  };
}




