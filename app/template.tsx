'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { AdvancedPageTransition } from '@/components/layout/AdvancedPageTransition';
import { PageLoadingIndicator } from '@/components/layout/PageLoadingIndicator';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const { theme } = useTheme();
  
  // Determine background color based on theme
  const bgClass = theme === 'dark' ? 'bg-gray-950' : 'bg-white';
  
  return (
    <div className={`${bgClass} min-h-screen transition-colors duration-300`}>
      {/* Add loading indicator at the top of the page */}
      <PageLoadingIndicator />
      
      {/* Wrap content in AnimatePresence for exit animations */}
      <AnimatePresence 
        mode="wait"
        initial={false} // Prevents animation on first render
        onExitComplete={() => {
          // Scroll to top after transition completes
          window.scrollTo(0, 0);
        }}
      >
        <AdvancedPageTransition 
          key={pathname} 
          transitionType="slide"
        >
          {children}
        </AdvancedPageTransition>
      </AnimatePresence>
    </div>
  );
} 