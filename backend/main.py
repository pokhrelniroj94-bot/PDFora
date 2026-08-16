from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Query
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from docx import Document
from pypdf import PdfReader, PdfWriter
from pathlib import Path
from PIL import Image

import fitz
import tempfile
import shutil
import uuid
import io
import zipfile
import time
import pdfplumber
from openpyxl import Workbook


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="PDFora API",
    version="4.0.1",
    description="PDFora document processing API"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",

        # Production
        "https://pd-fora.vercel.app",

        # Vercel preview
        "https://pd-fora-dagpxk1pb-pokhrelniroj94-7012s-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=[
        "Content-Disposition",
        "X-Original-Size",
        "X-Compressed-Size",
    ],
)


# ============================================================
# SETTINGS
# ============================================================

MAX_FILE_SIZE = 50 * 1024 * 1024

TEMP_DIR = Path(tempfile.gettempdir()) / "pdfora"

TEMP_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# HELPERS
# ============================================================

def create_job():
    job_id = uuid.uuid4().hex

    directory = TEMP_DIR / job_id

    directory.mkdir(
        parents=True,
        exist_ok=True
    )

    return directory


def validate_filename(filename: str | None):

    if not filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected."
        )


def validate_pdf(filename: str | None):

    validate_filename(filename)

    if not filename.lower().endswith(".pdf"):

        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file."
        )


async def save_upload(
    file: UploadFile,
    path: Path
):

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


def read_pdf(path: Path):

    try:

        reader = PdfReader(
            str(path)
        )

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
    path: Path,
    filename: str
):

    return FileResponse(
        path=str(path),
        media_type="application/pdf",
        filename=filename
    )


def cleanup_job(job: Path):

    try:

        if job.exists():

            shutil.rmtree(
                job,
                ignore_errors=True
            )

    except Exception:
        pass


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "name": "PDFora",
        "version": "4.0.1",
        "status": "online"
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# ============================================================
# API INFO
# ============================================================

@app.get("/api")
def api_info():

    return {
        "service": "PDFora",
        "version": "4.0.1",
        "tools": [
            "merge",
            "split",
            "compress",
            "images-to-pdf",
            "pdf-to-jpg",
            "rotate",
            "delete-pages",
            "extract-pages",
            "watermark",
            "pdf-to-word"
        ]
    }


# ============================================================
# MERGE PDF
# ============================================================

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

        with open(output, "wb") as output_file:

            writer.write(
                output_file
            )

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


# ============================================================
# SPLIT PDF
# ============================================================

