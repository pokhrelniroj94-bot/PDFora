import io, os, sys, time, zipfile, json
import requests
import fitz
from PIL import Image
from pypdf import PdfReader, PdfWriter

BASE = os.environ.get("PDFORA_API", "https://pdfora-493r.onrender.com").rstrip("/")
results = []

def make_pdf():
    doc = fitz.open()
    img = Image.new("RGB", (120, 80), "white")
    import PIL.ImageDraw
    d = PIL.ImageDraw.Draw(img)
    d.rectangle((5, 5, 115, 75), outline="black", width=2)
    d.text((15, 30), "PDFora", fill="black")
    ib = io.BytesIO()
    img.save(ib, format="PNG")
    for n in range(3):
        p = doc.new_page(width=595, height=842)
        if n == 0:
            p.insert_text((60, 60), "PDFora Smoke Test\nIntroduction", fontsize=16)
            p.insert_image(fitz.Rect(60, 100, 180, 180), stream=ib.getvalue())
            p.draw_rect(fitz.Rect(60, 220, 300, 300), color=(0,0,0), width=1)
            p.draw_line((60, 245), (300, 245), color=(0,0,0))
            p.draw_line((180, 220), (180, 300), color=(0,0,0))
            p.insert_text((70, 237), "Name", fontsize=9)
            p.insert_text((190, 237), "Value", fontsize=9)
            p.insert_text((70, 260), "Alpha", fontsize=9)
            p.insert_text((190, 260), "100", fontsize=9)
            p.insert_text((70, 280), "Beta", fontsize=9)
            p.insert_text((190, 280), "200", fontsize=9)
            p.insert_link({"kind": fitz.LINK_URI, "from": fitz.Rect(60, 320, 180, 340), "uri": "https://example.com"})
            p.add_highlight_annot(fitz.Rect(60, 45, 150, 65))
        elif n == 1:
            p.insert_text((60, 60), "Second page - PDFora sample content", fontsize=14)
        # page 3 intentionally blank
    doc.set_toc([[1, "Introduction", 1], [1, "Second", 2]])
    doc.embfile_add("sample.txt", b"PDFora attachment sample", filename="sample.txt")
    raw = doc.tobytes(garbage=4, deflate=True)
    doc.close()
    return raw, ib.getvalue()

PDF, PNG = make_pdf()
reader = PdfReader(io.BytesIO(PDF))
writer = PdfWriter()
for page in reader.pages: writer.add_page(page)
writer.encrypt("smoke-pass")
enc = io.BytesIO()
writer.write(enc)
ENCRYPTED = enc.getvalue()

def run(name, path, fields=None, params=None, expected=(200,), file_field="file", files_override=None):
    fields = fields or {}
    if files_override is not None:
        uploads = files_override
    elif file_field == "files":
        uploads = [("files", ("sample-a.pdf", PDF, "application/pdf")),
                   ("files", ("sample-b.pdf", PDF, "application/pdf"))]
    else:
        data = ENCRYPTED if name == "unlock" else PDF
        uploads = [(file_field, ("sample.pdf", data, "application/pdf"))]
    try:
        r = requests.post(BASE + path, files=uploads, data=fields, params=params or {}, timeout=(30,180))
        ok = r.status_code in expected and len(r.content) > 0
        # Check common binary response formats are not empty/error HTML.
        if ok and r.status_code == 200:
            ct = r.headers.get("content-type", "")
            if "application/pdf" in ct and not r.content.startswith(b"%PDF-"):
                ok = False
            if "application/zip" in ct:
                try:
                    with zipfile.ZipFile(io.BytesIO(r.content)) as z: z.testzip()
                except Exception: ok = False
        results.append((name, r.status_code, "PASS" if ok else "FAIL", r.headers.get("content-type",""), (r.text[:180] if not ok else "")))
    except Exception as e:
        results.append((name, 0, "FAIL", "", str(e)[:180]))

