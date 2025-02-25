// components/ui/Section.tsx
'use client';

import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Container } from './Container';

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'primary' | 'dark';
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { children, className, background = 'white', containerSize = 'xl' },
  ref
) {
  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-blue-50',
    dark: 'bg-gray-900 text-white',
  };

  return (
    <section ref={ref} className={cn('py-16 md:py-24', bgClasses[background], className)}>
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  );
});