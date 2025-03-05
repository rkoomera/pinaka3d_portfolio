import { MetadataRoute } from 'next';
import { getAllProjects } from '@/lib/services/projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL for your site
  const baseUrl = 'https://www.pinaka3d.com';
  
  // Get all projects for dynamic routes
  const projects = await getAllProjects();
  
  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];
  
  // Dynamic routes for projects
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.updated_at || project.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));
  
  return [...staticRoutes, ...projectRoutes];
} 