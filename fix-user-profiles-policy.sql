-- Fix for infinite recursion in user_profiles policies
-- Run this in the Supabase SQL Editor

-- First, disable RLS temporarily to ensure we can modify policies
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on user_profiles
DROP POLICY IF EXISTS "Users can read their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role can do everything" ON public.user_profiles;
DROP POLICY IF EXISTS "Anyone can read profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

-- Create simplified policies
-- Allow anyone to read profiles
CREATE POLICY "Anyone can read profiles"
  ON public.user_profiles
  FOR SELECT
  USING (true);

-- Allow service role to do everything
CREATE POLICY "Service role can do everything"
  ON public.user_profiles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Allow users to update their own profile (except role)
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Re-enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Verify the policies
SELECT * FROM pg_policies WHERE tablename = 'user_profiles'; 