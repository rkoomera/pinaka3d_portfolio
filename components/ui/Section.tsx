// components/ui/Section.tsx
'use client';

import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Container } from './Container';

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: 'white' | 'gray-100' | 'gray-900' | 'gray-800' | 'gray-950' | 'accent' | 'brand' | 'projects';
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { children, className, background = 'white', containerSize = 'lg' },
  ref
) {
  const bgClasses = {
    'white': 'bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200',
    'gray-100': 'bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-200',
    'gray-900': 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 transition-colors duration-200',
    'gray-800': 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 transition-colors duration-200',
    'gray-950': 'bg-gray-950 dark:bg-gray-50 text-white dark:text-gray-900 transition-colors duration-200',
    'accent': 'bg-accent text-gray-900 transition-colors duration-200',
    'brand': 'bg-brand text-white transition-colors duration-200',
    'projects': 'bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-200',
  };

  return (
    <section ref={ref} className={cn('py-16 md:py-24', bgClasses[background], className)}>
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  );
});