-- SQL script to add subject column to contact_messages table
-- Run this in the Supabase SQL Editor

-- First, check if the column already exists
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'contact_messages'
        AND column_name = 'subject'
    ) INTO column_exists;

    IF NOT column_exists THEN
        -- Add the subject column if it doesn't exist
        ALTER TABLE contact_messages ADD COLUMN subject TEXT;
        RAISE NOTICE 'Subject column added successfully!';
    ELSE
        RAISE NOTICE 'Subject column already exists.';
    END IF;
END $$; 