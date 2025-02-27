require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for schema changes

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSql() {
  try {
    console.log('Connecting to Supabase...');
    
    // Check if the column already exists
    const { data: columns, error: columnsError } = await supabase
      .from('contact_messages')
      .select('subject')
      .limit(1);
    
    if (columnsError && columnsError.message.includes('column "subject" does not exist')) {
      console.log('Subject column does not exist. Adding it now...');
      
      // Run the SQL query to add the subject column
      const { error } = await supabase.rpc('run_sql', {
        query: 'ALTER TABLE contact_messages ADD COLUMN subject TEXT'
      });
      
      if (error) {
        console.error('Error adding subject column:', error);
        process.exit(1);
      }
      
      console.log('Subject column added successfully!');
    } else if (columnsError) {
      console.error('Error checking for subject column:', columnsError);
      process.exit(1);
    } else {
      console.log('Subject column already exists.');
    }
    
    console.log('Done!');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

runSql(); 