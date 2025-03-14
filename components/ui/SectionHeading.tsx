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
      <h2 className="mb-3 text-3xl md:text-4xl font-normal tracking-tight text-gray-900 dark:text-white transition-colors duration-200">
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "max-w-2xl text-lg text-gray-700 dark:text-gray-300 transition-colors duration-200",
          centered && "mx-auto"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}