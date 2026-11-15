"use client";

import Link from "next/link";
import { trackConsentAwareEvent } from "../lib/analytics-client";

type BlogToolCTAProps = {
  blogSlug: string;
  href: string;
  label: string;
  calculator?: boolean;
};

export default function BlogToolCTA({ blogSlug, href, label, calculator = false }: BlogToolCTAProps) {
  const trackClick = () => {
    trackConsentAwareEvent("blog_to_tool_click", {
      blog_slug: blogSlug,
      tool_name: label,
      tool_path: href,
    });
  };

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-teal-100 bg-teal-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-800">
        {calculator
          ? "Ready to use your own numbers? Open the interactive calculator."
          : "Ready to try this workflow? Open the matching tool."}
      </p>
      <Link
        href={href}
        onClick={trackClick}
        aria-label={`Open ${label} from the ${blogSlug} guide`}
        className="inline-flex items-center justify-center rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
      >
        Open {label}
      </Link>
    </div>
  );
}
