"use client";

import { ChangeEvent, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [startPage, setStartPage] = useState("1");
  const [endPage, setEndPage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] || null;

    setFile(selectedFile);
    setMessage("");
  }

  async function splitPDF() {
    if (!file) {
      setMessage("Please select a PDF file.");
      return;
    }

    const start = Number(startPage);
    const end = endPage.trim() === "" ? undefined : Number(endPage);

    if (!Number.isInteger(start) || start < 1) {
      setMessage("Start page must be at least 1.");
      return;
    }

    if (
      end !== undefined &&
      (!Number.isInteger(end) || end < start)
    ) {
      setMessage("Please enter a valid end page.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      // IMPORTANT:
      // Backend expects the field name "file"
      formData.append("file", file);

      const url = new URL(`${API_URL}/api/split`);

      url.searchParams.set("start_page", String(start));

      if (end !== undefined) {
        url.searchParams.set("end_page", String(end));
      }

      const response = await fetch(url.toString(), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();

        let errorMessage = "PDF splitting failed.";

        try {
          const errorData = JSON.parse(errorText);

          if (errorData?.detail) {
            errorMessage = errorData.detail;
          }
        } catch {
          if (errorText) {
            errorMessage = errorText;
          }
        }

        throw new Error(errorMessage);
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "PDFora-Split.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

      setMessage("PDF split successfully. Download started.");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Could not split the PDF. Make sure the PDFora backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* HEADER */}
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

      {/* MAIN */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="text-center">
          <p className="text-sm font-bold text-blue-600">
            ORGANIZE PDF
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Split PDF
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Extract the pages you need from a PDF document quickly and easily.
          </p>
        </div>

        {/* TOOL CARD */}
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          {/* FILE UPLOAD */}
          <label
            htmlFor="pdf-file"
            className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 text-center transition hover:border-blue-400 hover:bg-blue-50"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
              📄
            </div>

            <h2 className="mt-5 text-lg font-black">
              {file ? "PDF selected" : "Select a PDF file"}
            </h2>

            <p className="mt-2 max-w-full truncate px-4 text-sm text-slate-500">
              {file
                ? file.name
                : "Choose one PDF file from your device"}
            </p>

            <span className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">
              {file ? "Choose another PDF" : "Choose PDF"}
            </span>

            <input
              id="pdf-file"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFile}
              className="hidden"
            />
          </label>

          {/* SELECTED FILE */}
          {file && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
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
                  className="shrink-0 text-sm font-bold text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* PAGE RANGE */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="start-page"
                className="mb-2 block text-sm font-bold"
              >
                Start page
              </label>

              <input
                id="start-page"
                type="number"
                min="1"
                value={startPage}
                onChange={(event) => setStartPage(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="1"
              />
            </div>

            <div>
              <label
                htmlFor="end-page"
                className="mb-2 block text-sm font-bold"
              >
                End page
              </label>

              <input
                id="end-page"
                type="number"
                min="1"
                value={endPage}
                onChange={(event) => setEndPage(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Last page"
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Example: Start page 2 and end page 5 will create a PDF
            containing pages 2–5.
          </p>

          {/* SPLIT BUTTON */}
          <button
            type="button"
            onClick={splitPDF}
            disabled={loading || !file}
            className="mt-6 w-full rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "Splitting PDF..." : "Split PDF"}
          </button>

          {/* MESSAGE */}
          {message && (
            <div
              className={`mt-5 rounded-xl border px-4 py-3 text-center text-sm font-semibold ${
                message.toLowerCase().includes("success")
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <InfoCard
            title="Easy"
            description="Select a PDF and choose the pages you need."
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