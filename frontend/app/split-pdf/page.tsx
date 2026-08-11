"use client";

import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export default function SplitPDFPage() {

  const [file, setFile] =
    useState<File | null>(null);

  const [startPage, setStartPage] =
    useState("1");

  const [endPage, setEndPage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function splitPDF() {

    if (!file) {

      setMessage(
        "Please select a PDF file."
      );

      return;
    }

    const start =
      Number(startPage);

    const end =
      endPage.trim()
        ? Number(endPage)
        : undefined;

    if (
      !Number.isInteger(start) ||
      start < 1
    ) {

      setMessage(
        "Start page must be at least 1."
      );

      return;
    }

    if (
      end !== undefined &&
      (
        !Number.isInteger(end) ||
        end < start
      )
    ) {

      setMessage(
        "Please enter a valid end page."
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

      const url =
        new URL(
          `${API_URL}/api/split`
        );

      url.searchParams.set(
        "start_page",
        String(start)
      );

      if (end !== undefined) {

        url.searchParams.set(
          "end_page",
          String(end)
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

        let error =
          "PDF splitting failed.";

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

      const downloadURL =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href =
        downloadURL;

      link.download =
        "PDFora-Split.pdf";

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        downloadURL
      );

      setMessage(
        "PDF split successfully. Download started."
      );

    } catch (error) {

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not split PDF."
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
            ORGANIZE PDF
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Split PDF
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Extract the pages you need from a PDF document.
          </p>

        </div>

        <div className="mt-10 rounded-3xl border bg-white p-6 shadow-sm">

          <label
            htmlFor="split-file"
            className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-slate-50 p-6 text-center"
          >

            <div className="text-5xl">
              📄
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
              id="split-file"
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

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-bold">
                Start page
              </label>

              <input
                type="number"
                min="1"
                value={startPage}
                onChange={(event) =>
                  setStartPage(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-bold">
                End page
              </label>

              <input
                type="number"
                min="1"
                value={endPage}
                onChange={(event) =>
                  setEndPage(
                    event.target.value
                  )
                }
                placeholder="Last page"
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

          </div>

          <button
            onClick={splitPDF}
            disabled={
              loading ||
              !file
            }
            className="mt-6 w-full rounded-2xl bg-blue-600 px-5 py-4 font-black text-white disabled:bg-slate-300"
          >
            {loading
              ? "Splitting..."
              : "Split PDF"}
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
