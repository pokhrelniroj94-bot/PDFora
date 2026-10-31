"use client";

import { ChangeEvent, useRef, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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

export default function Niroj77Tool({
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
  const [files, setFiles] = useState<File[]>([]);
  const [value, setValue] = useState(queryDefault);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);

    setFiles(selected);
    setMessage("");
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
    setMessage("");

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

      window.URL.revokeObjectURL(downloadURL);

      setMessage("Completed successfully. Download started.");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
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
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a
            href="/"
            className="flex min-h-11 items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 font-black text-white">
              P
            </div>

            <span className="text-xl font-black tracking-tight">
              PDF<span className="text-violet-600">ora</span>
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
          <p className="text-xs font-black uppercase tracking-widest text-violet-600">
            Niroj77 Tool
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
            {title}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            {description}
          </p>
        </div>

        {/* Tool Card */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-10 sm:p-8">
          {/* Upload Area */}
          <button
            type="button"
            onClick={chooseFiles}
            className="flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 text-center transition active:scale-[0.99] hover:border-violet-400 hover:bg-violet-50 sm:min-h-64"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-3xl">
              📄
            </div>

            <h2 className="mt-4 text-base font-black sm:text-lg">
              {files.length > 0
                ? `${files.length} file${
                    files.length > 1 ? "s" : ""
                  } selected`
                : multiple
                  ? "Select PDF files"
                  : "Select a PDF file"}
            </h2>

            <p className="mt-2 text-xs text-slate-500 sm:text-sm">
              Maximum 50 MB per file
            </p>

            <span className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white">
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
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>
          )}

          {/* Main action */}
          <button
            type="button"
            onClick={processPDF}
            disabled={loading || files.length === 0}
            className="mt-5 flex min-h-14 w-full items-center justify-center rounded-2xl bg-violet-600 px-5 text-sm font-black text-white transition active:scale-[0.99] hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300"
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
            description="Files are processed by the Niroj77 backend."
          />

          <InfoCard
            icon="📱"
            title="Mobile Ready"
            description="Designed to work smoothly on phones and desktops."
          />
        </div>
      </section>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg">
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