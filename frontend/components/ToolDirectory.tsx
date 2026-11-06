"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const groups = [
  ["Organize PDF", "/merge-pdf", "/split-pdf", "/reorder-pdf", "/delete-pages", "/extract-pages", "/remove-blank-pages", "/add-blank-pages", "/page-counter", "/pdf-information", "/extract-bookmarks", "/add-bookmarks", "/split-by-bookmarks", "/pdf-to-json", "/pdf-to-csv", "/pdf-to-tiff", "/pdf-to-bmp", "/pdf-to-markdown", "/extract-page-images", "/extract-fonts"],
  ["Convert PDF", "/pdf-to-word", "/pdf-to-excel", "/pdf-to-jpg", "/images-to-pdf", "/pdf-to-png", "/pdf-to-webp", "/pdf-to-text", "/pdf-to-html", "/extract-images"],
  ["Edit PDF", "/compress-pdf", "/rotate-pdf", "/rotate-selected-pages", "/crop-pdf", "/watermark", "/add-page-numbers", "/bates-numbering", "/header-footer", "/grayscale-pdf", "/flatten-pdf", "/repair-pdf", "/compare-pdf", "/remove-annotations", "/remove-pdf-links", "/remove-pdf-metadata", "/remove-attachments", "/add-background"],
  ["Secure & manage", "/protect-pdf", "/unlock-pdf", "/sign-pdf", "/edit-pdf-metadata"],
] as const;
const names: Record<string, string> = {
  "/merge-pdf":"Merge PDF","/split-pdf":"Split PDF","/reorder-pdf":"Reorder PDF Pages","/delete-pages":"Delete PDF Pages","/extract-pages":"Extract PDF Pages","/remove-blank-pages":"Remove Blank Pages",
  "/pdf-to-word":"PDF to Word","/pdf-to-excel":"PDF to Excel","/pdf-to-jpg":"PDF to JPG","/images-to-pdf":"Images to PDF","/pdf-to-png":"PDF to PNG","/pdf-to-webp":"PDF to WebP","/pdf-to-text":"PDF to Text","/pdf-to-html":"PDF to HTML","/extract-images":"Extract Images",
  "/compress-pdf":"Compress PDF","/rotate-pdf":"Rotate PDF","/crop-pdf":"Crop PDF","/watermark":"Add Watermark","/add-page-numbers":"Add Page Numbers","/header-footer":"Header & Footer","/grayscale-pdf":"Grayscale PDF","/flatten-pdf":"Flatten PDF","/repair-pdf":"Repair PDF","/compare-pdf":"Compare PDF","/add-blank-pages":"Add Blank Pages","/rotate-selected-pages":"Rotate Selected Pages","/page-counter":"PDF Page Counter","/pdf-information":"PDF Information","/extract-bookmarks":"Extract Bookmarks","/add-bookmarks":"Add Bookmarks","/bates-numbering":"Bates Numbering","/pdf-to-tiff":"PDF to TIFF","/pdf-to-bmp":"PDF to BMP","/pdf-to-markdown":"PDF to Markdown","/extract-page-images":"Render PDF Pages to PNG","/extract-fonts":"Extract Fonts","/split-by-bookmarks":"Split by Bookmarks","/remove-attachments":"Remove Attachments","/add-background":"Add Background","/pdf-to-json":"PDF to JSON","/pdf-to-csv":"PDF to CSV","/remove-pdf-metadata":"Remove PDF Metadata","/remove-annotations":"Remove Annotations","/remove-pdf-links":"Remove PDF Links","/protect-pdf":"Protect PDF","/unlock-pdf":"Unlock PDF","/sign-pdf":"Sign PDF","/edit-pdf-metadata":"Edit PDF Metadata"
};
const neNames: Record<string,string> = {
  "/merge-pdf":"PDF जोड्नुहोस्","/split-pdf":"PDF छुट्याउनुहोस्","/reorder-pdf":"PDF पृष्ठ क्रम मिलाउनुहोस्","/delete-pages":"PDF पृष्ठ हटाउनुहोस्","/extract-pages":"PDF पृष्ठ निकाल्नुहोस्","/remove-blank-pages":"खाली पृष्ठ हटाउनुहोस्",
  "/pdf-to-word":"PDF बाट Word","/pdf-to-excel":"PDF बाट Excel","/pdf-to-jpg":"PDF बाट JPG","/images-to-pdf":"तस्बिरबाट PDF","/pdf-to-png":"PDF बाट PNG","/pdf-to-webp":"PDF बाट WebP","/pdf-to-text":"PDF बाट Text","/pdf-to-html":"PDF बाट HTML","/extract-images":"तस्बिर निकाल्नुहोस्",
  "/compress-pdf":"PDF सानो बनाउनुहोस्","/rotate-pdf":"PDF घुमाउनुहोस्","/crop-pdf":"PDF काटछाँट गर्नुहोस्","/watermark":"Watermark थप्नुहोस्","/add-page-numbers":"पृष्ठ नम्बर थप्नुहोस्","/header-footer":"Header र Footer","/grayscale-pdf":"Grayscale PDF","/flatten-pdf":"PDF Flatten गर्नुहोस्","/repair-pdf":"PDF मर्मत गर्नुहोस्","/compare-pdf":"PDF तुलना गर्नुहोस्","/add-blank-pages":"खाली पृष्ठ थप्नुहोस्","/rotate-selected-pages":"छानिएका पृष्ठ घुमाउनुहोस्","/page-counter":"PDF पृष्ठ गणना","/pdf-information":"PDF विवरण","/extract-bookmarks":"Bookmark निकाल्नुहोस्","/add-bookmarks":"Bookmark थप्नुहोस्","/bates-numbering":"Bates नम्बरिङ","/pdf-to-tiff":"PDF बाट TIFF","/pdf-to-bmp":"PDF बाट BMP","/pdf-to-markdown":"PDF बाट Markdown","/extract-page-images":"PDF पृष्ठ PNG बनाउनुहोस्","/extract-fonts":"Font निकाल्नुहोस्","/split-by-bookmarks":"Bookmark अनुसार छुट्याउनुहोस्","/remove-attachments":"Attachment हटाउनुहोस्","/add-background":"Background थप्नुहोस्","/pdf-to-json":"PDF बाट JSON","/pdf-to-csv":"PDF बाट CSV","/remove-pdf-metadata":"PDF Metadata हटाउनुहोस्","/remove-annotations":"Annotation हटाउनुहोस्","/remove-pdf-links":"PDF Link हटाउनुहोस्","/protect-pdf":"PDF सुरक्षित गर्नुहोस्","/unlock-pdf":"PDF Unlock गर्नुहोस्","/sign-pdf":"PDF मा हस्ताक्षर","/edit-pdf-metadata":"PDF Metadata सम्पादन"
};
const groupNe: Record<string,string> = {"Organize PDF":"PDF मिलाउने","Convert PDF":"PDF रूपान्तरण","Edit PDF":"PDF सम्पादन","Secure & manage":"सुरक्षा र व्यवस्थापन"};
export default function ToolDirectory() {
 const isNe = (usePathname() || "/").startsWith("/ne");
 return <section aria-label={isNe ? "PDFora का PDF टुलहरू" : "Explore PDFora PDF tools"} className="border-t border-teal-100 bg-white px-4 py-10 sm:px-6">
  <div className="mx-auto max-w-6xl">
   <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div>
    <p className="text-xs font-black uppercase tracking-widest text-teal-700">{isNe ? "PDFora टुल संग्रह" : "PDFora toolbox"}</p>
    <h2 className="mt-1 text-xl font-black text-slate-900">{isNe ? "सबै PDF टुलहरू" : "Explore all tools"}</h2>
    <p className="mt-1 text-sm text-slate-600">{isNe ? "PDF टुलसँगै वित्त, टेक्स्ट, डेभलपर र इमेज उपयोगिताहरू सबै टुल पृष्ठमा उपलब्ध छन्।" : "PDF tools are here, with finance, text, developer and image utilities in our all-tools hub."}</p>
   </div><Link href={isNe ? "/tools" : "/tools"} className="text-sm font-bold text-teal-700 hover:text-orange-600">{isNe ? "वित्त, टेक्स्ट, डेभलपर र इमेज टुलहरू हेर्नुहोस् →" : "Explore finance, text, developer & image tools →"}</Link></div>
   <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{groups.map(([label,...paths])=><div key={label}><h3 className="mb-3 text-sm font-black text-slate-800">{isNe ? groupNe[label] : label}</h3><ul className="space-y-2">{paths.map(path=><li key={path}><Link href={path} className="text-sm text-slate-600 underline-offset-4 hover:text-teal-700 hover:underline">{isNe ? neNames[path] || names[path] : names[path]}</Link></li>)}</ul></div>)}</div>
  </div>
 </section>;
}
