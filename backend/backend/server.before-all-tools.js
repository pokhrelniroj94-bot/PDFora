const express = require("express");
const cors = require("cors");
const multer = require("multer");
const {
  PDFDocument,
  degrees,
} = require("pdf-lib");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, "uploads");
const processedDir = path.join(__dirname, "processed");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

function cleanup(file) {
  if (file && file.path && fs.existsSync(file.path)) {
    try {
      fs.unlinkSync(file.path);
    } catch {}
  }
}

function sendPDF(res, pdfBytes, filename) {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}"`
  );
  res.send(Buffer.from(pdfBytes));
}

app.get("/", (req, res) => {
  res.json({
    message: "PDFora Backend is running successfully!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "PDFora API is healthy",
  });
});

/* MERGE PDF */
app.post(
  "/api/merge",
  upload.array("files", 50),
  async (req, res) => {
    try {
      if (!req.files || req.files.length < 2) {
        return res.status(400).json({
          detail: "Please select at least 2 PDF files.",
        });
      }

      const mergedPdf = await PDFDocument.create();

      for (const file of req.files) {
        const bytes = fs.readFileSync(file.path);
        const pdf = await PDFDocument.load(bytes);

        const pages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );

        pages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const result = await mergedPdf.save();

      req.files.forEach(cleanup);

      sendPDF(
        res,
        result,
        "PDFora-Merged.pdf"
      );
    } catch (error) {
      console.error(error);

      if (req.files) {
        req.files.forEach(cleanup);
      }

      res.status(500).json({
        detail: "Could not merge PDF files.",
      });
    }
  }
);

/* DELETE PAGES */
app.post(
  "/api/delete-pages",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          detail: "Please select a PDF file.",
        });
      }

      const pagesText = String(
        req.body.pages || ""
      ).trim();

      if (!pagesText) {
        cleanup(req.file);

        return res.status(400).json({
          detail: "Enter pages to delete, for example 2,4,7.",
        });
      }

      const deletePages = pagesText
        .split(",")
        .map((x) => Number(x.trim()))
        .filter((x) => Number.isInteger(x) && x > 0);

      const input = fs.readFileSync(req.file.path);

      const sourcePdf = await PDFDocument.load(input);
      const outputPdf = await PDFDocument.create();

      const total = sourcePdf.getPageCount();

      for (let i = 0; i < total; i++) {
        const pageNumber = i + 1;

        if (!deletePages.includes(pageNumber)) {
          const [page] = await outputPdf.copyPages(
            sourcePdf,
            [i]
          );

          outputPdf.addPage(page);
        }
      }

      if (outputPdf.getPageCount() === 0) {
        cleanup(req.file);

        return res.status(400).json({
          detail: "You cannot delete all pages.",
        });
      }

      const result = await outputPdf.save();

      cleanup(req.file);

      sendPDF(
        res,
        result,
        "PDFora-Deleted-Pages.pdf"
      );
    } catch (error) {
      console.error(error);
      cleanup(req.file);

      res.status(500).json({
        detail: "Could not delete PDF pages.",
      });
    }
  }
);

/* EXTRACT PAGES */
app.post(
  "/api/extract-pages",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          detail: "Please select a PDF file.",
        });
      }

      const pagesText = String(
        req.body.pages || ""
      ).trim();

      if (!pagesText) {
        cleanup(req.file);

        return res.status(400).json({
          detail: "Enter pages to extract, for example 1,3,5.",
        });
      }

      const selectedPages = pagesText
        .split(",")
        .map((x) => Number(x.trim()))
        .filter((x) => Number.isInteger(x) && x > 0);

      const input = fs.readFileSync(req.file.path);

      const sourcePdf = await PDFDocument.load(input);
      const outputPdf = await PDFDocument.create();

      const total = sourcePdf.getPageCount();

      for (const pageNumber of selectedPages) {
        if (pageNumber <= total) {
          const [page] = await outputPdf.copyPages(
            sourcePdf,
            [pageNumber - 1]
          );

          outputPdf.addPage(page);
        }
      }

      if (outputPdf.getPageCount() === 0) {
        cleanup(req.file);

        return res.status(400).json({
          detail: "No valid pages were selected.",
        });
      }

      const result = await outputPdf.save();

      cleanup(req.file);

      sendPDF(
        res,
        result,
        "PDFora-Extracted.pdf"
      );
    } catch (error) {
      console.error(error);
      cleanup(req.file);

      res.status(500).json({
        detail: "Could not extract PDF pages.",
      });
    }
  }
);

/* ROTATE PDF */
app.post(
  "/api/rotate",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          detail: "Please select a PDF file.",
        });
      }

      const value = Number(req.query.degrees || 90);

      if (![90, 180, 270].includes(value)) {
        cleanup(req.file);

        return res.status(400).json({
          detail: "Rotation must be 90, 180 or 270 degrees.",
        });
      }

      const input = fs.readFileSync(req.file.path);
      const pdf = await PDFDocument.load(input);

      for (const page of pdf.getPages()) {
        const current = page.getRotation().angle;

        page.setRotation(
          degrees((current + value) % 360)
        );
      }

      const result = await pdf.save();

      cleanup(req.file);

      sendPDF(
        res,
        result,
        "PDFora-Rotated.pdf"
      );
    } catch (error) {
      console.error(error);
      cleanup(req.file);

      res.status(500).json({
        detail: "Could not rotate PDF.",
      });
    }
  }
);

