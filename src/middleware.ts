'use server';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect the /logs route
  if (pathname.startsWith('/logs')) {
    const isAuthenticated = request.cookies.get('logs_auth')?.value === 'true';

    // Allow access to the login page itself
    if (pathname === '/logs/login') {
      return NextResponse.next();
    }

    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/logs/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/logs', '/logs/:path*'],
};
