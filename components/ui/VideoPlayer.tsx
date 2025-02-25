// components/ui/VideoPlayer.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'vertical';
}

export function VideoPlayer({ 
  videoUrl, 
  posterUrl,
  className,
  aspectRatio = 'video'
}: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    vertical: 'aspect-[9/16]',
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.pause();
      video.src = ''; // Clear the source
      video.load(); // Reset the video element
    };
  }, [videoUrl]);

  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl bg-black shadow-lg',
      aspectRatioClasses[aspectRatio],
      className
    )}>
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        poster={posterUrl}
        controls // Always show native controls
        playsInline
        preload="metadata"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}