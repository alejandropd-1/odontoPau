import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /editorial routes
  if (pathname.startsWith('/editorial')) {
    const authCookie = request.cookies.get('editorial_session');
    const isAuthenticated = authCookie?.value === 'authenticated';

    // Allow access to login page
    if (pathname === '/editorial/login') {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/editorial', request.url));
      }
      return NextResponse.next();
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      const loginUrl = new URL('/editorial/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/editorial/:path*'],
};
