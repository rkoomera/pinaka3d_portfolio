'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { AdvancedPageTransition } from '@/components/layout/AdvancedPageTransition';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { PageLoadingIndicator } from '@/components/layout/PageLoadingIndicator';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  
  return (
    <>
      {/* Add loading indicator at the top of the page */}
      <PageLoadingIndicator />
      
      {/* Add scroll to top functionality with visible button */}
      <ScrollToTop showButton={true} threshold={400} />
      
      {/* Wrap content in AnimatePresence for exit animations */}
      <AnimatePresence 
        mode="wait"
        initial={false} // Prevents animation on first render
        onExitComplete={() => window.scrollTo(0, 0)} // Scroll to top after transition completes
      >
        <AdvancedPageTransition 
          key={pathname} 
          transitionType="slide"
        >
          {children}
        </AdvancedPageTransition>
      </AnimatePresence>
    </>
  );
} 