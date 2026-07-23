import React from 'react';
import { Home, Settings, User, LayoutGrid, LayoutDashboard } from 'lucide-react';

import { canManageBackOffice } from '../../utils/permissions';

function Sidebar({ route, setRoute, projects, profile }) {
  const showBackOffice = canManageBackOffice(profile);

  const NavButton = ({ active, icon: Icon, label, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={active ? 'nav-item-active' : 'nav-item'}
    >
      {Icon && <Icon size={16} className="shrink-0" strokeWidth={active ? 2.25 : 2} />}
      <span className="truncate">{label}</span>
    </button>
  );

  return (
    <aside className="sticky top-0 h-screen flex flex-col shrink-0 w-[248px] bg-surface border-r border-border">
      <div className="flex items-center px-4 h-14 shrink-0 border-b border-border">
        <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
          <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 bg-brand">
            <LayoutGrid size={14} color="#fff" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <span className="block text-[13px] font-semibold text-ink-primary truncate tracking-tight">
              Portal Onboarding
            </span>
            <span className="block text-[10px] text-ink-muted truncate">Ambiente corporativo</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-0.5">
        <NavButton
          active={route.view === 'dashboard'}
          icon={Home}
          label="Dashboard"
          onClick={() => setRoute({ view: 'dashboard' })}
        />
        {showBackOffice && (
          <NavButton
            active={route.view === 'backoffice'}
            icon={LayoutDashboard}
            label="BackOffice"
            onClick={() => setRoute({ view: 'backoffice' })}
          />
        )}

        <div className="mt-4 mb-1 px-2.5">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-ink-muted">
            Projetos
          </span>
        </div>

        {projects.map((p) => {
          const Icon = p.icon;
          const active = route.view === 'project' && route.projectId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setRoute({ view: 'project', projectId: p.id, tab: 'overview' })}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
                active
                  ? 'bg-surface-muted text-ink-primary'
                  : 'text-ink-secondary hover:bg-surface-subtle'
              }`}
            >
              <span
                className="w-6 h-6 rounded flex items-center justify-center shrink-0 border"
                style={{
                  background: active ? p.color : p.soft,
                  borderColor: active ? p.color : 'transparent',
                }}
              >
                <Icon size={13} color={active ? '#fff' : p.color} />
              </span>
              <span className="truncate">{p.name}</span>
            </button>
          );
        })}
      </div>

      <div className="px-2 py-2.5 flex flex-col gap-0.5 border-t border-border">
        <NavButton
          active={route.view === 'settings'}
          icon={Settings}
          label="Configurações"
          onClick={() => setRoute({ view: 'settings' })}
        />
        <NavButton
          active={route.view === 'profile'}
          icon={User}
          label="Perfil"
          onClick={() => setRoute({ view: 'profile' })}
        />
      </div>
    </aside>
  );
}

export default Sidebar;
