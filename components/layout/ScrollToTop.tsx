'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type ScrollToTopProps = {
  showButton?: boolean;
  threshold?: number;
};

export function ScrollToTop({ 
  showButton = false,
  threshold = 300 
}: ScrollToTopProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  // Scroll to top on page change
  useEffect(() => {
    // Scroll to top with smooth behavior
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  // Show/hide button based on scroll position
  useEffect(() => {
    if (!showButton) return;

    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showButton, threshold]);

  // Handle button click
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // If button is not shown or not visible, component doesn't render anything
  if (!showButton || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a 
        href="#top" 
        onClick={(e) => {
          e.preventDefault();
          scrollToTop();
        }}
        className="block w-12 h-12 rounded-full bg-brand text-white shadow-lg hover:bg-brand-dark transition-colors"
        aria-label="Scroll to top"
        data-hover
      >
        <div data-hover-bounds className="absolute inset-0 pointer-events-none"></div>
        <div className="flex items-center justify-center w-full h-full">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </div>
      </a>
    </div>
  );
} 