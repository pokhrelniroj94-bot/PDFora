from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Query, Request
from fastapi.responses import FileResponse, JSONResponse
from starlette.background import BackgroundTask
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
import os
import re
import hmac
import ipaddress
import asyncio
import json
import urllib.request
import urllib.parse
import threading
from contextvars import ContextVar
import pdfplumber

try:
    import redis.asyncio as redis_async
except ImportError:  # Redis is optional; single-instance fallback remains available.
    redis_async = None
from openpyxl import Workbook


# ============================================================
# APP
# ============================================================

IS_PRODUCTION = (
    os.getenv("APP_ENV", "").lower() == "production"
    or os.getenv("RENDER", "").lower() == "true"
)

app = FastAPI(
    title="PDFora API",
    version="4.0.1",
    description="PDFora document processing API",
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    openapi_url=None if IS_PRODUCTION else "/openapi.json",
)


# ============================================================
# CORS
# ============================================================

@app.middleware("http")
async def enforce_request_limits(request: Request, call_next):
    # Only rate-limit file-processing/write endpoints; health and preflight
    # requests remain available. Limits are per endpoint plus a shared hourly cap.
    if request.method == "POST" and request.url.path.startswith("/api/"):
        content_length = request.headers.get("content-length")
        if content_length:
            try:
                if int(content_length) > MAX_FILE_SIZE + 2 * 1024 * 1024:
                    return JSONResponse(status_code=413, content={"detail": "The total request must not exceed 52 MB."})
            except ValueError:
                return JSONResponse(status_code=400, content={"detail": "Invalid Content-Length header."})

        ip = _client_ip(request)
        now_bucket_minute = int(time.time() // 60)
        now_bucket_hour = int(time.time() // 3600)
        route_key = f"pdfora:rate:route:{ip}:{request.url.path}:{now_bucket_minute}"
        hour_key = f"pdfora:rate:hour:{ip}:{now_bucket_hour}"

        try:
            route_count = await _rate_limit_count(route_key, 60)
            if route_count > RATE_LIMIT_PER_ROUTE_PER_MINUTE:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too many requests. Please wait a minute before trying again."},
                    headers={"Retry-After": "60"},
                )

            hour_count = await _rate_limit_count(hour_key, 3600)
            if hour_count > RATE_LIMIT_PER_IP_PER_HOUR:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Hourly request limit reached. Please try again later."},
                    headers={"Retry-After": "3600"},
                )
        except Exception:
            # If even the local fallback fails, fail closed for upload endpoints.
            return JSONResponse(
                status_code=503,
                content={"detail": "Upload protection is temporarily unavailable. Please retry shortly."},
                headers={"Retry-After": "30"},
            )

    response = await call_next(request)
    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["X-Content-Type-Options"] = "nosniff"
    return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",

        # Production
        "https://pd-fora.vercel.app",
        "https://niroj.com.np",
        "https://www.niroj.com.np",
        "https://www.pd-fora.vercel.app",

        # Vercel preview
        "https://pd-fora-dagpxk1pb-pokhrelniroj94-7012s-projects.vercel.app",
        "https://pd-fora-git-premium-redesign-pokhrelniroj94-7012s-projects.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
    expose_headers=[
        "Content-Disposition",
        "X-Original-Size",
        "X-Compressed-Size",
    ],
)


@app.middleware("http")
async def security_headers_and_temp_cleanup(request: Request, call_next):
    """Apply backend security headers and clean request temp files after responses."""
    request_jobs: list[Path] = []
    token = _REQUEST_TEMP_JOBS.set(request_jobs)

    try:
        response = await call_next(request)
    except Exception:
        for job in request_jobs:
            cleanup_job(job)
        raise
    finally:
        _REQUEST_TEMP_JOBS.reset(token)

    if request_jobs:
        # BaseHTTPMiddleware may wrap FileResponse in a streaming response,
        # so attach cleanup to the response lifecycle instead of checking its type.
        previous_background = getattr(response, "background", None)

        async def finish_response():
            if previous_background is not None:
                await previous_background()
            for job in request_jobs:
                cleanup_job(job)

        response.background = BackgroundTask(finish_response)

    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    # Keep the interactive FastAPI docs usable in local development.
    if not request.url.path.startswith(("/docs", "/redoc")) and request.url.path != "/openapi.json":
        response.headers["Content-Security-Policy"] = (
            "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; "
            "form-action 'none'; object-src 'none'"
        )

    if request.url.scheme == "https" or os.getenv("RENDER", "").lower() == "true":
        response.headers["Strict-Transport-Security"] = "max-age=31536000"

    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store, max-age=0"
        response.headers["Pragma"] = "no-cache"

    return response


# ============================================================
# SETTINGS
# ============================================================

MAX_FILE_SIZE = 50 * 1024 * 1024
_REQUEST_TEMP_JOBS: ContextVar[list[Path] | None] = ContextVar("pdfora_request_temp_jobs", default=None)

# Upload protection defaults. Redis is recommended for multi-instance deployments.
RATE_LIMIT_PER_ROUTE_PER_MINUTE = int(os.getenv("PDFORA_RATE_LIMIT_PER_ROUTE", "20"))
RATE_LIMIT_PER_IP_PER_HOUR = int(os.getenv("PDFORA_RATE_LIMIT_PER_HOUR", "120"))
RATE_LIMIT_REDIS_URL = os.getenv("RATE_LIMIT_REDIS_URL", "").strip()
_RATE_LIMIT_REDIS = None
_RATE_LIMIT_REDIS_LOCK = asyncio.Lock()
_LOCAL_RATE_LIMITS: dict[str, tuple[int, float]] = {}
_LOCAL_RATE_LIMIT_LOCK = asyncio.Lock()

PDF_HEADER_PATTERN = re.compile(rb"%PDF-(?:1\.[0-7]|2\.0)")


def _client_ip(request: Request) -> str:
    """Resolve the client IP using Render/Cloudflare's visitor-IP header.

    CF-Connecting-IP is set by Cloudflare at the edge and is preferred over
    X-Forwarded-For, which can contain a chain of client-supplied/proxy values.
    If the trusted edge header is absent, use the socket peer rather than
    trusting an arbitrary forwarded value for security-sensitive rate limits.
    """
    if os.getenv("RENDER", "").lower() == "true":
        edge_ip = request.headers.get("cf-connecting-ip", "").strip()
        if edge_ip:
            try:
                return str(ipaddress.ip_address(edge_ip))
            except ValueError:
                pass

    peer = request.client.host if request.client else "unknown"
    try:
        return str(ipaddress.ip_address(peer))
    except ValueError:
        return "unknown"


async def _redis_rate_count(key: str, window_seconds: int) -> int | None:
    global _RATE_LIMIT_REDIS
    if not RATE_LIMIT_REDIS_URL or redis_async is None:
        return None

    async with _RATE_LIMIT_REDIS_LOCK:
        if _RATE_LIMIT_REDIS is None:
            _RATE_LIMIT_REDIS = redis_async.from_url(
                RATE_LIMIT_REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                socket_connect_timeout=2,
                socket_timeout=2,
            )

    script = (
        "local count = redis.call('INCR', KEYS[1]); "
        "if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]); end; "
        "return count"
    )
    return int(await _RATE_LIMIT_REDIS.eval(script, 1, key, window_seconds))


async def _local_rate_count(key: str, window_seconds: int, now: float) -> int:
    async with _LOCAL_RATE_LIMIT_LOCK:
        count, expires_at = _LOCAL_RATE_LIMITS.get(key, (0, now + window_seconds))
        if now >= expires_at:
            count, expires_at = 0, now + window_seconds
        count += 1
        _LOCAL_RATE_LIMITS[key] = (count, expires_at)

        # Bound memory use and discard expired buckets opportunistically.
        if len(_LOCAL_RATE_LIMITS) > 10000:
            for old_key, (_, old_expiry) in list(_LOCAL_RATE_LIMITS.items()):
                if old_expiry <= now:
                    _LOCAL_RATE_LIMITS.pop(old_key, None)
        return count


