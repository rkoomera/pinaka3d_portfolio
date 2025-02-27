-- Add subject column to contact_messages table
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS subject TEXT;

-- Update existing records to have a default subject
UPDATE contact_messages SET subject = 'Contact Form Submission' WHERE subject IS NULL; 