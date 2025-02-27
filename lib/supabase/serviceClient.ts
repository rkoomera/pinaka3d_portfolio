import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export const createServiceClient = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  if (!serviceRoleKey) {
    console.warn('Service role key is not available. Some operations may fail due to RLS policies.');
  }
  
  console.log('Creating service client for database operations');
  
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}; 