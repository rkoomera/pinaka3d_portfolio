import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/supabase';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient<Database>({ req, res });
  
  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  // If the user is not authenticated and trying to access an admin route, redirect to login
  if (!session && req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/admin/login')) {
    // Create a URL for the login page with a redirect back to the current page
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/admin/login';
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    
    return NextResponse.redirect(redirectUrl);
  }
  
  return res;
}

// Apply this middleware to all routes that require authentication
export const config = {
  matcher: [
    // Include specific admin routes that need authentication
    '/admin',
    '/admin/dashboard',
    '/admin/projects',
    '/admin/messages',
    '/admin/users',
    '/admin/settings',
    '/admin/debug-page',
    '/admin/auth-test'
  ]
}; 