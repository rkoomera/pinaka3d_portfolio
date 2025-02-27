# Adding Subject Column to Contact Messages Table

There are several ways to add the `subject` column to your `contact_messages` table in Supabase:

## Option 1: Using the Supabase SQL Editor (Recommended)

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Create a new query
4. Paste the following SQL:

```sql
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
```

5. Click "Run" to execute the query

## Option 2: Using the Supabase Table Editor

1. Log in to your Supabase dashboard
2. Go to the Table Editor
3. Select the `contact_messages` table
4. Click on "Edit table"
5. Add a new column with the following properties:
   - Name: `subject`
   - Type: `text`
   - Default Value: leave empty
   - Is Nullable: Yes (or No if you want it to be required)
6. Click "Save" to add the column

## Option 3: Using the Supabase API

If you have the `run_sql` RPC function enabled in your Supabase project, you can run the `run_sql.js` script provided in this repository:

1. Make sure you have Node.js installed
2. Run `npm install @supabase/supabase-js dotenv`
3. Run `node run_sql.js`

## Verifying the Column Was Added

After adding the column, you can verify it was added successfully by:

1. Going to the Table Editor in Supabase
2. Selecting the `contact_messages` table
3. Checking that the `subject` column appears in the table schema

## Next Steps

After adding the column, the updated code in this repository will work correctly with the subject field. The following files have been updated:

- `lib/services/contact.ts`: Updated to include the subject field in database operations
- `app/api/contact/route.ts`: Updated to validate the subject field
- `components/portfolio/ContactForm.tsx`: Updated to make the subject field required
- `components/admin/MessageList.tsx`: Updated to display the subject field correctly 