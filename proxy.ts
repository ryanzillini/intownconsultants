import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidSessionToken, tokenFromCookieHeader } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = tokenFromCookieHeader(request.headers.get("cookie"));
  const authed = isValidSessionToken(token);

  if (pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname === "/manage/login") {
    if (authed) {
      return NextResponse.redirect(new URL("/manage", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/manage") && !authed) {
    const login = new URL("/manage/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage", "/manage/:path*", "/api/admin/:path*"],
};
