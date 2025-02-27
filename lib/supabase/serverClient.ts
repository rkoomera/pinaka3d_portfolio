import { createClient as supabaseCreateClient } from '@supabase/supabase-js';
import { createServerClient as createSSRClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export const createDirectClient = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  
  // Try to use the service role key first for admin operations
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (serviceRoleKey) {
    console.log('Using service role key for database operations');
    return supabaseCreateClient<Database>(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  
  // Fall back to anon key if service role key is not available
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  console.log('Using anon key for database operations (limited permissions)');
  
  return supabaseCreateClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// Create a static client that doesn't use cookies
export function createStaticClient() {
  return createSSRClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: () => undefined,
        set: () => {},
        remove: () => {},
      },
    }
  );
}

export async function createServerClient() {
  try {
    // Get the cookies from the request - must be awaited in Next.js 15
    const cookieStore = await cookies();
    
    return createSSRClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            try {
              return cookieStore.get(name)?.value;
            } catch (error) {
              console.error('Cannot get cookie in static context', error);
              return undefined;
            }
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // Cookie cannot be set - in a static context
              console.error('Cannot set cookie in static context', error);
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              // Cookie cannot be removed - in a static context
              console.error('Cannot remove cookie in static context', error);
            }
          },
        },
      }
    );
  } catch (error) {
    console.error('Error creating server client:', error);
    // Fall back to a client without cookie handling for static generation
    return createStaticClient();
  }
} 