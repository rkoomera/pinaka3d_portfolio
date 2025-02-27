#!/usr/bin/env node

/**
 * Debug AdminNav Component
 * 
 * This script checks authentication and user data to debug why the AdminNav component isn't displaying
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ Found .env.local file');
  dotenv.config({ path: envPath });
} else {
  console.log('❌ No .env.local file found');
}

// Create a Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugAdminNav() {
  console.log('\n🔍 Debugging AdminNav Component Issues\n');
  
  try {
    // 1. Check if the user_profiles table exists and has data
    console.log('1️⃣ Checking user_profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Error accessing user_profiles table:', profilesError.message);
      return;
    }
    
    console.log(`✅ Found ${profiles.length} profiles in the user_profiles table`);
    
    if (profiles.length > 0) {
      console.log('\nFirst profile:');
      console.log('- ID:', profiles[0].id);
      console.log('- Role:', profiles[0].role);
      console.log('- Display Name:', profiles[0].display_name);
    }
    
    // 2. Check if the auth.users table has corresponding users
    console.log('\n2️⃣ Checking auth users...');
    
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('❌ Error accessing auth users:', authError.message);
      } else {
        console.log(`✅ Found ${authUsers.users.length} users in auth.users`);
        
        if (authUsers.users.length > 0) {
          console.log('\nFirst user:');
          console.log('- ID:', authUsers.users[0].id);
          console.log('- Email:', authUsers.users[0].email);
          console.log('- Created At:', authUsers.users[0].created_at);
          
          // Check if this user has a profile
          const matchingProfile = profiles.find(p => p.id === authUsers.users[0].id);
          if (matchingProfile) {
            console.log('✅ User has a matching profile');
          } else {
            console.log('❌ User does not have a matching profile');
          }
        }
      }
    } catch (error) {
      console.error('❌ Error listing auth users:', error.message);
      console.log('This might be due to missing admin privileges or incorrect service role key');
    }
    
    // 3. Check the middleware and layout files
    console.log('\n3️⃣ Checking file structure...');
    
    const adminLayoutPath = path.join(process.cwd(), 'app/admin/layout.tsx');
    if (fs.existsSync(adminLayoutPath)) {
      console.log('✅ admin/layout.tsx exists');
    } else {
      console.log('❌ admin/layout.tsx does not exist');
    }
    
    const adminNavPath = path.join(process.cwd(), 'components/admin/AdminNav.tsx');
    if (fs.existsSync(adminNavPath)) {
      console.log('✅ components/admin/AdminNav.tsx exists');
    } else {
      console.log('❌ components/admin/AdminNav.tsx does not exist');
    }
    
    const middlewarePath = path.join(process.cwd(), 'middleware.ts');
    if (fs.existsSync(middlewarePath)) {
      console.log('✅ middleware.ts exists');
    } else {
      console.log('❌ middleware.ts does not exist');
    }
    
    // 4. Check if the admin page is accessible - skip this part since node-fetch is ESM only
    console.log('\n4️⃣ Skipping admin page access check (requires ESM)');
    
    // 5. Provide recommendations
    console.log('\n5️⃣ Recommendations:');
    console.log('1. Make sure the SQL script to fix RLS policies has been run in the Supabase SQL Editor');
    console.log('2. Check browser console for any JavaScript errors when loading the admin page');
    console.log('3. Verify that the middleware is correctly handling authentication');
    console.log('4. Ensure the AdminNav component is correctly imported in the admin layout');
    console.log('5. Check that the user object is being properly passed to the AdminNav component');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the debug function
debugAdminNav(); 