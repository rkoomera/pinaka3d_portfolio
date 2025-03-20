// types/index.ts
import { Image } from 'sanity'

export type ProjectCategory = 'web' | 'mobile' | 'desktop' | 'ui' | 'branding' | 'other';

export interface Project {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: { current: string };
  description: string;
  content: any[]; // Sanity Portable Text
  summary?: string;
  subtitle?: string;
  thumbnail: Image;
  gallery?: Image[];
  status: 'draft' | 'published' | 'archived';
  category: ProjectCategory;
  client_name?: string;
  client_website?: string;
  duration?: string;
  role?: string;
  tech_stack?: string[];
  background_video_url?: string;
  project_video_url?: string;
  publishedAt: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at?: string;
  updated_at?: string;
}

export interface Author {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}