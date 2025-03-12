'use client';

import { useEffect, useState } from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { useRouter, usePathname } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createSupabaseBrowserClient();

  // Check if user is authenticated and store the user data
  useEffect(() => {
    async function checkAuth() {
      try {
        console.log('Admin layout - checking auth for path:', pathname);
        
        // Skip auth check for login page
        if (pathname === '/admin/login') {
          setLoading(false);
          return;
        }
        
        // First check Supabase session directly
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Supabase auth error:', error);
          setAuthError('Authentication error: ' + error.message);
          router.replace('/admin/login?from=' + encodeURIComponent(pathname || '/admin'));
          return;
        }
        
        if (!data.session) {
          console.log('No session found, redirecting to login');
          setAuthError('Authentication required');
          router.replace('/admin/login?from=' + encodeURIComponent(pathname || '/admin'));
          return;
        }
        
        // Session exists, get user data
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          console.error('User data error:', userError?.message || 'No user found');
          setAuthError('User data error');
          router.replace('/admin/login');
          return;
        }
        
        // Successfully authenticated
        setUser({
          id: userData.user.id,
          email: userData.user.email,
          role: userData.user.app_metadata?.role || 'user',
          display_name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0]
        });
        setAuthError(null);
        console.log('Admin layout - auth successful');
      } catch (err) {
        console.error('Error checking auth in admin layout:', err);
        setAuthError('Error checking authentication');
        router.replace('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, [pathname, router, supabase.auth]);

  if (loading) {
    return (
      <div className="admin-page min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-950 transition-colors duration-200">
        <div className="text-2xl font-semibold mb-4">Loading...</div>
        <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // For login page, don't show the admin nav
  if (pathname === '/admin/login') {
    return (
      <div className="admin-page min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950 transition-colors duration-200">
        <main className="flex-grow">
          {children}
        </main>
      </div>
    );
  }
  
  // If we're not on login page and there's an auth error, show error state
  if (authError && pathname !== '/admin/login') {
    return (
      <div className="admin-page min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-950 transition-colors duration-200">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
          <div className="text-2xl font-semibold mb-4 text-red-600 dark:text-red-400">Authentication Error</div>
          <p className="mb-6 text-gray-700 dark:text-gray-300">{authError}</p>
          <button 
            onClick={() => router.push('/admin/login')}
            className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="admin-page min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950 transition-colors duration-200">
      {user && <AdminNav user={user} />}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
} 