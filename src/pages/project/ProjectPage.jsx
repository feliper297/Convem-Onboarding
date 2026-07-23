import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../../data/navigation';
import ProgressBar from '../../components/ui/ProgressBar';
import Loading from '../../components/ui/Loading';
import ProjectOverview from './tabs/ProjectOverview';
import ProjectTrilha from './tabs/ProjectTrilha';
import ProjectGlossario from './tabs/ProjectGlossario';
import ProjectPessoas from './tabs/ProjectPessoas';
import ProjectStakeholders from './tabs/ProjectStakeholders';
import ProjectReunioes from './tabs/ProjectReunioes';
import ProjectFaq from './tabs/ProjectFaq';
import ProjectOperacao from './tabs/ProjectOperacao';
import ProjectDocs from './docs/ProjectDocs';
import DocsCategoryDetail from './docs/DocsCategoryDetail';
import {
  createDocument,
  deleteDocument,
} from '../../services/entityService';

function pct(n, d) { if (!d) return 0; return Math.round((n / d) * 100); }

function ProjectPage({
  project,
  route,
  setRoute,
  completed,
  toggleTrilhaItem,
  pushToast,
  onRefreshProject,
  userId,
}) {
  const [loading, setLoading] = useState(true);
  const [docsCategory, setDocsCategory] = useState(null);

  useEffect(() => {
    setLoading(true);
    setDocsCategory(null);
    const t = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(t);
  }, [route.tab, route.projectId]);

  useEffect(() => { setDocsCategory(null); }, [project.id]);

  const completedItems = completed[project.id] || [];
  const progress = pct(completedItems.length, project.trilha.length);
  const Icon = project.icon;

  const handleAddDoc = async (category, doc) => {
    const categoryId = project.docCategoryIds?.[category];
    if (!categoryId) throw new Error('Categoria não encontrada');
    await createDocument(project.id, categoryId, doc, userId);
    await onRefreshProject();
    pushToast(`Documento "${doc.title}" adicionado!`, 'success');
  };

  const handleDeleteDoc = async (_category, docId) => {
    try {
      await deleteDocument(docId);
      await onRefreshProject();
      pushToast('Documento removido.', 'default');
    } catch (err) {
      console.error(err);
      pushToast('Erro ao remover documento.', 'default');
    }
  };

  const onToggleTrilha = (trilhaItemId) => {
    const willComplete = !completedItems.includes(trilhaItemId);
    toggleTrilhaItem(project.id, trilhaItemId);
    if (willComplete) {
      const item = project.trilha.find((t) => t.id === trilhaItemId);
      pushToast(`"${item?.title || 'Item'}" concluído`, 'success');
    }
  };

  return (
    <div className="page-container">
      <div className="flex items-start sm:items-center gap-3 flex-col sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          <div
            className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 border"
            style={{ background: project.soft, borderColor: `${project.color}22` }}
          >
            <Icon size={19} color={project.color} />
          </div>
          <div className="min-w-0">
            <h1 className="page-title break-words">{project.name}</h1>
            <p className="text-xs text-ink-secondary break-words mt-0.5">{project.tagline}</p>
          </div>
        </div>
      </div>

      <div className="card-padded">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-ink-primary">Progresso da trilha</span>
          <span className="text-sm font-semibold tabular-nums" style={{ color: project.color }}>
            {progress}%
          </span>
        </div>
        <ProgressBar value={progress} color={project.color} height={6} />
      </div>

      <div className="flex gap-0.5 overflow-x-auto border-b border-border -mx-1 px-1">
        {NAV_ITEMS.map((n) => {
          const NIcon = n.icon;
          const active = (route.tab || 'overview') === n.id;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                setRoute({ view: 'project', projectId: project.id, tab: n.id });
                setDocsCategory(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors ${
                active
                  ? 'border-current'
                  : 'border-transparent text-ink-secondary hover:text-ink-primary'
              }`}
              style={active ? { color: project.color } : undefined}
            >
              <NIcon size={13} />
              {n.label}
            </button>
          );
        })}
      </div>
      <div>
        {loading ? <Loading /> : (
          <>
            {route.tab === 'overview' && <ProjectOverview project={project} />}
            {route.tab === 'trilha' && (
              <ProjectTrilha
                project={project}
                completedItems={completedItems}
                onToggle={onToggleTrilha}
              />
            )}
            {route.tab === 'docs' && (
              docsCategory ? (
                <DocsCategoryDetail
                  project={project}
                  category={docsCategory}
                  docs={project.docs[docsCategory] || []}
                  onBack={() => setDocsCategory(null)}
                  onAddDoc={handleAddDoc}
                  onDeleteDoc={handleDeleteDoc}
                />
              ) : (
                <ProjectDocs
                  project={project}
                  onViewCategory={setDocsCategory}
                  docsData={project.docs}
                  onAddDoc={handleAddDoc}
                />
              )
            )}
            {route.tab === 'glossario' && (
              <ProjectGlossario project={project} pushToast={pushToast} onRefresh={onRefreshProject} />
            )}
            {route.tab === 'pessoas' && (
              <ProjectPessoas project={project} pushToast={pushToast} onRefresh={onRefreshProject} />
            )}
            {route.tab === 'stakeholders' && (
              <ProjectStakeholders project={project} pushToast={pushToast} onRefresh={onRefreshProject} />
            )}
            {route.tab === 'reunioes' && (
              <ProjectReunioes project={project} pushToast={pushToast} onRefresh={onRefreshProject} />
            )}
            {route.tab === 'operacao' && (
              <ProjectOperacao project={project} pushToast={pushToast} onRefresh={onRefreshProject} />
            )}
            {route.tab === 'faq' && (
              <ProjectFaq project={project} pushToast={pushToast} onRefresh={onRefreshProject} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectPage;
