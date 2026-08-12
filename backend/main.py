from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Query
from fastapi.responses import FileResponse
from docx import Document
from fastapi.middleware.cors import CORSMiddleware
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


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="PDFora API",
    version="4.0.0",
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
    "https://pd-fora.vercel.app",
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
        "version": "4.0.0",
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
        "version": "4.0.0",
        "tools": [
            "merge",
            "split",
            "compress",
            "images-to-pdf",
            "pdf-to-jpg",
            "rotate",
            "delete-pages",
            "extract-pages",
            "watermark"
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

        # Do not make the file larger than the original.
        # If compression made it larger, return the original.
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

        # Validate PDF first
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

                writer.add_page(
                    page
                )

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

    if not text.strip():

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

    watermark_file = job / "watermark.pdf"

    try:

        await save_upload(
            file,
            input_file
        )

        reader = read_pdf(
            input_file
        )

        watermark_doc = fitz.open()

        page = watermark_doc.new_page(
            width=595,
            height=842
        )

        page.insert_text(
            (150, 420),
            text.strip(),
            fontsize=32,
            rotate=45,
            color=(0.5, 0.5, 0.5),
            fill_opacity=0.25
        )

        watermark_doc.save(
            str(watermark_file)
        )

        watermark_doc.close()

        watermark_reader = PdfReader(
            str(watermark_file)
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

        with open(output, "wb") as output_file:

            writer.write(
                output_file
            )

        return pdf_response(
            output,
            "PDFora-Watermarked.pdf"
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass


# ============================================================
# CLEANUP
# ============================================================

@app.post("/api/cleanup")
def cleanup():

    removed = 0

    now = time.time()

    for directory in TEMP_DIR.iterdir():

        if not directory.is_dir():
            continue

        try:

            age = now - directory.stat().st_mtime

            # Remove jobs older than 1 hour
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
async def pdf_to_word(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file."
        )

    job = create_job()
    input_path = job / "input.pdf"
    output_path = job / "output.docx"

    try:
        await save_upload(file, input_path)

        doc = Document()

        pdf = fitz.open(str(input_path))

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

        doc.save(str(output_path))

        return FileResponse(
            path=str(output_path),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename="converted.docx"
        )

    except Exception as exc:
        shutil.rmtree(job, ignore_errors=True)

        raise HTTPException(
            status_code=500,
            detail=f"PDF to Word conversion failed: {str(exc)}"
        )