/* WATERMARK */
app.post(
  "/api/watermark",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          detail: "Please select a PDF file.",
        });
      }

      const text = String(
        req.body.text || ""
      ).trim();

      if (!text) {
        cleanup(req.file);

        return res.status(400).json({
          detail: "Please enter watermark text.",
        });
      }

      const input = fs.readFileSync(req.file.path);
      const pdf = await PDFDocument.load(input);

      for (const page of pdf.getPages()) {
        const {
          width,
          height,
        } = page.getSize();

        page.drawText(text, {
          x: width / 2 - 100,
          y: height / 2,
          size: 30,
          rotate: degrees(45),
          opacity: 0.25,
        });
      }

      const result = await pdf.save();

      cleanup(req.file);

      sendPDF(
        res,
        result,
        "PDFora-Watermarked.pdf"
      );
    } catch (error) {
      console.error(error);
      cleanup(req.file);

      res.status(500).json({
        detail: "Could not watermark PDF.",
      });
    }
  }
);

/* SPLIT PDF */
app.post(
  "/api/split",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          detail: "Please select a PDF file.",
        });
      }

      const start = Number(
        req.query.start_page || 1
      );

      const end = req.query.end_page
        ? Number(req.query.end_page)
        : undefined;

      if (!Number.isInteger(start) || start < 1) {
        cleanup(req.file);

        return res.status(400).json({
          detail: "Invalid start page.",
        });
      }

      if (
        end !== undefined &&
        (!Number.isInteger(end) || end < start)
      ) {
        cleanup(req.file);

        return res.status(400).json({
          detail: "Invalid end page.",
        });
      }

      const input = fs.readFileSync(req.file.path);
      const sourcePdf = await PDFDocument.load(input);

      const total = sourcePdf.getPageCount();
      const actualEnd = end || total;

      if (start > total || actualEnd > total) {
        cleanup(req.file);

        return res.status(400).json({
          detail: `PDF has ${total} pages.`,
        });
      }

      const outputPdf = await PDFDocument.create();

      for (
        let i = start - 1;
        i < actualEnd;
        i++
      ) {
        const [page] = await outputPdf.copyPages(
          sourcePdf,
          [i]
        );

        outputPdf.addPage(page);
      }

      const result = await outputPdf.save();

      cleanup(req.file);

      sendPDF(
        res,
        result,
        "PDFora-Split.pdf"
      );
    } catch (error) {
      console.error(error);
      cleanup(req.file);

      res.status(500).json({
        detail: "Could not split PDF.",
      });
    }
  }
);

/* IMAGES TO PDF */
app.post(
  "/api/images-to-pdf",
  upload.array("files", 50),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          detail: "Please select at least one image.",
        });
      }

      const pdf = await PDFDocument.create();

      for (const file of req.files) {
        const bytes = fs.readFileSync(file.path);

        const ext = path
          .extname(file.originalname)
          .toLowerCase();

        let image;

        if (
          ext === ".jpg" ||
          ext === ".jpeg"
        ) {
          image = await pdf.embedJpg(bytes);
        } else if (ext === ".png") {
          image = await pdf.embedPng(bytes);
        } else {
          cleanup(file);

          return res.status(400).json({
            detail:
              "Only JPG and PNG images are supported.",
          });
        }

        const scale = Math.min(
          1,
          595 / image.width,
          842 / image.height
        );

        const width =
          image.width * scale;

        const height =
          image.height * scale;

        const page = pdf.addPage([
          width,
          height,
        ]);

        page.drawImage(image, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }

      const result = await pdf.save();

      req.files.forEach(cleanup);

      sendPDF(
        res,
        result,
        "PDFora-Images.pdf"
      );
    } catch (error) {
      console.error(error);

      if (req.files) {
        req.files.forEach(cleanup);
      }

      res.status(500).json({
        detail: "Could not convert images to PDF.",
      });
    }
  }
);

/* COMPRESS PDF */
app.post(
  "/api/compress",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          detail: "Please select a PDF file.",
        });
      }

      const input = fs.readFileSync(req.file.path);
      const originalSize = input.length;

      const pdf = await PDFDocument.load(input);

      const result = await pdf.save({
        useObjectStreams: true,
      });

      const compressedSize = result.length;

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        'attachment; filename="PDFora-Compressed.pdf"'
      );

      res.setHeader(
        "X-Original-Size",
        String(originalSize)
      );

      res.setHeader(
        "X-Compressed-Size",
        String(compressedSize)
      );

      cleanup(req.file);

      res.send(Buffer.from(result));
    } catch (error) {
      console.error(error);
      cleanup(req.file);

      res.status(500).json({
        detail: "Could not compress PDF.",
      });
    }
  }
);

/* PDF TO JPG */
app.post(
  "/api/pdf-to-jpg",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          detail: "Please select a PDF file.",
        });
      }

      cleanup(req.file);

      return res.status(501).json({
        detail:
          "PDF to JPG requires an image renderer. Other PDF tools are active.",
      });
    } catch (error) {
      console.error(error);
      cleanup(req.file);

      res.status(500).json({
        detail: "Could not convert PDF to JPG.",
      });
    }
  }
);

/* ERROR HANDLER */
app.use((error, req, res, next) => {
  console.error(error);

  if (
    error &&
    error.code === "LIMIT_FILE_SIZE"
  ) {
    return res.status(413).json({
      detail: "Maximum file size is 50 MB.",
    });
  }

  res.status(500).json({
    detail: "Server error.",
  });
});

app.listen(PORT, () => {
  console.log(
    `PDFora Backend running on http://127.0.0.1:${PORT}`
  );
});