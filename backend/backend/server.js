const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PDFDocument, degrees, rgb } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// This legacy Express service is separate from the production FastAPI service.
// Keep browser origins explicit; configure FRONTEND_ORIGINS as a comma-separated
// exact-origin allowlist when deploying it.
const DEFAULT_ORIGINS = [
  "https://pd-fora.vercel.app",
  "https://niroj.com.np",
  "https://www.niroj.com.np",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];
const allowedOrigins = new Set(
  (process.env.FRONTEND_ORIGINS || DEFAULT_ORIGINS.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);
app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header are non-browser clients (e.g. health checks).
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(null, false);
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: false,
  optionsSuccessStatus: 204,
}));
app.use(express.json({ limit: "1mb", strict: true }));
app.use(express.urlencoded({ extended: false, limit: "1mb", parameterLimit: 100 }));

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 50,
    fields: 20,
    fieldSize: 64 * 1024,
    parts: 70,
  },
  fileFilter(req, file, callback) {
    const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
    if (!allowedTypes.has(file.mimetype)) {
      const error = new Error("Unsupported upload type. Use PDF, JPG or PNG files.");
      error.status = 415;
      return callback(error);
    }
    callback(null, true);
  },
});

function cleanup(file) {
  if (!file) return;

  try {
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  } catch {}
}

function cleanupFiles(files) {
  if (!files) return;

  for (const file of files) {
    cleanup(file);
  }
}

function sendPDF(res, bytes, filename) {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}"`
  );

  res.send(Buffer.from(bytes));
}

function parsePages(value) {
  return String(value || "")
    .split(",")
    .map((item) => Number(item.trim()))
    .filter(
      (item) => Number.isInteger(item) && item > 0
    );
}

/* =========================
   HEALTH
========================= */

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

/* =========================
   MERGE PDF
========================= */

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

      const output = await PDFDocument.create();

      for (const file of req.files) {
        const input = fs.readFileSync(file.path);
        const pdf = await PDFDocument.load(input);

        const pages = await output.copyPages(
          pdf,
          pdf.getPageIndices()
        );

        for (const page of pages) {
          output.addPage(page);
        }
      }

      const result = await output.save();

      cleanupFiles(req.files);

      sendPDF(
        res,
        result,
        "PDFora-Merged.pdf"
      );
    } catch (error) {
      console.error("Merge error:", error);

      cleanupFiles(req.files);

      res.status(500).json({
        detail: "Could not merge PDF files.",
      });
    }
  }
);

/* =========================
   DELETE PAGES
========================= */

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

      const pagesToDelete = parsePages(
        req.body.pages
      );

      if (pagesToDelete.length === 0) {
        cleanup(req.file);

        return res.status(400).json({
          detail:
            "Enter pages to delete, for example 2,4,7.",
        });
      }

      const input = fs.readFileSync(req.file.path);
      const source = await PDFDocument.load(input);
      const output = await PDFDocument.create();

      const total = source.getPageCount();

      for (let i = 0; i < total; i++) {
        if (!pagesToDelete.includes(i + 1)) {
          const [page] = await output.copyPages(
            source,
            [i]
          );

          output.addPage(page);
        }
      }

      if (output.getPageCount() === 0) {
        cleanup(req.file);

        return res.status(400).json({
          detail:
            "You cannot delete all pages.",
        });
      }

      const result = await output.save();

      cleanup(req.file);

      sendPDF(
        res,
        result,
        "PDFora-Deleted-Pages.pdf"
      );
    } catch (error) {
      console.error("Delete error:", error);

      cleanup(req.file);

      res.status(500).json({
        detail: "Could not delete PDF pages.",
      });
    }
  }
);

/* =========================
   EXTRACT PAGES
========================= */

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

      const pagesToExtract = parsePages(
        req.body.pages
      );

      if (pagesToExtract.length === 0) {
        cleanup(req.file);

        return res.status(400).json({
          detail:
            "Enter pages to extract, for example 1,3,5.",
        });
      }

      const input = fs.readFileSync(req.file.path);
      const source = await PDFDocument.load(input);
      const output = await PDFDocument.create();

      const total = source.getPageCount();

      for (const pageNumber of pagesToExtract) {
        if (pageNumber <= total) {
          const [page] = await output.copyPages(
            source,
            [pageNumber - 1]
          );

          output.addPage(page);
        }
      }

      if (output.getPageCount() === 0) {
        cleanup(req.file);

        return res.status(400).json({
          detail: "No valid pages selected.",
        });
      }

      const result = await output.save();

      cleanup(req.file);

      sendPDF(
        res,
        result,
        "PDFora-Extracted.pdf"
      );
    } catch (error) {
      console.error("Extract error:", error);

      cleanup(req.file);

      res.status(500).json({
        detail:
          "Could not extract PDF pages.",
      });
    }
  }
);

/* =========================
   ROTATE PDF
========================= */

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

      const rotation = Number(
        req.query.degrees || 90
      );

      if (![90, 180, 270].includes(rotation)) {
        cleanup(req.file);

        return res.status(400).json({
          detail:
            "Rotation must be 90, 180 or 270 degrees.",
        });
      }

      const input = fs.readFileSync(req.file.path);
      const pdf = await PDFDocument.load(input);

      for (const page of pdf.getPages()) {
        const current =
          page.getRotation().angle;

        page.setRotation(
          degrees(
            (current + rotation) % 360
          )
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
      console.error("Rotate error:", error);

      cleanup(req.file);

      res.status(500).json({
        detail: "Could not rotate PDF.",
      });
    }
  }
);

