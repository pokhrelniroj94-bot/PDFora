import { NextResponse, type NextRequest } from "next/server";
import { isLocale, localeInfo } from "./lib/i18n/config";

export function proxy(request: NextRequest) {
  const first = request.nextUrl.pathname.split("/")[1];
  const locale = isLocale(first) ? first : "en";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pdfora-locale", locale);
  requestHeaders.set("x-pdfora-lang", localeInfo[locale].htmlLang);
  requestHeaders.set("x-pdfora-dir", localeInfo[locale].dir);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
