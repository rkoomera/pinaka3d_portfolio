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
    <section className="relative bg-white py-20 min-h-[40vh] flex items-center">
      <Container>
        <div className="text-center mx-auto max-w-5xl">
          <h1 className="mb-6 text-h1 font-bold tracking-tight text-gray-900 leading-tight">
            {title}
          </h1>
          
          <div className="text-center mx-auto max-w-3xl">
          <p className="text-h3 text-gray-600 sm:text-h3">
            {subtitle}
          </p>
          </div>
        </div>
      </Container>
    </section>
  );
}