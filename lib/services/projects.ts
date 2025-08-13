// lib/services/projects.ts
// Supabase removed from admin; using simple mock data and loose typing for UI

// Mock data consumed by UI components (not strictly typed to keep flexibility)
const MOCK_PROJECTS = [
  {
    id: 1,
    title: 'Sample Project 1',
    slug: 'sample-project-1',
    summary: 'This is a sample project to display when database connection fails.',
    thumbnail_url: '/file.svg',
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
    thumbnail_url: '/file.svg',
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
    thumbnail_url: '/file.svg',
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
    thumbnail_url: '/file.svg',
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
  return MOCK_PROJECTS.slice(0, 4) as any;
}

export async function getAllProjects() {
  return MOCK_PROJECTS as any;
}

export async function getProjectBySlug(slug: string) {
  return (MOCK_PROJECTS.find(p => p.slug === slug) || MOCK_PROJECTS[0]) as any;
}

export async function getProjectCount(): Promise<number> {
  return MOCK_PROJECTS.length;
}

export async function getRelatedProjects(_currentProjectId: string, limit: number = 4) {
  return MOCK_PROJECTS.slice(0, limit) as any;
}