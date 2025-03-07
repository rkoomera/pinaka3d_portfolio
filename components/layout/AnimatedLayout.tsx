"use client";

import { ReactNode, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { track3DModel, trackResource } from '@/lib/resourceLoader';

// List of critical 3D assets to track
const CRITICAL_3D_ASSETS = [
  'https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/3d-assets//cube1.glb'
];

// List of critical stylesheets and assets
const CRITICAL_ASSETS = [
  '/fonts/montserrat.woff2',
  '/favicon.ico'
];

interface AnimatedLayoutProps {
  children: ReactNode;
}

export default function AnimatedLayout({ children }: AnimatedLayoutProps) {
  // Track important assets
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Track critical 3D models
    CRITICAL_3D_ASSETS.forEach(asset => {
      track3DModel(asset, 4);
    });
    
    // Track other critical assets
    CRITICAL_ASSETS.forEach(asset => {
      const tracker = trackResource(`asset:${asset}`, 2);
      tracker.start();
      
      // Check if asset exists by creating a request
      fetch(asset, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            tracker.complete();
          } else {
            tracker.error();
          }
        })
        .catch(() => {
          tracker.error();
        });
    });
    
    // Track main bundle
    const mainBundleTracker = trackResource('main-bundle', 5);
    mainBundleTracker.start();
    
    // Track React Three Fiber related resources
    const r3fTracker = trackResource('react-three-fiber', 5);
    r3fTracker.start();
    
    // Mark bundles as loaded when everything is complete
    if (document.readyState === 'complete') {
      mainBundleTracker.complete();
      r3fTracker.complete();
    } else {
      window.addEventListener('load', () => {
        mainBundleTracker.complete();
        // Give R3F a bit more time as it often loads after the initial page load
        setTimeout(() => {
          r3fTracker.complete();
        }, 500);
      });
    }
  }, []);
  
  return (
    <LoadingScreen 
      minimumLoadingTime={2000}
      additionalResources={[
        { id: 'user-interaction', weight: 1 },
        { id: 'animation-prep', weight: 2 }
      ]}
    >
      {children}
    </LoadingScreen>
  );
} 