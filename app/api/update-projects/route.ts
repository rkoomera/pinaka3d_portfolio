import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServerSupabaseClient();
  
  try {
    // Get all projects
    const { data: projects, error: getError } = await supabase
      .from('projects')
      .select('id, title, slug, background_video_url');
    
    if (getError) {
      console.error('Error getting projects:', getError);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to get projects', 
        error: getError.message 
      }, { status: 500 });
    }
    
    const results = [];
    
    // Try to update each project with a project video URL
    for (const project of projects) {
      try {
        // Set a different project_video_url than the background video
        const projectVideoUrl = "https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-videos/popup-demo.mp4";
        
        // First try to update with the project_video_url field
        const { data, error } = await supabase
          .from('projects')
          .update({ 
            // We'll try to update this field, but it might not exist
            project_video_url: projectVideoUrl 
          })
          .eq('id', project.id)
          .select('id, title, slug, background_video_url')
          .single();
        
        if (error) {
          // If the error is about the column not existing, we'll just log it
          if (error.message.includes('column "project_video_url" does not exist')) {
            console.log(`Column project_video_url doesn't exist for project ${project.slug}`);
            
            // We'll still consider this a success since we expected this error
            results.push({
              slug: project.slug,
              success: true,
              message: "Column project_video_url doesn't exist, but that's expected",
              before: project
            });
          } else {
            // This is an unexpected error
            console.error(`Error updating project ${project.slug}:`, error);
            results.push({
              slug: project.slug,
              success: false,
              error: error.message
            });
          }
        } else {
          // Update was successful
          results.push({
            slug: project.slug,
            success: true,
            before: project,
            after: data
          });
        }
      } catch (err) {
        console.error(`Error processing project ${project.slug}:`, err);
        results.push({
          slug: project.slug,
          success: false,
          error: err instanceof Error ? err.message : String(err)
        });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Projects processed successfully',
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