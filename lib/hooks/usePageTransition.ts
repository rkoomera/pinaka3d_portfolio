'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';

type TransitionOptions = {
  delay?: number;
  onBeforeTransition?: () => void;
  onAfterTransition?: () => void;
  effect?: 'fade' | 'slide' | 'zoom' | 'flip' | 'none';
};

export function usePageTransition() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentEffect, setCurrentEffect] = useState<TransitionOptions['effect']>('fade');

  // Navigate to a new page with transition effects
  const navigateTo = useCallback((
    url: string, 
    options: TransitionOptions = {}
  ) => {
    const { 
      delay = 300, 
      onBeforeTransition, 
      onAfterTransition,
      effect = 'fade'
    } = options;

    // Update the current effect
    setCurrentEffect(effect);
    
    // Start transition
    setIsTransitioning(true);
    
    // Call the before transition callback if provided
    if (onBeforeTransition) {
      onBeforeTransition();
    }

    // Save scroll position for back navigation
    if (typeof window !== 'undefined') {
      const scrollPosition = window.scrollY;
      sessionStorage.setItem(`scrollPos-${window.location.pathname}`, scrollPosition.toString());
    }

    // Delay the navigation to allow for exit animations
    setTimeout(() => {
      router.push(url);
      
      // Reset the transitioning state after a short delay
      setTimeout(() => {
        setIsTransitioning(false);
        
        // Call the after transition callback if provided
        if (onAfterTransition) {
          onAfterTransition();
        }
      }, 100);
    }, delay);
  }, [router]);

  // Restore scroll position when navigating back
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handlePopState = () => {
        const scrollPos = sessionStorage.getItem(`scrollPos-${window.location.pathname}`);
        if (scrollPos) {
          setTimeout(() => {
            window.scrollTo(0, parseInt(scrollPos, 10));
          }, 100);
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, []);

  return {
    navigateTo,
    isTransitioning,
    currentEffect
  };
} 