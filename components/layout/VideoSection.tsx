"use client";

import { useState, useRef, useEffect } from 'react';
import { PlayButton } from '@/components/ui/PlayButton';
import gsap from 'gsap';
import { createPortal } from 'react-dom';

interface VideoSectionProps {
  backgroundVideoUrl?: string;
  popupVideoUrl?: string;
  height?: string;
  className?: string;
}

// Helper function to check if a URL is from YouTube
function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

// Helper function to check if a URL is from Vimeo
function isVimeoUrl(url: string): boolean {
  return url.includes('vimeo.com');
}

// Helper function to get YouTube embed URL
function getYouTubeEmbedUrl(url: string): string {
  let videoId = '';
  
  if (url.includes('youtube.com/watch')) {
    // Format: https://www.youtube.com/watch?v=VIDEO_ID
    const urlParams = new URLSearchParams(new URL(url).search);
    videoId = urlParams.get('v') || '';
  } else if (url.includes('youtu.be')) {
    // Format: https://youtu.be/VIDEO_ID
    videoId = url.split('/').pop() || '';
  }
  
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

// Helper function to get Vimeo embed URL
function getVimeoEmbedUrl(url: string): string {
  // Format: https://vimeo.com/VIDEO_ID
  const videoId = url.split('/').pop() || '';
  return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
}

export function VideoSection({ 
  backgroundVideoUrl = "https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-videos//demo-reel-bg.mp4",
  popupVideoUrl = "https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-videos//demo-reel-bg.mp4",
  height = "h-[30vh] sm:h-[70vh] md:h-[80vh] lg:h-screen",
  className = ""
}: VideoSectionProps) {
  // Debug the URLs
  console.log('VideoSection - backgroundVideoUrl:', backgroundVideoUrl);
  console.log('VideoSection - popupVideoUrl:', popupVideoUrl);
  
  const [isMounted, setIsMounted] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const playButtonRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Check if component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle body scroll lock when popup is open
  useEffect(() => {
    if (!isMounted) return;
    
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
        currentVideoRef.play().catch(e => console.log("Auto-play prevented:", e));
      }
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = '';
      if (currentVideoRef && currentVideoRef.paused) {
        currentVideoRef.play().catch(e => console.log("Auto-play prevented:", e));
      }
    };
  }, [showVideoPopup, isMounted]);

  // Handle cursor following effect for play button
  useEffect(() => {
    if (!isMounted || !playButtonRef.current || !sectionRef.current) return;
    
    const playButton = playButtonRef.current;
    const section = sectionRef.current;
    
    // Set initial position
    playButton.style.transform = 'translate(0px, 0px)';
    playButton.style.transition = 'transform 0.3s linear';
    
    // Current position of the button
    let currentX = 0;
    let currentY = 0;
    
    // Target position (where the cursor is)
    let targetX = 0;
    let targetY = 0;
    
    // Drag factor (lower = more drag, higher = less drag)
    const dragFactor = 0.15;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Get section's bounding rectangle
      const rect = section.getBoundingClientRect();
      
      // Calculate mouse position relative to the center of the section
      targetX = e.clientX - rect.left - rect.width / 2;
      targetY = e.clientY - rect.top - rect.height / 2 + 20; // 20px offset below cursor
    };
    
    // Reset position when mouse leaves
    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };
    
    // Animation loop for smooth following with drag
    const animatePosition = () => {
      // Calculate the distance between current and target positions
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      
      // Move current position a percentage of the way to the target (creates drag effect)
      currentX += dx * dragFactor;
      currentY += dy * dragFactor;
      
      // Apply the new position
      playButton.style.transform = `translate(${currentX}px, ${currentY}px)`;
      
      // Continue the animation loop
      requestAnimationFrame(animatePosition);
    };
    
    // Start the animation loop
    const animationId = requestAnimationFrame(animatePosition);
    
    // Add event listeners
    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);
    
    // Cleanup
    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [isMounted]);

  // Handle opening the popup
  const handleOpenPopup = () => {
    document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
    setShowVideoPopup(true);
  };

  // Handle closing the popup with animation
  const handleClosePopup = () => {
    // Start the closing animation
    setIsClosing(true);
    
    // Wait for the animation to complete before hiding the popup
    setTimeout(() => {
      // Only remove from DOM after animation completes
      setShowVideoPopup(false);
      setIsClosing(false);
      document.body.style.overflow = ''; // Re-enable scrolling
    }, 600); // Slightly longer than animation duration to ensure it completes
  };

  // Handle escape key to close popup
  useEffect(() => {
    if (!isMounted) return;
    
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showVideoPopup && !isClosing) {
        handleClosePopup();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [showVideoPopup, isClosing, isMounted]);

  // If not mounted yet (server-side), render a placeholder
  if (!isMounted) {
    return (
      <section className={`relative w-full ${height} bg-gray-100 dark:bg-gray-900 overflow-hidden ${className} transition-colors duration-300`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 animate-pulse rounded-full bg-gray-300 dark:bg-gray-700 transition-colors duration-300"></div>
        </div>
      </section>
    );
  }

  // Determine what type of popup video we have
  const isYouTube = popupVideoUrl ? isYouTubeUrl(popupVideoUrl) : false;
  const isVimeo = popupVideoUrl ? isVimeoUrl(popupVideoUrl) : false;
  const isEmbedVideo = isYouTube || isVimeo;

  // Get the appropriate embed URL if needed
  let embedUrl = '';
  if (isYouTube && popupVideoUrl) {
    embedUrl = getYouTubeEmbedUrl(popupVideoUrl);
  } else if (isVimeo && popupVideoUrl) {
    embedUrl = getVimeoEmbedUrl(popupVideoUrl);
  }

  // Render the popup using a portal to ensure it's positioned relative to the viewport
  const renderVideoPopup = () => {
    if (!showVideoPopup || !isMounted) return null;
    
    return createPortal(
      <div 
        ref={popupRef}
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
        }`}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          visibility: isClosing ? 'visible' : 'visible'
        }}
        onClick={(e) => {
          // Only close if clicking the background, not the video itself
          if (e.target === e.currentTarget) {
            handleClosePopup();
          }
        }}
      >
        <div 
          className={`relative w-full max-w-5xl mx-auto aspect-video px-4 sm:px-6 md:px-8 ${
            isClosing ? 'animate-scaleOut' : 'animate-scaleIn'
          }`}
        >
          {/* Close button */}
          <button 
            ref={closeButtonRef}
            className="absolute -top-12 right-2 text-white hover:text-gray-300 transition-colors z-10"
            onClick={handleClosePopup}
          >
            <div className="relative" data-hover>
              <div data-hover-bounds className="absolute inset-0 pointer-events-none"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </button>

          {/* Video content */}
          <div className="w-full h-full overflow-hidden rounded-lg shadow-2xl">
            {isYouTubeUrl(popupVideoUrl) ? (
              <iframe
                src={getYouTubeEmbedUrl(popupVideoUrl)}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : isVimeoUrl(popupVideoUrl) ? (
              <iframe
                src={getVimeoEmbedUrl(popupVideoUrl)}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                className="w-full h-full"
                controls
                autoPlay
              >
                <source src={popupVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <section 
        ref={sectionRef}
        className={`relative overflow-hidden ${height} ${className} cursor-pointer`}
        onClick={handleOpenPopup}
      >
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={backgroundVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="play-button-container relative z-10 flex items-center justify-center h-full">
          <div 
            ref={playButtonRef} 
            className="transform-gpu touch-manipulation"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenPopup();
            }}
          >
            <PlayButton 
              onClick={handleOpenPopup} 
              size="lg"
              className="touch-manipulation"
            />
          </div>
        </div>
      </section>
      
      {/* Render popup using portal */}
      {renderVideoPopup()}
    </>
  );
} 