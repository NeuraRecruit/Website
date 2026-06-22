import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/admin-session";

const SESSION_COOKIE = "admin_session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin auth guard
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/admin")) {
    const session = req.cookies.get(SESSION_COOKIE);
    const valid = await verifySessionToken(session?.value);
    if (!valid) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  // Form submission rate limiting is handled durably inside the server actions
  // (see lib/rate-limit.ts), which is shared across serverless instances.

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
