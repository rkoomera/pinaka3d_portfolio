'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Check if window is available (client-side)
    if (typeof window === 'undefined') {
      return;
    }
    
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);
    
    // Define listener function
    const listener = () => {
      setMatches(media.matches);
    };
    
    // Add listener
    media.addEventListener('change', listener);
    
    // Clean up
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);
  
  // Return false during SSR to prevent hydration mismatch
  return mounted ? matches : false;
} 