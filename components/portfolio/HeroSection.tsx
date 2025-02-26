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
          <h1 className="mb-8 text-h1 tracking-tight text-gray-900 leading-tight">
            {title}
          </h1>
          
          <div className="text-center mx-auto max-w-3xl">
            <h3 className="text-gray-600 py-2 text-2xl md:text-3xl" style={{ lineHeight: '1.4' }}>
              {subtitle}
            </h3>
          </div>
        </div>
      </Container>
    </section>
  );
}