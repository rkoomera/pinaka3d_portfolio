import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        dark: {
          DEFAULT: '#121212',
          secondary: '#1a1a1a',
          card: '#1e1e1e',
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
          dark: '#a8e030',
        },
        brand: {
          DEFAULT: '#7645fc',
          light: '#9670ff',
          dark: '#5f35d9',
        },
        primary: {
          DEFAULT: '#7645fc',
          light: '#9670ff',
          dark: '#5f35d9',
        },
        text: {
          DEFAULT: '#1a1a1a',
          light: '#585254',
          dark: '#e0e0e0',
        },
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '2rem',
        'xl': '4rem',
      },
      fontSize: {
        'base': 'clamp(1.125rem, 1.2vw + 0.9rem, 1.25rem)',
        'h1': 'clamp(2.5rem, 5vw + 1.5rem, 4.5rem)',
        'h2': 'clamp(2rem, 3vw + 1.5rem, 3rem)',
        'h3': 'clamp(1.5rem, 2vw + 1.25rem, 2.25rem)',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(30px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0.9) translateY(30px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        scaleIn: 'scaleIn 0.4s ease-out forwards',
        fadeOut: 'fadeOut 0.3s ease-in forwards',
        scaleOut: 'scaleOut 0.4s ease-in forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;