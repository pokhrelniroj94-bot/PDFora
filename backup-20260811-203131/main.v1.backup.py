from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfWriter, PdfReader
from pathlib import Path
import tempfile
import shutil
import uuid


app = FastAPI(
    title="PDFora API",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

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


# --------------------------------------------------
# SETTINGS
# --------------------------------------------------

MAX_FILES = 20
MAX_FILE_SIZE = 50 * 1024 * 1024

TEMP_DIR = Path(tempfile.gettempdir()) / "pdfora"
TEMP_DIR.mkdir(parents=True, exist_ok=True)


# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "name": "PDFora API",
        "status": "online",
        "version": "1.0.0",
    }


# --------------------------------------------------
# HEALTH
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ==================================================
# MERGE PDF
# ==================================================

@app.post("/api/merge")
async def merge_pdfs(
    files: list[UploadFile] = File(...)
):

    if not files:
        raise HTTPException(
            status_code=400,
            detail="No PDF files were uploaded."
        )

    if len(files) > MAX_FILES:
        raise HTTPException(
            status_code=400,
            detail=f"You can merge up to {MAX_FILES} PDF files at once."
        )

    job_id = uuid.uuid4().hex
    job_dir = TEMP_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    output_path = job_dir / "PDFora-Merged.pdf"

    writer = PdfWriter()

    try:

        for index, uploaded_file in enumerate(files):

            original_name = uploaded_file.filename or ""

            if not original_name.lower().endswith(".pdf"):
                raise HTTPException(
                    status_code=400,
                    detail=f"{original_name} is not a PDF file."
                )

            input_path = job_dir / f"input_{index}.pdf"

            total_size = 0

            with open(input_path, "wb") as buffer:

                while True:

                    chunk = await uploaded_file.read(1024 * 1024)

                    if not chunk:
                        break

                    total_size += len(chunk)

                    if total_size > MAX_FILE_SIZE:
                        raise HTTPException(
                            status_code=413,
                            detail=f"{original_name} is larger than 50 MB."
                        )

                    buffer.write(chunk)

            try:

                reader = PdfReader(str(input_path))

                if reader.is_encrypted:

                    try:
                        decrypted = reader.decrypt("")

                        if decrypted == 0:
                            raise HTTPException(
                                status_code=400,
                                detail=f"{original_name} is password protected."
                            )

                    except HTTPException:
                        raise

                    except Exception:
                        raise HTTPException(
                            status_code=400,
                            detail=f"{original_name} is password protected."
                        )

                for page in reader.pages:
                    writer.add_page(page)

            except HTTPException:
                raise

            except Exception:
                raise HTTPException(
                    status_code=400,
                    detail=f"{original_name} is invalid or corrupted."
                )

        if len(writer.pages) == 0:
            raise HTTPException(
                status_code=400,
                detail="The uploaded PDFs contain no pages."
            )

        with open(output_path, "wb") as output_file:
            writer.write(output_file)

        return FileResponse(
            path=str(output_path),
            media_type="application/pdf",
            filename="PDFora-Merged.pdf",
        )

    except HTTPException:
        shutil.rmtree(job_dir, ignore_errors=True)
        raise

    except Exception as error:

        shutil.rmtree(job_dir, ignore_errors=True)

        raise HTTPException(
            status_code=500,
            detail=f"PDF processing failed: {str(error)}"
        )

    finally:

        for uploaded_file in files:
            try:
                await uploaded_file.close()
            except Exception:
                pass


# ==================================================
# SPLIT PDF
# ==================================================

