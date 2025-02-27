import { createClient } from '@supabase/supabase-js';
import { ContactMessage } from '@/lib/types';
import { createDirectClient, createServerClient } from '@/lib/supabase/serverClient';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/serviceClient';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function submitContactForm(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  console.log('submitContactForm called with:', {
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    messageLength: formData.message?.length,
    supabaseUrl,
    hasSupabaseKey: !!supabaseKey,
  });

  try {
    // Create the insert object with the subject field
    const insertData = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      read: false,
    };
    
    // Log the actual data being inserted
    console.log('Inserting data:', insertData);
    
    // Try using the service client first (bypasses RLS)
    console.log('Trying with service client to bypass RLS');
    const serviceClient = await createServiceClient();
    
    const { data, error } = await serviceClient
      .from('contact_messages')
      .insert([insertData])
      .select();

    if (error) {
      console.error('Error submitting contact form:', error);
      
      // Check for RLS error
      if (error.code === '42501' && error.message.includes('row-level security policy')) {
        const rlsError = new Error('Permission denied: Unable to insert data due to security policy. Please contact the administrator.');
        (rlsError as any).code = error.code;
        (rlsError as any).details = 'Row-Level Security policy violation';
        throw rlsError;
      }
      
      // Format the error before throwing it
      const formattedError = new Error(`Database error: ${error.message}`);
      // Add additional properties to the error
      (formattedError as any).code = error.code;
      (formattedError as any).details = error.details;
      throw formattedError;
    }

    console.log('Contact form submitted successfully, data:', data);
  } catch (error) {
    console.error('Exception in submitContactForm:', error);
    // If it's not already a formatted error, format it
    if (!(error instanceof Error)) {
      throw new Error(`Unknown error: ${JSON.stringify(error)}`);
    }
    throw error;
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  console.log('getContactMessages called');
  try {
    const supabaseServer = await createServerSupabaseClient();
    
    const { data, error } = await supabaseServer
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching contact messages:', error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} messages`);
    return data || [];
  } catch (error) {
    console.error('Exception in getContactMessages:', error);
    throw error;
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const supabase = await createServerClient();
    
    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false);
    
    if (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Unexpected error getting unread count:', error);
    return 0;
  }
}

export async function markAsRead(id: string): Promise<void> {
  try {
    const supabaseServer = await createServerSupabaseClient();
    
    const { error } = await supabaseServer
      .from('contact_messages')
      .update({ read: true })
      .eq('id', id);
      
    if (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  } catch (error) {
    console.error('Exception in markAsRead:', error);
    throw error;
  }
}

export async function markAllAsRead(): Promise<void> {
  try {
    const supabaseServer = await createServerSupabaseClient();
    
    const { error } = await supabaseServer
      .from('contact_messages')
      .update({ read: true })
      .eq('read', false);
      
    if (error) {
      console.error('Error marking all messages as read:', error);
      throw error;
    }
  } catch (error) {
    console.error('Exception in markAllAsRead:', error);
    throw error;
  }
} 