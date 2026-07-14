/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './.storybook/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0E7C66',
          soft: '#E6F4F1',
        },
        ink: {
          primary: '#14171F',
          secondary: '#5B6472',
          muted: '#9AA2B1',
          faint: '#C2C8D2',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F7F8FA',
        },
        border: {
          DEFAULT: '#E4E7EC',
        },
        danger: {
          DEFAULT: '#EF4444',
          soft: '#FEF2F2',
        },
        project: {
          banking: '#0E7C66',
          tupi: '#2754C5',
          board: '#B45309',
          regplus: '#6E3AAE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};