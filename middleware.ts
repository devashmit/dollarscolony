import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin") ||
                       req.nextUrl.pathname.startsWith("/api/admin");
  const isLoginPage = req.nextUrl.pathname === "/login";

  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/login"],
};
