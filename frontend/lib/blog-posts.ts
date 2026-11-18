import { additionalToolBlogPosts } from "./tool-guides";
import { toolCatalog } from "../components/toolCatalog";
import { nepalBlogPosts } from "./nepal-blog-posts";
export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  updated: string;
  readTime: string;
  intro: string;
  sections: BlogSection[];
  faqs: { question: string; answer: string }[];
  toolLinks: { label: string; href: string }[];
  sources?: { label: string; url: string }[];
};

const editorialBlogPosts: BlogPost[] = [
  {
    slug: "qr-code-generator-guide",
    title: "How to Create a QR Code: URLs, Wi-Fi, Contacts and Events",
    description: "Learn how QR codes store information, choose a useful format, customize and download a QR image, and test it before printing or sharing.",
    keyword: "how to create a QR code online",
    updated: "2026-11-17",
    readTime: "7 min read",
    intro: "A QR code is a two-dimensional symbol that can encode a website address, short text, Wi-Fi connection details, contact information or event data. This guide explains how to choose a useful format, create a code with PDFora, check scan reliability and avoid exposing information that should remain private.",
    sections: [
      { heading: "1. Choose what the QR code should do", paragraphs: ["Start with the action you want someone to take. A website QR code is useful on a poster or menu; a Wi-Fi QR code can help guests join a network; a vCard can share business contact details; and an event QR can store a title, date and location. Plain text is suitable when the recipient only needs to read a short note.", "Keep the encoded content focused. Long paragraphs and unnecessary tracking parameters make a denser code that may be harder to scan at small sizes. Use a stable HTTPS address when linking to a website you control."] },
      { heading: "2. Create a QR code with PDFora", paragraphs: ["Open the QR Code Generator and select the content type. Enter the requested details, review spelling and numbers, then choose image dimensions, margin, error correction and colours. Generate the preview and download PNG for common digital uses or SVG when you need a scalable graphic for a design or print workflow."], bullets: ["Choose URL, text, Wi-Fi, email, phone, SMS, WhatsApp, contact card or event.", "Enter only the information needed for that purpose.", "Choose a size and keep a visible quiet-zone margin around the symbol.", "Use a dark foreground on a light background for reliable contrast.", "Generate, download and test the code before sharing."] },
      { heading: "3. Pick colours, size and error correction carefully", paragraphs: ["A QR reader needs to distinguish dark modules from the light background. Strong contrast is more important than decorative colours. Avoid pale foregrounds, patterned backgrounds, gradients or transparent backgrounds that blend into the surface where the code will appear.", "The error-correction setting adds redundancy so a code can sometimes still be read when part of it is damaged. Higher correction can make the symbol denser, so it is not automatically better for every use. Choose a practical level, then test the final exported image at its actual display or print size."] },
      { heading: "4. Test the QR code before publishing", paragraphs: ["Scan the downloaded file from another phone rather than relying only on the preview on the same screen. Test it under normal lighting, at the distance people will use it and after printing if it will appear on paper. Check that the decoded URL, phone number, Wi-Fi name or event details are exactly what you intended.", "For printed material, leave a clear margin around the QR symbol and do not stretch it out of proportion. If the code is too small or dense for the intended distance, shorten the encoded content or increase the printed dimensions."] },
      { heading: "5. Protect privacy and check links", paragraphs: ["A QR code is not encryption. Anyone who can scan it may read its contents, including Wi-Fi credentials or contact details. Only encode information you are comfortable sharing with the people who can access the code.", "Scanning a QR code does not prove that a destination is safe. Before opening a link, inspect the full domain and be cautious with unexpected login, payment or download prompts. PDFora creates the QR image; it does not audit or certify the destination website."] }
    ],
    faqs: [
      { question: "Can I create a QR code for Wi-Fi?", answer: "Yes. Select the Wi-Fi option, enter the exact network name and password, choose the security type and generate the code. Test it with a device that is not already connected to the network." },
      { question: "Can a QR code contain a phone number or email?", answer: "Yes. PDFora supports phone and email payloads, as well as SMS and WhatsApp links. Check the number, country code and message before downloading." },
      { question: "Should I download PNG or SVG?", answer: "PNG is convenient for websites, messaging and everyday documents. SVG is vector artwork that can scale for design and print workflows, but you should still test the printed output." },
      { question: "Can I change the QR code colours?", answer: "Yes. You can choose foreground and background colours. Keep strong contrast and test the exported code with more than one phone." },
      { question: "Does a QR code expire?", answer: "A static QR code does not expire by itself. However, a website address, phone number or service encoded in it can change or stop working." },
      { question: "Is it safe to put a Wi-Fi password in a QR code?", answer: "Only if you intend to share access with people who can scan the code. QR content is readable by scanners and is not encrypted by the QR format." }
    ],
    toolLinks: [{ label: "QR Code Generator", href: "/tools/qr-code-generator" }, { label: "URL Encoder & Decoder", href: "/tools/url-encoder-decoder" }, { label: "Password Generator", href: "/tools/password-generator" }],
    sources: [{ label: "DENSO WAVE: QR Code features and error correction", url: "https://www.qrcode.com/en/about/" }, { label: "Google Search Central: Helpful, reliable, people-first content", url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" }]
  },
  {
    slug: "compress-pdf-to-under-1mb-online",
    title: "How to Compress a PDF to Under 1MB Online",
    description: "Learn practical ways to reduce a PDF to under 1MB for online forms, email and document uploads, and find out why some files cannot reach an exact size.",
    keyword: "how to compress PDF to under 1MB online",
    updated: "2026-11-15",
    readTime: "5 min read",
    intro: "A PDF that is too large can be rejected by an online application, email service or document portal. Use a PDF compression tool to reduce its size, but reaching an exact target such as 1MB depends on what the PDF contains. PDFora's current Compress PDF workflow uses its processing service; other PDFora tools that display a browser-processing notice may work locally on your device. Image-heavy scans usually need more reduction than text-only documents.",
    sections: [
      { heading: "1. Check the PDF before compressing it", paragraphs: ["First, check the current file size and open the document to make sure every page is readable. A 12MB scanned document and a 12MB text-based report need different treatment: scanned pages contain images, while text-based PDFs are often already compact.", "If the file contains high-resolution photos, those images are usually the biggest opportunity for reducing size. If it is mostly selectable text, aggressive compression may make very little difference."] },
      { heading: "2. Compress the PDF with an online tool", paragraphs: ["Open PDFora's Compress PDF tool, select the PDF from your device and start processing. When the result is ready, download it and check the new file size. PDFora's current compression workflow uses its processing service rather than the browser-only PDF worker. The selected PDF is sent for server-side processing, so read the tool's privacy notice before uploading.", "Try the compression once before changing the original. Keep an untouched copy in case the smaller version is not clear enough for printing or official submission."], bullets: ["Open the Compress PDF page.", "Choose the PDF you need to reduce.", "Start compression and wait for processing to finish.", "Download the result, then check its size and readability."] },
      { heading: "3. What if the PDF is still larger than 1MB?", paragraphs: ["A tool cannot always reduce every PDF to a requested size without affecting quality. If the result is still too large, consider whether the document contains unnecessary pages or oversized images. Remove pages only when you are certain they are not required, or split a large document into separate files if the receiving website accepts multiple uploads.", "Avoid repeatedly compressing an already compressed PDF. Each additional pass can reduce image quality without delivering a meaningful size improvement."] },
      { heading: "4. Check readability before uploading", paragraphs: ["Open the downloaded PDF and inspect small text, signatures, tables and scanned stamps. Make sure the document is complete and the pages are in the correct order. For an application or official form, readability matters more than achieving an arbitrary file size.", "If a portal specifies a strict maximum, compare the final file size with that limit and follow the portal's own instructions about PDF format and page count."] }
    ],
    faqs: [
      { question: "Can I always compress a PDF to under 1MB?", answer: "No. The result depends on the original file, page count, images and compression already applied. Some image-heavy PDFs cannot reach 1MB without substantial quality loss." },
      { question: "Will compressing a PDF remove its text?", answer: "Compression is intended to reduce file size, but you should open the output and check that text, images and page layout remain usable." },
      { question: "How can I make a scanned PDF smaller?", answer: "Scanned PDFs often contain large page images. Compression may help, but reducing image resolution or scanning settings at the source can have a bigger effect. Check legibility after every change." },
      { question: "Is PDFora's compressor free to use?", answer: "PDFora offers its available PDF tools online without requiring a paid subscription. Check the live tool page for current limits and availability." }
    ],
    toolLinks: [{ label: "Compress PDF", href: "/compress-pdf" }, { label: "Split PDF", href: "/split-pdf" }, { label: "Delete PDF Pages", href: "/delete-pages" }]
  },
  {
    slug: "merge-multiple-pdf-files-into-one-document",
    title: "How to Merge PDF Files Online: Order, Limits & Steps",
    description: "Combine 2–20 PDF files into one document, set their page order, stay within the 50 MB upload limit and check the finished PDF.",
    keyword: "how to merge multiple PDF files into one document",
    updated: "2026-11-12",
    readTime: "5 min read",
    intro: "Merging PDFs is useful when related pages are saved as separate documents. Choose the files, arrange their reading order, and create one combined PDF. Before uploading, check the file count and total size so the merge fits the tool's limits.",
    sections: [
      { heading: "When should you combine PDF files?", paragraphs: ["Merge related documents when a recipient asks for one file: a report and its appendices, assignment sections, invoices for one project, or supporting documents for an application. If a portal asks for separate files, follow its instructions instead of merging unrelated records.", "Keep a copy of each source PDF until you have opened and checked the merged document. A combined file is easier to share, but it is not a substitute for checking that every page belongs in the bundle."] },
      { heading: "How to merge PDFs online with PDFora", paragraphs: ["Open PDFora's Merge PDF tool and select at least two PDF files. The current tool limit is 20 files with a combined upload size of 50 MB. After selecting files, use the up and down arrow buttons beside each filename to set the reading order. The merged PDF follows that order; pages inside each source file keep their original sequence.", "Remove any file selected by mistake, start the merge, and download the new PDF. Open the result and check the first, middle and final pages, especially where one source file ends and the next begins."], bullets: ["Open Merge PDF.", "Select 2–20 PDF files whose combined size is no more than 50 MB.", "Use the up and down arrows to set the file order.", "Remove any unwanted file, then run the merge.", "Download the result and check page order and readability."] },
      { heading: "Plan the file order before merging", paragraphs: ["Put a cover page or summary first, the main report or application next, and supporting evidence or appendices last when that is the order the recipient expects. Check filenames before you start; similar filenames can make it easy to select the wrong version.", "The file order controls where each document begins in the final PDF. If you need to change the order later, return to the tool, select the source PDFs and move them into the correct sequence before merging again."] },
      { heading: "File limits and common upload problems", paragraphs: ["PDFora accepts up to 20 PDF files in one merge. The combined size of all selected files must not exceed 50 MB. The limit applies to the total upload, not to each file separately. If the combined size is too large, compress source files first or split the job into smaller groups.", "If a file is rejected, check that it opens in a PDF reader and is not damaged. Avoid renaming a non-PDF file with a .pdf extension; the contents must be a valid PDF document."] },
      { heading: "Scanned PDFs, text search and page quality", paragraphs: ["Merging combines the pages already inside each PDF. It does not perform optical character recognition (OCR). If a source document contains scanned page images, those pages remain images and do not become searchable text after merging.", "Merging is not compression or proofreading. Review page orientation, blank pages, page order and readability in the downloaded file. If the final file is too large for a receiving portal, compress it and inspect the result before sending."] }
    ],
    faqs: [
      { question: "How many PDF files can I merge with PDFora?", answer: "You can select 2–20 PDF files in one job. The combined upload size must stay within 50 MB." },
      { question: "Can I change the order of PDF files before merging?", answer: "Yes. Use the up and down arrow buttons beside the selected filenames to set the reading order before you start the merge." },
      { question: "Will merging make scanned PDF pages searchable?", answer: "No. The tool combines existing pages but does not run OCR. Scanned pages remain images until you process them with OCR." },
      { question: "Does merging overwrite the original PDFs?", answer: "No. PDFora creates a separate merged PDF for download. Keep your source files until you have checked the output." },
      { question: "What if the combined PDF upload is over 50 MB?", answer: "The combined upload must not exceed 50 MB. Compress the source PDFs or merge smaller groups, then check the resulting file." }
    ],
    toolLinks: [{ label: "Merge PDF", href: "/merge-pdf" }, { label: "Compress PDF", href: "/compress-pdf" }, { label: "Split PDF", href: "/split-pdf" }]
  },
  {
    slug: "convert-jpg-images-to-one-pdf-on-phone",
    title: "How to Convert JPG Images into One PDF on Your Phone",
    description: "Turn multiple JPG or JPEG photos into a single PDF from a mobile browser, with tips for image order, orientation and file size.",
    keyword: "convert multiple JPG images to one PDF on phone",
    updated: "2026-11-01",
    readTime: "4 min read",
    intro: "Photos of notes, receipts and forms are often easier to submit as one PDF than as a collection of separate image files. You can combine supported images into a PDF using a mobile browser, then review the pages before sharing.",
    sections: [
      { heading: "Prepare your images first", paragraphs: ["Choose clear JPG or JPEG images and make sure the text is readable. If the photos are documents, place them on a flat surface with good lighting and avoid shadows over important details.", "Rename or sort the images if your phone's file picker does not make their intended order obvious. The first selected image should normally become the first page of the PDF."] },
      { heading: "Create one PDF from JPG images", paragraphs: ["Open PDFora's Images to PDF tool in your phone browser. Select the images you want to include, check their order if the tool offers ordering controls, and start the conversion. Download the generated PDF and open it on your phone to review every page."], bullets: ["Open Images to PDF in your mobile browser.", "Select the JPG or JPEG photos from your device.", "Confirm the page order and orientation.", "Convert the images and download the PDF.", "Open the PDF and check that all images are readable."] },
      { heading: "Make the final PDF easier to submit", paragraphs: ["Crop unnecessary background from photos before conversion where possible. Keep the camera straight above the page to avoid perspective distortion. If the final PDF is too large for an upload portal, try the Compress PDF tool and then check the text and image quality.", "Some application portals require a specific page size, maximum file size or document order. Follow those requirements even if a different layout looks more attractive."] },
      { heading: "JPG, JPEG and other image formats", paragraphs: ["JPG and JPEG are two filename extensions commonly used for the same image format. PDFora's Images to PDF page lists support for JPG, JPEG, PNG and WebP. If a photo is in another format, convert it to a supported image type before uploading."] }
    ],
    faqs: [
      { question: "Can I convert multiple JPG images into one PDF?", answer: "Yes. Select multiple supported images in the Images to PDF tool to combine them into one PDF document." },
      { question: "Can I do this without installing an app?", answer: "Yes. PDFora's tool works in a modern browser, so a separate PDF app is not required for this workflow." },
      { question: "Will each photo become a separate PDF page?", answer: "The tool combines the selected images into a PDF. Open the output to confirm the page count and order." },
      { question: "Can I reduce the size of the PDF afterwards?", answer: "Yes. You can try PDFora's Compress PDF tool, then inspect the result to ensure the images remain readable." }
    ],
    toolLinks: [{ label: "Images to PDF", href: "/images-to-pdf" }, { label: "Compress PDF", href: "/compress-pdf" }, { label: "Rotate PDF", href: "/rotate-pdf" }]
  },
  {
    slug: "convert-pdf-pages-to-jpg-images",
    title: "How to Convert PDF Pages to JPG Images Online",
    description: "Learn how to turn PDF pages into JPG images for sharing, presentations and previews, and when JPG is not the best format.",
    keyword: "how to convert PDF pages to JPG images online",
    updated: "2026-11-01",
    readTime: "4 min read",
    intro: "A PDF is useful for preserving a document, while JPG images are convenient when you need to share a page in a chat, add it to a presentation or upload it to a service that accepts images. Converting a PDF to JPG creates an image version of each page.",
    sections: [
      { heading: "When is PDF to JPG useful?", paragraphs: ["Use JPG when a recipient needs a picture of a page rather than an editable document. It can be useful for quick previews, sharing a page in a messaging app or placing a document page into a slide deck.", "Keep the original PDF when you need searchable text, selectable content, links or a document that can be printed consistently. A JPG is a flattened image, not an editable copy of the original PDF."] },
      { heading: "Convert PDF pages to JPG with PDFora", paragraphs: ["Open PDFora's PDF to JPG page, select your PDF and start the conversion. Download the generated image files when processing finishes. If the PDF has multiple pages, check that the output includes the pages you need."], bullets: ["Open the PDF to JPG converter.", "Choose the PDF document from your device.", "Start converting the PDF pages.", "Download the JPG images.", "Open a few images and check text clarity and page orientation."] },
      { heading: "Choose JPG or PNG", paragraphs: ["JPG is often a practical choice for photographs and smaller image files. PNG can be preferable for graphics, sharp text or screenshots where crisp edges matter. PDFora also provides a PDF to PNG tool if you need that format.", "The visual result depends on the source PDF and conversion settings. Zoom in on small text before sharing an image version of an important document."] },
      { heading: "Keep the original document safe", paragraphs: ["Conversion does not replace the original PDF. Save the source file in case you later need to search text, print the document or make edits. If you only need one page, consider extracting that page before converting, if the available workflow suits your task."] }
    ],
    faqs: [
      { question: "Does every PDF page become a JPG?", answer: "The PDF to JPG tool converts PDF pages into image files. Review the downloaded output to confirm all required pages are present." },
      { question: "Can I convert a PDF to JPG on mobile?", answer: "Yes. You can open PDFora in a modern mobile browser and use the PDF to JPG page." },
      { question: "Is JPG better than PNG for PDF pages?", answer: "It depends. JPG is commonly used for photos and compact images, while PNG can preserve sharper text and graphic edges." },
      { question: "Can I edit text after converting PDF to JPG?", answer: "No. JPG is an image format, so the page content is not directly editable as document text. Keep or convert the original PDF when you need editable content." }
    ],
    toolLinks: [{ label: "PDF to JPG", href: "/pdf-to-jpg" }, { label: "PDF to PNG", href: "/pdf-to-png" }, { label: "Extract PDF Pages", href: "/extract-pages" }]
  },
  {
    slug: "split-pdf-and-extract-selected-pages",
    title: "How to Extract Pages from a PDF (or Split It) Free",
    description: "Extract selected pages from a PDF or split it into parts online. Learn page ranges like 2,5,9-12 and avoid common page-number mistakes.",
    keyword: "how to split PDF and extract selected pages online",
    updated: "2026-11-01",
    readTime: "5 min read",
    intro: "A long PDF may contain only a few pages that you need to send, print or keep. Splitting the document or extracting selected pages creates a separate PDF containing the relevant material, while leaving the original file available.",
    sections: [
      { heading: "Split a PDF or extract pages: what is the difference?", paragraphs: ["Splitting usually means dividing a document into multiple smaller PDFs. Extracting pages means choosing specific pages and saving them as a new PDF. The right option depends on whether you want several parts or just one selected section.", "For example, if a 40-page report only needs pages 8 to 12 for an email, extracting those pages is usually more convenient than splitting the entire report into many files."] },
      { heading: "Extract pages with PDFora", paragraphs: ["Open PDFora's Extract Pages tool if you want to save selected pages as a separate document. Choose the PDF, select the pages according to the tool's controls, process the file and download the result. If you need to divide a document into parts, use the Split PDF tool instead."], bullets: ["Open Extract Pages or Split PDF.", "Select the source PDF.", "Choose the pages or split method you need.", "Start processing and download the new PDF file.", "Open the output and verify the page sequence."] },
      { heading: "Check page numbers carefully", paragraphs: ["PDF page labels do not always match the physical position in the file. A document may show printed page number 1 after a cover page, while the PDF viewer counts the cover as page 1. Check the actual page thumbnails before extracting.", "For legal, academic or application documents, verify that all referenced pages, signatures and attachments are included."] },
      { heading: "What to do with the original PDF", paragraphs: ["Keep the original until you have checked the extracted file. If you need to remove unwanted pages from a copy rather than create a separate extract, use Delete PDF Pages. If the new file is too large to upload, you can try compressing it afterwards."] }
    ],
    faqs: [
      { question: "Can I extract only pages 2, 5 and 9?", answer: "Use the Extract Pages workflow and select the required pages if supported by the tool controls. Always verify the downloaded file." },
      { question: "Does splitting a PDF delete the original?", answer: "The process creates output files; keep your original source file until you have confirmed the results." },
      { question: "Should I use Split PDF or Extract Pages?", answer: "Use Split PDF to divide a document into parts. Use Extract Pages when you only need selected pages in a new document." },
      { question: "Can I split a PDF on my phone?", answer: "PDFora is accessible through modern mobile browsers. Select the source PDF and follow the tool's on-screen controls." }
    ],
    toolLinks: [{ label: "Split PDF", href: "/split-pdf" }, { label: "Extract PDF Pages", href: "/extract-pages" }, { label: "Delete PDF Pages", href: "/delete-pages" }]
  },
  {
    slug: "reduce-pdf-file-size-for-email-attachment",
    title: "How to Reduce PDF File Size for an Email Attachment",
    description: "Practical ways to make a PDF easier to email, understand attachment limits and check the document after compression.",
    keyword: "how to reduce PDF file size for email attachment",
    updated: "2026-11-01",
    readTime: "4 min read",
    intro: "Large PDF attachments can exceed email limits or take a long time to upload. Compressing the file is often the simplest first step, but the best result depends on whether the PDF contains photos, scans or mostly text.",
    sections: [
      { heading: "Check the email attachment limit", paragraphs: ["Different email providers and workplace systems have different attachment limits. Check the limit for the account you are sending from and the recipient's system if known. Remember that some services encode attachments during sending, so the maximum allowed file can be smaller than the headline limit.", "If the recipient provides a secure upload portal, that may be preferable for sensitive or very large documents."] },
      { heading: "Compress the PDF before attaching it", paragraphs: ["Use PDFora's Compress PDF tool to process the document. The current compression workflow sends the selected PDF to PDFora's processing service rather than processing it locally in the browser. Review the tool's privacy notice before uploading, then download the result and compare its size with the email limit before attaching it."], bullets: ["Check the original PDF size.", "Open Compress PDF and select your file.", "Run compression and download the output.", "Open the compressed PDF and check that it is readable.", "Attach the verified file to your email."] },
      { heading: "Other ways to make an attachment smaller", paragraphs: ["Remove pages that the recipient does not need, but only when you are authorised to do so. If the document is a scan, a new scan at a sensible resolution may be smaller than a high-resolution photograph of every page. Avoid taking screenshots of text pages when a proper PDF is available.", "If the file remains too large, ask whether the recipient accepts multiple smaller PDFs or a secure file-sharing link. Do not split a document if the recipient requires one complete signed file."] },
      { heading: "Protect document quality and privacy", paragraphs: ["After compression, check signatures, tables, small print and images. Do not send a file that has become too blurry to read. For confidential records, use a sharing method approved by your organisation and review PDFora's privacy information before uploading sensitive files to any online service."] }
    ],
    faqs: [
      { question: "What is the best way to reduce a PDF for email?", answer: "Try a PDF compressor, then inspect the output and confirm that it is below the recipient's attachment limit." },
      { question: "Will compressing a PDF make it blurry?", answer: "It can affect image quality depending on the source and compression method. Always inspect scans, photos and small text before sending." },
      { question: "Can I email a PDF larger than the attachment limit?", answer: "Usually you need an approved file-sharing link, a secure portal or smaller separate files if the recipient allows them." },
      { question: "Can I reduce a PDF without deleting pages?", answer: "Compression can reduce file size without intentionally removing pages. Verify the output to make sure all pages remain." }
    ],
    toolLinks: [{ label: "Compress PDF", href: "/compress-pdf" }, { label: "Split PDF", href: "/split-pdf" }, { label: "Delete PDF Pages", href: "/delete-pages" }]
  },
  {
    slug: "convert-pdf-table-to-excel-spreadsheet",
    title: "How to Convert a PDF Table into an Excel Spreadsheet",
    description: "Understand how to extract table data from a PDF into Excel, what works with selectable text and how to clean up the spreadsheet.",
    keyword: "how to convert a PDF table to Excel spreadsheet",
    updated: "2026-11-01",
    readTime: "5 min read",
    intro: "Tables in PDF reports are convenient to read but can be difficult to analyse. Converting a PDF table to Excel can make figures easier to sort, filter and calculate. The quality of the result depends heavily on how the original PDF was created.",
    sections: [
      { heading: "Check whether the PDF contains selectable text", paragraphs: ["Open the PDF and try selecting a few words or numbers in the table. If the text can be selected, the file may contain extractable text. If every page behaves like a photograph, it is probably a scanned PDF and may need OCR before table data can be extracted.", "Complex tables with merged cells, multi-line headings or columns split across pages may require manual cleanup even after conversion."] },
      { heading: "Convert a PDF to Excel with PDFora", paragraphs: ["Open PDFora's PDF to Excel tool, choose the source PDF and start conversion. Download the generated workbook and open it in Excel or a compatible spreadsheet application. Check the rows and columns before using the figures in a report or calculation."], bullets: ["Open PDF to Excel.", "Select the PDF that contains the table.", "Start the conversion and download the workbook.", "Open the spreadsheet and inspect column alignment.", "Compare important totals and figures with the original PDF."] },
      { heading: "Clean up the converted spreadsheet", paragraphs: ["Check that each value is in the correct column. Numbers may be imported as text, dates may be interpreted differently and negative values can be easy to overlook. Reapply number formats and formulas only after checking the source.", "For financial, statistical or academic work, verify totals and sample values against the original document. Do not assume that a visually tidy spreadsheet is automatically accurate."] },
      { heading: "When PDF to Excel may not work perfectly", paragraphs: ["Scanned pages, handwritten entries, low-resolution images and complicated layouts can prevent reliable table extraction. A scanned PDF may require OCR, and OCR errors are possible. If the data is important, compare every converted value with the source or obtain the original spreadsheet from its publisher."] }
    ],
    faqs: [
      { question: "Can I convert a scanned PDF table to Excel?", answer: "Scanned PDFs contain page images rather than selectable text. OCR may be required first, and the extracted numbers must be checked carefully." },
      { question: "Will the Excel file look exactly like the PDF?", answer: "Not necessarily. PDF and spreadsheet layouts work differently, so converted tables may need column, number-format and heading adjustments." },
      { question: "Can I edit the converted Excel data?", answer: "The purpose of the conversion is to create spreadsheet data you can work with. Check the output workbook and correct any extraction errors before relying on it." },
      { question: "What should I check after conversion?", answer: "Verify column alignment, decimal points, dates, negative values, totals and any merged or multi-line table headings against the original PDF." }
    ],
    toolLinks: [{ label: "PDF to Excel", href: "/pdf-to-excel" }, { label: "PDF to CSV", href: "/pdf-to-csv" }, { label: "PDF to Word", href: "/pdf-to-word" }]
  },
  {
    slug: "convert-pdf-to-editable-word-document",
    title: "How to Convert a PDF into an Editable Word Document",
    description: "Learn how to convert a text-based PDF to Word, preserve formatting where possible and understand the limits of scanned documents.",
    keyword: "how to convert PDF to editable Word document online",
    updated: "2026-11-01",
    readTime: "5 min read",
    intro: "A PDF is designed to keep a document's layout consistent, while a Word file is easier to edit. Converting a PDF into Word can help when you need to revise a report, reuse text or update a document, but the result depends on the structure of the original PDF.",
    sections: [
      { heading: "Check the PDF before converting", paragraphs: ["Try selecting text in the PDF. If you can highlight words and copy them, the file likely contains selectable text and is a better candidate for text extraction. If the pages are scans or photos, the text may not be recognised by a standard PDF-to-Word conversion tool.", "Tables, columns, unusual fonts and complex page layouts may shift during conversion. Keep the original PDF so you can compare the output with the source."] },
      { heading: "Convert PDF to Word online", paragraphs: ["Open PDFora's PDF to Word page, select your PDF and start conversion. Download the resulting Word document and open it in Microsoft Word or a compatible editor. Review headings, paragraphs, tables and page breaks before making changes."], bullets: ["Open PDF to Word.", "Choose the PDF you want to convert.", "Start the conversion process.", "Download and open the Word document.", "Compare the result with the original PDF and fix formatting if needed."] },
      { heading: "How to keep formatting usable", paragraphs: ["For a simple text document, the converted file may need only small adjustments. For a document with columns, tables or images, check the reading order and make sure each element is placed correctly. Reapply heading styles and paragraph spacing if the original layout was complex.", "If you only need the text rather than the layout, a plain-text extraction may be easier to edit. PDFora also provides a PDF to Text tool for selectable text."] },
      { heading: "Important limitation: scanned PDFs", paragraphs: ["A scanned PDF is essentially a collection of images. Converting it to Word does not automatically guarantee editable text. Optical character recognition (OCR) is needed to recognise the words in those images, and recognition accuracy depends on scan quality, language and handwriting.", "PDFora's OCR feature is not currently available on the processing server. If your PDF is scanned, use a suitable OCR workflow first or obtain the original digital document. Always proofread recognised text, especially names, figures and dates."] }
    ],
    faqs: [
      { question: "Can I convert any PDF into an editable Word file?", answer: "Text-based PDFs are generally better candidates. Scanned PDFs need OCR, and complex layouts may require manual formatting after conversion." },
      { question: "Will images and tables stay in the same place?", answer: "Not always. Word uses a different layout system from PDF, so review images, tables, columns and page breaks after conversion." },
      { question: "Can I convert a scanned PDF to Word with PDFora OCR?", answer: "PDFora's OCR feature is not currently enabled on its processing server. Scanned PDFs need a separate OCR workflow before their text can be edited." },
      { question: "Is the converted Word document ready to submit?", answer: "Check the complete document against the source PDF, correct formatting and proofread the text before submitting or sharing it." }
    ],
    toolLinks: [{ label: "PDF to Word", href: "/pdf-to-word" }, { label: "PDF to Text", href: "/pdf-to-text" }, { label: "PDF to Excel", href: "/pdf-to-excel" }]
  },
{
    slug: "repair-pdf-guide-online",
    title: "How to Repair a Damaged PDF Online: What to Check",
    description: "Try a best-effort repair for a PDF that will not open. Learn how to protect the original file and verify the recovered copy.",
    keyword: "how to repair a corrupted or damaged PDF file online",
    updated: "2026-11-10",
    readTime: "6 min read",
    intro: "A PDF may stop opening after an interrupted download, storage error, transfer problem or damaged file structure. A repair attempt can sometimes make a damaged file readable again, but it cannot recreate information that was never saved or has been permanently lost. Start with a copy and treat every recovered file as a new version that needs checking.",
    sections: [
      { heading: "1. Protect the original before trying a repair", paragraphs: ["Make a separate copy of the damaged PDF and leave the original untouched. If the file came from an email, website or cloud drive, check whether you can download it again; a fresh copy may solve an incomplete transfer without any repair step.", "Try opening the file in another trusted PDF reader. If only one application reports an error, the issue may be viewer-specific rather than damage to the PDF itself. Also check that the file is not empty and that its extension matches the actual file type."] },
      { heading: "2. Try the PDFora repair workflow", paragraphs: ["Open the Repair PDF page, choose the copy of the damaged file and start the repair attempt. Wait for processing to finish, then download the recovered PDF if a result is produced. The tool makes a best-effort attempt to rewrite the file; it does not promise recovery of every damaged document.", "Do not upload the only copy of an important record and do not overwrite the source with the downloaded result. Keep both files until you have checked the recovered version."] , bullets: ["Keep an untouched backup of the source PDF.", "Select the copied file on the Repair PDF page.", "Run the repair attempt and wait for the result.", "Download the recovered copy and open it in a PDF reader."] },
      { heading: "3. Check what was recovered", paragraphs: ["A file that opens is not necessarily a complete recovery. Compare the recovered copy with the source or another copy when available. Check the total page count, first and last pages, text, images, tables, page dimensions and reading order. Pay extra attention to pages that were missing or unreadable before the repair.", "Bookmarks, form fields, annotations, embedded attachments and interactive elements may not survive a rewrite exactly as they were. If the PDF contains a digital signature, verify it again: changing the underlying file can invalidate a signature even when the visible page looks unchanged."] },
      { heading: "4. Understand when repair may not work", paragraphs: ["A repair tool cannot restore bytes that are missing from a truncated download, recreate pages that were never stored, or guarantee recovery from severe corruption. Password protection, unusual PDF features and damaged embedded resources can also prevent a successful result. If the file is important, ask the sender for a fresh copy rather than relying on an incomplete recovery.", "If the PDF opens but is simply too large, use compression instead of repair. If the pages are intact but appear sideways, use a rotation tool. If you only need to inspect document properties, start with PDF Information."] },
      { heading: "5. Handle recovered documents carefully", paragraphs: ["PDFs can contain personal details, signatures, financial information and confidential records. Upload only documents you are authorised to process, and review the privacy information before using an online service for sensitive material. Keep a local backup until the recovered file has been checked and accepted by its recipient.", "For official, legal, financial or academic submissions, confirm the receiving organisation's requirements and retain the original source. A successful download is not proof that every page or embedded feature has been preserved."] }
    ],
    faqs: [
      { question: "Can an online tool repair every damaged PDF?", answer: "No. Repair is best-effort. A file with missing data, severe corruption or unsupported features may not be recoverable. Try to obtain a fresh copy when possible." },
      { question: "Will the repaired PDF be identical to the original?", answer: "Not necessarily. Check page count, text, images, layout, bookmarks, forms and attachments. Rewriting a PDF can also invalidate a digital signature." },
      { question: "Should I upload my only copy?", answer: "No. Keep an untouched copy and process a duplicate. Do not overwrite the source until you have reviewed the recovered file." },
      { question: "What if the PDF still will not open?", answer: "Try downloading it again or opening it in another trusted reader. If the file is important, ask the sender for a fresh copy rather than relying on a partial recovery." }
    ],
    toolLinks: [{ label: "Repair PDF", href: "/repair-pdf" }, { label: "PDF Information", href: "/pdf-information" }, { label: "Compress PDF", href: "/compress-pdf" }]
  },
  {
    slug: "pdf-to-text-guide-online",
    title: "How to Extract Text from a PDF Online and Save a TXT File",
    description: "Extract selectable PDF text into a TXT file. Learn how to prepare the document and check reading order, line breaks and scanned pages.",
    keyword: "how to extract text from a PDF online",
    updated: "2026-11-10",
    readTime: "6 min read",
    intro: "Extracting text from a PDF is useful when you need to search, quote, review or reuse the wording in another document. PDFora's PDF to Text tool exports selectable text into a downloadable TXT file. It does not recreate the original page layout, and scanned pages need a separate OCR workflow before their words can be extracted.",
    sections: [
      { heading: "1. Check whether the PDF contains selectable text", paragraphs: ["Open the PDF in a reader and try selecting a sentence with your cursor. If you can highlight individual words, the page contains selectable text and is a good candidate for extraction. If the page behaves like one large picture, it may be a scan; an ordinary text extractor cannot read words that exist only as pixels.", "Some PDFs mix selectable text with scanned pages. In that case, the output may contain text from some pages but little or nothing from the image-only pages. Identify those pages before relying on the extracted file."] },
      { heading: "2. Extract text with PDFora", paragraphs: ["Open the PDF to Text page and choose the source PDF from your device. Start the extraction and wait for processing to finish. Download the TXT file and open it in a text editor to review the extracted wording.", "Keep the original PDF beside the TXT output. The text file is intended for reading and reuse; it does not preserve page styling, exact spacing, images or the full visual structure of the source document."] , bullets: ["Choose a PDF that contains selectable text.", "Upload it on the PDF to Text page.", "Run the extraction and download the TXT file.", "Open the text file and compare important passages with the original PDF."] },
      { heading: "3. Review reading order and formatting", paragraphs: ["PDFs store text at positions on a page rather than as a normal word-processing document. A multi-column page, table, sidebar or footnote may therefore be extracted in an order that differs from how a person reads the page. Check headings, paragraphs, numbered lists, columns and table values before copying the text elsewhere.", "Line breaks may appear at the end of visual lines, while headers and footers may be mixed into the main text. Search for missing punctuation, unusual symbols, broken words and characters that have been substituted by the source font."] },
      { heading: "4. Know the limits of text extraction", paragraphs: ["A TXT file contains text, not the original page design. Images, charts, diagrams, handwriting, stamps and signatures are not converted into editable text by this workflow. Scanned pages require OCR, and OCR output should be proofread because similar characters, decimal points and punctuation can be misread.", "If you need editable paragraphs and some document structure, PDF to Word may be a better next step. If you need web markup, PDF to HTML may suit a different workflow. Choose the format based on what you plan to do with the content."] },
      { heading: "5. Protect the source document and extracted text", paragraphs: ["Extracted text can contain names, addresses, account details, contract terms or other private information from the original PDF. Upload only files you are authorised to process and review the site's privacy information before using an online tool for sensitive records.", "Before sharing the TXT file, compare important passages with the source and remove any content that the recipient should not receive. Keep the original PDF until the extracted text has been checked and saved where it belongs."] }
    ],
    faqs: [
      { question: "Can PDF to Text read a scanned PDF?", answer: "Not by ordinary text extraction. A scanned page is an image and needs OCR before its words can be extracted. PDFora's PDF to Text workflow extracts selectable text; use a separate OCR process for image-only pages." },
      { question: "Will the TXT file keep the PDF layout?", answer: "No. TXT stores plain text, not page styling, images, columns or exact spacing. Review the reading order and line breaks after extraction." },
      { question: "Why are some words or symbols missing?", answer: "The source PDF may use unusual fonts, contain image-only pages or store text in a complex layout. Compare the output with the original and proofread important values." },
      { question: "Should I use PDF to Word instead?", answer: "Use PDF to Text when you mainly need plain wording. Use PDF to Word when you need an editable document structure, then review formatting and tables after conversion." }
    ],
    toolLinks: [{ label: "PDF to Text", href: "/pdf-to-text" }, { label: "PDF to Word", href: "/pdf-to-word" }, { label: "PDF to HTML", href: "/pdf-to-html" }]
  },
  {
    slug: "pdf-to-csv-guide-online",
    title: "How to Convert PDF Tables to CSV Online",
    description: "Convert PDF tables to CSV online with PDFora. Extract selectable table data, download a CSV file and check delimiters, columns, dates and totals.",
    keyword: "convert PDF to CSV online",
    updated: "2026-11-13",
    readTime: "5 min read",
    intro: "A CSV file is useful when you need table values from a PDF in a spreadsheet, database or data-cleaning workflow. PDFora can export available text-based table data to CSV, but the quality depends on how the original PDF stores its rows and columns. This guide explains how to convert a table and verify the data before relying on it.",
    sections: [
      { heading: "When should you convert a PDF table to CSV?", paragraphs: ["Choose CSV when you need plain rows and columns that can be opened in spreadsheet software, imported into a database or processed with another data tool. CSV is a simple text format, so it is often convenient for transferring table values between applications.", "Use PDF to Excel instead when you need an XLSX workbook for spreadsheet-specific features. CSV does not preserve cell colours, fonts, formulas, charts or multiple worksheets; it stores values and delimiters as text."] },
      { heading: "Prepare the PDF before conversion", paragraphs: ["Text-based PDFs with selectable table text and a clear row-and-column structure are usually the best starting point. Open the source PDF and check that you can select the table text. If the table is only a photograph or scanned image, ordinary text extraction may not recognise its values; OCR may be needed first.", "Keep an untouched copy of the original PDF. Tables with merged cells, multi-line headings, footnotes, repeated headers or columns positioned independently on the page may need manual cleanup after conversion."] },
      { heading: "How to convert PDF to CSV with PDFora", paragraphs: ["Open PDFora's PDF to CSV tool and select a PDF that contains a readable table. Start the conversion, wait for processing to finish and download the generated CSV file. Open it in a spreadsheet application such as Excel, Google Sheets or LibreOffice Calc to review the extracted rows.", "For the first attempt, use a short representative document if possible. Confirm that the tool has extracted the table you need before processing a larger or more complex PDF."], bullets: ["Open PDF to CSV and select a PDF containing a table.", "Run the conversion and download the CSV file.", "Open the CSV in a spreadsheet application.", "Check the delimiter, headers, columns, decimal points, dates and totals against the original PDF."] },
      { heading: "Check the CSV data before using it", paragraphs: ["CSV files separate values with delimiters, commonly commas. If a value itself contains a comma, quotation marks or a line break, it should be quoted correctly. When opening the file, check that each value appears in the intended column and that rows have not shifted.", "Review decimal and thousands separators, negative signs, percentages, dates, leading zeros and total values. Spreadsheet software may automatically reinterpret dates or remove leading zeros from codes and account-like identifiers. If those values matter, import the CSV and set the relevant columns to text before editing.", "Compare important figures with the source PDF. A CSV file contains table data rather than the original page design, so do not expect it to reproduce the PDF's fonts, borders, images or exact visual layout."] },
      { heading: "Common PDF-to-CSV limitations", paragraphs: ["Scanned tables may need OCR, and OCR can confuse similar characters such as 0 and O, 1 and I, decimal points and commas. Complex layouts, merged cells, multiple tables on one page and tables that continue across pages can also affect extraction accuracy.", "If the CSV does not match the source, keep the original, check whether the PDF text is selectable and compare a few rows manually. For a workbook with separate sheets or richer spreadsheet formatting, try PDF to Excel instead."] }
    ],
    faqs: [
      { question: "How do I convert PDF to CSV online?", answer: "Open PDFora's PDF to CSV tool, select a PDF containing a readable table, run the conversion and download the CSV file. Open it in a spreadsheet and check the extracted columns and values." },
      { question: "Can I use PDFora PDF to CSV on my phone?", answer: "Yes. You can open PDFora in a modern mobile browser and select a PDF from your device. The exact file-selection experience depends on your phone and browser." },
      { question: "Will the CSV file look exactly like the original PDF?", answer: "No. CSV stores table values as delimited text. It does not preserve the PDF page layout, images, fonts, cell styling, formulas or multiple worksheets." },
      { question: "Can scanned PDF tables be converted to CSV?", answer: "Scanned pages are images rather than selectable text. OCR may be required before table extraction, and you should verify recognised digits and totals against the original." },
      { question: "What should I check after downloading the CSV?", answer: "Check the delimiter, header row, column alignment, quotation marks, decimal separators, dates, negative values, leading zeros and totals. Compare important figures with the source PDF." }
    ],
    toolLinks: [{ label: "PDF to CSV", href: "/pdf-to-csv" }, { label: "PDF to Excel", href: "/pdf-to-excel" }, { label: "PDF to Text", href: "/pdf-to-text" }]
  },
]; 


const priorityEditorialBlogPosts: BlogPost[] = [
  {
    slug: "savings-goal-calculator-guide",
    title: "Savings Goal Calculator: Monthly & Weekly Savings Plan",
    description: "Enter your target, current balance and deadline to estimate regular deposits. Compare a zero-interest plan with an assumed savings rate.",
    keyword: "how to set a savings goal monthly plan formula",
    updated: "2026-11-13",
    readTime: "5 min read",
    intro: "A savings goal becomes easier to manage when you turn one large target into regular deposits. The calculator uses your target, current balance, deadline, deposit frequency and an assumed annual interest rate. This guide explains the zero-interest baseline and the calculator’s periodic-compounding estimate.",
    sections: [
      { heading: "The monthly savings formula", paragraphs: ["First subtract your current savings from the target. Then divide the remaining amount by the number of full months available. The formula is: monthly savings needed = (savings target − current savings) ÷ months remaining. Use the same currency for both amounts and enter a positive number of months.", "This straight-line formula is the zero-interest baseline. When the annual rate is above zero, the calculator also projects the current balance and estimates equal deposits using the selected monthly or weekly compounding period. It is useful for planning a cash target such as tuition, a laptop, travel or an emergency fund."] },
      { heading: "Worked example: save NPR 90,000 in six months", paragraphs: ["Suppose your target is NPR 90,000 and you have already saved NPR 30,000. The remaining amount is NPR 60,000. With six months left, divide NPR 60,000 by six: you need to set aside NPR 10,000 each month.", "If your income arrives weekly or irregularly, you can divide the remaining target across your expected pay periods instead. The calculator uses months, so convert your plan to a monthly equivalent before comparing it with the result."] },
      { heading: "What if the monthly savings target is too high?", paragraphs: ["Suppose your target is 120,000 and you have already saved 30,000, leaving 90,000. With six months remaining, the simple plan requires 15,000 each month. If you can set aside only 10,000 per month, the same no-interest calculation needs nine months to cover the remaining 90,000.", "You can respond by extending the deadline, reducing the target or adding a one-time deposit from money genuinely available for this goal. Do not count your salary or money reserved for rent, food and bills as savings already set aside."] },
      { heading: "Use the Savings Goal Calculator", paragraphs: ["Open the Savings Goal Calculator and enter the final target, current savings and months remaining. Review the remaining amount and monthly savings figure. If the monthly amount is too high, test a longer deadline or a smaller target rather than entering an unrealistic current-savings figure.", "Update the calculation after each deposit or whenever your target or deadline changes. Keep the original goal and the date of each revision so you can see whether your plan is on track."] },
      { heading: "Weekly deposits and interest estimates", paragraphs: ["For weekly deposits, the calculator converts the month horizon into an estimated number of weekly periods using 52 weeks per year. For monthly deposits, it uses one period per month. The periodic rate is estimated by dividing the annual rate by 52 or 12, respectively.", "The current balance is projected forward with compound growth, and each new deposit is assumed to arrive at the end of its period. The calculator then solves for a regular deposit that reaches the target. This is an illustrative model: banks may compound daily, use different rate conventions, apply tiered balances or deduct tax and fees.", "Interest is not guaranteed. Use the actual account terms and statements for financial decisions, and do not treat investment returns as equivalent to a guaranteed savings-account rate."] }
    ],
    faqs: [
      { question: "How do I calculate how much to save each month?", answer: "Subtract the amount already saved from your target, then divide the remaining amount by the months left. For example, (NPR 90,000 − NPR 30,000) ÷ 6 = NPR 10,000 per month." },
      { question: "Does the savings goal calculator include interest?", answer: "It can estimate interest when you enter an annual rate. The estimate assumes a constant rate and deposits at the end of each weekly or monthly period; actual bank terms, compounding, taxes and fees may differ." },
      { question: "Can I calculate weekly deposits?", answer: "Yes. Choose weekly deposits to estimate the regular amount using an approximate number of weeks in the selected month horizon. The result is an estimate, especially when the goal date does not align with a full week." },
      { question: "What if I have already saved more than my target?", answer: "The required deposit is zero. If you enter a positive annual rate, the projected balance at the goal date may be higher than the target." },
      { question: "Should I use my total income as current savings?", answer: "No. Enter only the money already set aside for this goal, not your salary, monthly income or money needed for regular expenses." }
    ],
    toolLinks: [{ label: "Savings Goal Calculator", href: "/tools/savings-goal-calculator" }, { label: "Salary Breakdown Calculator", href: "/tools/salary-breakdown-calculator" }, { label: "SIP & Compound Interest Calculator", href: "/tools/compound-interest-sip-calculator" }]
  },
  {
    slug: "reading-time-calculator-guide",
    title: "Reading Time Calculator: WPM Formula & Examples",
    description: "Paste text to estimate reading time in minutes and seconds. Compare 150, 200 and 250 WPM, then estimate speaking time for a script.",
    keyword: "how to calculate reading time words per minute",
    updated: "2026-11-13",
    readTime: "5 min read",
    intro: "A reading-time estimate helps readers decide whether to start an article and helps writers plan the length of a page, newsletter, lesson or spoken presentation. The calculator uses word count and separate words-per-minute assumptions for silent reading and speaking. Both results are estimates, not a promise about every reader or presenter.",
    sections: [
      { heading: "Reading time formula", paragraphs: ["The basic formula is reading time in minutes = total word count ÷ reading speed in words per minute. If a text contains 1,000 words and the selected speed is 200 WPM, the estimate is 1,000 ÷ 200 = 5 minutes.", "For a result in seconds, multiply the number of minutes by 60. A 300-word text at 200 WPM is 1.5 minutes, or about 90 seconds."] },
      { heading: "Choose a realistic reading speed", paragraphs: ["A speed of 200 WPM is a convenient starting assumption for general English prose, not a universal standard. Readers may move more slowly through technical instructions, unfamiliar vocabulary, legal terms, tables or material in a second language. Skimming and familiar topics can make reading faster.", "When comparing two drafts, use the same WPM setting for both. Otherwise a change in the displayed estimate may come from the selected speed rather than the word count."] },
      { heading: "Use the Reading Time Calculator", paragraphs: ["Paste the complete article into the text field and enter a positive WPM value. Run the calculator and review the word count and estimated time. Include the whole body you expect visitors to read; leaving out headings, captions or important sections can make the estimate misleading.", "If you are writing for a specific audience, test more than one reading speed and choose a value that reflects the complexity of the material. Keep the displayed estimate clearly labelled as approximate."] },
      { heading: "Words-to-minutes examples at different speeds", paragraphs: ["For 500 words, the estimate is 3 minutes 20 seconds at 150 WPM, 2 minutes 30 seconds at 200 WPM and 2 minutes at 250 WPM. For 1,000 words, those estimates become 6 minutes 40 seconds, 5 minutes and 4 minutes respectively.", "For a 1,500-word article, the same speeds produce estimates of 10 minutes, 7 minutes 30 seconds and 6 minutes. These examples are arithmetic comparisons, not a claim that every reader uses one of these speeds."] },
      { heading: "Estimate speaking and presentation time", paragraphs: ["Speaking time uses the same calculation: word count ÷ speaking speed. A 1,000-word script at 130 WPM is about 7.7 minutes before pauses. A slower pace may suit a training session or unfamiliar topic; a faster pace may suit a short, rehearsed update.", "The calculator starts with 130 WPM as an editable speaking-speed assumption. Add time for pauses, audience questions, slide changes, demonstrations and emphasis. A script that calculates to eight minutes may need a longer slot when delivered live."] },
      { heading: "Why actual reading and speaking time differs", paragraphs: ["Word counters may treat punctuation, hyphenated terms, numbers and Unicode text differently. The tool counts whitespace-separated words, so code blocks, tables, diagrams and screen-reader navigation may not match a reader’s actual reading experience.", "Use reading and speaking time as planning estimates, not ranking factors or accessibility measurements. Clear headings, short paragraphs and useful examples can make a long article easier to navigate even when the estimated minutes do not change."] }
    ],
    faqs: [
      { question: "How do you calculate reading time from word count?", answer: "Divide the number of words by the selected reading speed in words per minute. A 1,000-word article at 200 WPM is about five minutes." },
      { question: "What is a normal reading speed in words per minute?", answer: "There is no speed that fits every reader or text. Around 200 WPM is a practical starting assumption for general English prose; technical or unfamiliar material may take longer." },
      { question: "Does the calculator count headings and tables?", answer: "It calculates from the text you paste. Include the complete content you want to estimate, and remember that tables, code and complex layouts may take longer to understand than ordinary prose." },
      { question: "Is reading time an exact measurement?", answer: "No. It is an estimate based on word count and the WPM value entered. Individual reading speed, language familiarity and content complexity change the actual time." },
      { question: "How do I estimate speaking time from a script?", answer: "Divide the script word count by the speaking speed in words per minute. For example, 1,000 words at 130 WPM is about 7.7 minutes before pauses, questions or slide changes." }
    ],
    toolLinks: [{ label: "Reading Time Calculator", href: "/tools/reading-time-calculator" }, { label: "Word Counter", href: "/tools/word-character-counter" }, { label: "Sentence Counter", href: "/tools/sentence-counter" }]
  },
  {
    slug: "tip-calculator-guide",
    title: "How to Calculate Tip: 15%, 18% & 20% Examples",
    description: "Calculate the tip, add it to the bill and split the total per person. Compare 15%, 18% and 20% examples, then check any service charge.",
    keyword: "how to calculate tip tip calculator",
    updated: "2026-11-12",
    readTime: "5 min read",
    intro: "To calculate a tip, multiply the amount you want to tip on by the tip percentage, then add the tip to the bill. If a group is sharing equally, divide the final total by the number of people. Always check the receipt first because tax, service charges and local tipping customs vary.",
    sections: [
      { heading: "How to calculate tip: formula and worked examples", paragraphs: ["Tip amount = tip base × tip percentage ÷ 100. Final total = bill amount + tip. Equal share per person = final total ÷ number of people. The tip base is the amount you choose to apply the percentage to; it may be the pre-tax subtotal or another receipt amount depending on local practice.", "For a bill of 2,000 with a 10% tip, the tip is 200 and the total is 2,200. If four people split that total equally, each person pays 550. The calculator keeps the currency you enter and does not convert it."] },
      { heading: "15%, 18% and 20% tip examples", paragraphs: ["For a $60 bill, a 15% tip is $9, an 18% tip is $10.80, and a 20% tip is $12. The corresponding totals are $69, $70.80 and $72. If three people split each total equally, they pay $23, $23.60 or $24 per person. These are arithmetic examples, not universal tipping rules; customary amounts differ by country, venue and service.", "To calculate any percentage, convert it to a decimal or divide by 100. For example, $60 × 18 ÷ 100 = $10.80. You can enter 15, 18 or 20 in the calculator, or use another percentage that fits your situation."] },
      { heading: "Calculate the tip and split the bill", paragraphs: ["Enter the bill amount, type the percentage as a number such as 18 for 18%, and enter the number of people sharing equally. Run the Tip Calculator and review the tip amount, final total and per-person share.", "An equal split is only appropriate when everyone agrees to share the full amount evenly. If people ordered different items, calculate each person's food and drink share separately before allocating any shared tax, service charge or tip."] },
      { heading: "Check service charges and tax", paragraphs: ["Read the receipt before adding a tip. Some restaurants already include a service charge, gratuity or other fee. Adding another percentage without checking can mean paying twice for the same purpose. Local customs and restaurant policies differ, so the calculator does not recommend a universal tip rate.", "If you intend to tip on the pre-tax amount, use the subtotal before tax. If you prefer to tip on the full receipt amount, use that amount. The calculator follows the number you enter and does not detect or remove tax or service charges automatically."] },
      { heading: "Tip on NPR 1,500: 10%, 15% and 20% examples", paragraphs: ["The same formula works in any currency. For a restaurant bill of NPR 1,500, a 10% tip is NPR 150 (total NPR 1,650), a 15% tip is NPR 225 (total NPR 1,725) and a 20% tip is NPR 300 (total NPR 1,800). So a 20 percent tip on 1,500 rupees is NPR 300.", "If three people split the NPR 1,800 total equally, each pays NPR 600. Some restaurants already add a service charge or VAT to the bill, so check the receipt first and tip only on the amount you intend to, rather than adding a second charge for the same service."] },
      { heading: "Rounding and payment", paragraphs: ["The exact per-person amount may include cents or paisa. Agree how to handle rounding before paying, especially when a bill is split between several people. Check the final receipt and payment amount before completing the transaction.", "The calculator is an arithmetic aid, not a payment service. It does not process a payment, convert currencies or determine what is customary in your location."] }
    ],
    faqs: [
      { question: "How do I calculate a tip?", answer: "Multiply the amount you want to tip on by the tip percentage, then divide by 100. For a $60 bill, 18% is $10.80; add the tip to the bill for the final total." },
      { question: "How do I calculate a 20% tip?", answer: "Multiply the tip base by 0.20. For a $60 bill, a 20% tip is $12 before adding it to the bill." },
      { question: "How do I split a bill including tip?", answer: "Add the tip to the bill, then divide the final total by the number of people sharing equally. A $70.80 total split three ways is $23.60 each." },
      { question: "Should I tip on the bill before or after tax?", answer: "It depends on local practice and your preference. Use the pre-tax subtotal if that is the amount you intend to tip on, or the tax-inclusive total if that is your chosen basis." },
      { question: "What is a 20 percent tip on 1,500 rupees?", answer: "Multiply 1,500 by 0.20 to get NPR 300. Adding it to the bill gives NPR 1,800 in total; split three ways, that is NPR 600 each." },
      { question: "What if a service charge is already included?", answer: "Check the receipt and restaurant policy before adding another tip. The calculator does not detect or remove service charges automatically." }
    ],
    toolLinks: [{ label: "Tip Calculator", href: "/tools/tip-calculator" }, { label: "Split Bill Calculator", href: "/tools/split-bill-calculator" }, { label: "Percentage Calculator", href: "/tools/percentage-of-number-calculator" }]
  },
  {
    slug: "percentage-change-calculator-guide",
    title: "Percentage Change Calculator: Formula & Examples",
    description: "Calculate a percentage increase or decrease with worked examples. Check the formula, reverse a change and distinguish percentage change from points.",
    keyword: "percentage change formula increase decrease examples",
    updated: "2026-11-13",
    readTime: "5 min read",
    intro: "Percentage change describes how much a value has increased or decreased compared with its starting value. It is useful for comparing prices, quantities, monthly expenses and other measurements, provided both values use the same unit and basis.",
    sections: [
      { heading: "Percentage change formula", paragraphs: ["Percentage change = (new value − original value) ÷ original value × 100. A positive result means an increase; a negative result means a decrease. The original value is the denominator because the change is measured relative to where the value started.", "Do not reverse the original and new values. Changing the denominator changes the answer and can make a decrease look like a different percentage from the reverse increase."] },
      { heading: "Worked examples: increase and decrease", paragraphs: ["If a price rises from 80 to 100, the difference is 20. Divide 20 by the original 80 and multiply by 100: the increase is 25%.", "If a value falls from 100 to 80, the difference is −20. Divide −20 by the original 100 and multiply by 100: the change is −20%, meaning a 20% decrease. The reverse movement is not the same percentage because the starting value is different."] },
      { heading: "Why reverse changes have different percentages", paragraphs: ["A change from 100 to 120 is a 20% increase because the difference of 20 is divided by the original 100. Reversing the movement from 120 to 100 is a 16.67% decrease because the same difference is now divided by 120.", "This is why a 20% increase followed by a 20% decrease does not return to the starting value: 100 rises to 120, then falls to 96. Always use the value at the start of the specific comparison as the denominator."] },
      { heading: "Use forward and reverse calculation modes", paragraphs: ["For a normal comparison, enter the original value and new value to calculate the percentage increase or decrease. Both values must use the same unit, and the original value cannot be zero.", "To work backwards, choose the reverse mode, enter the final value and the known percentage change, then calculate the original value with: original = final value ÷ (1 + percentage change ÷ 100). For example, a final value of 120 after a 20% increase means the original value was 100. A change of −100% or less cannot be reversed with this formula because it implies a zero or negative multiplier."] },
      { heading: "Percentage change versus percentage points", paragraphs: ["Percentage change is a relative change between two values. Percentage points describe the arithmetic difference between two percentages. For example, a rate moving from 10% to 12% has increased by 2 percentage points, while its relative percentage change is 20%.", "Use percentage points when comparing rates such as interest, market share or pass rates. Use percentage change when you want to express the relative movement from an original numerical value."] }
    ],
    faqs: [
      { question: "What is the formula for percentage change?", answer: "Subtract the original value from the new value, divide by the original value and multiply by 100: ((new − original) ÷ original) × 100." },
      { question: "How do I calculate percentage increase?", answer: "Use the same formula. When the new value is higher than the original value, the result is positive and represents the percentage increase." },
      { question: "How do I calculate percentage decrease?", answer: "Use the same formula. When the new value is lower, the result is negative; the absolute value tells you the percentage decrease." },
      { question: "Can percentage change be calculated from zero?", answer: "The standard formula is undefined when the original value is zero because it divides by the starting value. Use the absolute difference or describe the change without a percentage." }
    ],
    toolLinks: [{ label: "Percentage Change Calculator", href: "/tools/percentage-change-calculator" }, { label: "Percentage of Number Calculator", href: "/tools/percentage-of-number-calculator" }, { label: "Tip Calculator", href: "/tools/tip-calculator" }]
  },
  {
    slug: "meta-title-checker-guide",
    title: "How to Write SEO Title Tags: Examples & Best Practices",
    description: "Learn how to write a clear page title, align it with the H1, avoid keyword stuffing and understand when Google rewrites title links.",
    keyword: "how to write SEO title tags examples best practices",
    updated: "2026-11-12",
    readTime: "5 min read",
    intro: "A page title helps readers and search engines understand what a page is about. The HTML title element, the visible H1 heading and the title link shown in Google Search can be different. This guide explains how to check the title you publish, improve its wording and review the result without relying on an arbitrary character limit.",
    sections: [
      { heading: "HTML title, H1 and Google title link are different", paragraphs: ["The HTML title is the text in the page's title element. It is commonly used as the browser-tab label and is one source Google may use for a search-result title link. The H1 is the main visible heading on the page. They can be similar, but each should describe the same page accurately.", "Google may generate a different title link using the page title, visible heading, prominent text, link text and other signals. A title checker can review the text you enter; it cannot guarantee which wording Google will display for every query."] },
      { heading: "How to check an SEO title", paragraphs: ["Open the actual page and copy its current HTML title, not just the text shown in the browser address bar. Paste it into the SEO Title Checker to count characters and review an approximate search preview. Then compare it with the visible H1 and the main content.", "If the title is vague, repetitive or too broad, rewrite it so the main topic and page purpose are clear. Put the most useful wording early when it reads naturally, and include the brand only when it helps readers identify the source."] },
      { heading: "Is there a perfect title length?", paragraphs: ["Google does not publish a fixed character limit that guarantees a title will display in full. Search-result titles can be shortened to fit the available space, which varies by device and context. A character count is useful for spotting unusually long drafts, but it is not a ranking score or a pass/fail rule.", "Aim for a concise description rather than forcing every title into an exact number of characters. Remove repeated words and boilerplate, but do not delete important context just to reach an arbitrary length."] },
      { heading: "Title tag examples: make the page purpose obvious", paragraphs: ["A useful title names the main task and gives the reader a reason to choose the page. For example, a vague title such as \"Online Tool\" could become \"Merge PDF Files Online – Combine Documents | PDFora\" when the page really combines PDFs. A generic title such as \"Calculator\" could become \"Percentage Change Calculator – Formula & Examples\" when that is the actual task.", "Keep examples honest. Do not add words such as \"free\", \"instant\", \"official\" or a specific file limit unless the page genuinely supports that claim. Each important page should have its own title that reflects its visible H1 and primary content."] },
      { heading: "Measure the change in Google Search Console", paragraphs: ["Before editing a title, record the page's recent impressions, clicks, click-through rate and average position for its main queries. After publishing, compare the same page and query set over a similar period. Avoid judging a title change from one day's data because search demand, ranking and result presentation can vary.", "If impressions are high but clicks are low, review whether the title and description clearly match the query and distinguish the page from other results. If the page has very few impressions or ranks far below the first results, improve the content and its relevance as well; a title rewrite alone is unlikely to solve that problem."] },
      { heading: "When to use a title checker versus a writing guide", paragraphs: ["Use a title checker after you have drafted a page title and want to review its character count, compare it with the visible H1 and see an illustrative search-result preview. The checker cannot judge whether the page satisfies a search query, whether competing pages offer more useful information or whether Google will keep the wording.", "Use this guide to make the writing decisions: identify the page’s actual purpose, choose wording that matches the reader’s task, align the title with the H1 and main content, and remove boilerplate. If a page already receives impressions but few clicks, review its actual Search Console queries before testing one meaningful title change."] },
      { heading: "Common title mistakes to avoid", paragraphs: ["Avoid using the same title on many pages, repeating keyword variations, stuffing the brand name several times or promising something the page does not provide. A title should set an accurate expectation for the page that opens after the click.", "After publishing a meaningful change, check the live HTML title and canonical URL. Search Console can show which queries and pages receive impressions, but Google needs to recrawl and reprocess a page before its search-result title may change."] }
    ],
    faqs: [
      { question: "How do I check my SEO title?", answer: "Open the page, copy its actual HTML title element and paste it into an SEO title checker. Review the character count and preview, then compare the wording with the page's H1 and content." },
      { question: "What is the ideal SEO title character limit?", answer: "Google does not specify a fixed character limit that guarantees full display. Write a concise, descriptive title; the visible title link may be shortened to fit the device and query." },
      { question: "Is an SEO title the same as an H1?", answer: "No. The SEO title is the HTML title element, while the H1 is the main visible page heading. They should describe the same topic but do not have to use identical wording." },
      { question: "Can a title checker guarantee Google rankings or the exact title shown?", answer: "No. It can count characters and provide an approximate preview. Google chooses title links automatically and may rewrite them; a checker cannot predict rankings." }
    ],
    toolLinks: [{ label: "SEO Title Checker", href: "/tools/meta-title-checker" }, { label: "Meta Description Checker", href: "/tools/meta-description-checker" }],
    sources: [{ label: "Google Search Central: Influencing title links in Google Search", url: "https://developers.google.com/search/docs/appearance/title-link" }]
  },
  {
    slug: "prime-number-checker-guide",
    title: "Is It a Prime Number? How to Check Any Number",
    description: "Learn how to check whether a number is prime or composite, why 1 is not prime and how the square-root test works, with worked examples.",
    keyword: "prime number checker how to check if a number is prime",
    updated: "2026-11-17",
    readTime: "5 min read",
    intro: "A prime number is a whole number greater than 1 whose only positive factors are 1 and itself. Checking a small number by hand is easy, but larger values need a method. This guide explains the divisibility test used by the Prime Number Checker, with examples you can verify yourself.",
    sections: [
      { heading: "What makes a number prime or composite?", paragraphs: ["A prime has exactly two positive factors. 7 is prime because only 1 and 7 divide it evenly. A composite number has more than two factors: 12 is divisible by 1, 2, 3, 4, 6 and 12.", "The numbers 0 and 1 are neither prime nor composite. 1 has only one positive factor, so it fails the two-factor rule, and this is why the checker reports 0 and 1 as not prime."] },
      { heading: "The square-root test, step by step", paragraphs: ["You only need to test divisors up to the square root of the number. If a number has a factor larger than its square root, it must also have a matching smaller factor, so the smaller one would already have been found.", "To test 97, the square root is about 9.85, so check 2, 3, 5 and 7. None divides 97 evenly, therefore 97 is prime. To test 91, check 2, 3, 5 and 7: 91 ÷ 7 = 13, so 91 = 7 × 13 and is composite. Many people mistake 91 for a prime because it is not divisible by 2, 3 or 5."] },
      { heading: "Use the Prime Number Checker", paragraphs: ["Enter a non-negative whole number and run the checker. It reports whether the number is prime or not prime using trial division up to the square root. It accepts whole numbers within the browser's safe integer range, and it rejects decimals and negative values with an input error.", "For a result you do not trust, test it by hand: find one factor other than 1 and the number itself, and the number is composite."] },
      { heading: "Handy facts to remember", paragraphs: ["2 is the only even prime, because every other even number is divisible by 2. Any number ending in 0 or 5, other than 5 itself, is divisible by 5. A number is divisible by 3 when its digits add up to a multiple of 3, so 51 (5 + 1 = 6) is divisible by 3 and is not prime."], bullets: ["Primes below 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29.", "221 looks prime but equals 13 × 17.", "Prime checking is different from finding the greatest common divisor of two numbers."] }
    ],
    faqs: [
      { question: "How do I check if a number is prime online?", answer: "Enter a whole number greater than 1 in the PDFora Prime Number Checker. It tests possible divisors up to the square root and reports whether the number is prime; decimals and negative inputs are not supported." },
      { question: "Is 1 a prime number?", answer: "No. A prime needs exactly two positive factors, and 1 has only one. Modern definitions exclude 1 so that every integer above 1 has a single prime factorisation." },
      { question: "Is 2 a prime number?", answer: "Yes. 2 is divisible only by 1 and 2, and it is the only even prime number." },
      { question: "How do I check if a large number is prime?", answer: "Divide it by every prime up to its square root. If none divides it evenly, the number is prime. The Prime Number Checker applies this test to whole numbers within the supported range." },
      { question: "Is 91 a prime number?", answer: "No. 91 = 7 × 13, so it is composite even though it is not divisible by 2, 3 or 5." },
      { question: "Can the checker test decimals or negative numbers?", answer: "No. Primes are defined for whole numbers greater than 1, so decimals and negative values show an input error." }
    ],
    toolLinks: [{ label: "Prime Number Checker", href: "/tools/prime-number-checker" }, { label: "GCD and LCM Calculator", href: "/tools/gcd-lcm-calculator" }, { label: "Ratio Simplifier", href: "/tools/ratio-simplifier" }],
    sources: [{ label: "Wikipedia: Prime number", url: "https://en.wikipedia.org/wiki/Prime_number" }]
  },
  {
    slug: "split-bill-calculator-guide",
    title: "How to Split a Bill Equally: Formula & Examples",
    description: "Split a restaurant or shared bill between friends, including a service charge or tip. See the formula, rounding examples and when equal shares are unfair.",
    keyword: "how to split a bill equally split bill calculator",
    updated: "2026-11-17",
    readTime: "4 min read",
    intro: "Splitting a bill equally takes one division, but groups often forget the service charge, disagree about rounding or realise that one person ordered far more. This guide shows the formula the Split Bill Calculator uses and how to handle the common complications.",
    sections: [
      { heading: "The equal-split formula", paragraphs: ["Total to pay = bill + any extra amount. Share per person = total ÷ number of people. The extra amount can be a service charge, delivery fee or tip that you want to share too.", "For example, a NPR 3,000 bill plus NPR 200 extra is NPR 3,200. Split between four people, each pays NPR 800."] },
      { heading: "Worked example with a service charge", paragraphs: ["A group of four receives a NPR 2,400 bill and the restaurant adds NPR 240 service charge. The total is NPR 2,640, so each person pays NPR 660. Enter 2,400 as the bill, 240 as the extra amount and 4 people to get the same result.", "If you also want to leave a tip, add it to the extra amount instead of calculating it separately. The Tip Calculator can help you choose the tip first."] },
      { heading: "Rounding when the bill does not divide evenly", paragraphs: ["NPR 1,000 split between three people is 333.33 each, and three payments of 333.33 add up to 999.99, so the group is one paisa short. Decide in advance who covers the difference, or round every share up to the next whole rupee and treat the remainder as a small tip.", "The calculator shows two decimal places, so check the final amount against the receipt before paying."] },
      { heading: "When an equal split is not fair", paragraphs: ["An equal split works when everyone ordered similar items or agreed to share. If one person had an expensive meal or did not drink, calculate each person's items separately and divide only the shared dishes, taxes and fees. The calculator divides the total evenly and does not handle itemised orders."] }
    ],
    faqs: [
      { question: "How do I split a restaurant bill between friends?", answer: "Add any service charge or tip to the bill, then divide the total by the number of people. For NPR 3,200 and four people, each pays NPR 800." },
      { question: "Should the service charge be included when splitting?", answer: "Yes, if everyone is sharing it. Enter it as the extra amount so it is included in the total before dividing." },
      { question: "What if the bill cannot be divided evenly?", answer: "Round each share up and agree who absorbs the small difference. For example, NPR 1,000 between three people is 333.33 each, leaving the group one paisa short." },
      { question: "Can the calculator split unequal orders?", answer: "No. It divides the total equally. For different orders, work out each person's items first and share only the common costs." }
    ],
    toolLinks: [{ label: "Split Bill Calculator", href: "/tools/split-bill-calculator" }, { label: "Tip Calculator", href: "/tools/tip-calculator" }, { label: "Percentage of Number Calculator", href: "/tools/percentage-of-number-calculator" }],
    sources: [{ label: "Wikipedia: Division (mathematics)", url: "https://en.wikipedia.org/wiki/Division_(mathematics)" }]
  },
  {
    slug: "date-add-subtract-calculator-guide",
    title: "How to Add or Subtract Days from a Date (Examples)",
    description: "Add or subtract days from any date, with worked examples for month ends and leap years. Learn why 30 days is not the same as one month.",
    keyword: "how to add days to a date date calculator",
    updated: "2026-11-17",
    readTime: "5 min read",
    intro: "Working out a deadline, delivery date or notice period means adding days to a start date while respecting month lengths and leap years. This guide explains the calendar-day arithmetic used by the Date Add or Subtract Calculator, with examples you can check.",
    sections: [
      { heading: "How adding days to a date works", paragraphs: ["Start from the chosen date and count forward one calendar day at a time, rolling into the next month or year when needed. Adding 30 days to 1 November 2026 gives 1 December 2026, because November has 30 days.", "To subtract, enter a negative number of days. Subtracting 1 day from 1 March 2026 gives 28 February 2026."] },
      { heading: "Month ends and leap years", paragraphs: ["Months have 28 to 31 days, so the same number of days lands differently. Adding 30 days to 31 January 2026 gives 2 March 2026, because February 2026 has 28 days.", "In a leap year February has 29 days. Adding 2 days to 28 February 2028 gives 1 March 2028, while adding 2 days to 28 February 2027 gives 2 March 2027. A year is a leap year when it divides by 4, except century years that do not divide by 400."] },
      { heading: "A longer example: 100 days from today", paragraphs: ["From 17 November 2026, 13 days reach 30 November, another 31 reach 31 December, another 31 reach 31 January 2027 and the last 25 reach 25 February 2027. Adding 100 days therefore gives 25 February 2027.", "Use this kind of check to confirm the calculator result for contract terms or project plans."] },
      { heading: "30 days is not one month", paragraphs: ["A calendar month and a fixed number of days are different. One month after 31 January is usually the end of February, while 30 days after 31 January is in March. The calculator adds calendar days, and it does not skip weekends or public holidays. For working days, use the Business Days Calculator."] }
    ],
    faqs: [
      { question: "How do I add days to a date?", answer: "Enter the start date and the number of days. The calculator counts calendar days forward, so 30 days after 1 November 2026 is 1 December 2026." },
      { question: "How do I subtract days from a date?", answer: "Enter a negative number of days. Subtracting 1 day from 1 March 2026 gives 28 February 2026." },
      { question: "Does the calculator handle leap years?", answer: "Yes. It follows the calendar, so 2 days after 28 February 2028 is 1 March 2028, while the same step in 2027 reaches 2 March." },
      { question: "Does it skip weekends or holidays?", answer: "No. It counts every calendar day. Use the Business Days Calculator to count weekdays between two dates." },
      { question: "What date is 100 days from 17 November 2026?", answer: "25 February 2027, counting every calendar day." }
    ],
    toolLinks: [{ label: "Date Add or Subtract Calculator", href: "/tools/date-add-subtract-calculator" }, { label: "Business Days Calculator", href: "/tools/business-days-calculator" }, { label: "Date Difference Calculator", href: "/tools/date-difference-calculator" }],
    sources: [{ label: "Wikipedia: Leap year", url: "https://en.wikipedia.org/wiki/Leap_year" }]
  },
  {
    slug: "bmr-calculator-guide",
    title: "BMR Calculator: Mifflin–St Jeor Formula & Example",
    description: "See how basal metabolic rate is estimated with the Mifflin–St Jeor equation, with a worked example, its limits and how BMR differs from daily calories.",
    keyword: "bmr calculator mifflin st jeor formula",
    updated: "2026-11-17",
    readTime: "5 min read",
    intro: "Basal metabolic rate (BMR) is an estimate of the energy your body uses at rest. The BMR Calculator applies the Mifflin–St Jeor equation to your weight, height, age and the sex input of the formula. This guide shows the arithmetic and explains what the number can and cannot tell you. It is an educational estimate, not medical advice.",
    sections: [
      { heading: "The Mifflin–St Jeor formula", paragraphs: ["BMR (kcal/day) = 10 × weight in kg + 6.25 × height in cm − 5 × age in years + 5 for the male equation, or − 161 for the female equation. The calculator asks you to choose male or female because the published equation has these two constants.", "The equation was published in 1990 from measurements of healthy adults, and it is a population-level estimate rather than a measurement of one person."] },
      { heading: "Worked example", paragraphs: ["Take a 25-year-old who weighs 65 kg and is 170 cm tall. The shared part is 10 × 65 + 6.25 × 170 − 5 × 25 = 650 + 1,062.5 − 125 = 1,587.5. With the male constant (+5) the result is 1,592.5, which the calculator rounds to 1,593 kcal/day. With the female constant (−161) it is 1,426.5, shown as 1,427 kcal/day.", "Use the same units each time: kilograms for weight and centimetres for height. Entering pounds or inches gives a wrong result."] },
      { heading: "BMR is not your daily calorie need", paragraphs: ["BMR covers resting energy only. Total daily energy expenditure also includes movement, exercise and digestion, so it is higher. A common rough step is to multiply BMR by an activity factor, for example 1.2 for very little exercise, which turns 1,593 into about 1,912 kcal/day. Treat any such figure as a starting point rather than a target."] },
      { heading: "Limits of the estimate", paragraphs: ["Muscle mass, body composition, health conditions, pregnancy and medicines all change real energy use, and the equation ignores them. Do not use the result as a diet prescription. For weight, nutrition or medical decisions, speak to a doctor or registered dietitian."] }
    ],
    faqs: [
      { question: "What is the BMR formula used by the calculator?", answer: "Mifflin–St Jeor: 10 × kg + 6.25 × cm − 5 × age, then +5 for the male equation or −161 for the female equation." },
      { question: "What is the BMR for a 25-year-old male, 65 kg and 170 cm?", answer: "About 1,593 kcal/day. The same inputs with the female equation give about 1,427 kcal/day." },
      { question: "Is BMR the same as the calories I should eat?", answer: "No. BMR is resting energy only. Daily needs are higher once activity is included, and the right target depends on your goals and health." },
      { question: "Can I enter pounds or inches?", answer: "No. Convert to kilograms and centimetres first, otherwise the result will be wrong." },
      { question: "How accurate is the estimate?", answer: "It is a population estimate. Body composition, health and medicines can make your actual resting energy differ." }
    ],
    toolLinks: [{ label: "BMR Calculator", href: "/tools/bmr-calculator" }, { label: "BMI Calculator", href: "/tools/bmi-calculator" }, { label: "Unit Converter", href: "/tools/unit-converter" }],
    sources: [{ label: "Mifflin et al. (1990): A new predictive equation for resting energy expenditure", url: "https://pubmed.ncbi.nlm.nih.gov/2305711/" }]
  },
  {
    slug: "url-extractor-guide",
    title: "How to Extract URLs from Text or a Document",
    description: "Pull every http and https link out of pasted text, remove duplicates and avoid trailing-punctuation mistakes. Includes examples and limits.",
    keyword: "extract urls from text url extractor",
    updated: "2026-11-17",
    readTime: "4 min read",
    intro: "Copying links one by one from a report, email or web page is slow and error-prone. The URL Extractor scans pasted text, finds web addresses that start with http:// or https:// and lists each unique link once. This guide explains what it finds, what it misses and what to check before using the list.",
    sections: [
      { heading: "How to extract links from text", paragraphs: ["Copy the text that contains the links, paste it into the URL Extractor and run it. The result is one URL per line with repeated links removed, or the message No URLs found when nothing matches.", "For example, pasting \"Visit https://example.com and https://example.org/help, then https://example.com again\" returns two unique addresses rather than three."] },
      { heading: "What counts as a URL here", paragraphs: ["The extractor looks for text that begins with http:// or https:// and continues until it reaches a space, a quote or one of the characters < > ( ) [ ] { }. Addresses written without a scheme, such as www.example.com, and other schemes such as mailto: or ftp: are not matched."] },
      { heading: "Check trailing punctuation and brackets", paragraphs: ["A link at the end of a sentence may keep its full stop or comma, so https://example.com/help. can appear with the dot attached. Remove it before opening or importing the link.", "Because round brackets end a match, an address that legitimately contains parentheses, such as some wiki page names, will be cut short. Compare the list with the source for important links."] },
      { heading: "Before you use the list", paragraphs: ["A valid-looking address can still be broken, redirected or unsafe, and extraction does not visit the page. Open a sample of links, and do not paste confidential documents into an online tool. For email addresses and phone numbers, use the related extractors instead."] }
    ],
    faqs: [
      { question: "How do I extract all URLs from text?", answer: "Paste the text into the URL Extractor and run it. It lists every http and https link once, one per line." },
      { question: "Does the extractor remove duplicate links?", answer: "Yes. A link that appears several times is listed once." },
      { question: "Why does a link include a full stop at the end?", answer: "The tool does not strip sentence punctuation. Delete the trailing dot or comma before using the link." },
      { question: "Will it find links without http or https?", answer: "No. Addresses such as www.example.com without a scheme, and mailto: or ftp: links, are not matched." },
      { question: "Does it check that the links work?", answer: "No. It only finds text that looks like a web address. Open the links to confirm they work." }
    ],
    toolLinks: [{ label: "URL Extractor", href: "/tools/url-extractor" }, { label: "Email Extractor", href: "/tools/email-extractor" }, { label: "URL Query Parser", href: "/tools/url-query-parser" }],
    sources: [{ label: "RFC 3986: Uniform Resource Identifier (URI) Generic Syntax", url: "https://www.rfc-editor.org/rfc/rfc3986" }]
  }
];

const existingArticleSlugs = new Set([...editorialBlogPosts, ...priorityEditorialBlogPosts, ...additionalToolBlogPosts].map((post) => post.slug));
const catalogGuides: BlogPost[] = toolCatalog
  .filter((tool) => tool.slug !== "pdf-tools" && !existingArticleSlugs.has(`${tool.slug}-guide`))
  .map((tool) => {
    const slug = `${tool.slug}-guide`;
    const categoryAdvice: Record<string, string[]> = {
      Finance: ["Confirm the currency, period and compounding assumptions before comparing estimates.", "A calculator output is an estimate; verify loan, tax and investment details with the relevant provider."],
      Math: ["Check that every input uses the expected unit and range.", "Test the result with a small example you can calculate independently."],
      Text: ["Keep a copy of the original text before making bulk edits.", "Review punctuation, line breaks and non-English characters in the result."],
      Developer: ["Test normal, malformed and boundary inputs before using output in production.", "Never paste live passwords, API keys or confidential tokens into a tool."],
      Business: ["Confirm whether values are gross or net and whether fees or taxes are included.", "Use estimates for planning, then verify important decisions against source records."],
      Image: ["Review the output at its intended display size and on a second device.", "Keep the original image before replacing or publishing a converted asset."]
    };
    const advice = categoryAdvice[tool.category] || categoryAdvice.Text;
    const useCase: Record<string,string> = {
      "word-frequency-counter":"Paste a blog draft to find frequently repeated terms. Use the counts to spot awkward repetition and review natural phrasing; keyword frequency alone does not predict search rankings.",
      "reading-time-calculator":"Paste a complete article and choose a reading speed that matches the audience. A 1,000-word general article at 200 words per minute is about five minutes, while technical writing can take longer.",
      "line-counter":"Paste a list, log or source file to compare total lines with non-empty lines. Unique-line counts are useful when cleaning lists or checking repeated records.",
      "sentence-counter":"Paste a paragraph to check sentence count and average sentence length. Use the result as an editing signal, not a strict rule that every sentence must be short.",
      "email-extractor":"Paste a copied contact list or document text to collect address-shaped strings. Check each result before sending a message because pattern matching cannot confirm that an inbox exists.",
      "url-extractor":"Paste text from a report or webpage to collect HTTP and HTTPS links. Review trailing punctuation and confirm each destination before importing the list into another system.",
      "phone-number-extractor":"Paste a block of contact details to identify phone-like number patterns. Country formats vary, so verify each number and country code before calling or importing it.",
      "number-extractor":"Paste an invoice or report to collect number-like values. The tool extracts patterns only; it cannot know whether a number represents a date, amount, percentage or reference code.",
      "hashtag-extractor":"Paste a social media caption to collect unique hashtags. Review spelling, relevance and platform conventions before publishing.",
      "remove-duplicate-words":"Paste a sentence with accidental repeated words such as 'the the'. The tool keeps the first occurrence of each word, so read the result to make sure intentional repetition is not lost.",
      "find-replace-text":"Use Find and Replace to change a repeated product name, placeholder or phrase in a draft. Check the result because a simple text replacement does not understand context or whole-word boundaries.",
      "text-to-binary":"Enter text such as Hello to see its UTF-8 bytes represented as eight-bit binary groups. Non-ASCII characters may use multiple bytes, which is expected for UTF-8.",
      "binary-to-text":"Paste binary bytes separated by spaces, for example 01001000 01101001. Each group must contain eight bits and the bytes must form valid UTF-8 text.",
      "text-to-hex":"Convert a short message into hexadecimal bytes for debugging or learning character encodings. The output represents UTF-8 bytes, not a numeric conversion of the whole sentence.",
      "hex-to-text":"Enter hexadecimal byte pairs such as 48 65 6c 6c 6f to decode Hello. Invalid pairs or byte sequences that are not valid UTF-8 should be corrected before decoding.",
      "morse-code-translator":"Encode a short message such as SOS into dots and dashes, or decode a Morse sequence using spaces between letters and a slash between words. Check spacing because it separates characters.",
      "palindrome-checker":"Try phrases such as Never odd or even. The check ignores spaces, punctuation and letter case, so it tests the underlying letters and numbers rather than exact formatting.",
      "acronym-generator":"Enter a multi-word organisation or project name to create an initial-letter abbreviation. Review the result because some names use selected words rather than every word.",
      "camel-case-converter":"Convert a phrase such as 'customer account status' into customerAccountStatus for a variable name. Check acronyms and domain-specific capitalisation after conversion.",
      "snake-case-converter":"Convert a phrase such as 'customer account status' into customer_account_status for code, data fields or database columns. Confirm that the target language permits the resulting identifier.",
      "kebab-case-converter":"Convert a page title into a hyphen-separated string for a URL slug or CSS class. Review the result for reserved words and duplicate slugs before publishing.",
      "html-tag-stripper":"Paste a small HTML fragment to extract its readable text. Removing tags does not preserve the original layout, and untrusted markup should never be treated as safe HTML.",
      "csv-to-json":"Use a CSV header row such as name,age followed by Asha,22 and Ravi,25. Quote cells that contain commas and check the JSON keys before using the result in an API.",
      "json-to-yaml":"Paste valid JSON configuration to create a readable YAML-style representation. YAML indentation matters, so validate the generated text with the tool or parser used by your project.",
      "json-escape-unescape":"Escape a string containing quotes or line breaks before embedding it in JSON, or decode an escaped string for inspection. Keep the surrounding JSON quotes correct when using the result.",
      "url-validator":"Enter a complete address such as https://example.com/path?q=1 to inspect its protocol, host, path and query. A syntactically valid URL can still point to a broken or unsafe website.",
      "email-validator":"Check whether an address has a basic email format before saving it in a form. Syntax validation cannot confirm mailbox ownership, deliverability or whether the address accepts mail.",
      "password-strength-checker":"Check length and character variety locally, then create a unique passphrase and store it in a password manager. This simple estimate does not check breached-password databases or password reuse.",
      "bmi-calculator":"Enter body weight in kilograms and height in centimetres to calculate adult BMI. BMI is a population-level screening measure and is not a diagnosis or a complete measure of health.",
      "bmr-calculator":"Enter age, height, weight and the equation's sex input to estimate basal metabolic rate using Mifflin–St Jeor. BMR is not the same as total daily energy expenditure.",
      "tip-calculator":"Enter the bill, tip percentage and number of people to see the tip, total and equal per-person amount. Check whether service charge is already included before adding another tip.",
      "split-bill-calculator":"Enter the total bill and number of people to calculate an equal share. For unequal orders, calculate individual amounts separately rather than relying on an equal split.",
      "simple-interest-calculator":"Enter principal, annual rate and time in years to estimate simple interest using principal × rate × time. This assumes interest is not added to the principal during the period.",
      "commission-calculator":"Enter sales value and the commission rate to estimate the commission amount. Check whether your agreement calculates commission on gross sales, net sales or paid invoices.",
      "hourly-to-salary-calculator":"Enter hourly pay and weekly hours to estimate weekly, average monthly and annual earnings. The annual estimate assumes 52 paid weeks and excludes taxes, overtime and unpaid leave.",
      "percentage-of-number-calculator":"Enter a base value and percentage to calculate the percentage amount. This is useful for discounts, tax estimates and simple allocation checks.",
      "gcd-lcm-calculator":"Enter two integers to calculate their greatest common divisor and least common multiple. The values must be whole numbers, and both cannot be zero.",
      "prime-number-checker":"Enter a whole number to test whether it has factors other than one and itself. Zero and one are not prime numbers.",
      "random-number-generator":"Set an inclusive minimum and maximum, then choose how many values to generate. The browser uses its cryptographic random-number source; do not treat this as an audited lottery system.",
      "dice-roller":"Choose how many six-sided dice to roll and inspect each roll plus the total. This is a lightweight random dice simulation for casual games.",
      "unix-timestamp-converter":"Paste a Unix timestamp in seconds or milliseconds to see the corresponding UTC and local date. Check whether the source system stores seconds or milliseconds when the date looks incorrect.",
      "date-add-subtract-calculator":"Choose a start date and enter a positive number of days to add or a negative number to subtract. The result follows calendar days, not business days.",
      "business-days-calculator":"Choose start and end dates to count weekdays inclusively. Saturdays and Sundays are excluded, but national and regional public holidays are not automatically removed.",
      "px-rem-converter":"Convert CSS pixels to rem using the root font size, commonly 16px, or convert rem back to pixels. Use the actual root font size configured in your project.",
      "aspect-ratio-calculator":"Enter an image width and height such as 1920 by 1080 to get its simplified ratio. Use the ratio to resize an image without changing its proportions.",
      "color-converter":"Enter a six-digit HEX colour to see the matching RGB and HSL values. The output is useful when moving a colour between CSS declarations and design tools.",
      "css-gradient-generator":"Choose two HEX colours and an angle to create a CSS linear-gradient declaration. Paste the output into a stylesheet and preview it against your actual text and layout.",
      "roman-numeral-converter":"Enter an integer from 1 to 3999 to convert it to Roman numerals, or enter a canonical Roman numeral to convert it back. Non-standard subtractive forms are rejected."
    };
    const example = useCase[tool.slug] || `For a practical check, start with a short sample relevant to your task. Run the ${tool.name.toLowerCase()}, inspect the result and compare it with an expected output before processing a larger input.`;
    const steps = [`Open the ${tool.name} from the PDFora directory.`,`Enter the requested information and check units, format and available options.`,`Run the tool, review the output and copy the result only after checking it.`];
    return {
      slug,
      title: `${tool.name}: Free Online Tool, Examples and Instructions`,
      description: `Learn how to use the free ${tool.name.toLowerCase()}. See its purpose, practical steps, examples, limitations and related tools.`,
      keyword: tool.keywords,
      updated: "2026-11-01",
      readTime: "4 min read",
      intro: `${tool.description} This guide explains when the tool is useful, how to prepare your input and what to check before relying on the output.`,
      sections: [
        { heading: `What is the ${tool.name} used for?`, paragraphs: [tool.description, example, `The best results come from understanding the input format and the limits of the calculation or conversion. The tool is intended for a focused browser workflow, not as a replacement for specialist professional software.`] },
        { heading: `How to use ${tool.name} step by step`, paragraphs: ["Start with a representative sample and avoid including sensitive information. Read each field label carefully before running the tool."], bullets: steps },
        { heading: "Accuracy, privacy and limitations", paragraphs: [advice[0], advice[1], "Browser and device support can vary. If the output will be used for an important financial, legal, medical, security or production decision, verify it independently first."] }
      ],
      faqs: [
        { question: `What does the ${tool.name} do?`, answer: tool.description },
        { question: `How do I use the ${tool.name} online?`, answer: steps.join(" ") },
        { question: "Is the result guaranteed to be correct?", answer: "No online utility can guarantee every result for every input. Check the format, assumptions and output, and independently verify anything important." }
      ],
      toolLinks: [{ label: tool.name, href: `/tools/${tool.slug}` }, ...toolCatalog.filter((related) => related.category === tool.category && related.slug !== tool.slug && related.slug !== "pdf-tools").slice(0,3).map((related) => ({ label: related.name, href: `/tools/${related.slug}` }))]
    };
  });


export const blogPosts: BlogPost[] = [
  ...editorialBlogPosts, ...priorityEditorialBlogPosts, ...additionalToolBlogPosts, ...nepalBlogPosts, ...catalogGuides,
];

// Catalog-wide guide pages are generated from a shared template. Keep them
// accessible from their relevant tools, but do not expose them as indexable
// editorial articles until each has been individually reviewed and expanded.
export function isGeneratedGuide(slug: string): boolean {
  // Shared-template PDF guides remain accessible from their tools, but are not
  // promoted to the editorial blog, sitemap or search index until reviewed.
  return additionalToolBlogPosts.some((post) => post.slug === slug) ||
    (!existingArticleSlugs.has(slug) && toolCatalog.some((tool) => tool.slug !== "pdf-tools" && slug === `${tool.slug}-guide`));
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
