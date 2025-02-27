import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/serviceClient';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`Marking message ${id} as read`);
    
    // Use the service client which has better error handling
    const supabase = await createServiceClient();
    
    if (!supabase) {
      console.error('Failed to create Supabase client - service client returned null');
      return NextResponse.json(
        { error: 'Failed to create database client' },
        { status: 500 }
      );
    }
    
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', id);
    
    if (error) {
      console.error('Error marking message as read:', error);
      return NextResponse.json(
        { error: 'Failed to mark message as read', details: error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Unexpected error marking message as read:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error },
      { status: 500 }
    );
  }
} 