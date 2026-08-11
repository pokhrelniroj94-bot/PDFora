"use client";

import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export default function CompressPDFPage() {

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function compressPDF() {

    if (!file) {

      setMessage(
        "Please select a PDF file."
      );

      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          `${API_URL}/api/compress`,
          {
            method: "POST",
            body: formData,
          }
        );

      if (!response.ok) {

        const text =
          await response.text();

        let error =
          "Compression failed.";

        try {

          const data =
            JSON.parse(text);

          if (data?.detail) {
            error =
              data.detail;
          }

        } catch {

          if (text) {
            error =
              text;
          }
        }

        throw new Error(error);
      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href =
        url;

      link.download =
        "PDFora-Compressed.pdf";

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        url
      );

      const original =
        response.headers.get(
          "X-Original-Size"
        );

      const compressed =
        response.headers.get(
          "X-Compressed-Size"
        );

      if (original && compressed) {

        const originalMB =
          Number(original) /
          1024 /
          1024;

        const compressedMB =
          Number(compressed) /
          1024 /
          1024;

        const saved =
          originalMB > 0
            ? Math.max(
                0,
                (
                  (
                    originalMB -
                    compressedMB
                  ) /
                  originalMB
                ) *
                100
              )
            : 0;

        setMessage(
          `Compression complete: ${originalMB.toFixed(
            2
          )} MB → ${compressedMB.toFixed(
            2
          )} MB. Saved approximately ${saved.toFixed(
            1
          )}%.`
        );

      } else {

        setMessage(
          "PDF compressed successfully."
        );
      }

    } catch (error) {

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not compress PDF."
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <main className="min-h-screen bg-slate-50 text-slate-950">

      <header className="border-b bg-white">

        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">

          <a
            href="/"
            className="text-xl font-black"
          >
            PDF<span className="text-blue-600">
              ora
            </span>
          </a>

          <a
            href="/"
            className="rounded-xl border px-4 py-2 text-sm font-bold"
          >
            ← All Tools
          </a>

        </div>

      </header>

      <section className="mx-auto max-w-4xl px-4 py-14">

        <div className="text-center">

          <p className="text-sm font-bold text-blue-600">
            OPTIMIZE PDF
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Compress PDF
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Reduce PDF file size while keeping the document usable.
          </p>

        </div>

        <div className="mt-10 rounded-3xl border bg-white p-6 shadow-sm">

          <label
            htmlFor="compress-file"
            className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-slate-50 p-6 text-center"
          >

            <div className="text-5xl">
              🗜️
            </div>

            <h2 className="mt-4 font-black">
              {file
                ? file.name
                : "Choose PDF"}
            </h2>

            <span className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">
              Select PDF
            </span>

            <input
              id="compress-file"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => {
                setFile(
                  event.target.files?.[0] ||
                  null
                );
                setMessage("");
              }}
              className="hidden"
            />

          </label>

          <button
            onClick={compressPDF}
            disabled={
              loading ||
              !file
            }
            className="mt-6 w-full rounded-2xl bg-blue-600 px-5 py-4 font-black text-white disabled:bg-slate-300"
          >
            {loading
              ? "Compressing..."
              : "Compress PDF"}
          </button>

          {message && (

            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-center text-sm font-semibold">
              {message}
            </div>

          )}

        </div>

      </section>

    </main>
  );
}
