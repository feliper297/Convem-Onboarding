import React, { useMemo } from 'react';
import { Search, Star, Bell, Plus, LogOut } from 'lucide-react';
import { NAV_ITEMS } from '../../data/navigation';
import Breadcrumb from '../ui/Breadcrumb';
import Tooltip from '../ui/Tooltip';

function Header({ route, setRoute, onOpenSearch, onOpenNewProject, onLogout, favorites, currentProject, userInitials }) {
  const crumbs = useMemo(() => {
    const base = [{ label: "Portal", onClick: () => setRoute({ view: "dashboard" }) }];
    if (route.view === "dashboard") return [{ label: "Dashboard" }];
    if (route.view === "settings") return [...base, { label: "Configurações" }];
    if (route.view === "profile") return [...base, { label: "Perfil" }];
    if (route.view === "project" && currentProject) {
      const tabLabel = NAV_ITEMS.find((n) => n.id === route.tab)?.label || "Visão Geral";
      return [...base, { label: currentProject.name, onClick: () => setRoute({ view: "project", projectId: currentProject.id, tab: "overview" }) }, { label: tabLabel }];
    }
    return base;
  }, [route, currentProject]);
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 h-16 px-4 lg:px-6 shrink-0" style={{ background: "#F7F8FA", borderBottom: "1px solid #E4E7EC" }}>
      <Breadcrumb items={crumbs} />
      <div className="flex-1" />
      <button
        onClick={onOpenNewProject}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white shrink-0 transition-opacity"
        style={{ background: "#0E7C66" }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = 0.88; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = 1; }}
      >
        <Plus size={15} /> Novo projeto
      </button>
      <button onClick={onOpenSearch} className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-colors" style={{ background: "#fff", border: "1px solid #E4E7EC", color: "#9AA2B1" }}>
        <Search size={14} /><span>Buscar…</span><kbd className="ml-3 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: "#F7F8FA" }}>⌘K</kbd>
      </button>
      <Tooltip label={`${favorites.length} favoritos`}>
        <button className="p-2 rounded-lg" style={{ background: "#fff", border: "1px solid #E4E7EC" }}><Star size={16} color="#B45309" fill={favorites.length ? "#B45309" : "none"} /></button>
      </Tooltip>
      <button className="p-2 rounded-lg" style={{ background: "#fff", border: "1px solid #E4E7EC" }}><Bell size={16} color="#5B6472" /></button>
      <button
        onClick={onLogout}
        className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold shrink-0 transition-colors"
        style={{ background: "#fff", border: "1px solid #E4E7EC", color: "#5B6472" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#F7F8FA"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
      >
        <LogOut size={14} /> Logout
      </button>
      <button
        onClick={onLogout}
        className="sm:hidden p-2 rounded-lg"
        style={{ background: "#fff", border: "1px solid #E4E7EC" }}
        aria-label="Logout"
      >
        <LogOut size={16} color="#5B6472" />
      </button>
      <button onClick={() => setRoute({ view: "profile" })} className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0" style={{ background: "#0E7C66" }}>{userInitials}</button>
    </header>
  );
}

export default Header;
