// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { cookies } from 'next/headers';

// This client is used for static generation (build time)
export function createStaticSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// This client is used for server-side operations that need auth (within request context)
export async function createServerSupabaseClient() {
  try {
    const cookieStore = await cookies();
    
    console.log('Server client: Creating client with cookies');
    
    return createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        },
        global: {
          fetch: (url, options) => {
            // Log the cookies being sent with each request
            if (options?.headers) {
              const headers = options.headers as Record<string, string>;
              if (headers.cookie) {
                console.log('Server client: Request with cookies:', headers.cookie);
              }
            }
            return fetch(url, options);
          }
        }
      }
    );
  } catch (error) {
    // If cookies() fails (outside request context), fall back to static client
    console.warn('Falling back to static client due to cookies() error:', error);
    return createStaticSupabaseClient();
  }
}