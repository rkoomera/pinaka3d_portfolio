import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServerSupabaseClient();
  
  try {
    // Get all projects
    const { data: projects, error: getError } = await supabase
      .from('projects')
      .select('id, title, slug, background_video_url, popup_video_url');
    
    if (getError) {
      console.error('Error getting projects:', getError);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to get projects', 
        error: getError.message 
      }, { status: 500 });
    }
    
    const results = [];
    
    // Update each project with a popup video URL if it doesn't have one
    for (const project of projects) {
      if (!project.popup_video_url) {
        // Set a different popup_video_url than the background video
        const popupVideoUrl = "https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-videos/popup-demo.mp4";
        
        // Update the project
        const { data, error } = await supabase
          .from('projects')
          .update({ popup_video_url: popupVideoUrl })
          .eq('id', project.id)
          .select('id, title, slug, background_video_url, popup_video_url')
          .single();
        
        if (error) {
          console.error(`Error updating project ${project.slug}:`, error);
          results.push({
            slug: project.slug,
            success: false,
            error: error.message
          });
        } else {
          results.push({
            slug: project.slug,
            success: true,
            before: project,
            after: data
          });
        }
      } else {
        results.push({
          slug: project.slug,
          success: true,
          message: 'Already has popup_video_url',
          data: project
        });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Projects updated successfully',
      results
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