import { processPdf, PdfCommand } from "../app/tools/pdfWorkerImpl";

describe('PDF Worker Core', () => {
  const readBlob = (blob: Blob): Promise<ArrayBuffer> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) resolve(reader.result);
        else reject(new Error("Unable to read output PDF"));
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(blob);
    });
  // Helper to create a simple 2â€‘page PDF
  const createSamplePdf = async (name: string) => {
    const { PDFDocument, StandardFonts } = await import('pdf-lib');
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const page1 = doc.addPage();
    page1.drawText('Page 1', { x: 50, y: 700, size: 24, font });
    const page2 = doc.addPage();
    page2.drawText('Page 2', { x: 50, y: 700, size: 24, font });
    const bytes = await doc.save();
    // Convert to a File object (Node environment uses Blob/File polyfill via jest-fetch-mock?)
    const pdfBuffer = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(pdfBuffer).set(bytes);
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    return new File([blob], name, { type: 'application/pdf' });
  };

  test('merge two PDFs', async () => {
    const file1 = await createSamplePdf('a.pdf');
    const file2 = await createSamplePdf('b.pdf');
    const cmd: PdfCommand = { type: 'merge' };
    const { blob } = await processPdf(cmd, [file1, file2]);
    const arrayBuffer = await readBlob(blob);
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.load(arrayBuffer);
    expect(doc.getPageCount()).toBe(4);
  });

  test('split pages 1-2', async () => {
    const file = await createSamplePdf('c.pdf');
    const cmd: PdfCommand = { type: 'split', pages: '1-2' };
    const { blob } = await processPdf(cmd, [file]);
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.load(await readBlob(blob));
    expect(doc.getPageCount()).toBe(2);
  });

  test('rotate 90 degrees', async () => {
    const file = await createSamplePdf('d.pdf');
    const cmd: PdfCommand = { type: 'rotate', angle: 90 };
    const { blob } = await processPdf(cmd, [file]);
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.load(await readBlob(blob));
    const page = doc.getPage(0);
    expect(page.getRotation().angle).toBe(90);
  });

  test('watermark adds text', async () => {
    const file = await createSamplePdf('e.pdf');
    const cmd: PdfCommand = { type: 'watermark', text: 'TEST' };
    const { blob } = await processPdf(cmd, [file]);
    // Cannot easily verify visual content; ensure no error and blob size > 0
    expect(blob.size).toBeGreaterThan(0);
  });

  test('invalid PDF throws', async () => {
    const badFile = new File([new Uint8Array([1, 2, 3])], 'bad.txt', { type: 'text/plain' });
    const cmd: PdfCommand = { type: 'merge' };
    await expect(processPdf(cmd, [badFile])).rejects.toThrow('Invalid PDF');
  });
});



