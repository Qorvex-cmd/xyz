import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const adminRoutes = ["/admin"];
const customerRoutes = ["/dashboard", "/reserve", "/book", "/import"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = (token as any)?.role as string | undefined;

  // Protect customer routes
  if (customerRoutes.some((r) => pathname.startsWith(r))) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect admin routes
  if (adminRoutes.some((r) => pathname.startsWith(r))) {
    if (!token || role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/reserve/:path*", "/book/:path*", "/import/:path*"],
};
