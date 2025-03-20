import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const messages = await client.fetch(`
      *[_type == "message"] | order(createdAt desc) {
        _id,
        name,
        email,
        message,
        read,
        createdAt
      }
    `);

    return NextResponse.json({ 
      success: true,
      messages,
      count: messages.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
} 