async def _rate_limit_count(key: str, window_seconds: int) -> int:
    try:
        redis_count = await _redis_rate_count(key, window_seconds)
        if redis_count is not None:
            return redis_count
    except Exception:
        # Do not fail open silently: local fallback limits this process, and
        # logs make the degraded distributed protection visible to operators.
        import logging
        logging.getLogger("pdfora.security").exception(
            "Redis rate-limit storage unavailable; using process-local fallback"
        )
    return await _local_rate_count(key, window_seconds, time.time())


TEMP_DIR = Path(tempfile.gettempdir()) / "pdfora"

TEMP_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# HELPERS
# ============================================================

def create_job():
    # Remove abandoned temporary jobs left by interrupted or failed requests.
    now = time.time()
    for old_job in TEMP_DIR.iterdir():
        try:
            if old_job.is_dir() and now - old_job.stat().st_mtime > 6 * 60 * 60:
                shutil.rmtree(old_job, ignore_errors=True)
        except OSError:
            pass

    job_id = uuid.uuid4().hex

    directory = TEMP_DIR / job_id

    directory.mkdir(
        parents=True,
        exist_ok=True
    )

    request_jobs = _REQUEST_TEMP_JOBS.get()
    if request_jobs is not None:
        request_jobs.append(directory)

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



def validate_pdf_upload(file: UploadFile):
    """Validate the filename and declared MIME type before reading a PDF upload."""
    validate_pdf(file.filename)
    allowed_types = {"application/pdf", "application/octet-stream", ""}
    if (file.content_type or "").lower() not in allowed_types:
        raise HTTPException(status_code=415, detail="The uploaded file must be a PDF.")


async def read_upload_limited(file: UploadFile, max_bytes: int) -> bytes:
    """Read an upload in bounded chunks so image uploads cannot bypass size limits."""
    chunks: list[bytes] = []
    total = 0
    while True:
        chunk = await file.read(1024 * 1024)
        if not chunk:
            break
        total += len(chunk)
        if total > max_bytes:
            raise HTTPException(status_code=413, detail="The combined upload size must not exceed 50 MB.")
        chunks.append(chunk)
    return b"".join(chunks)

def has_pdf_signature(data: bytes) -> bool:
    """Check for a PDF header in the first 1,024 bytes, as permitted by PDF spec."""
    return PDF_HEADER_PATTERN.search(data[:1024]) is not None


async def save_upload(
    file: UploadFile,
    path: Path
):
    size = 0
    signature_checked = False

    try:
        with open(path, "wb") as output:
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break

                if not signature_checked:
                    if not has_pdf_signature(chunk[:1024]):
                        raise HTTPException(
                            status_code=400,
                            detail="Invalid PDF file. The file signature is incorrect."
                        )
                    signature_checked = True

                size += len(chunk)
                if size > MAX_FILE_SIZE:
                    raise HTTPException(
                        status_code=413,
                        detail="Maximum file size is 50 MB."
                    )

                output.write(chunk)

        if not signature_checked:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is empty or invalid."
            )

        return size

    except Exception:
        try:
            path.unlink(missing_ok=True)
        except OSError:
            pass
        raise


def read_pdf(path: Path):

    # Validate the actual file signature; never trust the filename or browser MIME type.
    try:
        with open(path, "rb") as uploaded:
            header = uploaded.read(1024)
        if not has_pdf_signature(header):
            raise HTTPException(status_code=400, detail="The uploaded file is not a valid PDF.");
    except OSError:
        raise HTTPException(status_code=400, detail="Unable to read the uploaded PDF.")

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

    if len(reader.pages) > 1000:
        raise HTTPException(status_code=413, detail="PDFs with more than 1,000 pages are not supported.")

    return reader


def pdf_response(
    path: Path,
    filename: str
):

    return FileResponse(
        path=str(path),
        media_type="application/pdf",
        filename=filename,
        background=BackgroundTask(cleanup_job, path.parent)
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
# NEPAL RASTRA BANK FOREIGN EXCHANGE RATES
# ============================================================

_NRB_CACHE: dict[str, tuple[float, dict]] = {}
_NRB_CACHE_LOCK = threading.Lock()


def _nrb_fetch_records(from_date: str, to_date: str) -> list[dict]:
    """Fetch official NRB forex records with Python's verified system CA store."""
    query = urllib.parse.urlencode({
        "from": from_date,
        "to": to_date,
        "per_page": "100",
        "page": "1",
    })
    url = "https://www.nrb.org.np/api/forex/v1/rates?" + query
    request = urllib.request.Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "PDForaForex/1.0 (+https://pd-fora.vercel.app)",
            "Referer": "https://www.nrb.org.np/forex/",
        },
    )
    # urlopen validates TLS certificates using the runtime's trusted CA bundle.
    with urllib.request.urlopen(request, timeout=15) as response:
        if response.status != 200:
            raise RuntimeError(f"NRB API returned HTTP {response.status}")
        payload = json.loads(response.read(5 * 1024 * 1024).decode("utf-8"))
    records = (payload.get("data") or {}).get("payload") or []
    if not isinstance(records, list):
        raise RuntimeError("NRB API returned an unexpected response schema")
    return records


def _nrb_cached(key: str, ttl: int, loader):
    now = time.monotonic()
    with _NRB_CACHE_LOCK:
        cached = _NRB_CACHE.get(key)
        if cached and now - cached[0] < ttl:
            return {**cached[1], "cached": True, "stale": False}
    try:
        result = loader()
        with _NRB_CACHE_LOCK:
            _NRB_CACHE[key] = (time.monotonic(), result)
        return {**result, "cached": False, "stale": False}
    except Exception:
        import logging
        logging.getLogger("pdfora.forex").exception("Official NRB forex request failed")
        if cached:
            return {**cached[1], "cached": True, "stale": True}
        raise


@app.get("/api/nepal-forex")
async def nepal_forex(date: str | None = Query(default=None)):
    """Return the latest official NRB rates on or before the requested date."""
    from datetime import date as Date, timedelta

    requested = date or time.strftime("%Y-%m-%d", time.gmtime(time.time() + 5 * 60 * 60 + 45 * 60))
    try:
        selected = Date.fromisoformat(requested)
        if selected.isoformat() != requested:
            raise ValueError
    except ValueError:
        raise HTTPException(status_code=400, detail="Date must be a valid YYYY-MM-DD value.")

    start = (selected - timedelta(days=10)).isoformat()
    # Keep a stable cache key for the live/latest view so a new day can still
    # fall back to the last successful published rate if NRB is temporarily down.
    key = "rates:latest" if date is None else "rates:" + requested

    def load():
        records = _nrb_fetch_records(start, requested)
        valid = [item for item in records if item.get("date") and isinstance(item.get("rates"), list)]
        latest = max(valid, key=lambda item: str(item.get("date", "")), default=None)
        if not latest:
            raise RuntimeError("NRB has not published a rate for this date range")
        rates = []
        for item in latest.get("rates", []):
            currency = item.get("currency") or {}
            code = str(currency.get("ISO3") or currency.get("iso3") or "").upper()
            name = str(currency.get("name") or "")
            try:
                unit, buy, sell = float(currency.get("unit") or 1), float(item.get("buy")), float(item.get("sell"))
            except (TypeError, ValueError):
                continue
            if len(code) == 3 and code.isalpha() and name and unit > 0 and all(map(lambda x: x == x and abs(x) != float("inf"), (unit, buy, sell))):
                rates.append({"code": code, "name": name, "unit": unit, "buy": buy, "sell": sell})
        if not rates:
            raise RuntimeError("NRB returned no valid currency rates")
        return {
            "source": "Nepal Rastra Bank",
            "requestedDate": requested,
            "rateDate": latest["date"],
            "publishedOn": latest.get("published_on"),
            "rates": rates,
        }

    try:
        return await asyncio.to_thread(_nrb_cached, key, 300, load)
    except Exception:
        raise HTTPException(status_code=502, detail="Could not retrieve published rates from Nepal Rastra Bank. Please retry later.")


