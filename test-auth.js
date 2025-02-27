#!/usr/bin/env node

/**
 * Authentication Test Script
 * 
 * This script tests the Supabase authentication API directly
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Create a Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Test function to check if we can access the Supabase auth API
async function testAuth() {
  console.log('\n🔍 Testing Supabase Authentication API\n');
  
  try {
    // Check if we can access the auth API
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error accessing Supabase auth API:', error.message);
      return;
    }
    
    console.log('✅ Successfully connected to Supabase auth API');
    console.log('Session data:', data);
    
    // Check if we can access the user_profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Error accessing user_profiles table:', profilesError.message);
      return;
    }
    
    console.log('✅ Successfully accessed user_profiles table');
    console.log('First profile:', profiles[0] || 'No profiles found');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
testAuth(); 