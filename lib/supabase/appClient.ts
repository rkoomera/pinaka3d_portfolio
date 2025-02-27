import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// This client is used for app router (server components)
export async function createAppSupabaseClient() {
  try {
    return createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  } catch (error) {
    console.error('Error creating app client', error);
    return null;
  }
} 