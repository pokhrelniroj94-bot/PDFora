from __future__ import annotations

import io
import os
import sys
import zipfile
from pathlib import Path

import fitz
from PIL import Image
from pypdf import PdfReader, PdfWriter
from fastapi.testclient import TestClient
import requests

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from main import app  # noqa: E402

class ApiClient:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")

    def post(self, path: str, **kwargs):
        return requests.post(f"{self.base_url}{path}", timeout=180, **kwargs)

    def get(self, path: str, **kwargs):
        return requests.get(f"{self.base_url}{path}", timeout=60, **kwargs)


client = ApiClient(os.environ["PDFORA_API"]) if os.environ.get("PDFORA_API") else TestClient(app)


def make_sample_pdf() -> bytes:
    doc = fitz.open()
    font_path = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
    for number in range(1, 4):
        page = doc.new_page(width=612, height=792)
        text = f"PDFora regression test page {number}\nRevenue 2026\nNorth 100\nSouth 200"
        if font_path.exists():
            page.insert_text((50, 70), text, fontfile=str(font_path), fontname="DejaVu")
        else:
            page.insert_text((50, 70), text)
        if number == 1:
            image = Image.new("RGB", (40, 40), "red")
            image_bytes = io.BytesIO()
            image.save(image_bytes, format="PNG")
            page.insert_image(fitz.Rect(50, 150, 90, 190), stream=image_bytes.getvalue())
            page.insert_link({"kind": fitz.LINK_URI, "from": fitz.Rect(50, 200, 150, 220), "uri": "https://example.com"})
            page.add_text_annot((200, 200), "PDFora annotation")
        page.insert_text((58, 270), "Region")
        page.insert_text((158, 270), "Sales")
        page.insert_text((58, 300), "North")
        page.insert_text((158, 300), "100")
        page.insert_text((58, 330), "South")
        page.insert_text((158, 330), "200")
        page.draw_line((50, 250), (250, 250))
        page.draw_line((50, 280), (250, 280))
        page.draw_line((50, 310), (250, 310))
        page.draw_line((50, 340), (250, 340))
        page.draw_line((50, 250), (50, 340))
        page.draw_line((150, 250), (150, 340))
        page.draw_line((250, 250), (250, 340))
    doc.new_page(width=612, height=792)  # A real blank page exercises blank-page removal.
    result = doc.tobytes(garbage=4, deflate=True)
    doc.close()
    reader = PdfReader(io.BytesIO(result))
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    writer.add_outline_item("Introduction", 0)
    writer.add_outline_item("Second section", 1)
    writer.add_attachment("sample.txt", b"PDFora attachment regression fixture")
    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def make_encrypted_pdf(pdf_bytes: bytes, password: str = "PDFora-Test-Password") -> bytes:
    reader = PdfReader(io.BytesIO(pdf_bytes))
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    writer.encrypt(user_password=password, owner_password=password)
    out = io.BytesIO()
    writer.write(out)
    return out.getvalue()


def post_pdf(path: str, pdf_bytes: bytes, *, field: str = "file", data=None, params=None):
    return client.post(
        path,
        files={field: ("regression.pdf", pdf_bytes, "application/pdf")},
        data=data or {},
        params=params or {},
    )


