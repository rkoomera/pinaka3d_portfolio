-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous read access to published projects
CREATE POLICY "Allow anonymous read access to published projects"
ON projects
FOR SELECT
USING (is_published = true);

-- Create policy to allow anonymous read access to authors
CREATE POLICY "Allow anonymous read access to authors"
ON authors
FOR SELECT
TO anon
USING (true); 