# Authentication Setup Guide

This guide will help you set up authentication for your Pinaka portfolio site.

## Prerequisites

- Supabase account and project
- Access to the Supabase SQL editor
- Environment variables configured in your Next.js project

## Setup Steps

### 1. Create the User Profiles Table

Run the SQL script in `setup-user-profiles.sql` in the Supabase SQL editor. This will:

- Create the `user_profiles` table
- Set up Row Level Security (RLS) policies
- Create a trigger to automatically create a profile when a user signs up
- Set up an initial admin user (you'll need to modify the email address)

### 2. Configure Environment Variables

Make sure you have the following environment variables set up in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

The service role key is required for admin operations like creating and managing users.

### 3. Create Your First Admin User

You can create your first admin user in one of two ways:

#### Option 1: Using the Supabase UI

1. Go to the Authentication section in your Supabase dashboard
2. Click "Add User" and enter the email and password
3. Run the following SQL to make this user an admin:

```sql
UPDATE public.user_profiles
SET role = 'admin'
WHERE id = 'user-id-from-auth-users-table';
```

#### Option 2: Using the SQL Script

1. Modify the `setup-user-profiles.sql` script to include your email address
2. Run the script in the Supabase SQL editor
3. Use the "Reset Password" feature in Supabase to set a password for this user

### 4. Test Authentication

1. Navigate to `/admin/login` in your application
2. Sign in with your admin credentials
3. You should be redirected to the admin dashboard

## User Roles

The system supports three user roles:

- **Admin**: Full access to all features, including user management
- **Editor**: Can edit content but cannot manage users
- **Viewer**: Read-only access to the admin dashboard

## Troubleshooting

### Authentication Issues

If you're having trouble signing in:

1. Check that your environment variables are correctly set
2. Verify that the user exists in the Supabase Auth users table
3. Ensure the user has a corresponding entry in the `user_profiles` table

### Permission Issues

If you're getting permission errors:

1. Check the user's role in the `user_profiles` table
2. Verify that the RLS policies are correctly set up
3. Make sure you're using the service role key for admin operations

## Security Considerations

- Keep your service role key secure and never expose it to the client
- Regularly review user access and permissions
- Consider implementing additional security measures like two-factor authentication 