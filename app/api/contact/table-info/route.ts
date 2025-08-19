import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/serviceClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Getting contact table info');
    
    // Use the service client which has better error handling
    const supabase = await createServiceClient();
    
    if (!supabase) {
      console.error('Failed to create Supabase client - service client returned null');
      return NextResponse.json(
        { error: 'Failed to create database client' },
        { status: 500 }
      );
    }
    
    // Get total count
    const { count: totalCount, error: totalError } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true });
    
    if (totalError) {
      console.error('Error getting total count:', totalError);
      return NextResponse.json(
        { error: 'Failed to get total count', details: totalError },
        { status: 500 }
      );
    }
    
    // Get unread count
    const { count: unreadCount, error: unreadError } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false);
    
    if (unreadError) {
      console.error('Error getting unread count:', unreadError);
      return NextResponse.json(
        { error: 'Failed to get unread count', details: unreadError },
        { status: 500 }
      );
    }
    
    // Get latest message date
    const { data: latestData, error: latestError } = await supabase
      .from('contact_messages')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (latestError) {
      console.error('Error getting latest message date:', latestError);
      return NextResponse.json(
        { error: 'Failed to get latest message date', details: latestError },
        { status: 500 }
      );
    }
    
    const latestDate = latestData && latestData.length > 0 ? latestData[0].created_at : null;
    
    console.log(`Table info: Total: ${totalCount || 0}, Unread: ${unreadCount || 0}, Latest: ${latestDate}`);
    
    return NextResponse.json({ 
      totalCount: totalCount || 0,
      unreadCount: unreadCount || 0,
      latestMessageDate: latestDate,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Unexpected error getting table info:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error },
      { status: 500 }
    );
  }
} 