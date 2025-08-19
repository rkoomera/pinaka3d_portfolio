// components/portfolio/HeroSection.tsx
'use client';

import { Container } from '@/components/ui/Container';
import { RiveHeroAnimation } from '@/components/ui/RiveHeroAnimation';
import Image from 'next/image';
import React from 'react';

interface HeroSectionProps {
  title?: string;
  titleLines?: Array<{
    text: string;
    className?: string;
  }>;
  // Image props (optional)
  imageUrl?: string;
  imageAlt?: string;
  imageSize?: number;
  imageHeight?: number;
  // Rive animation props (optional)
  riveUrl?: string;
  riveArtboard?: string;
  riveStateMachine?: string;
  riveAutoplay?: boolean;
}

export function HeroSection({
  title,
  titleLines,
  imageUrl,
  imageAlt,
  imageSize,
  imageHeight,
  riveUrl,
  riveArtboard = 'Little Boy',
  riveStateMachine = 'State Machine 1',
  riveAutoplay = true
}: HeroSectionProps) {
  return (
    <section className="relative bg-white dark:bg-gray-950 py-12 md:py-16 min-h-[40vh] flex items-center transition-colors duration-200">
      <Container>
        <div className="text-center mx-auto max-w-5xl">
          {/* Profile Image or Rive Animation */}
          <div className="mb-8 md:mb-10 flex justify-center">
            <div className="relative w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[450px]">
              {riveUrl ? (
                <RiveHeroAnimation 
                  className="w-full h-[280px] sm:h-[360px] lg:h-[420px] rounded-lg shadow-lg"
                />
              ) : imageUrl ? (
                <Image 
                  src={imageUrl}
                  alt={imageAlt || 'Profile image'}
                  width={imageSize || 400}
                  height={imageHeight || 350}
                  className="rounded-lg shadow-md" 
                  priority
                  unoptimized={imageUrl.startsWith('http')} // Skip optimization for external URLs
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    objectFit: 'cover'
                  }}
                />
              ) : null}
            </div>
          </div>
          
          <div className="space-y-4">
            {title ? (
              <h1 className="text-4xl font-normal tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                {title}
              </h1>
            ) : titleLines ? (
              <div className="space-y-1">
                {titleLines.map((line, index) => (
                  <h1 
                    key={index} 
                    className={`font-bold tracking-tight ${line.className || "text-4xl text-gray-900 dark:text-white sm:text-6xl"}`}
                  >
                    {line.text}
                  </h1>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}