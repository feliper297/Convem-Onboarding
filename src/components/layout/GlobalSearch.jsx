import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

function GlobalSearch({ open, onClose, onPick, projects }) {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  if (!open) return null;

  const results = [];
  if (q.trim().length > 0) {
    const ql = q.toLowerCase();
    projects.forEach((p) => {
      if (p.name.toLowerCase().includes(ql) || p.tagline.toLowerCase().includes(ql)) {
        results.push({
          type: 'Projeto',
          label: p.name,
          sub: p.tagline,
          onClick: () => onPick({ view: 'project', projectId: p.id, tab: 'overview' }),
        });
      }
      (p.glossario || []).forEach((g) => {
        if (g.term.toLowerCase().includes(ql)) {
          results.push({
            type: `Glossário · ${p.name}`,
            label: g.term,
            sub: g.def,
            onClick: () => onPick({ view: 'project', projectId: p.id, tab: 'glossario' }),
          });
        }
      });
      (p.pessoas || []).forEach((pe) => {
        if (pe.name.toLowerCase().includes(ql)) {
          results.push({
            type: `Time · ${p.name}`,
            label: pe.name,
            sub: pe.role,
            onClick: () => onPick({ view: 'project', projectId: p.id, tab: 'pessoas' }),
          });
        }
      });
    });
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4 bg-ink-primary/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-lg shadow-elevated overflow-hidden bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 h-12 border-b border-border">
          <Search size={16} className="text-ink-muted shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar projetos, termos, pessoas…"
            className="flex-1 outline-none text-sm text-ink-primary bg-transparent placeholder:text-ink-muted"
          />
          <kbd className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-muted border border-border text-ink-muted">
            ESC
          </kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-1.5">
          {q.trim().length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-ink-muted">
              Digite para buscar em todos os projetos
            </div>
          )}
          {q.trim().length > 0 && results.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-ink-muted">
              Nenhum resultado para &quot;{q}&quot;
            </div>
          )}
          {results.slice(0, 8).map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                r.onClick();
                onClose();
              }}
              className="w-full text-left px-3 py-2.5 rounded-md flex flex-col gap-0.5 hover:bg-surface-muted transition-colors"
            >
              <span className="text-[10px] font-medium uppercase tracking-wide text-brand">{r.type}</span>
              <span className="text-[13px] font-medium text-ink-primary">{r.label}</span>
              <span className="text-xs text-ink-secondary truncate">{r.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GlobalSearch;
