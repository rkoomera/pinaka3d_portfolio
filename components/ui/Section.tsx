// components/ui/Section.tsx
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Container } from './Container';

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'primary';
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Section({ 
  children, 
  className, 
  background = 'white',
  containerSize = 'xl'
}: SectionProps) {
  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-blue-50',
  };

  return (
    <section className={cn('py-16 md:py-24', bgClasses[background], className)}>
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  );
}