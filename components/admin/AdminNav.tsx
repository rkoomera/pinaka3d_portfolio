'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { User } from '@/lib/services/auth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

interface AdminNavProps {
  user: User;
}

export function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Create Supabase client
  const supabase = createClientComponentClient<Database>();
  
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
    try {
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
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
      <nav className="bg-light dark:bg-dark border-b border-light-border dark:border-dark-border transition-colors duration-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="text-xl font-bold text-dark dark:text-light transition-colors duration-200">
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
      <nav className="bg-light dark:bg-dark border-b border-light-border dark:border-dark-border transition-colors duration-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="text-xl font-bold text-dark dark:text-light transition-colors duration-200">
              Admin
            </Link>
            <div className="text-red-500">Error: Invalid user data</div>
          </div>
        </div>
      </nav>
    );
  }
  
  return (
    <nav className="bg-light dark:bg-dark border-b border-light-border dark:border-dark-border transition-colors duration-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/admin" className="text-xl font-bold text-dark dark:text-light transition-colors duration-200">
              Admin
            </Link>
            
            <div className="ml-8 flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    pathname === item.path
                      ? 'bg-light-secondary dark:bg-dark-secondary text-dark dark:text-light'
                      : 'text-text-light dark:text-light-secondary hover:text-brand hover:dark:text-brand'
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
              className="flex items-center space-x-2 text-dark dark:text-light hover:text-brand dark:hover:text-brand transition-colors duration-200"
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
              <div className="absolute right-0 mt-2 w-48 py-2 bg-light dark:bg-dark-card rounded-md shadow-lg border border-light-border dark:border-dark-border z-10 transition-colors duration-200">
                <div className="px-4 py-2 border-b border-light-border dark:border-dark-border">
                  <p className="text-sm font-medium text-dark dark:text-light">{user.display_name || user.email.split('@')[0]}</p>
                  <p className="text-xs text-text-light dark:text-light-secondary">{user.email}</p>
                  <p className="text-xs text-text-light dark:text-light-secondary mt-1">Role: {user.role}</p>
                </div>
                
                <Link
                  href="/admin/users"
                  className="block px-4 py-2 text-sm text-text-light dark:text-light-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors duration-200"
                >
                  User Settings
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 