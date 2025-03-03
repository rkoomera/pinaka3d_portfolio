import { motion } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

type PageTransitionProps = {
  children: ReactNode;
  effect?: 'fade' | 'slide' | 'scale' | 'none';
};

// Framer Motion variants
const fadeVariants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 }
};

const slideVariants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  enter: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 }
};

export function PageTransition({ children, effect = 'fade' }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Select the appropriate variants based on the effect
  const getVariants = () => {
    switch (effect) {
      case 'slide':
        return slideVariants;
      case 'scale':
        return scaleVariants;
      case 'none':
        return {};
      case 'fade':
      default:
        return fadeVariants;
    }
  };

  // Optional GSAP animation for more complex effects
  useGSAP(() => {
    if (containerRef.current && effect !== 'none') {
      gsap.fromTo(
        containerRef.current,
        { autoAlpha: 0 },
        { 
          autoAlpha: 1, 
          duration: 0.5,
          clearProps: 'all',
          ease: 'power2.out'
        }
      );
    }
  }, [effect]);

  return (
    <motion.div
      ref={containerRef}
      variants={getVariants()}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ 
        type: 'tween', 
        ease: 'easeInOut',
        duration: 0.4
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
} 