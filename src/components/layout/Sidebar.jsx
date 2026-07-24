import React from 'react';
import { Home, Settings, User, LayoutGrid, LayoutDashboard, X } from 'lucide-react';

import { canManageBackOffice } from '../../utils/permissions';

function Sidebar({ route, setRoute, projects, profile, mobileOpen = false, onCloseMobile }) {
  const showBackOffice = canManageBackOffice(profile);

  const navigate = (next) => {
    setRoute(next);
    onCloseMobile?.();
  };

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
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex h-screen w-[248px] shrink-0 flex-col border-r border-border bg-surface transition-transform duration-200 ease-out',
          'lg:sticky lg:top-0 lg:z-auto lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
          <div className="flex min-w-0 items-center gap-2.5 overflow-hidden">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand">
              <LayoutGrid size={14} color="#fff" strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
            <span className="block truncate text-[13px] font-semibold tracking-tight text-ink-primary">
              Portal Onboarding
            </span>
              <span className="block truncate text-[10px] text-ink-muted">Ambiente corporativo</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="btn-icon lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3">
          <NavButton
            active={route.view === 'dashboard'}
            icon={Home}
            label="Dashboard"
            onClick={() => navigate({ view: 'dashboard' })}
          />
          {showBackOffice && (
            <NavButton
              active={route.view === 'backoffice'}
              icon={LayoutDashboard}
              label="BackOffice"
              onClick={() => navigate({ view: 'backoffice' })}
            />
          )}

          <div className="mb-1 mt-4 px-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
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
                onClick={() => navigate({ view: 'project', projectId: p.id, tab: 'overview' })}
                className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors ${
                  active
                    ? 'bg-surface-muted text-ink-primary'
                    : 'text-ink-secondary hover:bg-surface-subtle'
                }`}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded border"
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

        <div className="flex flex-col gap-0.5 border-t border-border px-2 py-2.5">
          <NavButton
            active={route.view === 'settings'}
            icon={Settings}
            label="Configurações"
            onClick={() => navigate({ view: 'settings' })}
          />
          <NavButton
            active={route.view === 'profile'}
            icon={User}
            label="Perfil"
            onClick={() => navigate({ view: 'profile' })}
          />
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
