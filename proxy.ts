import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const publicPaths = ["/", "/login", "/forgot-password", "/verify", "/api/auth"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  const session = await auth();

  if (!session?.user && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (session?.user && (pathname === "/login" || pathname === "/forgot-password" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
