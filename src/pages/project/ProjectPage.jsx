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
  deleteDocumentsByCategory,
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
    try {
      const categoryId = project.docCategoryIds?.[category];
      if (!categoryId) throw new Error('Categoria não encontrada');
      await createDocument(project.id, categoryId, doc, userId);
      await onRefreshProject();
      pushToast(`Documento "${doc.title}" adicionado!`, 'success');
    } catch (err) {
      console.error(err);
      pushToast('Erro ao adicionar documento.', 'default');
    }
  };

  const handleDeleteCategoryDocs = async (category) => {
    try {
      const categoryId = project.docCategoryIds?.[category];
      if (!categoryId) throw new Error('Categoria não encontrada');
      await deleteDocumentsByCategory(categoryId);
      await onRefreshProject();
      pushToast(`Documentos de "${category}" removidos.`, 'default');
    } catch (err) {
      console.error(err);
      pushToast('Erro ao remover documentos.', 'default');
    }
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
    <div className="flex flex-col gap-5 max-w-[1180px]">
      <div className="flex items-start sm:items-center gap-3.5 flex-col sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: project.soft }}><Icon size={20} color={project.color} /></div>
          <div className="min-w-0">
            <h1 className="text-[19px] font-bold break-words" style={{ color: '#14171F', fontFamily: "'Space Grotesk', sans-serif" }}>{project.name}</h1>
            <p className="text-[12.5px] break-words" style={{ color: '#5B6472' }}>{project.tagline}</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl px-5 py-4 w-full" style={{ background: '#fff', border: '1px solid #E4E7EC' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-semibold" style={{ color: '#14171F' }}>Progresso da trilha</span>
          <span className="text-[13px] font-bold" style={{ color: project.color }}>{progress}%</span>
        </div>
        <ProgressBar value={progress} color={project.color} height={8} />
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1" style={{ borderBottom: '1px solid #E4E7EC' }}>
        {NAV_ITEMS.map((n) => {
          const NIcon = n.icon;
          const active = (route.tab || 'overview') === n.id;
          return (
            <button key={n.id} onClick={() => { setRoute({ view: 'project', projectId: project.id, tab: n.id }); setDocsCategory(null); }} className="flex items-center gap-1.5 px-3 py-2.5 text-[12.5px] font-semibold whitespace-nowrap transition-colors shrink-0" style={{ color: active ? project.color : '#5B6472', borderBottom: active ? `2px solid ${project.color}` : '2px solid transparent' }}>
              <NIcon size={13.5} /> {n.label}
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
                  onDeleteCategoryDocs={handleDeleteCategoryDocs}
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
