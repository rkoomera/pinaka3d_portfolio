// lib/services/projects.ts
import { Project } from '@/types';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function getFeaturedProjects() {
  const supabaseServer = createServerSupabaseClient();
  
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
  const supabaseServer = createServerSupabaseClient();
  
  const { data, error } = await supabaseServer
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
  const supabaseServer = createServerSupabaseClient();
  
  const { data, error } = await supabaseServer
    .from('projects')
    .select('*, author:authors(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }

  return data as Project;
}