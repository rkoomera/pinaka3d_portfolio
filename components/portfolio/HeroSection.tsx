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
    <section className="relative bg-light dark:bg-dark py-20 min-h-[40vh] flex items-center transition-colors duration-200">
      <Container>
        <div className="text-center mx-auto max-w-5xl">
          <h1 className="mb-8 text-h1 tracking-tight text-dark dark:text-light leading-tight transition-colors duration-200">
            {title}
          </h1>
          
          <div className="text-center mx-auto max-w-3xl">
            <h3 className="text-dark-secondary dark:text-light-secondary py-2 text-2xl md:text-3xl transition-colors duration-200" style={{ lineHeight: '1.4' }}>
              {subtitle}
            </h3>
          </div>
        </div>
      </Container>
    </section>
  );
}