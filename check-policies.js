#!/usr/bin/env node

/**
 * RLS Policies Check Script
 * 
 * This script checks the current RLS policies on the user_profiles table
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

async function checkRLSPolicies() {
  console.log('\n🔍 Checking RLS policies on user_profiles table\n');
  
  try {
    // Use a custom SQL query to check the policies
    const { data, error } = await supabase.rpc('check_policies', {
      table_name: 'user_profiles'
    });
    
    if (error) {
      console.error('❌ Error checking RLS policies with RPC:', error.message);
      
      // Try a direct SQL query instead
      console.log('\nTrying direct SQL query...');
      
      const { data: sqlData, error: sqlError } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);
      
      if (sqlError) {
        console.error('❌ Error accessing user_profiles table:', sqlError.message);
      } else {
        console.log('✅ Successfully accessed user_profiles table with service role key.');
        console.log('This suggests the table exists but the RPC function is not available.');
      }
      
      // Try to check if RLS is enabled
      console.log('\nChecking if RLS is enabled...');
      
      const { data: rlsData, error: rlsError } = await supabase
        .rpc('is_rls_enabled', {
          table_name: 'user_profiles'
        });
      
      if (rlsError) {
        console.error('❌ Error checking if RLS is enabled:', rlsError.message);
        console.log('\nThe RPC functions for checking policies are not available.');
        console.log('Please run the SQL script in the Supabase SQL Editor to fix the RLS policies.');
      } else {
        console.log(`✅ RLS is ${rlsData ? 'enabled' : 'disabled'} on the user_profiles table.`);
      }
      
      return;
    }
    
    console.log('✅ RLS policies information:');
    console.log(data);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the check
checkRLSPolicies(); 