def getcheck():
    for path, name in [("/", "root"), ("/health", "health"), ("/api", "api-index")]:
        try:
            r=requests.get(BASE+path, timeout=(30,180))
            ok=r.status_code==200
            if name=="api-index":
                data=r.json()
                ok=ok and len(data.get("tools",[]))==50
            results.append((name,r.status_code,"PASS" if ok else "FAIL",r.headers.get("content-type",""),"" if ok else r.text[:180]))
        except Exception as e: results.append((name,0,"FAIL","",str(e)[:180]))

getcheck()
run("merge","/api/merge",file_field="files")
run("split","/api/split",params={"start_page":1,"end_page":2})
run("compress","/api/compress")
run("images-to-pdf","/api/images-to-pdf",files_override=[("files",("sample.png",PNG,"image/png"))])
run("pdf-to-jpg","/api/pdf-to-jpg")
run("rotate","/api/rotate",params={"degrees":90})
run("delete-pages","/api/delete-pages",fields={"pages":"3"})
run("extract-pages","/api/extract-pages",fields={"pages":"1,2"})
run("watermark","/api/watermark",fields={"text":"PDFora TEST"})
run("pdf-to-excel","/api/pdf-to-excel",expected=(200,422))
run("pdf-to-word","/api/pdf-to-word")
run("reorder","/api/reorder",fields={"order":"2,1,3"})
run("page-numbers","/api/page-numbers")
run("crop","/api/crop")
run("header-footer","/api/header-footer",fields={"header":"PDFora header","footer":"PDFora footer"})
run("protect","/api/protect",fields={"password":"smoke-pass"})
run("unlock","/api/unlock",fields={"password":"smoke-pass"})
run("sign","/api/sign",fields={"signature_text":"PDFora test signature"})
run("pdf-to-png","/api/pdf-to-png")
run("pdf-to-webp","/api/pdf-to-webp",fields={"quality":"85"})
run("pdf-to-text","/api/pdf-to-text")
run("grayscale","/api/grayscale")
run("flatten","/api/flatten")
run("metadata","/api/metadata",fields={"title":"PDFora test","author":"Smoke test"})
run("repair","/api/repair")
run("ocr","/api/ocr",expected=(501,))
run("pdf-to-html","/api/pdf-to-html")
run("extract-images","/api/extract-images")
run("remove-blank-pages","/api/remove-blank-pages",fields={"threshold":"2"})
run("compare","/api/compare",file_field="files")
run("add-blank-pages","/api/add-blank-pages",fields={"count":"1"})
run("rotate-selected-pages","/api/rotate-selected-pages",fields={"pages":"1","degrees":"90"})
run("remove-annotations","/api/remove-annotations")
run("remove-links","/api/remove-links")
run("page-counter","/api/page-counter")
run("pdf-info","/api/pdf-info")
run("extract-bookmarks","/api/extract-bookmarks")
run("remove-metadata","/api/remove-metadata")
run("pdf-to-json","/api/pdf-to-json")
run("pdf-to-csv","/api/pdf-to-csv",expected=(200,422))
run("add-bookmarks","/api/add-bookmarks",fields={"bookmarks":"1:Introduction\n2:Second"})
run("bates-numbering","/api/bates-numbering",fields={"prefix":"TEST","start":"1","digits":"6"})
run("pdf-to-tiff","/api/pdf-to-tiff")
run("pdf-to-bmp","/api/pdf-to-bmp")
run("split-by-bookmarks","/api/split-by-bookmarks")
run("pdf-to-markdown","/api/pdf-to-markdown")
run("remove-attachments","/api/remove-attachments")
run("add-background","/api/add-background",fields={"text":"DRAFT","color":"#E5E7EB"})
run("extract-page-images","/api/extract-page-images")
run("extract-fonts","/api/extract-fonts")

print("BASE", BASE)
print("RESULTS")
for row in results: print("|".join(map(str,row)))
bad=[x for x in results if x[2]=="FAIL"]
print("SUMMARY",json.dumps({"total":len(results),"passed":len(results)-len(bad),"failed":len(bad),"failures":[{"tool":x[0],"status":x[1],"detail":x[4]} for x in bad]}))
sys.exit(1 if bad else 0)