def test_all_available_pdf_tools_process_a_realistic_pdf():
    pdf = make_sample_pdf()
    encrypted = make_encrypted_pdf(pdf)
    png = Image.new("RGB", (64, 64), "blue")
    png_bytes = io.BytesIO()
    png.save(png_bytes, format="PNG")

    cases = [
        ("merge", lambda: client.post("/api/merge", files=[
            ("files", ("one.pdf", pdf, "application/pdf")),
            ("files", ("two.pdf", pdf, "application/pdf")),
        ])),
        ("split", lambda: post_pdf("/api/split", pdf, params={"start_page": 1, "end_page": 2})),
        ("compress", lambda: post_pdf("/api/compress", pdf)),
        ("images-to-pdf", lambda: client.post("/api/images-to-pdf", files=[
            ("files", ("image.png", png_bytes.getvalue(), "image/png")),
        ])),
        ("pdf-to-jpg", lambda: post_pdf("/api/pdf-to-jpg", pdf)),
        ("rotate", lambda: post_pdf("/api/rotate", pdf, params={"degrees": 90})),
        ("delete-pages", lambda: post_pdf("/api/delete-pages", pdf, data={"pages": "3"})),
        ("extract-pages", lambda: post_pdf("/api/extract-pages", pdf, data={"pages": "1,3"})),
        ("watermark", lambda: post_pdf("/api/watermark", pdf, data={"text": "PDFora"})),
        ("pdf-to-excel", lambda: post_pdf("/api/pdf-to-excel", pdf)),
        ("pdf-to-word", lambda: post_pdf("/api/pdf-to-word", pdf)),
        ("reorder", lambda: post_pdf("/api/reorder", pdf, data={"order": "4,3,2,1"})),
        ("page-numbers", lambda: post_pdf("/api/page-numbers", pdf)),
        ("crop", lambda: post_pdf("/api/crop", pdf)),
        ("header-footer", lambda: post_pdf("/api/header-footer", pdf, data={"header": "PDFora"})),
        ("protect", lambda: post_pdf("/api/protect", pdf, data={"password": "PDFora-Test-Password"})),
        ("unlock", lambda: post_pdf("/api/unlock", encrypted, data={"password": "PDFora-Test-Password"})),
        ("sign", lambda: post_pdf("/api/sign", pdf, data={"signature_text": "PDFora Test"})),
        ("pdf-to-png", lambda: post_pdf("/api/pdf-to-png", pdf)),
        ("pdf-to-webp", lambda: post_pdf("/api/pdf-to-webp", pdf, data={"quality": "85"})),
        ("pdf-to-text", lambda: post_pdf("/api/pdf-to-text", pdf)),
        ("grayscale", lambda: post_pdf("/api/grayscale", pdf)),
        ("flatten", lambda: post_pdf("/api/flatten", pdf)),
        ("metadata", lambda: post_pdf("/api/metadata", pdf, data={"title": "Regression", "author": "PDFora"})),
        ("repair", lambda: post_pdf("/api/repair", pdf)),
        ("pdf-to-html", lambda: post_pdf("/api/pdf-to-html", pdf)),
        ("extract-images", lambda: post_pdf("/api/extract-images", pdf)),
        ("remove-blank-pages", lambda: post_pdf("/api/remove-blank-pages", pdf)),
        ("compare", lambda: client.post("/api/compare", files=[
            ("files", ("one.pdf", pdf, "application/pdf")),
            ("files", ("two.pdf", pdf, "application/pdf")),
        ])),
        ("add-blank-pages", lambda: post_pdf("/api/add-blank-pages", pdf, data={"count": "1"})),
        ("rotate-selected-pages", lambda: post_pdf("/api/rotate-selected-pages", pdf, data={"pages": "all", "degrees": "90"})),
        ("remove-annotations", lambda: post_pdf("/api/remove-annotations", pdf)),
        ("remove-links", lambda: post_pdf("/api/remove-links", pdf)),
        ("page-counter", lambda: post_pdf("/api/page-counter", pdf)),
        ("pdf-info", lambda: post_pdf("/api/pdf-info", pdf)),
        ("extract-bookmarks", lambda: post_pdf("/api/extract-bookmarks", pdf)),
        ("remove-metadata", lambda: post_pdf("/api/remove-metadata", pdf)),
        ("pdf-to-json", lambda: post_pdf("/api/pdf-to-json", pdf)),
        ("pdf-to-csv", lambda: post_pdf("/api/pdf-to-csv", pdf)),
        ("add-bookmarks", lambda: post_pdf("/api/add-bookmarks", pdf, data={"bookmarks": "1:Introduction\n2:Second"})),
        ("bates-numbering", lambda: post_pdf("/api/bates-numbering", pdf, data={"prefix": "TEST", "start": "1", "digits": "6"})),
        ("pdf-to-tiff", lambda: post_pdf("/api/pdf-to-tiff", pdf)),
        ("pdf-to-bmp", lambda: post_pdf("/api/pdf-to-bmp", pdf)),
        ("split-by-bookmarks", lambda: post_pdf("/api/split-by-bookmarks", pdf)),
        ("pdf-to-markdown", lambda: post_pdf("/api/pdf-to-markdown", pdf)),
        ("remove-attachments", lambda: post_pdf("/api/remove-attachments", pdf)),
        ("add-background", lambda: post_pdf("/api/add-background", pdf, data={"text": "DRAFT", "color": "#E5E7EB"})),
        ("extract-page-images", lambda: post_pdf("/api/extract-page-images", pdf)),
        ("extract-fonts", lambda: post_pdf("/api/extract-fonts", pdf)),
    ]

    failures = []
    for name, request in cases:
        response = request()
        if response.status_code != 200 or not response.content:
            failures.append(f"{name}: HTTP {response.status_code}: {response.text[:250]}")
    assert not failures, "\n".join(failures)


