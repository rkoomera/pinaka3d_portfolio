import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Create a new message document in Sanity
    const result = await client.create({
      _type: 'message',
      _id: uuidv4(),
      name,
      email,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save message' },
      { status: 500 }
    );
  }
} 