export type ToolGuide = { slug:string; name:string; keyword:string; purpose:string; steps:string[]; caution:string; related:string[]; blogSlug:string };

export const toolGuides: ToolGuide[] = [
  {
    "slug": "add-background",
    "name": "Add PDF Background",
    "keyword": "how to add a background to every page of a PDF online",
    "purpose": "Add a consistent background layer to PDF pages when preparing a branded handout, form or presentation.",
    "steps": [
      "Open Add PDF Background and select the source PDF.",
      "Choose the supported background option and apply it to the pages you need.",
      "Download the result and inspect text contrast, margins and page order."
    ],
    "caution": "Check whether the original already has a background and make sure the new layer does not hide important content.",
    "related": [
      "add-page-numbers",
      "watermark",
      "header-footer"
    ],
    "blogSlug": "add-background-guide-online"
  },
  {
    "slug": "add-blank-pages",
    "name": "Add Blank PDF Pages",
    "keyword": "how to insert blank pages into a PDF document online",
    "purpose": "Insert blank pages into a PDF when you need room for handwritten notes, dividers or double-sided printing.",
    "steps": [
      "Open Add Blank Pages and upload the PDF.",
      "Set the insertion options shown by the tool and process the document.",
      "Download the updated PDF and check where each blank page appears."
    ],
    "caution": "A blank page changes later page positions, so review page numbering and any references before sharing.",
    "related": [
      "reorder-pdf",
      "add-page-numbers",
      "merge-pdf"
    ],
    "blogSlug": "add-blank-pages-guide-online"
  },
  {
    "slug": "add-bookmarks",
    "name": "Add PDF Bookmarks",
    "keyword": "how to add clickable bookmarks to a PDF online",
    "purpose": "Create a navigable outline for a long PDF so readers can jump to important sections instead of scrolling page by page.",
    "steps": [
      "Open Add Bookmarks and choose your PDF.",
      "Enter bookmark labels and page destinations using the available controls.",
      "Process the file, then open it in a PDF viewer and test the outline entries."
    ],
    "caution": "Bookmark destinations should match the final page order; add or update bookmarks after major edits.",
    "related": [
      "extract-bookmarks",
      "split-by-bookmarks",
      "pdf-information"
    ],
    "blogSlug": "add-bookmarks-guide-online"
  },
  {
    "slug": "add-page-numbers",
    "name": "Add PDF Page Numbers",
    "keyword": "how to add page numbers to a PDF online for free",
    "purpose": "Add page numbers to reports, assignments and business documents so printed or shared pages are easier to reference.",
    "steps": [
      "Open Add Page Numbers and upload the document.",
      "Choose the available numbering placement and style, then run the tool.",
      "Download the numbered PDF and check the first, middle and last pages."
    ],
    "caution": "If a document already has printed page numbers, decide whether to keep them or add a separate sequence to avoid confusion.",
    "related": [
      "header-footer",
      "bates-numbering",
      "reorder-pdf"
    ],
    "blogSlug": "add-page-numbers-guide-online"
  },
  {
    "slug": "bates-numbering",
    "name": "Bates Numbering PDF",
    "keyword": "how to add sequential Bates numbers to PDF pages online",
    "purpose": "Apply sequential identifiers to PDF pages for organised case files, evidence bundles and document review workflows.",
    "steps": [
      "Open Bates Numbering and select the PDF bundle.",
      "Set the prefix or numbering options available in the tool.",
      "Generate the numbered PDF and verify the sequence across the document."
    ],
    "caution": "Bates labels are identifiers, not a substitute for legal review; confirm the required format and sequence before filing.",
    "related": [
      "add-page-numbers",
      "merge-pdf",
      "split-pdf"
    ],
    "blogSlug": "bates-numbering-guide-online"
  },
  {
    "slug": "compare-pdf",
    "name": "Compare PDF Files",
    "keyword": "how to compare two PDF documents and find text differences online",
    "purpose": "Compare two versions of a text-based PDF to identify changed wording before approving or sharing a revised document.",
    "steps": [
      "Open Compare PDF and select both versions of the document.",
      "Start the comparison and allow the tool to analyse the available text.",
      "Download or review the comparison output and check each flagged change against the originals."
    ],
    "caution": "Text comparison may not detect every visual change, handwritten mark or image difference; inspect page layouts separately.",
    "related": [
      "pdf-to-text",
      "pdf-information",
      "merge-pdf"
    ],
    "blogSlug": "compare-pdf-guide-online"
  },
  {
    "slug": "compress-pdf",
    "name": "Compress PDF",
    "keyword": "how to compress a PDF file for email or online upload without losing readability",
    "purpose": "Reduce a PDF's file size when an email or upload portal has a maximum attachment limit.",
    "steps": [
      "Open Compress PDF and select the document.",
      "Run compression and wait for the processed file.",
      "Download the result and compare its size and readability with the original."
    ],
    "caution": "The exact size reduction depends on images and existing compression; check small text, stamps and signatures before submitting.",
    "related": [
      "split-pdf",
      "delete-pages",
      "pdf-information"
    ],
    "blogSlug": "compress-pdf-to-under-1mb-online"
  },
  {
    "slug": "crop-pdf",
    "name": "Crop PDF Pages",
    "keyword": "how to crop PDF margins and remove white borders online",
    "purpose": "Crop excess white margins from PDF pages to improve page framing, remove scanner borders or prepare a cleaner reading copy.",
    "steps": [
      "Open Crop PDF and upload the document.",
      "Choose the crop area or settings offered by the tool.",
      "Process and download the cropped PDF, then inspect every page size."
    ],
    "caution": "Cropping changes the visible page area; keep the original and make sure no text, footnotes or signatures are cut off.",
    "related": [
      "rotate-pdf",
      "rotate-selected-pages",
      "pdf-information"
    ],
    "blogSlug": "crop-pdf-guide-online"
  },
  {
    "slug": "delete-pages",
    "name": "Delete PDF Pages",
    "keyword": "how to delete unwanted pages from a PDF online",
    "purpose": "Remove selected, blank or duplicate pages while keeping the remaining pages together in one PDF.",
    "steps": [
      "Open Delete PDF Pages and upload a copy of the original document.",
      "Enter individual page numbers separated by commas or a range such as 6-8, using the PDF viewer's page count.",
      "Process the document, download the result and check the first, middle and final pages."
    ],
    "caution": "Printed page labels can differ from viewer page numbers. Keep the original file and confirm that no required page, signature or attachment was removed.",
    "related": [
      "extract-pages",
      "reorder-pdf",
      "split-pdf"
    ],
    "blogSlug": "delete-pages-guide-online"
  },
  {
    "slug": "edit-pdf-metadata",
    "name": "Edit PDF Metadata",
    "keyword": "how to edit PDF title author and metadata properties online",
    "purpose": "Update document properties such as title, author, subject and keywords so a PDF is easier to identify in file managers and document systems.",
    "steps": [
      "Open Edit PDF Metadata and select the PDF.",
      "Enter the document properties you want to update.",
      "Save the processed PDF and inspect its properties in a PDF reader."
    ],
    "caution": "Metadata is separate from visible page content; changing it will not rewrite headings or remove personal information printed on the pages.",
    "related": [
      "remove-pdf-metadata",
      "pdf-information",
      "protect-pdf"
    ],
    "blogSlug": "edit-pdf-metadata-guide-online"
  },
  {
    "slug": "extract-bookmarks",
    "name": "Extract PDF Bookmarks",
    "keyword": "how to extract bookmarks and table of contents from a PDF",
    "purpose": "Export a PDF's existing bookmark outline when you need to review its section structure or reuse navigation information.",
    "steps": [
      "Open Extract Bookmarks and choose the PDF.",
      "Run the extraction to inspect the available outline entries.",
      "Download or review the extracted bookmark data."
    ],
    "caution": "Only bookmarks saved in the PDF can be extracted; a printed table of contents is page content, not necessarily a bookmark outline.",
    "related": [
      "add-bookmarks",
      "split-by-bookmarks",
      "pdf-information"
    ],
    "blogSlug": "extract-bookmarks-guide-online"
  },
  {
    "slug": "extract-fonts",
    "name": "Extract Fonts from PDF",
    "keyword": "how to check and extract embedded fonts from a PDF file",
    "purpose": "Inspect font resources embedded in a PDF when checking document portability, typography or production requirements.",
    "steps": [
      "Open Extract Fonts and upload the PDF.",
      "Run the inspection or extraction process.",
      "Review the returned font information and any files the tool makes available."
    ],
    "caution": "Font extraction depends on embedding permissions and font format; some fonts may be subsetted or restricted.",
    "related": [
      "pdf-information",
      "pdf-to-text",
      "pdf-to-html"
    ],
    "blogSlug": "extract-fonts-guide-online"
  },
  {
    "slug": "extract-images",
    "name": "Extract Images from PDF",
    "keyword": "how to extract original images from a PDF document online",
    "purpose": "Save embedded image resources from a PDF separately when you need pictures for review, reuse or asset inspection.",
    "steps": [
      "Open Extract Images and choose the source PDF.",
      "Start extraction and wait for the available image resources to be processed.",
      "Download the extracted images and open them to check dimensions and quality."
    ],
    "caution": "Not every visible graphic is stored as a separate image; vector drawings and page backgrounds may not extract as standalone photos.",
    "related": [
      "extract-page-images",
      "pdf-to-jpg",
      "pdf-to-png"
    ],
    "blogSlug": "extract-images-guide-online"
  },
  {
    "slug": "extract-page-images",
    "name": "Extract PDF Page Images",
    "keyword": "how to convert each PDF page into a separate image file online",
    "purpose": "Render PDF pages as individual images for previews, presentations or systems that accept image uploads instead of PDF documents.",
    "steps": [
      "Open Extract Page Images and select the PDF.",
      "Start rendering the document pages as image files.",
      "Download the images and verify page order and text clarity."
    ],
    "caution": "Rendered images are not editable document text; retain the PDF when you need search, links or accessible text.",
    "related": [
      "pdf-to-jpg",
      "pdf-to-png",
      "pdf-to-webp"
    ],
    "blogSlug": "extract-page-images-guide-online"
  },
  {
    "slug": "extract-pages",
    "name": "Extract PDF Pages",
    "keyword": "how to extract selected pages from a PDF into a new file online",
    "purpose": "Create a smaller PDF containing only selected pages from a long report, application or reference document.",
    "steps": [
      "Open Extract Pages and select the source PDF.",
      "Choose the page numbers or ranges you need.",
      "Process and download the new PDF, then confirm the selected pages are present."
    ],
    "caution": "Check PDF page positions rather than relying only on printed page labels, which may differ from viewer page counts.",
    "related": [
      "split-pdf",
      "delete-pages",
      "reorder-pdf"
    ],
    "blogSlug": "extract-pages-guide-online"
  },
  {
    "slug": "flatten-pdf",
    "name": "Flatten PDF",
    "keyword": "how to flatten PDF form fields and annotations before sharing",
    "purpose": "Flatten supported form appearances and annotation layers when you need a more fixed viewing or printing copy of a PDF.",
    "steps": [
      "Open Flatten PDF and select the document.",
      "Run the flattening operation using the tool's available settings.",
      "Download the output and check form values, comments and visual appearance."
    ],
    "caution": "Flattening can make interactive elements less editable; preserve an original copy before processing.",
    "related": [
      "remove-annotations",
      "protect-pdf",
      "pdf-information"
    ],
    "blogSlug": "flatten-pdf-guide-online"
  },
  {
    "slug": "grayscale-pdf",
    "name": "Convert PDF to Grayscale",
    "keyword": "how to convert a colour PDF to black and white grayscale online",
    "purpose": "Create a grayscale copy of a PDF for monochrome printing, lower-colour document workflows or consistent black-and-white review.",
    "steps": [
      "Open Grayscale PDF and upload the source.",
      "Run the grayscale conversion.",
      "Download the output and inspect charts, photos, highlights and small text."
    ],
    "caution": "Colour-coded information may become harder to distinguish in grayscale; check contrast and labels before printing.",
    "related": [
      "compress-pdf",
      "pdf-to-jpg",
      "pdf-information"
    ],
    "blogSlug": "grayscale-pdf-guide-online"
  },
  {
    "slug": "header-footer",
    "name": "Add Header and Footer to PDF",
    "keyword": "how to add a header or footer to every page of a PDF online",
    "purpose": "Add repeating labels such as document names, dates or section details to PDF pages for easier identification.",
    "steps": [
      "Open Header and Footer and upload the PDF.",
      "Enter the header or footer text and apply the available placement options.",
      "Process the document and inspect the top and bottom margins on multiple pages."
    ],
    "caution": "Keep text away from page numbers, footnotes and existing content so the added labels do not overlap important information.",
    "related": [
      "add-page-numbers",
      "watermark",
      "bates-numbering"
    ],
    "blogSlug": "header-footer-guide-online"
  },
  {
    "slug": "images-to-pdf",
    "name": "Images to PDF",
    "keyword": "how to combine JPG PNG and WebP images into one PDF on mobile or desktop",
    "purpose": "Combine supported photos and image files into a single PDF for assignments, receipts, scanned notes and application uploads.",
    "steps": [
      "Open Images to PDF and select the supported images.",
      "Check their order and orientation before conversion.",
      "Create the PDF, download it and review each page."
    ],
    "caution": "Image order and resolution affect the result; use clear photos and confirm the final PDF meets the receiving portal's size requirements.",
    "related": [
      "compress-pdf",
      "rotate-pdf",
      "merge-pdf"
    ],
    "blogSlug": "convert-jpg-images-to-one-pdf-on-phone"
  },
  {
    "slug": "merge-pdf",
    "name": "Merge PDF",
    "keyword": "how to merge multiple PDF files into one document online",
    "purpose": "Combine 2–20 related PDF files into one document, set their reading order and download a single file for sharing or submission.",
    "steps": [
      "Open Merge PDF and select at least two PDF files. The combined upload must stay within 50 MB.",
      "Use the up and down arrow buttons beside the selected file names to arrange the documents in the intended reading order.",
      "Remove any file you do not need, merge the PDFs and download the new document.",
      "Open the merged file and check its first, middle and final pages before sharing."
    ],
    "caution": "The tool accepts up to 20 PDFs with a combined upload limit of 50 MB. It combines existing pages but does not run OCR, so scanned pages remain images. Keep your source PDFs until you have checked the output.",
    "related": ["reorder-pdf", "compress-pdf", "split-pdf"],
    "blogSlug": "merge-multiple-pdf-files-into-one-document"
  },
  {
    "slug": "page-counter",
    "name": "PDF Page Counter",
    "keyword": "how to count the number of pages in a PDF file online",
    "purpose": "Check a PDF's page count quickly before uploading, printing, splitting or preparing a document bundle.",
    "steps": [
      "Open PDF Page Counter and choose the PDF file.",
      "Run the page-count inspection.",
      "Review the reported count and compare it with the document's expected length."
    ],
    "caution": "Printed page labels can differ from the PDF viewer's physical page count, especially when a cover page or Roman numeral section is included.",
    "related": [
      "pdf-information",
      "extract-pages",
      "split-pdf"
    ],
    "blogSlug": "page-counter-guide-online"
  },
  {
    "slug": "pdf-information",
    "name": "PDF Information",
    "keyword": "how to view PDF file details metadata page size and security online",
    "purpose": "Inspect a PDF's basic properties, metadata, page dimensions and document status before editing or sharing it.",
    "steps": [
      "Open PDF Information and upload the document.",
      "Run the inspection to read the available file properties.",
      "Review the metadata, dimensions and other reported details."
    ],
    "caution": "A PDF information report does not guarantee that every page is readable or that a file is safe; open and inspect the document separately.",
    "related": [
      "edit-pdf-metadata",
      "remove-pdf-metadata",
      "page-counter"
    ],
    "blogSlug": "pdf-information-guide-online"
  },
  {
    "slug": "pdf-to-bmp",
    "name": "PDF to BMP",
    "keyword": "how to convert PDF pages to BMP bitmap images online",
    "purpose": "Convert PDF pages into BMP bitmap images when a workflow specifically requires that image format.",
    "steps": [
      "Open PDF to BMP and select the source PDF.",
      "Start the conversion and allow the pages to render.",
      "Download the BMP images and check their dimensions and page order."
    ],
    "caution": "BMP files can be much larger than compressed image formats; use JPG or WebP if the destination accepts them and smaller files are preferred.",
    "related": [
      "pdf-to-jpg",
      "pdf-to-png",
      "pdf-to-tiff"
    ],
    "blogSlug": "pdf-to-bmp-guide-online"
  },
  {
    "slug": "pdf-to-csv",
    "name": "PDF to CSV",
    "keyword": "how to extract PDF table data into a CSV file for Excel",
    "purpose": "Export available text-based table data from a PDF into CSV format for spreadsheet analysis and data cleaning.",
    "steps": [
      "Open PDF to CSV and select a PDF containing a table.",
      "Run the conversion and download the CSV file.",
      "Open it in a spreadsheet and check delimiters, columns, decimal points and totals."
    ],
    "caution": "Scanned tables and complex layouts may not extract accurately; verify important figures against the original PDF.",
    "related": [
      "pdf-to-excel",
      "pdf-to-text",
      "pdf-to-json"
    ],
    "blogSlug": "pdf-to-csv-guide-online"
  },
  {
    "slug": "pdf-to-excel",
    "name": "PDF to Excel",
    "keyword": "how to convert PDF tables into editable Excel spreadsheets online",
    "purpose": "Convert suitable PDF table content into a spreadsheet so you can sort, filter and analyse extracted values.",
    "steps": [
      "Open PDF to Excel and upload the PDF with the table.",
      "Start the conversion and download the workbook.",
      "Open it in Excel and verify rows, columns, dates and totals against the source."
    ],
    "caution": "Scanned PDFs may need OCR first, and merged cells or multi-line headings can require manual cleanup.",
    "related": [
      "pdf-to-csv",
      "pdf-to-word",
      "pdf-to-text"
    ],
    "blogSlug": "convert-pdf-table-to-excel-spreadsheet"
  },
  {
    "slug": "pdf-to-html",
    "name": "PDF to HTML",
    "keyword": "how to convert PDF text into an HTML file online",
    "purpose": "Export selectable PDF text into HTML when you need content for a web page or a basic structured text workflow.",
    "steps": [
      "Open PDF to HTML and select the source PDF.",
      "Run the conversion and download the HTML output.",
      "Open the HTML file in a browser and check headings, paragraph order and special characters."
    ],
    "caution": "Complex page layouts, images and columns may not map perfectly to HTML; review the output before publishing.",
    "related": [
      "pdf-to-text",
      "pdf-to-markdown",
      "pdf-to-word"
    ],
    "blogSlug": "pdf-to-html-guide-online"
  },
  {
    "slug": "pdf-to-jpg",
    "name": "PDF to JPG",
    "keyword": "how to convert every page of a PDF into JPG images online",
    "purpose": "Turn PDF pages into JPG image files for previews, messaging, presentations and image-only upload forms.",
    "steps": [
      "Open PDF to JPG and select the PDF.",
      "Start conversion to render the document pages.",
      "Download the JPG files and inspect page order and small text."
    ],
    "caution": "JPG is a flattened image, not editable text; keep the original PDF for search, accessibility and printing.",
    "related": [
      "pdf-to-png",
      "extract-page-images",
      "images-to-pdf"
    ],
    "blogSlug": "convert-pdf-pages-to-jpg-images"
  },
  {
    "slug": "pdf-to-json",
    "name": "PDF to JSON",
    "keyword": "how to convert selectable PDF text and structure into JSON online",
    "purpose": "Export available PDF text and document information into JSON for data processing, scripting or structured content workflows.",
    "steps": [
      "Open PDF to JSON and upload the source document.",
      "Run the conversion to generate the JSON output.",
      "Download the file and inspect its keys, text order and character encoding."
    ],
    "caution": "JSON output reflects the structure the converter can identify; it may not preserve the exact visual layout of the PDF.",
    "related": [
      "pdf-to-text",
      "pdf-to-csv",
      "pdf-to-markdown"
    ],
    "blogSlug": "pdf-to-json-guide-online"
  },
  {
    "slug": "pdf-to-markdown",
    "name": "PDF to Markdown",
    "keyword": "how to convert a PDF document into Markdown text online",
    "purpose": "Turn selectable PDF text into Markdown for notes, documentation, content drafts and text-based knowledge bases.",
    "steps": [
      "Open PDF to Markdown and select the PDF.",
      "Start conversion and download the Markdown file.",
      "Review headings, lists, links and tables in a Markdown editor."
    ],
    "caution": "PDF layout is not identical to Markdown; check tables, columns and page breaks after conversion.",
    "related": [
      "pdf-to-text",
      "pdf-to-html",
      "pdf-to-word"
    ],
    "blogSlug": "pdf-to-markdown-guide-online"
  },
  {
    "slug": "pdf-to-png",
    "name": "PDF to PNG",
    "keyword": "how to convert PDF pages to high quality PNG images online",
    "purpose": "Render PDF pages as PNG images when crisp text, diagrams or screenshot-like output is more important than small file size.",
    "steps": [
      "Open PDF to PNG and select your PDF.",
      "Run the conversion to render each page.",
      "Download the PNG images and check clarity and dimensions."
    ],
    "caution": "PNG files may be larger than JPG or WebP; choose the format that matches the destination's quality and size requirements.",
    "related": [
      "pdf-to-jpg",
      "pdf-to-webp",
      "extract-page-images"
    ],
    "blogSlug": "pdf-to-png-guide-online"
  },
  {
    "slug": "pdf-to-text",
    "name": "PDF to Text",
    "keyword": "how to extract selectable text from a PDF into a TXT file online",
    "purpose": "Extract selectable text from a PDF when you need to quote, search, copy or reuse document wording.",
    "steps": [
      "Open PDF to Text and upload the document.",
      "Run text extraction and download the TXT output.",
      "Open the text file and check reading order, line breaks and special characters."
    ],
    "caution": "Image-only scanned pages may not contain selectable text and therefore may return little or no text without OCR.",
    "related": [
      "pdf-to-word",
      "pdf-to-html",
      "pdf-to-markdown"
    ],
    "blogSlug": "pdf-to-text-guide-online"
  },
  {
    "slug": "pdf-to-tiff",
    "name": "PDF to TIFF",
    "keyword": "how to convert PDF pages to TIFF images online",
    "purpose": "Convert PDF pages to TIFF images for workflows that request a TIFF image format, including some scanning and document production systems.",
    "steps": [
      "Open PDF to TIFF and choose the source PDF.",
      "Start rendering the PDF pages as TIFF files.",
      "Download and check the image dimensions, page count and orientation."
    ],
    "caution": "TIFF output can be large; confirm the destination accepts the generated TIFF variant and file size.",
    "related": [
      "pdf-to-bmp",
      "pdf-to-jpg",
      "pdf-to-png"
    ],
    "blogSlug": "pdf-to-tiff-guide-online"
  },
  {
    "slug": "pdf-to-webp",
    "name": "PDF to WebP",
    "keyword": "how to convert PDF pages into WebP images online",
    "purpose": "Create WebP images from PDF pages for web previews and workflows that support modern compressed image formats.",
    "steps": [
      "Open PDF to WebP and select the PDF document.",
      "Run the page conversion and download the WebP images.",
      "Preview the images in a compatible browser and check that text remains readable."
    ],
    "caution": "Some older software and upload portals do not accept WebP; confirm format support before converting a document for submission.",
    "related": [
      "pdf-to-jpg",
      "pdf-to-png",
      "images-to-pdf"
    ],
    "blogSlug": "pdf-to-webp-guide-online"
  },
  {
    "slug": "pdf-to-word",
    "name": "PDF to Word",
    "keyword": "how to convert a PDF into an editable Word document online",
    "purpose": "Convert selectable PDF text into an editable Word document for revising reports, letters and other text-based files.",
    "steps": [
      "Open PDF to Word and choose the source PDF.",
      "Run the conversion and download the Word document.",
      "Open it in Word and review paragraphs, tables, page breaks and images."
    ],
    "caution": "Scanned PDFs need OCR, and complex layouts may shift. Proofread the converted document before using it as an official copy.",
    "related": [
      "pdf-to-text",
      "pdf-to-excel",
      "pdf-to-html"
    ],
    "blogSlug": "convert-pdf-to-editable-word-document"
  },
  {
    "slug": "protect-pdf",
    "name": "Protect PDF",
    "keyword": "how to password protect a PDF before emailing or sharing it",
    "purpose": "Add password protection to a PDF before sharing it through an approved channel, where document encryption is appropriate.",
    "steps": [
      "Open Protect PDF and select the document.",
      "Enter the password options requested by the tool and process the file.",
      "Download the protected PDF and test that it requests the intended password."
    ],
    "caution": "Use a strong unique password and share it separately from the document; do not rely on a password as a substitute for secure delivery.",
    "related": [
      "unlock-pdf",
      "remove-pdf-metadata",
      "flatten-pdf"
    ],
    "blogSlug": "protect-pdf-guide-online"
  },
  {
    "slug": "remove-annotations",
    "name": "Remove PDF Annotations",
    "keyword": "how to remove comments and annotations from a PDF before sharing",
    "purpose": "Remove supported comment and annotation objects from a PDF copy before preparing a clean review or distribution version.",
    "steps": [
      "Open Remove Annotations and upload the PDF.",
      "Run the removal process for supported annotation types.",
      "Download the output and inspect pages where comments or markups appeared."
    ],
    "caution": "Annotations may contain review history; preserve an original copy if those comments are needed for audit or collaboration.",
    "related": [
      "flatten-pdf",
      "remove-pdf-links",
      "pdf-information"
    ],
    "blogSlug": "remove-annotations-guide-online"
  },
  {
    "slug": "remove-attachments",
    "name": "Remove PDF Attachments",
    "keyword": "how to remove embedded file attachments from a PDF document",
    "purpose": "Remove embedded file attachments from a PDF when preparing a lighter or more controlled document copy.",
    "steps": [
      "Open Remove Attachments and choose the PDF.",
      "Run the attachment removal operation.",
      "Download the processed file and inspect its attachment panel in a PDF reader."
    ],
    "caution": "Embedded files may be important supporting records; confirm they are no longer required before removing them.",
    "related": [
      "remove-pdf-metadata",
      "protect-pdf",
      "pdf-information"
    ],
    "blogSlug": "remove-attachments-guide-online"
  },
  {
    "slug": "remove-blank-pages",
    "name": "Remove Blank PDF Pages",
    "keyword": "how to automatically remove blank pages from a PDF scan online",
    "purpose": "Clean up scanned or exported PDFs by removing pages that are genuinely blank or contain no needed content.",
    "steps": [
      "Open Remove Blank Pages and select the PDF.",
      "Run the blank-page detection and removal process.",
      "Download the cleaned PDF and inspect pages around every removal."
    ],
    "caution": "Very light text, signatures or faint marks can look blank to automated detection; inspect the output carefully before discarding the original.",
    "related": [
      "delete-pages",
      "extract-pages",
      "compress-pdf"
    ],
    "blogSlug": "remove-blank-pages-guide-online"
  },
  {
    "slug": "remove-pdf-links",
    "name": "Remove PDF Links",
    "keyword": "how to remove clickable hyperlinks from a PDF online",
    "purpose": "Remove supported clickable link annotations from a PDF when preparing a static distribution copy or preventing unwanted navigation.",
    "steps": [
      "Open Remove PDF Links and upload the document.",
      "Run the link-removal process.",
      "Download the output and test several pages to confirm links are no longer active."
    ],
    "caution": "Removing links may also remove useful references or navigation; keep an original copy if readers need those destinations.",
    "related": [
      "remove-annotations",
      "flatten-pdf",
      "pdf-information"
    ],
    "blogSlug": "remove-pdf-links-guide-online"
  },
  {
    "slug": "remove-pdf-metadata",
    "name": "Remove PDF Metadata",
    "keyword": "how to remove author and personal metadata from a PDF before sharing",
    "purpose": "Clear document metadata fields from a PDF before sharing a file when you do not want those properties included.",
    "steps": [
      "Open Remove PDF Metadata and select the PDF.",
      "Run the metadata removal process.",
      "Download the output and inspect its properties in a PDF reader."
    ],
    "caution": "This removes document properties, not names or personal details printed visibly on the pages; review the page content separately.",
    "related": [
      "edit-pdf-metadata",
      "pdf-information",
      "protect-pdf"
    ],
    "blogSlug": "remove-pdf-metadata-guide-online"
  },
  {
    "slug": "reorder-pdf",
    "name": "Reorder PDF Pages",
    "keyword": "how to rearrange and reorder PDF pages online without recreating the file",
    "purpose": "Change the page sequence in a PDF when scanned pages, appendices or report sections are out of order.",
    "steps": [
      "Open Reorder PDF and select the document.",
      "Arrange pages in the intended reading order using the available controls.",
      "Apply the new order, download the PDF and inspect the page sequence."
    ],
    "caution": "Update page references, bookmarks and contents lists if the new order changes where sections appear.",
    "related": [
      "extract-pages",
      "delete-pages",
      "add-page-numbers"
    ],
    "blogSlug": "reorder-pdf-guide-online"
  },
  {
    "slug": "repair-pdf",
    "name": "Repair PDF",
    "keyword": "how to repair a corrupted or damaged PDF file online",
    "purpose": "Attempt best-effort recovery of a damaged PDF that will not open correctly in a compatible viewer.",
    "steps": [
      "Open Repair PDF and select the damaged file.",
      "Run the repair attempt and wait for the result.",
      "Download the recovered file if available and test it in a PDF reader."
    ],
    "caution": "Repair cannot guarantee recovery of every damaged file; keep backups and avoid overwriting the only original copy.",
    "related": [
      "pdf-information",
      "compress-pdf",
      "merge-pdf"
    ],
    "blogSlug": "repair-pdf-guide-online"
  },
  {
    "slug": "rotate-pdf",
    "name": "Rotate PDF",
    "keyword": "how to rotate all PDF pages to landscape or portrait online",
    "purpose": "Correct page orientation in a PDF when scanned pages or exported documents appear sideways or upside down.",
    "steps": [
      "Open Rotate PDF and upload the document.",
      "Choose the rotation direction or angle supported by the tool.",
      "Process and download the updated PDF, then inspect several pages."
    ],
    "caution": "If only a few pages are sideways, use Rotate Selected Pages instead of rotating the entire document.",
    "related": [
      "rotate-selected-pages",
      "reorder-pdf",
      "pdf-information"
    ],
    "blogSlug": "rotate-pdf-guide-online"
  },
  {
    "slug": "rotate-selected-pages",
    "name": "Rotate Selected PDF Pages",
    "keyword": "how to rotate only selected pages in a PDF without changing other pages",
    "purpose": "Fix the orientation of individual pages in a mixed-orientation PDF while leaving the rest of the document unchanged.",
    "steps": [
      "Open Rotate Selected Pages and choose the PDF.",
      "Select the pages that need rotation and set the required direction.",
      "Process the document and verify both changed and unchanged pages."
    ],
    "caution": "Check page numbers carefully before applying rotation, especially when the document includes inserted covers or appendices.",
    "related": [
      "rotate-pdf",
      "reorder-pdf",
      "extract-pages"
    ],
    "blogSlug": "rotate-selected-pages-guide-online"
  },
  {
    "slug": "sign-pdf",
    "name": "Sign PDF",
    "keyword": "how to add a visible electronic signature to a PDF online",
    "purpose": "Place a visible typed signature on a PDF copy when a recipient accepts that form of electronic signing.",
    "steps": [
      "Open Sign PDF and select the document.",
      "Enter or position the signature using the controls provided.",
      "Apply the signature, download the file and check its placement and legibility."
    ],
    "caution": "A visible signature image or typed name is not necessarily a legally compliant digital certificate signature; follow the recipient's signing rules.",
    "related": [
      "protect-pdf",
      "flatten-pdf",
      "pdf-information"
    ],
    "blogSlug": "sign-pdf-guide-online"
  },
  {
    "slug": "split-by-bookmarks",
    "name": "Split PDF by Bookmarks",
    "keyword": "how to split a PDF into separate files using bookmarks",
    "purpose": "Divide a long bookmarked PDF into separate documents based on its outline structure, useful for chapters and organised reports.",
    "steps": [
      "Open Split by Bookmarks and select the PDF.",
      "Run the split operation using the saved bookmark structure.",
      "Download the resulting files and check their names and page ranges."
    ],
    "caution": "The source PDF needs suitable bookmarks; a printed contents page alone may not provide the outline data required.",
    "related": [
      "extract-bookmarks",
      "split-pdf",
      "add-bookmarks"
    ],
    "blogSlug": "split-by-bookmarks-guide-online"
  },
  {
    "slug": "split-pdf",
    "name": "Split PDF",
    "keyword": "how to split a large PDF into smaller files by page range online",
    "purpose": "Divide a large PDF into smaller documents for sharing, uploading or organising chapters and sections.",
    "steps": [
      "Open Split PDF and upload an unchanged copy of the source document.",
      "Choose the page ranges or split options available in the tool; use the PDF viewer's page numbers rather than printed labels.",
      "Process the file, download each result and check page order, page count and readability."
    ],
    "caution": "Some PDFs restrict page extraction. Keep the source file and verify that each downloaded part contains the intended pages.",
    "related": [
      "extract-pages",
      "compress-pdf",
      "merge-pdf"
    ],
    "blogSlug": "split-pdf-and-extract-selected-pages"
  },
  {
    "slug": "unlock-pdf",
    "name": "Unlock PDF",
    "keyword": "how to unlock a password protected PDF with its password online",
    "purpose": "Remove supported PDF restrictions when you have the correct password and permission to modify the document.",
    "steps": [
      "Open Unlock PDF and select the protected file.",
      "Enter the existing password when requested and run the tool.",
      "Download the unlocked copy and check whether the expected pages and permissions are available."
    ],
    "caution": "You must have the password and authorisation; this tool is not a way to bypass unknown passwords or access controls.",
    "related": [
      "protect-pdf",
      "remove-pdf-metadata",
      "pdf-information"
    ],
    "blogSlug": "unlock-pdf-guide-online"
  },
  {
    "slug": "watermark",
    "name": "Add Watermark to PDF",
    "keyword": "how to add a text watermark to every page of a PDF online",
    "purpose": "Add a visible text watermark to identify draft, sample or internal PDF copies before sharing.",
    "steps": [
      "Open Watermark PDF and select the document.",
      "Enter the watermark text and apply the available placement options.",
      "Download the watermarked PDF and inspect visibility on light and dark page areas."
    ],
    "caution": "A visible watermark does not prevent copying or guarantee confidentiality; avoid covering signatures, tables or important text.",
    "related": [
      "header-footer",
      "add-background",
      "protect-pdf"
    ],
    "blogSlug": "watermark-guide-online"
  }
];

