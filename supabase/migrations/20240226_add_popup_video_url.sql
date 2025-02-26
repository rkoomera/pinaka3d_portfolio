-- Add project_video_url column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_video_url TEXT;
