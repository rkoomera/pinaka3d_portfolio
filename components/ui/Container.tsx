// components/ui/Container.tsx
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizes = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
};

export function Container({ 
  children, 
  className, 
  size = 'xl' 
}: ContainerProps) {
  return (
    <div className={cn(
      'mx-auto px-4 sm:px-6 lg:px-8',
      sizes[size],
      className
    )}>
      {children}
    </div>
  );
}