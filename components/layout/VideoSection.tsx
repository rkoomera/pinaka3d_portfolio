"use client";

import { useState, useRef, useEffect } from 'react';
import { PlayButton } from '@/components/ui/PlayButton';

export function VideoSection() {
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const popupVideoRef = useRef<HTMLVideoElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Handle body scroll lock when popup is open
  useEffect(() => {
    // Store the current video ref value to use in cleanup
    const currentVideoRef = videoRef.current;
    
    if (showVideoPopup) {
      // Disable scrolling
      document.body.style.overflow = 'hidden';
      
      // Pause background video
      if (currentVideoRef) {
        currentVideoRef.pause();
      }
    } else {
      // Re-enable scrolling
      document.body.style.overflow = '';
      
      // Resume background video
      if (currentVideoRef) {
        currentVideoRef.play();
      }
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = '';
      if (currentVideoRef && currentVideoRef.paused) {
        currentVideoRef.play();
      }
    };
  }, [showVideoPopup]);

  // Handle opening the popup
  const handleOpenPopup = () => {
    setIsClosing(false);
    setShowVideoPopup(true);
  };

  // Handle closing the popup with animation
  const handleClosePopup = () => {
    if (popupVideoRef.current) {
      popupVideoRef.current.pause();
    }
    
    setIsClosing(true);
    
    // Wait for animation to complete before hiding the popup
    setTimeout(() => {
      setShowVideoPopup(false);
      setIsClosing(false);
    }, 400); // Match this with the animation duration
  };

  // Handle escape key to close popup
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showVideoPopup && !isClosing) {
        handleClosePopup();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [showVideoPopup, isClosing]);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background video */}
      <video 
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover" 
        autoPlay 
        loop 
        muted
        playsInline
      >
        <source src="https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-videos//demo-reel-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 z-10"></div>
      
      {/* Content container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 text-center">
        {/* Play button */}
        <PlayButton onClick={handleOpenPopup} size="md" />
      </div>

      {/* Video popup with CSS transitions */}
      {showVideoPopup && (
        <div 
          ref={popupRef}
          className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
          onClick={handleClosePopup}
        >
          {/* Close button */}
          <button
            ref={closeButtonRef}
            className={`absolute top-6 right-6 text-white bg-black/80 hover:bg-black/90 rounded-full p-3 z-50 transition-colors shadow-lg ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
            onClick={handleClosePopup}
            aria-label="Close video"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            ref={videoContainerRef}
            className={`bg-black relative max-w-5xl w-full mx-4 shadow-2xl ${isClosing ? 'animate-scaleOut' : 'animate-scaleIn'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Borderless video */}
            <video 
              ref={popupVideoRef}
              controls 
              autoPlay 
              className="w-full h-auto"
            >
              <source src="https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-videos//demo-reel-bg.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </section>
  );
} 