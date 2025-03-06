// components/ui/Button.tsx
import Link from 'next/link';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children?: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'accent' | 'brand' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  showArrow?: boolean;
  ariaLabel?: string;
}

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  fullWidth = false,
  showArrow = true,
  ariaLabel,
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-normal rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden transform hover:scale-[1.02] hover:shadow-md';
  
  const variantClasses = {
    primary: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 focus:ring-gray-900 dark:focus:ring-white',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-300 dark:focus:ring-gray-600',
    outline: 'border-2 border-gray-500 dark:border-gray-600 text-gray-800 dark:text-white hover:border-gray-700 dark:hover:border-gray-500 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-white focus:ring-gray-500 dark:focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 hover:text-white focus:ring-green-500',
    accent: 'bg-accent text-gray-900 hover:bg-accent-dark hover:text-gray-900 focus:ring-accent',
    brand: 'bg-brand text-white hover:bg-brand-dark hover:text-white focus:ring-brand',
    glass: 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20 focus:ring-white/30',
  };
  
  const sizeClasses = {
    sm: 'text-xs px-5 py-1.5',
    md: 'text-sm px-6 py-2',
    lg: 'text-base px-8 py-2.5',
  };
  
  const arrowSizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-60 cursor-not-allowed hover:scale-100 hover:shadow-none' : '',
    className
  );
  
  // Arrow icon with magnetic effect
  const ArrowIcon = showArrow && !disabled ? (
    <div className="relative ml-2" data-hover>
      <div data-hover-bounds className="absolute inset-0 pointer-events-none"></div>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={cn(
          arrowSizeClasses[size], 
          'transition-transform duration-300 group-hover:translate-x-1'
        )} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M14 5l7 7m0 0l-7 7m7-7H3" 
        />
      </svg>
    </div>
  ) : null;
  
  if (href) {
    return (
      <Link href={href} className={cn(classes, 'group')} aria-label={ariaLabel}>
        <span>{children}</span>
        {ArrowIcon}
      </Link>
    );
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(classes, 'group')}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <span>{children}</span>
      {ArrowIcon}
    </button>
  );
}