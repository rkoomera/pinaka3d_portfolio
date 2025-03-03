'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function PageLoadingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Use a manual approach to track loading state
  useEffect(() => {
    // Set loading to true when navigation starts
    const handleRouteChangeStart = () => {
      setIsLoading(true);
      setProgress(0);
      
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          // Gradually increase progress, but never reach 100% until complete
          const newProgress = prev + (100 - prev) * 0.1;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 100);
      
      return () => clearInterval(interval);
    };

    // Set loading to false when navigation completes
    const handleRouteChangeComplete = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
    };

    // Listen for clicks on anchor tags
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.href && !anchor.href.startsWith('javascript:') && 
          !anchor.href.startsWith('#') && !anchor.target && !e.ctrlKey && !e.metaKey) {
        const startLoading = handleRouteChangeStart();
        
        // Set a timeout to stop loading if navigation doesn't happen
        setTimeout(() => {
          handleRouteChangeComplete();
          if (startLoading) startLoading();
        }, 3000);
      }
    };

    document.addEventListener('click', handleLinkClick);
    
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  // Reset loading state when the route changes
  useEffect(() => {
    setIsLoading(false);
    setProgress(0);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-brand via-brand-light to-brand"
          initial={{ width: '0%', opacity: 1 }}
          animate={{ 
            width: `${progress}%`,
            opacity: 1
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            width: { duration: 0.3, ease: 'easeOut' },
            opacity: { duration: 0.2 }
          }}
        />
      )}
    </AnimatePresence>
  );
} 