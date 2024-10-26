import { auth } from "src/auth/auth";

const PUBLIC_ROUTES: string[] = ["/login"];
const AUTH_ROUTES: string[] = ["/error"];
const API_AUTO_PREFIX: string = "/api/auth";
const DEFAULT_LOGIN_REDIRECT: string = "/";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  console.log("isLoggedIn", isLoggedIn);
  console.log("nextUrl", nextUrl);

  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTO_PREFIX);
  const isPublicRoutes = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoutes = AUTH_ROUTES.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoutes) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoutes) {
    return Response.redirect(new URL(PUBLIC_ROUTES[0], nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
