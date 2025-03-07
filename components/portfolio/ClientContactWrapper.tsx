'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Client component import with no SSR
const ContactForm = dynamic(() => import('@/components/portfolio/ContactForm').then((mod) => mod.ContactForm), {
  ssr: false,
});

export function ClientContactWrapper() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate checking if component loads correctly
    try {
      console.log('ClientContactWrapper mounted');
      setIsLoading(false);
    } catch (err) {
      setError('Error loading contact form: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error in ClientContactWrapper:', err);
      setIsLoading(false);
    }
  }, []);
  
  if (isLoading) {
    return <div className="p-6 rounded bg-gray-100 dark:bg-gray-800">Loading contact form...</div>;
  }
  
  if (error) {
    return (
      <div className="p-6 rounded bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300">
        <h3 className="font-medium mb-2">Error Loading Form</h3>
        <p>{error}</p>
        <p className="mt-4">Please email me directly at example@example.com</p>
      </div>
    );
  }
  
  return <ContactForm />;
} 