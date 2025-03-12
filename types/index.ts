// types/index.ts
import { GalleryImage } from '@/components/admin/ProjectGallery';

export type ProjectCategory = 'web' | 'mobile' | 'desktop' | 'ui' | 'branding' | 'other';

export interface Project {
  id: number;
  created_at?: string;
  updated_at?: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  thumbnail_url: string | null;
  featured_image_path?: string | null;
  status: 'draft' | 'published' | 'archived';
  category: ProjectCategory;
  user_id: string;
  gallery_images?: GalleryImage[];
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