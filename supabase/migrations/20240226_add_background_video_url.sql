-- Add background_video_url column to projects table
ALTER TABLE projects ADD COLUMN background_video_url TEXT;

-- Update the existing projects with a default value if needed
-- You can remove or modify this part based on your needs
UPDATE projects SET background_video_url = 'https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-videos//demo-reel-bg.mp4';

-- Add a comment to the column for better documentation
COMMENT ON COLUMN projects.background_video_url IS 'URL to the background video that plays on hover in the featured projects section'; 