"use client";

import { ReactNode, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { trackResource } from '@/lib/resourceLoader';

// List of critical assets - removed font reference since Next.js handles fonts
const CRITICAL_ASSETS = [
  '/favicon.ico'
];

interface AnimatedLayoutProps {
  children: ReactNode;
}

export default function AnimatedLayout({ children }: AnimatedLayoutProps) {
  // Track important assets
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Track critical assets
    CRITICAL_ASSETS.forEach(asset => {
      fetch(asset, { method: 'HEAD' })
        .then(() => {
          trackResource(asset, 1).complete();
        })
        .catch(() => {
          trackResource(asset, 1).error();
        });
    });
    
    // Track the main bundle
    trackResource('main-bundle', 3).complete();
    
    // Ensure all resources are marked as loaded when the document is fully loaded
    window.addEventListener('load', () => {
      // Add a slight delay to ensure all resources are loaded
      setTimeout(() => {
        document.documentElement.classList.add('loaded');
      }, 100);
    });
  }, []);
  
  return (
    <LoadingScreen
      minimumLoadingTime={1000}
      additionalResources={[
        { id: 'user-interaction', weight: 1 },
        { id: 'animation-prep', weight: 1 }
      ]}
    >
      {children}
    </LoadingScreen>
  );
} 