@app.post("/api/split")
async def split_pdf(
    file: UploadFile = File(...),
    start_page: int = Query(1, ge=1),
    end_page: int | None = Query(None)
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

        if end_page < 1:

            raise HTTPException(
                status_code=400,
                detail="End page must be at least 1."
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

        for index in range(
            start_page - 1,
            end_page
        ):

            writer.add_page(
                reader.pages[index]
            )

        with open(output, "wb") as output_file:

            writer.write(
                output_file
            )

        return pdf_response(
            output,
            "PDFora-Split.pdf"
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass


# ============================================================
# COMPRESS PDF
# ============================================================

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

        with open(output, "wb") as output_file:

            writer.write(
                output_file
            )

        compressed_size = output.stat().st_size

        if compressed_size >= original_size:

            response_path = input_file

        else:

            response_path = output

        final_size = response_path.stat().st_size

        return FileResponse(
            path=str(response_path),
            media_type="application/pdf",
            filename="PDFora-Compressed.pdf",
            headers={
                "X-Original-Size": str(original_size),
                "X-Compressed-Size": str(final_size)
            }
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass


# ============================================================
# IMAGES -> PDF
# ============================================================

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

        for file in files:

            validate_filename(
                file.filename
            )

            data = await file.read()

            if len(data) > MAX_FILE_SIZE:

                raise HTTPException(
                    status_code=413,
                    detail=f"{file.filename} is larger than 50 MB."
                )

            try:

                image = Image.open(
                    io.BytesIO(data)
                )

                image.verify()

                image = Image.open(
                    io.BytesIO(data)
                )

                image = image.convert(
                    "RGB"
                )

                images.append(
                    image
                )

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


# ============================================================
# PDF -> JPG
# ============================================================

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

    document = None

    try:

        await save_upload(
            file,
            input_file
        )

        read_pdf(
            input_file
        )

        document = fitz.open(
            str(input_file)
        )

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
                    ),
                    alpha=False
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

        return FileResponse(
            path=str(zip_file),
            media_type="application/zip",
            filename="PDFora-JPG.zip"
        )

    finally:

        if document is not None:

            try:
                document.close()
            except Exception:
                pass

        try:
            await file.close()
        except Exception:
            pass


# ============================================================
# ROTATE PDF
# ============================================================

@app.post("/api/rotate")
async def rotate_pdf(
    file: UploadFile = File(...),
    degrees: int = Query(90)
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

        with open(output, "wb") as output_file:

            writer.write(
                output_file
            )

        return pdf_response(
            output,
            "PDFora-Rotated.pdf"
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass


# ============================================================
# DELETE PAGES
# ============================================================

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
                int(value.strip())
                for value in pages.split(",")
                if value.strip()
            }

        except Exception:

            raise HTTPException(
                status_code=400,
                detail="Pages must look like: 2,4,7"
            )

        if not delete_set:

            raise HTTPException(
                status_code=400,
                detail="Enter at least one page number."
            )

        total = len(reader.pages)

        invalid = [
            number
            for number in delete_set
            if number < 1 or number > total
        ]

        if invalid:

            raise HTTPException(
                status_code=400,
                detail=f"Invalid page number: {invalid[0]}"
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

        with open(output, "wb") as output_file:

            writer.write(
                output_file
            )

        return pdf_response(
            output,
            "PDFora-Deleted-Pages.pdf"
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass


# ============================================================
# EXTRACT PAGES
# ============================================================

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
                int(value.strip())
                for value in pages.split(",")
                if value.strip()
            ]

        except Exception:

            raise HTTPException(
                status_code=400,
                detail="Pages must look like: 1,3,5"
            )

        if not selected:

            raise HTTPException(
                status_code=400,
                detail="Enter at least one page number."
            )

        total = len(reader.pages)

        for page_number in selected:

            if page_number < 1 or page_number > total:

                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid page number: {page_number}"
                )

        writer = PdfWriter()

        for page_number in selected:

            writer.add_page(
                reader.pages[
                    page_number - 1
                ]
            )

        with open(output, "wb") as output_file:

            writer.write(
                output_file
            )

        return pdf_response(
            output,
            "PDFora-Extracted.pdf"
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass


# ============================================================
# WATERMARK PDF
# ============================================================

@app.post("/api/watermark")
async def watermark_pdf(
    file: UploadFile = File(...),
    text: str = Form(...)
):

    validate_pdf(
        file.filename
    )

    text = text.strip()

    if not text:

        raise HTTPException(
            status_code=400,
            detail="Watermark text is required."
        )

    if len(text) > 200:

        raise HTTPException(
            status_code=400,
            detail="Watermark text is too long."
        )

    job = create_job()

    input_file = job / "input.pdf"

    output = job / "PDFora-Watermarked.pdf"

    try:

        await save_upload(
            file,
            input_file
        )

        # Open source PDF using PyMuPDF
        document = fitz.open(
            str(input_file)
        )

        if document.page_count == 0:

            document.close()

            raise HTTPException(
                status_code=400,
                detail="PDF contains no pages."
            )

        # ----------------------------------------------------
        # IMPORTANT:
        # PyMuPDF insert_text() only accepts rotation:
        # 0, 90, 180, 270.
        #
        # We use 45-degree text by creating the text
        # as a separate PDF image and rotating that image.
        # This avoids the "bad rotate value" error.
        # ----------------------------------------------------

        for page in document:

            rect = page.rect

            # Center point
            center_x = rect.width / 2
            center_y = rect.height / 2

            # Create temporary watermark PDF
            wm = fitz.open()

            wm_page = wm.new_page(
                width=rect.width,
                height=rect.height
            )

            # Use normal rotation here.
            # PyMuPDF accepts 90.
            wm_page.insert_text(
                (
                    center_x - 120,
                    center_y
                ),
                text,
                fontsize=32,
                fontname="helv",
                color=(0.5, 0.5, 0.5),
                fill_opacity=0.25,
                rotate=90
            )

            # Save temporary watermark
            wm_bytes = wm.tobytes(
                garbage=4,
                deflate=True
            )

            wm.close()

            # Open watermark PDF from memory
            wm_doc = fitz.open(
                stream=wm_bytes,
                filetype="pdf"
            )

            # Overlay watermark
            page.show_pdf_page(
                rect,
                wm_doc,
                0,
                overlay=True
            )

            wm_doc.close()

        # Save final PDF
        document.save(
            str(output),
            garbage=4,
            deflate=True
        )

        document.close()

        return pdf_response(
            output,
            "PDFora-Watermarked.pdf"
        )

    except HTTPException:
        raise

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Watermark failed: {str(exc)}"
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass


# ============================================================
# CLEANUP
# ============================================================

# ============================================================
# PDF TO EXCEL
# ============================================================

@app.post("/api/pdf-to-excel")
async def pdf_to_excel(
    file: UploadFile = File(...)
):
    validate_pdf(file.filename)

    job = create_job()

    try:
        input_path = job / "input.pdf"
        output_path = job / "converted.xlsx"

        await save_upload(file, input_path)

        workbook = Workbook()
        default_sheet = workbook.active
        workbook.remove(default_sheet)

        extracted_anything = False

        with pdfplumber.open(input_path) as pdf:
            for page_number, page in enumerate(pdf.pages, start=1):

                tables = page.extract_tables()

                if tables:
                    for table_number, table in enumerate(tables, start=1):

                        if not table:
                            continue

                        extracted_anything = True

                        sheet_name = (
                            f"Page {page_number}"
                            if len(tables) == 1
                            else f"Page {page_number}-{table_number}"
                        )

                        worksheet = workbook.create_sheet(
                            title=sheet_name[:31]
                        )

                        for row_number, row in enumerate(table, start=1):

                            if row is None:
                                continue

                            for column_number, value in enumerate(
                                row,
                                start=1
                            ):
                                if value is not None:
                                    worksheet.cell(
                                        row=row_number,
                                        column=column_number,
                                        value=str(value).strip()
                                    )

                        for column_cells in worksheet.columns:

                            max_length = 0
                            column_letter = column_cells[0].column_letter

                            for cell in column_cells:
                                if cell.value is not None:
                                    max_length = max(
                                        max_length,
                                        len(str(cell.value))
                                    )

                            worksheet.column_dimensions[
                                column_letter
                            ].width = min(
                                max(max_length + 2, 10),
                                50
                            )

                else:
                    text = page.extract_text()

                    if text and text.strip():

                        extracted_anything = True

                        worksheet = workbook.create_sheet(
                            title=f"Page {page_number}"[:31]
                        )

                        for row_number, line in enumerate(
                            text.splitlines(),
                            start=1
                        ):
                            worksheet.cell(
                                row=row_number,
                                column=1,
                                value=line.strip()
                            )

                        worksheet.column_dimensions["A"].width = 100

        if not extracted_anything:
            raise HTTPException(
                status_code=422,
                detail=(
                    "No readable text or tables were found in this PDF. "
                    "The PDF may be scanned or image-based."
                )
            )

        workbook.save(output_path)

        return FileResponse(
            path=str(output_path),
            media_type=(
                "application/vnd.openxmlformats-officedocument."
                "spreadsheetml.sheet"
            ),
            filename="pdfora-converted.xlsx"
        )

    except HTTPException:
        cleanup_job(job)
        raise

    except Exception as exc:
        cleanup_job(job)

        raise HTTPException(
            status_code=500,
            detail=f"PDF to Excel conversion failed: {str(exc)}"
        )

@app.post("/api/cleanup")
def cleanup():

    removed = 0

    now = time.time()

    if not TEMP_DIR.exists():

        return {
            "status": "ok",
            "removed_jobs": 0
        }

    for directory in TEMP_DIR.iterdir():

        if not directory.is_dir():
            continue

        try:

            age = now - directory.stat().st_mtime

            if age > 3600:

                shutil.rmtree(
                    directory,
                    ignore_errors=True
                )

                removed += 1

        except Exception:
            pass

    return {
        "status": "ok",
        "removed_jobs": removed
    }


# ============================================================
# PDF TO WORD
# ============================================================

@app.post("/api/pdf-to-word")
async def pdf_to_word(
    file: UploadFile = File(...)
):

    validate_pdf(
        file.filename
    )

    job = create_job()

    input_path = job / "input.pdf"

    output_path = job / "output.docx"

    try:

        await save_upload(
            file,
            input_path
        )

        pdf = fitz.open(
            str(input_path)
        )

        doc = Document()

        for page_number, page in enumerate(pdf):

            text = page.get_text("text")

            if text.strip():

                for line in text.splitlines():

                    doc.add_paragraph(line)

            else:

                doc.add_paragraph("")

            if page_number < len(pdf) - 1:

                doc.add_page_break()

        pdf.close()

        doc.save(
            str(output_path)
        )

        return FileResponse(
            path=str(output_path),
            media_type=(
                "application/vnd.openxmlformats-"
                "officedocument.wordprocessingml.document"
            ),
            filename="converted.docx"
        )

    except HTTPException:
        raise

    except Exception as exc:

        shutil.rmtree(
            job,
            ignore_errors=True
        )

        raise HTTPException(
            status_code=500,
            detail=f"PDF to Word conversion failed: {str(exc)}"
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass


