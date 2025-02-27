import { User } from './auth';

// Client-side functions for user management
export async function createUser(email: string, password: string, role: 'admin' | 'editor' | 'viewer', displayName?: string): Promise<User> {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        role,
        display_name: displayName,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUser(userId: string, data: { role?: string; display_name?: string }): Promise<boolean> {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }

    return true;
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user');
    }

    return true;
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw error;
  }
} 