import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIES } from "@/lib/auth/session";

const publicWhenAdmin = new Set([
  "/",
  "/products",
  "/users",
  "/cart",
  "/contact",
  "/login",
  "/register",
]);

function startsWithAny(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const role = request.cookies.get(AUTH_COOKIES.role)?.value;
  const isAdmin = role === "admin";
  const isDashboard = startsWithAny(pathname, ["/dashboard"]);

  if (isDashboard && !isAdmin) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin && (publicWhenAdmin.has(pathname) || startsWithAny(pathname, ["/products", "/users", "/cart", "/contact"]))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isAdmin && pathname === "/users") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

