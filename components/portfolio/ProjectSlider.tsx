'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { GalleryImage } from '@/components/admin/ProjectGallery';

interface ProjectSliderProps {
  images: GalleryImage[] | string | null;
  autoplay?: boolean;
  interval?: number;
  showThumbnails?: boolean;
  className?: string;
}

export default function ProjectSlider({ 
  images, 
  autoplay = true, 
  interval = 5000,
  showThumbnails = true,
  className = ''
}: ProjectSliderProps) {
  const [parsedImages, setParsedImages] = useState<GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Parse images if they're in string format
  useEffect(() => {
    if (!images) {
      setParsedImages([]);
      return;
    }
    
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        setParsedImages(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Error parsing images:', error);
        setParsedImages([]);
      }
    } else if (Array.isArray(images)) {
      setParsedImages(images);
    }
  }, [images]);
  
  // Handle autoplay
  useEffect(() => {
    if (!isPlaying || parsedImages.length <= 1) return;
    
    const timer = setInterval(() => {
      goToNextSlide();
    }, interval);
    
    return () => clearInterval(timer);
  }, [isPlaying, currentIndex, parsedImages.length, interval]);
  
  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === parsedImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? parsedImages.length - 1 : prevIndex - 1
    );
  };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // If there are no images, show placeholder
  if (parsedImages.length === 0) {
    return (
      <div className={`relative rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}>
        <div className="aspect-video flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No images available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`relative rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : className}`}>
      {/* Main Image */}
      <div className={`relative ${isFullscreen ? 'h-screen' : 'aspect-video'}`}>
        {parsedImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt || `Project image ${index + 1}`}
              fill
              className="object-contain"
              priority={index === currentIndex}
              sizes={isFullscreen ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
            />
          </div>
        ))}
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center items-center space-x-4">
        {/* Previous button */}
        <button
          onClick={goToPrevSlide}
          className="p-2 rounded-full bg-gray-800/60 text-white hover:bg-gray-800 transition-colors"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-gray-800/60 text-white hover:bg-gray-800 transition-colors"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
        
        {/* Next button */}
        <button
          onClick={goToNextSlide}
          className="p-2 rounded-full bg-gray-800/60 text-white hover:bg-gray-800 transition-colors"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full bg-gray-800/60 text-white hover:bg-gray-800 transition-colors"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Counter */}
      <div className="absolute top-4 right-4 z-20 bg-gray-800/60 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {parsedImages.length}
      </div>
      
      {/* Thumbnails */}
      {showThumbnails && (
        <div className="hidden md:flex absolute bottom-16 left-0 right-0 z-20 justify-center items-center space-x-2 px-4">
          <div className="flex space-x-2 bg-gray-800/60 p-2 rounded-lg overflow-x-auto max-w-full">
            {parsedImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={`relative h-14 w-20 flex-shrink-0 rounded overflow-hidden transition-all ${
                  index === currentIndex ? 'ring-2 ring-brand' : 'opacity-70 hover:opacity-100'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Fullscreen overlay close button */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 left-4 z-30 p-2 rounded-full bg-gray-800/60 text-white hover:bg-gray-800 transition-colors"
          aria-label="Close fullscreen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
} 