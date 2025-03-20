import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const unreadCount = await client.fetch(`
      count(*[_type == "message" && read == false])
    `);

    return NextResponse.json({ success: true, count: unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    
    // Check if the error is related to environment variables
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isEnvError = errorMessage.includes('environment variable');
    
    return NextResponse.json(
      { 
        success: false, 
        error: isEnvError 
          ? 'Configuration error. Please contact the administrator.' 
          : 'Failed to fetch unread count' 
      },
      { status: 500 }
    );
  }
} 