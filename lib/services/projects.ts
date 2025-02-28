// lib/services/projects.ts
import { Project } from '@/types';
import { createServerSupabaseClient, createStaticSupabaseClient } from '@/lib/supabase/server';

// Mock data for fallback when database connection fails
const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Sample Project 1',
    slug: 'sample-project-1',
    summary: 'This is a sample project to display when database connection fails.',
    thumbnail_url: '/images/projects/fallback-1.jpg',
    is_published: true,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    subtitle: null,
    content: null,
    background_video_url: null,
    project_video_url: null,
    client_name: null,
    client_website: null,
    published_date: null,
    tech_stack: ['React', 'Next.js'],
    category: 'web_development',
    author_id: 1,
    duration: null,
    role: null
  },
  {
    id: 2,
    title: 'Sample Project 2',
    slug: 'sample-project-2',
    summary: 'Another sample project for fallback purposes.',
    thumbnail_url: '/images/projects/fallback-2.jpg',
    is_published: true,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    subtitle: null,
    content: null,
    background_video_url: null,
    project_video_url: null,
    client_name: null,
    client_website: null,
    published_date: null,
    tech_stack: ['Figma', 'Adobe XD'],
    category: 'ui_design',
    author_id: 1,
    duration: null,
    role: null
  },
  {
    id: 3,
    title: 'Sample Project 3',
    slug: 'sample-project-3',
    summary: 'A third sample project for fallback display.',
    thumbnail_url: '/images/projects/fallback-3.jpg',
    is_published: true,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    subtitle: null,
    content: null,
    background_video_url: null,
    project_video_url: null,
    client_name: null,
    client_website: null,
    published_date: null,
    tech_stack: ['React Native', 'Firebase'],
    category: 'mobile_app',
    author_id: 1,
    duration: null,
    role: null
  },
  {
    id: 4,
    title: 'Sample Project 4',
    slug: 'sample-project-4',
    summary: 'A fourth sample project for fallback display.',
    thumbnail_url: '/images/projects/fallback-4.jpg',
    is_published: true,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    subtitle: null,
    content: null,
    background_video_url: null,
    project_video_url: null,
    client_name: null,
    client_website: null,
    published_date: null,
    tech_stack: ['Node.js', 'Express'],
    category: 'web_development',
    author_id: 1,
    duration: null,
    role: null
  }
];