@app.get("/api/nepal-forex/history")
async def nepal_forex_history(currency: str = Query(default="USD", min_length=3, max_length=3)):
    """Return 90 days of official NRB buying/selling rates, normalized per currency unit."""
    from datetime import date as Date, timedelta, datetime, timezone

    code = currency.upper()
    if not code.isalpha():
        raise HTTPException(status_code=400, detail="Invalid currency code.")
    nepal_tz = timezone(timedelta(hours=5, minutes=45))
    end = datetime.now(nepal_tz).date()
    start = end - timedelta(days=90)
    key = "history:" + code

    def load():
        records = _nrb_fetch_records(start.isoformat(), end.isoformat())
        history = []
        for record in records:
            item = next((rate for rate in (record.get("rates") or [])
                         if str((rate.get("currency") or {}).get("ISO3") or (rate.get("currency") or {}).get("iso3") or "").upper() == code), None)
            if not item or not record.get("date"):
                continue
            currency_data = item.get("currency") or {}
            try:
                unit = float(currency_data.get("unit") or 1)
                buy, sell = float(item.get("buy")), float(item.get("sell"))
            except (TypeError, ValueError):
                continue
            if unit <= 0 or not all(map(lambda x: x == x and abs(x) != float("inf"), (unit, buy, sell))):
                continue
            history.append({"date": record["date"], "buy": buy / unit, "sell": sell / unit})
        history.sort(key=lambda item: item["date"])
        if not history:
            raise RuntimeError(f"No NRB historical rates found for {code}")
        return {"source": "Nepal Rastra Bank", "currency": code, "history": history}

    try:
        return await asyncio.to_thread(_nrb_cached, key, 3600, load)
    except Exception:
        raise HTTPException(status_code=502, detail="NRB historical rates are temporarily unavailable for this currency.")


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    # Keep the public health response intentionally minimal.
    return {"status": "ok"}


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
        "service": "PDFora API",
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
            "pdf-to-word",
            "pdf-to-excel",
            "reorder", "page-numbers", "crop", "header-footer", "protect", "unlock",
            "sign", "pdf-to-png", "pdf-to-webp", "pdf-to-text", "grayscale",
            "flatten", "metadata", "repair", "pdf-to-html", "extract-images", "remove-blank-pages", "compare", "add-blank-pages", "rotate-selected-pages", "page-counter", "pdf-info", "remove-annotations", "remove-links", "extract-bookmarks", "remove-metadata", "pdf-to-json", "pdf-to-csv", "add-bookmarks", "bates-numbering", "pdf-to-tiff", "pdf-to-bmp", "split-by-bookmarks", "pdf-to-markdown", "remove-attachments", "add-background", "extract-page-images", "extract-fonts"
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
        raise HTTPException(status_code=400, detail="Select at least 2 PDF files.")
    if len(files) > 20:
        raise HTTPException(status_code=413, detail="You can merge up to 20 PDF files at once.")

    job = create_job()

    output = job / "NIROJ-Merged.pdf"

    writer = PdfWriter()

    try:

        total_upload_size = 0
        for index, file in enumerate(files):
            validate_pdf_upload(file)
            input_file = job / f"{index}.pdf"
            total_upload_size += await save_upload(file, input_file)
            if total_upload_size > MAX_FILE_SIZE:
                raise HTTPException(status_code=413, detail="The combined upload size must not exceed 50 MB.")

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
            "NIROJ-Merged.pdf"
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

    validate_pdf_upload(file)

    job = create_job()

    input_file = job / "input.pdf"

    output = job / "NIROJ-Split.pdf"

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
            "NIROJ-Split.pdf"
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

    validate_pdf_upload(file)

    job = create_job()

    input_file = job / "input.pdf"

    output = job / "NIROJ-Compressed.pdf"

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
            filename="NIROJ-Compressed.pdf",
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
        raise HTTPException(status_code=400, detail="Select at least one image.")
    if len(files) > 20:
        raise HTTPException(status_code=413, detail="You can convert up to 20 images at once.")

    job = create_job()

    output = job / "NIROJ-Images.pdf"

    images = []
    total_upload_size = 0
    total_image_pixels = 0

    try:
        for file in files:
            validate_filename(file.filename)
            if (file.content_type or "").lower() not in {"image/jpeg", "image/png", "image/webp", "application/octet-stream", ""}:
                raise HTTPException(status_code=415, detail="Only JPEG, PNG and WEBP images are supported.")
            data = await read_upload_limited(file, MAX_FILE_SIZE - total_upload_size)
            total_upload_size += len(data)

            try:
                image = Image.open(io.BytesIO(data))
                if image.format not in {"JPEG", "PNG", "WEBP"}:
                    raise ValueError("Unsupported image format")
                image_pixels = image.width * image.height
                if image_pixels > 25_000_000:
                    raise HTTPException(status_code=413, detail="Images must not exceed 25 megapixels each.")
                total_image_pixels += image_pixels
                if total_image_pixels > 40_000_000:
                    raise HTTPException(status_code=413, detail="The combined images must not exceed 40 megapixels.")
                image.verify()
                image = Image.open(io.BytesIO(data)).convert("RGB")
                images.append(image)
            except HTTPException:
                raise
            except Exception:
                raise HTTPException(status_code=400, detail=f"Invalid image: {file.filename}")

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
            "NIROJ-Images.pdf"
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

    validate_pdf_upload(file)

    job = create_job()

    input_file = job / "input.pdf"

    zip_file = job / "NIROJ-JPG.zip"

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
            filename="NIROJ-JPG.zip"
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

    validate_pdf_upload(file)

    if degrees not in [90, 180, 270]:

        raise HTTPException(
            status_code=400,
            detail="Rotation must be 90, 180 or 270 degrees."
        )

    job = create_job()

    input_file = job / "input.pdf"

    output = job / "NIROJ-Rotated.pdf"

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
            "NIROJ-Rotated.pdf"
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

    validate_pdf_upload(file)

    job = create_job()

    input_file = job / "input.pdf"

    output = job / "NIROJ-Deleted-Pages.pdf"

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
            "NIROJ-Deleted-Pages.pdf"
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

    validate_pdf_upload(file)

    job = create_job()

    input_file = job / "input.pdf"

    output = job / "NIROJ-Extracted.pdf"

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
            "NIROJ-Extracted.pdf"
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

    validate_pdf_upload(file)

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

    output = job / "NIROJ-Watermarked.pdf"

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
            "NIROJ-Watermarked.pdf"
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
    validate_pdf_upload(file)

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
            filename="pdfora-converted.xlsx",
            background=BackgroundTask(cleanup_job, job)
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
def cleanup(request: Request):
    admin_token = os.getenv("CLEANUP_ADMIN_TOKEN", "")
    supplied_token = request.headers.get("X-Admin-Token", "")
    if not admin_token or not hmac.compare_digest(supplied_token, admin_token):
        raise HTTPException(status_code=404, detail="Not found")

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

    validate_pdf_upload(file)

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
            filename="converted.docx",
            background=BackgroundTask(cleanup_job, job)
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





# ============================================================
# PDFORA ADDITIONAL PDF TOOLS
# ============================================================
from fastapi import BackgroundTasks
from pypdf import PdfReader as _PdfReader, PdfWriter as _PdfWriter
from starlette.background import BackgroundTask

def _tool_file_response(path: Path, filename: str, media_type: str = "application/pdf"):
    return FileResponse(
        path=str(path),
        media_type=media_type,
        filename=filename,
        background=BackgroundTask(cleanup_job, path.parent),
    )

def _parse_page_order(value: str, total: int) -> list[int]:
    try:
        order = [int(x.strip()) for x in value.split(",") if x.strip()]
    except Exception:
        raise HTTPException(status_code=400, detail="Enter page order like 3,1,2.")
    if not order or len(order) != total or sorted(order) != list(range(1, total + 1)):
        raise HTTPException(status_code=400, detail=f"Enter every page number from 1 to {total} exactly once.")
    return order

