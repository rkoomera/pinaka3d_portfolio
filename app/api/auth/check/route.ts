import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export async function GET(request: Request) {
  try {
    console.log('Auth check endpoint called');
    
    // Get the cookie header from the request
    const cookieHeader = request.headers.get('cookie') || '';
    console.log('Cookie header present:', !!cookieHeader);
    
    // Initialize Supabase client
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            cookie: cookieHeader
          }
        }
      }
    );
    
    // Get user session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase auth error:', error.message);
      return NextResponse.json(
        { error: 'Unauthorized', details: error.message },
        { status: 401 }
      );
    }
    
    if (!data.session) {
      console.log('No session found in auth check');
      return NextResponse.json(
        { error: 'Unauthorized', details: 'No session found' },
        { status: 401 }
      );
    }
    
    // Get user details
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('User data error:', userError?.message || 'No user found');
      return NextResponse.json(
        { error: 'Unauthorized', details: 'User data error' },
        { status: 401 }
      );
    }
    
    // Success case
    console.log('Auth successful for user:', userData.user.email);
    return NextResponse.json({
      authenticated: true,
      user: {
        id: userData.user.id,
        email: userData.user.email,
        role: userData.user.app_metadata?.role || 'user',
      }
    });
  } catch (error) {
    console.error('Auth check unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 