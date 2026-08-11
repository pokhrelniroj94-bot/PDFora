"use client";

import { ChangeEvent, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] || null;

    if (selected && selected.type !== "application/pdf") {
      setFile(null);
      setMessage("Please select a PDF file.");
      return;
    }

    setFile(selected);
    setMessage("");
  }

  async function compressPDF() {
    if (!file) {
      setMessage("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/compress`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Compression failed.");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "PDFora-Compressed.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      const originalSize = response.headers.get("X-Original-Size");
      const compressedSize = response.headers.get("X-Compressed-Size");

      if (originalSize && compressedSize) {
        const originalMB =
          Number(originalSize) / 1024 / 1024;

        const compressedMB =
          Number(compressedSize) / 1024 / 1024;

        const saved =
          originalMB > 0
            ? Math.max(
                0,
                ((originalMB - compressedMB) / originalMB) * 100
              )
            : 0;

        setMessage(
          `Compression complete. Original: ${originalMB.toFixed(
            2
          )} MB → Compressed: ${compressedMB.toFixed(
            2
          )} MB. Saved approximately ${saved.toFixed(1)}%.`
        );
      } else {
        setMessage("PDF compressed successfully. Download started.");
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not compress the PDF. Make sure the PDFora backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 font-black text-white">
              P
            </div>

            <span className="text-xl font-black">
              PDF<span className="text-blue-600">ora</span>
            </span>
          </a>

          <a
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold hover:bg-slate-50"
          >
            ← All Tools
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="text-center">
          <p className="text-sm font-bold text-blue-600">
            OPTIMIZE PDF
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Compress PDF
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Reduce your PDF file size while keeping the document usable.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <label
            htmlFor="pdf-file"
            className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 text-center transition hover:border-blue-400 hover:bg-blue-50"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
              🗜️
            </div>

            <h2 className="mt-5 text-lg font-black">
              Select a PDF
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Choose one PDF file up to 50 MB
            </p>

            <span className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">
              Choose PDF
            </span>

            <input
              id="pdf-file"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFile}
              className="hidden"
            />
          </label>

          {file && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setMessage("");
                  }}
                  className="text-sm font-bold text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={compressPDF}
            disabled={loading || !file}
            className="mt-6 w-full rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "Compressing PDF..." : "Compress PDF"}
          </button>

          {message && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-700">
              {message}
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <InfoCard
            title="Easy"
            description="Select your PDF and compress it with one click."
          />

          <InfoCard
            title="Private"
            description="Your PDF is processed by your PDFora backend."
          />

          <InfoCard
            title="Free"
            description="No subscription is required for this tool."
          />
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 font-black text-blue-600">
        ✓
      </div>

      <h3 className="mt-3 text-sm font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}