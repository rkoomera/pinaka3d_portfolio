'use client';

import dynamic from 'next/dynamic';

// Import VideoSection with dynamic import and disable SSR
const VideoSection = dynamic(
  () => import('@/components/layout/VideoSection').then(mod => mod.VideoSection),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[16/6] bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-gray-300"></div>
      </div>
    )
  }
);

interface ClientVideoSectionProps {
  backgroundVideoUrl?: string;
  popupVideoUrl?: string;
  height?: string;
  className?: string;
}

export default function ClientVideoSection({
  backgroundVideoUrl,
  popupVideoUrl,
  height,
  className
}: ClientVideoSectionProps) {
  // Debug the URLs
  console.log('ClientVideoSection - backgroundVideoUrl:', backgroundVideoUrl);
  console.log('ClientVideoSection - popupVideoUrl:', popupVideoUrl);
  
  return (
    <VideoSection
      backgroundVideoUrl={backgroundVideoUrl}
      popupVideoUrl={popupVideoUrl}
      height={height}
      className={className}
    />
  );
} 