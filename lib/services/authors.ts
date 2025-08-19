import { Author } from '@/types';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function getAllAuthors() {
  const supabaseServer = await createServerSupabaseClient();
  
  if (!supabaseServer) {
    console.error('Failed to create Supabase client');
    return [];
  }
  
  const { data, error } = await supabaseServer
    .from('authors')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching authors:', error);
    return [];
  }

  return data as Author[];
}

export async function getAuthorById(id: number) {
  const supabaseServer = await createServerSupabaseClient();
  
  if (!supabaseServer) {
    console.error('Failed to create Supabase client');
    return null;
  }
  
  const { data, error } = await supabaseServer
    .from('authors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching author by id:', error);
    return null;
  }

  return data as Author;
} 