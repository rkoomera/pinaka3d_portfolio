import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
        },
        text: {
          DEFAULT: '#1f2937',
          light: '#6b7280',
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
        'base': 'clamp(1rem, 1vw + 0.75rem, 1.125rem)',
        'h1': 'clamp(2rem, 5vw + 1rem, 4rem)',
        'h2': 'clamp(1.5rem, 3vw + 1rem, 2.5rem)',
        'h3': 'clamp(1.25rem, 2vw + 1rem, 1.75rem)',
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
    },
  },
  plugins: [],
} satisfies Config;