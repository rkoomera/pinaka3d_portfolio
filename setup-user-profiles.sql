-- Create the user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow admins to read all profiles
CREATE POLICY "Admins can read all profiles"
  ON public.user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow users to update their own profile (except role)
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    (role IS NULL OR role = (SELECT role FROM public.user_profiles WHERE id = auth.uid()))
  );

-- Allow admins to update any profile
CREATE POLICY "Admins can update any profile"
  ON public.user_profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow service role to do everything
CREATE POLICY "Service role can do everything"
  ON public.user_profiles
  USING (true)
  WITH CHECK (true);

-- Create a function to create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role, display_name)
  VALUES (new.id, 'viewer', split_part(new.email, '@', 1));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create an initial admin user if one doesn't exist
-- Note: You'll need to replace 'your-admin-email@example.com' with your actual admin email
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.user_profiles WHERE role = 'admin'
  ) THEN
    -- Check if the user exists in auth.users
    IF EXISTS (
      SELECT 1 FROM auth.users WHERE email = 'your-admin-email@example.com'
    ) THEN
      -- Update the user's role to admin
      UPDATE public.user_profiles
      SET role = 'admin'
      WHERE id = (
        SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com'
      );
    END IF;
  END IF;
END $$; 