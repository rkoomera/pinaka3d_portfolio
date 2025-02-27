#!/usr/bin/env node

/**
 * Authentication Debug Script
 * 
 * This script checks environment variables and Supabase connection
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http');

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ Found .env.local file');
  dotenv.config({ path: envPath });
} else {
  console.log('❌ No .env.local file found');
}

// Check environment variables
console.log('\n🔍 Checking environment variables\n');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
} else {
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL);
}

if (!SUPABASE_ANON_KEY) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
} else {
  console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY.substring(0, 5) + '...' + SUPABASE_ANON_KEY.substring(SUPABASE_ANON_KEY.length - 5));
}

// Create a Supabase client if possible
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  console.log('\n🔍 Testing Supabase connection\n');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // Test function to check if we can access the Supabase auth API
  async function testConnection() {
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
      console.log('\n🔍 Testing access to user_profiles table\n');
      
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);
      
      if (profilesError) {
        console.error('❌ Error accessing user_profiles table:', profilesError.message);
        return;
      }
      
      console.log('✅ Successfully accessed user_profiles table');
      
    } catch (error) {
      console.error('❌ Unexpected error:', error);
    }
  }
  
  // Run the test
  testConnection();
} else {
  console.error('\n❌ Cannot create Supabase client due to missing environment variables');
}

// Check Next.js server status
console.log('\n🔍 Checking Next.js server status\n');

function checkServer(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      console.log(`✅ Server is running on port ${port} (status: ${res.statusCode})`);
      resolve(true);
    });
    
    req.on('error', () => {
      console.log(`❌ No server detected on port ${port}`);
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      req.abort();
      console.log(`❌ Request to port ${port} timed out`);
      resolve(false);
    });
  });
}

async function checkServers() {
  const ports = [3000, 3001, 3002, 3003];
  let serverFound = false;
  
  for (const port of ports) {
    const isRunning = await checkServer(port);
    if (isRunning) {
      serverFound = true;
    }
  }
  
  if (!serverFound) {
    console.log('❌ No Next.js server detected on common ports. Make sure to run "npm run dev" first.');
  }
}

checkServers(); 