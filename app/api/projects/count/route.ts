import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/serviceClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Getting project count');
    
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
      .from('projects')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error getting project count:', error);
      return NextResponse.json(
        { error: 'Failed to get project count', details: error },
        { status: 500 }
      );
    }
    
    console.log(`Found ${count || 0} projects`);
    
    return NextResponse.json({ 
      count: count || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Unexpected error getting project count:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error },
      { status: 500 }
    );
  }
} 