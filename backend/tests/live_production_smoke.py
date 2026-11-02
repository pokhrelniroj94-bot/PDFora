from __future__ import annotations

import io
import os
import time

import fitz
import requests
from PIL import Image, ImageDraw, ImageFont
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
                    if len(tools) == 50 and "pdf-to-excel" in tools:
                        print("Render backend is updated and exposes all 50 available tools.")
                        return
                    last = f"API tool directory not updated yet: {len(tools)} tools"
        except requests.RequestException as exc:
            last = str(exc)
        print(f"Waiting for Render deploy: {last}")
        time.sleep(15)
    raise RuntimeError(f"Render backend did not reach the expected release within 10 minutes: {last}")


def verify_live_ocr() -> None:
    image = Image.new("RGB", (1500, 420), "white")
    draw = ImageDraw.Draw(image)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 92)
    except OSError:
        font = ImageFont.load_default()
    draw.text((70, 135), "PDFora OCR TEST 2026", fill="black", font=font)
    image_bytes = io.BytesIO()
    image.save(image_bytes, format="PNG")
    response = requests.post(
        f"{BASE}/api/ocr",
        files={"file": ("pdfora-ocr-smoke.png", image_bytes.getvalue(), "image/png")},
        data={"languages": "eng", "output_format": "searchable_pdf"},
        timeout=300,
    )
    if not response.ok or not response.content.startswith(b"%PDF"):
        raise RuntimeError(f"Live OCR endpoint failed: HTTP {response.status_code} {response.text[:250]}")
    result = fitz.open(stream=response.content, filetype="pdf")
    recognized = " ".join(page.get_text() for page in result)
    result.close()
    if "PDFora" not in recognized:
        raise RuntimeError(f"Live OCR output has no searchable text layer: {recognized[:250]}")
    print("Live OCR smoke test passed: searchable text layer detected.")


def main() -> None:
    wait_for_updated_backend()
    environment = os.environ.copy()
    environment["PDFORA_API"] = BASE
    print("Running the complete 50-tool suite against the live Render backend...")
    import subprocess
    import sys
    subprocess.run(
        [sys.executable, "-m", "pytest", "-q", "backend/tests/test_tool_api.py"],
        check=True,
        env=environment,
    )
    verify_live_ocr()


if __name__ == "__main__":
    main()
