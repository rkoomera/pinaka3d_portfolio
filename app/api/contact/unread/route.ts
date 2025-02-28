import { NextResponse } from 'next/server';
import { getUnreadCount } from '@/lib/services/contact';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const count = await getUnreadCount();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unread count' },
      { status: 500 }
    );
  }
} 