// components/ui/VideoPlayer.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PlayButton } from './PlayButton';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  showPlayButton?: boolean;
}

export function VideoPlayer({
  src,
  poster,
  className = '',
  autoPlay = false,
  loop = true,
  muted = true,
  controls = false,
  showPlayButton = true,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch((error) => {
        console.error('Error playing video:', error);
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  return (
    <div className={`relative overflow-hidden rounded-xl shadow-lg ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop={loop}
        muted={muted}
        playsInline
        controls={showControls && controls}
        className="w-full h-full object-cover"
        onEnded={() => setIsPlaying(false)}
      />
      
      {showPlayButton && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 dark:bg-black/40">
          <PlayButton onClick={togglePlay} size="lg" />
        </div>
      )}
    </div>
  );
}