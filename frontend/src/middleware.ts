import { NextRequest, NextResponse } from "next/server";
import { wantsMarkdown } from "@/lib/markdown-negotiation";

const SKIP_PREFIXES = ["/api/", "/_next/"];
const SKIP_HEADER = "x-markdown-skip";

function shouldNegotiate(pathname: string): boolean {
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return false;
  }
  if (pathname.includes(".")) {
    return false;
  }
  return true;
}

export function middleware(request: NextRequest) {
  if (request.headers.get(SKIP_HEADER) === "1") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (!shouldNegotiate(pathname)) {
    return NextResponse.next();
  }

  if (!wantsMarkdown(request.headers.get("accept"))) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const slug = pathname === "/" ? "" : pathname.slice(1);
  url.pathname = `/api/markdown/${slug}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
