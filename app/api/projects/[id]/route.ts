import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Create a Supabase client
function createSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing required environment variables for Supabase client');
    throw new Error('Missing required environment variables for Supabase client');
  }
  
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Get a single project by id
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = createSupabaseClient();
    
    // First try to get by id (if it's a number)
    if (!isNaN(Number(id))) {
      const { data, error } = await supabase
        .from('projects')
        .select('*, author:authors(*)')
        .eq('id', Number(id))
        .single();
      
      if (data) {
        return NextResponse.json(data);
      }
    }
    
    // If not found by id or id is not a number, try by slug
    const { data, error } = await supabase
      .from('projects')
      .select('*, author:authors(*)')
      .eq('slug', id)
      .single();
    
    if (error) {
      console.error('Error fetching project:', error);
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update a project
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const json = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    // Get authenticated user
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Extract project data
    const { 
      title, 
      slug, 
      content, 
      summary, 
      thumbnail_url, 
      category, 
      tech_stack, 
      is_published,
      featured,
    } = json;
    
    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }
    
    // Update project in database
    const { data, error } = await supabase
      .from('projects')
      .update({
        title,
        slug,
        content,
        summary,
        thumbnail_url,
        category,
        tech_stack,
        is_published,
        featured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', Number(id))
      .select()
      .single();
    
    if (error) {
      console.error('Error updating project:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a project
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    // Get authenticated user
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Delete project from database
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', Number(id));
    
    if (error) {
      console.error('Error deleting project:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 