export async function getFeaturedProjects() {
  const supabaseServer = await createServerSupabaseClient();
  
  // Handle case where supabaseServer might be null
  if (!supabaseServer) {
    console.error('Failed to create Supabase client for getFeaturedProjects - using mock data');
    return MOCK_PROJECTS.slice(0, 4);
  }
  
  // First try to get featured projects
  const { data: featuredData, error: featuredError } = await supabaseServer
    .from('projects')
    .select('*, author:authors(*)')
    .eq('is_published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (featuredError) {
    console.error('Error fetching featured projects:', featuredError, '- using mock data');
    return MOCK_PROJECTS.slice(0, 4);
  }

  // If we have enough featured projects, return them
  if (featuredData && featuredData.length >= 4) {
    return featuredData as Project[];
  }
  
  // If we don't have enough featured projects, get the most recent ones to fill the gap
  const { data: recentData, error: recentError } = await supabaseServer
    .from('projects')
    .select('*, author:authors(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6);
    
  if (recentError) {
    console.error('Error fetching recent projects:', recentError, '- using mock data to fill the gap');
    // If we have some featured data, combine it with mock data
    if (featuredData && featuredData.length > 0) {
      const mockToAdd = MOCK_PROJECTS.slice(0, 4 - featuredData.length);
      return [...featuredData, ...mockToAdd] as Project[];
    }
    return MOCK_PROJECTS.slice(0, 4);
  }
  
  return recentData as Project[];
}

export async function getAllProjects() {
  // Use static client for operations that might be called during static generation
  const supabaseStatic = createStaticSupabaseClient();
  
  // Handle case where supabaseStatic might be null
  if (!supabaseStatic) {
    console.error('Failed to create Supabase client for getAllProjects - using mock data');
    return MOCK_PROJECTS;
  }
  
  const { data, error } = await supabaseStatic
    .from('projects')
    .select('*, author:authors(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error, '- using mock data');
    return MOCK_PROJECTS;
  }

  // If we got no data, use mock data
  if (!data || data.length === 0) {
    console.log('No projects found in database - using mock data');
    return MOCK_PROJECTS;
  }

  return data as Project[];
}

export async function getProjectBySlug(slug: string) {
  // Use static client for operations that might be called during static generation
  const supabaseStatic = createStaticSupabaseClient();
  
  // Handle case where supabaseStatic might be null
  if (!supabaseStatic) {
    console.error('Failed to create Supabase client for getProjectBySlug - using mock data');
    // Find a mock project with matching slug or return the first one
    const mockProject = MOCK_PROJECTS.find(p => p.slug === slug) || MOCK_PROJECTS[0];
    return mockProject;
  }
  
  const { data, error } = await supabaseStatic
    .from('projects')
    .select('*, author:authors(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error(`Error fetching project with slug ${slug}:`, error, '- using mock data');
    // Find a mock project with matching slug or return the first one
    const mockProject = MOCK_PROJECTS.find(p => p.slug === slug) || MOCK_PROJECTS[0];
    return mockProject;
  }

  return data as Project;
}

export async function getProjectCount(): Promise<number> {
  const supabaseServer = await createServerSupabaseClient();
  
  // Handle case where supabaseServer might be null
  if (!supabaseServer) {
    console.error('Failed to create Supabase client');
    return 0;
  }
  
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

export async function getRelatedProjects(currentProjectId: string, limit: number = 4) {
  console.log('getRelatedProjects called with ID:', currentProjectId, 'and limit:', limit);
  
  const supabaseServer = await createServerSupabaseClient();
  console.log('Supabase client created:', supabaseServer ? 'success' : 'failed');
  
  // Handle case where supabaseServer might be null
  if (!supabaseServer) {
    console.error('Failed to create Supabase client - using mock data');
    // Return mock data excluding the current project (if it matches a mock ID)
    // Convert currentProjectId to number for comparison
    const currentIdNumber = parseInt(currentProjectId, 10);
    return MOCK_PROJECTS.filter(p => p.id !== currentIdNumber).slice(0, limit);
  }
  
  try {
    // Get the current project to find its categories/tags
    console.log('Fetching current project details for ID:', currentProjectId);
    
    // First check if the ID is valid
    if (!currentProjectId || currentProjectId === 'undefined' || currentProjectId === 'null') {
      console.error('Invalid project ID provided:', currentProjectId);
      return [];
    }
    
    // Try to fetch the current project
    const { data: currentProject, error: projectError } = await supabaseServer
      .from('projects')
      .select('category, tech_stack')
      .eq('id', currentProjectId)
      .single();
    
    // Log the raw response for debugging
    console.log('Current project query response:', { currentProject, projectError });
      
    // Handle error case - even if projectError is an empty object, it's still an error
    if (projectError || !currentProject) {
      console.error('Error fetching current project details:', projectError || 'Project not found');
      
      // Instead of returning empty array, let's get some recent projects
      console.log('Falling back to recent projects');
      const { data: fallbackData, error: fallbackError } = await supabaseServer
        .from('projects')
        .select('*, author:authors(*)')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (fallbackError) {
        console.error('Error fetching fallback projects:', fallbackError);
        return [];
      }
      
      return fallbackData as Project[] || [];
    }
    
    console.log('Current project details:', JSON.stringify(currentProject));
    
    // Build query to find projects with similar categories or tech stack
    let query = supabaseServer
      .from('projects')
      .select('*, author:authors(*)')
      .eq('is_published', true)
      .neq('id', currentProjectId) // Exclude current project
      .order('created_at', { ascending: false })
      .limit(limit);
      
    // If the project has categories, filter by them
    if (currentProject.category && currentProject.category.length > 0) {
      console.log('Filtering by category:', currentProject.category);
      query = query.eq('category', currentProject.category);
    } 
    // Otherwise, if it has tech_stack, filter by that
    else if (currentProject.tech_stack && currentProject.tech_stack.length > 0) {
      console.log('Filtering by tech_stack:', currentProject.tech_stack);
      query = query.overlaps('tech_stack', currentProject.tech_stack);
    } else {
      console.log('No category or tech_stack to filter by');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching related projects:', error);
      return [];
    }
    
    console.log('Found', data?.length || 0, 'related projects');
    
    // If we don't have enough related projects, get the most recent ones
    if (!data || data.length < limit) {
      console.log('Not enough related projects, fetching recent ones');
      const { data: recentData, error: recentError } = await supabaseServer
        .from('projects')
        .select('*, author:authors(*)')
        .eq('is_published', true)
        .neq('id', currentProjectId)
        .order('created_at', { ascending: false })
        .limit(limit - (data?.length || 0));
        
      if (recentError) {
        console.error('Error fetching recent projects:', recentError);
        return data || [];
      }
      
      console.log('Found', recentData?.length || 0, 'recent projects to fill the gap');
      return [...(data || []), ...(recentData || [])] as Project[];
    }
    
    return data as Project[];
  } catch (error) {
    console.error('Unexpected error in getRelatedProjects:', error);
    return [];
  }
}