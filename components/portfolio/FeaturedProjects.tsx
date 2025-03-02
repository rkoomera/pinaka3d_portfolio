// components/portfolio/FeaturedProjects.tsx
'use client';

import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Project } from '@/types';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
// Import Swiper and required modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Grid } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';

// Custom styles for Swiper
const swiperStyles = `
  .swiper-container {
    position: relative;
    padding-bottom: 30px;
    width: 100vw !important;
    margin-left: calc(-50vw + 50%) !important;
    left: 0 !important;
    right: 0 !important;
    padding-left: 24px !important;
    padding-right: 0 !important;
  }
  
  .swiper {
    padding: 0 !important; /* Remove padding from swiper */
    overflow: visible !important; /* Make sure overflow is visible to show partial slides */
  }
  
  .swiper-wrapper {
    overflow: visible !important; /* Make sure overflow is visible to show partial slides */
  }
  
  /* Override any container padding */
  .swiper-container-wrapper {
    margin-left: -2rem !important;
    margin-right: -2rem !important;
    width: calc(100% + 4rem) !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  
  @media (min-width: 640px) {
    .swiper-container-wrapper {
      margin-left: -3rem !important;
      margin-right: -3rem !important;
      width: calc(100% + 6rem) !important;
    }
  }
  
  @media (min-width: 768px) {
    .swiper-container-wrapper {
      margin-left: -4rem !important;
      margin-right: -4rem !important;
      width: calc(100% + 8rem) !important;
    }
  }
  
  /* Add responsive padding for the first slide */
  @media (min-width: 640px) {
    .swiper-container {
      padding-left: 24px !important;
    }
  }
  
  @media (min-width: 768px) {
    .swiper-container {
      padding-left: 24px !important;
    }
  }
  
  /* Prevent horizontal scrollbar */
  body {
    overflow-x: hidden;
  }
  
  .swiper-pagination {
    position: relative;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 0;
    width: auto !important;
    height: 16px;
  }
  
  .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
    background-color: rgba(180, 180, 180, 0.5);
    opacity: 0.5;
    transition: all 0.3s ease;
    margin: 0 2px;
  }
  
  .swiper-pagination-bullet-active {
    opacity: 1;
    background-color: #fff;
    transform: scale(1.2);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  }
  
  .dark .swiper-pagination-bullet {
    background-color: rgba(100, 100, 100, 0.5);
  }
  
  .dark .swiper-pagination-bullet-active {
    background-color: #fff;
  }
  
  .swiper-button-prev,
  .swiper-button-next {
    position: relative;
    width: auto;
    height: auto;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Override Swiper's default button styles completely */
  .swiper-container .swiper-button-prev,
  .swiper-container .swiper-button-next {
    position: static !important;
    margin: 0 !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    transform: none !important;
  }
  
  .swiper-button-prev::after,
  .swiper-button-next::after {
    display: none;
  }
  
  /* Custom styles for the navigation arrows */
  .swiper-button-prev svg path,
  .swiper-button-next svg path {
    stroke: #7645fc !important; /* Brand color for light mode */
  }
  
  .dark .swiper-button-prev svg path,
  .dark .swiper-button-next svg path {
    stroke: #5f35d9 !important; /* Brand dark color for dark mode */
  }
`;

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
  background?: 'white' | 'gray-100' | 'gray-900' | 'gray-800' | 'gray-950' | 'accent' | 'brand' | 'projects';
  layout?: 'twoCol' | 'fourCol';
  limit?: number;
  showLayoutToggle?: boolean;
  useSection?: boolean;
  title?: string;
  subtitle?: string;
  showSubtitle?: boolean;
  alignHeadingLeft?: boolean;
  useSwiperOnFourCol?: boolean;
}

