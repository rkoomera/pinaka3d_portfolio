import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createStaticSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Test environment variables
    const envInfo = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    };
    
    console.log('Debug endpoint - Environment info:', envInfo);
    
    // Test Supabase connection
    try {
      // Use createStaticSupabaseClient to avoid cookies() issues during build
      const supabase = createStaticSupabaseClient();
      console.log('Supabase client created successfully');
      
      // Test table access
      const { data, error, count } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact' })
        .limit(1);
      
      if (error) {
        return NextResponse.json({
          status: 'error',
          message: 'Error accessing contact_messages table',
          error: error.message,
          code: error.code,
          envInfo,
        });
      }
      
      return NextResponse.json({
        status: 'success',
        message: 'Supabase connection successful',
        count,
        sampleData: data,
        envInfo,
      });
    } catch (supabaseError) {
      console.error('Error creating Supabase client:', supabaseError);
      return NextResponse.json({
        status: 'error',
        message: 'Error creating Supabase client',
        error: supabaseError instanceof Error ? supabaseError.message : String(supabaseError),
        envInfo,
      });
    }
  } catch (error) {
    console.error('Unexpected error in debug endpoint:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error in debug endpoint',
      error: error instanceof Error ? error.message : String(error),
    });
  }
} 