import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createPagesSupabaseClient } from '@/lib/supabase/pagesClient';
import { createServiceClient } from '@/lib/supabase/serviceClient';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { Database } from '@/types/supabase';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
  last_sign_in_at: string | null;
  display_name: string | null;
}

// This function should only be used in Server Actions
export async function signIn(email: string, password: string) {
  'use server';
  
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

// This function should only be used in Server Actions
export async function signOut() {
  'use server';
  
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  await supabase.auth.signOut();
}

// This function can be used in Server Components
export async function getCurrentUser() {
  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }
      
      // Get additional user data from profiles table
      let { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        // Try with service client as fallback
        const serviceClient = await createServiceClient();
        if (serviceClient) {
          const { data: serviceProfile, error: serviceProfileError } = await serviceClient
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (serviceProfileError) {
            // Return basic user without profile
            return {
              id: user.id,
              email: user.email!,
              role: 'viewer',
              created_at: user.created_at,
              last_sign_in_at: user.last_sign_in_at,
              display_name: user.email?.split('@')[0] || 'User',
            } as User;
          }
          
          profile = serviceProfile;
        } else {
          // Return basic user without profile if service client is null
          return {
            id: user.id,
            email: user.email!,
            role: 'viewer',
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            display_name: user.email?.split('@')[0] || 'User',
          } as User;
        }
      }
      
      const userData = {
        id: user.id,
        email: user.email!,
        role: profile?.role || 'viewer',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        display_name: profile?.display_name || user.email?.split('@')[0] || 'User',
      } as User;
      
      return userData;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/admin/login');
  }
  
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  
  if (user.role !== 'admin') {
    redirect('/admin');
  }
  
  return user;
}

export async function getAllUsers(): Promise<User[]> {
  try {
    // Use service client to bypass RLS
    const supabase = await createServiceClient();
    
    if (!supabase) {
      console.error('Failed to create service client');
      return [];
    }
    
    // Get all users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching users:', authError);
      return [];
    }
    
    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (profilesError) {
      console.error('Error fetching user profiles:', profilesError);
      return [];
    }
    
    // Combine the data
    return authUsers.users.map(user => {
      const profile = profiles?.find(p => p.id === user.id);
      
      return {
        id: user.id,
        email: user.email!,
        role: profile?.role || 'viewer',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        display_name: profile?.display_name || user.email?.split('@')[0] || 'User',
      } as User;
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

export async function createUser(email: string, password: string, role: 'admin' | 'editor' | 'viewer', displayName?: string) {
  try {
    const supabase = await createServiceClient();
    
    if (!supabase) {
      throw new Error('Failed to create service client');
    }
    
    // Create the user in auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    
    if (authError) {
      throw authError;
    }
    
    const userId = authData.user.id;
    
    // Create the user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        {
          id: userId,
          role,
          display_name: displayName || email.split('@')[0],
        },
      ]);
    
    if (profileError) {
      throw profileError;
    }
    
    return {
      id: userId,
      email,
      role,
      created_at: new Date().toISOString(),
      last_sign_in_at: null,
      display_name: displayName || email.split('@')[0],
    } as User;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUser(userId: string, data: { role?: string; display_name?: string }) {
  try {
    const supabase = await createServiceClient();
    
    if (!supabase) {
      throw new Error('Failed to create service client');
    }
    
    const { error } = await supabase
      .from('user_profiles')
      .update(data)
      .eq('id', userId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabase = await createServiceClient();
    
    if (!supabase) {
      throw new Error('Failed to create service client');
    }
    
    // Delete the user from auth.users
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    
    if (authError) {
      throw authError;
    }
    
    // The profile should be deleted automatically via cascade
    
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
} 