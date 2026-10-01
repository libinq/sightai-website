import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Redirects "/" to /zh or /en based on Accept-Language (and the NEXT_LOCALE cookie).
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\..*).*)"],
};
