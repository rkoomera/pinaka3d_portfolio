// components/portfolio/FeaturedProjects.tsx
'use client';

import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { Button } from '@/components/ui/Button';
import { Project } from '@/types';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger, useGSAP);

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  // Always declare hooks at the top level, regardless of conditions
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Use GSAP hook before any conditional returns
  useGSAP(() => {
    // Only run animations if we have projects
    if (!projects || projects.length === 0) return;
    
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 768px)", () => {
      // Desktop animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none none"
        }
      });
      
      // Animate the heading
      tl.fromTo(
        headingRef.current,
        { 
          y: 50, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: "power3.out" 
        }
      );
      
      // Staggered animation for project cards
      if (projectsRef.current) {
        const projectCards = projectsRef.current.children;
        tl.fromTo(
          projectCards,
          { 
            y: 60, 
            opacity: 0,
            scale: 0.95
          },
          { 
            y: 0, 
            opacity: 1,
            scale: 1,
            stagger: 0.15, 
            duration: 0.8, 
            ease: "power3.out" 
          },
          "-=0.4"
        );
      }
      
      // Animate the button
      tl.fromTo(
        buttonRef.current,
        { 
          y: 30, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          ease: "power3.out" 
        },
        "-=0.2"
      );
    });
    
    mm.add("(max-width: 767px)", () => {
      // Mobile animations (simpler for performance)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
      
      tl.fromTo(
        headingRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );
      
      if (projectsRef.current) {
        const projectCards = projectsRef.current.children;
        tl.fromTo(
          projectCards,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.6 },
          "-=0.3"
        );
      }
      
      tl.fromTo(
        buttonRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.2"
      );
    });

    return () => {
      // Clean up all ScrollTriggers when component unmounts
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, { scope: sectionRef });

  // Early return after hooks are declared
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <Section background="gray" ref={sectionRef}>
      <div ref={headingRef}>
        <SectionHeading 
          title="Featured Projects" 
          subtitle="Selected works that showcase my design and development skills"
          centered
        />
      </div>
      
      <div ref={projectsRef} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project}
            priority={index < 3}
          />
        ))}
      </div>
      
      <div ref={buttonRef} className="mt-12 text-center">
        <Button href="/projects" variant="outline">
          View All Projects
        </Button>
      </div>
    </Section>
  );
}