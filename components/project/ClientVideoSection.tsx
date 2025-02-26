'use client';

import dynamic from 'next/dynamic';

// Import VideoSection with dynamic import and disable SSR
const VideoSection = dynamic(
  () => import('@/components/layout/VideoSection').then(mod => mod.VideoSection),
  { ssr: false }
);

interface ClientVideoSectionProps {
  backgroundVideoUrl?: string;
  popupVideoUrl?: string;
  height?: string;
  className?: string;
}

export function ClientVideoSection(props: ClientVideoSectionProps) {
  return <VideoSection {...props} />;
} 