'use client';

import { Button } from '@/components/ui/Button';

export function ButtonVariantsShowcase() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="success">Success</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="brand">Brand</Button>
      <Button variant="glass" className="bg-gradient-to-r from-purple-600 to-blue-600 p-1">Glass</Button>
    </div>
  );
}

export function ButtonSizesShowcase() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

export function ButtonArrowShowcase() {
  return (
    <div className="space-y-8">
      {/* With Arrow */}
      <div>
        <h3 className="text-lg font-medium mb-4">With Arrow</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button 
            size="sm" 
            variant="primary"
            showArrow={true}
          >
            Small Button
          </Button>
          <Button 
            size="md" 
            variant="secondary"
            showArrow={true}
          >
            Medium Button
          </Button>
          <Button 
            size="lg" 
            variant="brand"
            showArrow={true}
          >
            Large Button
          </Button>
        </div>
      </div>
      
      {/* Without Arrow */}
      <div>
        <h3 className="text-lg font-medium mb-4">Without Arrow</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button 
            size="sm" 
            variant="primary"
            showArrow={false}
          >
            Small Button
          </Button>
          <Button 
            size="md" 
            variant="secondary"
            showArrow={false}
          >
            Medium Button
          </Button>
          <Button 
            size="lg" 
            variant="brand"
            showArrow={false}
          >
            Large Button
          </Button>
        </div>
      </div>
      
      {/* Link Buttons */}
      <div>
        <h3 className="text-lg font-medium mb-4">Link Buttons</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button 
            href="#"
            variant="primary"
          >
            Primary Link
          </Button>
          <Button 
            href="#"
            variant="outline"
          >
            Outline Link
          </Button>
          <Button 
            href="#"
            variant="brand"
          >
            Brand Link
          </Button>
        </div>
      </div>
      
      {/* Disabled Buttons */}
      <div>
        <h3 className="text-lg font-medium mb-4">Disabled Buttons</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button 
            variant="primary"
            disabled={true}
          >
            Disabled Primary
          </Button>
          <Button 
            variant="outline"
            disabled={true}
          >
            Disabled Outline
          </Button>
          <Button 
            variant="brand"
            disabled={true}
          >
            Disabled Brand
          </Button>
        </div>
      </div>
    </div>
  );
}

// Icon Components
function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

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