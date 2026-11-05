import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, localeInfo } from "./lib/i18n/config";

/**
 * Forward the active URL locale to the root layout. This keeps the document-level
 * lang/dir correct for every route without adding client-side DOM mutations.
 */
export function proxy(request: NextRequest) {
  const firstSegment = request.nextUrl.pathname.split("/")[1] ?? "";
  const locale = isLocale(firstSegment) && firstSegment !== defaultLocale
    ? firstSegment
    : defaultLocale;
  const info = localeInfo[locale];
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pdfora-html-lang", info.htmlLang);
  requestHeaders.set("x-pdfora-dir", info.dir);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
