import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, User } from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';
import { formatRelativeTime } from '../../utils/relativeTime';
import { RoleBadge, ProjectBadge, UserAvatar, Toggle } from './backofficeUi';

function ActionMenu({ user, onViewProfile, onEditRole, onToggleActive }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const items = [
    { label: 'Editar role', action: () => { onEditRole(user); setOpen(false); } },
    {
      label: user.isActive ? 'Desativar' : 'Ativar',
      action: () => { onToggleActive(user); setOpen(false); },
      danger: user.isActive,
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-md text-ink-muted hover:bg-surface-muted transition-colors"
        aria-label="Mais ações"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 min-w-[160px] rounded-lg py-1 shadow-elevated bg-surface border border-border">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors hover:bg-surface-muted ${
                item.danger ? 'text-danger' : 'text-ink-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UsersTable({
  users,
  projects,
  onViewProfile,
  onEditRole,
  onToggleActive,
  onToggleStatus,
}) {
  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p]));

  if (!users.length) {
    return <EmptyState icon={User} title="Nenhum usuário encontrado" description="Ajuste os filtros ou a busca." />;
  }

  return (
    <div className="table-shell">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="bg-surface-subtle border-b border-border">
              {['Usuário', 'Role', 'Projetos', 'Último acesso', 'Status', 'Ações'].map((h) => (
                <th
                  key={h}
                  className="text-[11px] font-medium uppercase tracking-wide px-4 py-2.5 text-ink-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => {
              const assigned = user.projectIds.map((id) => projectMap[id]).filter(Boolean);
              const visible = assigned.slice(0, 2);
              const overflow = assigned.length - visible.length;

              return (
                <tr
                  key={user.id}
                  className={i > 0 ? 'border-t border-border' : ''}
                >
                  <td className={`px-4 py-3 ${!user.isActive ? 'opacity-60' : ''}`}>
                    <div className="flex items-center gap-2.5">
                      <UserAvatar name={user.fullName} avatarUrl={user.avatarUrl} />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium truncate text-ink-primary">
                          {user.fullName || 'Sem nome'}
                        </p>
                        <p className="text-xs truncate text-ink-secondary">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-4 py-3 ${!user.isActive ? 'opacity-60' : ''}`}>
                    <RoleBadge role={user.role} />
                  </td>
                  <td className={`px-4 py-3 ${!user.isActive ? 'opacity-60' : ''}`}>
                    <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                      {visible.length === 0 ? (
                        <span className="text-xs text-ink-faint">—</span>
                      ) : (
                        <>
                          {visible.map((p) => (
                            <ProjectBadge key={p.id} name={p.name} color={p.color} soft={p.soft} />
                          ))}
                          {overflow > 0 && (
                            <span className="text-[11px] font-medium text-ink-muted">+{overflow}</span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-xs whitespace-nowrap text-ink-secondary ${!user.isActive ? 'opacity-60' : ''}`}>
                    {formatRelativeTime(user.lastSignInAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Toggle on={user.isActive} onClick={() => onToggleStatus(user)} />
                      <span
                        className={`text-xs font-medium ${user.isActive ? 'text-brand' : 'text-ink-muted'}`}
                      >
                        {user.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </td>
                  <td className={`px-4 py-3 ${!user.isActive ? 'opacity-60' : ''}`}>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onViewProfile(user)}
                        className="text-xs font-medium px-3 py-1.5 rounded-md whitespace-nowrap btn-secondary text-brand border-brand/20 hover:bg-brand-soft"
                      >
                        Ver perfil
                      </button>
                      <ActionMenu
                        user={user}
                        onViewProfile={onViewProfile}
                        onEditRole={onEditRole}
                        onToggleActive={onToggleActive}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersTable;
