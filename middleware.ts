import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Pass-through middleware (no auth gating)
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Keep for future use; currently not enforcing anything
  matcher: ['/admin/:path*'],
};