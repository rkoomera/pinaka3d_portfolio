import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServerSupabaseClient();
  
  try {
    // Test Supabase connection
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', 'e-commerce-motion-design')
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to connect to Supabase', 
        error: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'API and Supabase are working!',
      project: data
    });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ 
      success: false, 
      message: 'API error occurred', 
      error: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      success: true, 
      message: 'POST request received', 
      receivedData: body 
    });
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to parse JSON body', 
      error: err instanceof Error ? err.message : String(err)
    }, { status: 400 });
  }
} 