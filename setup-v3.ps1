$ErrorActionPreference = "Stop"

$ROOT = "C:\Users\Asus\PDFora"
$BACKEND = "$ROOT\backend"
$FRONTEND = "$ROOT\frontend"

Write-Host ""
Write-Host "========================================="
Write-Host "        PDFora v3 COMPLETE SETUP"
Write-Host "========================================="
Write-Host ""

# --------------------------------------------------
# CREATE DIRECTORIES
# --------------------------------------------------

New-Item -ItemType Directory -Force -Path $BACKEND | Out-Null
New-Item -ItemType Directory -Force -Path "$FRONTEND\app" | Out-Null

# --------------------------------------------------
# PYTHON VIRTUAL ENVIRONMENT
# --------------------------------------------------

Set-Location $BACKEND

if (!(Test-Path ".\.venv\Scripts\python.exe")) {
    Write-Host "Creating Python virtual environment..."
    python -m venv .venv
}

& ".\.venv\Scripts\python.exe" -m pip install --upgrade pip

# --------------------------------------------------
# PYTHON PACKAGES
# --------------------------------------------------

Write-Host "Installing PDFora packages..."

& ".\.venv\Scripts\python.exe" -m pip install `
    fastapi `
    "uvicorn[standard]" `
    python-multipart `
    pypdf `
    pillow `
    pymupdf

# --------------------------------------------------
# REQUIREMENTS.TXT
# --------------------------------------------------

@"
fastapi
uvicorn[standard]
python-multipart
pypdf
pillow
pymupdf
"@ | Set-Content "$BACKEND\requirements.txt" -Encoding UTF8

# --------------------------------------------------
# BACKEND MAIN.PY
# --------------------------------------------------

@'
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader, PdfWriter
from pathlib import Path
from PIL import Image
import fitz
import tempfile
import shutil
import uuid
import io
import os


app = FastAPI(
    title="PDFora API",
    version="3.0.0"
)


# ==================================================
# CORS
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================================================
# SETTINGS
# ==================================================

MAX_FILE_SIZE = 50 * 1024 * 1024

TEMP_DIR = Path(tempfile.gettempdir()) / "pdfora"

TEMP_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ==================================================
# HELPERS
# ==================================================

def create_job():
    job_id = uuid.uuid4().hex

    directory = TEMP_DIR / job_id

    directory.mkdir(
        parents=True,
        exist_ok=True
    )

    return directory


def validate_pdf(filename):
    if not filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected."
        )

    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file."
        )


async def save_upload(file, path):
    size = 0

    with open(path, "wb") as output:

        while True:

            chunk = await file.read(
                1024 * 1024
            )

            if not chunk:
                break

            size += len(chunk)

            if size > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=413,
                    detail="Maximum file size is 50 MB."
                )

            output.write(chunk)

    return size


def read_pdf(path):

    try:
        reader = PdfReader(str(path))

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid or corrupted PDF."
        )

    if reader.is_encrypted:

        try:
            result = reader.decrypt("")

            if result == 0:
                raise HTTPException(
                    status_code=400,
                    detail="Password protected PDF is not supported."
                )

        except HTTPException:
            raise

        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Password protected PDF is not supported."
            )

    if len(reader.pages) == 0:
        raise HTTPException(
            status_code=400,
            detail="PDF contains no pages."
        )

    return reader


def pdf_response(
    path,
    filename
):
    return FileResponse(
        path=str(path),
        media_type="application/pdf",
        filename=filename
    )


# ==================================================
# ROOT
# ==================================================

@app.get("/")
def root():

    return {
        "name": "PDFora",
        "version": "3.0.0",
        "status": "online"
    }


# ==================================================
# HEALTH
# ==================================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# ==================================================
# API INFO
# ==================================================

@app.get("/api")
def api_info():

    return {
        "service": "PDFora",
        "version": "3.0.0",
        "tools": [
            "merge-pdf",
            "split-pdf",
            "compress-pdf",
            "jpg-to-pdf",
            "pdf-to-jpg",
            "rotate-pdf",
            "delete-pages",
            "extract-pages",
            "watermark-pdf"
        ]
    }


# ==================================================
# MERGE PDF
# ==================================================

