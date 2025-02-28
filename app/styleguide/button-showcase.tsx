'use client';

import { Button } from '@/components/ui/Button';

export function ButtonVariantsShowcase() {
  const handleClick = () => {
    console.log('Button clicked');
  };

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Button variant="primary" onClick={handleClick}>Primary Button</Button>
      <Button variant="secondary" onClick={handleClick}>Secondary Button</Button>
      <Button variant="outline" onClick={handleClick}>Outline Button</Button>
      <Button variant="accent" onClick={handleClick}>Accent Button</Button>
      <Button variant="brand" onClick={handleClick}>Brand Button</Button>
    </div>
  );
}

export function ButtonSizesShowcase() {
  const handleClick = () => {
    console.log('Button clicked');
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Button size="sm" onClick={handleClick}>Small Button</Button>
      <Button size="md" onClick={handleClick}>Medium Button</Button>
      <Button size="lg" onClick={handleClick}>Large Button</Button>
    </div>
  );
} 