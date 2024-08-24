import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "./utils/auth/verify-token";

export function middleware(request: NextRequest): NextResponse {
  const cookieStore = cookies();
  const token = cookieStore.get("tripelse_access_token")?.value;

  // Verify and decode the token
  const user = token ? verifyToken(token) : null;

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  // Optionally, validate the token with your backend here

  return NextResponse.next();
}

// Protect all routes under /dashboard or /admin
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
