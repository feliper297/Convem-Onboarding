import { colors } from '../../design-system/tokens';

const brandSwatches = [
  { name: 'Brand', token: 'brand.DEFAULT', hex: colors.brand.DEFAULT },
  { name: 'Brand Soft', token: 'brand.soft', hex: colors.brand.soft },
];

const inkSwatches = [
  { name: 'Ink Primary', token: 'ink.primary', hex: colors.ink.primary },
  { name: 'Ink Secondary', token: 'ink.secondary', hex: colors.ink.secondary },
  { name: 'Ink Muted', token: 'ink.muted', hex: colors.ink.muted },
  { name: 'Ink Faint', token: 'ink.faint', hex: colors.ink.faint },
];

const surfaceSwatches = [
  { name: 'Surface', token: 'surface.DEFAULT', hex: colors.surface.DEFAULT },
  { name: 'Surface Muted', token: 'surface.muted', hex: colors.surface.muted },
  { name: 'Border', token: 'border.DEFAULT', hex: colors.border },
];

const semanticSwatches = [
  { name: 'Danger', token: 'danger.DEFAULT', hex: colors.danger.DEFAULT },
  { name: 'Danger Soft', token: 'danger.soft', hex: colors.danger.soft },
];

const projectSwatches = Object.entries(colors.projects).map(([key, value]) => ({
  name: key.charAt(0).toUpperCase() + key.slice(1),
  token: `project.${key}`,
  hex: value.color,
  soft: value.soft,
}));

function SwatchGrid({ items, showSoft = false }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl">
      {items.map((item) => (
        <div key={item.name} className="flex flex-col gap-2">
          <div
            className="h-16 rounded-xl border border-border shadow-sm"
            style={{ background: item.hex }}
          />
          {showSoft && item.soft && (
            <div
              className="h-8 rounded-lg border border-border"
              style={{ background: item.soft }}
            />
          )}
          <div>
            <p className="text-sm font-semibold text-ink-primary">{item.name}</p>
            <p className="text-xs text-ink-muted font-mono">{item.token}</p>
            <p className="text-xs text-ink-faint font-mono">{item.hex}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default {
  title: 'Foundations/Cores',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Paleta de cores do Portal de Onboarding. Tokens centralizados em `src/design-system/tokens.js` e `tailwind.config.js`.',
      },
    },
  },
};

export const Marca = {
  render: () => <SwatchGrid items={brandSwatches} />,
};

export const Texto = {
  render: () => <SwatchGrid items={inkSwatches} />,
};

export const Superficies = {
  render: () => <SwatchGrid items={surfaceSwatches} />,
};

export const Semanticas = {
  render: () => <SwatchGrid items={semanticSwatches} />,
};

export const Projetos = {
  render: () => <SwatchGrid items={projectSwatches} showSoft />,
};
