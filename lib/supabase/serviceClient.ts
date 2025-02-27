import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export const createServiceClient = async () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Check if required environment variables are available
    if (!supabaseUrl) {
      console.error('Supabase URL is not available');
      return null;
    }
    
    // Try to use service role key first
    if (serviceRoleKey) {
      console.log('Creating service client with service role key');
      return createClient<Database>(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
    }
    
    // Fall back to anon key if service role key is not available
    if (anonKey) {
      console.warn('Service role key is not available. Falling back to anon key. Some operations may fail due to RLS policies.');
      return createClient<Database>(supabaseUrl, anonKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
    }
    
    console.error('Neither service role key nor anon key is available');
    return null;
  } catch (error) {
    console.error('Error creating service client:', error);
    return null;
  }
}; 