@app.post("/api/reorder")
async def reorder_pdf(file: UploadFile = File(...), order: str = Form(...)):
    validate_pdf_upload(file)
    job=create_job()
    try:
        src=job/"input.pdf"; out=job/"reordered.pdf"
        await save_upload(file,src)
        reader=read_pdf(src); sequence=_parse_page_order(order,len(reader.pages))
        writer=PdfWriter()
        for n in sequence: writer.add_page(reader.pages[n-1])
        with open(out,"wb") as f: writer.write(f)
        return _tool_file_response(out,"NIROJ-Reordered.pdf")
    finally:
        await file.close()

@app.post("/api/page-numbers")
async def add_page_numbers(file: UploadFile = File(...), position: str = Form("bottom-center"), start_number: int = Form(1), skip_first: bool = Form(False), font_size: int = Form(11)):
    validate_pdf_upload(file)
    if position not in {"bottom-center","bottom-left","bottom-right","top-center","top-left","top-right"} or not 1 <= font_size <= 36 or start_number < 0:
        raise HTTPException(status_code=400, detail="Invalid page-number settings.")
    job=create_job()
    try:
        src=job/"input.pdf"; out=job/"numbered.pdf"
        await save_upload(file,src); doc=fitz.open(src)
        for i,page in enumerate(doc):
            if skip_first and i==0: continue
            r=page.rect; x={"left":36,"center":r.width/2,"right":r.width-36}[position.split("-")[1]]
            y=24 if position.startswith("top") else r.height-24
            page.insert_text((x,y),str(start_number+i-(1 if skip_first and i>0 else 0)),fontsize=font_size, color=(0.25,0.25,0.3))
        doc.save(out,garbage=4,deflate=True); doc.close()
        return _tool_file_response(out,"NIROJ-Page-Numbers.pdf")
    finally: await file.close()

@app.post("/api/crop")
async def crop_pdf(file: UploadFile = File(...), margin: float = Form(36), pages: str = Form("all")):
    validate_pdf_upload(file)
    if margin < 0 or margin > 300: raise HTTPException(status_code=400,detail="Margin must be between 0 and 300 points.")
    job=create_job()
    try:
        src=job/"input.pdf"; out=job/"cropped.pdf"; await save_upload(file,src); doc=fitz.open(src)
        selected=set(range(len(doc)))
        if pages.strip().lower()!="all":
            try: selected={int(x.strip())-1 for x in pages.split(",")}
            except Exception: raise HTTPException(status_code=400,detail="Pages must look like 1,3,5 or all.")
            if not selected or min(selected)<0 or max(selected)>=len(doc): raise HTTPException(status_code=400,detail="Selected page number is out of range.")
        for i in selected:
            p=doc[i]; r=p.rect
            if r.width<=2*margin or r.height<=2*margin: raise HTTPException(status_code=400,detail="Margin is too large for one or more pages.")
            p.set_cropbox(fitz.Rect(r.x0+margin,r.y0+margin,r.x1-margin,r.y1-margin))
        doc.save(out,garbage=4,deflate=True); doc.close()
        return _tool_file_response(out,"NIROJ-Cropped.pdf")
    finally: await file.close()

@app.post("/api/header-footer")
async def header_footer(file: UploadFile = File(...), header: str = Form(""), footer: str = Form(""), font_size: int = Form(10)):
    validate_pdf_upload(file)
    if len(header)>300 or len(footer)>300 or not 6<=font_size<=24 or (not header and not footer): raise HTTPException(status_code=400,detail="Enter header or footer text (up to 300 characters) and font size 6–24.")
    job=create_job()
    try:
        src=job/"input.pdf"; out=job/"header-footer.pdf"; await save_upload(file,src); doc=fitz.open(src)
        for p in doc:
            r=p.rect
            if header: p.insert_text((36,24),header[:300],fontsize=font_size)
            if footer: p.insert_text((36,r.height-24),footer[:300],fontsize=font_size)
        doc.save(out,garbage=4,deflate=True); doc.close()
        return _tool_file_response(out,"NIROJ-Header-Footer.pdf")
    finally: await file.close()

@app.post("/api/protect")
async def protect_pdf(file: UploadFile = File(...), password: str = Form(...)):
    validate_pdf_upload(file)
    if len(password)<6 or len(password)>128: raise HTTPException(status_code=400,detail="Password must be 6–128 characters.")
    job=create_job()
    try:
        src=job/"input.pdf"; out=job/"protected.pdf"; await save_upload(file,src); reader=read_pdf(src); writer=PdfWriter()
        # Explicit page copying avoids fragile catalog cloning on complex PDFs.
        for page in reader.pages:
            writer.add_page(page)
        if reader.metadata:
            safe_metadata = {str(key): str(value) for key, value in reader.metadata.items() if value is not None}
            if safe_metadata:
                writer.add_metadata(safe_metadata)
        writer.encrypt(user_password=password, owner_password=password)
        with open(out,"wb") as f: writer.write(f)
        return _tool_file_response(out,"NIROJ-Protected.pdf")
    finally: await file.close()

@app.post("/api/unlock")
async def unlock_pdf(file: UploadFile = File(...), password: str = Form(...)):
    validate_pdf_upload(file)
    job=create_job()
    try:
        src=job/"input.pdf"; out=job/"unlocked.pdf"; await save_upload(file,src); reader=PdfReader(str(src))
        if reader.is_encrypted:
            try: ok=reader.decrypt(password)
            except Exception: ok=0
            if not ok: raise HTTPException(status_code=400,detail="Incorrect password or unsupported encryption.")
        writer=PdfWriter()
        for p in reader.pages: writer.add_page(p)
        with open(out,"wb") as f: writer.write(f)
        return _tool_file_response(out,"NIROJ-Unlocked.pdf")
    finally: await file.close()

@app.post("/api/sign")
async def sign_pdf(file: UploadFile = File(...), signature_text: str = Form(...)):
    validate_pdf_upload(file)
    if not signature_text.strip() or len(signature_text)>100: raise HTTPException(status_code=400,detail="Enter a signature name (maximum 100 characters).")
    job=create_job()
    try:
        src=job/"input.pdf"; out=job/"signed.pdf"; await save_upload(file,src); doc=fitz.open(src)
        p=doc[-1]; r=p.rect
        box=fitz.Rect(36,r.height-90,min(r.width-36,300),r.height-36)
        p.draw_rect(box,color=(0.35,0.2,0.6),width=1)
        p.insert_text((box.x0+8,box.y0+28),signature_text.strip(),fontsize=18,fontname="tiit",color=(0.2,0.15,0.35))
        p.insert_text((box.x0+8,box.y0+44),"Electronic visual signature",fontsize=7,color=(0.4,0.4,0.4))
        doc.save(out,garbage=4,deflate=True); doc.close()
        return _tool_file_response(out,"NIROJ-Signed.pdf")
    finally: await file.close()

async def _render_pdf_images(file: UploadFile, fmt: str, quality: int=85):
    validate_pdf_upload(file)
    job=create_job(); doc=None
    try:
        src=job/"input.pdf"; archive=job/f"images-{fmt}.zip"; await save_upload(file,src); doc=fitz.open(src)
        if len(doc)>200: raise HTTPException(status_code=413,detail="Maximum 200 pages per image conversion.")
        with zipfile.ZipFile(archive,"w",zipfile.ZIP_DEFLATED) as z:
            for i,p in enumerate(doc):
                pix=p.get_pixmap(matrix=fitz.Matrix(2,2),alpha=False)
                im=Image.frombytes("RGB",[pix.width,pix.height],pix.samples)
                dest=io.BytesIO()
                opts={"quality":quality,"method":6} if fmt=="webp" else {}
                im.save(dest,format=fmt.upper(),**opts)
                z.writestr(f"page-{i+1}.{fmt}",dest.getvalue())
        return _tool_file_response(archive,f"NIROJ-{fmt.upper()}.zip","application/zip")
    finally:
        if doc: doc.close()
        await file.close()

@app.post("/api/pdf-to-png")
async def pdf_to_png(file: UploadFile = File(...)):
    return await _render_pdf_images(file,"png")

@app.post("/api/pdf-to-webp")
async def pdf_to_webp(file: UploadFile = File(...), quality: int = Form(85)):
    if not 1<=quality<=100: raise HTTPException(status_code=400,detail="Quality must be between 1 and 100.")
    return await _render_pdf_images(file,"webp",quality)

