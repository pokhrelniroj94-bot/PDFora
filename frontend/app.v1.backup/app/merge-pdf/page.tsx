"use client";

import { ChangeEvent, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []).filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
    );

    setFiles(selected);
    setMessage("");
  }

  async function mergePDFs() {
    if (files.length < 2) {
      setMessage("Please select at least 2 PDF files.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(`${API_URL}/api/merge`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Merge failed.");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "PDFora-merged.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      setMessage("PDFs merged successfully. Download started.");
    } catch (error) {
      console.error("Merge error:", error);
      setMessage(
        "Could not merge the PDFs. Make sure the PDFora backend is running."
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
          <p className="text-sm font-bold text-blue-600">ORGANIZE PDF</p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Merge PDF
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Combine multiple PDF files into one document quickly and easily.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <label
            htmlFor="pdf-files"
            className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 text-center transition hover:border-blue-400 hover:bg-blue-50"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
              📄
            </div>

            <h2 className="mt-5 text-lg font-black">
              Select PDF files
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Choose two or more PDF files from your device
            </p>

            <span className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">
              Choose PDFs
            </span>

            <input
              id="pdf-files"
              type="file"
              accept="application/pdf,.pdf"
              multiple
              onChange={handleFiles}
              className="hidden"
            />
          </label>

          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-black">Selected files</h3>

                <button
                  type="button"
                  onClick={() => setFiles([])}
                  className="text-sm font-bold text-red-600 hover:text-red-700"
                >
                  Clear
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {index + 1}. {file.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <span className="ml-3 text-green-600">✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={mergePDFs}
            disabled={loading || files.length < 2}
            className="mt-6 w-full rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "Merging PDFs..." : "Merge PDFs"}
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
            description="Select PDFs and merge them with one click."
          />

          <InfoCard
            title="Private"
            description="Files are sent only to the PDFora processing server."
          />

          <InfoCard
            title="Free"
            description="No subscription is required to use this tool."
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

      <h3 className="mt-3 text-sm font-black">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}