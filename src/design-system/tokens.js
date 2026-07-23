export const colors = {
  brand: { DEFAULT: '#0B6B58', dark: '#095C4C', soft: '#E8F3F0' },
  ink: { primary: '#111827', secondary: '#4B5563', muted: '#9CA3AF', faint: '#D1D5DB' },
  surface: { DEFAULT: '#FFFFFF', muted: '#F3F4F6', subtle: '#F9FAFB' },
  border: '#E5E7EB',
  danger: { DEFAULT: '#DC2626', soft: '#FEF2F2' },
  projects: {
    banking: { color: '#0B6B58', soft: '#E8F3F0' },
    tupi: { color: '#1D4ED8', soft: '#EFF6FF' },
    board: { color: '#B45309', soft: '#FFFBEB' },
    regplus: { color: '#6D28D9', soft: '#F5F3FF' },
  },
};

export const typography = {
  families: {
    sans: 'IBM Plex Sans, system-ui, sans-serif',
    mono: 'IBM Plex Mono, ui-monospace, monospace',
  },
  scale: [
    { name: 'Caption', size: '12px', weight: 500, sample: 'Label de formulário' },
    { name: 'Body SM', size: '13px', weight: 400, sample: 'Texto de interface e inputs' },
    { name: 'Body', size: '14px', weight: 400, sample: 'Parágrafo padrão do portal' },
    { name: 'Body MD', size: '15px', weight: 600, sample: 'Título de empty state' },
    { name: 'Heading SM', size: '14px', weight: 600, sample: 'Título de modal' },
    { name: 'Display', size: '20px', weight: 600, sample: 'Título de página' },
  ],
};

export const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48];
