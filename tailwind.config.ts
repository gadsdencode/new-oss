// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Overture Brand Palette: Navy → Electric Blue → Aqua/Teal
        primary: {
          50: '#e6f7ff',
          100: '#daebff',
          200: '#b7dbff',
          300: '#a0c3f6',
          400: '#63a4ff',
          500: '#0B7CFF', // Electric Blue — brand primary
          600: '#006cee',
          700: '#0057cb',
          800: '#0042b5',
          900: '#003694',
          950: '#001272',
          DEFAULT: '#0B7CFF',
        },
        secondary: {
          50: '#e4fbf8',
          100: '#d8f0ec',
          200: '#b2e4de',
          300: '#9bcdc7',
          400: '#50b7ad',
          500: '#00D6C9', // Aqua/Teal — brand secondary
          600: '#008d82',
          700: '#00756b',
          800: '#006159',
          900: '#004f48',
          950: '#00332d',
          DEFAULT: '#00D6C9',
        },
        accent: {
          50: '#e4f9ff',
          100: '#d9edfb',
          200: '#b3dffb',
          300: '#9dc8e3',
          400: '#57addf',
          500: '#11B7FF', // Cyan — brand accent
          600: '#007ec3',
          700: '#0068a5',
          800: '#005490',
          900: '#004575',
          950: '#002756',
          DEFAULT: '#11B7FF',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // Overture brand gradients
        brand: {
          gradient: 'linear-gradient(135deg, #0B7CFF 0%, #11B7FF 50%, #00D6C9 100%)',
          gradientSoft: 'linear-gradient(135deg, rgba(11,124,255,0.1) 0%, rgba(17,183,255,0.1) 50%, rgba(0,214,201,0.1) 100%)',
          glow: '0 0 20px rgba(11,124,255,0.3), 0 0 40px rgba(0,214,201,0.2)',
          glowStrong: '0 0 30px rgba(11,124,255,0.5), 0 0 60px rgba(0,214,201,0.3)',
        },
        // Legacy support
        aiGradient: 'linear-gradient(135deg, #0B7CFF, #00D6C9)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'none': 'none',
        // Overture brand shadows
        'brand': '0 4px 14px rgba(11, 124, 255, 0.25), 0 2px 8px rgba(0, 214, 201, 0.15)',
        'brand-lg': '0 10px 30px rgba(11, 124, 255, 0.3), 0 4px 12px rgba(0, 214, 201, 0.2)',
        'brand-xl': '0 20px 50px rgba(11, 124, 255, 0.35), 0 8px 20px rgba(0, 214, 201, 0.25)',
        'glow': '0 0 15px rgba(11, 124, 255, 0.3)',
        'glow-lg': '0 0 25px rgba(11, 124, 255, 0.4), 0 0 50px rgba(0, 214, 201, 0.2)',
        // Legacy support
        'ai-glow': '0 0 15px rgba(11, 124, 255, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        // Premium brand animations
        'gradient-flow': 'gradientFlow 5s ease infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        gradientFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      backgroundSize: {
        '200': '200% 200%',
      },
    },
  },
  plugins: [
    // Add any Tailwind plugins here
    // Example: require('@tailwindcss/forms'),
    // Example: require('@tailwindcss/typography'),
  ],
  // Dark mode configuration
  darkMode: 'class', // or 'class' if you want to use class-based dark mode
}

export default config