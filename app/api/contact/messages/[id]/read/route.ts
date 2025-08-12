import { NextResponse } from 'next/server';
import { getClient } from '@/sanity/lib/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }
    
    const client = getClient(true);
    await client.patch(id).set({ read: true }).commit();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json(
      { 
        error: 'Failed to mark message as read', 
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 