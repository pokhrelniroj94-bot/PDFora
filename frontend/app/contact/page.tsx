export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
              P
            </div>

            <span className="text-xl font-black tracking-tight">
              PDF<span className="text-violet-600">ora</span>
            </span>
          </a>

          <a
            href="/"
            className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
          >
            Back to Home
          </a>
        </div>
      </header>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">
              Contact PDFora
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              We’d love to hear from you.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Have a question, suggestion, feedback, or a problem with one
              of our PDF tools? Contact the PDFora team.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl">
                📧
              </div>

              <h2 className="mt-5 text-lg font-black">
                Email Support
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                For support, technical problems, suggestions, or general
                questions, contact us by email.
              </p>

              <a
                href="mailto:zenvora966@gmail.com"
                className="mt-5 inline-flex rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
              >
                zenvora966@gmail.com
              </a>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl">
                🛠️
              </div>

              <h2 className="mt-5 text-lg font-black">
                Tool Support
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                If a PDF tool is not working correctly, please include the
                tool name and briefly describe the problem when contacting us.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl">
                💡
              </div>

              <h2 className="mt-5 text-lg font-black">
                Feedback & Suggestions
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                We welcome ideas that can help make PDFora faster, easier,
                and more useful.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl">
                🔒
              </div>

              <h2 className="mt-5 text-lg font-black">
                Privacy Questions
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                For questions about how PDFora handles information and
                uploaded files, please contact us by email.
              </p>

              <a
                href="mailto:zenvora966@gmail.com"
                className="mt-4 inline-block text-sm font-bold text-violet-600 hover:underline"
              >
                Contact PDFora →
              </a>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-violet-100 bg-violet-50 p-6 text-center">
            <p className="text-sm text-slate-600">
              We recommend including the name of the PDF tool you were using
              and a short description of the issue so we can investigate it
              more effectively.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            <a
              href="/privacy"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-600 hover:bg-slate-100"
            >
              Privacy Policy
            </a>

            <a
              href="/terms"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-600 hover:bg-slate-100"
            >
              Terms of Service
            </a>

            <a
              href="/about"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-600 hover:bg-slate-100"
            >
              About PDFora
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-950 px-4 py-8 text-center text-xs text-slate-500">
        © 2026 PDFora. All rights reserved.
      </footer>
    </main>
  );
}