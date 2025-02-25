'use client';

import { useRef, useEffect } from 'react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export function ContactCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const decorationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Store current refs to use in cleanup
    const currentSectionRef = sectionRef.current;
    const currentHeadingRef = headingRef.current;
    const currentButtonRef = buttonRef.current;
    const currentDecorationRef = decorationRef.current;

    // Create a timeline for the animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: currentSectionRef,
        start: 'top 70%',
        end: 'bottom 20%',
        toggleActions: 'play none none none'
      }
    });

    // Heading animation
    tl.fromTo(
      currentHeadingRef,
      { 
        y: 40, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: 'power3.out' 
      }
    );

    // Button animation with bounce effect
    tl.fromTo(
      currentButtonRef,
      { 
        y: 30, 
        opacity: 0, 
        scale: 0.9 
      },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 0.6, 
        ease: 'back.out(1.7)' 
      },
      '-=0.4'
    );

    // Add a subtle pulse animation to the button
    tl.to(
      currentButtonRef,
      {
        scale: 1.05,
        duration: 0.5,
        repeat: 1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 0.2
      }
    );

    // Background decoration animation
    if (currentDecorationRef) {
      gsap.fromTo(
        currentDecorationRef,
        { 
          opacity: 0,
          scale: 0.8,
          rotation: -5
        },
        { 
          opacity: 0.7,
          scale: 1,
          rotation: 0,
          duration: 1.2,
          ease: 'power2.out',
          delay: 0.3
        }
      );

      // Add floating animation to decoration
      gsap.to(currentDecorationRef, {
        y: 15,
        x: 10,
        rotation: 5,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    return () => {
      // Clean up animations
      const triggers = ScrollTrigger.getAll().filter(
        trigger => trigger.vars.trigger === currentSectionRef
      );
      triggers.forEach(trigger => trigger.kill());
      
      gsap.killTweensOf([currentHeadingRef, currentButtonRef, currentDecorationRef]);
    };
  }, []);

  return (
    <Section ref={sectionRef} background="primary" className="relative overflow-hidden">
      {/* Background decoration */}
      <div 
        ref={decorationRef}
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-200 opacity-0 blur-3xl"
      ></div>
      
      <div ref={headingRef} className="opacity-0">
        <SectionHeading 
          title="Let's Work Together"
          subtitle="Have a project in mind? I'd love to hear about it!"
          centered
        />
      </div>
      
      <div ref={buttonRef} className="mt-8 flex justify-center opacity-0">
        <Button href="/contact" size="lg">
          Contact Me
        </Button>
      </div>
    </Section>
  );
} 