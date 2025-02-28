// components/ui/Container.tsx
import React from 'react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  as?: React.ElementType;
}

export function Container({
  children,
  className = '',
  size = 'lg',
  as: Component = 'div',
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <Component
      className={cn(
        'w-full mx-auto px-4 sm:px-6 md:px-8',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Component>
  );
}