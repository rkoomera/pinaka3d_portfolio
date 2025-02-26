// components/ui/Section.tsx
'use client';

import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Container } from './Container';

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: 'light' | 'light-secondary' | 'dark' | 'dark-secondary' | 'accent' | 'brand';
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { children, className, background = 'light', containerSize = 'xl' },
  ref
) {
  const bgClasses = {
    light: 'bg-light dark:bg-dark text-dark dark:text-light transition-colors duration-200',
    'light-secondary': 'bg-light-secondary dark:bg-dark-secondary text-dark dark:text-light transition-colors duration-200',
    dark: 'bg-dark dark:bg-light text-light dark:text-dark transition-colors duration-200',
    'dark-secondary': 'bg-dark-secondary dark:bg-light-secondary text-light dark:text-dark transition-colors duration-200',
    accent: 'bg-accent text-dark transition-colors duration-200',
    brand: 'bg-brand text-light transition-colors duration-200',
  };

  return (
    <section ref={ref} className={cn('py-16 md:py-24', bgClasses[background], className)}>
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  );
});