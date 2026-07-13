import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except:
  // - /api, /abdoussamad (admin is French-only, outside i18n routing)
  // - /_next, /_vercel (internals)
  // - any path containing a dot (static files like favicon.ico, images…)
  matcher: '/((?!api|abdoussamad|_next|_vercel|.*\\..*).*)'
};
