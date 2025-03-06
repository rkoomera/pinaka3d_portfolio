import Link from 'next/link';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps {
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'accent' | 'brand' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel: string;
  disabled?: boolean;
  tooltip?: string;
}

export function IconButton({
  icon,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  ariaLabel,
  disabled = false,
  tooltip,
}: IconButtonProps) {
  // Base classes for the button
  const baseClasses = 'flex items-center justify-center rounded-full transition-all duration-300 ease-in-out focus:outline-none relative';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600',
    outline: 'border-2 border-gray-500 dark:border-gray-400 text-gray-800 dark:text-white hover:border-gray-700 dark:hover:border-gray-300',
    accent: 'bg-accent text-gray-900 hover:bg-accent/90',
    brand: 'bg-brand text-white hover:bg-brand/90',
    glass: 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  
  // Icon size classes
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  // Combine all classes
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled ? 'opacity-60 cursor-not-allowed' : '',
    className
  );
  
  // Wrapper for the icon with proper sizing
  const IconWrapper = (
    <div className={cn(iconSizeClasses[size], 'relative z-10')}>
      {icon}
    </div>
  );
  
  // Tooltip element
  const TooltipElement = tooltip && !disabled ? (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
      {tooltip}
    </div>
  ) : null;
  
  // If href is provided, render as a Link
  if (href) {
    return (
      <div className="relative group">
        <Link 
          href={href} 
          className={classes} 
          aria-label={ariaLabel}
          data-hover
        >
          <div data-hover-bounds className="absolute inset-0 pointer-events-none"></div>
          {IconWrapper}
        </Link>
        {TooltipElement}
      </div>
    );
  }
  
  // Otherwise, render as a button
  return (
    <div className="relative group">
      <button
        type="button"
        onClick={onClick}
        className={classes}
        aria-label={ariaLabel}
        disabled={disabled}
        data-hover
      >
        <div data-hover-bounds className="absolute inset-0 pointer-events-none"></div>
        {IconWrapper}
      </button>
      {TooltipElement}
    </div>
  );
} 