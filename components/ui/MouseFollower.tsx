'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface MouseFollowerProps {
  children: React.ReactNode;
  size?: number;
  delay?: number;
  className?: string;
}

export function MouseFollower({ 
  children, 
  size = 40, 
  delay = 0.1,
  className = ''
}: MouseFollowerProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const followerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <motion.div
      ref={followerRef}
      className={`fixed pointer-events-none z-50 ${className}`}
      style={{ width: size, height: size }}
      animate={{
        x: mousePosition.x - size / 2,
        y: mousePosition.y - size / 2,
      }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 300,
        mass: 0.5,
        delay: delay
      }}
    >
      {children}
    </motion.div>
  );
} 