@app.post("/api/merge")
async def merge_pdf(
    files: list[UploadFile] = File(...)
):

    if len(files) < 2:
        raise HTTPException(
            status_code=400,
            detail="Select at least 2 PDF files."
        )

    job = create_job()

    output = job / "PDFora-Merged.pdf"

    writer = PdfWriter()

    try:

        for index, file in enumerate(files):

            validate_pdf(
                file.filename
            )

            input_file = job / f"{index}.pdf"

            await save_upload(
                file,
                input_file
            )

            reader = read_pdf(
                input_file
            )

            for page in reader.pages:
                writer.add_page(page)

        with open(output, "wb") as f:
            writer.write(f)

        return pdf_response(
            output,
            "PDFora-Merged.pdf"
        )

    finally:

        for file in files:

            try:
                await file.close()
            except Exception:
                pass


# ==================================================
# SPLIT PDF
# ==================================================

@app.post("/api/split")
async def split_pdf(
    file: UploadFile = File(...),
    start_page: int = 1,
    end_page: int | None = None
):

    validate_pdf(
        file.filename
    )

    job = create_job()

    input_file = job / "input.pdf"

    output = job / "PDFora-Split.pdf"

    try:

        await save_upload(
            file,
            input_file
        )

        reader = read_pdf(
            input_file
        )

        total = len(reader.pages)

        if end_page is None:
            end_page = total

        if start_page < 1:
            raise HTTPException(
                status_code=400,
                detail="Start page must be 1 or greater."
            )

        if end_page > total:
            raise HTTPException(
                status_code=400,
                detail=f"End page cannot exceed {total}."
            )

        if start_page > end_page:
            raise HTTPException(
                status_code=400,
                detail="Start page cannot exceed end page."
            )

        writer = PdfWriter()

        for number in range(
            start_page - 1,
            end_page
        ):
            writer.add_page(
                reader.pages[number]
            )

        with open(output, "wb") as f:
            writer.write(f)

        return pdf_response(
            output,
            "PDFora-Split.pdf"
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass


# ==================================================
# COMPRESS PDF
# ==================================================

@app.post("/api/compress")
async def compress_pdf(
    file: UploadFile = File(...)
):

    validate_pdf(
        file.filename
    )

    job = create_job()

    input_file = job / "input.pdf"

    output = job / "PDFora-Compressed.pdf"

    try:

        original_size = await save_upload(
            file,
            input_file
        )

        reader = read_pdf(
            input_file
        )

        writer = PdfWriter()

        for page in reader.pages:

            try:
                page.compress_content_streams()
            except Exception:
                pass

            writer.add_page(page)

        with open(output, "wb") as f:
            writer.write(f)

        compressed_size = output.stat().st_size

        return FileResponse(
            path=str(output),
            media_type="application/pdf",
            filename="PDFora-Compressed.pdf",
            headers={
                "X-Original-Size": str(original_size),
                "X-Compressed-Size": str(compressed_size)
            }
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass


# ==================================================
# JPG / PNG -> PDF
# ==================================================

@app.post("/api/images-to-pdf")
async def images_to_pdf(
    files: list[UploadFile] = File(...)
):

    if not files:
        raise HTTPException(
            status_code=400,
            detail="Select at least one image."
        )

    job = create_job()

    output = job / "PDFora-Images.pdf"

    images = []

    try:

        for index, file in enumerate(files):

            data = await file.read()

            if len(data) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=413,
                    detail="Image is larger than 50 MB."
                )

            try:
                image = Image.open(
                    io.BytesIO(data)
                )

                image = image.convert("RGB")

                images.append(image)

            except Exception:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid image: {file.filename}"
                )

        if not images:
            raise HTTPException(
                status_code=400,
                detail="No valid images."
            )

        first = images[0]

        remaining = images[1:]

        first.save(
            output,
            "PDF",
            resolution=100.0,
            save_all=True,
            append_images=remaining
        )

        return pdf_response(
            output,
            "PDFora-Images.pdf"
        )

    finally:

        for file in files:

            try:
                await file.close()
            except Exception:
                pass


# ==================================================
# PDF -> JPG
# ==================================================

