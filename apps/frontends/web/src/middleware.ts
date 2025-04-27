import { cookies } from "next/headers";
import { NextResponse, type NextRequest, userAgent } from "next/server";
import { verifyToken } from "./utils/auth/verify-token";
import { routes } from "./constants/routes";
import vars from "./constants/vars";

export async function middleware(request: NextRequest): Promise<NextResponse> {
	const cookieStore = await cookies();
	const url = request.nextUrl;
	const { device } = userAgent(request);
	const viewport = device.type === "mobile" ? "mobile" : "desktop";
	url.searchParams.set("viewport", viewport);

	const token = cookieStore.get(vars.token.access_name)?.value;

	// Verify and decode the token
	const user = token ? verifyToken(token) : null;

	if (!user) {
		return NextResponse.redirect(new URL(routes.auth.login, request.url));
	}
	// Optionally, validate the token with your backend here

	// return NextResponse.next();
	return NextResponse.rewrite(url);
}

// Protect all routes under /dashboard or /admin
export const config = {
	matcher: ["/dashboard/:path*", "/admin/:path*"],
};
