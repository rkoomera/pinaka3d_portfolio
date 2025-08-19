import { NextRequest, NextResponse } from 'next/server';
import { updateUser as updateUserService, deleteUser as deleteUserService, requireAdmin } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Check if the user is authenticated and is an admin
    await requireAdmin();
    
    const userId = params.userId;
    const data = await request.json();
    
    // Update the user
    await updateUserService(userId, data);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating user:', error);
    
    return NextResponse.json(
      { message: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Check if the user is authenticated and is an admin
    await requireAdmin();
    
    const userId = params.userId;
    
    // Delete the user
    await deleteUserService(userId);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    
    return NextResponse.json(
      { message: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
} 