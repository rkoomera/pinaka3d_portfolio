'use client';

import { ReactNode, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';

// Register the GSAP plugins
gsap.registerPlugin(useGSAP);

type AdvancedPageTransitionProps = {
  children: ReactNode;
  transitionType?: 'fade' | 'slide' | 'zoom' | 'flip' | 'none';
};

export function AdvancedPageTransition({ 
  children, 
  transitionType = 'fade' 
}: AdvancedPageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  // Create variants based on the current theme to prevent flashing
  const getVariants = () => {
    const variants = {
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.4, ease: "easeInOut" }
      },
      slide: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } // Custom cubic-bezier for elegant motion
      },
      zoom: {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.02 },
        transition: { duration: 0.4, ease: "easeInOut" }
      },
      flip: {
        initial: { opacity: 0, rotateX: 10 },
        animate: { opacity: 1, rotateX: 0 },
        exit: { opacity: 0, rotateX: -10 },
        transition: { duration: 0.4, ease: "easeInOut" }
      },
      none: {
        initial: {},
        animate: {},
        exit: {},
        transition: {}
      }
    };
    
    return variants[transitionType] || variants.fade;
  };
  
  // Use GSAP for additional effects
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const elements = container.querySelectorAll('h1, h2, h3, p, img, button, a, section');
    
    // Reset any existing animations
    gsap.killTweensOf(elements);
    
    // Create a staggered entrance animation for child elements
    if (transitionType !== 'none') {
      gsap.fromTo(
        elements,
        { 
          y: transitionType === 'slide' ? 15 : 8, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.03, 
          duration: 0.4,
          delay: transitionType === 'slide' ? 0.2 : 0.15, // Slightly longer delay for slide to let the main transition complete
          ease: "power2.out"
        }
      );
    }
    
    return () => {
      // Cleanup
      gsap.killTweensOf(elements);
    };
  }, [transitionType]);
  
  // Get the appropriate variants
  const currentVariants = getVariants();
  
  return (
    <motion.div
      ref={containerRef}
      initial={currentVariants.initial}
      animate={currentVariants.animate}
      exit={currentVariants.exit}
      transition={currentVariants.transition}
      className="w-full"
    >
      {children}
    </motion.div>
  );
} 