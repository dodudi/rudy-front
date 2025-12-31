/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rudy: {
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
          dark: '#1a0a0f',
          darker: '#0f0508',
        },
        ruby: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#e11d48',
          500: '#be123c',
          600: '#9f1239',
          700: '#881337',
          800: '#701a36',
          900: '#5c1d33',
          950: '#3d0a1f',
        },
        gold: {
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
        },
      },
      backgroundImage: {
        'rudy-gradient': 'linear-gradient(135deg, #450a0a 0%, #1a0a0f 100%)',
        'rudy-gradient-hover': 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)',
      },
    },
  },
  plugins: [],
}
