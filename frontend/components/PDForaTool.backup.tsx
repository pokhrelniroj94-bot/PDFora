"use client";

import { ChangeEvent, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

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

  const [files, setFiles] = useState<File[]>([]);
  const [value, setValue] = useState(queryDefault);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleFiles(
    event: ChangeEvent<HTMLInputElement>
  ) {

    const selected =
      Array.from(
        event.target.files || []
      );

    setFiles(selected);
    setMessage("");
  }

  async function processPDF() {

    if (files.length === 0) {

      setMessage(
        "Please select a file."
      );

      return;
    }

    if (
      formField &&
      !value.trim()
    ) {

      setMessage(
        "Please enter the required information."
      );

      return;
    }

    if (
      queryField &&
      !value.trim()
    ) {

      setMessage(
        "Please enter the required value."
      );

      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const formData =
        new FormData();

      if (multiple) {

        for (const file of files) {

          formData.append(
            fieldName === "file"
              ? "files"
              : fieldName,
            file
          );
        }

      } else {

        formData.append(
          fieldName,
          files[0]
        );
      }

      if (formField) {

        formData.append(
          formField,
          value
        );
      }

      const url =
        new URL(
          `${API_URL}${endpoint}`
        );

      if (queryField) {

        url.searchParams.set(
          queryField,
          value
        );
      }

      const response =
        await fetch(
          url.toString(),
          {
            method: "POST",
            body: formData,
          }
        );

      if (!response.ok) {

        const text =
          await response.text();

        let errorMessage =
          "PDF processing failed.";

        try {

          const data =
            JSON.parse(text);

          if (data?.detail) {
            errorMessage =
              data.detail;
          }

        } catch {

          if (text) {
            errorMessage =
              text;
          }
        }

        throw new Error(
          errorMessage
        );
      }

      const blob =
        await response.blob();

      const downloadURL =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href =
        downloadURL;

      link.download =
        downloadName;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        downloadURL
      );

      setMessage(
        "Completed successfully. Download started."
      );

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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">

          <a
            href="/"
            className="flex items-center gap-2"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 font-black text-white">
              P
            </div>

            <span className="text-xl font-black">
              PDF<span className="text-blue-600">
                ora
              </span>
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
            PDFora TOOL
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            {title}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {description}
          </p>

        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">

          <label
            htmlFor="pdfora-file"
            className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 text-center transition hover:border-blue-400 hover:bg-blue-50"
          >

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
              📄
            </div>

            <h2 className="mt-5 text-lg font-black">
              {files.length
                ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                : multiple
                  ? "Select PDF files"
                  : "Select a PDF file"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Maximum 50 MB per file
            </p>

            <span className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">
              Choose File
            </span>

            <input
              id="pdfora-file"
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={handleFiles}
              className="hidden"
            />

          </label>

          {files.length > 0 && (

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">

              {files.map(
                (file, index) => (

                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-3 border-b border-slate-200 py-2 last:border-0"
                  >

                    <span className="min-w-0 truncate text-sm font-bold">
                      {file.name}
                    </span>

                    <span className="shrink-0 text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>

                  </div>

                )
              )}

            </div>

          )}

          {(formField || queryField) && (

            <input
              value={value}
              onChange={(event) =>
                setValue(
                  event.target.value
                )
              }
              type={
                queryField === "degrees"
                  ? "number"
                  : "text"
              }
              placeholder={
                formPlaceholder ||
                "Enter value"
              }
              className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          )}

          <button
            type="button"
            onClick={processPDF}
            disabled={loading || files.length === 0}
            className="mt-6 w-full rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >

            {loading
              ? "Processing..."
              : title}

          </button>

          {message && (

            <div
              className={`mt-5 rounded-xl border px-4 py-3 text-center text-sm font-semibold ${
                message.toLowerCase().includes("successfully") ||
                message.toLowerCase().includes("completed")
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>

          )}

        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">

          <InfoCard
            title="Easy"
            description="Select your file and process it with one click."
          />

          <InfoCard
            title="Private"
            description="Files are processed by your PDFora backend."
          />

          <InfoCard
            title="Free"
            description="No subscription is required for these tools."
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
