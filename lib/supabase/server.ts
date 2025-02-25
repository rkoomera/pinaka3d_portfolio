// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { createClient } from '@supabase/supabase-js';

// This client is used for static generation (build time)
export function createStaticSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// This client is used for server-side rendering (request time)
export function createServerSupabaseClient() {
  // Check if we're in a static context (build time)
  const isStaticContext = typeof cookies === 'function' && (() => {
    try {
      cookies();
      return false; // If no error, we're in a dynamic context
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return true; // If error, we're in a static context
    }
  })();

  // If we're in a static context, use the static client
  if (isStaticContext) {
    return createStaticSupabaseClient();
  }

  // Otherwise, use the server client with cookies
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          const cookieStore = await cookies();
          cookieStore.set(name, value, options);
        },
        async remove(name: string, options: CookieOptions) {
          const cookieStore = await cookies();
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );
}