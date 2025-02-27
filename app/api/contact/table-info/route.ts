import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Query to get table structure
    const { data, error } = await supabase.rpc('get_table_info', {
      table_name: 'contact_messages'
    });
    
    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Error getting table info',
        error: error.message,
      }, { status: 500 });
    }
    
    // If RPC is not available, try a simple query
    if (!data || data.length === 0) {
      // Try to get a sample record to infer structure
      const { data: sampleData, error: sampleError } = await supabase
        .from('contact_messages')
        .select('*')
        .limit(1);
        
      if (sampleError) {
        return NextResponse.json({
          status: 'error',
          message: 'Error getting sample data',
          error: sampleError.message,
        }, { status: 500 });
      }
      
      return NextResponse.json({
        status: 'success',
        message: 'Table structure inferred from sample',
        columns: sampleData && sampleData.length > 0 
          ? Object.keys(sampleData[0]).map(key => ({ column_name: key }))
          : [],
        sample: sampleData,
      });
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Table structure retrieved',
      columns: data,
    });
  } catch (error) {
    console.error('Error in table-info endpoint:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error',
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
} 