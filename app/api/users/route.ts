import { NextRequest, NextResponse } from 'next/server';
import { createUser as createUserService, requireAdmin } from '@/lib/services/auth';

export async function POST(request: NextRequest) {
  try {
    // Check if the user is authenticated and is an admin
    await requireAdmin();
    
    // Parse the request body
    const { email, password, role, display_name } = await request.json();
    
    // Validate the input
    if (!email || !password || !role) {
      return NextResponse.json(
        { message: 'Email, password, and role are required' },
        { status: 400 }
      );
    }
    
    // Create the user
    const newUser = await createUserService(email, password, role as 'admin' | 'editor' | 'viewer', display_name);
    
    return NextResponse.json(newUser);
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    return NextResponse.json(
      { message: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
} 