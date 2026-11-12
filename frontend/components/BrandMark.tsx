"use client";

type BrandMarkProps = { size?: number; className?: string };

/** Distinctive PDFora document mark, shared by the homepage and tool workspaces. */
export default function BrandMark({ size = 40, className = "" }: BrandMarkProps) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-[14px] bg-[#082f2e] p-[2px] shadow-[0_7px_18px_rgba(13,148,136,.22)] ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" role="presentation">
        <defs>
          <linearGradient id="pdfora-mark-bg" x1="4" y1="3" x2="36" y2="37" gradientUnits="userSpaceOnUse"><stop stopColor="#5eead4"/><stop offset="1" stopColor="#06b6d4"/></linearGradient>
        </defs>
        <rect x="3" y="3" width="34" height="34" rx="10" fill="url(#pdfora-mark-bg)"/>
        <path d="M12 8.5h10.5L29 15v16.5H12V8.5Z" fill="#f8fffe"/>
        <path d="M22.5 8.5V15H29" stroke="#0f766e" strokeWidth="1.7" strokeLinejoin="round"/>
        <path d="M16 20h9M16 24h9" stroke="#0f766e" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="m22.8 28.3 1.2-3.1 1.2 3.1 3.1 1.2-3.1 1.2-1.2 3.1-1.2-3.1-3.1-1.2 3.1-1.2Z" fill="#f97316" stroke="#f97316" strokeLinejoin="round" transform="translate(-1 -2) scale(.82)"/>
      </svg>
    </span>
  );
}
