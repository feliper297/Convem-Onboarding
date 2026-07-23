import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Loading from '../../components/ui/Loading';
import KpiCards from './KpiCards';
import UsersToolbar from './UsersToolbar';
import UsersTable from './UsersTable';
import ProjectsTable from './ProjectsTable';
import { UserModals } from './UserModals';
import ProjectFormModal from '../../components/projects/ProjectFormModal';
import DeleteProjectModal from '../../components/projects/DeleteProjectModal';
import { computeBackofficeKpis } from '../../utils/backofficeMetrics';
import {
  fetchAdminUsers,
  updateUserRole,
  updateUserActive,
} from '../../services/adminService';

function BackOfficePage({
  projects,
  pushToast,
  onUpdateProject,
  onDeleteProject,
  projectSaving,
  projectDeleting,
  canManageUsers,
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState([]);
  const [progressRows, setProgressRows] = useState([]);
  const [trilhaCounts, setTrilhaCounts] = useState({});
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [profileUser, setProfileUser] = useState(null);
  const [editRoleUser, setEditRoleUser] = useState(null);
  const [deactivateUser, setDeactivateUser] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);

  const loadData = useCallback(async () => {
    const data = await fetchAdminUsers();
    setUsers(data.users);
    setProgressRows(data.progressRows);
    setTrilhaCounts(data.trilhaCounts);
  }, []);

  useEffect(() => {
    if (!canManageUsers) {
      setLoading(false);
      return undefined;
    }

    loadData()
      .catch((err) => {
        console.error(err);
        pushToast?.('Erro ao carregar dados do BackOffice.', 'default');
      })
      .finally(() => setLoading(false));

    return undefined;
  }, [loadData, pushToast, canManageUsers]);

  const kpis = useMemo(
    () => computeBackofficeKpis(users, progressRows, trilhaCounts),
    [users, progressRows, trilhaCounts],
  );

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((user) => {
      if (q && !user.fullName.toLowerCase().includes(q) && !user.email.toLowerCase().includes(q)) {
        return false;
      }
      if (roleFilter !== 'all' && user.role !== roleFilter) return false;
      if (projectFilter !== 'all' && !user.projectIds.includes(projectFilter)) return false;
      if (statusFilter === 'active' && !user.isActive) return false;
      if (statusFilter === 'inactive' && user.isActive) return false;
      return true;
    });
  }, [users, search, roleFilter, projectFilter, statusFilter]);

  const handleToggleStatus = async (user) => {
    const next = !user.isActive;
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: next } : u)));
    try {
      await updateUserActive(user.id, next);
      pushToast?.(next ? 'Usuário ativado.' : 'Usuário desativado.', 'success');
    } catch (err) {
      console.error(err);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: !next } : u)));
      pushToast?.('Erro ao atualizar status.', 'default');
    }
  };

  const handleSaveRole = async (role) => {
    if (!editRoleUser || saving) return;
    setSaving(true);
    try {
      await updateUserRole(editRoleUser.id, role);
      setUsers((prev) => prev.map((u) => (u.id === editRoleUser.id ? { ...u, role } : u)));
      pushToast?.('Role atualizada.', 'success');
      setEditRoleUser(null);
    } catch (err) {
      console.error(err);
      pushToast?.('Erro ao atualizar role.', 'default');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!deactivateUser || saving) return;
    const next = !deactivateUser.isActive;
    setSaving(true);
    try {
      await updateUserActive(deactivateUser.id, next);
      setUsers((prev) => prev.map((u) => (u.id === deactivateUser.id ? { ...u, isActive: next } : u)));
      pushToast?.(next ? 'Usuário reativado.' : 'Usuário desativado.', 'success');
      setDeactivateUser(null);
    } catch (err) {
      console.error(err);
      pushToast?.('Erro ao atualizar status.', 'default');
    } finally {
      setSaving(false);
    }
  };

  if (loading && canManageUsers) return <Loading />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">BackOffice</h1>
        <p className="page-subtitle">Gestão de usuários, projetos, permissões e métricas de onboarding.</p>
      </div>

      {canManageUsers && kpis.length > 0 && <KpiCards kpis={kpis} />}

      <div className="flex flex-col gap-3">
        <h2 className="section-title">Projetos</h2>
        <ProjectsTable
          projects={projects}
          onEdit={setEditingProject}
          onDelete={setDeletingProject}
        />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="section-title">Usuários</h2>
        {!canManageUsers ? (
          <p className="text-sm text-ink-secondary">
            A gestão de usuários está disponível apenas para administradores.
          </p>
        ) : (
          <>
            <UsersToolbar
              search={search}
              onSearch={setSearch}
              roleFilter={roleFilter}
              onRoleFilter={setRoleFilter}
              projectFilter={projectFilter}
              onProjectFilter={setProjectFilter}
              statusFilter={statusFilter}
              onStatusFilter={setStatusFilter}
              projects={projects}
            />
            <UsersTable
              users={filteredUsers}
              projects={projects}
              onViewProfile={setProfileUser}
              onEditRole={setEditRoleUser}
              onToggleActive={setDeactivateUser}
              onToggleStatus={handleToggleStatus}
            />
          </>
        )}
      </div>

      {canManageUsers && (
        <UserModals
          profileUser={profileUser}
          editRoleUser={editRoleUser}
          deactivateUser={deactivateUser}
          projects={projects}
          saving={saving}
          onCloseProfile={() => setProfileUser(null)}
          onCloseEditRole={() => setEditRoleUser(null)}
          onCloseDeactivate={() => setDeactivateUser(null)}
          onSaveRole={handleSaveRole}
          onConfirmDeactivate={handleConfirmDeactivate}
        />
      )}

      {editingProject && (
        <ProjectFormModal
          project={editingProject}
          saving={projectSaving}
          onSave={(data) => onUpdateProject(editingProject, data, () => setEditingProject(null))}
          onClose={() => setEditingProject(null)}
        />
      )}

      {deletingProject && (
        <DeleteProjectModal
          project={deletingProject}
          deleting={projectDeleting}
          onConfirm={() => onDeleteProject(deletingProject, () => setDeletingProject(null))}
          onClose={() => setDeletingProject(null)}
        />
      )}
    </div>
  );
}

export default BackOfficePage;