@app.post("/api/pdf-to-text")
async def pdf_to_text(file: UploadFile = File(...)):
    validate_pdf_upload(file); job=create_job()
    try:
        src=job/"input.pdf"; out=job/"extracted.txt"; await save_upload(file,src); doc=fitz.open(src)
        with open(out,"w",encoding="utf-8") as f:
            for i,p in enumerate(doc):
                f.write(f"--- Page {i+1} ---\n{p.get_text('text')}\n\n")
        doc.close()
        return _tool_file_response(out,"NIROJ-Extracted-Text.txt","text/plain; charset=utf-8")
    finally: await file.close()

@app.post("/api/grayscale")
async def grayscale_pdf(file: UploadFile = File(...)):
    validate_pdf_upload(file); job=create_job()
    try:
        src=job/"input.pdf"; out=job/"grayscale.pdf"; await save_upload(file,src); doc=fitz.open(src)
        if len(doc)>100: raise HTTPException(status_code=413,detail="Maximum 100 pages for grayscale conversion.")
        flattened=fitz.open()
        for p in doc:
            rect=p.rect
            pix=p.get_pixmap(matrix=fitz.Matrix(1.5,1.5),colorspace=fitz.csGRAY,alpha=False,annots=True)
            page=flattened.new_page(width=rect.width,height=rect.height)
            page.insert_image(page.rect,stream=pix.tobytes("png"))
        doc.close()
        flattened.save(out,garbage=4,deflate=True); flattened.close()
        return _tool_file_response(out,"NIROJ-Grayscale.pdf")
    finally: await file.close()

@app.post("/api/flatten")
async def flatten_pdf(file: UploadFile = File(...)):
    validate_pdf_upload(file); job=create_job()
    try:
        src=job/"input.pdf"; out=job/"flattened.pdf"; await save_upload(file,src); doc=fitz.open(src)
        if len(doc)>100: raise HTTPException(status_code=413,detail="Maximum 100 pages for flattening.")
        # Render each page into a fresh PDF page. This removes interactive annotations/widgets.
        flattened=fitz.open()
        for page in doc:
            rect=page.rect
            pix=page.get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False,annots=True)
            target=flattened.new_page(width=rect.width,height=rect.height)
            target.insert_image(target.rect,stream=pix.tobytes("png"))
        doc.close()
        flattened.save(out,garbage=4,deflate=True); flattened.close()
        return _tool_file_response(out,"NIROJ-Flattened.pdf")
    finally: await file.close()

@app.post("/api/metadata")
async def edit_pdf_metadata(file: UploadFile = File(...), title: str = Form(""), author: str = Form(""), subject: str = Form(""), keywords: str = Form("")):
    validate_pdf_upload(file)
    if any(len(v)>500 for v in [title,author,subject,keywords]): raise HTTPException(status_code=400,detail="Metadata fields must be 500 characters or fewer.")
    job=create_job()
    try:
        src=job/"input.pdf"; out=job/"metadata.pdf"; await save_upload(file,src); reader=PdfReader(str(src)); writer=PdfWriter(); writer.clone_document_from_reader(reader)
        writer.add_metadata({"/Title":title,"/Author":author,"/Subject":subject,"/Keywords":keywords})
        with open(out,"wb") as f: writer.write(f)
        return _tool_file_response(out,"NIROJ-Updated-Metadata.pdf")
    finally: await file.close()

@app.post("/api/repair")
async def repair_pdf(file: UploadFile = File(...)):
    validate_pdf_upload(file); job=create_job()
    try:
        src=job/"input.pdf"; out=job/"repaired.pdf"; await save_upload(file,src)
        try:
            doc=fitz.open(src)
            if doc.is_repaired is False and len(doc)==0: raise ValueError("Empty PDF")
            doc.save(out,garbage=4,deflate=True,clean=True); doc.close()
        except Exception:
            raise HTTPException(status_code=422,detail="This PDF could not be repaired. The file may be severely damaged or unsupported.")
        return _tool_file_response(out,"NIROJ-Repaired.pdf")
    finally: await file.close()

@app.post("/api/ocr")
async def ocr_pdf(file: UploadFile = File(...)):
    raise HTTPException(status_code=501,detail="OCR is not enabled on this server yet. Tesseract OCR and language data must be installed before this tool can process files.")


# ============================================================
# ADDITIONAL OCR-FREE TOOLS
# ============================================================

@app.post("/api/pdf-to-html")
async def pdf_to_html(file: UploadFile = File(...)):
    validate_pdf_upload(file)
    job=create_job()
    try:
        src=job/"input.pdf"; out=job/"converted.html"
        await save_upload(file,src)
        doc=fitz.open(src)
        parts=["<!doctype html><html><head><meta charset='utf-8'><title>PDF to HTML</title><style>body{font-family:Arial,sans-serif;max-width:900px;margin:40px auto;padding:0 20px;color:#222}.pdf-page{white-space:pre-wrap;border-bottom:1px solid #ddd;padding:24px 0;line-height:1.6}</style></head><body>"]
        for i,page in enumerate(doc):
            text=page.get_text("text")
            parts.append(f"<section class='pdf-page'><h2>Page {i+1}</h2><pre>{__import__('html').escape(text)}</pre></section>")
        parts.append("</body></html>")
        doc.close()
        out.write_text("\n".join(parts),encoding="utf-8")
        return _tool_file_response(out,"NIROJ-PDF-to-HTML.html","text/html; charset=utf-8")
    finally:
        await file.close()

@app.post("/api/extract-images")
async def extract_images(file: UploadFile = File(...)):
    validate_pdf_upload(file)
    job=create_job()
    try:
        src=job/"input.pdf"; out=job/"extracted-images.zip"
        await save_upload(file,src)
        doc=fitz.open(src); count=0; seen=set()
        with zipfile.ZipFile(out,"w",zipfile.ZIP_DEFLATED) as archive:
            for page_no,page in enumerate(doc,start=1):
                for image_no,item in enumerate(page.get_images(full=True),start=1):
                    xref=item[0]
                    if xref in seen: continue
                    seen.add(xref)
                    try:
                        data=doc.extract_image(xref)
                        raw=data.get("image")
                        ext=data.get("ext","png").lower()
                        if not raw: continue
                        count+=1
                        archive.writestr(f"image-{count}-page-{page_no}.{ext}",raw)
                    except Exception:
                        continue
        doc.close()
        if count==0: raise HTTPException(status_code=422,detail="No embedded images were found in this PDF.")
        return _tool_file_response(out,"NIROJ-Extracted-Images.zip","application/zip")
    finally:
        await file.close()

@app.post("/api/remove-blank-pages")
async def remove_blank_pages(file: UploadFile = File(...), threshold: int = Form(2)):
    validate_pdf_upload(file)
    if not 0<=threshold<=20: raise HTTPException(status_code=400,detail="Threshold must be between 0 and 20.")
    job=create_job()
    try:
        src=job/"input.pdf"; out=job/"without-blank-pages.pdf"
        await save_upload(file,src); doc=fitz.open(src); kept=[]; removed=[]
        for i,page in enumerate(doc):
            text="".join(page.get_text("text").split())
            has_images=bool(page.get_images(full=True))
            has_drawings=bool(page.get_drawings())
            if len(text)<=threshold and not has_images and not has_drawings:
                removed.append(i)
            else:
                kept.append(i)
        if not removed: raise HTTPException(status_code=422,detail="No blank pages were detected.")
        if not kept: raise HTTPException(status_code=422,detail="All pages appear blank; no output was created.")
        result=fitz.open()
        for i in kept: result.insert_pdf(doc,from_page=i,to_page=i)
        doc.close(); result.save(out,garbage=4,deflate=True); result.close()
        return _tool_file_response(out,"NIROJ-Without-Blank-Pages.pdf")
    finally:
        await file.close()

