"use client";

import { usePathname } from "next/navigation";
import ToolSEOContent from "./ToolSEOContent";

import { ChangeEvent, DragEvent, useRef, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://pdfora-493r.onrender.com";

type Props = {
  endpoint: string;
  title: string;
  description: string;
  multiple?: boolean;
  accept?: string;
  downloadName: string;
  fieldName?: string;
  formField?: string;
  formPlaceholder?: string;
  queryField?: string;
  queryDefault?: string;
};

export default function PDForaTool({
  endpoint,
  title,
  description,
  multiple = false,
  accept = "application/pdf,.pdf",
  downloadName,
  fieldName = "file",
  formField,
  formPlaceholder,
  queryField,
  queryDefault = "",
}: Props) {
  const pathname = usePathname();
  const currentSlug = pathname.split("/").filter(Boolean).pop() ?? "";
  const [files, setFiles] = useState<File[]>([]);
  const [value, setValue] = useState(queryDefault);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  function applyFiles(selectedFiles: File[]) {
    const selected = multiple ? selectedFiles : selectedFiles.slice(0, 1);
    const oversized = selected.find((file) => file.size > 50 * 1024 * 1024);
    if (oversized) {
      setFiles([]);
      setMessage(`${oversized.name} exceeds the 50 MB per-file limit.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setFiles(selected);
    setMessage("");
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    applyFiles(Array.from(event.target.files || []));
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragActive(false);
    if (loading) return;
    applyFiles(Array.from(event.dataTransfer.files || []));
  }

  function removeFile(index: number) {
    setFiles((current) =>
      current.filter((_, fileIndex) => fileIndex !== index)
    );

    setMessage("");
  }

  function chooseFiles() {
    inputRef.current?.click();
  }

  async function processPDF() {
    if (files.length === 0) {
      setMessage("Please select a file.");
      return;
    }

    if ((formField || queryField) && !value.trim()) {
      setMessage("Please enter the required information.");
      return;
    }

    setLoading(true);
    setMessage(
      "Connecting to PDFora's processing server. If it has been idle, the first request may take up to a minute."
    );

    try {
      const formData = new FormData();

      if (multiple) {
        for (const file of files) {
          formData.append(
            fieldName === "file" ? "files" : fieldName,
            file
          );
        }
      } else {
        formData.append(fieldName, files[0]);
      }

      if (formField) {
        formData.append(formField, value);
      }

      const url = new URL(`${API_URL}${endpoint}`);

      if (queryField) {
        url.searchParams.set(queryField, value);
      }

      const response = await fetch(url.toString(), {
        method: "POST",
        body: formData,
        // Render may need time to wake an idle service. Allow a generous timeout.
        signal: AbortSignal.timeout(180_000),
      });

      if (!response.ok) {
        const text = await response.text();

        let errorMessage = "PDF processing failed.";

        try {
          const data = JSON.parse(text);

          if (data?.detail) {
            errorMessage = data.detail;
          }
        } catch {
          if (text) {
            errorMessage = text;
          }
        }

        throw new Error(errorMessage);
      }

      const blob = await response.blob();

      const downloadURL = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = downloadURL;
      link.download = downloadName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => window.URL.revokeObjectURL(downloadURL), 1000);

      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      setMessage("Completed successfully. Download started.");
    } catch (error) {
      console.error(error);

      const timedOut =
        error instanceof DOMException &&
        (error.name === "TimeoutError" || error.name === "AbortError");

      setMessage(
        timedOut
          ? "The processing server took too long to respond. It may be waking up or busy. Please try again."
          : error instanceof TypeError
            ? "Could not connect to the processing server. Please check your connection and try again."
            : error instanceof Error
              ? error.message
              : "Could not process the PDF."
      );
    } finally {
      setLoading(false);
    }
  }

  const success =
    message.toLowerCase().includes("successfully") ||
    message.toLowerCase().includes("completed");

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(20,184,166,.10),_transparent_42%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] text-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 shadow-[0_8px_30px_rgba(15,23,42,.04)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a
            href="/"
            className="flex min-h-11 items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-700 font-black text-white shadow-lg shadow-teal-900/20">
              P
            </div>

            <span className="text-xl font-black tracking-tight">
              PDFora
            </span>
          </a>

          <a
            href="/"
            className="flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold transition hover:bg-slate-50"
          >
            <span className="hidden sm:inline">
              ← All Tools
            </span>

            <span className="sm:hidden">
              ← Back
            </span>
          </a>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-16">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-widest text-teal-700">
            PDFora Tool
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
            {title}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            {description}
          </p>
        </div>

        {/* Tool Card */}
        <div className="mt-8 rounded-[2rem] border border-white/80 bg-white/90 p-4 shadow-[0_24px_80px_rgba(15,23,42,.09)] ring-1 ring-slate-900/[0.03] backdrop-blur sm:mt-10 sm:p-8">
          {/* Upload Area */}
          <button
            type="button"
            onClick={chooseFiles}
            onDragOver={(event) => { event.preventDefault(); if (!loading) setDragActive(true); }}
            onDragLeave={(event) => { event.preventDefault(); setDragActive(false); }}
            onDrop={handleDrop}
            aria-label="Choose or drop PDF files"
            className={`flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 text-center transition active:scale-[0.99] sm:min-h-64 ${dragActive ? "border-teal-500 bg-teal-50" : "border-slate-300 bg-slate-50/80 hover:border-teal-400 hover:bg-teal-50"}`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-100 text-3xl ring-1 ring-teal-900/5">
              📄
            </div>

            <h2 className="mt-4 text-base font-black sm:text-lg">
              {files.length > 0
                ? `${files.length} file${
                    files.length > 1 ? "s" : ""
                  } selected`
                : multiple
                  ? "Choose or drop PDF files"
                  : "Choose or drop a PDF file"}
            </h2>

            <p className="mt-2 text-xs text-slate-500 sm:text-sm">
              Maximum 50 MB per file
            </p>

            <span className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-gradient-to-r from-teal-600 to-cyan-700 px-5 text-sm font-bold text-white shadow-md shadow-teal-900/15">
              Choose File
            </span>
          </button>

          <input
            ref={inputRef}
            id="pdfora-file"
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFiles}
            className="hidden"
          />

          {/* Selected files */}
          {files.length > 0 && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="border-b border-slate-200 px-4 py-3">
                <p className="text-sm font-black">
                  Selected files
                </p>
              </div>

              <div className="max-h-64 overflow-y-auto p-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-3 rounded-xl px-2 py-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-lg shadow-sm">
                      📄
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">
                        {file.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-slate-500 hover:bg-white hover:text-red-600"
                      aria-label={`Remove ${file.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extra input */}
          {(formField || queryField) && (
            <div className="mt-4">
              <label className="mb-2 block text-sm font-bold">
                {queryField === "degrees"
                  ? "Rotation angle"
                  : formPlaceholder || "Enter value"}
              </label>

              <input
                value={value}
                onChange={(event) =>
                  setValue(event.target.value)
                }
                type={
                  queryField === "degrees"
                    ? "number"
                    : "text"
                }
                placeholder={
                  formPlaceholder || "Enter value"
                }
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </div>
          )}

          {/* Main action */}
          <button
            type="button"
            onClick={processPDF}
            disabled={loading || files.length === 0}
            className="mt-5 flex min-h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-700 px-5 text-sm font-black text-white shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-900/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Processing...
              </span>
            ) : (
              title
            )}
          </button>

          {/* Message */}
          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-4 rounded-xl border px-4 py-3 text-center text-sm font-semibold ${
                success
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
          <InfoCard
            icon="⚡"
            title="Easy"
            description="Choose your file and process it with one tap."
          />

          <InfoCard
            icon="🔒"
            title="Private"
            description="Files are processed by the PDFora backend."
          />

          <InfoCard
            icon="📱"
            title="Mobile Ready"
            description="Designed to work smoothly on phones and desktops."
          />
        </div>
        {/* Crawlable tool guidance: keep useful content ahead of the ad unit. */}
        <section
          aria-labelledby="how-to-use-title"
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
        >
          <h2 id="how-to-use-title" className="text-xl font-black tracking-tight">
            How to use {title}
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600">
            <li>Select or drag and drop your PDF file into the upload area.</li>
            <li>Enter any required options shown for this tool.</li>
            <li>Select the process button and wait while PDFora prepares your file.</li>
            <li>When processing finishes, your output file downloads automatically.</li>
          </ol>
          <h2 className="mt-6 text-lg font-black tracking-tight">
            Is this PDF tool free to use?
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            You can use this PDFora tool online without installing desktop software.
            Choose your file, run the selected operation, and download the result.
          </p>
          <h2 className="mt-6 text-lg font-black tracking-tight">
            Are my files kept private?
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Files are sent securely to the PDFora processing service to complete
            the requested operation. Avoid uploading documents containing
            information you do not want processed online.
          </p>
        </section>

        {/* Advertisement is intentionally outside the upload and processing flow. */}
        <div className="mt-8 border-t border-slate-200 pt-2">
        </div>
      </section>
      <ToolSEOContent slug={currentSlug} />
    </main>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm sm:p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-lg">
        {icon}
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