@app.post("/api/pdf-to-jpg")
async def pdf_to_jpg(
    file: UploadFile = File(...)
):

    validate_pdf(
        file.filename
    )

    job = create_job()

    input_file = job / "input.pdf"

    zip_file = job / "PDFora-JPG.zip"

    try:

        await save_upload(
            file,
            input_file
        )

        document = fitz.open(
            str(input_file)
        )

        import zipfile

        with zipfile.ZipFile(
            zip_file,
            "w",
            zipfile.ZIP_DEFLATED
        ) as archive:

            for index, page in enumerate(
                document
            ):

                pixmap = page.get_pixmap(
                    matrix=fitz.Matrix(
                        1.5,
                        1.5
                    )
                )

                image_path = job / (
                    f"page-{index + 1}.jpg"
                )

                pixmap.save(
                    str(image_path)
                )

                archive.write(
                    image_path,
                    image_path.name
                )

        document.close()

        return FileResponse(
            path=str(zip_file),
            media_type="application/zip",
            filename="PDFora-JPG.zip"
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass


# ==================================================
# ROTATE PDF
# ==================================================

@app.post("/api/rotate")
async def rotate_pdf(
    file: UploadFile = File(...),
    degrees: int = 90
):

    validate_pdf(
        file.filename
    )

    if degrees not in [90, 180, 270]:
        raise HTTPException(
            status_code=400,
            detail="Rotation must be 90, 180 or 270 degrees."
        )

    job = create_job()

    input_file = job / "input.pdf"

    output = job / "PDFora-Rotated.pdf"

    try:

        await save_upload(
            file,
            input_file
        )

        reader = read_pdf(
            input_file
        )

        writer = PdfWriter()

        for page in reader.pages:

            page.rotate(
                degrees
            )

            writer.add_page(
                page
            )

        with open(output, "wb") as f:
            writer.write(f)

        return pdf_response(
            output,
            "PDFora-Rotated.pdf"
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass


# ==================================================
# DELETE PAGES
# ==================================================

@app.post("/api/delete-pages")
async def delete_pages(
    file: UploadFile = File(...),
    pages: str = Form(...)
):

    validate_pdf(
        file.filename
    )

    job = create_job()

    input_file = job / "input.pdf"

    output = job / "PDFora-Deleted-Pages.pdf"

    try:

        await save_upload(
            file,
            input_file
        )

        reader = read_pdf(
            input_file
        )

        try:

            delete_set = {
                int(x.strip())
                for x in pages.split(",")
                if x.strip()
            }

        except Exception:

            raise HTTPException(
                status_code=400,
                detail="Pages must look like: 2,4,7"
            )

        writer = PdfWriter()

        for index, page in enumerate(
            reader.pages,
            start=1
        ):

            if index not in delete_set:
                writer.add_page(page)

        if len(writer.pages) == 0:
            raise HTTPException(
                status_code=400,
                detail="You cannot delete every page."
            )

        with open(output, "wb") as f:
            writer.write(f)

        return pdf_response(
            output,
            "PDFora-Deleted-Pages.pdf"
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass


# ==================================================
# EXTRACT PAGES
# ==================================================

@app.post("/api/extract-pages")
async def extract_pages(
    file: UploadFile = File(...),
    pages: str = Form(...)
):

    validate_pdf(
        file.filename
    )

    job = create_job()

    input_file = job / "input.pdf"

    output = job / "PDFora-Extracted.pdf"

    try:

        await save_upload(
            file,
            input_file
        )

        reader = read_pdf(
            input_file
        )

        try:

            selected = [
                int(x.strip())
                for x in pages.split(",")
                if x.strip()
            ]

        except Exception:

            raise HTTPException(
                status_code=400,
                detail="Pages must look like: 1,3,5"
            )

        writer = PdfWriter()

        for page_number in selected:

            if page_number < 1 or page_number > len(reader.pages):

                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid page number: {page_number}"
                )

            writer.add_page(
                reader.pages[
                    page_number - 1
                ]
            )

        with open(output, "wb") as f:
            writer.write(f)

        return pdf_response(
            output,
            "PDFora-Extracted.pdf"
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass


# ==================================================
# WATERMARK PDF
# ==================================================

@app.post("/api/watermark")
async def watermark_pdf(
    file: UploadFile = File(...),
    text: str = Form(...)
):

    validate_pdf(
        file.filename
    )

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="Watermark text is required."
        )

    job = create_job()

    input_file = job / "input.pdf"

    output = job / "PDFora-Watermarked.pdf"

    watermark_pdf_file = job / "watermark.pdf"

    try:

        await save_upload(
            file,
            input_file
        )

        reader = read_pdf(
            input_file
        )

        # Create watermark PDF with PyMuPDF
        watermark_doc = fitz.open()

        page = watermark_doc.new_page(
            width=595,
            height=842
        )

        page.insert_text(
            (150, 420),
            text,
            fontsize=32,
            rotate=45,
            color=(0.5, 0.5, 0.5),
            fill_opacity=0.25
        )

        watermark_doc.save(
            str(watermark_pdf_file)
        )

        watermark_doc.close()

        watermark_reader = PdfReader(
            str(watermark_pdf_file)
        )

        watermark_page = (
            watermark_reader.pages[0]
        )

        writer = PdfWriter()

        for page in reader.pages:

            page.merge_page(
                watermark_page
            )

            writer.add_page(
                page
            )

        with open(output, "wb") as f:
            writer.write(f)

        return pdf_response(
            output,
            "PDFora-Watermarked.pdf"
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass


# ==================================================
# DELETE OLD TEMP FILES
# ==================================================

@app.post("/api/cleanup")
def cleanup():

    removed = 0

    for directory in TEMP_DIR.iterdir():

        if directory.is_dir():

            try:
                shutil.rmtree(
                    directory
                )

                removed += 1

            except Exception:
                pass

    return {
        "status": "ok",
        "removed_jobs": removed
    }
'@ | Set-Content "$BACKEND\main.py" -Encoding UTF8


# --------------------------------------------------
# CREATE FRONTEND TOOL DIRECTORIES
# --------------------------------------------------

$tools = @(
    "images-to-pdf",
    "pdf-to-jpg",
    "rotate-pdf",
    "delete-pages",
    "extract-pages",
    "watermark"
)

foreach ($tool in $tools) {

    New-Item `
        -ItemType Directory `
        -Force `
        -Path "$FRONTEND\app\$tool" |
        Out-Null
}


# --------------------------------------------------
# FRONTEND GENERIC TOOL COMPONENT
# --------------------------------------------------

$componentDir = "$FRONTEND\components"

New-Item `
    -ItemType Directory `
    -Force `
    -Path $componentDir |
    Out-Null


@'
"use client";

import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

type Props = {
  endpoint: string;
  title: string;
  description: string;
  multiple?: boolean;
  fieldName?: string;
  extraField?: string;
  extraPlaceholder?: string;
  downloadName: string;
};

export default function PDForaTool({
  endpoint,
  title,
  description,
  multiple = false,
  fieldName = "file",
  extraField,
  extraPlaceholder,
  downloadName,
}: Props) {

  const [files, setFiles] = useState<File[]>([]);
  const [extra, setExtra] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function process() {

    if (files.length === 0) {
      setMessage("Please select a file.");
      return;
    }

    if (extraField && !extra.trim()) {
      setMessage("Please enter the required information.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const form = new FormData();

      if (multiple) {

        for (const file of files) {
          form.append("files", file);
        }

      } else {

        form.append(
          fieldName,
          files[0]
        );

      }

      if (extraField) {
        form.append(
          extraField,
          extra
        );
      }

      const response = await fetch(
        `${API_URL}${endpoint}`,
        {
          method: "POST",
          body: form,
        }
      );

      if (!response.ok) {

        const error =
          await response.text();

        throw new Error(
          error || "Processing failed."
        );
      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;
      link.download = downloadName;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      setMessage(
        "Done. Download started."
      );

    } catch (error) {

      console.error(error);

      setMessage(
        "Processing failed. Make sure PDFora backend is running."
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">

      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">

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

      <section className="mx-auto max-w-3xl px-5 py-16">

        <div className="text-center">

          <p className="text-sm font-bold text-blue-600">
            PDFora TOOL
          </p>

          <h1 className="mt-2 text-4xl font-black">
            {title}
          </h1>

          <p className="mt-4 text-slate-600">
            {description}
          </p>

        </div>

        <div className="mt-10 rounded-3xl border bg-white p-6 shadow-sm">

          <label
            htmlFor="file"
            className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-slate-50 p-6 text-center"
          >

            <div className="text-5xl">
              📄
            </div>

            <h2 className="mt-4 font-black">
              Choose {multiple ? "files" : "a file"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Maximum 50 MB per file
            </p>

            <span className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">
              Select File
            </span>

            <input
              id="file"
              type="file"
              multiple={multiple}
              onChange={(event) => {
                setFiles(
                  Array.from(
                    event.target.files || []
                  )
                );
                setMessage("");
              }}
              className="hidden"
            />

          </label>

          {files.length > 0 && (

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">

              {files.map(
                (file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex justify-between border-b py-2 last:border-0"
                  >

                    <span className="truncate text-sm font-bold">
                      {file.name}
                    </span>

                    <span className="ml-4 text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>

                  </div>
                )
              )}

            </div>

          )}

          {extraField && (

            <input
              value={extra}
              onChange={(event) =>
                setExtra(event.target.value)
              }
              placeholder={
                extraPlaceholder ||
                "Enter value"
              }
              className="mt-5 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
            />

          )}

          <button
            onClick={process}
            disabled={loading}
            className="mt-5 w-full rounded-2xl bg-blue-600 px-5 py-4 font-black text-white disabled:bg-slate-300"
          >
            {loading
              ? "Processing..."
              : `Process ${title}`}
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
'@ | Set-Content "$componentDir\PDForaTool.tsx" -Encoding UTF8


# --------------------------------------------------
# TOOL PAGES
# --------------------------------------------------

@'
"use client";

import PDForaTool from "@/components/PDForaTool";

export default function Page() {
  return (
    <PDForaTool
      endpoint="/api/images-to-pdf"
      title="Images to PDF"
      description="Convert JPG and PNG images into one PDF."
      multiple
      downloadName="PDFora-Images.pdf"
    />
  );
}
'@ | Set-Content "$FRONTEND\app\images-to-pdf\page.tsx" -Encoding UTF8


@'
"use client";

import PDForaTool from "@/components/PDForaTool";

export default function Page() {
  return (
    <PDForaTool
      endpoint="/api/pdf-to-jpg"
      title="PDF to JPG"
      description="Convert PDF pages into JPG images."
      downloadName="PDFora-JPG.zip"
    />
  );
}
'@ | Set-Content "$FRONTEND\app\pdf-to-jpg\page.tsx" -Encoding UTF8


@'
"use client";

import PDForaTool from "@/components/PDForaTool";

export default function Page() {
  return (
    <PDForaTool
      endpoint="/api/rotate"
      title="Rotate PDF"
      description="Rotate every page of a PDF."
      extraField="degrees"
      extraPlaceholder="Rotation: 90, 180 or 270"
      downloadName="PDFora-Rotated.pdf"
    />
  );
}
'@ | Set-Content "$FRONTEND\app\rotate-pdf\page.tsx" -Encoding UTF8


@'
"use client";

import PDForaTool from "@/components/PDForaTool";

export default function Page() {
  return (
    <PDForaTool
      endpoint="/api/delete-pages"
      title="Delete PDF Pages"
      description="Remove selected pages from your PDF."
      extraField="pages"
      extraPlaceholder="Pages to delete: 2,4,7"
      downloadName="PDFora-Deleted-Pages.pdf"
    />
  );
}
'@ | Set-Content "$FRONTEND\app\delete-pages\page.tsx" -Encoding UTF8


@'
"use client";

import PDForaTool from "@/components/PDForaTool";

export default function Page() {
  return (
    <PDForaTool
      endpoint="/api/extract-pages"
      title="Extract PDF Pages"
      description="Extract selected pages into a new PDF."
      extraField="pages"
      extraPlaceholder="Pages to extract: 1,3,5"
      downloadName="PDFora-Extracted.pdf"
    />
  );
}
'@ | Set-Content "$FRONTEND\app\extract-pages\page.tsx" -Encoding UTF8


@'
"use client";

import PDForaTool from "@/components/PDForaTool";

export default function Page() {
  return (
    <PDForaTool
      endpoint="/api/watermark"
      title="Watermark PDF"
      description="Add a text watermark to every PDF page."
      extraField="text"
      extraPlaceholder="Enter watermark text"
      downloadName="PDFora-Watermarked.pdf"
    />
  );
}
'@ | Set-Content "$FRONTEND\app\watermark\page.tsx" -Encoding UTF8


# --------------------------------------------------
# CHECK BACKEND
# --------------------------------------------------

Write-Host ""
Write-Host "Checking backend..."
Write-Host ""

& ".\.venv\Scripts\python.exe" -m py_compile "$BACKEND\main.py"

Write-Host ""
Write-Host "========================================="
Write-Host " PDFora v3 SETUP COMPLETE"
Write-Host "========================================="
Write-Host ""

Write-Host "Backend:"
Write-Host "  C:\Users\Asus\PDFora\backend"

Write-Host ""
Write-Host "Frontend:"
Write-Host "  C:\Users\Asus\PDFora\frontend"

Write-Host ""
Write-Host "Available API tools:"
Write-Host "  Merge PDF"
Write-Host "  Split PDF"
Write-Host "  Compress PDF"
Write-Host "  Images to PDF"
Write-Host "  PDF to JPG"
Write-Host "  Rotate PDF"
Write-Host "  Delete Pages"
Write-Host "  Extract Pages"
Write-Host "  Watermark PDF"

Write-Host ""
Write-Host "Start backend with:"
Write-Host "  cd C:\Users\Asus\PDFora\backend"
Write-Host "  .\.venv\Scripts\Activate.ps1"
Write-Host "  python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

Write-Host ""
Write-Host "Start frontend separately with:"
Write-Host "  cd C:\Users\Asus\PDFora\frontend"
Write-Host "  npm run dev"

Write-Host ""
Write-Host "========================================="