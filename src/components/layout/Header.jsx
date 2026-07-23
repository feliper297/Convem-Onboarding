import React, { useMemo } from 'react';
import { Search, Bell, Plus, LogOut } from 'lucide-react';
import { NAV_ITEMS } from '../../data/navigation';
import Breadcrumb from '../ui/Breadcrumb';
import UserAvatar from '../ui/UserAvatar';

function Header({
  route,
  setRoute,
  onOpenSearch,
  onOpenNewProject,
  onLogout,
  currentProject,
  userName,
  userAvatarUrl,
}) {
  const crumbs = useMemo(() => {
    const base = [{ label: 'Portal', onClick: () => setRoute({ view: 'dashboard' }) }];
    if (route.view === 'dashboard') return [{ label: 'Dashboard' }];
    if (route.view === 'backoffice') return [...base, { label: 'BackOffice' }];
    if (route.view === 'settings') return [...base, { label: 'Configurações' }];
    if (route.view === 'profile') return [...base, { label: 'Perfil' }];
    if (route.view === 'project' && currentProject) {
      const tabLabel = NAV_ITEMS.find((n) => n.id === route.tab)?.label || 'Visão Geral';
      return [
        ...base,
        {
          label: currentProject.name,
          onClick: () => setRoute({ view: 'project', projectId: currentProject.id, tab: 'overview' }),
        },
        { label: tabLabel },
      ];
    }
    return base;
  }, [route, currentProject, setRoute]);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2.5 h-14 px-4 lg:px-5 shrink-0 bg-surface border-b border-border">
      <Breadcrumb items={crumbs} />
      <div className="flex-1" />

      <button type="button" onClick={onOpenNewProject} className="btn-primary shrink-0">
        <Plus size={15} strokeWidth={2.25} />
        Novo projeto
      </button>

      <button
        type="button"
        onClick={onOpenSearch}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] bg-surface-subtle border border-border text-ink-muted hover:text-ink-secondary transition-colors"
      >
        <Search size={14} />
        <span>Buscar</span>
        <kbd className="ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface border border-border text-ink-muted">
          ⌘K
        </kbd>
      </button>

      <button type="button" className="btn-icon hidden sm:inline-flex">
        <Bell size={16} />
      </button>

      <button type="button" onClick={onLogout} className="btn-secondary hidden sm:inline-flex shrink-0">
        <LogOut size={14} />
        Sair
      </button>

      <button type="button" onClick={onLogout} className="btn-icon sm:hidden" aria-label="Sair">
        <LogOut size={16} />
      </button>

      <button
        type="button"
        onClick={() => setRoute({ view: 'profile' })}
        className="shrink-0 rounded-full hover:opacity-90 transition-opacity"
        aria-label="Perfil"
      >
        <UserAvatar name={userName} avatarUrl={userAvatarUrl} size="sm" />
      </button>
    </header>
  );
}

export default Header;
