import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/serviceClient';

export async function GET() {
  try {
    console.log('Getting unread count');
    
    // Use the service client which has better error handling
    const supabase = await createServiceClient();
    
    if (!supabase) {
      console.error('Failed to create Supabase client - service client returned null');
      return NextResponse.json(
        { error: 'Failed to create database client' },
        { status: 500 }
      );
    }
    
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