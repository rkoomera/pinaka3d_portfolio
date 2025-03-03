// components/portfolio/HeroSection.tsx
'use client';

import { Container } from '@/components/ui/Container';
import Image from 'next/image';
import React from 'react';

interface HeroSectionProps {
  title?: string;
  titleLines?: Array<{
    text: string;
    className?: string;
  }>;
  imageUrl: string;
  imageAlt: string;
  imageSize: number;
  imageHeight: number;
}

export function HeroSection({
  title,
  titleLines,
  imageUrl,
  imageAlt,
  imageSize,
  imageHeight
}: HeroSectionProps) {
  return (
    <section className="relative bg-white dark:bg-gray-950 py-12 md:py-16 min-h-[40vh] flex items-center transition-colors duration-200">
      <Container>
        <div className="text-center mx-auto max-w-5xl">
          {/* Profile Image */}
          <div className="mb-6 md:mb-6 flex justify-center">
            <div className="relative w-full max-w-[300px] sm:max-w-[400px]">
              <Image 
                src={imageUrl}
                alt={imageAlt}
                width={imageSize}
                height={imageHeight}
                className="rounded-lg shadow-md" 
                priority
                unoptimized={imageUrl.startsWith('http')} // Skip optimization for external URLs
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {title ? (
              <h1 className="text-4xl font-normal tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                {title}
              </h1>
            ) : titleLines ? (
              <div className="space-y-3">
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