@app.post("/api/compare")
async def compare_pdfs(files: list[UploadFile] = File(...)):
    if len(files)!=2: raise HTTPException(status_code=400,detail="Upload exactly two PDF files to compare.")
    job=create_job()
    try:
        readers=[]
        for i,file in enumerate(files):
            validate_pdf_upload(file)
            path=job/f"compare-{i}.pdf"; await save_upload(file,path)
            doc=fitz.open(path)
            readers.append([page.get_text("text") for page in doc])
            doc.close()
        from difflib import unified_diff
        left="\n".join(f"--- Page {i+1} ---\n{t}" for i,t in enumerate(readers[0]))
        right="\n".join(f"--- Page {i+1} ---\n{t}" for i,t in enumerate(readers[1]))
        diff=list(unified_diff(left.splitlines(),right.splitlines(),fromfile=files[0].filename,tofile=files[1].filename,lineterm=""))
        out=job/"comparison.txt"
        summary=f"PDF COMPARISON REPORT\nFile 1: {files[0].filename}\nFile 2: {files[1].filename}\nPages in file 1: {len(readers[0])}\nPages in file 2: {len(readers[1])}\n\n"
        out.write_text(summary+("\n".join(diff) if diff else "No selectable-text differences were detected. This comparison does not inspect visual layout or scanned images."),encoding="utf-8")
        return _tool_file_response(out,"NIROJ-PDF-Comparison.txt","text/plain; charset=utf-8")
    finally:
        for file in files:
            await file.close()



# ============================================================
# PDFORA TOOLS: ADD BLANK PAGES AND ROTATE SELECTED PAGES
# ============================================================

@app.post("/api/add-blank-pages")
async def add_blank_pages(file: UploadFile = File(...), count: int = Form(1)):
    validate_pdf_upload(file)
    if not 1 <= count <= 50:
        raise HTTPException(status_code=400, detail="Choose between 1 and 50 blank pages.")
    job = create_job()
    try:
        src = job / "input.pdf"
        out = job / "with-blank-pages.pdf"
        await save_upload(file, src)
        reader = read_pdf(src)
        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)
        last = reader.pages[-1]
        width = float(last.mediabox.width)
        height = float(last.mediabox.height)
        for _ in range(count):
            writer.add_blank_page(width=width, height=height)
        with open(out, "wb") as stream:
            writer.write(stream)
        return pdf_response(out, "NIROJ-Blank-Pages-Added.pdf")
    finally:
        await file.close()


@app.post("/api/rotate-selected-pages")
async def rotate_selected_pages(file: UploadFile = File(...), pages: str = Form("all"), degrees: int = Form(90)):
    validate_pdf_upload(file)
    if degrees not in {90, 180, 270}:
        raise HTTPException(status_code=400, detail="Rotation must be 90, 180 or 270 degrees.")
    job = create_job()
    doc = None
    try:
        src = job / "input.pdf"
        out = job / "rotated-selected-pages.pdf"
        await save_upload(file, src)
        doc = fitz.open(src)
        if pages.strip().lower() == "all":
            selected = list(range(len(doc)))
        else:
            try:
                selected = sorted(set(int(value.strip()) - 1 for value in pages.split(",") if value.strip()))
            except ValueError:
                raise HTTPException(status_code=400, detail="Enter page numbers like 1,3,5 or use all.")
            if not selected or min(selected) < 0 or max(selected) >= len(doc):
                raise HTTPException(status_code=400, detail=f"Page numbers must be between 1 and {len(doc)}.")
        for index in selected:
            doc[index].set_rotation((doc[index].rotation + degrees) % 360)
        doc.save(out, garbage=4, deflate=True)
        return pdf_response(out, "NIROJ-Rotated-Selected-Pages.pdf")
    finally:
        if doc is not None:
            doc.close()
        await file.close()


# ============================================================
# REMOVE PDF ANNOTATIONS
# ============================================================

@app.post("/api/remove-annotations")
async def remove_annotations(file: UploadFile = File(...)):
    validate_pdf_upload(file)
    job = create_job()
    doc = None
    try:
        src, out = job / "input.pdf", job / "without-annotations.pdf"
        await save_upload(file, src)
        read_pdf(src)
        doc = fitz.open(src)
        for page in doc:
            annot = page.first_annot
            while annot:
                following = annot.next
                page.delete_annot(annot)
                annot = following
        doc.save(out, garbage=4, deflate=True)
        return pdf_response(out, "NIROJ-Annotations-Removed.pdf")
    finally:
        if doc is not None:
            doc.close()
        await file.close()


# ============================================================
# REMOVE PDF HYPERLINKS
# ============================================================

@app.post("/api/remove-links")
async def remove_pdf_links(file: UploadFile = File(...)):
    validate_pdf_upload(file)
    job = create_job()
    doc = None
    try:
        src, out = job / "input.pdf", job / "without-links.pdf"
        await save_upload(file, src)
        read_pdf(src)
        doc = fitz.open(src)
        for page in doc:
            for link in page.get_links():
                page.delete_link(link)
        doc.save(out, garbage=4, deflate=True)
        return pdf_response(out, "NIROJ-Links-Removed.pdf")
    finally:
        if doc is not None:
            doc.close()
        await file.close()


# ============================================================
# PDF PAGE COUNTER REPORT
# ============================================================

@app.post("/api/page-counter")
async def pdf_page_counter(file: UploadFile = File(...)):
    validate_pdf_upload(file)
    job = create_job()
    try:
        src, out = job / "input.pdf", job / "NIROJ-Page-Count.txt"
        size = await save_upload(file, src)
        reader = read_pdf(src)
        report = (
            "PDFora - PDF Page Count Report\\n"
            "================================\\n"
            f"File name: {Path(file.filename).name}\\n"
            f"Total pages: {len(reader.pages)}\\n"
            f"File size: {size:,} bytes ({size / (1024 * 1024):.2f} MB)\\n"
        )
        out.write_text(report, encoding="utf-8")
        return FileResponse(str(out), media_type="text/plain; charset=utf-8", filename="NIROJ-Page-Count.txt", background=BackgroundTask(cleanup_job, job))
    finally:
        await file.close()


# ============================================================
# PDF INFORMATION REPORT
# ============================================================

@app.post("/api/pdf-info")
async def pdf_information(file: UploadFile = File(...)):
    validate_pdf_upload(file)
    job = create_job()
    doc = None
    try:
        src, out = job / "input.pdf", job / "NIROJ-Information.txt"
        size = await save_upload(file, src)
        reader = read_pdf(src)
        metadata = reader.metadata or {}
        doc = fitz.open(src)
        first = doc[0].rect
        lines = [
            "PDFora - PDF Information Report",
            "================================",
            f"File name: {Path(file.filename).name}",
            f"File size: {size:,} bytes ({size / (1024 * 1024):.2f} MB)",
            f"Page count: {len(reader.pages)}",
            f"PDF version: {doc.metadata.get('format', 'Unknown')}",
            f"Page 1 dimensions: {first.width:.1f} x {first.height:.1f} points",
            f"Title: {metadata.get('/Title') or 'Not set'}",
            f"Author: {metadata.get('/Author') or 'Not set'}",
            f"Subject: {metadata.get('/Subject') or 'Not set'}",
            f"Creator: {metadata.get('/Creator') or 'Not set'}",
            f"Encrypted: {'Yes' if reader.is_encrypted else 'No'}",
        ]
        out.write_text("\\n".join(lines) + "\\n", encoding="utf-8")
        return FileResponse(str(out), media_type="text/plain; charset=utf-8", filename="NIROJ-Information.txt", background=BackgroundTask(cleanup_job, job))
    finally:
        if doc is not None:
            doc.close()
        await file.close()


# ============================================================
# EXTRACT PDF BOOKMARKS
# ============================================================

@app.post("/api/extract-bookmarks")
async def extract_pdf_bookmarks(file: UploadFile = File(...)):
    validate_pdf_upload(file)
    job = create_job()
    doc = None
    try:
        src, out = job / "input.pdf", job / "NIROJ-Bookmarks.txt"
        await save_upload(file, src)
        read_pdf(src)
        doc = fitz.open(src)
        toc = doc.get_toc()
        if not toc:
            raise HTTPException(status_code=404, detail="This PDF does not contain bookmarks.")
        lines = ["PDFora - PDF Bookmarks", "=======================", ""]
        for level, title, page in toc:
            lines.append(f"{'  ' * max(0, level - 1)}Page {page}: {title}")
        out.write_text("\\n".join(lines) + "\\n", encoding="utf-8")
        return FileResponse(str(out), media_type="text/plain; charset=utf-8", filename="NIROJ-Bookmarks.txt", background=BackgroundTask(cleanup_job, job))
    finally:
        if doc is not None:
            doc.close()
        await file.close()


