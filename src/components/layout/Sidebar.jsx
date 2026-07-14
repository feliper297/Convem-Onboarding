import React from 'react';
import { Home, Settings, User, Sparkles } from 'lucide-react';

function Sidebar({ route, setRoute, projects }) {
  const NavButton = ({ active, icon: Icon, label, onClick }) => (
    <button onClick={onClick} className="group w-full flex items-center gap-2.5 rounded-lg text-[13.5px] font-medium transition-colors px-3 py-2.5" style={{ background: active ? "#E6F4F1" : "transparent", color: active ? "#0E7C66" : "#5B6472" }} onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#F2F4F7"; }} onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
      {Icon && <Icon size={16} className="shrink-0" />}<span className="truncate">{label}</span>
    </button>
  );
  return (
    <aside className="sticky top-0 h-screen flex flex-col shrink-0 w-[302px]" style={{ background: "#FFFFFF", borderRight: "1px solid #E4E7EC" }}>
      <div className="flex items-center px-4 h-16 shrink-0" style={{ borderBottom: "1px solid #E4E7EC" }}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: "#0E7C66" }}><Sparkles size={15} color="#fff" /></div>
          <span className="text-[14px] font-semibold tracking-tight" style={{ color: "#14171F", fontFamily: "'Space Grotesk', sans-serif" }}>Portal Onboarding</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2.5 py-4 flex flex-col gap-1">
        <NavButton active={route.view === "dashboard"} icon={Home} label="Dashboard" onClick={() => setRoute({ view: "dashboard" })} />
        <div className="mt-4 mb-1 px-3"><span className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: "#9AA2B1" }}>Projetos</span></div>
        {projects.map((p) => {
          const Icon = p.icon;
          const active = route.view === "project" && route.projectId === p.id;
          return (
            <button key={p.id} onClick={() => setRoute({ view: "project", projectId: p.id, tab: "overview" })} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors" style={{ background: active ? "#F2F4F7" : "transparent", color: active ? "#14171F" : "#5B6472" }} onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#F7F8FA"; }} onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
              <span className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: active ? p.color : p.soft }}><Icon size={13} color={active ? "#fff" : p.color} /></span>
              <span className="truncate">{p.name}</span>
            </button>
          );
        })}
      </div>
      <div className="px-2.5 py-3 flex flex-col gap-1" style={{ borderTop: "1px solid #E4E7EC" }}>
        <NavButton active={route.view === "settings"} icon={Settings} label="Configurações" onClick={() => setRoute({ view: "settings" })} />
        <NavButton active={route.view === "profile"} icon={User} label="Perfil" onClick={() => setRoute({ view: "profile" })} />
      </div>
    </aside>
  );
}

export default Sidebar;
