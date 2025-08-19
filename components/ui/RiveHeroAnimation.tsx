'use client';

import { useRive } from '@rive-app/react-canvas';
import { useEffect, useState } from 'react';

interface RiveHeroAnimationProps {
  className?: string;
}

export function RiveHeroAnimation({ className = '' }: RiveHeroAnimationProps) {
  const [mounted, setMounted] = useState(false);

  // Only render on client side to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const { rive, RiveComponent } = useRive({
    src: 'https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/3d-assets/little_boy.riv',
    artboard: 'Little Boy',
    stateMachines: ['State Machine 1'],
    autoplay: true,
  });

  // Ensure animation plays when rive instance is ready
  useEffect(() => {
    if (rive) {
      rive.play();
    }
  }, [rive]);

  if (!mounted) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <RiveComponent />
    </div>
  );
}