# ============================================================
# REMOVE DOCUMENT METADATA
# ============================================================

@app.post("/api/remove-metadata")
async def remove_pdf_metadata(file: UploadFile = File(...)):
    validate_pdf_upload(file)
    job = create_job()
    try:
        src, out = job / "input.pdf", job / "metadata-removed.pdf"
        await save_upload(file, src)
        read_pdf(src)
        doc = fitz.open(src)
        doc.set_metadata({})
        doc.del_xml_metadata()
        doc.save(out, garbage=4, deflate=True)
        return pdf_response(out, "NIROJ-Metadata-Removed.pdf")
    finally:
        if 'doc' in locals() and doc is not None:
            doc.close()
        await file.close()


# ============================================================
# EXTRACT PDF TEXT AS STRUCTURED JSON
# ============================================================

@app.post("/api/pdf-to-json")
async def pdf_to_json(file: UploadFile = File(...)):
    import json
    validate_pdf_upload(file)
    job = create_job()
    doc = None
    try:
        src, out = job / "input.pdf", job / "NIROJ-Text.json"
        await save_upload(file, src)
        read_pdf(src)
        doc = fitz.open(src)
        pages = []
        for index, page in enumerate(doc):
            blocks = []
            for block in page.get_text("blocks"):
                if len(block) >= 5 and str(block[4]).strip():
                    blocks.append({
                        "x0": round(block[0], 2), "y0": round(block[1], 2),
                        "x1": round(block[2], 2), "y1": round(block[3], 2),
                        "text": str(block[4]).strip(),
                    })
            pages.append({"page": index + 1, "width": round(page.rect.width, 2), "height": round(page.rect.height, 2), "blocks": blocks})
        out.write_text(json.dumps({"file": Path(file.filename).name, "page_count": len(doc), "pages": pages}, ensure_ascii=False, indent=2), encoding="utf-8")
        return FileResponse(str(out), media_type="application/json", filename="NIROJ-Text.json", background=BackgroundTask(cleanup_job, job))
    finally:
        if doc is not None:
            doc.close()
        await file.close()


# ============================================================
# EXTRACT PDF TABLES AS CSV
# ============================================================

@app.post("/api/pdf-to-csv")
async def pdf_to_csv(file: UploadFile = File(...)):
    import csv
    validate_pdf_upload(file)
    job = create_job()
    try:
        src, out = job / "input.pdf", job / "NIROJ-Tables.csv"
        await save_upload(file, src)
        read_pdf(src)
        rows_written = 0
        with pdfplumber.open(src) as pdf, open(out, "w", newline="", encoding="utf-8-sig") as stream:
            writer = csv.writer(stream)
            writer.writerow(["page", "table", "row", "column", "value"])
            for page_number, page in enumerate(pdf.pages, start=1):
                for table_number, table in enumerate(page.extract_tables() or [], start=1):
                    for row_number, row in enumerate(table, start=1):
                        for column_number, value in enumerate(row or [], start=1):
                            if value is not None and str(value).strip():
                                writer.writerow([page_number, table_number, row_number, column_number, str(value).strip()])
                                rows_written += 1
        if rows_written == 0:
            raise HTTPException(status_code=422, detail="No extractable tables were found in this PDF.")
        return FileResponse(str(out), media_type="text/csv; charset=utf-8", filename="NIROJ-Tables.csv", background=BackgroundTask(cleanup_job, job))
    finally:
        await file.close()


# ============================================================
# ADD PDF BOOKMARKS FROM PAGE:TITLE LINES
# ============================================================

@app.post("/api/add-bookmarks")
async def add_pdf_bookmarks(file: UploadFile = File(...), bookmarks: str = Form(...)):
    validate_pdf_upload(file)
    job = create_job()
    doc = None
    try:
        src, out = job / "input.pdf", job / "bookmarked.pdf"
        await save_upload(file, src)
        read_pdf(src)
        doc = fitz.open(src)
        toc = []
        for line in bookmarks.splitlines():
            if not line.strip():
                continue
            if ":" not in line:
                raise HTTPException(status_code=400, detail="Use one bookmark per line in page:title format, e.g. 1:Introduction")
            page_text, title = line.split(":", 1)
            try:
                page_number = int(page_text.strip())
            except ValueError:
                raise HTTPException(status_code=400, detail="Bookmark page numbers must be whole numbers.")
            if page_number < 1 or page_number > len(doc) or not title.strip():
                raise HTTPException(status_code=400, detail=f"Invalid bookmark. Pages must be 1 to {len(doc)} and titles cannot be empty.")
            toc.append([1, title.strip()[:200], page_number])
        if not toc:
            raise HTTPException(status_code=400, detail="Enter at least one bookmark.")
        doc.set_toc(toc)
        doc.save(out, garbage=4, deflate=True)
        return pdf_response(out, "NIROJ-Bookmarks-Added.pdf")
    finally:
        if doc is not None:
            doc.close()
        await file.close()


# ============================================================
# ADD BATES NUMBERING
# ============================================================

@app.post("/api/bates-numbering")
async def bates_numbering(file: UploadFile = File(...), prefix: str = Form(""), start: int = Form(1), digits: int = Form(6)):
    validate_pdf_upload(file)
    if start < 0 or start > 999999999 or digits < 1 or digits > 9:
        raise HTTPException(status_code=400, detail="Start must be 0–999999999 and digits must be 1–9.")
    job = create_job()
    doc = None
    try:
        src, out = job / "input.pdf", job / "bates-numbered.pdf"
        await save_upload(file, src)
        read_pdf(src)
        doc = fitz.open(src)
        for index, page in enumerate(doc):
            label = f"{prefix[:20]}{start + index:0{digits}d}"
            page.insert_text((page.rect.width - 150, page.rect.height - 24), label, fontsize=9, color=(0, 0, 0))
        doc.save(out, garbage=4, deflate=True)
        return pdf_response(out, "NIROJ-Bates-Numbered.pdf")
    finally:
        if doc is not None:
            doc.close()
        await file.close()


# ============================================================
# CONVERT PDF PAGES TO TIFF ARCHIVE
# ============================================================

@app.post("/api/pdf-to-tiff")
async def pdf_to_tiff(file: UploadFile = File(...)):
    validate_pdf_upload(file)
    job = create_job()
    doc = None
    try:
        src, out = job / "input.pdf", job / "NIROJ-TIFF-Pages.zip"
        await save_upload(file, src)
        read_pdf(src)
        doc = fitz.open(src)
        if len(doc) > 200:
            raise HTTPException(status_code=413, detail="TIFF conversion is limited to 200 pages per file.")
        with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            for index, page in enumerate(doc):
                pix = page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False)
                image = Image.open(io.BytesIO(pix.tobytes("png")))
                buffer = io.BytesIO()
                image.save(buffer, format="TIFF", compression="tiff_deflate")
                archive.writestr(f"page-{index + 1:04d}.tiff", buffer.getvalue())
        return FileResponse(str(out), media_type="application/zip", filename="NIROJ-TIFF-Pages.zip", background=BackgroundTask(cleanup_job, job))
    finally:
        if doc is not None:
            doc.close()
        await file.close()


# ============================================================
# CONVERT PDF PAGES TO BMP ARCHIVE
# ============================================================

