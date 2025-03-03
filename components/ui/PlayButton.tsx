"use client";

import React from 'react';

interface PlayButtonProps {
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PlayButton({ onClick, size = 'md', className = '' }: PlayButtonProps) {
  // Size mappings with responsive classes
  const sizeClasses = {
    sm: {
      button: 'p-3 sm:p-4 md:p-5',
      icon: 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10',
      triangle: 'border-y-[6px] border-y-transparent border-l-[10px] ml-1 sm:border-y-[8px] sm:border-y-transparent sm:border-l-[13px] sm:ml-1 md:border-y-[10px] md:border-y-transparent md:border-l-[16px] md:ml-1.5',
    },
    md: {
      button: 'p-4 sm:p-6 md:p-8',
      icon: 'w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16',
      triangle: 'border-y-[8px] border-y-transparent border-l-[13px] ml-1 sm:border-y-[12px] sm:border-y-transparent sm:border-l-[20px] sm:ml-1.5 md:border-y-[14px] md:border-y-transparent md:border-l-[24px] md:ml-2',
    },
    lg: {
      button: 'p-5 sm:p-8 md:p-10',
      icon: 'w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20',
      triangle: 'border-y-[10px] border-y-transparent border-l-[16px] ml-1 sm:border-y-[14px] sm:border-y-transparent sm:border-l-[24px] sm:ml-2 md:border-y-[18px] md:border-y-transparent md:border-l-[30px] md:ml-2.5',
    },
  };

  const { button, icon, triangle } = sizeClasses[size];

  return (
    <button
      className={`group relative bg-brand text-white dark:text-white ${button} rounded-full shadow-lg flex items-center justify-center hover:bg-brand transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        onClick();
      }}
      aria-label="Play video"
    >
      
      {/* Simple triangle play icon */}
      <div className="relative z-10 flex items-center justify-center">
        <div className={`${icon} flex items-center justify-center`}>
          <div className={`w-0 h-0 ${triangle} border-l-white dark:border-l-white`}></div>
        </div>
      </div>
    </button>
  );
} 