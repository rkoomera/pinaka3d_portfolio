// types/index.ts
export type ProjectCategory = 'web_development' | 'mobile_app' | 'ui_design' | 'motion_design' | 'branding' | 'other';

export interface Project {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  subtitle: string | null;
  content: string | null;
  summary: string | null;
  thumbnail_url: string | null;
  images: string[] | null;
  videos: string[] | null;
  background_video_url: string | null;
  client_name: string | null;
  client_website: string | null;
  published_date: string | null;
  is_published: boolean;
  featured: boolean;
  tech_stack: string[] | null;
  category: ProjectCategory;
  author_id: number;
  author?: Author;
  duration: string | null;
  role: string | null;
}

export interface Author {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}