@app.post("/api/pdf-to-bmp")
async def pdf_to_bmp(file: UploadFile = File(...)):
    validate_pdf_upload(file)
    job = create_job()
    doc = None
    try:
        src, out = job / "input.pdf", job / "NIROJ-BMP-Pages.zip"
        await save_upload(file, src)
        read_pdf(src)
        doc = fitz.open(src)
        if len(doc) > 200:
            raise HTTPException(status_code=413, detail="BMP conversion is limited to 200 pages per file.")
        with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            for index, page in enumerate(doc):
                pix = page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False)
                image = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
                buffer = io.BytesIO()
                image.save(buffer, format="BMP")
                archive.writestr(f"page-{index + 1:04d}.bmp", buffer.getvalue())
        return FileResponse(str(out), media_type="application/zip", filename="NIROJ-BMP-Pages.zip", background=BackgroundTask(cleanup_job, job))
    finally:
        if doc is not None:
            doc.close()
        await file.close()


# ============================================================
# SPLIT PDF USING EXISTING BOOKMARKS
# ============================================================

@app.post("/api/split-by-bookmarks")
async def split_pdf_by_bookmarks(file: UploadFile = File(...)):
    validate_pdf_upload(file)
    job = create_job()
    doc = None
    try:
        src, out = job / "input.pdf", job / "NIROJ-Bookmark-Sections.zip"
        await save_upload(file, src)
        read_pdf(src)
        doc = fitz.open(src)
        toc = doc.get_toc()
        if not toc:
            raise HTTPException(status_code=422, detail="This PDF has no bookmarks to split by.")
        starts = sorted(set(max(1, min(len(doc), int(item[2]))) for item in toc if len(item) >= 3 and int(item[2]) > 0))
        if not starts:
            raise HTTPException(status_code=422, detail="No valid bookmark destinations were found.")
        with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            for index, start_page in enumerate(starts):
                end_page = starts[index + 1] - 1 if index + 1 < len(starts) else len(doc)
                section = fitz.open()
                section.insert_pdf(doc, from_page=start_page - 1, to_page=end_page - 1)
                buffer = section.tobytes(garbage=4, deflate=True)
                section.close()
                title = next((str(item[1]) for item in toc if int(item[2]) == start_page), f"Section-{index + 1}")
                safe_title = "".join(ch if ch.isalnum() or ch in "-_" else "_" for ch in title)[:60] or f"Section-{index + 1}"
                archive.writestr(f"{index + 1:02d}-{safe_title}.pdf", buffer)
        return FileResponse(str(out), media_type="application/zip", filename="NIROJ-Bookmark-Sections.zip", background=BackgroundTask(cleanup_job, job))
    finally:
        if doc is not None:
            doc.close()
        await file.close()


# ============================================================
# CONVERT PDF TEXT TO MARKDOWN
# ============================================================

@app.post("/api/pdf-to-markdown")
async def pdf_to_markdown(file: UploadFile = File(...)):
    validate_pdf_upload(file)
    job = create_job()
    doc = None
    try:
        src, out = job / "input.pdf", job / "NIROJ-Text.md"
        await save_upload(file, src)
        read_pdf(src)
        doc = fitz.open(src)
        parts = [f"# Extracted content: {Path(file.filename).stem}\n"]
        for index, page in enumerate(doc, start=1):
            parts.append(f"\n## Page {index}\n")
            parts.append(page.get_text("text").strip() or "_No selectable text found on this page._")
        out.write_text("\n".join(parts), encoding="utf-8")
        return FileResponse(str(out), media_type="text/markdown; charset=utf-8", filename="NIROJ-Text.md", background=BackgroundTask(cleanup_job, job))
    finally:
        if doc is not None:
            doc.close()
        await file.close()


# ============================================================
# REMOVE EMBEDDED FILE ATTACHMENTS
# ============================================================

@app.post("/api/remove-attachments")
async def remove_pdf_attachments(file: UploadFile = File(...)):
    validate_pdf_upload(file)
    job = create_job()
    try:
        src, out = job / "input.pdf", job / "NIROJ-Attachments-Removed.pdf"
        await save_upload(file, src)
        read_pdf(src)
        doc = fitz.open(src)
        for attachment_name in list(doc.embfile_names()):
            doc.embfile_del(attachment_name)
        doc.save(out, garbage=4, deflate=True)
        return pdf_response(out, "NIROJ-Attachments-Removed.pdf")
    finally:
        if 'doc' in locals() and doc is not None:
            doc.close()
        await file.close()


# ============================================================
# ADD TEXT BACKGROUND / WATERMARK-LIKE PAGE BACKGROUND
# ============================================================

@app.post("/api/add-background")
async def add_pdf_background(file: UploadFile = File(...), text: str = Form("DRAFT"), color: str = Form("#E5E7EB")):
    validate_pdf_upload(file)
    if len(text) > 60 or not text.strip():
        raise HTTPException(status_code=400, detail="Enter background text up to 60 characters.")
    colors = {"#E5E7EB": (0.90, 0.91, 0.92), "#FDE68A": (0.99, 0.90, 0.54), "#DBEAFE": (0.86, 0.92, 0.99), "#FEE2E2": (1.0, 0.88, 0.88)}
    if color not in colors:
        raise HTTPException(status_code=400, detail="Choose one of the supported background colors.")
    job = create_job()
    doc = None
    try:
        src, out = job / "input.pdf", job / "background.pdf"
        await save_upload(file, src)
        read_pdf(src)
        doc = fitz.open(src)
        for page in doc:
            rect = page.rect
            page.draw_rect(rect, color=None, fill=colors[color], overlay=False)
            page.insert_textbox(fitz.Rect(30, rect.height / 2 - 40, rect.width - 30, rect.height / 2 + 40), text.strip(), fontsize=34, color=(0.55, 0.55, 0.55), align=1, rotate=0, overlay=True)
        doc.save(out, garbage=4, deflate=True)
        return pdf_response(out, "NIROJ-Background.pdf")
    finally:
        if doc is not None:
            doc.close()
        await file.close()


# ============================================================
# EXTRACT PDF PAGE IMAGES AS INDIVIDUAL FILES
# ============================================================

@app.post("/api/extract-page-images")
async def extract_pdf_page_images(file: UploadFile = File(...)):
    validate_pdf_upload(file)
    job = create_job()
    doc = None
    try:
        src, out = job / "input.pdf", job / "NIROJ-Page-Images.zip"
        await save_upload(file, src)
        read_pdf(src)
        doc = fitz.open(src)
        with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            count = 0
            for page_index, page in enumerate(doc):
                for image_index, item in enumerate(page.get_images(full=True), start=1):
                    xref = item[0]
                    extracted = doc.extract_image(xref)
                    ext = extracted.get("ext", "bin")
                    archive.writestr(f"page-{page_index + 1:04d}-image-{image_index:03d}.{ext}", extracted["image"])
                    count += 1
        if count == 0:
            raise HTTPException(status_code=422, detail="No embedded images were found in this PDF.")
        return FileResponse(str(out), media_type="application/zip", filename="NIROJ-Page-Images.zip", background=BackgroundTask(cleanup_job, job))
    finally:
        if doc is not None:
            doc.close()
        await file.close()


# ============================================================
# EXTRACT PDF FONTS AS ARCHIVE
# ============================================================

@app.post("/api/extract-fonts")
async def extract_pdf_fonts(file: UploadFile = File(...)):
    validate_pdf_upload(file)
    job = create_job()
    doc = None
    try:
        src, out = job / "input.pdf", job / "NIROJ-Fonts.zip"
        await save_upload(file, src)
        read_pdf(src)
        doc = fitz.open(src)
        found = set()
        with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            for page_index, page in enumerate(doc):
                for font in page.get_fonts(full=True):
                    xref = font[0]
                    if not xref or xref in found:
                        continue
                    found.add(xref)
                    extracted = doc.extract_font(xref)
                    if extracted and extracted[3]:
                        name, ext, _, data = extracted
                        safe_name = "".join(ch if ch.isalnum() or ch in "-_" else "_" for ch in name)[:80]
                        archive.writestr(f"{safe_name or 'font'}-{xref}.{ext}", data)
        if not found:
            raise HTTPException(status_code=422, detail="No extractable embedded fonts were found.")
        return FileResponse(str(out), media_type="application/zip", filename="NIROJ-Fonts.zip", background=BackgroundTask(cleanup_job, job))
    finally:
        if doc is not None:
            doc.close()
        await file.close()
