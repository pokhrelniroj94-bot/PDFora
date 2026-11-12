"use client";

import { usePathname } from "next/navigation";
import BrandMark from "./BrandMark";
import ToolSEOContent from "./ToolSEOContent";
import { getPdfToolCopy } from "../lib/i18n/pdf-tool-ui";
import { nepaliToolNames } from "../lib/i18n/pdf-tool-names-ne";
import { nepaliToolGuides } from "../lib/i18n/tool-guides-ne";
import { getNepaliPdfFieldText } from "../lib/i18n/pdf-tool-fields-ne";

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
  extraFields?: { name: string; label: string; placeholder?: string; defaultValue?: string; multiline?: boolean }[];
  showSeoContent?: boolean;
};

export default function NirojToolsTool({
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
  extraFields = [],
  showSeoContent = true,
}: Props) {
  const pathname = usePathname();
  const currentSlug = pathname.split("/").filter(Boolean).pop() ?? "";
  const ui = getPdfToolCopy(pathname);
  const localeSegment = pathname.split("/").filter(Boolean)[0] ?? "en";
  const locale = ["ne", "hi", "es", "fr", "de", "ar", "zh", "ja", "ko"].includes(localeSegment) ? localeSegment : "en";
  const imageUpload = accept.includes("image/");
  const chooseDropLabel = imageUpload ? (locale === "ne" ? "तस्बिर फाइल छान्नुहोस् वा यहाँ छोड्नुहोस्" : "Choose or drop image files") : (multiple ? ui.chooseDropMultiple : ui.chooseDropSingle);
  const uploadLimitLabel = imageUpload ? (locale === "ne" ? "प्रत्येक तस्बिर अधिकतम ५० MB" : "Image files up to 50 MB each") : ui.pdfFilesLimit;
  const homeHref = locale === "en" ? "/" : `/${locale}`;
  const displayTitle = locale === "ne" ? nepaliToolNames[currentSlug] || title : title;
  const displayDescription = locale === "ne" ? nepaliToolGuides[currentSlug]?.purpose || description : description;
  const localizedFormPlaceholder = locale === "ne" ? getNepaliPdfFieldText(formPlaceholder) : formPlaceholder;
  const localizedExtraFields = locale === "ne" ? extraFields.map((field) => ({ ...field, label: getNepaliPdfFieldText(field.label) || field.label, placeholder: getNepaliPdfFieldText(field.placeholder) })) : extraFields;
  const [files, setFiles] = useState<File[]>([]);
  const [value, setValue] = useState(queryDefault);
  const [extraValues, setExtraValues] = useState<Record<string, string>>(() => Object.fromEntries(extraFields.map((field) => [field.name, locale === "ne" ? getNepaliPdfFieldText(field.defaultValue) || field.defaultValue || "" : field.defaultValue || ""])));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  function applyFiles(selectedFiles: File[]) {
    const selected = multiple ? selectedFiles : selectedFiles.slice(0, 1);
    const invalidImage = imageUpload && selected.find((file) =>
      file.type
        ? !["image/jpeg", "image/png", "image/webp"].includes(file.type)
        : !/\.(jpe?g|png|webp)$/i.test(file.name)
    );
    if (invalidImage) {
      setFiles([]);
      setMessage(locale === "ne" ? "JPG, JPEG, PNG वा WebP तस्बिर मात्र छान्नुहोस्।" : "Choose JPG, JPEG, PNG or WebP image files only.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    const oversized = selected.find((file) => file.size > 50 * 1024 * 1024);
    if (oversized) {
      setFiles([]);
      setMessage(ui.maxSizeError.replace("{name}", oversized.name));
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
      setMessage(ui.selectFile);
      return;
    }

    if ((formField || queryField) && !value.trim() && endpoint !== "/api/header-footer") {
      setMessage(ui.requiredInfo);
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
      for (const field of extraFields) {
        formData.append(field.name, extraValues[field.name] || "");
      }

      const url = new URL(`${API_URL}${endpoint}`);

      if (queryField) {
        url.searchParams.set(queryField, value);
      }

      const response = await fetch(url.toString(), {
        method: "POST",
        body: formData,
        // Avoid an indefinitely hanging request while allowing Render to wake from idle.
        signal: AbortSignal.timeout(180_000),
      });

      if (!response.ok) {
        const text = await response.text();

        let errorMessage = ui.processingFailed;

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
      setMessage(ui.completed);
    } catch (error) {
      console.error(error);

      const timedOut =
        error instanceof DOMException &&
        (error.name === "TimeoutError" || error.name === "AbortError");
      setMessage(
        timedOut
          ? ui.serverTimeout
          : error instanceof Error
            ? error.message
            : ui.couldNotProcess
      );
    } finally {
      setLoading(false);
    }
  }

  const success =
    message === ui.completed;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(20,184,166,.10),_transparent_42%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] text-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 shadow-[0_8px_30px_rgba(15,23,42,.04)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a
            href={homeHref}
            className="flex min-h-11 items-center gap-2"
          >
            <BrandMark size={38} />
            <span className="text-xl font-black tracking-tight">
              <span className="text-slate-950">PDF</span><span className="text-teal-700">ora</span>
            </span>
          </a>

          <a
            href="/"
            className="flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold transition hover:bg-slate-50"
          >
            <span className="hidden sm:inline">
              ← {ui.allTools}
            </span>

            <span className="sm:hidden">
              ← {ui.back}
            </span>
          </a>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-16">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-widest text-teal-700">
            {ui.toolLabel}
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
            {displayTitle}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            {displayDescription}
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
            aria-label={ui.chooseFilesAria}
            className={`flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 text-center transition active:scale-[0.99] sm:min-h-64 ${dragActive ? "border-teal-500 bg-teal-50" : "border-slate-300 bg-slate-50/80 hover:border-teal-400 hover:bg-teal-50"}`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-100 text-3xl ring-1 ring-teal-900/5">
              {imageUpload ? "🖼️" : "📄"}
            </div>

            <h2 className="mt-4 text-base font-black sm:text-lg">
              {files.length > 0
                ? `${files.length} ${ui.filesSelected}`
                : chooseDropLabel}
            </h2>

            <p className="mt-2 text-xs text-slate-500 sm:text-sm">
              {uploadLimitLabel}
            </p>

            <span className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-gradient-to-r from-teal-600 to-cyan-700 px-5 text-sm font-bold text-white shadow-md shadow-teal-900/15">
              {ui.chooseFile}
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
                  {ui.selectedFiles}
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
                      aria-label={`${ui.removeFile} ${file.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extra inputs */}
          {(formField || queryField) && (
            <div className="mt-4">
              <label htmlFor="pdf-form-field" className="mb-2 block text-sm font-bold">
                {queryField === "degrees"
                  ? ui.rotationAngle
                  : localizedFormPlaceholder || ui.enterValue}
              </label>

              <input
                id="pdf-form-field"
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
                  formPlaceholder || ui.enterValue
                }
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </div>
          )}

          {localizedExtraFields.map((field) => (
            <div key={field.name} className="mt-4">
              <label className="mb-2 block text-sm font-bold" htmlFor={field.name}>{field.label}</label>
              {field.multiline ? (
                <textarea id={field.name} value={extraValues[field.name] || ""} onChange={(event) => setExtraValues((current) => ({ ...current, [field.name]: event.target.value }))} placeholder={field.placeholder || field.label} rows={5} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100" />
              ) : (
                <input id={field.name} value={extraValues[field.name] || ""} onChange={(event) => setExtraValues((current) => ({ ...current, [field.name]: event.target.value }))} placeholder={field.placeholder || field.label} className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100" />
              )}
            </div>
          ))}

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
                {ui.processing}
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
            title={ui.easy}
            description={ui.easyDescription}
          />

          <InfoCard
            icon="🔒"
            title={ui.private}
            description={ui.privateDescription}
          />

          <InfoCard
            icon="📱"
            title={ui.mobileReady}
            description={ui.mobileDescription}
          />
        </div>
      </section>
      {showSeoContent && <ToolSEOContent slug={currentSlug} locale={locale} />}
    </div>
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