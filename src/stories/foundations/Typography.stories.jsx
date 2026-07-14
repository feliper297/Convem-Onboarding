import { typography } from '../../design-system/tokens';

function TypeSample({ item }) {
  const family = item.family === 'display' ? typography.families.display : typography.families.sans;

  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 py-4 border-b border-border last:border-0 w-full max-w-3xl">
      <div className="w-32 shrink-0">
        <p className="text-xs font-semibold text-ink-secondary">{item.name}</p>
        <p className="text-xs text-ink-muted font-mono">{item.size} / {item.weight}</p>
      </div>
      <p
        style={{
          fontFamily: family,
          fontSize: item.size,
          fontWeight: item.weight,
          color: '#14171F',
        }}
      >
        {item.sample}
      </p>
    </div>
  );
}

export default {
  title: 'Foundations/Tipografia',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Famílias e escala tipográfica do portal. Display usa Space Grotesk; corpo e UI usam Inter.',
      },
    },
  },
};

export const Familias = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      {Object.entries(typography.families).map(([name, family]) => (
        <div key={name} className="p-4 rounded-xl bg-surface border border-border">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">{name}</p>
          <p className="text-2xl" style={{ fontFamily: family, color: '#14171F' }}>
            Portal de Onboarding Convem
          </p>
          <p className="text-xs text-ink-faint font-mono mt-1">{family}</p>
        </div>
      ))}
    </div>
  ),
};

export const Escala = {
  render: () => (
    <div className="w-full">
      {typography.scale.map((item) => (
        <TypeSample key={item.name} item={item} />
      ))}
    </div>
  ),
};
