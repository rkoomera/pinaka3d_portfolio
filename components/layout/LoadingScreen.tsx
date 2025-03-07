'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/theme/ThemeProvider';
import resourceRegistry from '@/lib/resourceLoader';

interface LoadingScreenProps {
  children: React.ReactNode;
  minimumLoadingTime?: number; // Minimum time to show loading screen in ms
  additionalResources?: Array<{ id: string; weight?: number }>;
}

export function LoadingScreen({ 
  children, 
  minimumLoadingTime = 1800,
  additionalResources = []
}: LoadingScreenProps) {
  // Key to force complete remounting when resources change
  const loadingKey = JSON.stringify(additionalResources);
  
  return (
    <LoadingScreenImpl 
      key={loadingKey}
      minimumLoadingTime={minimumLoadingTime} 
      additionalResources={additionalResources}
    >
      {children}
    </LoadingScreenImpl>
  );
}

// Internal implementation - remounts completely when additionalResources change
function LoadingScreenImpl({ 
  children, 
  minimumLoadingTime = 1800,
  additionalResources = []
}: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [resourceStatus, setResourceStatus] = useState<{
    pending: number;
    loading: number;
    loaded: number;
    error: number;
  }>({ pending: 0, loading: 0, loaded: 0, error: 0 });
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const progressValueRef = useRef(0); // Store current progress in a ref for consistency
  const minTimeElapsedRef = useRef(false);
  const { theme } = useTheme();
  
  // Determine background color based on theme
  const bgClass = theme === 'dark' ? 'bg-gray-950' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  
  // Custom progress setter that ensures we only go forward
  const safeSetProgress = (newProgress: number) => {
    if (newProgress > progressValueRef.current) {
      progressValueRef.current = newProgress;
      setProgress(newProgress);
    }
  };
  
  // Loading logic - completely reset on each mount
  useEffect(() => {
    // Force reset everything at the beginning of each load
    progressValueRef.current = 0;
    setProgress(0);
    
    const resetRegistry = async () => {
      // Wait for a micro-task to ensure DOM is ready
      await Promise.resolve();
      try {
        // Attempt to reset the registry
        resourceRegistry.reset();
      } catch (e) {
        console.warn('Could not reset resource registry', e);
      }
    };
    
    // Reset registry before starting
    resetRegistry().then(() => {
      // Register additional resources AFTER reset
      additionalResources.forEach(resource => {
        resourceRegistry.registerResource(resource.id, resource.weight);
      });
      
      // Add progress listener AFTER registration
      const cleanup = resourceRegistry.addProgressListener((resourceProgress) => {
        // Use the safe setter to ensure we never go backward
        // Delay any progress updates to allow animation to show progression from 0
        setTimeout(() => {
          const newProgress = Math.round(resourceProgress);
          safeSetProgress(newProgress);
          setResourceStatus(resourceRegistry.getResourceCounts());
        }, 50);
      });
      
      // Simulate gradual progress while resources are loading
      let simulatedProgress = 0;
      progressInterval.current = setInterval(() => {
        // Calculate how much to increment based on current progress
        // Slower increments as we get higher
        let increment = 0;
        if (simulatedProgress < 20) {
          increment = Math.random() * 3; // Faster at beginning
        } else if (simulatedProgress < 50) {
          increment = Math.random() * 1.5; // Medium in middle
        } else if (simulatedProgress < 90) {
          increment = Math.random() * 0.7; // Slower near end
        }
        
        // Only update if we're not at the max simulated progress
        if (simulatedProgress < 90) {
          simulatedProgress += increment;
          
          // Use our safe progress setter for consistent updates
          const newProgress = Math.min(Math.round(simulatedProgress), 90);
          safeSetProgress(newProgress);
        }
      }, 200);
      
      // Set minimum loading time
      const timeoutId = setTimeout(() => {
        minTimeElapsedRef.current = true;
        checkIfComplete();
        
        // Clear the starter progress interval
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
          progressInterval.current = null;
        }
      }, minimumLoadingTime);
      
      // Function to check if loading is complete
      const checkIfComplete = () => {
        const allResourcesLoaded = resourceRegistry.areAllResourcesLoaded();
        
        if (allResourcesLoaded && minTimeElapsedRef.current) {
          // Quickly animate to 100% when loaded completely
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
            progressInterval.current = null;
          }
          
          // Animate to 100% smoothly
          let finalProgress = Math.max(progressValueRef.current, 90);
          const finalInterval = setInterval(() => {
            if (finalProgress < 100) {
              finalProgress += 2;
              safeSetProgress(Math.min(finalProgress, 100));
            } else {
              clearInterval(finalInterval);
              // Small delay to show 100% before hiding
              setTimeout(() => {
                setIsLoading(false);
              }, 600);
            }
          }, 50);
        }
      };
      
      // Check every 300ms if all resources are loaded
      const checkInterval = setInterval(checkIfComplete, 300);
      
      // Ensure progress hits at least 100 after a reasonable timeout (fail-safe)
      const maxLoadingTimeout = setTimeout(() => {
        // Animate to 100% smoothly instead of jumping
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
          progressInterval.current = null;
        }
        
        let currentProgress = progressValueRef.current;
        const finalInterval = setInterval(() => {
          if (currentProgress < 100) {
            currentProgress += 2;
            safeSetProgress(Math.min(currentProgress, 100));
          } else {
            clearInterval(finalInterval);
            setTimeout(() => {
              setIsLoading(false);
            }, 600);
          }
        }, 50);
      }, 12000); // 12 seconds max loading time
      
      return () => {
        cleanup();
        clearTimeout(timeoutId);
        clearTimeout(maxLoadingTimeout);
        clearInterval(checkInterval);
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      };
    });
  }, []); // Empty dependency array to run only once per mount
  
  // Prevent scrolling when loading screen is active
  useEffect(() => {
    if (isLoading) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Apply fixed positioning to body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scrolling
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }
    
    return () => {
      // Clean up when component unmounts
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isLoading]);
  
  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
            }}
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${bgClass} transition-colors duration-300`}
          >
            <div className="flex flex-col items-center w-full max-w-xl px-6">
              {/* Big thick progress bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.2, duration: 0.6 }
                }}
                className="w-full"
              >
                <div className={`h-24 md:h-32 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden transition-colors duration-300`}>
                  <motion.div 
                    className="h-full bg-brand"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
} 