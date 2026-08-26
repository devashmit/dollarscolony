import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import { isAdminSession } from "./lib/auth-helpers";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isAdmin = !!req.auth && isAdminSession(req.auth as any);
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin") ||
                       req.nextUrl.pathname.startsWith("/api/admin");
  const isLoginPage = req.nextUrl.pathname === "/login";
  const hasExpired = req.nextUrl.searchParams.has("expired");

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isLoginPage && isAdmin && !hasExpired) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/login"],
};
