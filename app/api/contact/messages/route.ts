import { NextResponse } from 'next/server';
import { getClient } from '@/sanity/lib/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = getClient(false);
    const messages = await client.fetch(`
      *[_type == "message"] | order(createdAt desc) {
        "id": _id,
        name,
        email,
        subject,
        message,
        read,
        "created_at": createdAt
      }
    `);

    return NextResponse.json({
      success: true,
      messages,
      count: messages.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    
    // Check if the error is related to environment variables
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isEnvError = errorMessage.includes('environment variable');
    
    return NextResponse.json(
      { 
        success: false, 
        error: isEnvError 
          ? 'Configuration error. Please contact the administrator.' 
          : 'Failed to fetch messages' 
      },
      { status: 500 }
    );
  }
} 