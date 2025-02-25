// types/supabase.ts
export type ProjectCategory = 'web_development' | 'mobile_app' | 'ui_design' | 'motion_design' | 'branding' | 'other';

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
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
          client_name: string | null;
          client_website: string | null;
          published_date: string | null;
          is_published: boolean;
          featured: boolean;
          tech_stack: string[] | null;
          category: ProjectCategory;
          author_id: number;
          duration: string | null;
          role: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          updated_at?: string;
          title: string;
          slug: string;
          subtitle?: string | null;
          content?: string | null;
          summary?: string | null;
          thumbnail_url?: string | null;
          images?: string[] | null;
          videos?: string[] | null;
          client_name?: string | null;
          client_website?: string | null;
          published_date?: string | null;
          is_published?: boolean;
          featured?: boolean;
          tech_stack?: string[] | null;
          category: ProjectCategory;
          author_id: number;
          duration?: string | null;
          role?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          updated_at?: string;
          title?: string;
          slug?: string;
          subtitle?: string | null;
          content?: string | null;
          summary?: string | null;
          thumbnail_url?: string | null;
          images?: string[] | null;
          videos?: string[] | null;
          client_name?: string | null;
          client_website?: string | null;
          published_date?: string | null;
          is_published?: boolean;
          featured?: boolean;
          tech_stack?: string[] | null;
          category?: ProjectCategory;
          author_id?: number;
          duration?: string | null;
          role?: string | null;
        };
      };
      authors: {
        Row: {
          id: number;
          name: string;
          email: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          email: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          email?: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}