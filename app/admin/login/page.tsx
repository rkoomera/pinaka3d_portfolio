'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

// Separate component that uses useSearchParams
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo') || '/admin';
  // Check if we're coming from a redirect to prevent loops
  const fromRedirect = searchParams?.get('from') === 'auth';
  
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (hasRedirected || fromRedirect) {
        // Skip auth check if we're coming from a redirect or already redirected
        setIsCheckingAuth(false);
        return;
      }
      
      try {
        setIsCheckingAuth(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth status:', error);
        } else if (data.session) {
          // If already logged in, redirect to admin dashboard
          setHasRedirected(true);
          router.push(redirectTo);
        }
      } catch (err: unknown) {
        console.error('Unexpected error checking auth:', err);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [supabase.auth, router, redirectTo, hasRedirected, fromRedirect]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error from Supabase:', error);
        throw error;
      }
      
      if (data.session) {
        console.log('Login successful, session:', data.session.access_token.slice(0, 10) + '...');
        console.log('User ID:', data.user?.id);
        console.log('Redirecting to:', redirectTo);
        
        // Set hasRedirected to prevent further redirects
        setHasRedirected(true);
        
        // Use window.location for a full page refresh to ensure session is properly recognized
        window.location.href = redirectTo;
      } else {
        console.error('No session returned after login');
        throw new Error('No session returned after login');
      }
    } catch (err: unknown) {
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
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-8 transition-colors duration-200">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-dark dark:text-light mb-2 transition-colors duration-200">
          Admin Login
        </h1>
        <p className="text-dark-secondary dark:text-light-secondary transition-colors duration-200">
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
            className="block text-sm font-medium text-dark dark:text-light mb-2 transition-colors duration-200"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark shadow-sm focus:border-brand focus:ring-brand focus:ring-2 focus:outline-none text-dark dark:text-light transition-colors duration-200"
            placeholder="your.email@example.com"
          />
        </div>
        
        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-dark dark:text-light mb-2 transition-colors duration-200"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark shadow-sm focus:border-brand focus:ring-brand focus:ring-2 focus:outline-none text-dark dark:text-light transition-colors duration-200"
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
    </div>
  );
}

// Loading fallback for Suspense
function LoginFormLoading() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-8 transition-colors duration-200">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-dark dark:text-light mb-2 transition-colors duration-200">
          Admin Login
        </h1>
        <p className="text-dark-secondary dark:text-light-secondary transition-colors duration-200">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Section className="flex items-center justify-center min-h-screen bg-light dark:bg-dark transition-colors duration-200">
      <Container size="sm">
        <Suspense fallback={<LoginFormLoading />}>
          <LoginForm />
        </Suspense>
      </Container>
    </Section>
  );
} 