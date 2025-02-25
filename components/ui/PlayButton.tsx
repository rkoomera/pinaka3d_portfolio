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
      triangle: 'border-y-[10px] border-l-[16px] ml-1.5',
    },
    md: {
      button: 'p-8',
      icon: 'w-16 h-16',
      triangle: 'border-y-[14px] border-l-[24px] ml-2',
    },
    lg: {
      button: 'p-10',
      icon: 'w-20 h-20',
      triangle: 'border-y-[18px] border-l-[30px] ml-2.5',
    },
  };

  const { button, icon, triangle } = sizeClasses[size];

  return (
    <button
      className={`group relative bg-white/20 backdrop-blur-sm text-white ${button} rounded-full shadow-lg flex items-center justify-center hover:bg-white/30 transition-all duration-300 border-2 border-white/40 hover:scale-105 ${className}`}
      onClick={onClick}
      aria-label="Play video"
    >
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-full bg-white/10 blur-md transform scale-110 group-hover:scale-125 transition-transform duration-300"></div>
      
      {/* Simple triangle play icon */}
      <div className="relative z-10 flex items-center justify-center">
        <div className={`${icon} flex items-center justify-center`}>
          <div className={`w-0 h-0 border-y-transparent ${triangle} border-l-white`}></div>
        </div>
      </div>
    </button>
  );
} 