def test_ocr_is_explicitly_unavailable_not_misreported_as_working():
    response = post_pdf("/api/ocr", make_sample_pdf())
    assert response.status_code == 501
    assert "OCR is not enabled" in response.json()["detail"]


def test_pdf_information_handles_missing_metadata():
    response = post_pdf("/api/pdf-info", make_sample_pdf())
    assert response.status_code == 200
    report = response.content.decode("utf-8")
    assert "Page count: 4" in report
    assert "Title: Not set" in report
    assert "Author: Not set" in report


def test_protect_pdf_encrypts_and_preserves_pages():
    response = post_pdf("/api/protect", make_sample_pdf(), data={"password": "PDFora-Test-Password"})
    assert response.status_code == 200
    reader = PdfReader(io.BytesIO(response.content))
    assert reader.is_encrypted
    assert reader.decrypt("PDFora-Test-Password")
    assert len(reader.pages) == 4


def test_invalid_pdf_is_rejected():
    response = client.post(
        "/api/pdf-info",
        files={"file": ("not-a-pdf.pdf", b"this is not a PDF", "application/pdf")},
    )
    assert response.status_code == 400


def test_api_directory_includes_every_operational_tool():
    response = client.get("/api")
    assert response.status_code == 200
    tools = response.json()["tools"]
    assert len(tools) == len(set(tools))
    assert "pdf-to-excel" in tools
    assert "ocr" not in tools
    assert len(tools) == 49



def test_security_headers_are_present_on_api_responses():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.headers.get("x-content-type-options") == "nosniff"
    assert response.headers.get("x-frame-options") == "DENY"
    assert response.headers.get("referrer-policy") == "strict-origin-when-cross-origin"
    assert "frame-ancestors 'none'" in response.headers.get("content-security-policy", "")


def test_cleanup_endpoint_is_not_public_without_admin_secret(monkeypatch):
    monkeypatch.delenv("CLEANUP_ADMIN_TOKEN", raising=False)
    response = client.post("/api/cleanup")
    assert response.status_code == 404


def test_non_pdf_mime_type_is_rejected_before_processing():
    response = client.post(
        "/api/pdf-info",
        files={"file": ("not-a-pdf.pdf", b"%PDF-1.7\n", "text/html")},
    )
    assert response.status_code == 415


def test_images_to_pdf_rejects_svg_upload():
    response = client.post(
        "/api/images-to-pdf",
        files={"files": ("image.svg", b"<svg xmlns='http://www.w3.org/2000/svg'></svg>", "image/svg+xml")},
    )
    assert response.status_code == 415