export function getToolGuide(slug:string){return toolGuides.find((tool)=>tool.slug===slug);}
export function getRequiredToolGuide(slug:string): ToolGuide {
  const guide = getToolGuide(slug);
  if (!guide) throw new Error(`Missing guide for tool: ${slug}`);
  return guide;
}

const existingBlogSlugs = new Set([
  "compress-pdf-to-under-1mb-online",
  "repair-pdf-guide-online",
  "pdf-to-text-guide-online",
  "merge-multiple-pdf-files-into-one-document",
  "convert-jpg-images-to-one-pdf-on-phone",
  "convert-pdf-pages-to-jpg-images",
  "split-pdf-and-extract-selected-pages",
  "convert-pdf-table-to-excel-spreadsheet",
  "convert-pdf-to-editable-word-document",
]);

export const additionalToolBlogPosts = toolGuides.filter((tool)=>!existingBlogSlugs.has(tool.blogSlug)).map((tool)=>({
  slug:tool.blogSlug,
  title:`How to ${tool.name.toLowerCase()} online: a practical step-by-step guide`,
  description:`Learn ${tool.keyword}, when this PDF task is useful, how to use PDFora and what to check before sharing the result.`,
  keyword:tool.keyword,
  updated:"2026-11-01",
  readTime:"5 min read",
  intro:`${tool.purpose} This guide explains the workflow, what to review in the output and common limitations to consider before using the processed file.`,
  sections:[
    {heading:`When should you ${tool.name.toLowerCase()}?`,paragraphs:[tool.purpose,`This task is useful when preparing documents for work, study, records or online submission. Before processing, keep an untouched copy of the original PDF and check any file-format or page requirements given by the recipient.`,`PDFora provides this workflow in a browser, so you can start from a desktop, tablet or mobile device without installing a separate desktop PDF application.`] },
    {heading:`How to ${tool.name.toLowerCase()} with PDFora`,paragraphs:[`Open the PDFora ${tool.name} page and select the document you want to process. Follow the available on-screen controls and wait for the tool to finish. Download the generated file when processing is complete.`,`Use these steps as a checklist:`],bullets:tool.steps},
    {heading:"Check the result before sharing",paragraphs:[`Open the downloaded file in a PDF reader and review the pages affected by the operation. Check page order, text, images, page dimensions and any important signatures or references. Compare the output with the original if the document is important.`,tool.caution,`If the result is not what you expected, do not overwrite your source file. Recheck the selected pages and settings, then try again with a fresh copy where appropriate.`]}
  ],
  faqs:[
    {question:`How do I ${tool.name.toLowerCase()} online?`,answer:`Open PDFora's ${tool.name} tool, select the source PDF, use the available controls, process the file and review the downloaded result.`},
    {question:`Can I use PDFora ${tool.name} on my phone?`,answer:"PDFora is available in modern mobile browsers. The exact file-selection experience depends on your device and browser."},
    {question:"Will the processed PDF look exactly like the original?",answer:"That depends on the operation and source document. Always inspect the output, especially pages with complex layouts, images, tables or signatures."},
    {question:"What should I do if processing does not give the expected result?",answer:"Keep the original file, confirm it is a valid PDF, review the selected settings and try again. Some protected, damaged or unusual PDFs may not be fully supported."}
  ],
  toolLinks:[{label:tool.name,href:`/${tool.slug}`},...tool.related.slice(0,2).map((slug)=>({label:toolGuides.find((item)=>item.slug===slug)?.name||slug,href:`/${slug}`}))]
}));
