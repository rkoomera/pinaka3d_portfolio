'use client';

import { IconButton } from '@/components/ui/IconButton';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

export default function IconButtonShowcase() {
  return (
    <Section>
      <SectionHeading
        title="Icon Buttons"
        subtitle="Elegant icon buttons with magnetic cursor effect"
        centered
      />
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Primary Variant */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-medium mb-6">Primary</h3>
          <div className="flex items-center justify-center gap-4">
            <IconButton 
              icon={<ArrowUpIcon />} 
              ariaLabel="Arrow Up" 
              variant="primary"
              size="sm"
              tooltip="Small"
            />
            <IconButton 
              icon={<ArrowUpIcon />} 
              ariaLabel="Arrow Up" 
              variant="primary"
              size="md"
              tooltip="Medium"
            />
            <IconButton 
              icon={<ArrowUpIcon />} 
              ariaLabel="Arrow Up" 
              variant="primary"
              size="lg"
              tooltip="Large"
            />
          </div>
        </div>
        
        {/* Secondary Variant */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-medium mb-6">Secondary</h3>
          <div className="flex items-center justify-center gap-4">
            <IconButton 
              icon={<HeartIcon />} 
              ariaLabel="Like" 
              variant="secondary"
              size="sm"
              tooltip="Like"
            />
            <IconButton 
              icon={<HeartIcon />} 
              ariaLabel="Like" 
              variant="secondary"
              size="md"
              tooltip="Like"
            />
            <IconButton 
              icon={<HeartIcon />} 
              ariaLabel="Like" 
              variant="secondary"
              size="lg"
              tooltip="Like"
            />
          </div>
        </div>
        
        {/* Outline Variant */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-medium mb-6">Outline</h3>
          <div className="flex items-center justify-center gap-4">
            <IconButton 
              icon={<ShareIcon />} 
              ariaLabel="Share" 
              variant="outline"
              size="sm"
              tooltip="Share"
            />
            <IconButton 
              icon={<ShareIcon />} 
              ariaLabel="Share" 
              variant="outline"
              size="md"
              tooltip="Share"
            />
            <IconButton 
              icon={<ShareIcon />} 
              ariaLabel="Share" 
              variant="outline"
              size="lg"
              tooltip="Share"
            />
          </div>
        </div>
        
        {/* Accent Variant */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-medium mb-6">Accent</h3>
          <div className="flex items-center justify-center gap-4">
            <IconButton 
              icon={<PlusIcon />} 
              ariaLabel="Add" 
              variant="accent"
              size="sm"
              tooltip="Add"
            />
            <IconButton 
              icon={<PlusIcon />} 
              ariaLabel="Add" 
              variant="accent"
              size="md"
              tooltip="Add"
            />
            <IconButton 
              icon={<PlusIcon />} 
              ariaLabel="Add" 
              variant="accent"
              size="lg"
              tooltip="Add"
            />
          </div>
        </div>
        
        {/* Brand Variant */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-medium mb-6">Brand</h3>
          <div className="flex items-center justify-center gap-4">
            <IconButton 
              icon={<PlayIcon />} 
              ariaLabel="Play" 
              variant="brand"
              size="sm"
              tooltip="Play"
            />
            <IconButton 
              icon={<PlayIcon />} 
              ariaLabel="Play" 
              variant="brand"
              size="md"
              tooltip="Play"
            />
            <IconButton 
              icon={<PlayIcon />} 
              ariaLabel="Play" 
              variant="brand"
              size="lg"
              tooltip="Play"
            />
          </div>
        </div>
        
        {/* Glass Variant */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-700 p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-medium mb-6 text-white">Glass</h3>
          <div className="flex items-center justify-center gap-4">
            <IconButton 
              icon={<DownloadIcon />} 
              ariaLabel="Download" 
              variant="glass"
              size="sm"
              tooltip="Download"
            />
            <IconButton 
              icon={<DownloadIcon />} 
              ariaLabel="Download" 
              variant="glass"
              size="md"
              tooltip="Download"
            />
            <IconButton 
              icon={<DownloadIcon />} 
              ariaLabel="Download" 
              variant="glass"
              size="lg"
              tooltip="Download"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

// Icon Components
function ArrowUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
} 