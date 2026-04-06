/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        surface: {
          900: '#0a0b14',
          800: '#0f1021',
          700: '#151628',
          600: '#1c1d34',
          500: '#23243e',
          400: '#2c2d4a',
        },
        accent: {
          cyan:   '#06b6d4',
          violet: '#8b5cf6',
          amber:  '#f59e0b',
          rose:   '#f43f5e',
          emerald:'#10b981',
        }
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':  'spin 8s linear infinite',
        'glow':       'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { transform: 'translateY(24px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        glow:    { from: { boxShadow: '0 0 20px rgba(99,102,241,0.2)' }, to: { boxShadow: '0 0 40px rgba(99,102,241,0.6)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
