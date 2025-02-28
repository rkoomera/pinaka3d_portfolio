import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a simple middleware that just passes through all requests
export function middleware(request: NextRequest) {
  // You can add authentication logic here later
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};