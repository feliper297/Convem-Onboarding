import React, { useMemo } from 'react';
import { Search, Bell, Plus, LogOut, Menu } from 'lucide-react';
import { NAV_ITEMS } from '../../data/navigation';
import Breadcrumb from '../ui/Breadcrumb';
import UserAvatar from '../ui/UserAvatar';

function isApplePlatform() {
  if (typeof navigator === 'undefined') return false;
  const platform = navigator.userAgentData?.platform || navigator.platform || '';
  return /mac|iphone|ipad|ipod/i.test(platform);
}

function Header({
  route,
  setRoute,
  onOpenSearch,
  onOpenNewProject,
  onLogout,
  onOpenMobileNav,
  currentProject,
  userName,
  userAvatarUrl,
}) {
  const searchShortcut = useMemo(() => (isApplePlatform() ? '⌘K' : 'Ctrl+K'), []);

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
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-3 sm:gap-2.5 sm:px-4 lg:px-5">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="btn-icon shrink-0 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={18} />
      </button>

      <div className="min-w-0 flex-1 overflow-hidden">
        <Breadcrumb items={crumbs} />
      </div>

      <button type="button" onClick={onOpenNewProject} className="btn-primary shrink-0">
        <Plus size={15} strokeWidth={2.25} />
        Novo projeto
      </button>

      <button
        type="button"
        onClick={onOpenSearch}
        className="hidden items-center gap-2 rounded-md border border-border bg-surface-subtle px-3 py-1.5 text-[13px] text-ink-muted transition-colors hover:text-ink-secondary sm:flex"
      >
        <Search size={14} />
        <span>Buscar</span>
        <kbd className="ml-2 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
          {searchShortcut}
        </kbd>
      </button>

      <button type="button" className="btn-icon hidden sm:inline-flex" aria-label="Notificações">
        <Bell size={16} />
      </button>

      <button type="button" onClick={onLogout} className="btn-secondary hidden shrink-0 sm:inline-flex">
        <LogOut size={14} />
        Sair
      </button>

      <button type="button" onClick={onLogout} className="btn-icon sm:hidden" aria-label="Sair">
        <LogOut size={16} />
      </button>

      <button
        type="button"
        onClick={() => setRoute({ view: 'profile' })}
        className="shrink-0 rounded-full transition-opacity hover:opacity-90"
        aria-label="Perfil"
      >
        <UserAvatar name={userName} avatarUrl={userAvatarUrl} size="sm" />
      </button>
    </header>
  );
}

export default Header;
