// components/ui/Button.tsx
import Link from 'next/link';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'accent' | 'brand';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
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
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-normal rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden transform hover:scale-[1.02] hover:shadow-md';
  
  const variantClasses = {
    primary: 'bg-dark dark:bg-light text-light dark:text-dark hover:bg-dark-secondary dark:hover:bg-light-secondary hover:text-light dark:hover:text-dark focus:ring-dark dark:focus:ring-light',
    secondary: 'bg-light-secondary dark:bg-dark-secondary text-dark dark:text-light hover:bg-light dark:hover:bg-dark hover:text-dark-secondary dark:hover:text-light-secondary focus:ring-light-secondary dark:focus:ring-dark-secondary',
    outline: 'border border-dark-secondary dark:border-light-secondary text-dark dark:text-light hover:border-dark dark:hover:border-light hover:bg-light-secondary dark:hover:bg-dark-secondary hover:text-dark dark:hover:text-light focus:ring-dark-secondary dark:focus:ring-light-secondary',
    success: 'bg-green-600 text-light hover:bg-green-700 hover:text-light focus:ring-green-500',
    accent: 'bg-accent text-dark hover:bg-opacity-90 hover:text-dark focus:ring-accent',
    brand: 'bg-brand text-light hover:bg-opacity-90 hover:text-light focus:ring-brand',
  };
  
  const sizeClasses = {
    sm: 'text-sm px-6 py-1.5',
    md: 'text-base px-8 py-2',
    lg: 'text-lg px-10 py-3',
  };
  
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-60 cursor-not-allowed hover:scale-100 hover:shadow-none' : '',
    className
  );
  
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  );
}