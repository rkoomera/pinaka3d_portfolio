// lib/services/projects.ts
import { Project } from '@/types';
import { createServerSupabaseClient, createStaticSupabaseClient } from '@/lib/supabase/server';

export async function getFeaturedProjects() {
  const supabaseServer = await createServerSupabaseClient();
  
  const { data, error } = await supabaseServer
    .from('projects')
    .select('*, author:authors(*)')
    .eq('is_published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }

  return data as Project[];
}

export async function getAllProjects() {
  // Use static client for operations that might be called during static generation
  const supabaseStatic = createStaticSupabaseClient();
  
  const { data, error } = await supabaseStatic
    .from('projects')
    .select('*, author:authors(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data as Project[];
}

export async function getProjectBySlug(slug: string) {
  // Use static client for operations that might be called during static generation
  const supabaseStatic = createStaticSupabaseClient();
  
  const { data, error } = await supabaseStatic
    .from('projects')
    .select('*, author:authors(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error(`Error fetching project with slug ${slug}:`, error);
    return null;
  }

  return data as Project;
}

export async function getProjectCount(): Promise<number> {
  const supabaseServer = await createServerSupabaseClient();
  
  try {
    const { count, error } = await supabaseServer
      .from('projects')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error getting project count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Unexpected error getting project count:', error);
    return 0;
  }
}