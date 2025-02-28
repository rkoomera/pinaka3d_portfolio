'use client';

import { PlayButton } from '@/components/ui/PlayButton';

export function PlayButtonShowcase() {
  const handleClick = () => {
    // This is just a placeholder function for the demo
    console.log('Play button clicked');
  };

  return (
    <div className="flex flex-wrap gap-8 items-center">
      <div className="flex flex-col items-center">
        <PlayButton onClick={handleClick} size="sm" />
        <span className="mt-2 text-sm">Small</span>
      </div>
      <div className="flex flex-col items-center">
        <PlayButton onClick={handleClick} size="md" />
        <span className="mt-2 text-sm">Medium</span>
      </div>
      <div className="flex flex-col items-center">
        <PlayButton onClick={handleClick} size="lg" />
        <span className="mt-2 text-sm">Large</span>
      </div>
    </div>
  );
} 