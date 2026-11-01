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
    environment = os.environ.copy()
    environment["PDFORA_API"] = BASE
    print("Running the complete 49-tool suite against the live Render backend...")
    import subprocess
    import sys
    subprocess.run(
        [sys.executable, "-m", "pytest", "-q", "backend/tests/test_tool_api.py"],
        check=True,
        env=environment,
    )


if __name__ == "__main__":
    main()
