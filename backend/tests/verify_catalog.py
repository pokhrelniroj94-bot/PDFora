#!/usr/bin/env python3
"""Catalog integrity verification for PDFora (49 PDF + 119 utility = 168).

Run from repo root:
  python backend/tests/verify_catalog.py

Does not require network. Validates source catalogs only.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FRONTEND = ROOT / "frontend"
DIR_FILE = FRONTEND / "lib" / "tool-directory.ts"
CATALOG_FILE = FRONTEND / "components" / "toolCatalog.ts"
LEGACY = FRONTEND / "lib" / "legacy-tool-slugs.ts"


def extract_hrefs(text: str) -> list[str]:
    return re.findall(r'href:\s*"(/[^"]+)"', text)


def extract_slugs(text: str) -> list[str]:
    return re.findall(r'slug:\s*"([^"]+)"', text)


def main() -> int:
    errors: list[str] = []
    dir_text = DIR_FILE.read_text(encoding="utf-8")
    cat_text = CATALOG_FILE.read_text(encoding="utf-8")
    leg_text = LEGACY.read_text(encoding="utf-8") if LEGACY.exists() else ""

    pdf_hrefs = extract_hrefs(dir_text)
    pdf_slugs = [h.lstrip("/") for h in pdf_hrefs if h.startswith("/") and not h.startswith("/tools/")]
    pdf_in_alltools = [s for s in pdf_slugs if s != "ocr-pdf"]

    util_slugs = [s for s in extract_slugs(cat_text) if s != "pdf-tools"]
    hub = "pdf-tools" in extract_slugs(cat_text)

    print(f"PDF tools in tool-directory (excl. filtered OCR): {len(pdf_in_alltools)}")
    print(f"Utility tools in toolCatalog (excl. pdf-tools hub): {len(util_slugs)}")
    print(f"pdf-tools hub present: {hub}")
    print(f"Total advertised: {len(pdf_in_alltools) + len(util_slugs)}")

    if len(pdf_in_alltools) != 49:
        errors.append(f"Expected 49 PDF tools, found {len(pdf_in_alltools)}")
    if len(util_slugs) != 119:
        errors.append(f"Expected 119 utility tools, found {len(util_slugs)}")
    if len(pdf_in_alltools) + len(util_slugs) != 168:
        errors.append(
            f"Expected 168 total, found {len(pdf_in_alltools) + len(util_slugs)}"
        )

    if len(set(pdf_in_alltools)) != len(pdf_in_alltools):
        errors.append("Duplicate PDF slugs")
    if len(set(util_slugs)) != len(util_slugs):
        errors.append("Duplicate utility slugs")

    legacy = set(re.findall(r'"([a-z0-9-]+)"', leg_text))
    missing_legacy = [s for s in pdf_in_alltools if s not in legacy and s not in ("watermark",)]
    if missing_legacy:
        errors.append(f"PDF slugs missing from legacyToolSlugs: {missing_legacy[:10]}")

    if errors:
        print("FAIL")
        for e in errors:
            print(" -", e)
        return 1
    print("PASS catalog integrity 49+119=168")
    return 0


if __name__ == "__main__":
    sys.exit(main())
