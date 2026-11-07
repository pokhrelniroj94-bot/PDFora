from __future__ import annotations

import io
import os
import sys
import zipfile
import pytest
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
    windows_fonts = Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts"
    font_candidates = [
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
        Path("/usr/share/fonts/truetype/freefont/FreeSans.ttf"),
        Path("/usr/share/fonts/opentype/freefont/FreeSans.ttf"),
        windows_fonts / "arial.ttf",
        windows_fonts / "segoeui.ttf",
        Path("/Library/Fonts/Arial.ttf"),
    ]
    font_path = next((candidate for candidate in font_candidates if candidate.is_file()), None)
    for number in range(1, 4):
        page = doc.new_page(width=612, height=792)
        text = f"PDFora regression test page {number}\nRevenue 2026\nNorth 100\nSouth 200"
        if font_path:
            page.insert_text((50, 70), text, fontfile=str(font_path), fontname="PDForaTestFont")
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
    doc.set_toc([[1, "Introduction", 1], [1, "Second section", 2]])
    doc.embfile_add("sample.txt", b"PDFora attachment regression fixture")
    result = doc.tobytes(garbage=4, deflate=True)
    doc.close()
    return result


def make_embedded_font_pdf() -> bytes:
    """Create a minimal PDF that retains a genuinely embedded font."""
    doc = fitz.open()
    windows_fonts = Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts"
    font_candidates = [
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
        Path("/usr/share/fonts/truetype/freefont/FreeSans.ttf"),
        Path("/usr/share/fonts/opentype/freefont/FreeSans.ttf"),
        windows_fonts / "arial.ttf",
        windows_fonts / "segoeui.ttf",
        Path("/Library/Fonts/Arial.ttf"),
    ]
    font_path = next((candidate for candidate in font_candidates if candidate.is_file()), None)
    if font_path is None:
        doc.close()
        pytest.skip("No TrueType font is available to embed in this test environment.")

    page = doc.new_page(width=612, height=792)
    page.insert_text(
        (50, 70),
        "PDFora embedded font extraction regression",
        fontfile=str(font_path),
        fontname="PDForaEmbeddedTestFont",
    )
    result = doc.tobytes(garbage=4, deflate=True)
    doc.close()
    return result


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
        ("extract-fonts", lambda: post_pdf("/api/extract-fonts", make_embedded_font_pdf())),
    ]

    failures = []
    for name, request in cases:
        response = request()
        if response.status_code != 200 or not response.content:
            failures.append(f"{name}: HTTP {response.status_code}: {response.text[:250]}")
            continue

        # Validate the actual response bytes, not only HTTP status and Content-Length.
        content_type = response.headers.get("content-type", "").split(";", 1)[0].lower()
        payload = response.content
        try:
            if content_type == "application/pdf" or payload.startswith(b"%PDF-"):
                reader = PdfReader(io.BytesIO(payload))
                if reader.is_encrypted:
                    if name != "protect" or not reader.decrypt("PDFora-Test-Password"):
                        raise AssertionError("Encrypted PDF output could not be decrypted with the expected test password")
                if not reader.pages:
                    raise AssertionError("PDF contains no pages")
            elif zipfile.is_zipfile(io.BytesIO(payload)):
                with zipfile.ZipFile(io.BytesIO(payload)) as archive:
                    bad_member = archive.testzip()
                    if bad_member:
                        raise AssertionError(f"ZIP CRC check failed for {bad_member}")
                    members = [info for info in archive.infolist() if not info.is_dir()]
                    if not members:
                        raise AssertionError("ZIP archive contains no files")
                    if any(info.file_size == 0 for info in members):
                        raise AssertionError("ZIP archive contains an empty output file")
            elif content_type.startswith("image/"):
                with Image.open(io.BytesIO(payload)) as image:
                    image.verify()
            elif not payload.strip():
                raise AssertionError("Output bytes are empty")
        except Exception as error:
            failures.append(f"{name}: invalid output bytes ({type(error).__name__}: {error})")
    assert not failures, "\n".join(failures)


def test_ocr_is_explicitly_unavailable_not_misreported_as_working():
    response = post_pdf("/api/ocr", make_sample_pdf())
    assert response.status_code == 501
    assert "OCR is not enabled" in response.json()["detail"]