/* =========================
   WATERMARK
========================= */

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
          detail:
            "Please enter watermark text.",
        });
      }

      const input = fs.readFileSync(req.file.path);
      const pdf = await PDFDocument.load(input);

      for (const page of pdf.getPages()) {
        const { width, height } =
          page.getSize();

        page.drawText(text, {
          x: width / 2 - 100,
          y: height / 2,
          size: 30,
          rotate: degrees(45),
          opacity: 0.25,
          color: rgb(0.4, 0.4, 0.4),
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
      console.error("Watermark error:", error);

      cleanup(req.file);

      res.status(500).json({
        detail:
          "Could not watermark PDF.",
      });
    }
  }
);

/* =========================
   SPLIT PDF
========================= */

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

      if (
        !Number.isInteger(start) ||
        start < 1
      ) {
        cleanup(req.file);

        return res.status(400).json({
          detail: "Invalid start page.",
        });
      }

      if (
        end !== undefined &&
        (
          !Number.isInteger(end) ||
          end < start
        )
      ) {
        cleanup(req.file);

        return res.status(400).json({
          detail: "Invalid end page.",
        });
      }

      const input = fs.readFileSync(req.file.path);
      const source = await PDFDocument.load(input);

      const total = source.getPageCount();
      const actualEnd = end || total;

      if (
        start > total ||
        actualEnd > total
      ) {
        cleanup(req.file);

        return res.status(400).json({
          detail:
            `PDF has ${total} pages.`,
        });
      }

      const output = await PDFDocument.create();

      for (
        let i = start - 1;
        i < actualEnd;
        i++
      ) {
        const [page] = await output.copyPages(
          source,
          [i]
        );

        output.addPage(page);
      }

      const result = await output.save();

      cleanup(req.file);

      sendPDF(
        res,
        result,
        "PDFora-Split.pdf"
      );
    } catch (error) {
      console.error("Split error:", error);

      cleanup(req.file);

      res.status(500).json({
        detail:
          "Could not split PDF.",
      });
    }
  }
);

/* =========================
   IMAGES TO PDF
========================= */

app.post(
  "/api/images-to-pdf",
  upload.array("files", 50),
  async (req, res) => {
    try {
      if (
        !req.files ||
        req.files.length === 0
      ) {
        return res.status(400).json({
          detail:
            "Please select at least one image.",
        });
      }

      const pdf = await PDFDocument.create();

      for (const file of req.files) {
        const input =
          fs.readFileSync(file.path);

        const extension =
          path
            .extname(file.originalname)
            .toLowerCase();

        let image;

        if (
          extension === ".jpg" ||
          extension === ".jpeg"
        ) {
          image = await pdf.embedJpg(input);
        } else if (
          extension === ".png"
        ) {
          image = await pdf.embedPng(input);
        } else {
          cleanupFiles(req.files);

          return res.status(400).json({
            detail:
              "Please use JPG or PNG images.",
          });
        }

        const maxWidth = 595;
        const maxHeight = 842;

        const scale = Math.min(
          1,
          maxWidth / image.width,
          maxHeight / image.height
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

      cleanupFiles(req.files);

      sendPDF(
        res,
        result,
        "PDFora-Images.pdf"
      );
    } catch (error) {
      console.error(
        "Images to PDF error:",
        error
      );

      cleanupFiles(req.files);

      res.status(500).json({
        detail:
          "Could not convert images to PDF.",
      });
    }
  }
);

/* =========================
   COMPRESS PDF
========================= */

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
        addDefaultPage: false,
      });

      const compressedSize =
        result.length;

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
      console.error(
        "Compress error:",
        error
      );

      cleanup(req.file);

      res.status(500).json({
        detail:
          "Could not compress PDF.",
      });
    }
  }
);

/* =========================
   ERROR HANDLER
========================= */

app.use(
  (error, req, res, next) => {
    // Multer can fail after creating one or more temporary files.
    cleanup(req.file);
    cleanupFiles(req.files);

    if (error && error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        detail: "Maximum file size is 50 MB per file.",
      });
    }
    if (error && error.code === "LIMIT_FILE_COUNT") {
      return res.status(413).json({
        detail: "Too many files were uploaded.",
      });
    }
    if (error && error.code === "LIMIT_FIELD_VALUE") {
      return res.status(413).json({
        detail: "A form field is too large.",
      });
    }
    if (error && error.status === 415) {
      return res.status(415).json({ detail: error.message });
    }
    if (error && error.type === "entity.too.large") {
      return res.status(413).json({ detail: "Request body is too large." });
    }

    // Avoid returning parser, filesystem, or upstream error details to clients.
    console.error("Express request failed:", error && error.message ? error.message : "Unknown error");
    return res.status(500).json({ detail: "Server error." });
  }
);

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(
    `PDFora Backend running on http://127.0.0.1:${PORT}`
  );
});