export function FeaturedProjects({ 
  projects, 
  showHeading = true, 
  showViewAllButton = true,
  background = 'gray-100',
  layout: initialLayout = 'twoCol',
  limit,
  showLayoutToggle = false,
  useSection = true,
  title = "Featured Projects",
  subtitle = "A selection of my recent work",
  showSubtitle = true,
  alignHeadingLeft = false,
  useSwiperOnFourCol = false
}: FeaturedProjectsProps) {
  const [layout, setLayout] = useState<'twoCol' | 'fourCol'>(initialLayout);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);
  
  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(isMobileDevice());
    };
    
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Force twoCol layout on mobile devices
  useEffect(() => {
    if (isMobile && layout === 'fourCol') {
      setLayout('twoCol');
    }
  }, [isMobile, layout]);
  
  if (!projects || projects.length === 0) {
    return null;
  }

  // Apply limit if specified
  const displayedProjects = limit ? projects.slice(0, limit) : projects;

  // Calculate the number of slides for the slider
  // For 4-column layout, we determine how many slides we need based on screen size
  const getVisibleCards = () => {
    if (typeof window === 'undefined') return 4; // Default for SSR
    if (window.innerWidth >= 1024) return 4; // lg screens
    if (window.innerWidth >= 768) return 3; // md screens
    if (window.innerWidth >= 640) return 2; // sm screens
    return 1; // xs screens
  };
  
  const visibleCards = getVisibleCards();

  const content = (
    <div className="w-full px-0 mx-0">
      {/* Add style tag for Swiper custom styles */}
      <style jsx global>{swiperStyles}</style>
      
      {/* Header section with conditional rendering based on device type */}
      {isMobile ? (
        // Mobile layout - no toggle, centered heading
        showHeading && (
          <div className="mb-8 px-4 sm:px-6 md:px-8">
            <SectionHeading
              title={title}
              subtitle={showSubtitle ? subtitle : undefined}
              centered
              className="mb-4"
            />
          </div>
        )
      ) : (
        // Desktop layout - with toggle if enabled
        <div className="flex justify-between items-center mb-8 px-4 sm:px-6 md:px-8">
          {showHeading && (
            <SectionHeading
              title={title}
              subtitle={showSubtitle ? subtitle : undefined}
              centered={!alignHeadingLeft && !showLayoutToggle}
              className={`${showLayoutToggle ? 'mb-0' : 'mb-4'} ${!showLayoutToggle ? 'w-full' : ''}`}
            />
          )}
          
          {showLayoutToggle && (
            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={() => setLayout('twoCol')}
                className={`p-2 rounded-md transition-colors ${
                  layout === 'twoCol'
                    ? 'bg-brand text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
                aria-label="2-Column Grid"
                title="2-Column Grid"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setLayout('fourCol')}
                className={`p-2 rounded-md transition-colors ${
                  layout === 'fourCol'
                    ? 'bg-brand text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
                aria-label="4-Column Grid"
                title="4-Column Grid"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Projects grid/list */}
      {layout === 'twoCol' || !useSwiperOnFourCol ? (
        // Two column layout or four column grid (when not using Swiper)
        <div className={`px-4 sm:px-6 md:px-8 grid grid-cols-1 ${layout === 'twoCol' ? 'md:grid-cols-2' : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-8 auto-rows-fr`}>
          {displayedProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              layout={layout}
            />
          ))}
        </div>
      ) : (
        // Four column layout with Swiper (only on Projects page)
        <div className="relative overflow-hidden w-full px-0 mx-0 swiper-container-wrapper">
          <div className="swiper-container">
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              modules={[Navigation, A11y, Grid]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                  grid: {
                    rows: 1,
                    fill: 'row'
                  }
                },
                768: {
                  slidesPerView: 2.5,
                  grid: {
                    rows: 1,
                    fill: 'row'
                  }
                },
                1024: {
                  slidesPerView: 3.5,
                  grid: {
                    rows: 1,
                    fill: 'row'
                  }
                }
              }}
              loop={true}
              grabCursor={true}
              onSlideChange={(swiper) => {
                setCurrentSlide(swiper.activeIndex);
              }}
              className="mySwiper"
            >
              {displayedProjects.map((project) => (
                <SwiperSlide key={project.id} className="h-auto">
                  <div className="h-full">
                    <ProjectCard 
                      project={project} 
                      layout={layout}
                      isDraggingParent={isDragging}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom navigation buttons - made smaller */}
            <div className="flex justify-end items-center gap-3 mt-16 px-4 sm:px-6 md:px-8">
              <div className="flex items-center gap-3">
                <button className="swiper-button-prev p-2 rounded-full bg-white dark:bg-white text-gray-700 dark:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-100 transition-colors shadow-sm flex items-center justify-center" style={{ width: '46px', height: '46px', minWidth: '46px', minHeight: '46px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button className="swiper-button-next p-2 rounded-full bg-white dark:bg-white text-gray-700 dark:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-100 transition-colors shadow-sm flex items-center justify-center" style={{ width: '46px', height: '46px', minWidth: '46px', minHeight: '46px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View all button */}
      {showViewAllButton && projects.length > 0 && (
        <div className="mt-12 text-center">
          <Button href="/projects" variant="outline" size="lg">
            View All Projects
          </Button>
        </div>
      )}
    </div>
  );

  return useSection ? (
    <Section background={background} containerSize="full" className="py-12 md:py-16">
      {content}
    </Section>
  ) : content;
}

// Component for project cards
interface ProjectCardProps {
  project: Project;
  layout?: 'twoCol' | 'fourCol';
  isDraggingParent?: boolean;
}

export function ProjectCard({ project, layout = 'twoCol', isDraggingParent = false }: ProjectCardProps) {
  // fourCol layout rendering
  if (layout === 'fourCol') {
    return <FourColProjectCard project={project} isDraggingParent={isDraggingParent} />;
  }
  
  // twoCol layout rendering
  return <TwoColProjectCard project={project} />;
}

// Component for fourCol layout
function FourColProjectCard({ project, isDraggingParent = false }: { project: Project; isDraggingParent?: boolean }) {
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Get the video URL from the project's background_video_url field, or use fallback if not available
  const videoUrl = project.background_video_url || FALLBACK_VIDEO_URL;
  
  const handleMouseEnter = () => {
    if (!isMobile && !isDraggingParent) {
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
    <Link 
      href={`/projects/${project.slug}`}
      className={`group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md block h-full ${isDraggingParent ? 'pointer-events-none' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        if (isDraggingParent) {
          e.preventDefault();
        }
      }}
    >
      <div className="flex flex-col h-full">
        <div className="relative w-full aspect-[2/3]">
          {/* Video */}
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
          {project.thumbnail_url ? (
            <div 
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-300" 
              style={{ 
                backgroundImage: `url(${project.thumbnail_url})`,
                opacity: isVideoVisible ? 0 : 1
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">No image</span>
            </div>
          )}
          
          {/* Overlay gradient - always visible on mobile, only on hover for desktop */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
        </div>
        
        {/* Text container - always at bottom for mobile, animated for desktop */}
        <div className={`absolute inset-x-0 bottom-0 p-4 transition-transform duration-300 ease-in-out ${isMobile ? 'transform-none' : 'transform translate-y-full group-hover:translate-y-0'}`}>
          <h3 className={`font-bold text-white line-clamp-2 ${isMobile ? 'text-base' : 'text-lg md:text-xl'}`}>
            {project.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

// Component for twoCol layout
function TwoColProjectCard({ project }: { project: Project }) {
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Get the video URL from the project's background_video_url field, or use fallback if not available
  const videoUrl = project.background_video_url || FALLBACK_VIDEO_URL;
  
  // Check if device is mobile
  useEffect(() => {
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

  // Handle mouse events
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
    <Link 
      href={`/projects/${project.slug}`}
      className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md block h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-video w-full">
        {/* Video */}
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
        {project.thumbnail_url ? (
          <div 
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300" 
            style={{ 
              backgroundImage: `url(${project.thumbnail_url})`,
              opacity: isVideoVisible ? 0 : 1
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">No image</span>
          </div>
        )}
        
        {/* Overlay gradient - always visible on mobile, only on hover for desktop */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
        
        {/* Text container - always at bottom for mobile, animated for desktop */}
        <div className={`absolute inset-x-0 bottom-0 p-6 transition-transform duration-300 ease-in-out ${isMobile ? 'transform-none' : 'transform translate-y-full group-hover:translate-y-0'}`}>
          <h3 className={`font-bold text-white ${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'}`}>
            {project.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}