def test_pdf_information_handles_missing_metadata():
    response = post_pdf("/api/pdf-info", make_sample_pdf())
    assert response.status_code == 200
    report = response.content.decode("utf-8")
    assert "Page count: 4\n" in report
    assert "Title: Not set" in report
    assert "Author: Not set" in report
    assert "\\n" not in report


def test_page_counter_report_uses_real_newlines():
    response = post_pdf("/api/page-counter", make_sample_pdf())
    assert response.status_code == 200
    report = response.content.decode("utf-8")
    assert "Total pages: 4\n" in report
    assert "\\n" not in report


def test_extract_bookmarks_report_uses_real_newlines():
    response = post_pdf("/api/extract-bookmarks", make_sample_pdf())
    assert response.status_code == 200
    report = response.content.decode("utf-8")
    assert "Page 1: Introduction\n" in report
    assert "Page 2: Second section\n" in report
    assert "\\n" not in report


def test_extract_page_images_renders_every_page_as_png():
    response = post_pdf("/api/extract-page-images", make_sample_pdf())
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("application/zip")
    with zipfile.ZipFile(io.BytesIO(response.content)) as archive:
        names = sorted(archive.namelist())
        assert names == [f"page-{index:04d}.png" for index in range(1, 5)]
        for name in names:
            with Image.open(io.BytesIO(archive.read(name))) as rendered:
                assert rendered.format == "PNG"
                assert rendered.width > 0 and rendered.height > 0


def test_split_by_bookmarks_creates_valid_sections():
    response = post_pdf("/api/split-by-bookmarks", make_sample_pdf())
    assert response.status_code == 200
    with zipfile.ZipFile(io.BytesIO(response.content)) as archive:
        names = sorted(archive.namelist())
        assert len(names) == 2
        page_counts = [len(PdfReader(io.BytesIO(archive.read(name))).pages) for name in names]
        assert page_counts == [1, 3]


def test_extract_images_returns_embedded_image_files():
    response = post_pdf("/api/extract-images", make_sample_pdf())
    assert response.status_code == 200
    with zipfile.ZipFile(io.BytesIO(response.content)) as archive:
        names = archive.namelist()
        assert names
        image_data = archive.read(names[0])
        with Image.open(io.BytesIO(image_data)) as extracted:
            assert extracted.width == 40 and extracted.height == 40


def test_remove_blank_pages_removes_only_the_empty_page():
    response = post_pdf("/api/remove-blank-pages", make_sample_pdf())
    assert response.status_code == 200
    result = PdfReader(io.BytesIO(response.content))
    assert len(result.pages) == 3


def test_extract_fonts_returns_nonempty_archive_for_embedded_fonts():
    response = post_pdf("/api/extract-fonts", make_embedded_font_pdf())
    assert response.status_code == 200
    with zipfile.ZipFile(io.BytesIO(response.content)) as archive:
        names = archive.namelist()
        assert names
        assert all(archive.read(name) for name in names)


def test_extract_fonts_rejects_non_embedded_standard_fonts():
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 70), "Standard Helvetica is not embedded")
    pdf = doc.tobytes()
    doc.close()
    response = post_pdf("/api/extract-fonts", pdf)
    assert response.status_code == 422
    assert "No extractable embedded fonts" in response.json()["detail"]


def test_pdf_to_csv_exports_detected_table_cells():
    response = post_pdf("/api/pdf-to-csv", make_sample_pdf())
    assert response.status_code == 200
    csv_text = response.content.decode("utf-8-sig")
    assert "Region" in csv_text and "Sales" in csv_text
    assert "North" in csv_text and "South" in csv_text
    assert "100" in csv_text and "200" in csv_text


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



def test_fake_pdf_extension_is_rejected_before_processing():
    response = client.post(
        "/api/pdf-info",
        files={
            "file": (
                "not-really-a-pdf.pdf",
                b"MZ" + bytes([0x90, 0x00]) + b"This is not a PDF",
                "application/pdf",
            )
        },
    )
    assert response.status_code == 400
    assert "PDF" in response.json()["detail"]


def test_empty_upload_is_rejected():
    response = client.post(
        "/api/pdf-info",
        files={"file": ("empty.pdf", b"", "application/pdf")},
    )
    assert response.status_code == 400


