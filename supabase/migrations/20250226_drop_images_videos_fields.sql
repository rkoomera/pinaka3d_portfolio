-- Drop the 'images' and 'videos' fields from the projects table
ALTER TABLE projects 
DROP COLUMN IF EXISTS images,
DROP COLUMN IF EXISTS videos;

-- Add a comment to the migration
COMMENT ON TABLE projects IS 'Collection of portfolio projects with removed images and videos fields'; 