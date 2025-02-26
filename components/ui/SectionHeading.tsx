// components/ui/SectionHeading.tsx
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string | ReactNode;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({ 
  title, 
  subtitle, 
  centered = false,
  className 
}: SectionHeadingProps) {
  return (
    <div className={cn(
      'mb-12',
      centered && 'text-center',
      className
    )}>
      <h2 className="mb-3 text-4xl tracking-tight text-dark dark:text-light transition-colors duration-200 sm:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "max-w-2xl text-xl text-dark-secondary dark:text-gray-300 transition-colors duration-200",
          centered && "mx-auto"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}