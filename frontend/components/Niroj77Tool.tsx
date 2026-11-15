"use client";

import { usePathname } from "next/navigation";
import BrandMark from "./BrandMark";
import ToolViewAnalytics from "./ToolViewAnalytics";
import { trackConsentAwareEvent } from "../lib/analytics-client";
import ToolSEOContent from "./ToolSEOContent";
import { getPdfToolCopy } from "../lib/i18n/pdf-tool-ui";
import { nepaliToolNames } from "../lib/i18n/pdf-tool-names-ne";
import { nepaliToolGuides } from "../lib/i18n/tool-guides-ne";
import { getNepaliPdfFieldText } from "../lib/i18n/pdf-tool-fields-ne";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

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
  const uploadLimitLabel = endpoint === "/api/images-to-pdf" ? (locale === "ne" ? "सबै तस्बिरको जम्मा आकार अधिकतम ५० MB" : "Combined image upload limit: 50 MB total") : imageUpload ? (locale === "ne" ? "प्रत्येक तस्बिर अधिकतम ५० MB" : "Image files up to 50 MB each") : ui.pdfFilesLimit;
  const homeHref = locale === "en" ? "/" : `/${locale}`;
  const displayTitle = locale === "ne" ? nepaliToolNames[currentSlug] || title : title;
  const displayDescription = locale === "ne" ? nepaliToolGuides[currentSlug]?.purpose || description : description;
  const localizedFormPlaceholder = locale === "ne" ? getNepaliPdfFieldText(formPlaceholder) : formPlaceholder;
  const localizedExtraFields = locale === "ne" ? extraFields.map((field) => ({ ...field, label: getNepaliPdfFieldText(field.label) || field.label, placeholder: getNepaliPdfFieldText(field.placeholder), defaultValue: getNepaliPdfFieldText(field.defaultValue) || field.defaultValue })) : extraFields;
  const [files, setFiles] = useState<File[]>([]);
  const [value, setValue] = useState(queryDefault);
  const [extraValues, setExtraValues] = useState<Record<string, string>>(() => Object.fromEntries(extraFields.map((field) => [field.name, locale === "ne" ? getNepaliPdfFieldText(field.defaultValue) || field.defaultValue || "" : field.defaultValue || ""])));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [localDownloads, setLocalDownloads] = useState<{ url: string; name: string }[]>([]);
  const [dragActive, setDragActive] = useState(false);
  useEffect(() => () => { localDownloads.forEach((item) => URL.revokeObjectURL(item.url)); }, [localDownloads]);
  const browserCommand = (() => {
    switch (endpoint) {
      case "/api/merge": return { type: "merge" } as const;
      case "/api/images-to-pdf": return files.length > 0 && files.every((file) => file.type ? file.type === "image/jpeg" || file.type === "image/png" : /\.(jpe?g|png)$/i.test(file.name)) ? { type: "imagesToPdf" } as const : null;
      case "/api/split": return value.trim() ? { type: "split", pages: value } as const : null;
      case "/api/crop": {
        const margin = Number.parseFloat(value || "36");
        return Number.isFinite(margin) && margin >= 0
          ? { type: "crop", margin, pages: extraValues.pages || "all" } as const : null;
      }
      case "/api/add-blank-pages": {
        const count = Number.parseInt(extraValues.count || "1", 10);
        return Number.isInteger(count) && count >= 1 && count <= 50 ? { type: "addBlankPages", count } as const : null;
      }
      case "/api/sign": return /^[\x20-\x7E]+$/.test(value.trim()) ? { type: "sign", text: value.trim() } as const : null;
      case "/api/page-counter": return { type: "pageCount" } as const;
      case "/api/pdf-info": return { type: "info" } as const;
      case "/api/metadata": return { type: "editMetadata", title: extraValues.title || "", author: extraValues.author || "", subject: extraValues.subject || "", keywords: extraValues.keywords || "" } as const;
      case "/api/remove-metadata": return { type: "removeMetadata" } as const;
      case "/api/flatten": return { type: "flatten" } as const;
      case "/api/remove-annotations": return { type: "removeAnnotations" } as const;
      case "/api/remove-attachments": return { type: "removeAttachments" } as const;
      case "/api/add-background": return Array.from(extraValues.text || "DRAFT").every((char) => char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126) ? { type: "watermark", text: extraValues.text || "DRAFT", opacity: 0.12, color: extraValues.color || "#E5E7EB" } as const : null;
      case "/api/rotate": { const angle = Number(value); return [90, 180, 270].includes(angle) ? { type: "rotate", angle } as const : null; }
      case "/api/rotate-selected-pages": {
        const angle = Number.parseInt(extraValues.degrees || "90", 10);
        const pages = extraValues.pages || "all";
        return [90, 180, 270].includes(angle) && (pages.trim().toLowerCase() === "all" || pages.trim().length > 0)
          ? { type: "rotateSelected", angle, pages } as const : null;
      }
      case "/api/extract-pages": return { type: "extract", pages: value } as const;
      case "/api/delete-pages": return { type: "deletePages", pages: value } as const;
      case "/api/reorder": return { type: "reorder", order: value } as const;
      case "/api/watermark": return /^[\x20-\x7E]+$/.test(value) ? { type: "watermark", text: value } as const : null;
      case "/api/bates-numbering": { const prefix = extraValues.prefix || ""; return Array.from(prefix).every((char) => char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126) ? { type: "addPageNumbers", start: Math.max(1, Number.parseInt(extraValues.start || "1", 10) || 1), format: `${prefix.replace(/%/g, "").slice(0, 24)}%d`, digits: Math.max(1, Math.min(12, Number.parseInt(extraValues.digits || "6", 10) || 6)) } as const : null; }
      case "/api/page-numbers": return {
        type: "addPageNumbers",
        start: Math.max(1, Number.parseInt(extraValues.start_number || "1", 10) || 1),
        position: extraValues.position || "bottom-center",
        skipFirst: extraValues.skip_first === "true",
        fontSize: Math.max(6, Math.min(48, Number.parseInt(extraValues.font_size || "11", 10) || 11)),
      } as const;
      default: return null;
    }
  })();
  const browserOnly = browserCommand !== null;
  const conditionalProcessingNotice = (() => {
    if (endpoint === "/api/images-to-pdf" && files.length === 0) {
      return locale === "ne" ? {
        title: "तस्बिरको ढाँचाअनुसार प्रशोधन",
        description: "JPG/JPEG/PNG ब्राउजरमै प्रशोधन हुन्छन्; WebP फाइल PDFora प्रशोधन सेवामा जान्छन्।",
        where: "JPG/JPEG/PNG फाइल तपाईंको ब्राउजरमै प्रशोधन हुन्छन्। WebP फाइल PDFora को प्रशोधन सेवामा पठाइन्छ।",
        when: "ब्राउजरमा प्रशोधन भएका फाइल पेज बन्द वा रिफ्रेस गर्दा मेमोरीबाट हट्छन्। WebP का अस्थायी फाइल नतिजा पठाएपछि सफा गरिन्छन्; अवरुद्ध अनुरोधका फाइल पछि सफा हुन्छन्।",
        avoid: "संवेदनशील कागजातका लागि JPG/JPEG/PNG ब्राउजरमै राखिन्छन्। WebP प्रयोग गर्दा फाइल सेवा-सर्भरमा पठाइन्छ भन्ने कुरा ध्यान दिनुहोस्।"
      } : {
        title: "Processing depends on image format",
        description: "JPG/JPEG/PNG files are processed locally; WebP files use the PDFora processing service.",
        where: "JPG/JPEG/PNG files are processed in your browser. WebP files are sent to the PDFora processing service.",
        when: "Browser-processed files are released from memory when you close or refresh the page. Temporary WebP service files are cleaned after the result is sent; interrupted-job files are cleaned later.",
        avoid: "JPG/JPEG/PNG files stay on your device. WebP files are sent to the processing service, so avoid WebP for sensitive documents unless you accept that handling."
      };
    }
    if (endpoint === "/api/watermark" && !value.trim()) {
      return locale === "ne" ? {
        title: "वाटरमार्कको text अनुसार प्रशोधन",
        description: "समर्थित ASCII text ब्राउजरमै चल्छ; अन्य text प्रशोधन सेवामा जान सक्छ।",
        where: "साधारण ASCII वाटरमार्क text तपाईंको ब्राउजरमै प्रशोधन हुन्छ। अन्य text PDFora प्रशोधन सेवामा पठाइन्छ।",
        when: "ASCII text को फाइल ब्राउजर मेमोरीमा रहन्छ र पेज बन्द वा रिफ्रेस गर्दा हट्छ। सेवामा पठाइएका अस्थायी फाइल नतिजा पठाएपछि सफा गरिन्छन्।",
        avoid: "संवेदनशील फाइल प्रयोग गर्नुअघि वाटरमार्क text छान्नुहोस् र त्यसपछि देखिने प्रशोधन सूचना पढ्नुहोस्।"
      } : {
        title: "Processing depends on watermark text",
        description: "Supported ASCII text runs locally; other text may use the PDFora processing service.",
        where: "Basic ASCII watermark text is processed in your browser. Other text is sent to the PDFora processing service.",
        when: "For ASCII text, the file remains in browser memory and is released when you close or refresh the page. Service-processed temporary files are cleaned after the result is sent.",
        avoid: "Choose the watermark text first and read the updated processing notice before using a sensitive PDF."
      };
    }
    if (endpoint === "/api/sign" && (!value.trim() || !/^[\x20-\x7E]+$/.test(value.trim()))) {
      return locale === "ne" ? {
        title: "ब्राउजरमै हस्ताक्षर",
        description: "टाइप गरिएको हस्ताक्षरका लागि अंग्रेजी/ASCII अक्षर मात्र प्रयोग गर्नुहोस्। असमर्थित अक्षर फाइल अपलोड हुनुअघि अस्वीकार गरिन्छन्।",
        where: "समर्थित ASCII हस्ताक्षर तपाईंको ब्राउजरमै प्रशोधन हुन्छ। नेपाली वा अन्य असमर्थित अक्षर राखे फाइल सर्भरमा नपठाई अनुरोध रोकिन्छ।",
        when: "समर्थित हस्ताक्षर प्रक्रिया गर्दा फाइल ब्राउजर मेमोरीमा रहन्छ र पेज बन्द वा रिफ्रेस गर्दा हट्छ।",
        avoid: "नेपाली हस्ताक्षर हाल समर्थित छैन। अंग्रेजी/ASCII अक्षर प्रयोग गर्नुहोस्; यो दृश्य हस्ताक्षर हो, प्रमाणपत्रमा आधारित डिजिटल हस्ताक्षर होइन।"
      } : {
        title: "Local typed-signature processing",
        description: "Use basic English/ASCII characters. Unsupported characters are rejected before the PDF is uploaded.",
        where: "Supported typed signatures are processed in your browser. Nepali and other unsupported characters are rejected without sending the PDF to the server.",
        when: "The PDF remains in browser memory during processing and is released when you close or refresh the page.",
        avoid: "Nepali signature text is not currently supported. Use basic English/ASCII characters; this is a visible typed signature, not a certificate-based digital signature."
      };
    }
    return null;
  })();

  const inputRef = useRef<HTMLInputElement>(null);

  function applyFiles(selectedFiles: File[]) {
    const selected = multiple ? selectedFiles : selectedFiles.slice(0, 1);
    const combinedSize = selected.reduce((total, file) => total + file.size, 0);
    if ((endpoint === "/api/images-to-pdf" || browserOnly) && combinedSize > 50 * 1024 * 1024) {
      setFiles([]);
      setMessage(endpoint === "/api/images-to-pdf"
        ? (locale === "ne" ? "सबै छानिएका तस्बिरको जम्मा आकार ५० MB भन्दा बढी हुनु हुँदैन।" : "The combined size of all selected images must not exceed 50 MB.")
        : (locale === "ne" ? "ब्राउजर प्रोसेसिङका लागि जम्मा फाइल आकार ५० MB भित्र राख्नुहोस्।" : "Keep the combined file size under 50 MB for browser processing."));
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (endpoint === "/api/merge" && selected.length > 20) {
      setFiles([]);
      setMessage(locale === "ne" ? "एकपटकमा अधिकतम २० PDF फाइल छान्नुहोस्।" : "Choose no more than 20 PDF files at once.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
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

    if (endpoint === "/api/sign" && !/^[\x20-\x7E]+$/.test(value.trim())) {
      setMessage(locale === "ne" ? "हस्ताक्षरका लागि अंग्रेजी/ASCII अक्षर मात्र प्रयोग गर्नुहोस्। नेपाली अक्षर हाल समर्थित छैनन्; PDF सर्भरमा अपलोड गरिने छैन।" : "Use basic English/ASCII characters for the typed signature. Nepali characters are not supported yet; the PDF will not be uploaded.");
      return;
    }

    trackConsentAwareEvent("tool_start", { tool_slug: currentSlug, tool_category: "pdf", processing_mode: browserOnly ? "browser" : "server" });
    setLocalDownloads([]);
    setLoading(true);
    setMessage(browserOnly ? (locale === "ne" ? "तपाईंको ब्राउजरमै फाइल प्रोसेस हुँदैछ…" : "Processing locally in your browser…") : "");

    try {
      if (browserCommand) {
        const worker = new Worker(new URL("../app/tools/pdfWorker.ts", import.meta.url), { type: "module" });
        const result = await new Promise<{ blob?: Blob; blobs?: { blob: Blob; filename: string }[]; error?: string; warnings?: string[] }>((resolve, reject) => {
          worker.onmessage = (event: MessageEvent<{ blob?: Blob; blobs?: { blob: Blob; filename: string }[]; error?: string; warnings?: string[] }>) => resolve(event.data);
          worker.onerror = () => reject(new Error(locale === "ne" ? "ब्राउजर प्रोसेसिङ सुरु हुन सकेन।" : "Browser processing could not start."));
          worker.postMessage({ cmd: browserCommand, files });
        }).finally(() => worker.terminate());
        if (result.error || (!result.blob && !result.blobs?.length)) throw new Error(result.error || ui.processingFailed);
        const outputs = result.blobs?.length ? result.blobs : result.blob ? [{ blob: result.blob, filename: downloadName }] : [];
        if (outputs.length > 1) {
          setLocalDownloads(outputs.map((item) => ({ url: window.URL.createObjectURL(item.blob), name: item.filename })));
          setMessage(locale === "ne" ? "PDF भागहरू ब्राउजरमै तयार भए। तलबाट प्रत्येक फाइल डाउनलोड गर्नुहोस्।" : "PDF parts were created locally. Download each part below.");
        } else {
          const localUrl = window.URL.createObjectURL(outputs[0].blob);
          const localLink = document.createElement("a");
          localLink.href = localUrl; localLink.download = outputs[0].filename || downloadName;
          document.body.appendChild(localLink); localLink.click(); localLink.remove();
          window.setTimeout(() => window.URL.revokeObjectURL(localUrl), 1000);
          setMessage(locale === "ne" ? "फाइल ब्राउजरमै प्रोसेस भयो; सर्भरमा पठाइएको छैन।" : "Processed locally; your file was not uploaded.");
        }
        trackConsentAwareEvent("tool_complete", { tool_slug: currentSlug, tool_category: "pdf", processing_mode: "browser" });
        setFiles([]); if (inputRef.current) inputRef.current.value = "";
        return;
      }
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
      trackConsentAwareEvent("tool_complete", { tool_slug: currentSlug, tool_category: "pdf", processing_mode: "server" });
    } catch (error) {
      trackConsentAwareEvent("tool_error", { tool_slug: currentSlug, tool_category: "pdf", processing_mode: browserOnly ? "browser" : "server" });
      console.error(error);

      const timedOut =
        error instanceof DOMException &&
        (error.name === "TimeoutError" || error.name === "AbortError");
      setMessage(
        timedOut
          ? ui.serverTimeout
          : locale === "ne"
            ? ui.processingFailed
            : error instanceof Error
              ? error.message
              : ui.couldNotProcess
      );
    } finally {
      setLoading(false);
    }
  }

  const success =
    message === ui.completed || (browserOnly && (message.startsWith("फाइल ब्राउजरमै") || message.startsWith("Processed locally") || message.startsWith("PDF parts were created locally") || message.startsWith("PDF भागहरू ब्राउजरमै")));

  return (
    <div className="pdfora-workspace min-h-screen text-slate-950">
      <ToolViewAnalytics toolSlug={currentSlug} toolCategory="PDF" />
      {/* Header */}
      <header className="pdfora-workspace-header sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 shadow-[0_8px_30px_rgba(15,23,42,.04)] backdrop-blur-xl">
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
      <section className="pdfora-workspace-content mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-14">
        {/* Heading */}
        <div className="pdfora-workspace-hero text-center">
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
        <div className="pdfora-tool-card mt-8 rounded-[2rem] border border-white/80 bg-white/90 p-4 shadow-[0_24px_80px_rgba(15,23,42,.09)] ring-1 ring-slate-900/[0.03] backdrop-blur sm:mt-10 sm:p-8">
          {/* Upload Area */}
          <button
            type="button"
            onClick={chooseFiles}
            onDragOver={(event) => { event.preventDefault(); if (!loading) setDragActive(true); }}
            onDragLeave={(event) => { event.preventDefault(); setDragActive(false); }}
            onDrop={handleDrop}
            aria-label={ui.chooseFilesAria}
            className={`pdfora-dropzone flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 text-center transition active:scale-[0.99] sm:min-h-64 ${dragActive ? "border-teal-500 bg-teal-50" : "border-slate-300 bg-slate-50/80 hover:border-teal-400 hover:bg-teal-50"}`}
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
            aria-label={locale === "ne" ? "PDF फाइल छान्नुहोस्" : "Choose PDF files"}
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
                  localizedFormPlaceholder || ui.enterValue
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
            className="pdfora-primary-action mt-5 flex min-h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-700 px-5 text-sm font-black text-white shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-900/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                {ui.processing}
              </span>
            ) : (
              displayTitle
            )}
          </button>

          {/* Message */}
          {localDownloads.length > 0 && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4" aria-label={locale === "ne" ? "डाउनलोड फाइलहरू" : "Download files"}>
              <p className="mb-3 text-sm font-bold text-emerald-900">{locale === "ne" ? "तयार भएका PDF फाइलहरू" : "Created PDF files"}</p>
              <ul className="space-y-2">
                {localDownloads.map((item) => <li key={item.name}><a className="inline-flex min-h-11 items-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-emerald-800 underline" href={item.url} download={item.name}>{item.name}</a></li>)}
              </ul>
            </div>
          )}
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
            icon={conditionalProcessingNotice ? "ℹ️" : browserOnly ? "🛡️" : "🔒"}
            title={conditionalProcessingNotice?.title ?? (browserOnly ? (locale === "ne" ? "ब्राउजरमै सुरक्षित" : "Local browser processing") : ui.private)}
            description={conditionalProcessingNotice?.description ?? (browserOnly
              ? (locale === "ne" ? "फाइल तपाईंको डिभाइसबाट बाहिर पठाइँदैन।" : "Selected files stay on your device during processing.")
              : ui.privateDescription)}
          />

          <InfoCard
            icon="📱"
            title={ui.mobileReady}
            description={ui.mobileDescription}
          />
        </div>
        {locale === "ne" ? (
        <section className="pdfora-trust-panel mt-6 rounded-3xl border p-5 sm:p-7" aria-labelledby="pdfora-trust-title">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pdfora-trust-icon" aria-hidden="true">{conditionalProcessingNotice ? "ℹ️" : browserOnly ? "🛡️" : "🔐"}</span>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-800">PDFora गोपनीयता जानकारी</p>
            {browserOnly && <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">ब्राउजरमै चल्ने</span>}
          </div>
          <h2 id="pdfora-trust-title" className="mt-3 text-xl font-black tracking-tight sm:text-2xl">तपाईंको फाइल कसरी ह्यान्डल हुन्छ?</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="pdfora-trust-detail"><h3>फाइल कहाँ जान्छ?</h3><p>{conditionalProcessingNotice?.where ?? (browserOnly ? "यो टुलको फाइल प्रोसेसिङ तपाईंको आफ्नै ब्राउजरमा हुन्छ। फाइल PDFora को प्रोसेसिङ सर्भरमा पठाइँदैन।" : "प्रक्रिया सुरु गर्दा फाइल अनुरोध पूरा गर्न PDFora को प्रोसेसिङ सर्भरमा पठाइन्छ। यो टुल पूर्ण रूपमा तपाईंको ब्राउजरभित्र मात्र चल्दैन।")}</p></div>
            <div className="pdfora-trust-detail"><h3>कहिले हटाइन्छ?</h3><p>{conditionalProcessingNotice?.when ?? (browserOnly ? "फाइल ब्राउजर मेमोरीमा रहन्छ र पेज बन्द वा रिफ्रेस गर्दा हट्छ। डाउनलोड गरिएको नतिजा तपाईंको डिभाइसमा रहन्छ।" : "सामान्य अवस्थामा नतिजा पठाइसकेपछि अनुरोधका अस्थायी फाइलहरू सफा गरिन्छन्। अनुरोध बीचमै अवरुद्ध भए बाँकी फाइलहरू अर्को प्रोसेसिङ अनुरोधमा ६ घण्टाभन्दा पुराना भेटिएपछि सफा गरिन्छन्।")}</p></div>
            <div className="pdfora-trust-detail"><h3>स्थायी फाइल इतिहास राखिन्छ?</h3><p>PDFora मा प्रयोगकर्ताको स्थायी फाइल लाइब्रेरी वा अकाउन्टमा आधारित फाइल इतिहास छैन। डाउनलोड गरिएको नतिजा आफ्नै डिभाइसमा सुरक्षित राख्नुहोस्।</p></div>
            <div className="pdfora-trust-detail"><h3>कस्तो फाइल अपलोड नगर्ने?</h3><p>{conditionalProcessingNotice?.avoid ?? (browserOnly ? "यो टुलले फाइल सर्भरमा अपलोड गर्दैन। साझा डिभाइसमा डाउनलोड भएको नतिजा खुला नराख्नुहोस्।" : "इन्टरनेटमार्फत होस्ट गरिएको सर्भरमा प्रोसेस गर्न नचाहने अत्यन्त संवेदनशील कागजात अपलोड नगर्नुहोस्। इन्टरनेट प्रसारण वा सर्भर प्रणालीलाई शतप्रतिशत जोखिमरहित भन्न सकिँदैन।")}</p></div>
          </div>
          <a className="pdfora-trust-link mt-5 inline-flex items-center gap-2 text-sm font-bold" href="/ne/privacy">विस्तृत गोपनीयता नीति पढ्नुहोस् <span aria-hidden="true">↗</span></a>
        </section>

        ) : (
        <section className="pdfora-trust-panel mt-6 rounded-3xl border p-5 sm:p-7" aria-labelledby="pdfora-trust-title">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pdfora-trust-icon" aria-hidden="true">{conditionalProcessingNotice ? "ℹ️" : browserOnly ? "🛡️" : "🔐"}</span>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-800">PDFora privacy details</p>
            {browserOnly && <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">Runs in your browser</span>}
          </div>
          <h2 id="pdfora-trust-title" className="mt-3 text-xl font-black tracking-tight sm:text-2xl">How your files are handled</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="pdfora-trust-detail"><h3>Where does my file go?</h3><p>{conditionalProcessingNotice?.where ?? (browserOnly ? "This tool processes your file locally in your browser. The file is not sent to the PDFora processing server." : "When you start processing, your file is sent to the PDFora processing server to complete your request. This tool does not run entirely inside your browser.")}</p></div>
            <div className="pdfora-trust-detail"><h3>When is it deleted?</h3><p>{conditionalProcessingNotice?.when ?? (browserOnly ? "Files remain in browser memory during processing and are released when you close or refresh the page. The downloaded result remains on your device." : "Under normal operation, temporary request files are cleaned up after the result has been sent. If a request is interrupted, leftover files are cleaned when a later processing request finds them more than six hours old.")}</p></div>
            <div className="pdfora-trust-detail"><h3>Is a permanent file history kept?</h3><p>PDFora does not provide a permanent user file library or account-based file history. Save your downloaded result on your own device.</p></div>
            <div className="pdfora-trust-detail"><h3>What should I avoid uploading?</h3><p>{conditionalProcessingNotice?.avoid ?? (browserOnly ? "This tool does not upload files to a server. Avoid leaving downloaded results on shared devices." : "Do not upload highly sensitive documents that you are not comfortable processing on an internet-hosted server. No internet transmission or server system can be described as completely risk-free.")}</p></div>
          </div>
          <a className="pdfora-trust-link mt-5 inline-flex items-center gap-2 text-sm font-bold" href="/privacy">Read the full Privacy Policy <span aria-hidden="true">↗</span></a>
        </section>

        )}
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