import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log('Getting unread count using service role key');
    
    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false);
    
    if (error) {
      console.error('Error getting unread count:', error);
      return NextResponse.json(
        { error: 'Failed to get unread count', details: error },
        { status: 500 }
      );
    }
    
    console.log(`Found ${count || 0} unread messages`);
    
    return NextResponse.json({ 
      count: count || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Unexpected error getting unread count:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error },
      { status: 500 }
    );
  }
} 