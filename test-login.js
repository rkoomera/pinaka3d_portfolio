#!/usr/bin/env node

/**
 * Login Test Script
 * 
 * This script tests logging in to Supabase directly
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const readline = require('readline');

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

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Test function to check if we can log in
async function testLogin(email, password) {
  console.log('\n🔍 Testing Supabase Login\n');
  
  try {
    // Try to log in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('❌ Login failed:', error.message);
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('User:', data.user.email);
    console.log('Session:', data.session ? 'Active' : 'None');
    
    // Check if we can access the user_profiles table
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Error accessing user profile:', profileError.message);
    } else {
      console.log('✅ User profile retrieved successfully');
      console.log('Profile:', profile);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Prompt for email and password
rl.question('Email: ', (email) => {
  rl.question('Password: ', async (password) => {
    await testLogin(email, password);
    rl.close();
  });
}); 