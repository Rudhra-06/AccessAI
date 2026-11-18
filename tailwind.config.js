/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./popup.html",
    "./dashboard.html",
    "./onboarding.html",
    "./demo.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // AccessAI Official Design System Palette
        burgundy: {
          deep: '#421426',
          dark: '#70243E',
          accent: '#8E294B',
          50: '#FDF2F5',
          100: '#FBE6EC',
          200: '#F6CDD9',
          300: '#ED9EB5',
          400: '#DD648B',
          500: '#8E294B',
          600: '#70243E',
          700: '#5A1B32',
          800: '#421426',
          900: '#2F0D1B',
          DEFAULT: '#421426',
        },
        pink: {
          light: '#F4C7D5',
          pale: '#F9E8EE',
          50: '#FFF8FA',
          100: '#F9E8EE',
          200: '#F4C7D5',
          300: '#EFA6BD',
        },
        neon: {
          lime: '#D8FF56',
          lilac: '#D5A5FF',
        },
        app: {
          bg: '#FFF8FA',
          surface: '#FFFFFF',
          text: '#291923',
          secondary: '#806C77',
          border: '#F4C7D5',
          borderSubtle: '#F9E8EE',
        },
        // Semantic aliases
        brand: {
          50: '#FDF2F5',
          100: '#FBE6EC',
          200: '#F6CDD9',
          300: '#ED9EB5',
          400: '#DD648B',
          500: '#8E294B',
          600: '#70243E',
          700: '#5A1B32',
          800: '#421426',
          900: '#2F0D1B',
          DEFAULT: '#421426',
        },
        warm: {
          50: '#fdfbf7',
          100: '#f9f4ea',
          200: '#f2e8d3',
          300: '#e7d6b3',
          400: '#d9bd8d',
          500: '#cba16b',
          600: '#bc8755',
          700: '#9d6c46',
          800: '#7e573c',
          900: '#674733',
        },
        dyslexic: {
          bg: '#faf8f5',
          text: '#1a1a1a',
          tint: '#fdf5e6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        lexend: ['Lexend', 'sans-serif'],
        atkinson: ['"Atkinson Hyperlegible"', 'sans-serif'],
        opendyslexic: ['"OpenDyslexic"', 'sans-serif'],
        serif: ['"Merriweather"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(41, 25, 35, 0.04), 0 1px 3px rgba(41, 25, 35, 0.02)',
        'card-hover': '0 10px 25px -4px rgba(66, 20, 38, 0.08), 0 4px 10px -2px rgba(66, 20, 38, 0.04)',
        'glow-lime': '0 0 20px rgba(216, 255, 86, 0.45)',
        'glow-lilac': '0 0 20px rgba(213, 165, 255, 0.45)',
        'glow-burgundy': '0 4px 20px rgba(66, 20, 38, 0.22)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}
