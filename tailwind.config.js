/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F8F9FA',
          muted: '#F1F3F5',
          dark: '#0F172A',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#FBFBFB',
          card: '#FFFFFF',
          glass: 'rgba(255, 255, 255, 0.85)',
        },
        pastel: {
          mint: {
            light: '#ECFDF5',
            DEFAULT: '#A7F3D0',
            dark: '#059669',
            border: '#6EE7B7',
          },
          lavender: {
            light: '#F5F3FF',
            DEFAULT: '#DDD6FE',
            dark: '#7C3AED',
            border: '#C4B5FD',
          },
          peach: {
            light: '#FFF7ED',
            DEFAULT: '#FED7AA',
            dark: '#EA580C',
            border: '#FDBA74',
          },
          butter: {
            light: '#FEFCE8',
            DEFAULT: '#FEF08A',
            dark: '#CA8A04',
            border: '#FDE047',
          },
          sky: {
            light: '#F0F9FF',
            DEFAULT: '#BAE6FD',
            dark: '#0284C7',
            border: '#7DD3FC',
          },
          rose: {
            light: '#FFF1F2',
            DEFAULT: '#FECDD3',
            dark: '#E11D48',
            border: '#FDA4AF',
          },
          sand: {
            light: '#FAF8F5',
            DEFAULT: '#EAE6DF',
            dark: '#78716C',
            border: '#D6D3D1',
          }
        },
        brand: {
          primary: '#5B5BE6',
          primaryHover: '#4B4BC7',
          primaryLight: '#EEF0FF',
          dark: '#1E2337',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -1px rgba(28, 39, 60, 0.04), 0 1px 3px -1px rgba(28, 39, 60, 0.03)',
        'soft-md': '0 8px 24px -4px rgba(28, 39, 60, 0.06), 0 3px 6px -2px rgba(28, 39, 60, 0.03)',
        'soft-lg': '0 16px 36px -6px rgba(28, 39, 60, 0.08), 0 6px 12px -3px rgba(28, 39, 60, 0.04)',
        'pastel-glow': '0 10px 25px -5px rgba(91, 91, 230, 0.15)',
        'mint-glow': '0 10px 25px -5px rgba(16, 185, 129, 0.15)',
        'peach-glow': '0 10px 25px -5px rgba(249, 115, 22, 0.15)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
