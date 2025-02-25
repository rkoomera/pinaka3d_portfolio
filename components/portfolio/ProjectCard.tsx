// components/portfolio/ProjectCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Project } from '@/types';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface ProjectCardProps {
  project: Project;
  className?: string;
  priority?: boolean;
}

export function ProjectCard({ project, className, priority = false }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLSpanElement>(null);
  const techStackRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const imageContainer = imageContainerRef.current;
    const content = contentRef.current;
    const category = categoryRef.current;
    
    // Initial subtle animation when component mounts
    gsap.fromTo(card, 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'all' }
    );
    
    // Create hover animations
    const enterAnimation = (e: MouseEvent) => {
      // Get mouse position for parallax effect
      const rect = card.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
      
      // Card scale, shadow and tilt animation
      gsap.to(card, {
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05)',
        y: -8,
        rotationY: mouseX * 5, // Subtle rotation based on mouse X position
        rotationX: mouseY * -5, // Subtle rotation based on mouse Y position
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 1000,
        transformOrigin: 'center'
      });
      
      // Image scale and parallax animation
      if (imageContainer && imageContainer.querySelector('img')) {
        gsap.to(imageContainer.querySelector('img'), {
          scale: 1.08,
          x: mouseX * -15, // Parallax effect
          y: mouseY * -15, // Parallax effect
          duration: 0.6,
          ease: 'power1.out'
        });
      }
      
      // Content animations
      if (content) {
        // Heading color change with glow effect
        gsap.to(content.querySelector('h3'), {
          color: '#1a56db',
          textShadow: '0 0 1px rgba(26, 86, 219, 0.3)',
          duration: 0.3
        });
        
        // Staggered animation for text elements
        gsap.to([content.querySelector('p'), techStackRef.current?.children], {
          y: -3,
          stagger: 0.05,
          duration: 0.3,
          ease: 'power1.out'
        });
      }
      
      // Category badge animation
      if (category) {
        gsap.to(category, {
          scale: 1.05,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          duration: 0.3
        });
      }
    };
    
    const leaveAnimation = () => {
      // Reset card with smooth transition
      gsap.to(card, {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        y: 0,
        rotationY: 0,
        rotationX: 0,
        duration: 0.5,
        ease: 'power3.out',
        clearProps: 'transform' // Clean up transform properties
      });
      
      // Reset image with smooth transition
      if (imageContainer && imageContainer.querySelector('img')) {
        gsap.to(imageContainer.querySelector('img'), {
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'power3.out'
        });
      }
      
      // Reset content
      if (content) {
        gsap.to(content.querySelector('h3'), {
          color: '#111827',
          textShadow: 'none',
          duration: 0.3
        });
        
        gsap.to([content.querySelector('p'), techStackRef.current?.children], {
          y: 0,
          stagger: 0.03,
          duration: 0.3,
          ease: 'power1.out'
        });
      }
      
      // Reset category badge
      if (category) {
        gsap.to(category, {
          scale: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          duration: 0.3
        });
      }
    };
    
    // Track mouse movement for parallax effect
    const moveAnimation = (e: MouseEvent) => {
      if (!card.matches(':hover')) return;
      
      const rect = card.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
      
      if (imageContainer && imageContainer.querySelector('img')) {
        gsap.to(imageContainer.querySelector('img'), {
          x: mouseX * -15,
          y: mouseY * -15,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
      
      gsap.to(card, {
        rotationY: mouseX * 5,
        rotationX: mouseY * -5,
        duration: 0.3,
        ease: 'power2.out'
      });
    };
    
    // Add event listeners
    card.addEventListener('mouseenter', enterAnimation);
    card.addEventListener('mouseleave', leaveAnimation);
    card.addEventListener('mousemove', moveAnimation);
    
    // Cleanup
    return () => {
      card.removeEventListener('mouseenter', enterAnimation);
      card.removeEventListener('mouseleave', leaveAnimation);
      card.removeEventListener('mousemove', moveAnimation);
      gsap.killTweensOf([card, imageContainer, content, category]);
    };
  }, []);

  return (
    <Link href={`/projects/${project.slug}`} className={cn('group block', className)}>
      <div 
        ref={cardRef}
        className="overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300"
      >
        <div 
          ref={imageContainerRef}
          className="relative aspect-video overflow-hidden"
        >
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={priority}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-2xl font-bold text-gray-400">
                {project.title[0]}
              </span>
            </div>
          )}
          {project.category && (
            <span 
              ref={categoryRef}
              className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white transition-all"
            >
              {project.category.replace('_', ' ')}
            </span>
          )}
        </div>

        <div ref={contentRef} className="p-5">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 transition-colors">{project.title}</h3>
            {project.client_name && (
              <p className="text-sm text-gray-600">{project.client_name}</p>
            )}
          </div>

          {project.summary && (
            <p className="mb-4 line-clamp-2 text-sm text-gray-700">{project.summary}</p>
          )}

          {project.tech_stack && project.tech_stack.length > 0 && (
            <div ref={techStackRef} className="flex flex-wrap gap-2">
              {project.tech_stack.slice(0, 3).map((tech) => (
                <span key={tech} className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-all">
                  {tech}
                </span>
              ))}
              {project.tech_stack.length > 3 && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-all">
                  +{project.tech_stack.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}