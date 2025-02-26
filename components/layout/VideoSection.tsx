"use client";

import { useState, useRef, useEffect } from 'react';
import { PlayButton } from '@/components/ui/PlayButton';

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
  height = "h-screen",
  className = ""
}: VideoSectionProps) {
  // Debug the URLs
  console.log('VideoSection - backgroundVideoUrl:', backgroundVideoUrl);
  console.log('VideoSection - popupVideoUrl:', popupVideoUrl);
  
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const popupVideoRef = useRef<HTMLVideoElement>(null);
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
      <section className={`relative w-full ${height} bg-black overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 animate-pulse rounded-full bg-white/20"></div>
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

  return (
    <section className={`relative w-full ${height} bg-black overflow-hidden ${className}`}>
      {/* Background video */}
      <video 
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover" 
        autoPlay 
        loop 
        muted
        playsInline
      >
        <source src={backgroundVideoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Gradient overlay - lighter for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent z-10"></div>
      
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
            {isEmbedVideo ? (
              // Embedded iframe for YouTube or Vimeo
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={embedUrl}
                  title="Video Player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              // Direct video file
              <video 
                ref={popupVideoRef}
                controls 
                autoPlay 
                className="w-full h-auto"
              >
                <source src={popupVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}
    </section>
  );
} 