def test_rate_limit_returns_429_for_api_post(monkeypatch):
    from main import _LOCAL_RATE_LIMITS, app
    from fastapi.testclient import TestClient

    _LOCAL_RATE_LIMITS.clear()
    monkeypatch.setattr("main.RATE_LIMIT_PER_ROUTE_PER_MINUTE", 1)
    monkeypatch.setattr("main.RATE_LIMIT_PER_IP_PER_HOUR", 100)

    local_client = TestClient(app)
    first = local_client.post("/api/rate-limit-probe")
    second = local_client.post("/api/rate-limit-probe")

    assert first.status_code == 404
    assert second.status_code == 429
    assert second.headers.get("retry-after") == "60"
    _LOCAL_RATE_LIMITS.clear()



def test_premium_redesign_preview_origin_is_allowed_by_cors():
    origin = "https://pd-fora-git-premium-redesign-pokhrelniroj94-7012s-projects.vercel.app"
    response = TestClient(app).options(
        "/api/merge",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == origin


def test_current_and_future_project_vercel_preview_origins_are_allowed_by_cors():
    from fastapi.testclient import TestClient

    allowed_origin = "https://pd-fora-k13ztdyzf-pokhrelniroj94-7012s-projects.vercel.app"
    response = TestClient(app).options(
        "/api/merge",
        headers={
            "Origin": allowed_origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == allowed_origin

    hostile_origin = "https://pd-fora-preview-pokhrelniroj94-7012s-projects.vercel.app.attacker.test"
    hostile = TestClient(app).options(
        "/api/merge",
        headers={
            "Origin": hostile_origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert hostile.headers.get("access-control-allow-origin") != hostile_origin


def test_backend_security_headers_are_present():
    response = TestClient(app).get("/health")
    assert response.status_code == 200
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"
    assert response.headers["referrer-policy"] == "strict-origin-when-cross-origin"
    assert "frame-ancestors 'none'" in response.headers["content-security-policy"]


def test_root_does_not_disclose_internal_name_or_version():
    response = TestClient(app).get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_temp_job_is_removed_after_file_response():
    from main import TEMP_DIR

    before = set(TEMP_DIR.iterdir())
    response = TestClient(app).post(
        "/api/pdf-info",
        files={"file": ("sample.pdf", make_sample_pdf(), "application/pdf")},
    )
    assert response.status_code == 200
    after = set(TEMP_DIR.iterdir())
    assert after == before



def test_render_client_ip_prefers_cloudflare_visitor_ip(monkeypatch):
    from main import _client_ip
    from starlette.requests import Request

    monkeypatch.setenv("RENDER", "true")
    scope = {
        "type": "http",
        "method": "POST",
        "path": "/api/pdf-info",
        "headers": [
            (b"cf-connecting-ip", b"203.0.113.7"),
            (b"x-forwarded-for", b"198.51.100.8, 192.0.2.9"),
        ],
        "client": ("10.0.0.1", 1234),
        "server": ("testserver", 80),
        "scheme": "https",
        "query_string": b"",
        "root_path": "",
        "http_version": "1.1",
    }
    request = Request(scope)
    assert _client_ip(request) == "203.0.113.7"



def test_local_api_docs_remain_accessible():
    response = TestClient(app).get("/docs")
    assert response.status_code == 200
    assert "content-security-policy" not in response.headers


def test_non_pdf_mime_type_is_rejected_before_processing():
    response = client.post(
        "/api/pdf-info",
        files={"file": ("sample.pdf", make_sample_pdf(), "text/html")},
    )
    assert response.status_code == 415


def test_images_to_pdf_rejects_svg_upload():
    response = client.post(
        "/api/images-to-pdf",
        files={"files": ("image.svg", b"<svg xmlns='http://www.w3.org/2000/svg'></svg>", "image/svg+xml")},
    )
    assert response.status_code == 415


def test_cleanup_endpoint_is_not_public_without_admin_secret(monkeypatch):
    monkeypatch.delenv("CLEANUP_ADMIN_TOKEN", raising=False)
    response = TestClient(app).post("/api/cleanup")
    assert response.status_code == 404
