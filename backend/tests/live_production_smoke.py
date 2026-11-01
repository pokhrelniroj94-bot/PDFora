from __future__ import annotations

import io
import os
import time

import fitz
import requests
from pypdf import PdfReader


BASE = os.environ.get("PDFORA_API", "https://pdfora-493r.onrender.com").rstrip("/")
PASSWORD = "PDFora-Live-Regression-Password"


def sample_pdf() -> bytes:
    doc = fitz.open()
    for index in range(2):
        page = doc.new_page(width=612, height=792)
        page.insert_text((50, 70), f"PDFora live deployment check - page {index + 1}")
    data = doc.tobytes()
    doc.close()
    return data


def wait_for_updated_backend() -> None:
    deadline = time.time() + 600
    last = "No response"
    while time.time() < deadline:
        try:
            health = requests.get(f"{BASE}/health", timeout=15)
            if health.ok:
                api = requests.get(f"{BASE}/api", timeout=15)
                if api.ok:
                    tools = api.json().get("tools", [])
                    if len(tools) == 49 and "pdf-to-excel" in tools:
                        print("Render backend is updated and exposes all 49 available tools.")
                        return
                    last = f"API tool directory not updated yet: {len(tools)} tools"
        except requests.RequestException as exc:
            last = str(exc)
        print(f"Waiting for Render deploy: {last}")
        time.sleep(15)
    raise RuntimeError(f"Render backend did not reach the expected release within 10 minutes: {last}")


def main() -> None:
    wait_for_updated_backend()
    pdf = sample_pdf()
    files = {"file": ("pdfora-live-check.pdf", pdf, "application/pdf")}

    info = requests.post(f"{BASE}/api/pdf-info", files=files, timeout=90)
    info.raise_for_status()
    report = info.content.decode("utf-8", errors="replace")
    assert "Page count: 2" in report, report
    assert "Title: Not set" in report, report
    assert "Author: Not set" in report, report
    print("PASS: PDF Information handles PDFs without metadata.")

    protected = requests.post(
        f"{BASE}/api/protect",
        files=files,
        data={"password": PASSWORD},
        timeout=90,
    )
    protected.raise_for_status()
    assert protected.content.startswith(b"%PDF-"), "Protect PDF did not return a PDF."
    encrypted = PdfReader(io.BytesIO(protected.content))
    assert encrypted.is_encrypted, "Protect PDF output is not encrypted."
    assert encrypted.decrypt(PASSWORD), "Password does not decrypt the protected output."
    assert len(encrypted.pages) == 2, "Protected PDF page count changed."
    print("PASS: Protect PDF encrypts the file and preserves its pages.")

    text_result = requests.post(f"{BASE}/api/pdf-to-text", files=files, timeout=90)
    text_result.raise_for_status()
    assert b"PDFora live deployment check" in text_result.content
    print("PASS: PDF-to-Text extracts selectable text.")

    ocr = requests.post(f"{BASE}/api/ocr", files=files, timeout=90)
    assert ocr.status_code == 501, f"OCR availability changed unexpectedly: {ocr.status_code}"
    print("PASS: OCR is clearly reported as unavailable (HTTP 501), not advertised as operational.")


if __name__ == "__main__":
    main()
