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

export async function POST(request: Request) {
  try {
    const json = await request.json();
    
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
      is_published = false,
      featured = false,
    } = json;
    
    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }
    
    // Insert project into database
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title,
        slug,
        content,
        summary,
        thumbnail_url,
        category,
        tech_stack,
        is_published,
        featured,
        author_id: user.id,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating project:', error);
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

export async function GET() {
  try {
    // Get projects from database
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase
      .from('projects')
      .select('*, author:authors(*)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
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