import React, { useState, useEffect } from 'react';
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
import NewProjectModal from './components/projects/NewProjectModal';
import { PROJECTS as SEED_PROJECTS } from './data/projects';
import { slugify, createProject } from './data/projectDefaults';

export default function App() {
  const { session, loading, signIn, signOut, userName, userInitials, isAuthenticated, isSupabaseConfigured } = useAuth();
  const [route, setRoute] = useState({ view: 'dashboard' });
  const [searchOpen, setSearchOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [projects, setProjects] = useState(() => [...SEED_PROJECTS]);
  const [favorites, setFavorites] = useState(['app-banking']);
  const [completed, setCompleted] = useState({ 'app-banking': [0] });
  const [docsRead, setDocsRead] = useState({});
  const { toasts, push } = useToasts();

  useEffect(() => {
    const onKey = (e) => {
      if (!isAuthenticated) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') { setSearchOpen(false); setNewProjectOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isAuthenticated]);

  const toggleFavorite = (id) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const toggleTrilhaItem = (projectId, idx) => setCompleted((c) => {
    const cur = c[projectId] || [];
    return { ...c, [projectId]: cur.includes(idx) ? cur.filter((i) => i !== idx) : [...cur, idx] };
  });
  const toggleDocsRead = (projectId) => setDocsRead((d) => ({ ...d, [projectId]: !d[projectId] }));
  const currentProject = route.view === 'project' ? projects.find((p) => p.id === route.projectId) : null;

  const handleCreateProject = (data) => {
    const baseId = slugify(data.name);
    let id = baseId || 'projeto';
    let n = 1;
    while (projects.some((p) => p.id === id)) { id = `${baseId}-${n++}`; }
    const newProject = createProject({ id, ...data });
    setProjects((prev) => [...prev, newProject]);
    setNewProjectOpen(false);
    push(`Projeto "${newProject.name}" criado com sucesso`, 'success');
    setRoute({ view: 'project', projectId: newProject.id, tab: 'overview' });
  };

  const handleLogout = async () => {
    push('Você saiu da sua conta.', 'success');
    setRoute({ view: 'dashboard' });
    setSearchOpen(false);
    setNewProjectOpen(false);
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F8FA' }}>
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onSignIn={signIn} isSupabaseConfigured={isSupabaseConfigured} />
        <ToastStack toasts={toasts} />
      </>
    );
  }

  return (
    <div className="flex w-full min-h-screen" style={{ background: '#F7F8FA', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #D6DAE2; border-radius: 8px; }
        button:focus-visible, a:focus-visible, input:focus-visible { outline: 2px solid #0E7C66; outline-offset: 2px; border-radius: 4px; }
      `}</style>
      <Sidebar route={route} setRoute={setRoute} projects={projects} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          route={route}
          setRoute={setRoute}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenNewProject={() => setNewProjectOpen(true)}
          onLogout={handleLogout}
          favorites={favorites}
          currentProject={currentProject}
          userInitials={userInitials}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {route.view === 'dashboard' && (
            <Dashboard
              setRoute={setRoute}
              projects={projects}
              completed={completed}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              userName={userName}
            />
          )}
          {route.view === 'project' && currentProject && (
            <ProjectPage
              project={currentProject}
              route={route}
              setRoute={setRoute}
              completed={completed}
              toggleTrilhaItem={toggleTrilhaItem}
              docsRead={docsRead}
              toggleDocsRead={toggleDocsRead}
              pushToast={push}
            />
          )}
          {route.view === 'settings' && <SettingsPage />}
          {route.view === 'profile' && (
            <ProfilePage userName={userName} completed={completed} projects={projects} />
          )}
        </main>
      </div>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} onPick={(r) => setRoute(r)} projects={projects} />
      {newProjectOpen && <NewProjectModal onSave={handleCreateProject} onClose={() => setNewProjectOpen(false)} />}
      <ToastStack toasts={toasts} />
    </div>
  );
}
