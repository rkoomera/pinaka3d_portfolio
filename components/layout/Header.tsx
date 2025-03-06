// components/layout/Header.tsx
'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useTheme } from '@/components/theme/ThemeProvider';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  const logoSrc = theme === 'dark' 
    ? "https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-images//pinaka_logo_dark.svg"
    : "https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-images//pinaka_logo.svg";

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <Container size="full">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center">
            <div className="relative" data-hover>
              <div data-hover-bounds className="absolute inset-0"></div>
              <Image 
                src={logoSrc}
                alt="Ravi Koomera - Motion Designer & Creative Developer" 
                width={50}
                height={48}
                style={{ height: 'auto' }}
                priority
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <nav>
              <ul className="flex space-x-8">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      href={item.path} 
                      className="text-gray-800 dark:text-gray-200 hover:text-brand dark:hover:text-brand-light transition-colors block px-1"
                      aria-label={`Navigate to ${item.label} page`}
                    >
                      <div className="relative" data-hover>
                        <div data-hover-bounds className="absolute inset-0 pointer-events-none"></div>
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button 
              className="text-gray-800 dark:text-gray-200 hover:text-brand dark:hover:text-brand-light transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open mobile menu"
            >
              <div className="relative" data-hover>
                <div data-hover-bounds className="absolute inset-0 pointer-events-none"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 md:hidden transition-colors duration-200">
          <Container size="full">
            <div className="flex justify-end py-4">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-800 dark:text-gray-200 hover:text-brand dark:hover:text-brand-light transition-colors"
                aria-label="Close mobile menu"
              >
                <div className="relative" data-hover>
                  <div data-hover-bounds className="absolute inset-0 pointer-events-none"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </button>
            </div>
            <nav className="flex flex-col space-y-8 py-8">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className="text-xl text-gray-800 dark:text-gray-200 hover:text-brand dark:hover:text-brand-light transition-colors block"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label={`Navigate to ${item.label} page`}
                >
                  <div className="relative" data-hover>
                    <div data-hover-bounds className="absolute inset-0 pointer-events-none"></div>
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}