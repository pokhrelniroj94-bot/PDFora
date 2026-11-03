from __future__ import annotations

import io
import json
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



def test_spreadsheet_exports_treat_pdf_text_as_literal_not_formula():
    from openpyxl import Workbook
    from main import csv_safe_text, set_literal_cell

    workbook = Workbook()
    cell = set_literal_cell(workbook.active, 1, 1, "=HYPERLINK(\"https://example.com\",\"click\")")
    assert cell.data_type == "s"
    assert cell.value.startswith("=")
    assert csv_safe_text("=1+1") == "'=1+1"
    assert csv_safe_text("  @SUM(A1:A2)") == "'@SUM(A1:A2)"
    assert csv_safe_text("ordinary text") == "ordinary text"


def test_render_matrix_rejects_huge_page_and_bounds_scale():
    from main import safe_render_matrix
    from fastapi import HTTPException

    doc = fitz.open()
    page = doc.new_page(width=612, height=792)
    matrix = safe_render_matrix(page, 3.0, max_pixels=1_000_000)
    assert matrix.a <= 3.0
    assert matrix.a * matrix.d * page.rect.width * page.rect.height <= 1_000_001
    huge = doc.new_page(width=10000, height=10000)
    try:
        safe_render_matrix(huge, 2.0, max_pixels=20_000_000)
    except HTTPException as exc:
        assert exc.status_code == 413
    else:
        raise AssertionError("Oversized page should be rejected")
    doc.close()


def test_bookmark_split_preserves_pages_before_first_bookmark():
    pdf = fitz.open()
    for number in range(1, 5):
        page = pdf.new_page()
        page.insert_text((50, 50), f"Page {number}")
    pdf.set_toc([[1, "Chapter", 3]])
    source = pdf.tobytes()
    pdf.close()
    response = post_pdf("/api/split-by-bookmarks", source)
    assert response.status_code == 200
    with zipfile.ZipFile(io.BytesIO(response.content)) as archive:
        names = archive.namelist()
        assert len(names) == 2
        leading = fitz.open(stream=archive.read(names[0]), filetype="pdf")
        assert len(leading) == 2
        assert "Page 1" in leading[0].get_text()
        assert "Page 2" in leading[1].get_text()
        leading.close()


def test_rotated_page_display_coordinates_round_trip():
    from main import display_point_to_page, display_rect_to_page

    doc = fitz.open()
    for rotation in (0, 90, 180, 270):
        page = doc.new_page(width=612, height=792)
        page.set_rotation(rotation)
        display_point = fitz.Point(36, 24)
        page_point = display_point_to_page(page, display_point.x, display_point.y)
        round_trip = page_point * page.rotation_matrix
        assert abs(round_trip.x - display_point.x) < 0.01
        assert abs(round_trip.y - display_point.y) < 0.01
        display_rect = fitz.Rect(30, 40, 180, 90)
        page_rect = display_rect_to_page(page, display_rect)
        round_trip_rect = page_rect * page.rotation_matrix
        assert abs(round_trip_rect.x0 - display_rect.x0) < 0.01
        assert abs(round_trip_rect.y0 - display_rect.y0) < 0.01
        assert abs(round_trip_rect.x1 - display_rect.x1) < 0.01
        assert abs(round_trip_rect.y1 - display_rect.y1) < 0.01
    doc.close()


def make_rotated_pdf() -> bytes:
    doc = fitz.open()
    for rotation in (0, 90, 180, 270):
        page = doc.new_page(width=612, height=792)
        page.insert_text((50, 730), f"EDGE {rotation}")
        page.set_rotation(rotation)
    result = doc.tobytes()
    doc.close()
    return result


def find_display_text_box(page, text: str) -> fitz.Rect:
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                if text in span["text"]:
                    return fitz.Rect(span["bbox"]) * page.rotation_matrix
    raise AssertionError(f"Expected text {text!r} in PDF output")


def test_rotated_pdf_stamps_and_headers_stay_upright_and_in_visible_positions():
    source = make_rotated_pdf()
    cases = [
        ("/api/page-numbers", {"position": "bottom-center", "start_number": "101"}, "104", "bottom"),
        ("/api/header-footer", {"header": "ROTATED HEADER", "footer": "ROTATED FOOTER"}, "ROTATED FOOTER", "bottom"),
        ("/api/sign", {"signature_text": "PDFora Tester"}, "Electronic visual signature", "bottom"),
        ("/api/bates-numbering", {"prefix": "PDFora", "start": "1", "digits": "6"}, "PDFora000004", "bottom"),
    ]
    for endpoint, data, marker, position in cases:
        response = post_pdf(endpoint, source, data=data)
        assert response.status_code == 200, f"{endpoint}: {response.status_code} {response.text[:200]}"
        result = fitz.open(stream=response.content, filetype="pdf")
        page = result[-1]
        box = find_display_text_box(page, marker)
        assert box.width > box.height, f"{endpoint} text is rotated in the visible page"
        assert box.y0 > page.rect.height * 0.65, f"{endpoint} text is not in the visible bottom area"
        assert box.x0 >= 0 and box.y0 >= 0 and box.x1 <= page.rect.width and box.y1 <= page.rect.height
        result.close()


