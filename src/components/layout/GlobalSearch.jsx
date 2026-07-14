import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

function GlobalSearch({ open, onClose, onPick, projects }) {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 30); }, [open]);
  if (!open) return null;
  const results = [];
  if (q.trim().length > 0) {
    const ql = q.toLowerCase();
    projects.forEach((p) => {
      if (p.name.toLowerCase().includes(ql) || p.tagline.toLowerCase().includes(ql)) results.push({ type: "Projeto", label: p.name, sub: p.tagline, onClick: () => onPick({ view: "project", projectId: p.id, tab: "overview" }) });
      p.glossario.forEach((g) => { if (g.term.toLowerCase().includes(ql)) results.push({ type: "Glossário · " + p.name, label: g.term, sub: g.def, onClick: () => onPick({ view: "project", projectId: p.id, tab: "glossario" }) }); });
      p.pessoas.forEach((pe) => { if (pe.name.toLowerCase().includes(ql)) results.push({ type: "Time · " + p.name, label: pe.name, sub: pe.role, onClick: () => onPick({ view: "project", projectId: p.id, tab: "pessoas" }) }); });
    });
  }
  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4" style={{ background: "rgba(20,23,31,0.5)" }} onClick={onClose}>
      <div className="w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden" style={{ background: "#fff" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 h-14" style={{ borderBottom: "1px solid #E4E7EC" }}>
          <Search size={17} color="#5B6472" />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar projetos, termos, pessoas do time…" className="flex-1 outline-none text-[14px]" style={{ color: "#14171F" }} />
          <kbd className="text-[10px] font-semibold px-1.5 py-1 rounded" style={{ background: "#F7F8FA", color: "#9AA2B1" }}>ESC</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {q.trim().length === 0 && <div className="px-3 py-8 text-center text-[13px]" style={{ color: "#9AA2B1" }}>Digite para buscar em todos os projetos</div>}
          {q.trim().length > 0 && results.length === 0 && <div className="px-3 py-8 text-center text-[13px]" style={{ color: "#9AA2B1" }}>Nenhum resultado para "{q}"</div>}
          {results.slice(0, 8).map((r, i) => (
            <button key={i} onClick={() => { r.onClick(); onClose(); }} className="w-full text-left px-3 py-2.5 rounded-xl flex flex-col gap-0.5 transition-colors" onMouseEnter={(e) => (e.currentTarget.style.background = "#F7F8FA")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#0E7C66" }}>{r.type}</span>
              <span className="text-[13.5px] font-semibold" style={{ color: "#14171F" }}>{r.label}</span>
              <span className="text-[12.5px] truncate" style={{ color: "#5B6472" }}>{r.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GlobalSearch;