@app.post("/api/split")
async def split_pdf(
    file: UploadFile = File(...),
    start_page: int = 1,
    end_page: int | None = None,
):

    job_id = uuid.uuid4().hex
    job_dir = TEMP_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    input_path = job_dir / "input.pdf"
    output_path = job_dir / "PDFora-Split.pdf"

    try:

        filename = file.filename or ""

        if not filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Please upload a PDF file."
            )

        total_size = 0

        with open(input_path, "wb") as buffer:

            while True:

                chunk = await file.read(1024 * 1024)

                if not chunk:
                    break

                total_size += len(chunk)

                if total_size > MAX_FILE_SIZE:
                    raise HTTPException(
                        status_code=413,
                        detail="PDF is larger than 50 MB."
                    )

                buffer.write(chunk)

        try:
            reader = PdfReader(str(input_path))

        except Exception:
            raise HTTPException(
                status_code=400,
                detail="The PDF is invalid or corrupted."
            )

        if reader.is_encrypted:

            try:

                if reader.decrypt("") == 0:
                    raise HTTPException(
                        status_code=400,
                        detail="Password-protected PDFs are not supported."
                    )

            except HTTPException:
                raise

            except Exception:
                raise HTTPException(
                    status_code=400,
                    detail="Password-protected PDFs are not supported."
                )

        page_count = len(reader.pages)

        if page_count == 0:
            raise HTTPException(
                status_code=400,
                detail="The PDF contains no pages."
            )

        if end_page is None:
            end_page = page_count

        if start_page < 1:
            raise HTTPException(
                status_code=400,
                detail="Start page must be at least 1."
            )

        if end_page > page_count:
            raise HTTPException(
                status_code=400,
                detail=f"End page cannot be greater than {page_count}."
            )

        if start_page > end_page:
            raise HTTPException(
                status_code=400,
                detail="Start page cannot be greater than end page."
            )

        writer = PdfWriter()

        for page_number in range(start_page - 1, end_page):
            writer.add_page(reader.pages[page_number])

        with open(output_path, "wb") as output_file:
            writer.write(output_file)

        return FileResponse(
            path=str(output_path),
            media_type="application/pdf",
            filename="PDFora-Split.pdf",
        )

    except HTTPException:
        shutil.rmtree(job_dir, ignore_errors=True)
        raise

    except Exception as error:

        shutil.rmtree(job_dir, ignore_errors=True)

        raise HTTPException(
            status_code=500,
            detail=f"PDF splitting failed: {str(error)}"
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

    job_id = uuid.uuid4().hex
    job_dir = TEMP_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    input_path = job_dir / "input.pdf"
    output_path = job_dir / "PDFora-Compressed.pdf"

    try:

        filename = file.filename or ""

        if not filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Please upload a PDF file."
            )

        total_size = 0

        with open(input_path, "wb") as buffer:

            while True:

                chunk = await file.read(1024 * 1024)

                if not chunk:
                    break

                total_size += len(chunk)

                if total_size > MAX_FILE_SIZE:
                    raise HTTPException(
                        status_code=413,
                        detail="PDF is larger than 50 MB."
                    )

                buffer.write(chunk)

        try:
            reader = PdfReader(str(input_path))

        except Exception:
            raise HTTPException(
                status_code=400,
                detail="The PDF is invalid or corrupted."
            )

        if reader.is_encrypted:

            try:

                if reader.decrypt("") == 0:
                    raise HTTPException(
                        status_code=400,
                        detail="Password-protected PDFs are not supported."
                    )

            except HTTPException:
                raise

            except Exception:
                raise HTTPException(
                    status_code=400,
                    detail="Password-protected PDFs are not supported."
                )

        if len(reader.pages) == 0:
            raise HTTPException(
                status_code=400,
                detail="The PDF contains no pages."
            )

        writer = PdfWriter()

        for page in reader.pages:

            try:
                page.compress_content_streams()
            except Exception:
                pass

            writer.add_page(page)

        with open(output_path, "wb") as output_file:
            writer.write(output_file)

        original_size = input_path.stat().st_size
        compressed_size = output_path.stat().st_size

        return FileResponse(
            path=str(output_path),
            media_type="application/pdf",
            filename="PDFora-Compressed.pdf",
            headers={
                "X-Original-Size": str(original_size),
                "X-Compressed-Size": str(compressed_size),
            },
        )

    except HTTPException:

        shutil.rmtree(job_dir, ignore_errors=True)
        raise

    except Exception as error:

        shutil.rmtree(job_dir, ignore_errors=True)

        raise HTTPException(
            status_code=500,
            detail=f"PDF compression failed: {str(error)}"
        )

    finally:

        try:
            await file.close()
        except Exception:
            pass


# ==================================================
# API INFO
# ==================================================

@app.get("/api")
def api_info():

    return {
        "service": "PDFora",
        "tools": [
            "merge-pdf",
            "split-pdf",
            "compress-pdf",
        ],
        "endpoints": [
            "/api/merge",
            "/api/split",
            "/api/compress",
        ],
    }