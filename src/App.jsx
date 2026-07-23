import React, { useState, useEffect, useCallback } from 'react';
import useToasts from './hooks/useToasts';
import useAuth from './hooks/useAuth';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import GlobalSearch from './components/layout/GlobalSearch';
import ToastStack from './components/ui/ToastStack';
import Loading from './components/ui/Loading';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import ProjectPage from './pages/project/ProjectPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import BackOfficePage from './pages/backoffice/BackOfficePage';
import ProjectFormModal from './components/projects/ProjectFormModal';
import { slugify } from './data/projectDefaults';
import { fetchProjects, fetchProjectById, persistProject, updateProject, deleteProject } from './services/projectService';
import { canManageBackOffice } from './utils/permissions';
import {
  fetchTrilhaProgress,
  toggleTrilhaProgress,
} from './services/userService';

export default function App() {
  const { userId, userEmail, profile, loading, signIn, signUp, resendConfirmation, requestPasswordReset, completePasswordRecovery, pendingRecovery, signOut, refreshProfile, userName, userInitials, isAuthenticated, isSupabaseConfigured } = useAuth();
  const [authView, setAuthView] = useState('login');
  const [route, setRoute] = useState({ view: 'dashboard' });
  const [searchOpen, setSearchOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [projectSaving, setProjectSaving] = useState(false);
  const [projectDeleting, setProjectDeleting] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(isSupabaseConfigured);
  const [userDataLoading, setUserDataLoading] = useState(isSupabaseConfigured);
  const [projects, setProjects] = useState([]);
  const [completed, setCompleted] = useState({});
  const { toasts, push } = useToasts();

  const loadProjects = useCallback(async () => {
    const loaded = await fetchProjects();
    setProjects(loaded);
    return loaded;
  }, []);

  const refreshProject = useCallback(async (projectId) => {
    const updated = await fetchProjectById(projectId);
    setProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)));
    return updated;
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (!isAuthenticated) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') { setSearchOpen(false); setNewProjectOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !isSupabaseConfigured) {
      setProjectsLoading(false);
      setUserDataLoading(false);
      return undefined;
    }

    let cancelled = false;

    loadProjects()
      .catch((err) => {
        console.error('Erro ao carregar projetos:', err);
        if (!cancelled) push('Não foi possível carregar os projetos.', 'default');
      })
      .finally(() => {
        if (!cancelled) setProjectsLoading(false);
      });

    return () => { cancelled = true; };
  }, [isAuthenticated, isSupabaseConfigured, loadProjects]);

  useEffect(() => {
    if (!isAuthenticated || !isSupabaseConfigured || !userId) {
      setUserDataLoading(false);
      return undefined;
    }

    let cancelled = false;

    fetchTrilhaProgress(userId)
      .then((progress) => {
        if (!cancelled) {
          setCompleted(progress);
        }
      })
      .catch((err) => {
        console.error('Erro ao carregar dados do usuário:', err);
      })
      .finally(() => {
        if (!cancelled) setUserDataLoading(false);
      });

    return () => { cancelled = true; };
  }, [isAuthenticated, isSupabaseConfigured, userId]);

  const toggleTrilhaItem = async (projectId, trilhaItemId) => {
    if (!userId) return;
    const cur = completed[projectId] || [];
    const wasCompleted = cur.includes(trilhaItemId);
    setCompleted((c) => ({
      ...c,
      [projectId]: wasCompleted
        ? cur.filter((id) => id !== trilhaItemId)
        : [...cur, trilhaItemId],
    }));
    try {
      await toggleTrilhaProgress(userId, projectId, trilhaItemId);
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
      setCompleted((c) => ({
        ...c,
        [projectId]: wasCompleted ? [...cur, trilhaItemId] : cur.filter((id) => id !== trilhaItemId),
      }));
      push('Não foi possível salvar o progresso da trilha.', 'default');
    }
  };

  useEffect(() => {
    if (route.view === 'backoffice' && profile && !canManageBackOffice(profile)) {
      setRoute({ view: 'dashboard' });
    }
  }, [route.view, profile]);

  const currentProject = route.view === 'project' ? projects.find((p) => p.id === route.projectId) : null;

  const handleCreateProject = async (data) => {
    const baseId = slugify(data.name);
    let id = baseId || 'projeto';
    let n = 1;
    while (projects.some((p) => p.id === id)) { id = `${baseId}-${n++}`; }

    if (!isSupabaseConfigured) {
      push('Serviço indisponível. Entre em contato com o administrador.', 'default');
      return;
    }

    setProjectSaving(true);
    try {
      const newProject = await persistProject({ id, ...data });
      setProjects((prev) => [...prev, newProject]);
      setNewProjectOpen(false);
      push(`Projeto "${newProject.name}" criado com sucesso`, 'success');
      setRoute({ view: 'project', projectId: newProject.id, tab: 'overview' });
    } catch (err) {
      console.error('Erro ao salvar projeto:', err);
      push(
        err.message?.includes('row-level security')
          ? 'Sem permissão para salvar. Apenas admin e gestor podem gerenciar projetos.'
          : `Erro ao salvar projeto: ${err.message || 'tente novamente.'}`,
        'default',
      );
    } finally {
      setProjectSaving(false);
    }
  };

  const handleUpdateProject = async (project, data, onSuccess) => {
    if (!isSupabaseConfigured || projectSaving) return;

    setProjectSaving(true);
    try {
      const updated = await updateProject(project.id, data);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      push(`Projeto "${updated.name}" atualizado.`, 'success');
      onSuccess?.();
    } catch (err) {
      console.error('Erro ao atualizar projeto:', err);
      push(
        err.message?.includes('row-level security')
          ? 'Sem permissão para editar. Apenas admin e gestor podem gerenciar projetos.'
          : `Erro ao atualizar projeto: ${err.message || 'tente novamente.'}`,
        'default',
      );
    } finally {
      setProjectSaving(false);
    }
  };

  const handleDeleteProject = async (project, onSuccess) => {
    if (!isSupabaseConfigured || projectDeleting) return;

    setProjectDeleting(true);
    try {
      await deleteProject(project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      if (route.view === 'project' && route.projectId === project.id) {
        setRoute({ view: 'dashboard' });
      }
      push(`Projeto "${project.name}" excluído.`, 'success');
      onSuccess?.();
    } catch (err) {
      console.error('Erro ao excluir projeto:', err);
      push(
        err.message?.includes('row-level security')
          ? 'Sem permissão para excluir. Apenas admin e gestor podem gerenciar projetos.'
          : `Erro ao excluir projeto: ${err.message || 'tente novamente.'}`,
        'default',
      );
    } finally {
      setProjectDeleting(false);
    }
  };

  const handleLogout = async () => {
    push('Você saiu da sua conta.', 'success');
    setRoute({ view: 'dashboard' });
    setAuthView('login');
    setSearchOpen(false);
    setNewProjectOpen(false);
    setCompleted({});
    await signOut();
  };

  if (loading && !pendingRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-muted">
        <Loading />
      </div>
    );
  }

  if (pendingRecovery) {
    return (
      <>
        <ResetPasswordPage
          onComplete={completePasswordRecovery}
          isSupabaseConfigured={isSupabaseConfigured}
        />
        <ToastStack toasts={toasts} />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        {authView === 'login' ? (
          <LoginPage
            onSignIn={signIn}
            onResendConfirmation={resendConfirmation}
            onRequestPasswordReset={requestPasswordReset}
            onGoToSignup={() => setAuthView('signup')}
            isSupabaseConfigured={isSupabaseConfigured}
          />
        ) : (
          <SignupPage
            onSignUp={signUp}
            onResendConfirmation={resendConfirmation}
            onGoToLogin={() => setAuthView('login')}
            isSupabaseConfigured={isSupabaseConfigured}
          />
        )}
        <ToastStack toasts={toasts} />
      </>
    );
  }

  if (projectsLoading || userDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-muted">
        <Loading />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar route={route} setRoute={setRoute} projects={projects} profile={profile} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          route={route}
          setRoute={setRoute}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenNewProject={() => setNewProjectOpen(true)}
          onLogout={handleLogout}
          currentProject={currentProject}
          userName={userName}
          userAvatarUrl={profile?.avatarUrl}
        />
        <main className="flex-1 p-4 sm:p-5 lg:p-6 overflow-x-hidden">
          {route.view === 'dashboard' && (
            <Dashboard
              setRoute={setRoute}
              projects={projects}
              completed={completed}
              userName={userName}
            />
          )}
          {route.view === 'backoffice' && canManageBackOffice(profile) && (
            <BackOfficePage
              projects={projects}
              pushToast={push}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              projectSaving={projectSaving}
              projectDeleting={projectDeleting}
              canManageUsers={profile?.role === 'admin'}
            />
          )}
          {route.view === 'project' && currentProject && (
            <ProjectPage
              project={currentProject}
              route={route}
              setRoute={setRoute}
              completed={completed}
              toggleTrilhaItem={toggleTrilhaItem}
              pushToast={push}
              onRefreshProject={() => refreshProject(currentProject.id)}
              userId={userId}
            />
          )}
          {route.view === 'settings' && (
            <SettingsPage
              userId={userId}
              userEmail={userEmail}
              pushToast={push}
              onProfileUpdated={refreshProfile}
            />
          )}
          {route.view === 'profile' && (
            <ProfilePage userName={userName} profile={profile} completed={completed} projects={projects} />
          )}
        </main>
      </div>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} onPick={(r) => setRoute(r)} projects={projects} />
      {newProjectOpen && (
        <ProjectFormModal
          onSave={handleCreateProject}
          onClose={() => setNewProjectOpen(false)}
          saving={projectSaving}
        />
      )}
      <ToastStack toasts={toasts} />
    </div>
  );
}
