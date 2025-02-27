import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// This client is used for pages router
export function createPagesSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
} 