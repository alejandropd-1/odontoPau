import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/admin/index.html#/screens/panel_editorial', request.url));
}

export const config = {
  matcher: ['/editorial/:path*'],
};