def test_rotated_watermark_and_background_use_visible_page_geometry():
    source = make_rotated_pdf()
    watermark = post_pdf("/api/watermark", source, data={"text": "PDFORA WATERMARK"})
    assert watermark.status_code == 200
    watermarked = fitz.open(stream=watermark.content, filetype="pdf")
    for page in watermarked:
        box = find_display_text_box(page, "PDFORA WATERMARK")
        center = fitz.Point((box.x0 + box.x1) / 2, (box.y0 + box.y1) / 2)
        assert abs(center.x - page.rect.width / 2) < page.rect.width * 0.2
        assert abs(center.y - page.rect.height / 2) < page.rect.height * 0.2
    watermarked.close()

    background = post_pdf("/api/add-background", source, data={"text": "DRAFT BACKGROUND"})
    assert background.status_code == 200
    background_doc = fitz.open(stream=background.content, filetype="pdf")
    for page in background_doc:
        box = find_display_text_box(page, "DRAFT BACKGROUND")
        assert box.width > box.height, "Background label should remain horizontal on a rotated page"
        assert abs((box.x0 + box.x1) / 2 - page.rect.width / 2) < page.rect.width * 0.2
        assert abs((box.y0 + box.y1) / 2 - page.rect.height / 2) < page.rect.height * 0.2
    background_doc.close()


def test_pdf_to_json_text_coordinates_match_rotated_display_dimensions():
    doc = fitz.open()
    page = doc.new_page(width=612, height=792)
    page.insert_text((50, 730), "Bottom edge text")
    page.set_rotation(90)
    source = doc.tobytes()
    doc.close()
    response = post_pdf("/api/pdf-to-json", source)
    assert response.status_code == 200
    report = json.loads(response.content)
    page_data = report["pages"][0]
    assert page_data["width"] == 792
    assert page_data["height"] == 612
    block = next(item for item in page_data["blocks"] if "Bottom edge text" in item["text"])
    assert 0 <= block["x0"] <= block["x1"] <= page_data["width"]
    assert 0 <= block["y0"] <= block["y1"] <= page_data["height"]


def test_open_pdf_limited_rejects_over_1000_pages():
    from main import open_pdf_limited
    from fastapi import HTTPException

    doc = fitz.open()
    for _ in range(1001):
        doc.new_page()
    data = doc.tobytes()
    doc.close()
    path = Path("page-limit-regression.pdf")
    path.write_bytes(data)
    try:
        try:
            open_pdf_limited(path)
        except HTTPException as exc:
            assert exc.status_code == 413
            assert "1,000 pages" in exc.detail
        else:
            raise AssertionError("PDF over the page limit should be rejected")
    finally:
        path.unlink(missing_ok=True)


def test_nrb_rates_include_previous_published_snapshot(monkeypatch):
    import main

    main._NRB_CACHE.clear()
    calls = []

    def fake_fetch(from_date: str, to_date: str):
        calls.append((from_date, to_date))
        return [
            {
                "date": "2025-01-06",
                "published_on": "2025-01-06T00:00:00Z",
                "rates": [{"currency": {"ISO3": "USD", "name": "US Dollar", "unit": 1}, "buy": "135.00", "sell": "135.60"}],
            },
            {
                "date": "2025-01-03",
                "published_on": "2025-01-03T00:00:00Z",
                "rates": [{"currency": {"ISO3": "USD", "name": "US Dollar", "unit": 1}, "buy": "134.50", "sell": "135.10"}],
            },
        ]

    monkeypatch.setattr(main, "_nrb_fetch_records", fake_fetch)
    response = TestClient(app).get("/api/nepal-forex?date=2025-01-06")
    assert response.status_code == 200
    payload = response.json()
    assert payload["rateDate"] == "2025-01-06"
    assert payload["rates"][0]["buy"] == 135.0
    assert payload["previousRateDate"] == "2025-01-03"
    assert payload["previousRates"][0]["sell"] == 135.1
    assert calls and calls[0][0] == "2024-12-07"

