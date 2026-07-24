import React, { useMemo, useState } from 'react';
import { Search, X, Pencil, Trash2, Building2 } from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';

function ProjectsTable({ projects, onEdit, onDelete }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) => p.name.toLowerCase().includes(q)
        || p.description?.toLowerCase().includes(q)
        || p.team?.lead?.toLowerCase().includes(q),
    );
  }, [projects, search]);

  if (!projects.length) {
    return (
      <EmptyState
        icon={Building2}
        title="Nenhum projeto cadastrado"
        description="Crie um projeto pelo botão Novo projeto no header."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-surface border border-border">
        <Search size={14} className="text-ink-muted shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou responsável…"
          className="flex-1 outline-none text-[13px] bg-transparent text-ink-primary"
        />
        {search && (
          <button type="button" onClick={() => setSearch('')} className="text-ink-faint">
            <X size={13} />
          </button>
        )}
      </div>

      <div className="table-shell">
        <table className="w-full text-left table-fixed">
          <colgroup>
            <col className="w-[42%]" />
            <col className="w-[18%]" />
            <col className="w-[12%]" />
            <col className="w-[28%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-border">
              {['Projeto', 'Responsável', 'Trilha', 'Ações'].map((h) => (
                <th
                  key={h}
                  className="text-[11px] font-semibold uppercase tracking-wide px-4 py-3 text-ink-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-ink-muted">
                    Nenhum projeto encontrado para &quot;{search}&quot;.
                  </td>
                </tr>
              ) : (
                filtered.map((project, i) => {
                  const Icon = project.icon;
                  return (
                    <tr
                      key={project.id}
                      className={i === 0 ? '' : 'border-t border-border'}
                    >
                      <td className="px-4 py-3.5 align-top">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span
                            className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 border"
                            style={{ background: project.soft, borderColor: `${project.color}22` }}
                          >
                            <Icon size={16} color={project.color} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold text-ink-primary break-words">
                              {project.name}
                            </p>
                            {(project.tagline || project.description) && (
                              <p className="text-[11.5px] text-ink-secondary break-words [overflow-wrap:anywhere] whitespace-normal mt-0.5 leading-snug">
                                {project.tagline || project.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-ink-secondary whitespace-nowrap">
                        {project.team?.lead || '—'}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-ink-secondary tabular-nums">
                        {project.trilha?.length || 0} itens
                      </td>
                      <td className="px-4 py-3.5 align-top">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit(project)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold text-brand bg-brand-soft border border-brand/20 hover:opacity-90"
                          >
                            <Pencil size={13} />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(project)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold text-red-600 bg-red-50 border border-red-100 hover:opacity-90"
                          >
                            <Trash2 size={13} />
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProjectsTable;
