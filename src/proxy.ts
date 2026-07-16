import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameSegments = pathname.split("/");
  const locale = pathnameSegments[1];
  const pathWithoutLocale = "/" + pathnameSegments.slice(2).join("/");

  const isAuthRoute = AUTH_ROUTES.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(route + "/"),
  );

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;

  if (isLoggedIn && isAuthRoute) {
    const homeUrl = new URL(`/${locale}`, request.url);
    return NextResponse.redirect(homeUrl);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*"],
};
