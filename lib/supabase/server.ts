// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// This client is used for static generation (build time)
export function createStaticSupabaseClient() {
  console.log('Environment variables in createStaticSupabaseClient:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'defined' : 'undefined');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'defined' : 'undefined');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing required environment variables for Supabase client');
    return null;
  }
  
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// This client is used for server-side operations that need auth (within request context)
export async function createServerSupabaseClient() {
  console.log('Environment variables in createServerSupabaseClient:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'defined' : 'undefined');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'defined' : 'undefined');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing required environment variables for Supabase client');
    return null;
  }
  
  try {
    // Create a client without cookies first
    return createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  } catch (error) {
    console.error('Error creating server client:', error);
    return null;
  }
}