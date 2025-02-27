import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log('Fetching messages from API route using service role key');
    
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