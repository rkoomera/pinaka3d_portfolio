'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { User } from '@/lib/services/auth';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

interface AdminNavProps {
  user: User;
}

export function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Create Supabase client
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/contact/unread');
        const data = await response.json();
        if (response.ok) {
          setUnreadCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };
    
    fetchUnreadCount();
    
    // Set up polling to check for new messages every minute
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Close the user menu when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple sign-out attempts
    
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      
      // Clear any local storage or cookies
      localStorage.removeItem('supabase.auth.token');
      
      // Use window.location for a full page refresh to the login page
      window.location.href = '/admin/login?from=auth';
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
      setIsSigningOut(false);
    }
  };
  
  const navItems = [
    { label: 'Dashboard', path: '/admin' },
    { 
      label: 'Messages', 
      path: '/admin/messages',
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { label: 'Projects', path: '/admin/projects' },
  ];
  
  // If there's an error, show a minimal version with error message
  if (error) {
    return (
      <nav className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
              Admin
            </Link>
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </nav>
    );
  }
  
  // If user is missing or invalid, show debug info
  if (!user || !user.email) {
    return (
      <nav className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
              Admin
            </Link>
            <div className="text-red-500">Error: Invalid user data</div>
          </div>
        </div>
      </nav>
    );
  }
  
  return (
    <nav className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/admin" className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
              Admin
            </Link>
            
            <div className="ml-8 flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    pathname === item.path
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:text-brand hover:dark:text-brand'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
          
          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 text-gray-900 dark:text-white hover:text-brand dark:hover:text-brand transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center">
                {user.display_name?.[0]?.toUpperCase() || user.email[0]?.toUpperCase()}
              </div>
              <span className="hidden md:inline-block">{user.display_name || user.email.split('@')[0]}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10 transition-colors duration-200">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.display_name || user.email.split('@')[0]}</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">{user.email}</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">Role: {user.role}</p>
                </div>
                
                <Link
                  href="/admin/users"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  User Settings
                </Link>
                
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 