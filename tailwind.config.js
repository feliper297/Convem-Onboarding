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
          DEFAULT: '#0B6B58',
          dark: '#095C4C',
          soft: '#E8F3F0',
        },
        ink: {
          primary: '#111827',
          secondary: '#4B5563',
          muted: '#9CA3AF',
          faint: '#D1D5DB',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F3F4F6',
          subtle: '#F9FAFB',
        },
        border: {
          DEFAULT: '#E5E7EB',
          strong: '#D1D5DB',
        },
        danger: {
          DEFAULT: '#DC2626',
          soft: '#FEF2F2',
        },
        project: {
          banking: '#0B6B58',
          tupi: '#1D4ED8',
          board: '#B45309',
          regplus: '#6D28D9',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(17, 24, 39, 0.05)',
        elevated: '0 4px 12px rgba(17, 24, 39, 0.08)',
      },
    },
  },
  plugins: [],
};
