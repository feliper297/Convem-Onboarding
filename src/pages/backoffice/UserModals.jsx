import React, { useState } from 'react';
import { X, User, Shield } from 'lucide-react';
import { CrudModal, Field, ConfirmDeleteModal } from '../../components/crud';
import { RoleBadge, UserAvatar } from './backofficeUi';
import { formatRelativeTime } from '../../utils/relativeTime';

function ProfileModal({ user, projects, onClose }) {
  const assigned = projects.filter((p) => user.projectIds.includes(p.id));

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ background: 'rgba(14,17,25,0.70)', zIndex: 99999 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg shadow-2xl overflow-hidden"
        style={{ background: '#fff' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#E8F3F0' }}>
              <User size={14} color="#0B6B58" />
            </span>
            <p className="text-[14px] font-bold" style={{ color: 'var(--ink-primary)' }}>Perfil do usuário</p>
          </div>
          <button type="button" onClick={onClose} style={{ color: '#9CA3AF' }}><X size={18} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <UserAvatar name={user.fullName} avatarUrl={user.avatarUrl} />
            <div>
              <p className="text-[15px] font-bold" style={{ color: 'var(--ink-primary)' }}>{user.fullName}</p>
              <p className="text-[12.5px]" style={{ color: '#4B5563' }}>{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#9CA3AF' }}>Role</p>
              <RoleBadge role={user.role} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#9CA3AF' }}>Status</p>
              <p className="text-[13px] font-medium" style={{ color: user.isActive ? '#0B6B58' : '#EF4444' }}>
                {user.isActive ? 'Ativo' : 'Inativo'}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#9CA3AF' }}>Cargo</p>
              <p className="text-[13px]" style={{ color: 'var(--ink-primary)' }}>{user.cargo || '—'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#9CA3AF' }}>Último acesso</p>
              <p className="text-[13px]" style={{ color: 'var(--ink-primary)' }}>{formatRelativeTime(user.lastSignInAt)}</p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: '#9CA3AF' }}>Projetos atribuídos</p>
            {assigned.length === 0 ? (
              <p className="text-[13px]" style={{ color: '#9CA3AF' }}>Nenhum projeto atribuído.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {assigned.map((p) => (
                  <span
                    key={p.id}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: p.soft, color: p.color }}
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end px-6 py-4" style={{ borderTop: '1px solid #E5E7EB' }}>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold"
            style={{ background: '#F3F4F6', color: '#4B5563', border: '1px solid #E5E7EB' }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function EditRoleModal({ user, onSave, onClose, saving }) {
  const [role, setRole] = useState(user.role);

  return (
    <CrudModal
      project={{ color: '#0B6B58', soft: '#E8F3F0' }}
      title="Editar role"
      icon={Shield}
      onClose={onClose}
      onSave={() => onSave(role)}
      saveLabel={saving ? 'Salvando…' : 'Salvar'}
    >
      <p className="text-[13px]" style={{ color: '#4B5563' }}>
        Alterando permissão de <strong>{user.fullName}</strong>
      </p>
      <Field label="Role" required>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none"
          style={{ border: '1px solid #E5E7EB', color: 'var(--ink-primary)', background: '#fff' }}
        >
          <option value="admin">Administrador</option>
          <option value="gestor">Gestor</option>
          <option value="colaborador">Colaborador</option>
        </select>
      </Field>
    </CrudModal>
  );
}

export function UserModals({
  profileUser,
  editRoleUser,
  deactivateUser,
  projects,
  saving,
  onCloseProfile,
  onCloseEditRole,
  onCloseDeactivate,
  onSaveRole,
  onConfirmDeactivate,
}) {
  return (
    <>
      {profileUser && (
        <ProfileModal user={profileUser} projects={projects} onClose={onCloseProfile} />
      )}
      {editRoleUser && (
        <EditRoleModal
          user={editRoleUser}
          onSave={onSaveRole}
          onClose={onCloseEditRole}
          saving={saving}
        />
      )}
      {deactivateUser && (
        <ConfirmDeleteModal
          project={{ color: '#0B6B58' }}
          message={
            deactivateUser.isActive
              ? `Desativar o usuário "${deactivateUser.fullName}"? Ele não poderá mais acessar o portal.`
              : `Reativar o usuário "${deactivateUser.fullName}"?`
          }
          onConfirm={onConfirmDeactivate}
          onClose={onCloseDeactivate}
        />
      )}
    </>
  );
}
