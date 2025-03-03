"use client";

import { ReactNode } from 'react';

interface AnimatedLayoutProps {
  children: ReactNode;
}

export default function AnimatedLayout({ children }: AnimatedLayoutProps) {
  // Simply pass through children without additional animations
  // since we're handling animations in the AdvancedPageTransition component
  return <>{children}</>;
} 