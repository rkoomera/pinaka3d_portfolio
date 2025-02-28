# Pinaka Portfolio Style Guide

This document outlines the design system, component usage, and styling best practices for the Pinaka Portfolio project.

## Table of Contents

1. [Design Tokens](#design-tokens)
   - [Colors](#colors)
   - [Typography](#typography)
   - [Spacing](#spacing)
   - [Breakpoints](#breakpoints)
2. [Components](#components)
   - [Layout Components](#layout-components)
   - [UI Components](#ui-components)
3. [Best Practices](#best-practices)
   - [Using Tailwind Classes](#using-tailwind-classes)
   - [Dark Mode](#dark-mode)
   - [Responsive Design](#responsive-design)
4. [Style Management](#style-management)
   - [File Structure](#file-structure)
   - [Adding New Components](#adding-new-components)

## Design Tokens

### Colors

The color system is defined in `tailwind.config.ts` and follows a structured approach:

```typescript
colors: {
  dark: {
    DEFAULT: '#000000',
    secondary: '#121212',
    card: '#1a1a1a',
    border: '#2a2a2a',
    hover: '#333333',
  },
  light: {
    DEFAULT: '#ffffff',
    secondary: '#f4f4f4',
    card: '#f8f8f8',
    border: '#e0e0e0',
    hover: '#eeeeee',
  },
  accent: {
    DEFAULT: '#c6fb50',
  },
  brand: {
    DEFAULT: '#7645fc',
  },
  primary: {
    DEFAULT: '#7645fc',
  },
  text: {
    DEFAULT: '#000000',
    light: '#585254',
  },
}
```

#### Usage Guidelines:

- **Brand Colors**: Use `brand` for primary brand elements and `accent` for highlights and accents
- **Light/Dark Mode**: Use the appropriate `light` or `dark` variants based on the color mode
- **Text Colors**: Use `text` for body text and `text-light` for secondary text

### Typography

Typography is defined with responsive sizes using `clamp()` for fluid typography:

```typescript
fontSize: {
  'base': 'clamp(1.125rem, 1.2vw + 0.9rem, 1.25rem)',
  'h1': 'clamp(2.5rem, 5vw + 1.5rem, 4.5rem)',
  'h2': 'clamp(2rem, 3vw + 1.5rem, 3rem)',
  'h3': 'clamp(1.5rem, 2vw + 1.25rem, 2.25rem)',
}
```

#### Usage Guidelines:

- Use semantic heading classes (`text-h1`, `text-h2`, `text-h3`) for headings
- Use `text-base` for body text
- For smaller text, use Tailwind's built-in text sizes (`text-sm`, `text-xs`)

### Spacing

Custom spacing values are defined for consistent spacing throughout the application:

```typescript
spacing: {
  'xs': '0.25rem',
  'sm': '0.5rem',
  'md': '1rem',
  'lg': '2rem',
  'xl': '4rem',
}
```

#### Usage Guidelines:

- Use these spacing values for margins, padding, and gaps
- For consistent vertical rhythm, use `mb-4`, `mb-6`, `mb-8`, etc.

### Breakpoints

The project uses Tailwind's default breakpoints with a custom `2xl` breakpoint:

```typescript
screens: {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
}
```

## Components

### Layout Components

#### Container

The `Container` component (`components/ui/Container.tsx`) provides consistent width constraints:

```tsx
<Container size="xl">
  {/* Content */}
</Container>
```

Available sizes:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px (default)
- `full`: 100%

#### Section

The `Section` component (`components/ui/Section.tsx`) provides consistent section styling:

```tsx
<Section background="light" containerSize="xl">
  {/* Content */}
</Section>
```

Available backgrounds:
- `light` (default)
- `light-secondary`
- `dark`
- `dark-secondary`
- `accent`
- `brand`

### UI Components

#### Button

The `Button` component (`components/ui/Button.tsx`) provides consistent button styling:

```tsx
<Button 
  variant="primary" 
  size="md" 
  href="/contact"
>
  Contact Me
</Button>
```

Available variants:
- `primary` (default)
- `secondary`
- `outline`
- `accent`
- `brand`

Available sizes:
- `sm`
- `md` (default)
- `lg`

#### VideoPlayer

The `VideoPlayer` component (`components/ui/VideoPlayer.tsx`) provides consistent video player styling:

```tsx
<VideoPlayer 
  videoUrl="https://example.com/video.mp4" 
  posterUrl="https://example.com/poster.jpg"
  aspectRatio="video"
/>
```

Available aspect ratios:
- `video` (16:9, default)
- `square` (1:1)
- `vertical` (9:16)

## Best Practices

### Using Tailwind Classes

1. **Prefer component abstractions** over repeated Tailwind classes
2. **Use utility-first approach** for one-off styling needs
3. **Extract components** when patterns repeat across the codebase
4. **Use the `cn()` utility** from `lib/utils.ts` to conditionally apply classes

Example:
```tsx
import { cn } from '@/lib/utils';

function MyComponent({ className }) {
  return (
    <div className={cn(
      'base-styles-here',
      className
    )}>
      {/* Content */}
    </div>
  );
}
```

### Dark Mode

The project uses Tailwind's `class` strategy for dark mode. To support dark mode:

1. Use color tokens that have dark mode variants
2. Use the `dark:` prefix for dark mode specific styles
3. Add `transition-colors duration-200` for smooth transitions between modes

Example:
```html
<div className="bg-light dark:bg-dark text-dark dark:text-light transition-colors duration-200">
  Content
</div>
```

### Responsive Design

1. Use the mobile-first approach
2. Add responsive variants using Tailwind's breakpoint prefixes
3. Use fluid typography and responsive spacing

Example:
```html
<div className="px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
  <h1 className="text-h1">Heading</h1>
  <p className="text-base">Content</p>
</div>
```

## Style Management

### File Structure

```
├── app/
│   ├── globals.css         # Global styles and custom utilities
│   └── styleguide/         # Style guide page
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Container.tsx
│   │   ├── Section.tsx
│   │   └── ...
│   ├── layout/            # Layout components
│   └── portfolio/         # Domain-specific components
├── lib/
│   └── utils.ts           # Utility functions including cn()
├── tailwind.config.ts     # Tailwind configuration
└── docs/
    └── STYLE_GUIDE.md     # This document
```

### Adding New Components

When adding new components:

1. **Determine the component type**:
   - UI component: Goes in `components/ui/`
   - Layout component: Goes in `components/layout/`
   - Domain-specific component: Goes in a domain folder

2. **Follow the component pattern**:
   - Use TypeScript interfaces for props
   - Use the `cn()` utility for class merging
   - Accept a `className` prop for customization
   - Document the component in this style guide

3. **Update the style guide page**:
   - Add the component to the style guide page
   - Showcase all variants and sizes

## Visual Style Guide

A live style guide is available at `/styleguide` which showcases all components and design tokens in one place. 