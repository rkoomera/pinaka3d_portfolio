// components/portfolio/FeaturedProjects.tsx
'use client';

import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Project } from '@/types';
import { urlForImage } from '@/sanity/lib/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import Head from 'next/head';
// Import Swiper and required modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Grid } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Custom styles for Swiper
const swiperStyles = `
  .swiper-container {
    position: relative;
    padding-bottom: 0;
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
    overflow-x: hidden !important;
  }
  
  /* Custom pagination styles */
  .swiper-pagination {
    position: static !important;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 10px;
    width: auto !important;
  }
  
  .swiper-pagination-bullet {
    width: 10px !important;
    height: 10px !important;
    background-color: rgba(180, 180, 180, 0.5) !important;
    opacity: 0.5 !important;
    transition: all 0.3s ease !important;
    margin: 0 4px !important;
  }
  
  .swiper-pagination-bullet-active {
    opacity: 1 !important;
    background-color: #7645fc !important;
    transform: scale(1.2) !important;
  }
  
  .dark .swiper-pagination-bullet {
    background-color: rgba(100, 100, 100, 0.5) !important;
  }
  
  .dark .swiper-pagination-bullet-active {
    background-color: #5f35d9 !important;
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
  showViewAllButton = false,
  background = 'gray-100',
  layout: initialLayout = 'twoCol',
  limit = undefined,
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
  const [realIndex, setRealIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showNavigation, setShowNavigation] = useState(true);
  const [swiperProgress, setSwiperProgress] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);
  const swiperContainerRef = useRef<HTMLDivElement>(null);
  const leftArrowRef = useRef<HTMLDivElement>(null);
  const rightArrowRef = useRef<HTMLDivElement>(null);
  
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
    // Remove the automatic layout change for mobile
    // This allows users to toggle between layouts on mobile
    // if (isMobile && layout === 'fourCol') {
    //   setLayout('twoCol');
    // }
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

  // Handle navigation visibility - modify to make it always visible with a fade effect
  useEffect(() => {
    if (!swiperContainerRef.current) return;
    
    const container = swiperContainerRef.current;
    
    // Set navigation to be visible by default
    setShowNavigation(true);
    
    const handleMouseEnter = () => {
      setShowNavigation(true);
    };
    
    const handleMouseLeave = () => {
      // Only hide navigation on desktop, keep visible on mobile
      if (!isMobile) {
        setShowNavigation(false);
      }
    };
    
    // Add event listeners
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    // Cleanup
    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile]);
  
  // Simplified active dot index calculation
  const getActiveDotIndex = (realIndex: number, totalSlides: number) => {
    // Simply use modulo to get the correct index within the available dots
    return realIndex % Math.min(5, totalSlides);
  };
  
  const renderSwiper = () => (
    <div 
      className="relative overflow-hidden w-full swiper-container-wrapper"
      onMouseEnter={() => setShowNavigation(true)}
      onMouseLeave={() => isMobile ? setShowNavigation(true) : setShowNavigation(false)}
      style={{ overflowX: 'hidden' }}
    >
      <div className="swiper-container relative" ref={swiperContainerRef} style={{ maxWidth: '100%' }}>
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            // Initialize the real index
            setRealIndex(0);
          }}
          modules={[Navigation, A11y, Grid]}
          spaceBetween={24}
          slidesPerView={1.5}
          navigation={false}
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
              slidesPerView: 4.5,
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
            
            // Calculate the real index based on the active index and total slides
            // For looped sliders, we need to account for the cloned slides
            const totalSlides = Math.min(5, displayedProjects.length);
            const realSlideIndex = swiper.realIndex % totalSlides;
            setRealIndex(realSlideIndex);
            
            // Update progress
            setSwiperProgress(swiper.progress);
          }}
          onProgress={(swiper) => {
            setSwiperProgress(swiper.progress);
          }}
          className="mySwiper"
        >
          {displayedProjects.map((project, index) => (
            <SwiperSlide key={`swiper-project-${project.id}-${index}`} className="h-auto">
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
        
        {/* Capsule-style navigation buttons - positioned below the slider */}
        <div 
          className="flex justify-center mt-6 mb-4 transition-opacity duration-300 ease-in-out"
          style={{ opacity: isMobile ? 1 : (showNavigation ? 1 : 0) }}
        >
          <div 
            className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-5 py-3 shadow-sm"
            style={{ backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}
          >
            {/* Previous button */}
            <button 
              onClick={() => swiperRef.current?.slidePrev()}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center justify-center mr-4 relative"
              aria-label="Previous slide"
              data-hover
            >
              <div data-hover-bounds className="absolute inset-0"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Swiper pagination will be rendered here automatically */}
            <div className="mx-4 min-w-[100px] flex items-center justify-center">
              {/* Custom pagination dots */}
              {Array.from({ length: Math.min(5, displayedProjects.length) }).map((_, index) => (
                <button
                  key={`pagination-dot-${index}`}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    realIndex === index 
                      ? 'w-16 bg-brand mx-2' 
                      : 'w-3 bg-gray-400 dark:bg-gray-600 opacity-50 mx-1.5'
                  }`}
                  onClick={() => {
                    if (swiperRef.current) {
                      // Use Swiper's slideTo method to go to the correct slide
                      // The third parameter (runCallbacks) ensures onSlideChange is triggered
                      swiperRef.current.slideTo(index, 300, true);
                    }
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Next button */}
            <button 
              onClick={() => swiperRef.current?.slideNext()}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center justify-center ml-4 relative"
              aria-label="Next slide"
              data-hover
            >
              <div data-hover-bounds className="absolute inset-0"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  const content = (
    <div className="w-full">
      {/* Add style tag for Swiper custom styles */}
      <style jsx global>{swiperStyles}</style>
      
      {/* Header section with conditional rendering based on device type */}
      {isMobile ? (
        // Mobile layout - with toggle if enabled
        (showHeading || showLayoutToggle) && (
          <div className="mb-12">
            {showHeading && (
              <SectionHeading
                title={title}
                subtitle={showSubtitle ? subtitle : undefined}
                centered={false}
                className="text-left mb-6"
              />
            )}
            
            {showLayoutToggle && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setLayout('twoCol')}
                  className={`p-2 rounded-md transition-colors ${
                    layout === 'twoCol'
                      ? 'bg-brand text-white'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                  aria-label="2-Column Grid"
                  title="2-Column Grid"
                  data-hover
                >
                  <div data-hover-bounds className="absolute inset-0"></div>
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
                  data-hover
                >
                  <div data-hover-bounds className="absolute inset-0"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )
      ) : (
        // Desktop layout - with toggle if enabled
        (showHeading || showLayoutToggle) && (
          <div className="flex justify-between items-center mb-12">
            {showHeading && (
              <SectionHeading
                title={title}
                subtitle={showSubtitle ? subtitle : undefined}
                centered={!alignHeadingLeft && !showLayoutToggle}
                className={`${showLayoutToggle ? 'mb-0' : 'mb-4'} ${!showLayoutToggle ? 'w-full' : ''}`}
              />
            )}
            
            {showLayoutToggle && (
              <div className={`flex items-center space-x-2 ${!showHeading ? 'mx-auto' : 'ml-auto'}`}>
                <button
                  onClick={() => setLayout('twoCol')}
                  className={`p-2 rounded-md transition-colors relative ${
                    layout === 'twoCol'
                      ? 'bg-brand text-white'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                  aria-label="2-Column Grid"
                  title="2-Column Grid"
                  data-hover
                >
                  <div data-hover-bounds className="absolute inset-0"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => setLayout('fourCol')}
                  className={`p-2 rounded-md transition-colors relative ${
                    layout === 'fourCol'
                      ? 'bg-brand text-white'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                  aria-label="4-Column Grid"
                  title="4-Column Grid"
                  data-hover
                >
                  <div data-hover-bounds className="absolute inset-0"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )
      )}
      
      {/* Projects grid/list */}
      {layout === 'twoCol' || !useSwiperOnFourCol ? (
        // Two column layout or four column grid (when not using Swiper)
        <div className={`${layout === 'twoCol' 
          ? 'columns-1 md:columns-2 gap-16' 
          : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 auto-rows-fr'}`}>
          {displayedProjects.map((project, index) => {
            // Calculate aspect ratio based on index for two-column layout
            let aspectRatioClass;
            
            if (layout === 'twoCol') {
              // Create extreme contrasting heights between adjacent cards
              // We'll use the modulo of the index to determine which pattern to use
              const patternIndex = Math.floor(index / 2) % 4; // Group by pairs, cycle through 4 patterns
              const isSecondColumn = index % 2 === 1;
              
              if (patternIndex === 0) {
                // First pair pattern: very tall + very wide
                aspectRatioClass = isSecondColumn ? 'aspect-[3/1]' : 'aspect-[1/3]';
              } else if (patternIndex === 1) {
                // Second pair pattern: wide + square
                aspectRatioClass = isSecondColumn ? 'aspect-square' : 'aspect-[2/1]';
              } else if (patternIndex === 2) {
                // Third pair pattern: square + tall
                aspectRatioClass = isSecondColumn ? 'aspect-[2/3]' : 'aspect-[3/2]';
              } else {
                // Fourth pair pattern: very wide + very tall
                aspectRatioClass = isSecondColumn ? 'aspect-[1/2]' : 'aspect-[21/9]';
              }
            } else {
              aspectRatioClass = undefined;
            }
              
            return (
              <div 
                key={`project-${project.id}-${index}`} 
                className={layout === 'twoCol' 
                  ? 'break-inside-avoid mb-16 inline-block w-full'
                  : ''
                }
                style={layout === 'twoCol' ? { pageBreakInside: 'avoid', breakInside: 'avoid', maxHeight: '80vh' } : {}}
              >
                <ProjectCard 
                  project={project} 
                  layout={layout}
                  aspectRatio={aspectRatioClass}
                />
              </div>
            );
          })}
        </div>
      ) : (
        // Four column layout with Swiper (only on Projects page)
        renderSwiper()
      )}
      
      {/* View all button - conditionally rendered */}
      {showViewAllButton && projects.length > 0 && (
        <div className="mt-16 text-center">
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

// Update the ProjectCardProps interface to include aspectRatio
interface ProjectCardProps {
  project: Project;
  layout?: 'twoCol' | 'fourCol';
  isDraggingParent?: boolean;
  isLarge?: boolean;
  aspectRatio?: string;
}

// Update the ProjectCard component to pass aspectRatio to TwoColProjectCard
export function ProjectCard({ project, layout = 'twoCol', isDraggingParent = false, isLarge = false, aspectRatio }: ProjectCardProps) {
  // fourCol layout rendering
  if (layout === 'fourCol') {
    return <FourColProjectCard project={project} isDraggingParent={isDraggingParent} />;
  }
  
  // twoCol layout rendering
  return <TwoColProjectCard project={project} isLarge={isLarge} aspectRatio={aspectRatio} />;
}

// Component for fourCol layout
function FourColProjectCard({ project, isDraggingParent = false }: { project: Project; isDraggingParent?: boolean }) {
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Resolve media
  const videoUrl = project.background_video_url || FALLBACK_VIDEO_URL;
  const thumbnailUrl = (project as any).thumbnail
    ? (urlForImage((project as any).thumbnail)?.url() || '')
    : ((project as any).thumbnail_url || '');
  
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
      className={`group relative bg-white dark:bg-gray-800 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md block h-full ${isDraggingParent ? 'pointer-events-none' : ''}`}
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
          {thumbnailUrl ? (
            <div 
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-300" 
              style={{ 
                backgroundImage: `url(${thumbnailUrl})`,
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
          
          {/* Project links with magnetic effect */}
          <div className="absolute bottom-4 right-4 flex gap-3 z-10">
            {project.github && (
              <Link 
                href={project.github} 
                target="_blank" 
                className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors relative"
                onClick={(e) => e.stopPropagation()}
                data-hover
              >
                <div data-hover-bounds className="absolute inset-0"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </Link>
            )}
            
            {project.link && (
              <Link 
                href={project.link} 
                target="_blank" 
                className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors relative"
                onClick={(e) => e.stopPropagation()}
                data-hover
              >
                <div data-hover-bounds className="absolute inset-0"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                  <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                </svg>
              </Link>
            )}
          </div>
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
function TwoColProjectCard({ project, isLarge = false, aspectRatio = 'aspect-video' }: { project: Project; isLarge?: boolean; aspectRatio?: string }) {
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Resolve media
  const videoUrl = project.background_video_url || FALLBACK_VIDEO_URL;
  const thumbnailUrl = (project as any).thumbnail
    ? (urlForImage((project as any).thumbnail)?.url() || '')
    : ((project as any).thumbnail_url || '');
  
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
      className="group relative overflow-hidden block transition-transform duration-300 hover:scale-[1.02]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Force the aspect ratio with an outer div */}
      <div className={`${aspectRatio} w-full overflow-hidden`} style={{ display: 'block', maxHeight: '80vh' }}>
        <div className="relative w-full h-full overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 bg-gray-900">
            {thumbnailUrl && (
              <img 
                src={thumbnailUrl} 
                alt={project.title} 
                className="w-full h-full object-cover opacity-80"
              />
            )}
          </div>
          
          {/* Video overlay */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${isVideoVisible ? 'opacity-100' : 'opacity-0'}`}>
            <video 
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Content overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
            <h3 className={`font-bold text-white line-clamp-2 ${isMobile ? 'text-base' : 'text-lg md:text-xl'}`}>
              {project.title}
            </h3>
            
            {/* Project links with magnetic effect */}
            <div className="flex gap-4 mt-4">
              {project.github && (
                <Link 
                  href={project.github} 
                  target="_blank" 
                  className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors relative"
                  onClick={(e) => e.stopPropagation()}
                  data-hover
                >
                  <div data-hover-bounds className="absolute inset-0"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                </Link>
              )}
              
              {project.link && (
                <Link 
                  href={project.link} 
                  target="_blank" 
                  className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors relative"
                  onClick={(e) => e.stopPropagation()}
                  data-hover
                >
                  <div data-hover-bounds className="absolute inset-0"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                    <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}