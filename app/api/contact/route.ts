import { NextResponse } from 'next/server';
import { getClient } from '@/sanity/lib/client';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Use a client with token for write operations
    const client = getClient(true);

    // Create a new message document in Sanity
    const result = await client.create({
      _type: 'message',
      _id: uuidv4(),
      name,
      email,
      subject,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error saving message:', error);
    
    // Check if the error is related to environment variables
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isEnvError = errorMessage.includes('environment variable');
    
    return NextResponse.json(
      { 
        success: false, 
        error: isEnvError 
          ? 'Configuration error. Please contact the administrator.' 
          : 'Failed to save message' 
      },
      { status: 500 }
    );
  }
} 