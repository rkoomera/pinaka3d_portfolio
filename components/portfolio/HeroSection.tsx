// components/portfolio/HeroSection.tsx
'use client';

import { Container } from '@/components/ui/Container';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export function HeroSection({
  title,
  subtitle,
}: HeroSectionProps) {
  return (
    <section className="relative bg-white dark:bg-gray-950 py-20 min-h-[40vh] flex items-center transition-colors duration-200">
      <Container>
        <div className="text-center mx-auto max-w-5xl">
          <h1 className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight transition-colors duration-200">
            {title}
          </h1>
          
          <div className="text-center mx-auto max-w-3xl">
            <h3 className="text-gray-700 dark:text-gray-200 py-2 text-lg md:text-xl transition-colors duration-200" style={{ lineHeight: '1.4' }}>
              {subtitle}
            </h3>
          </div>
        </div>
      </Container>
    </section>
  );
}