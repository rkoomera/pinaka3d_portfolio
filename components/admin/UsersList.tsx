'use client';

import { useState } from 'react';
import { User } from '@/lib/services/auth';
import { createUser, updateUser, deleteUser } from '@/lib/services/authClient';
import { Button } from '@/components/ui/Button';

interface UsersListProps {
  initialUsers: User[];
}

export function UsersList({ initialUsers }: UsersListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');
  const [newUserDisplayName, setNewUserDisplayName] = useState('');
  
  const [editUserRole, setEditUserRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');
  const [editUserDisplayName, setEditUserDisplayName] = useState('');
  
  const resetAddForm = () => {
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserRole('viewer');
    setNewUserDisplayName('');
    setIsAddingUser(false);
  };
  
  const resetEditForm = () => {
    setEditingUserId(null);
    setEditUserRole('viewer');
    setEditUserDisplayName('');
  };
  
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const newUser = await createUser(
        newUserEmail,
        newUserPassword,
        newUserRole,
        newUserDisplayName || undefined
      );
      
      setUsers((prevUsers) => [...prevUsers, newUser]);
      resetAddForm();
    } catch (error: any) {
      console.error('Error adding user:', error);
      setError(error.message || 'Failed to add user');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditUser = async (userId: string) => {
    const userToEdit = users.find((user) => user.id === userId);
    if (!userToEdit) return;
    
    setEditingUserId(userId);
    setEditUserRole(userToEdit.role);
    setEditUserDisplayName(userToEdit.display_name || '');
  };
  
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await updateUser(editingUserId, {
        role: editUserRole,
        display_name: editUserDisplayName || undefined,
      });
      
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUserId
            ? {
                ...user,
                role: editUserRole,
                display_name: editUserDisplayName || null,
              }
            : user
        )
      );
      
      resetEditForm();
    } catch (error: any) {
      console.error('Error updating user:', error);
      setError(error.message || 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error: any) {
      console.error('Error deleting user:', error);
      setError(error.message || 'Failed to delete user');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md transition-colors duration-200">
          {error}
        </div>
      )}
      
      {/* Add User Button */}
      {!isAddingUser && (
        <div className="flex justify-end">
          <Button
            onClick={() => setIsAddingUser(true)}
            className="px-4 py-2"
          >
            Add New User
          </Button>
        </div>
      )}
      
      {/* Add User Form */}
      {isAddingUser && (
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-dark dark:text-light mb-4 transition-colors duration-200">
            Add New User
          </h2>
          
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark dark:text-light mb-1 transition-colors duration-200">
                  Email
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark shadow-sm focus:border-brand focus:ring-brand focus:ring-2 focus:outline-none text-dark dark:text-light transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark dark:text-light mb-1 transition-colors duration-200">
                  Password
                </label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark shadow-sm focus:border-brand focus:ring-brand focus:ring-2 focus:outline-none text-dark dark:text-light transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark dark:text-light mb-1 transition-colors duration-200">
                  Display Name (optional)
                </label>
                <input
                  type="text"
                  value={newUserDisplayName}
                  onChange={(e) => setNewUserDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark shadow-sm focus:border-brand focus:ring-brand focus:ring-2 focus:outline-none text-dark dark:text-light transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark dark:text-light mb-1 transition-colors duration-200">
                  Role
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'editor' | 'viewer')}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark shadow-sm focus:border-brand focus:ring-brand focus:ring-2 focus:outline-none text-dark dark:text-light transition-colors duration-200"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                onClick={resetAddForm}
                variant="outline"
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2"
              >
                {isLoading ? 'Adding...' : 'Add User'}
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Users Table */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
            <thead className="bg-light-secondary dark:bg-dark-secondary transition-colors duration-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-secondary dark:text-light-secondary uppercase tracking-wider transition-colors duration-200">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-secondary dark:text-light-secondary uppercase tracking-wider transition-colors duration-200">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-secondary dark:text-light-secondary uppercase tracking-wider transition-colors duration-200">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-secondary dark:text-light-secondary uppercase tracking-wider transition-colors duration-200">
                  Last Sign In
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-dark-secondary dark:text-light-secondary uppercase tracking-wider transition-colors duration-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand text-white flex items-center justify-center">
                        {user.display_name?.[0]?.toUpperCase() || user.email[0]?.toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-dark dark:text-light transition-colors duration-200">
                          {user.display_name || user.email.split('@')[0]}
                        </div>
                        <div className="text-sm text-dark-secondary dark:text-light-secondary transition-colors duration-200">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        : user.role === 'editor'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    } transition-colors duration-200`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-secondary dark:text-light-secondary transition-colors duration-200">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-secondary dark:text-light-secondary transition-colors duration-200">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditUser(user.id)}
                      className="text-brand hover:text-brand-dark mr-4 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-dark-secondary dark:text-light-secondary transition-colors duration-200">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit User Modal */}
      {editingUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 max-w-md w-full mx-4 transition-colors duration-200">
            <h2 className="text-xl font-semibold text-dark dark:text-light mb-4 transition-colors duration-200">
              Edit User
            </h2>
            
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark dark:text-light mb-1 transition-colors duration-200">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editUserDisplayName}
                  onChange={(e) => setEditUserDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark shadow-sm focus:border-brand focus:ring-brand focus:ring-2 focus:outline-none text-dark dark:text-light transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark dark:text-light mb-1 transition-colors duration-200">
                  Role
                </label>
                <select
                  value={editUserRole}
                  onChange={(e) => setEditUserRole(e.target.value as 'admin' | 'editor' | 'viewer')}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark shadow-sm focus:border-brand focus:ring-brand focus:ring-2 focus:outline-none text-dark dark:text-light transition-colors duration-200"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  onClick={resetEditForm}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2"
                >
                  {isLoading ? 'Updating...' : 'Update User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 