import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth/config";

const publicPaths = ["/", "/login", "/forgot-password", "/verify"];

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isLoggedIn = Boolean(request.auth?.user);

  if (!isLoggedIn && !isPublic) {
    const loginUrl = new URL("/login", request.nextUrl);
    if (pathname !== "/") {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && (pathname === "/login" || pathname === "/forgot-password" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
