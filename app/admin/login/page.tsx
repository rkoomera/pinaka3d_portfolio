'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';

export const dynamic = 'force-dynamic';

// Check if a cookie exists
function hasCookie(name: string): boolean {
  return document.cookie.split(';').some(c => c.trim().startsWith(name + '='));
}

// Separate component that uses useSearchParams
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams?.get('from') || '/admin';
  
  const supabaseRef = useRef<any>(null);
  
  // Check auth status on mount
  useEffect(() => {
    // Create Supabase client only in the browser to avoid build-time env access
    if (typeof window !== 'undefined') {
      try {
        supabaseRef.current = createSupabaseBrowserClient();
      } catch (e) {
        console.error('Failed to create Supabase client in browser:', e);
        setError('Configuration error. Please contact the administrator.');
        setIsCheckingAuth(false);
        return;
      }
    }

    const checkAuth = async () => {
      try {
        // Check if auth cookies exist
        const hasSupabaseCookie = hasCookie('sb-access-token') || hasCookie('sb-refresh-token');
        setDebugInfo(prev => prev + `\nCookies present: ${hasSupabaseCookie}`);

        const { data, error } = await supabaseRef.current?.auth.getSession();
        
        if (error) {
          console.error('Error checking auth status:', error);
          setError('Error checking authentication status');
          setDebugInfo(prev => prev + `\nSession error: ${error.message}`);
        } else if (data.session) {
          setDebugInfo(prev => prev + `\nSession found: ${data.session.access_token.slice(0, 10)}...`);
          // Session exists, redirect to admin
          router.push(from);
          return;
        } else {
          setDebugInfo(prev => prev + `\nNo session found`);
        }
      } catch (err) {
        console.error('Unexpected error checking auth:', err);
        setDebugInfo(prev => prev + `\nUnexpected error: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, from]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login with email:', email);
      setDebugInfo('Login attempt started');
      
      const { data, error } = await supabaseRef.current?.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error from Supabase:', error);
        setDebugInfo(prev => prev + `\nLogin error: ${error.message}`);
        throw error;
      }
      
      if (data.session) {
        console.log('Login successful, redirecting...');
        setDebugInfo(prev => prev + `\nLogin successful, session: ${data.session.access_token.slice(0, 10)}...`);
        
        // Check if cookies were set after login
        const hasSupabaseCookie = hasCookie('sb-access-token') || hasCookie('sb-refresh-token');
        setDebugInfo(prev => prev + `\nCookies after login: ${hasSupabaseCookie}`);
        
        // Use window location for hard reload to ensure cookies are properly initialized
        window.location.href = from;
      } else {
        console.error('No session returned after login');
        setDebugInfo(prev => prev + '\nNo session returned after login');
        throw new Error('No session returned after login');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isCheckingAuth) {
    return <LoginFormLoading />;
  }
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 transition-colors duration-200">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
          Admin Login
        </h1>
        <p className="text-gray-700 dark:text-gray-300 transition-colors duration-200">
          Sign in to access the admin dashboard
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md transition-colors duration-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 shadow-sm focus:border-brand focus:ring-brand focus:ring-2 focus:outline-none text-gray-900 dark:text-white transition-colors duration-200"
            placeholder="your.email@example.com"
          />
        </div>
        
        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 shadow-sm focus:border-brand focus:ring-brand focus:ring-2 focus:outline-none text-gray-900 dark:text-white transition-colors duration-200"
            placeholder="••••••••"
          />
        </div>
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-3"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {debugInfo && (
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-mono whitespace-pre-wrap overflow-auto max-h-60">
          <div className="mb-2 font-semibold">Debug Information:</div>
          {debugInfo}
        </div>
      )}
    </div>
  );
}

// Loading fallback for Suspense
function LoginFormLoading() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 transition-colors duration-200">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
          Admin Login
        </h1>
        <p className="text-gray-700 dark:text-gray-300 transition-colors duration-200">
          Loading...
        </p>
      </div>
      <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mt-6"></div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Section className="flex items-center justify-center min-h-screen dark:bg-gray-950" background="white">
      <Container size="sm">
        <Suspense fallback={<LoginFormLoading />}>
          <LoginForm />
        </Suspense>
      </Container>
    </Section>
  );
} 