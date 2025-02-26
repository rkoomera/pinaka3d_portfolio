-- Drop the 'images' and 'videos' fields from the projects table
ALTER TABLE projects 
DROP COLUMN IF EXISTS images,
DROP COLUMN IF EXISTS videos; 