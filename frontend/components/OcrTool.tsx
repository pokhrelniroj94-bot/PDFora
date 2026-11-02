"use client";

import { useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pdfora-493r.onrender.com";
const MAX_FILE_BYTES = 50 * 1024 * 1024;

export default function OcrTool() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("eng");
  const [output, setOutput] = useState("searchable_pdf");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  function chooseFile(selected?: File) {
    if (!selected) return;
    if (selected.size > MAX_FILE_BYTES) {
      setFile(null);
      setMessage("File size must be 50 MB or less.");
      return;
    }
    if (!/\.(pdf|png|jpe?g|webp)$/i.test(selected.name)) {
      setFile(null);
      setMessage("Choose a PDF, PNG, JPG or WebP file.");
      return;
    }
    setFile(selected);
    setMessage("");
  }

  async function processFile() {
    if (!file) {
      setMessage("Choose a PDF or image first.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("languages", language);
      body.append("output_format", output);
      const response = await fetch(API_URL + "/api/ocr", {
        method: "POST",
        body,
        signal: AbortSignal.timeout(300_000),
      });
      if (!response.ok) {
        const raw = await response.text();
        let detail = raw || "OCR processing failed.";
        try {
          const parsed = JSON.parse(raw);
          if (parsed?.detail) detail = parsed.detail;
        } catch { /* The server may return a plain-text error instead of JSON. */ }
        throw new Error(detail);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const extension = output === "txt" ? "txt" : "pdf";
      const base = file.name.replace(/\.[^.]+$/, "") || "document";
      link.href = url;
      link.download = base + "-ocr." + extension;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
      setMessage("OCR complete. Your download has started.");
    } catch (error) {
      const timedOut = error instanceof DOMException && (error.name === "TimeoutError" || error.name === "AbortError");
      setMessage(timedOut ? "OCR took too long. Try a smaller file or fewer pages." : error instanceof Error ? error.message : "Could not process this file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-8">
      <div className="rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/50 p-7 text-center">
        <div className="text-4xl" aria-hidden="true">📄</div>
        <h2 className="mt-3 text-lg font-black text-slate-900">Upload a scanned PDF or image</h2>
        <p className="mt-2 text-sm text-slate-600">PDF, PNG, JPG or WebP · Up to 50 MB · PDF up to 20 pages</p>
        <button type="button" onClick={() => inputRef.current?.click()} className="mt-5 min-h-11 rounded-xl bg-teal-700 px-5 font-bold text-white hover:bg-teal-800">Choose file</button>
        <input ref={inputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => { chooseFile(event.target.files?.[0]); event.target.value = ""; }} />
      </div>

      {file && <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900">{file.name}</p><p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div>
        <button type="button" onClick={() => { setFile(null); setMessage(""); }} className="min-h-10 min-w-10 rounded-lg text-xl text-slate-500 hover:bg-white" aria-label="Remove selected file">×</button>
      </div>}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ocr-language" className="mb-2 block text-sm font-bold text-slate-800">Recognition language</label>
          <select id="ocr-language" value={language} onChange={(event) => setLanguage(event.target.value)} className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm">
            <option value="eng">English</option>
            <option value="nep">Nepali (नेपाली)</option>
            <option value="hin">Hindi (हिन्दी)</option>
            <option value="eng+nep">English + Nepali</option>
            <option value="eng+hin">English + Hindi</option>
            <option value="eng+nep+hin">English + Nepali + Hindi</option>
          </select>
        </div>
        <div>
          <label htmlFor="ocr-output" className="mb-2 block text-sm font-bold text-slate-800">Output format</label>
          <select id="ocr-output" value={output} onChange={(event) => setOutput(event.target.value)} className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm">
            <option value="searchable_pdf">Searchable PDF</option>
            <option value="txt">Extracted text (.txt)</option>
          </select>
        </div>
      </div>

      <button type="button" onClick={processFile} disabled={!file || busy} className="mt-6 flex min-h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-700 to-cyan-700 px-5 font-black text-white shadow-lg hover:brightness-105 disabled:cursor-not-allowed disabled:bg-slate-300">
        {busy ? "Recognizing text…" : "Start OCR"}
      </button>
      {message && <p role="status" aria-live="polite" className={"mt-4 rounded-xl border p-3 text-center text-sm font-semibold " + (message.startsWith("OCR complete") ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-900")}>{message}</p>}
      <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
        <p className="rounded-xl bg-slate-50 p-3"><strong className="block text-slate-900">Nepali + English + Hindi</strong>Choose one language or combine them.</p>
        <p className="rounded-xl bg-slate-50 p-3"><strong className="block text-slate-900">Searchable PDF</strong>Find and select recognized text in the result.</p>
        <p className="rounded-xl bg-slate-50 p-3"><strong className="block text-slate-900">Private processing</strong>Uploaded files are processed temporarily and cleaned up after the response.</p>
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">OCR accuracy depends on scan quality, font and language selection. Handwriting and very blurry pages may not be recognized correctly.</p>
    </section>
  );
}
