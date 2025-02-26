import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServerSupabaseClient();
  
  try {
    // Add the project_video_url column to the projects table
    const { error } = await supabase.rpc('add_project_video_url_column');
    
    if (error) {
      console.error('Error adding column:', error);
      
      // Try an alternative approach with direct SQL
      const { error: sqlError } = await supabase.from('projects')
        .update({ project_video_url: null })
        .eq('id', 1);
      
      if (sqlError && sqlError.message.includes('column "project_video_url" does not exist')) {
        return NextResponse.json({ 
          success: false, 
          message: 'Column does not exist and could not be added', 
          error: error.message,
          sqlError: sqlError.message
        }, { status: 500 });
      }
      
      // If we get here, the column might exist already
      return NextResponse.json({ 
        success: true, 
        message: 'Column might already exist',
        error: error.message
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Column added successfully'
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