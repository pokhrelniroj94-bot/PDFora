import type { Metadata } from "next";

const canonicalUrl = "https://pd-fora.vercel.app/how-to-use";
const videoUrl = "https://www.youtube-nocookie.com/embed/vFnTvA0TkpA";

export const metadata: Metadata = {
  title: "How to Use PDFora | Quick Video Guide",
  description:
    "Watch a short video walkthrough to learn how to use PDFora's online PDF tools, upload documents, complete a task, and download your result.",
  alternates: { canonical: canonicalUrl },
  openGraph: {
    type: "video.other",
    url: canonicalUrl,
    siteName: "PDFora",
    title: "How to Use PDFora",
    description:
      "A short walkthrough showing how to use PDFora online tools.",
    videos: [{ url: videoUrl, secureUrl: videoUrl, type: "text/html", width: 1280, height: 720 }],
  },
  robots: { index: true, follow: true },
};

export default function HowToUsePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 sm:py-14">
      <article className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
            PDFora help
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How to Use PDFora
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Watch this short video walkthrough to see PDFora in action. You can
            then follow the steps below to use the tool you need.
          </p>
        </header>

        <section aria-label="PDFora video walkthrough" className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm">
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full"
              src={videoUrl}
              title="How to use PDFora — video walkthrough"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>

        <section className="mt-9 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Use a PDFora tool</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-slate-700">
            <li>
              <a href="/tools" className="font-semibold text-blue-700 underline underline-offset-2">
                Browse all tools
              </a>{" "}
              or open the specific PDF tool you need.
            </li>
            <li>Choose the file or enter the information requested by that tool.</li>
            <li>Review your selections, then start the operation.</li>
            <li>Check the result and download the processed file when it is ready.</li>
          </ol>
        </section>

        <aside className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5 text-sm leading-6 text-slate-700">
          <h2 className="font-semibold text-slate-900">A quick privacy reminder</h2>
          <p className="mt-1">
            Only upload documents you are authorized to use. If a document
            contains sensitive information, review the tool's privacy details
            before uploading it and keep your downloaded result in a secure place.
          </p>
        </aside>

        <p className="mt-8 text-center text-sm text-slate-600">
          Ready to get started?{" "}
          <a href="/tools" className="font-semibold text-blue-700 underline underline-offset-2">
            Explore PDFora tools
          </a>
          .
        </p>
      </article>
    </main>
  );
}
