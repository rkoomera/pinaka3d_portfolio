import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServerSupabaseClient();
  
  try {
    // Get the project first
    const { data: project, error: getError } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', 'e-commerce-motion-design')
      .single();
    
    if (getError) {
      console.error('Error getting project:', getError);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to get project', 
        error: getError.message 
      }, { status: 500 });
    }
    
    // Set a different popup_video_url
    const popupVideoUrl = "https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-videos/popup-demo.mp4";
    
    // Update the project
    const { data, error } = await supabase
      .from('projects')
      .update({ popup_video_url: popupVideoUrl })
      .eq('id', project.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating project:', error);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to update project', 
        error: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Project updated successfully',
      before: project,
      after: data
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