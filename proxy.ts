import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";

// In-memory rate limiter: max 5 POSTs per IP per 10 minutes
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
const ipMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  if (entry.count > RATE_LIMIT) return true;

  return false;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin auth guard
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/admin")) {
    const session = req.cookies.get(SESSION_COOKIE);
    const expected = process.env.ADMIN_SESSION_SECRET;
    if (!session || !expected || session.value !== expected) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  // IP rate limiting for form POST submissions
  const isFormPost =
    req.method === "POST" &&
    (pathname.startsWith("/apply") || pathname.startsWith("/contact"));

  if (isFormPost) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return new NextResponse("Too many submissions. Please try again later.", {
        status: 429,
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/apply", "/contact"],
};
