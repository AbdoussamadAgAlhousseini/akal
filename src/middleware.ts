import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except:
  // - /api, /_next, /_vercel (internals)
  // - any path containing a dot (static files like favicon.ico, images…)
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
};
