"use client";

import React from 'react';

interface PlayButtonProps {
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PlayButton({ onClick, size = 'md', className = '' }: PlayButtonProps) {
  // Size mappings
  const sizeClasses = {
    sm: {
      button: 'p-5',
      icon: 'w-10 h-10',
      triangle: 'border-y-[10px] border-y-transparent border-l-[16px] ml-1.5',
    },
    md: {
      button: 'p-8',
      icon: 'w-16 h-16',
      triangle: 'border-y-[14px] border-y-transparent border-l-[24px] ml-2',
    },
    lg: {
      button: 'p-10',
      icon: 'w-20 h-20',
      triangle: 'border-y-[18px] border-y-transparent border-l-[30px] ml-2.5',
    },
  };

  const { button, icon, triangle } = sizeClasses[size];

  return (
    <button
      className={`group relative bg-brand text-white dark:text-white ${button} rounded-full shadow-lg flex items-center justify-center hover:bg-brand transition-all duration-300 hover:scale-105 ${className}`}
      onClick={onClick}
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