require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function dropFields() {
  console.log('Dropping images and videos fields from projects table...');
  
  // Execute SQL directly
  const { data, error } = await supabase
    .from('projects')
    .select('id')
    .limit(1);
  
  if (error) {
    console.error('Error connecting to Supabase:', error);
    return;
  }
  
  console.log('Connected to Supabase successfully!');
  console.log('Please go to the Supabase dashboard and execute the following SQL:');
  console.log(`
    ALTER TABLE projects 
    DROP COLUMN IF EXISTS images,
    DROP COLUMN IF EXISTS videos;
  `);
  console.log('\nAlternatively, you can use the Supabase dashboard to remove these fields through the Table Editor.');
}

dropFields().catch(console.error); 