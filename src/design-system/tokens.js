export const colors = {
  brand: { DEFAULT: '#0E7C66', soft: '#E6F4F1' },
  ink: { primary: '#14171F', secondary: '#5B6472', muted: '#9AA2B1', faint: '#C2C8D2' },
  surface: { DEFAULT: '#FFFFFF', muted: '#F7F8FA' },
  border: '#E4E7EC',
  danger: { DEFAULT: '#EF4444', soft: '#FEF2F2' },
  projects: {
    banking: { color: '#0E7C66', soft: '#E6F4F1' },
    tupi: { color: '#2754C5', soft: '#EAF0FD' },
    board: { color: '#B45309', soft: '#FDF1E3' },
    regplus: { color: '#6E3AAE', soft: '#F1EAFB' },
  },
};

export const typography = {
  families: {
    sans: 'Inter, sans-serif',
    display: 'Space Grotesk, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  scale: [
    { name: 'Caption', size: '12px', weight: 600, sample: 'Label de formulário' },
    { name: 'Body SM', size: '13px', weight: 400, sample: 'Texto de interface e inputs' },
    { name: 'Body', size: '14px', weight: 400, sample: 'Parágrafo padrão do portal' },
    { name: 'Body MD', size: '15px', weight: 600, sample: 'Título de empty state' },
    { name: 'Heading SM', size: '14px', weight: 700, sample: 'Título de modal' },
    { name: 'Display', size: '24px', weight: 700, sample: 'Título de página', family: 'display' },
  ],
};

export const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48];
