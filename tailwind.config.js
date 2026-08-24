/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FAFAF9',
        surface: '#FFFFFF',
        stone: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B',
        },
        // Refined whisper pastel accents - soft, desaturated, minimal
        pastel: {
          sage: {
            bg: '#F2F9F5',
            text: '#1B633E',
            border: '#D3ECDF',
            dot: '#10B981',
          },
          peach: {
            bg: '#FFF7F2',
            text: '#9A3412',
            border: '#FFDEC9',
            dot: '#F97316',
          },
          lavender: {
            bg: '#F7F6FF',
            text: '#5B4EB3',
            border: '#E3E0FE',
            dot: '#8B5CF6',
          },
          sky: {
            bg: '#F3F9FD',
            text: '#0369A1',
            border: '#CEE8F8',
            dot: '#0EA5E9',
          },
          butter: {
            bg: '#FEFDF0',
            text: '#854D0E',
            border: '#FBEFA4',
            dot: '#EAB308',
          },
          rose: {
            bg: '#FFF5F5',
            text: '#9F1239',
            border: '#FED7D7',
            dot: '#F43F5E',
          },
        },
        brand: {
          DEFAULT: '#18181B',
          primary: '#4F46E5',
          primaryLight: '#EEF2FF',
          accent: '#0D9488',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
