import React from 'react';



const STYLES = {

  admin: { className: 'badge-brand', label: 'Admin' },

  gestor: { className: 'badge bg-blue-50 text-blue-700', label: 'Gestor' },

  colaborador: { className: 'badge-neutral', label: 'Colaborador' },

};



export function RoleBadge({ role }) {

  const style = STYLES[role] || STYLES.colaborador;

  return <span className={style.className}>{style.label}</span>;

}



export function ProjectBadge({ name, color = '#0B6B58', soft = '#E8F3F0' }) {

  return (

    <span

      className="text-[10.5px] font-medium px-2 py-0.5 rounded whitespace-nowrap"

      style={{ background: soft, color }}

    >

      {name}

    </span>

  );

}



export function UserAvatar({ name, avatarUrl }) {

  const initials = (name || '?')

    .split(' ')

    .map((w) => w[0])

    .slice(0, 2)

    .join('')

    .toUpperCase();

  if (avatarUrl) {

    return <img src={avatarUrl} alt={name} className="w-9 h-9 rounded-full object-cover shrink-0" />;

  }

  return (

    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0 bg-brand">

      {initials}

    </div>

  );

}



export function Toggle({ on, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-10 h-5 rounded-full relative transition-colors shrink-0 border disabled:opacity-50 ${
        on ? 'bg-brand border-brand' : 'bg-surface-muted border-border-strong'
      }`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full transition-all shadow-sm ${
          on ? 'bg-white left-5' : 'bg-white border border-border-strong left-0.5'
        }`}
      />
    </button>
  );
}

