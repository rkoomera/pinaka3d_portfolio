import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`Marking message ${id} as read`);
    
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