// components/portfolio/FeaturedProjects.tsx
'use client';

import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Project } from '@/types';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

// Fallback video URL in case a project doesn't have a background video
const FALLBACK_VIDEO_URL = "https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-videos//demo-reel-bg.mp4";

// Helper to detect mobile devices more reliably
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

interface FeaturedProjectsProps {
  projects: Project[];
  showHeading?: boolean;
  showViewAllButton?: boolean;
  background?: 'light' | 'light-secondary' | 'dark' | 'dark-secondary' | 'accent' | 'brand';
  layout?: 'single' | 'grid';
  limit?: number;
}

export function FeaturedProjects({ 
  projects, 
  showHeading = true, 
  showViewAllButton = true,
  background = 'light-secondary',
  layout = 'single',
  limit
}: FeaturedProjectsProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  // Apply limit if specified
  const displayedProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <Section background={background}>
      {showHeading && (
        <div>
          <SectionHeading 
            title="Featured Projects" 
            subtitle="Selected works that showcase my design and development skills"
            centered
          />
        </div>
      )}
      
      {layout === 'single' ? (
        // Single column layout
        <div className="mt-12 space-y-16">
          {displayedProjects.map((project) => (
            <ProjectRow 
              key={project.id} 
              project={project}
            />
          ))}
        </div>
      ) : (
        // Grid layout
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {displayedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      )}
      
      {showViewAllButton && (
        <div className="mt-16 text-center">
          <Button href="/projects" variant="outline">
            View All Projects
          </Button>
        </div>
      )}
    </Section>
  );
}

// Component for single-column layout
interface ProjectRowProps {
  project: Project;
}

function ProjectRow({ project }: ProjectRowProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Get the video URL from the project's background_video_url field, or use fallback if not available
  const videoUrl = project.background_video_url || FALLBACK_VIDEO_URL;
  
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovering(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovering(false);
    }
  };

  // Check if device is mobile
  useEffect(() => {
    // Initial check using both width and user agent
    const checkIfMobile = () => {
      setIsMobile(isMobileDevice());
    };
    
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Set initial video visibility based on mobile detection
  useEffect(() => {
    setIsVideoVisible(isMobile);
  }, [isMobile]);

  // Control video playback based on hover state or mobile
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (isHovering || isMobile) {
      setIsVideoVisible(true);
      
      // Use a promise to handle play() which returns a promise
      const playPromise = videoElement.play();
      
      // Handle potential play() promise rejection
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Auto-play was prevented:', error);
          // Still show the video even if autoplay is prevented
          setIsVideoVisible(true);
        });
      }
    } else if (!isMobile) {
      videoElement.pause();
      setIsVideoVisible(false);
    }
  }, [isHovering, isMobile]);

  return (
    <div className="group">
      <Link 
        href={`/projects/${project.slug}`}
        className="block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative md:aspect-[16/7] aspect-[16/9] w-full overflow-hidden rounded-lg">
          {/* Background Video - using project's background_video_url */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
            src={videoUrl}
            muted
            playsInline
            loop
            autoPlay={isMobile}
            preload="metadata"
            style={{ opacity: isVideoVisible ? 1 : 0 }}
          />
          
          {/* Thumbnail Image (shown when video is not playing) */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300" 
            style={{ 
              backgroundImage: `url(${project.thumbnail_url})`,
              opacity: isVideoVisible ? 0 : 1
            }}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
          
          {/* Project info */}
          <div className="absolute bottom-0 left-0 p-6 text-white dark:text-white">
            <h3 className="text-2xl font-bold">{project.title}</h3>
            <p className="mt-2 text-lg text-white/80 dark:text-white/80">{project.subtitle}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Component for grid layout
interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Get the video URL from the project's background_video_url field, or use fallback if not available
  const videoUrl = project.background_video_url || FALLBACK_VIDEO_URL;
  
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovering(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovering(false);
    }
  };

  // Check if device is mobile
  useEffect(() => {
    // Initial check using both width and user agent
    const checkIfMobile = () => {
      setIsMobile(isMobileDevice());
    };
    
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Set initial video visibility based on mobile detection
  useEffect(() => {
    setIsVideoVisible(isMobile);
  }, [isMobile]);

  // Control video playback based on hover state or mobile
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (isHovering || isMobile) {
      setIsVideoVisible(true);
      
      // Use a promise to handle play() which returns a promise
      const playPromise = videoElement.play();
      
      // Handle potential play() promise rejection
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Auto-play was prevented:', error);
          // Still show the video even if autoplay is prevented
          setIsVideoVisible(true);
        });
      }
    } else if (!isMobile) {
      videoElement.pause();
      setIsVideoVisible(false);
    }
  }, [isHovering, isMobile]);

  return (
    <div className="group">
      <Link 
        href={`/projects/${project.slug}`}
        className="block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
          {/* Background Video */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
            src={videoUrl}
            muted
            playsInline
            loop
            autoPlay={isMobile}
            preload="metadata"
            style={{ opacity: isVideoVisible ? 1 : 0 }}
          />
          
          {/* Thumbnail Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300" 
            style={{ 
              backgroundImage: `url(${project.thumbnail_url})`,
              opacity: isVideoVisible ? 0 : 1
            }}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
          
          {/* Project info */}
          <div className="absolute bottom-0 left-0 p-4 text-white dark:text-white">
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p className="mt-1 text-sm text-white/80 dark:text-white/80">{project.subtitle}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}