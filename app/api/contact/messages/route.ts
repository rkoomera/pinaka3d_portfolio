import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/serviceClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Fetching messages from API route');
    
    // Use the service client which has better error handling
    const supabase = await createServiceClient();
    
    if (!supabase) {
      console.error('Failed to create Supabase client - service client returned null');
      return NextResponse.json(
        { error: 'Failed to create database client' },
        { status: 500 }
      );
    }
    
    const { data: messages, error, count } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages', details: error },
        { status: 500 }
      );
    }
    
    console.log(`Found ${count || 0} messages`);
    
    return NextResponse.json({ 
      messages,
      count: count || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Unexpected error fetching messages:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error },
      { status: 500 }
    );
  }
} 