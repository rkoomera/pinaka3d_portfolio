# Pinaka3D Portfolio

A modern, optimized portfolio website built with Next.js, showcasing motion design and web development projects.

## Features

- **Optimized Performance**: Implements best practices for web performance
- **Responsive Design**: Looks great on all devices
- **Custom Cursor**: Smooth, interactive cursor with magnetic effect
- **Dark/Light Mode**: Theme switching with system preference detection
- **PWA Support**: Progressive Web App capabilities for offline access
- **SEO Optimized**: Structured data, sitemaps, and metadata for better search engine visibility

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Performance Optimizations

This project includes several performance optimizations:

### Image Optimization
- Next.js Image component with lazy loading
- WebP and AVIF format support
- Responsive image sizes

### Font Optimization
- Font preloading and display swap
- Google Fonts with preconnect

### Code Optimization
- Code splitting and tree shaking
- Dynamic imports for large components
- Bundle size analysis

### Caching Strategy
- Service worker for offline support
- Optimized caching headers
- Static asset caching

## Build and Analyze

To build the project for production:

```bash
npm run build
```

To analyze the bundle size:

```bash
npm run analyze
```

## Lighthouse Performance

Run a Lighthouse audit to check performance:

```bash
npm run lighthouse
```

## PWA Support

The project includes Progressive Web App support with:
- Web manifest
- Service worker for offline caching
- Installable on supported devices

## SEO

SEO optimizations include:
- JSON-LD structured data
- Optimized meta tags
- Sitemap generation
- Robots.txt configuration

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [GSAP Animation Library](https://greensock.com/gsap/)
- [Framer Motion](https://www.framer.com/motion/)
- [Supabase](https://supabase.io/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
