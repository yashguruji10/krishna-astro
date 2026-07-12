import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localePrefix } from './i18n';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix
});

export default function middleware(req) {
  // Skip i18n middleware for admin, api, and static assets
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/uploads')
  ) {
    return NextResponse.next();
  }
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!_next|api|uploads|.*\\..*).*)']
};
